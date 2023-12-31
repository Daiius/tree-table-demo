import React from 'react';

import Stack from 'react-bootstrap/Stack';

import { ProcessTreeNode } from './commonTypes';

import './SimpleTreeView.scss';

export type SimpleTreeViewProps = {
  node: ProcessTreeNode;
  depth: number;
}

const SimpleTreeView: React.FC<SimpleTreeViewProps> = ({
  node,
  depth
}) => {
  if (node == null) return <div>loading...</div>;

  return (
    <Stack gap={1}>
      <Stack
        className="simple-tree-view-return-arrow-stack"
        direction="horizontal"
      >
        {depth !== 0 &&
          <i className="bi bi-arrow-return-right"/>
        }
        <div className="simple-tree-view-outline">
          <div className="simple-tree-view-process-type">
            {node.process_type}
          </div>
          <div style={{marginLeft: "1rem"}}>
            {Object.entries(node.conditions).map(([key, value]) => 
              <div key={key}>
                {key}: {value}
              </div>
            )}
          </div>
        </div>
      </Stack>
      <div
        style={{marginLeft: "3rem"}}
      >
        {node.children.map(child =>
          <SimpleTreeView
            key={child.process_id}
            node={child}
            depth={depth+1}
          />
        )}
      </div>
    </Stack>
  );
};

export default SimpleTreeView;

