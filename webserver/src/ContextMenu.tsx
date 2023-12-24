import React from 'react';

import Dropdown from 'react-bootstrap/Dropdown';

import {
  useContextMenu,
  useContextMenuDispatcher,
} from './useContextMenu';

const ContextMenu: React.FC = () => {
  
  const {
    show,
    position,
    rowId
  } = useContextMenu();

  const {
    onHide,
  } = useContextMenuDispatcher();

  return (
    <Dropdown
      show={show}
      style={{
        position: "absolute",
        left: `${position.left}px`,
        top: `${position.top}px`,
      }}
      onToggle={(nextShow) => !nextShow && onHide()}
    >
      <Dropdown.Menu>
        <Dropdown.Item onClick={onHide}>
          Hello, this is a custom context menu!
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default ContextMenu;
