import { useEffect } from 'react';
import { ProcessTreeNode } from './commonTypes';
import { ArrowProps, Point } from './Arrow';

export type UseArrowsArgs = {
  node: ProcessTreeNode;
  container: HTMLTableElement|null;
}

export type ConnectionDict = {
  [key: string]: ArrowProps
}

export type UseArrowResult = {
  connections: ConnectionDict;
}

export const useArrows = ({
  node,
  container
}: UseArrowsArgs): UseArrowResult => {

  const connections: ConnectionDict = {};

  // intentionally delaying change of connections to make sure that
  // TreeTableView component is rendered first, and then arrows are rendered
  useEffect(() => {
    
    const recursiveAddConnections = (node: ProcessTreeNode) => {
      for (const child of node.children) {
        const fromId = `node-${node.process_id}`;
        const toId = `group-${node.process_id}`;

        const fromElement = document.getElementById(fromId);
        const toElement = document.getElementById(toId);
        if (fromElement == null || toElement == null || container == null) continue;

        const containerRect = container.getBoundingClientRect();
        const fromRect = fromElement.getBoundingClientRect();
        const toRect = toElement.getBoundingClientRect();

        const from: Point = {
          x: fromRect.right - containerRect.left,
          y: fromRect.top - containerRect.top + fromRect.height / 2
        };
        const to: Point = {
          x: toRect.left - containerRect.left,
          y: toRect.top - containerRect.top + toRect.height / 2
        };

        connections[`${fromId};${toId}`] = { from, to };

        recursiveAddConnections(child);
      }
    };
    recursiveAddConnections(node);
  });
  
  return {
    connections
  };
};

