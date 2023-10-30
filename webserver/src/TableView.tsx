import React from 'react';

import Table from 'react-bootstrap/Table';

import { ProcessTreeNode } from './commonTypes';

import './TableView.scss';

export type TableViewProps = {
  nodes: ProcessTreeNode[];
}

const TableView: React.FC<TableViewProps> = ({
  nodes
}) => {
 

  const conditionNames =
    Object.keys(nodes[0].conditions)
    .filter(name => name !== "process_id");

  return (
    <Table
      className="table-view-main-table"
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
              <td key={name}>
                {node.conditions[name]}
              </td>
            )}
          </tr>
        )}
      </tbody>
    </Table>
  );
};

export default TableView;

