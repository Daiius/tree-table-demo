import { useState } from 'react';

export type CellFocusInfo = {
  commonParentId: string;
  commonProcessType: string;
  irow: number;
  icolumn: number;
}

export type SetCellFocusArgs = {
  commonParentId: string|undefined;
  commonProcessType: string|undefined;
  nrow: number;
  ncolumn: number;
  irow: number;
  icolumn: number;
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
  const [nrow, setNRow] = useState<number>(0);
  const [ncolumn, setNColumn] = useState<number>(0);
  const [irow, setIRow] = useState<number>(0);
  const [icolumn, setIColumn] = useState<number>(0);

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
