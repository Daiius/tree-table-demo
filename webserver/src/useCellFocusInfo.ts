import { useState } from 'react';

export type CellFocusInfo = {
  commonParentId: string;
  commonProcessType: string;
  rowId: string;
  columnName: string;
}

export type SetCellFocusArgs = {
  commonParentId: string;
  commonProcessType: string;
  rowId: string;
  columnName: string;
  rowIds: string[];
  columnNames: string[];
}

export type MoveCellFocusArgs = {
  drow: number;
  dcolumn: number;
}

export type UseCellFocusInfoResult = {
  cellFocusInfo: CellFocusInfo;
  setCellFocus: (args: SetCellFocusArgs) => void;
  moveCellFocus: (args: MoveCellFocusArgs) => void;
}

export const useCellFocusInfo = () => {
  const [commonParentId, setCommonParentId] = useState<string>();
  const [commonProcessType, setCommonProcessType] = useState<string>();
  const [rowId, setRowId] = useState<string>();
  const [columnName, setColumnName] = useState<string>();
  const [rowIds, setRowIds] = useState<string[]>([]);
  const [columnNames, setColumnNames] = useState<string[]>([]);

  const setCellFocus = ({
    commonParentId,
    commonProcessType,
    nrow,
    ncolumn,
    irow,
    icolumn
  }: SetCellFocusArgs) => {
    setCommonParentId(commonParentId);
    setCommonProcessType(commonProcessType);
    setNRow(nrow);
    setNColumn(ncolumn);
    setIRow(irow);
    setIColumn(icolumn);
  };

  // TODO : testing
  const moveCellFocus = ({
    drow,
    dcolumn
  }: MoveCellFocusArgs) => {
    if (irow < nrow) setNRow(prev => prev + drow);
    if (icolumn < ncolumn) setNColumn(prev => prev + dcolumn);
  };

  const cellFocusInfo = {
    commonParentId,
    commonProcessType,
    irow,
    icolumn
  };

  return {
    cellFocusInfo,
    setCellFocus,
    moveCellFocus
  };
};
