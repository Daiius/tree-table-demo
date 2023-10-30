import React from 'react';

import Table from 'react-bootstrap/Table';

import TableView from './TableView';

import { ProcessTreeNode } from './commonTypes';
import { recursiveGroupNodes } from './nodeGroupUtils';
import { useLeaderLine, Connection } from './useLeaderLine';

import './TreeTableView.scss';

export type TreeTableViewProps = {
  node: ProcessTreeNode;
}

const TreeTableView: React.FC<TreeTableViewProps> = ({
  node
}) => {

  const groupedNodes: ProcessTreeNode[][][] = [];
  recursiveGroupNodes({
    nodes: [node],
    irow: 0,
    icolumn: 0,
    array: groupedNodes
  });

  const connections: Connection[] = [];
  const recursiveAddConnection = (node: ProcessTreeNode) => {
    for (const child of node.children) {
      connections.push({
        from: `node-${node.process_id}`,
        to: `group-${node.process_id}`
      });
      recursiveAddConnection(child);
    }
  };
  recursiveAddConnection(node);

  useLeaderLine({
    connections
  });

  return (
    <Table
      id="tree-table-view-table"
      className="tree-table-view-table"
      responsive
    >
      <tbody>
        {groupedNodes.map((row, irow) =>
          <tr key={irow}>
            {row.map((nodes, inodes) =>
              <td key={inodes}>
                <div>
                  type: {nodes[0].process_type}
                </div>
                <div>
                  number of nodes: {nodes.length}
                </div>
                <TableView nodes={nodes} />
              </td>
            )}
          </tr>
        )}
      </tbody>
    </Table>
  );
};

export default TreeTableView;
