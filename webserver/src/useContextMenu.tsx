import React, {
  createContext,
  useContext,
  useRef,
  useState,
} from 'react';

type Position = {
  left: number;
  top: number;
};

export type UseContextMenu = {
  show: boolean;
  position: Position;
  rowId: string;
};
const ContextMenuContext =
  createContext<UseContextMenu|undefined>(undefined);

export type OnContextMenuArgs = {
  clientX: number;
  clientY: number;
  rowId: string;
};

export type UseContextMenuDispatcher = {
  onContextMenu: (args: OnContextMenuArgs) => void;
  onHide: () => void;
  setContainer: (c: HTMLElement) => void;
};
const ContextMenuDispatcherContext =
  createContext<UseContextMenuDispatcher|undefined>(undefined);

const useContextMenuCore = (): UseContextMenu & UseContextMenuDispatcher => {
  const [show, setShow] = useState<boolean>(false);
  const [position, setPosition] = useState<Position>({
    left: 0, top: 0,
  })
  const [rowId, setRowId] = useState<string>("");

  const refContainer = useRef<HTMLElement|undefined>();

  const setContainer = (c: HTMLElement) => refContainer.current = c;

  const onContextMenu = ({
    clientX,
    clientY,
    rowId,
  }: OnContextMenuArgs) => {
    setShow(true);
    setRowId(rowId);
    if (refContainer.current == null) return;
    const containerBR = refContainer.current.getBoundingClientRect();
    setPosition({
      left: clientX - containerBR.left,
      top: clientY - containerBR.top,
    });
  };

  const onHide = () => {
    setShow(false);
    setRowId("");
    setPosition({ left: 0, top: 0 });
  };

  return {
    show,
    position,
    rowId,
    setContainer,
    onContextMenu,
    onHide,
  };
};

export const useContextMenu = () => useContext(ContextMenuContext)
  ?? (() => { throw new Error("useContextMenu is called outside of the context!"); })();
export const useContextMenuDispatcher = () => useContext(ContextMenuDispatcherContext)
  ?? (() => { throw new Error("useCOntextMenuDispatcher is called outside of the context!"); })();

export const ContextMenuProvider: React.FC<React.PropsWithChildren> = ({
  children
}) => {

  const {
    show,
    position,
    rowId,
    setContainer,
    onContextMenu,
    onHide,
  } = useContextMenuCore();

  return (
    <ContextMenuContext.Provider
      value={{ show, position, rowId, }}
    >
      <ContextMenuDispatcherContext.Provider
        value={{ onContextMenu, onHide, setContainer, }}
      >
        {children}
      </ContextMenuDispatcherContext.Provider>
    </ContextMenuContext.Provider>
  );
};

