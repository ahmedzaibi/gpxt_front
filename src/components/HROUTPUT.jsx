import React from "react";

const HROUTPUT = (props) => {
  return (
    <div>
      <div
        style={{
          position: "absolute",
          left: `${parseInt(props.node.getAttribute("Left") || "0", 10)}px`,
          top: `${parseInt(props.node.getAttribute("Top") || "0", 10)}px`,
          width: `${parseInt(props.node.getAttribute("Width") || "0", 10)}px`,
          height: `${parseInt(props.node.getAttribute("Height") || "0", 10)}px`,
          fontSize: "10px",
        }}
        className="border border-blue-500 rounded-field		"
      >
        {props.node.textContent.trim()}
      </div>
      {props.children}
    </div>
  );
};

export default HROUTPUT;
