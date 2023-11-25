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
  return (
    <svg
      viewBox={`0 0 ${dx} ${dy}`}
      xmlns="http://www.w3.org/2000/svg"
      style={{
        position: "absolute",
        left: `${from.x}px`,
        top: `${from.y}px`,
        width: `${dx}px`,
        height: `${dy}px`,
      }}
    >
      <line
        x1={0} y1={0}
        x2={dx} y2={dy}
        stroke="gray"
      /> 
    </svg>
  );
};

export default Arrow;

