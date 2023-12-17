
import { ProcessTreeNode } from 'commonTypes';

export type UseEvaluationsArgs = {
  nodes: ProcessTreeNode[];
};

export type UseEvaluationsResults = {
  evaluationNames: string[];
};

export const useEvaluations = ({
  nodes
}: UseEvaluationsArgs): UseEvaluationsResults => {
  
  const evaluationNames = [...new Set(
    nodes.flatMap(node => Object.keys(node.evaluations))
  )];

  return {
    evaluationNames
  };
};
