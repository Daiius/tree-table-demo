import React from 'react';

import SmartCell from './SmartCell';

import { ProcessTreeNode } from 'commonTypes';
import {
  FocusMode,
  FocusPosition,
  SetFocusArgs,
} from './useTableCellFocus';

import { useContextMenuDispatcher } from './useContextMenu';

export type SmartRowProps = {
  node: ProcessTreeNode;
  focusPosition: FocusPosition|undefined;
  focusMode: FocusMode;
  columnNames: string[];
  onClick: (columnName: string) => void;
};

const SmartRow: React.FC<SmartRowProps> = ({
  node,
  focusPosition,
  focusMode,
  columnNames,
  onClick,
}) => {
  
  
  const checkIsCellFocused = (node: ProcessTreeNode, columnName: string) => {
    return ((node.parent?.process_id ?? "undefined") === focusPosition?.commonParentId)
        && (node.process_type === focusPosition?.commonProcessType)
        && (node.process_id === focusPosition?.rowNodeId)
        && (columnName === focusPosition?.columnName);
  };

  const { onContextMenu } = useContextMenuDispatcher();
  
  return (
    <tr
      id={`node-${node.process_id}`}
      onContextMenu={e => {
        e.preventDefault()
        onContextMenu({
          clientX: e.clientX, clientY: e.clientY,
          rowId: node.process_id
        });
      }}
    >
      {columnNames.map(name =>
        <SmartCell
          key={name}
          processType={node.process_type}
          nodeId={node.process_id}
          columnName={name}
          initialValue={
            node.conditions[name] ?? node.evaluations[name]?.[name]
          }
          focused={checkIsCellFocused(node, name)}
          focusMode={focusMode}
          onClick={()=>onClick(name)}
        />
      )}
    </tr>
  );
};

export default SmartRow;

