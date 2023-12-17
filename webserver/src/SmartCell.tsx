import React from 'react';

import Form from 'react-bootstrap/Form';
import Stack from 'react-bootstrap/Stack';

import SyncStatusMark from './SyncStatusMark';

import { FocusMode } from './useTableCellFocus';
import { useAutoSyncCell } from './useAutoSyncCell';

export type SmartCellProps = {
  processType: string;
  nodeId: string;
  columnName: string;
  initialValue: string;
  focused: boolean;
  focusMode: FocusMode;
  onClick: () => void;
}

const SmartCell: React.FC<SmartCellProps> = ({
  processType,
  nodeId,
  columnName,
  initialValue,
  focused,
  focusMode,
  onClick
}) => {

  const {
    value,
    setValue,
    status,
    errorMessage
  } = useAutoSyncCell({
    processType,
    nodeId,
    columnName,
    initialValue,
    focusMode
  });

  return (
    <td
      className={
        focused
        ? "tableview-cell-focused"
        : "tableview-cell"
      }
      onClick={onClick}
    >
      <Stack direction="horizontal">
        {focusMode === "Editing" && focused
          ? <Form.Control
              autoFocus
              size="sm"
              value={value}
              onChange={(e)=>setValue(e.target.value)}
            />
          : <div>{value}</div>
        }
        <SyncStatusMark
          syncStatus={status}
          errorMessage={errorMessage}
        />
      </Stack>
    </td>
  );
};

export default SmartCell;
