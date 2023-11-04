import { useState } from 'react';

export type OrderType = "Ascending" | "Descending"

export type OrderInfo = {
  columnName: string;
  orderType: OrderType;
}

export type OrderInfoDict = {
  [commonParentIdAndCommonProcessType: string]: OrderInfo[]
}

export type ToggleOrderArgs = {
  commonParentId: string;
  commonProcessType: string;
  columnName: string;
};

export type UsePrioritizedOrdersHookResult = {
  getOrderInfo: (commonParentId: string, commonProcessType: string) => OrderInfo[];
  toggleOrder: (args: ToggleOrderArgs) => void;
}

const combineIdAndType = (
  commonParentId: string,
  commonProcessType: string
) => `${commonParentId}-${commonProcessType}`;

export const usePrioritizedOrders = (): UsePrioritizedOrdersHookResult => {
  const [orderInfoDict, setOrderInfoDict] = useState<OrderInfoDict>({});

  const getOrderInfo = (commonParentId: string, commonProcessType: string) => {
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

  return {
    getOrderInfo,
    toggleOrder
  }
};

