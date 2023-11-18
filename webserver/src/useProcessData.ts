import useSWR from 'swr';

import { ProcessTreeNode, jsonToProcessTreeNode } from 'commonTypes';

const fetcher = (url: string) => fetch(url).then(response => response.json());

export type UseProcessDataResult = {
  node: ProcessTreeNode | undefined;
  error: Error;
}

export const useProcessData = () => {
  const { data, error } = useSWR<ProcessTreeNode[], Error>(
    'http://localhost/api/processes/trees/0',
    fetcher, {
      refreshInterval: 5_000
    }
  );

  return {
    node: data && jsonToProcessTreeNode(data[0]),
    error
  };
};
