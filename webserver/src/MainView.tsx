import React from 'react';

import SimpleTreeView from './SimpleTreeView';

import { useFetch } from './useFetch';

import { ProcessTreeNode } from './commonTypes';

const MainView = () => {

  const { data } = useFetch<ProcessTreeNode[]>(
    "http://localhost/api/processes/trees/0"
  );

  console.log(data);

  if (data == null) return <div>loading...</div>;

  return (
    <SimpleTreeView node={data[0]} depth={0}/>
  );
};

export default MainView;

