import React from 'react';

import Form from 'react-bootstrap/Form';
import Table from 'react-bootstrap/Table';


import { ProcessTreeNode } from './commonTypes';
import {
  FocusPosition,
  FocusMode,
  SetFocusArgs
} from './useTableCellFocus';

import './TableView.scss';

export type TableViewProps = {
  nodes: ProcessTreeNode[];
  focusPosition: FocusPosition|undefined;
  focusMode: FocusMode;
  setFocus: (args: SetFocusArgs) => void;
}

const TableView: React.FC<TableViewProps> = ({
  nodes,
  focusPosition,
  focusMode,
  setFocus,
}) => {

  const conditionNames =
    Object.keys(nodes[0].conditions)
    .filter(name => name !== "process_id");

  const checkIsCellFocused = (node: ProcessTreeNode, columnName: string) => {
    return ((node.parent?.process_id ?? "undefined") === focusPosition?.commonParentId)
        && (node.process_type === focusPosition?.commonProcessType)
        && (node.process_id === focusPosition?.rowNodeId)
        && (columnName === focusPosition?.columnName);
  };

  const isSameAsLastFocus = (node: ProcessTreeNode, columnName: string): boolean => {
    return (
         (focusPosition?.commonParentId ?? "undefined") === (node.parent?.process_id ?? "undefined")
      && focusPosition?.commonProcessType === node.process_type
      && focusPosition?.rowNodeId === node.process_id
      && focusPosition?.columnName === columnName
    );
  };

  return (
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
          {conditionNames.map(name =>
            <th key={name}>{name}</th>
          )}
        </tr>
      </thead>
      <tbody>
        {nodes.map(node =>
          <tr
            key={node.process_id}
            id={`node-${node.process_id}`}
          >
            {conditionNames.map(name =>
              <td
                className={
                  checkIsCellFocused(node, name)
                  ? "tableview-cell-focused"
                  : "tableview-cell"
                }
                key={name}
                onClick={()=>setFocus({
                  commonParentId: nodes[0].parent?.process_id ?? "undefined",
                  commonProcessType: nodes[0].process_type,
                  rowNodeId: node.process_id,
                  columnName: name,
                  rowNodeIds: nodes.map(node => node.process_id),
                  columnNames: conditionNames,
                  focusMode: isSameAsLastFocus(node, name) ? "Editing" : "Focused"
                })}
              >
                {focusMode === "Editing" && checkIsCellFocused(node, name)
                  ? <Form.Control
                      size="sm"
                      value={node.conditions[name]} 
                    />
                  : <div>{node.conditions[name]}</div>
                }
              </td>
            )}
          </tr>
        )}
      </tbody>
    </Table>
  );
};

export default TableView;

