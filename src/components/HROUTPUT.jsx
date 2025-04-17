import React from "react";

const HROUTPUT = ({ value, left, top, width, height }) => {
  return (
    <hroutput
      style={{
        position: "absolute",
        left: `${left}px`,
        top: `${top}px`,
        width: `${width}px`,
        height: `${height}px`,
        fontSize:"10px"
      }}
      className="border border-blue-500 bg-blue-50"
    >
      {value}
    </hroutput>
  );
};

export default HROUTPUT;
