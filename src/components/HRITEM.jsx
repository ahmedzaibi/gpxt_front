import React from "react";

const HRITEM = ({ field, left, top, width, height, children }) => {
  return (
    <div
      style={{
        position: "static",
        left: `${left}px`,
        top: `${top}px`,
        width: `${width}px`,
        height: `${height}px`,
      }}
      className=""
    >
      <div style={{ position: "static", width: "100%", height: "100%" }}>
        {children}
      </div>
    </div>
  );
};

export default HRITEM;
