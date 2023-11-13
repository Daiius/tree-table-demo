import React from 'react';

import Alert from 'react-bootstrap/Alert';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { ErrorBoundary } from 'react-error-boundary';

import SimpleTreeView from './SimpleTreeView';
import TreeTableView from './TreeTableView';

import { useFetch } from './useFetch';

import { ProcessTreeNode, convertProcesTreeNodeData } from './commonTypes';

const MainView = () => {

  const { data } = useFetch<ProcessTreeNode[]>(
    "http://localhost/api/processes/trees/0"
  );

  console.log(data);

  if (data == null) return <div>loading...</div>;

  return (
    <Tabs
      defaultActiveKey="tree-table-view"
      mountOnEnter
      unmountOnExit
    >
      <Tab eventKey="simple-tree-view" title="SimpleTreeView">
        <SimpleTreeView
          node={convertProcesTreeNodeData(data[0])}
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
					<TreeTableView
						node={convertProcesTreeNodeData(data[0])}
					/>
				</ErrorBoundary>
      </Tab>
    </Tabs>
  );
};

export default MainView;

