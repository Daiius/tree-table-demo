import React from 'react';

import Alert from 'react-bootstrap/Alert';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { ErrorBoundary } from 'react-error-boundary';

import SimpleTreeView from './SimpleTreeView';
import TreeTableView from './TreeTableView';

import { useProcessData } from 'useProcessData';

import { ContextMenuProvider } from './useContextMenu';
import { TableCellFocusProvider } from './useTableCellFocusContext';

const MainView = () => {
  
  const { node } = useProcessData();

  console.log(node);

  if (node == null) return <div>loading...</div>;

  return (
    <Tabs
      defaultActiveKey="tree-table-view"
      mountOnEnter
      unmountOnExit
    >
      <Tab eventKey="simple-tree-view" title="SimpleTreeView">
        <SimpleTreeView
          node={node}
          depth={0}
        />
      </Tab>
      <Tab eventKey="tree-table-view" title="TreeTableView">
				<ErrorBoundary 
					fallback={
						<Alert>
							Error occurred while rendering component...
						</Alert>
					}
				>
          <ContextMenuProvider>
            <TableCellFocusProvider>
              <TreeTableView node={node} />
            </TableCellFocusProvider>
          </ContextMenuProvider>
				</ErrorBoundary>
      </Tab>
    </Tabs>
  );
};

export default MainView;

