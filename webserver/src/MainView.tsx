import React, { useState } from 'react';

import { Stack } from 'react-bootstrap';

import SimpleTreeView from './SimpleTreeView';

import { useFetch } from './useFetch';


const MainView = () => {

  const [data, _isLoading, _error] = useFetch(
    "http://localhost/api/processes/trees/0"
  );

  console.log(data);

  if (data == null) return <div>loading...</div>;

  return (
    <SimpleTreeView node={data[0]} />
  );
};

export default MainView;

