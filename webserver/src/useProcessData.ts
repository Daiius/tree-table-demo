import useSWR from 'swr';
import axios from 'axios';

import {
  ProcessTreeNode,
  jsonToProcessTreeNode,
} from 'commonTypes';




export type UseProcessDataResult = {
  node: ProcessTreeNode | undefined;
  error: Error;
}

export const useProcessData = () => {
  const { data, error } = useSWR<ProcessTreeNode[], Error>(
    '/api/processes/trees/0',
    (url :string) => axios.get<ProcessTreeNode[]>(url).then(response => response.data),
    { refreshInterval: 5_000 }
  );

  return {
    node: data && jsonToProcessTreeNode(data[0]),
    error
  };
};
