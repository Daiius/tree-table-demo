import React, { useState } from 'react';

import Form from 'react-bootstrap/Form';

import { FocusMode } from './useTableCellFocus';

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

  const [value, setValue] = useState<string>(initialValue);

  return (
    <td
      className={
        focused
        ? "tableview-cell-focused"
        : "tableview-cell"
      }
      onClick={onClick}
    >
      {focusMode === "Editing" && focused
        ? <Form.Control
            autoFocus
            size="sm"
            value={value}
            onChange={(e)=>setValue(e.target.value)}
          />
        : <div>{value}</div>
      }
    </td>
  );
};

export default SmartCell;
