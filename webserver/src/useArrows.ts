import { useEffect, useState } from 'react';
import { ProcessTreeNode } from './commonTypes';
import { ArrowProps, Point } from './Arrow';

export type UseArrowsArgs = {
  node: ProcessTreeNode;
  container: HTMLElement|null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dependencies: any[];
}

export type ConnectionDict = {
  [key: string]: ArrowProps
}

export type UseArrowResult = {
  connections: ConnectionDict;
}

const recursiveAddConnections = (
  node: ProcessTreeNode,
  dict: ConnectionDict,
  container: HTMLElement|null
) => {
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

    dict[`${fromId};${toId}`] = { from, to };

    recursiveAddConnections(child, dict, container);
  }
};

export const useArrows = ({
  node,
  container,
  dependencies
}: UseArrowsArgs): UseArrowResult => {

  const [connections, setConnections] = useState<ConnectionDict>({});

  // intentionally delaying change of connections to make sure that
  // TreeTableView component is rendered first, and then arrows are rendered
  useEffect(() => {
      const newDict: ConnectionDict = {};
      recursiveAddConnections(node, newDict, container);
      setConnections(newDict);

    return () => {
      setConnections({});
    };
  },
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  [node, container, ...dependencies]);
  
  return {
    connections
  };
};

