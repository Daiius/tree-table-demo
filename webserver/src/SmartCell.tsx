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
  const [lastValue, setLastValue] = useState<string>(initialValue);

  const [lastFocusMode, setLastFocusMode] = useState<FocusMode>("Focused");
  
  const update = () => console.log(
    `(${processType},${nodeId},${columnName} : ${lastValue} -> ${value}`
  );

  //if (lastFocusMode === "Editing" && focusMode === "Focused") {
  //  if (lastValue !== value) update();
  //  setLastFocusMode("Focused");
  //  setLastValue(value);
  //} else {
  //  setLastFocusMode(focusMode);
  //}

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
