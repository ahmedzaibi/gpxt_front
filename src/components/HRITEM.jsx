import React from "react";

const HRITEM = (props) => {
  return (
    <div
      style={{
        position: "static",
        left: `${parseInt(props.node.getAttribute("Left") || "0", 10)}px`,
        top: `${parseInt(props.node.getAttribute("Top") || "0", 10)}px`,
        width: `${parseInt(props.node.getAttribute("Width") || "0", 10)}px`,
        height: `${parseInt(props.node.getAttribute("Height") || "0", 10)}px`,
      }}
      className=""
    >
      <div style={{ position: "static", width: "100%", height: "100%" }}>
      {props.children}
      </div>
    </div>
  );
};

export default HRITEM;
