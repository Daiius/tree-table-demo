import React from 'react';

import {
  useTableCellFocus as useTableCellFocusCore,
  FocusMode,
  FocusPosition,
  SetFocusArgs,
  MoveFocusArgs,
} from 'useTableCellFocus';

export type UseTableCellFocus = {
  focusPosition: FocusPosition|undefined;
  focusMode: FocusMode;
};
const TableCellFocusContext =
  React.createContext<UseTableCellFocus|undefined>(undefined);

export type UseTableCellFocusDispatcher = {
  setFocus: (args: SetFocusArgs) => void;
  moveFocus: (args: MoveFocusArgs) => void;
};
const TableCellFocusDispatcherContext =
  React.createContext<UseTableCellFocusDispatcher|undefined>(undefined);

export const useTableCellFocus = () => React.useContext(TableCellFocusContext)
  ?? (() => { throw new Error("useTableCellFocus() is called outside of the context!"); })();

export const useTableCellFocusDispatcher = () => React.useContext(TableCellFocusDispatcherContext)
  ?? (() => { throw new Error("useTableCellFocusDispatcher() is called outside of the context");})();

export const TableCellFocusProvider: React.FC<React.PropsWithChildren> = ({
  children
}) => {
  const {
    focusPosition,
    focusMode,
    setFocus,
    moveFocus,
  } = useTableCellFocusCore();

  return (
    <TableCellFocusContext.Provider
      value={{ focusPosition, focusMode }}
    >
      <TableCellFocusDispatcherContext.Provider
        value={{ setFocus, moveFocus }}
      >
        {children}
      </TableCellFocusDispatcherContext.Provider>
    </TableCellFocusContext.Provider>
  );
};

