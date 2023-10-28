import React from 'react';

import Stack from 'react-bootstrap/Stack';

import { ProcessTreeNode } from './commonTypes';

import './SimpleTreeView.scss';

export type SimpleTreeViewProps = {
  node: ProcessTreeNode
}

const SimpleTreeView: React.FC<SimpleTreeViewProps> = ({
  node
}) => {
  if (node == null) return <div>loading...</div>;

  return (
    <>
      <div className="simple-tree-view-outline">
        <div className="simple-tree-view-process-type">
          {node.process_type}
        </div>
        <div style={{marginLeft: "1rem"}}>
          {Object.entries(node.conditions).map(([key, value], ientry) => 
            <div key={ientry}>
              {key}: {value}
            </div>
          )}
        </div>
      </div>
      <div style={{marginLeft: "3rem"}}>
        {node.children.map(child =>
          <Stack direction="horizontal">
            <i className="bi bi-arrow-return-right"/>
            <SimpleTreeView node={child} />
          </Stack>
        )}
      </div>
    </>
  );
};

export default SimpleTreeView;

