
export interface ProcessTreeNode {
  parent: ProcessTreeNode|undefined
  process_id: string;
  process_type: string;
  conditions: {[key: string]: string};
  evaluations: {[evalType: string]: {[evalColumn: string]: string}};
  children: ProcessTreeNode[];
}

export const jsonToProcessTreeNode = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any,
  parent?: ProcessTreeNode
): ProcessTreeNode => {

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const convertedNode = data as ProcessTreeNode;
  convertedNode.parent = parent;
  

  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
  convertedNode.children = data.children.map((childData: any) =>
    jsonToProcessTreeNode(childData, convertedNode)
  );

  return convertedNode;
};

export const sleep = async (
  milliseconds: number
): Promise<void> => new Promise(resolve => setTimeout(resolve, milliseconds));

