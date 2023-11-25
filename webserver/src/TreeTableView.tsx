import React, { useRef } from 'react';
// Thirdparty components
import Table from 'react-bootstrap/Table';
// Custom components
import TableView from './TableView';
// Custom functions
import { ProcessTreeNode } from './commonTypes';
import { recursiveGroupNodes } from './nodeGroupUtils';
// Custom hooks
//import { useLeaderLine } from './useLeaderLine';

import Arrow, { ArrowProps, Point } from './Arrow';

import { useTableCellFocus } from './useTableCellFocus';
import { usePrioritizedOrders } from './usePrioritizedOrders';

import './TreeTableView.scss';

export type TreeTableViewProps = {
  node: ProcessTreeNode;
}

const TreeTableView: React.FC<TreeTableViewProps> = ({
  node
}) => {
 
  const refTable = useRef<HTMLTableElement|null>(null);
  
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
  //useLeaderLine({
	//	rootNode: node,
	//	dependencies: [orderInfoDict]
	//});

  if (refTable == null) return <div>Rendering...</div>;
 
  const connections: {[key: string]: ArrowProps} = {};
  const recursiveAddConnections = (node: ProcessTreeNode) => {
    for (const child of node.children) {
      const fromId = `node-${node.process_id}`;
      const toId = `group-${node.process_id}`;

      const fromElement = document.getElementById(fromId);
      const toElement = document.getElementById(toId);
      if (fromElement == null || toElement == null || refTable.current == null) continue;

      const refTableRect = refTable.current.getBoundingClientRect();
      const fromRect = fromElement.getBoundingClientRect();
      const toRect = toElement.getBoundingClientRect();

      const from: Point = {
        x: fromRect.right - refTableRect.left,
        y: fromRect.top - refTableRect.top + fromRect.height / 2
      };
      const to: Point = {
        x: toRect.left - refTableRect.left,
        y: toRect.top - refTableRect.top + toRect.height / 2
      };

      connections[`${fromId};${toId}`] = { from, to };

      recursiveAddConnections(child);
    }
  };
  recursiveAddConnections(node);

  return (
    <div
      style={{overflowX: "auto"}}
    >
    <div
      ref={refTable}
      style={{position: "relative"}}
    >
    <Table
      id="tree-table-view-table"
      className="tree-table-view-table"
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
    {Object.entries(connections).map(([key, arrowProps]) =>
      <Arrow key={key} {...arrowProps} />
    )}
    </div>
    </div>
  );
};

export default TreeTableView;

