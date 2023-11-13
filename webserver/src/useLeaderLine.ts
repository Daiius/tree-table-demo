import { useEffect, useRef } from 'react';
import LeaderLine from 'leader-line-new';

import { ProcessTreeNode } from './commonTypes';

export type Connection = {
  from: string;
  to: string;
}

export type UseLeaderLineArgs = {
  rootNode: ProcessTreeNode;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	dependencies: any[];
}



export const useLeaderLine = ({
  rootNode,
	dependencies
}: UseLeaderLineArgs) => {

  const leaderLinesRef = useRef<LeaderLine[]>([]);
  
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

  // re-create LeaderLines
  useEffect(() => {

		// delete existing LeaderLines
		leaderLinesRef.current.forEach(ll => ll.remove());
		leaderLinesRef.current = [];

		// re-create LeaderLines

    const scroller = document.getElementsByClassName("table-responsive")?.[0];
    if (scroller == null) return;
    for (const connection of connections) {
      const from = document.getElementById(connection.from);
      const to = document.getElementById(connection.to);
      if (from == null || to == null) continue;
      const leaderLine = new LeaderLine(
        from, to, {
          path: "straight", startSocket: "right", endSocket: "left",
          color: "lightgray", size: 2, startPlug: "disc", endPlug: "arrow3"
        }
      );
      leaderLinesRef.current.push(leaderLine);
    }

    const onScroll = () => {
      leaderLinesRef.current.forEach(ll => ll.position());
    };

    scroller.addEventListener(
      'scroll',
      onScroll
    );

    return () => {
      scroller.removeEventListener('scroll', onScroll);
      leaderLinesRef.current.forEach(ll => ll.remove());
			leaderLinesRef.current = [];
    };
		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  }, [rootNode, ...dependencies]);

	// position LeaderLines in each re-render (it supposed to be some layout is changed...)
	useEffect(() => {
		leaderLinesRef.current.forEach(ll => ll.position());
	});

};

