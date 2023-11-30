import React, { useRef } from 'react';
// Thirdparty components
import Table from 'react-bootstrap/Table';
// Custom components
import TableView from './TableView';
// Custom functions
import { ProcessTreeNode } from './commonTypes';
import { recursiveGroupNodes } from './nodeGroupUtils';

import Arrow, { ArrowProps, Point } from './Arrow';
import { useArrows } from './useArrows';

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

  if (refTable == null) return <div>Rendering...</div>;
 
  const { connections } = useArrows({
    node,
    container: refTable.current,
    orderInfoDict
  });

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

