import { useEffect } from 'react';
import LeaderLine from 'leader-line-new';

export type Connection = {
  from: string;
  to: string;
}

export type UseLeaderLineArgs = {
  connections: Connection[];
}

export const useLeaderLine = ({
  connections
}: UseLeaderLineArgs) => {

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

