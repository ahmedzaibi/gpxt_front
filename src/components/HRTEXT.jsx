import React from "react";

const HRTEXT = ({ left, top, width, height, label, style }) => {
  return (
    <div
      className="absolute"
      style={{
        left: `${left}px`,
        top: `${top}px`,
        width: `${width}px`,
        height: `${height}px`,
      }}
    >
      <p className="text-sm font-medium text-base-content">{label}</p>
    </div>
  );
};

export default HRTEXT;
