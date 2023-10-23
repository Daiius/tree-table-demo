import React, { useState } from 'react';

import { Stack } from 'react-bootstrap';

import { useFetch } from './useFetch';


interface ProcessTreeNode {
  process_id: string;
  process_type: string;
  conditions: {[key: string]: string};
  evaluations: {[evalType: string]: {[evalColumn: string]: string}};
  children: ProcessTreeNode[];
}

const MainView = () => {

  const [data, isLoading, error] = useFetch(
    "http://localhost/api/processes/trees/0"
  );

  console.log(data);

  const nodeView = (node: ProcessTreeNode, depth: number) => {

    return (
      <>
        <div>
          {node.process_type}
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
            nodeView(child, depth + 1)
          )}
        </div>
      </>
    );
  };


  return (
    <>
      {data != null && data.map((d: ProcessTreeNode) => nodeView(d, 0))}
    </>
  );
};

export default MainView;
