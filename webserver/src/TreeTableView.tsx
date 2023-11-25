import React from 'react';
// Thirdparty components
import Table from 'react-bootstrap/Table';
// Custom components
import TableView from './TableView';
// Custom functions
import { ProcessTreeNode } from './commonTypes';
import { recursiveGroupNodes } from './nodeGroupUtils';
// Custom hooks
import { useLeaderLine } from './useLeaderLine';
import { useTableCellFocus } from './useTableCellFocus';
import { usePrioritizedOrders } from './usePrioritizedOrders';

import './TreeTableView.scss';

export type TreeTableViewProps = {
  node: ProcessTreeNode;
}

const TreeTableView: React.FC<TreeTableViewProps> = ({
  node
}) => {
  
  
  // handle table cell focus & edit position
  const {
    focusPosition,
    setFocus,
    focusMode
  } = useTableCellFocus();

  // order columns with prioritization
  const {
		orderInfoDict,
    getOrderInfo,
    toggleOrder,
    recursiveSortNode
  } = usePrioritizedOrders();
  recursiveSortNode(node);
  
  // use table to show process tree groups
  const groupedNodes: ProcessTreeNode[][][] = [];
  recursiveGroupNodes({
    nodes: [node],
    irow: 0,
    icolumn: 0,
    array: groupedNodes
  });

  // draw arrows between parent-child processes
  useLeaderLine({
		rootNode: node,
		dependencies: [orderInfoDict]
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
						{/* column in row might be undefined, but should not be skipped... */}
            {[...Array(row.length).keys()].map((_, inodes) =>
							row[inodes] 
                ? <td key={inodes}>
										<TableView
											nodes={row[inodes]}
											focusPosition={focusPosition}
											setFocus={setFocus}
											focusMode={focusMode}
											orderInfoList={getOrderInfo(
												row[inodes][0].parent?.process_id,
												row[inodes][0].process_type
											)}
											toggleOrder={toggleOrder}
										/>
									</td>
								: <td></td>
							
            )}
          </tr>
        )}
      </tbody>
    </Table>
  );
};

export default TreeTableView;

