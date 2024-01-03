import useSWR from 'swr';

import {
  ProcessTreeNode,
  jsonToProcessTreeNode,
} from 'commonTypes';

import { getAPIUrl } from 'communications';

import axios from 'axios';

const fetcher = (url: string) => axios.get(getAPIUrl() + url).then(response => response.data);

export type UseProcessDataResult = {
  node: ProcessTreeNode | undefined;
  error: Error;
}

export const useProcessData = () => {
  const { data, error } = useSWR<ProcessTreeNode[], Error>(
    '/api/processes/trees/0',
    fetcher, {
      refreshInterval: 5_000
    }
  );

  return {
    node: data && jsonToProcessTreeNode(data[0]),
    error
  };
};
