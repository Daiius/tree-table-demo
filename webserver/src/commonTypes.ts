
export interface ProcessTreeNode {
  process_id: string;
  process_type: string;
  conditions: {[key: string]: string};
  evaluations: {[evalType: string]: {[evalColumn: string]: string}};
  children: ProcessTreeNode[];
}
