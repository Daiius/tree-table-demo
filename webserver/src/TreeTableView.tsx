import React from 'react';

import Table from 'react-bootstrap/Table';

import TableView from './TableView';

import { ProcessTreeNode } from './commonTypes';
import { recursiveGroupNodes } from './nodeGroupUtils';
import { useLeaderLine } from './useLeaderLine';
import { useTableCellFocus } from './useTableCellFocus';

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

  useLeaderLine({rootNode: node});

  const {
    focusPosition,
    setFocus
  } = useTableCellFocus();

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
                <TableView
                  nodes={nodes}
                  focusPosition={focusPosition}
                  setFocus={setFocus}
                />
              </td>
            )}
          </tr>
        )}
      </tbody>
    </Table>
  );
};

export default TreeTableView;

