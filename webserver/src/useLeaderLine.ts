import { useEffect } from 'react';
import LeaderLine from 'leader-line-new';

import { ProcessTreeNode } from './commonTypes';

export type Connection = {
  from: string;
  to: string;
}

export type UseLeaderLineArgs = {
  rootNode: ProcessTreeNode;
}



export const useLeaderLine = ({
  rootNode
}: UseLeaderLineArgs) => {
  
  const connections: Connection[] = [];
  const recursiveAddConnection = (node: ProcessTreeNode) => {
    for (const child of node.children) {
      connections.push({
        from: `node-${node.process_id}`,
        to: `group-${node.process_id}`
      });
      recursiveAddConnection(child);
    }
  };
  recursiveAddConnection(rootNode);

  useEffect(() => {
    const leaderLines: LeaderLine[] = [];
    const scroller = document.getElementsByClassName("table-responsive")?.[0];
    if (scroller == null) return;
    for (const connection of connections) {
      const from = document.getElementById(connection.from);
      const to = document.getElementById(connection.to);
      if (from == null || to == null) continue;
      const leaderLine = new LeaderLine(
        from, to, {
          path: "straight", startSocket: "right", endSocket: "left",
          color: "lightgray", size: 2
        });
      leaderLines.push(leaderLine);
    }

    const onScroll = () => {
      leaderLines.forEach(leaderLine => leaderLine.position());
    };
    scroller.addEventListener(
      'scroll',
      onScroll
    );

    return () => {
      leaderLines.forEach(leaderLine => leaderLine.remove());
      scroller.removeEventListener('scroll', onScroll);
    };
  }, [connections]);
};
