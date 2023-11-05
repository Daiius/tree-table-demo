import { useState, useEffect } from 'react';

export type TablePosition = {
  commonParentId: string;
  commonProcessType: string;
}

export type CellPosition = {
  rowNodeId: string;
  columnName: string;
}

export type FocusMode = "Focused" | "Editing";

export type FocusPosition = TablePosition & CellPosition;

export type FocusInfo = FocusPosition & FocusMode;

export type SetFocusArgs = TablePosition & CellPosition & {
  rowNodeIds: string[];
  columnNames: string[];
  focusMode: FocusMode;
}

export type MoveFocusArgs = {
  drow: number;
  dcolumn: number;
}

export type UseTableCellFocusHookResult = {
  focusPosition: FocusPosition|undefined;
  focusMode: FocusMode;
  setFocus: (args: SetFocusArgs) => void;
  moveFocus: (args: MoveFocusArgs) => void;
};


export const useTableCellFocus = (): UseTableCellFocusHookResult => {
  const [focusPosition, setFocusPosition] = useState<FocusPosition|undefined>();
  const [rowNodeIds, setRowNodeIds] = useState<string[]>([]);
  const [columnNames, setColumnNames] = useState<string[]>([]);
  const [focusMode, setFocusMode] = useState<FocusMode>("Focused");
  
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

    // Cell focus mode, moving cells by keys
    const handleKeyDownFocus = (e: KeyboardEvent) => {
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
          // eslint-disable-next-line no-fallthrough
        case 'ArrowRight':
          moveFocus({ drow:  0, dcolumn:  1 });
          break;
        case e.shiftKey && 'Tab':
          e.preventDefault();
          // eslint-disable-next-line no-fallthrough
        case 'ArrowLeft':
          moveFocus({ drow:  0, dcolumn: -1 });
          break;
        case 'Escape':
          defocus();
          break;
        case 'AltLeft':
        case 'AltRight':
        case 'ControlLeft':
        case 'ControlRight':
        case 'ShiftLeft':
        case 'ShiftRight':
        case 'Backquote':
          // do nothing
          break;
        default:
          setFocus({
            ...focusPosition,
            rowNodeIds,
            columnNames,
            focusMode: "Editing"
          });
          break;
      }
    };

    const handleKeyDownEdit = (e: KeyboardEvent) => {
      if (focusPosition== null) return;
      const key = e.code;
      switch (key) {
        case e.shiftKey && 'Enter':
        //case 'ArrowUp':
          moveFocus({ drow: -1, dcolumn:  0 });
          break;
        case e.keyCode !== 229 && !e.shiftKey && 'Enter':
        // NOTE: avoiding IME complete enter key handling
        //case 'ArrowDown':
          moveFocus({ drow:  1, dcolumn:  0 });
          break;
        case !e.shiftKey && 'Tab':
          e.preventDefault();
          moveFocus({ drow:  0, dcolumn:  1 });
          break;
        case e.shiftKey && 'Tab':
          e.preventDefault();
          moveFocus({ drow:  0, dcolumn: -1 });
          break;
        case 'Escape':
          setFocus({
            ...focusPosition,
            rowNodeIds,
            columnNames,
            focusMode: "Focused"
          });
          break;
      }
    };

    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (focusPosition == null) return;
      switch (focusMode) {
        case "Focused":
          handleKeyDownFocus(e);
          break;
        case "Editing":
          handleKeyDownEdit(e);
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
    columnNames,
    focusMode
  }: SetFocusArgs) => {
    setFocusPosition({
      commonParentId,
      commonProcessType,
      rowNodeId,
      columnName,
    });
    setRowNodeIds([...rowNodeIds]);
    setColumnNames([...columnNames]);
    setFocusMode(focusMode);
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
      // currently do nothing
      // TODO:
      // want to go back to parent process
      // need to add process tree information
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
        columnName: columnNames[icolumn + dcolumn],
      });
    }

    setFocusMode("Focused");
  };

  const defocus = () => setFocusPosition(undefined);

  return {
    focusPosition,
    focusMode,
    setFocus,
    moveFocus,
  };
};
