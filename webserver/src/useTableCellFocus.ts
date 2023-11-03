import { useState, useEffect } from 'react';

export type TablePosition = {
  commonParentId: string;
  commonProcessType: string;
}

export type CellPosition = {
  rowNodeId: string;
  columnName: string;
}

export type FocusPosition = TablePosition & CellPosition;

export type SetFocusArgs = TablePosition & CellPosition & {
  rowNodeIds: string[];
  columnNames: string[];
}

export type MoveFocusArgs = {
  drow: number;
  dcolumn: number;
}

export type UseTableCellFocusHookResult = {
  focusPosition: FocusPosition|undefined;
  setFocus: (args: SetFocusArgs) => void;
  moveFocus: (args: MoveFocusArgs) => void;
};


export const useTableCellFocus = (): UseTableCellFocusHookResult => {
  const [focusPosition, setFocusPosition] = useState<FocusPosition|undefined>();
  const [rowNodeIds, setRowNodeIds] = useState<string[]>([]);
  const [columnNames, setColumnNames] = useState<string[]>([]);
  
  // table cell, HTML <td> element, is usually not focusable.
  // focus is required to get key events.
  // mainly to ways to handle key events without
  // default focusable elements (<a> <input> <textarea> <button> <select> <details>).
  // 1. useRef and element.focus() to force set focus to some (usually root) element
  // 2. document.addEventListener
  //
  // approach 1. seems to be a little complicated (many useEffect related to focus)
  // (https://github.com/iddan/react-spreadsheet)
  //
  // going to use approach 2...
  useEffect(() => {
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (focusPosition == null) return;

      const key = e.code;
      switch (key) {
        case e.shiftKey && 'Enter':
        case 'ArrowUp':
          moveFocus({ drow: -1, dcolumn:  0 });
          break;
        case !e.shiftKey && 'Enter':
        case 'ArrowDown':
          moveFocus({ drow:  1, dcolumn:  0 });
          break;
        case !e.shiftKey && 'Tab':
          e.preventDefault();
        case 'ArrowRight':
          moveFocus({ drow:  0, dcolumn:  1 });
          break;
        case e.shiftKey && 'Tab':
          e.preventDefault();
        case 'ArrowLeft':
          moveFocus({ drow:  0, dcolumn: -1 });
          break;
        case 'Escape':
          defocus();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  });

  const setFocus = ({
    commonParentId,
    commonProcessType,
    rowNodeId,
    columnName,
    rowNodeIds,
    columnNames
  }: SetFocusArgs) => {
    setFocusPosition({
      commonParentId,
      commonProcessType,
      rowNodeId,
      columnName
    });
    setRowNodeIds([...rowNodeIds]);
    setColumnNames([...columnNames]);
  };

  const moveFocus = ({ drow, dcolumn}: MoveFocusArgs) => {
    if (focusPosition == null) return;
    const nrow = rowNodeIds.length;
    const ncolumn = columnNames.length;
    const irow = rowNodeIds.indexOf(focusPosition.rowNodeId);
    const icolumn = columnNames.indexOf(focusPosition.columnName);
    if (irow == -1 || icolumn == -1) return;
  
    // TODO not exhaustive!
    if (
      irow == nrow - 1 && drow == 1
    ) {
      // at the last row and going to next row
      // do nothing
    } else if (
      irow == 0 && drow == -1
    ) {
      // at the first row and going to previous row
      // do nothing
    } else if (
      icolumn == 0 && dcolumn == -1 && irow > 0
    ) {
      // at the first column and going to previous column
      // going to previous row, last column
      setFocusPosition({
        ...focusPosition,
        rowNodeId: rowNodeIds[irow - 1],
        columnName: columnNames[ncolumn - 1]
      });
    } else if (
      icolumn == 0 && dcolumn == -1 && irow === 0
    ) {
      // do nothing
    } else if (
      icolumn == ncolumn - 1 && dcolumn == 1 && irow < nrow - 1
    ) {
      // at the last column and going to next column
      // going to next row, fist column
      setFocusPosition({
        ...focusPosition,
        rowNodeId: rowNodeIds[irow + 1],
        columnName: columnNames[0]
      });
    } else if (
      icolumn == ncolumn - 1 && dcolumn == 1 && irow == nrow -1
    ) {
      // do nothing
    } else {
      setFocusPosition({
        ...focusPosition,
        rowNodeId: rowNodeIds[irow + drow],
        columnName: columnNames[icolumn + dcolumn]
      });
    }
  };

  const defocus = () => setFocusPosition(undefined);

  return {
    focusPosition,
    setFocus,
    moveFocus,
  };
};
