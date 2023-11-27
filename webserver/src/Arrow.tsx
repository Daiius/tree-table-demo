import React from 'react';

export type Point = {
  x: number;
  y: number;
}

export type ArrowProps = {
  from: Point;
  to: Point;
};

const Arrow: React.FC<ArrowProps> = ({
  from,
  to
}) => {
  const dx = Math.abs(to.x - from.x);
  const dy = Math.abs(to.y - from.y);
  const lineDict = to.y > from.y
    ? { y1: 0, y2: dy}
    : { y1: dy, y2: 0};
  return (
    <svg
      viewBox={`0 0 ${dx} ${dy}`}
      xmlns="http://www.w3.org/2000/svg"
      style={{
        position: "absolute",
        left: `${from.x}px`,
        top: `${Math.min(from.y, to.y)}px`,
        width: `${dx}px`,
        height: `${dy}px`,
      }}
    >
      <line
        x1={0} x2={dx}
        {...lineDict}
        stroke="gray"
      /> 
    </svg>
  );
};

export default Arrow;

