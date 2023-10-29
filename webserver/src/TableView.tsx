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
      <thead>
        <tr>
          {conditionNames.map((name, iname) =>
            <th key={iname}>{name}</th>
          )}
        </tr>
      </thead>
      <tbody>
        {nodes.map((node, inode) =>
          <tr key={inode}>
            {conditionNames.map((name, iname) =>
              <td key={iname}>{node.conditions[name]}</td>
            )}
          </tr>
        )}
      </tbody>
    </Table>
  );
};

export default TableView;

