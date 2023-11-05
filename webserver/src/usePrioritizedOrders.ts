import { useState } from 'react';

import { ProcessTreeNode } from './commonTypes';

export type OrderType = "Ascending" | "Descending"

export type OrderInfo = {
  columnName: string;
  orderType: OrderType;
}

export type OrderInfoDict = {
  [commonParentIdAndCommonProcessType: string]: OrderInfo[]
}

export type ToggleOrderArgs = {
  commonParentId: string|undefined;
  commonProcessType: string;
  columnName: string;
};

export type UsePrioritizedOrdersHookResult = {
  getOrderInfo: (commonParentId: string|undefined, commonProcessType: string) => OrderInfo[];
  toggleOrder: (args: ToggleOrderArgs) => void;
  recursiveSortNode: (node: ProcessTreeNode) => void;
}

const combineIdAndType = (
  commonParentId: string|undefined,
  commonProcessType: string
) => `${commonParentId}-${commonProcessType}`;

export const usePrioritizedOrders = (): UsePrioritizedOrdersHookResult => {
  const [orderInfoDict, setOrderInfoDict] = useState<OrderInfoDict>({});

  const getOrderInfo = (commonParentId: string|undefined, commonProcessType: string) => {
    const key = combineIdAndType(commonParentId, commonProcessType);
    return orderInfoDict[key];
  };

  const toggleOrder = ({
    commonParentId,
    commonProcessType,
    columnName
  }: ToggleOrderArgs) => {
    // NOTE : modifies orderInfoDict... should be copied...
    const key = combineIdAndType(commonParentId, commonProcessType);
    let orderInfoList: OrderInfo[] | undefined = orderInfoDict[key];
    if (orderInfoList == null) {
      // First entry for given key
      orderInfoDict[key] = [{columnName, orderType: "Ascending"}];
    } else {
      // orderInfoDict has orderInfo list for given key.
      const target = orderInfoList.find(orderInfo => orderInfo.columnName === columnName);
      if (target == null) {
        // add order list
        orderInfoList.push({ columnName, orderType: "Ascending"});
      } else {
        // toggle order type or remove
        switch (target.orderType) {
          case "Ascending":
            target.orderType = "Descending"
            break;
          case "Descending":
            orderInfoList = orderInfoList.filter(orderInfo => orderInfo.columnName !== columnName);
            break;
        }
      }
    }
    setOrderInfoDict({ ...orderInfoDict });
  };
  // NOTE: modifies argument: node
  const recursiveSortNode = (node: ProcessTreeNode) => {
    // list up types of child nodes
    const types = [...new Set(node.children.map(child => child.process_type))];
    const sortedChildren: ProcessTreeNode[] = [];
    for (const type of types) {
      const targetChildren = node.children.filter(child => child.process_type === type);
      const orderInfoList = getOrderInfo(node.process_id, type);
      if (orderInfoList == null) {
        sortedChildren.push(...targetChildren);
        continue;
      }
      // applying sort according to orderInfoList
      // NOTE: reverse() and sort() gives intended result.
      orderInfoList.reverse();
      for (const orderInfo of orderInfoList) {
        // TODO : consider add type information to JSON...
        // check column values are number or string
        const isNumberColumn = node.children.map(child =>
          child.conditions[orderInfo.columnName]
        ).every(value => !isNaN(Number(value)));
        
        if (isNumberColumn) {
          targetChildren.sort((a, b) =>
            Number(a.conditions[orderInfo.columnName]) - Number(b.conditions[orderInfo.columnName])
          );
        } else {
          targetChildren.sort((a, b) =>
            a.conditions[orderInfo.columnName]?.localeCompare(b.conditions[orderInfo.columnName])
          );
        }
      }
      sortedChildren.push(...targetChildren);
    }
    node.children = sortedChildren;
  };

  return {
    getOrderInfo,
    toggleOrder,
    recursiveSortNode
  }
};

