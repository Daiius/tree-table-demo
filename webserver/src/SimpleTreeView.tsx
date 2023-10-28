import React from 'react';

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
          <SimpleTreeView node={child} />
        )}
      </div>
    </>
  );
};

export default SimpleTreeView;

