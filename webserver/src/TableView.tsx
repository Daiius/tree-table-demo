import React, { useState, useRef } from 'react';

import Card from 'react-bootstrap/Card';
import Table from 'react-bootstrap/Table';
import Stack from 'react-bootstrap/Stack';
import Dropdown from 'react-bootstrap/Dropdown';

import SmartRow from './SmartRow';
import PrioritizedOrderMark from './PrioritizedOrderMark';


import { ProcessTreeNode } from './commonTypes';
import {
  FocusPosition,
  FocusMode,
  SetFocusArgs
} from './useTableCellFocus';
import {
  OrderInfo,
  ToggleOrderArgs
} from './usePrioritizedOrders';

import { useTableCellFocusDispatcher } from './useTableCellFocus';

import './TableView.scss';

export type TableViewProps = {
  nodes: ProcessTreeNode[];
  orderInfoList?: OrderInfo[];
  toggleOrder: (args: ToggleOrderArgs) => void;
}

const TableView: React.FC<TableViewProps> = ({
  nodes,
  orderInfoList,
  toggleOrder
}) => {
  

  const columnNames = [
    ...Object.keys(nodes[0].conditions),
    ...[...new Set(
      nodes.flatMap(node => Object.keys(node.evaluations))
    )],
  ].filter(name => name !== "process_id");

  const { setFocus } = useTableCellFocusDispatcher();

  return (
    <Card>
      <Card.Header>{nodes[0].process_type} x {nodes.length}</Card.Header>
      <Card.Body>
        <Table
          className="tableview-main-table"
          bordered
          striped
          hover
          size="sm"
        >
          <thead
            id={`group-${nodes[0].parent?.process_id}`}
          >
            <tr>
              {columnNames.map(name =>
                <th
                  key={name}
                  onClick={()=>toggleOrder({
                    commonParentId: nodes[0].parent?.process_id,
                    commonProcessType: nodes[0].process_type,
                    columnName: name
                  })}
                >
                  <Stack direction="horizontal">
                    {name}
                    <PrioritizedOrderMark
                      orderInfo={orderInfoList?.find(orderInfo => orderInfo.columnName === name)}
                      priority={orderInfoList?.findIndex(orderInfo => orderInfo.columnName === name)}
                    />
                  </Stack>
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {nodes.map(node =>
              <SmartRow
                key={node.process_id}
                node={node}
                columnNames={columnNames}
                onClick={columnName => setFocus({
                  columnName,
                  columnNames,
                  commonParentId: node.parent?.process_id ?? "undefined",
                  commonProcessType: node.process_type,
                  rowNodeId: node.process_id,
                  rowNodeIds: nodes.map(node => node.process_id),
                })}
              />
            )}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );
};

export default TableView;

