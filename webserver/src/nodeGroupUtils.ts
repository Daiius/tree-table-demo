
import { ProcessTreeNode } from './commonTypes';

export type RecursiveGroupNodesArgs = {
  nodes: ProcessTreeNode[];
  irow: number;
  icolumn: number;
  // array[irow][icolumn] = ProcessTreeNode[] with the same parent_id and process_type
  array: ProcessTreeNode[][][];
}
// NOTE:
// this function modifies array: ProcessTreeNode[][][]
export const recursiveGroupNodes = ({
  nodes,
  irow,
  icolumn,
  array
}: RecursiveGroupNodesArgs): number => {
  array[irow] ??= [];
  array[irow][icolumn] ??= [];
  array[irow][icolumn] = nodes;

  // rowOffset is affected by child nodes,
  // so the return value tells how many rows are consumed by child nodes
  let irowOffset = 0;
  for (const node of nodes) {
    const types: string[] = [
      ...new Set(node.children.map(child => child.process_type))
    ];
    for (const type of types) {
      const targets: ProcessTreeNode[] = node.children.filter(child => child.process_type === type);
      irowOffset += recursiveGroupNodes({
        nodes: targets,
        irow: irow + irowOffset,
        icolumn: icolumn + 1,
        array
      });
    }
    irowOffset++;
  }

  return irowOffset;
};

