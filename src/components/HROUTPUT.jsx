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
        className="bg-white/10 text-white rounded-md px-2 flex items-center text-xs"
      >
        {props.node.textContent.trim()}
      </div>
      {props.children}
    </div>
  );
};

export default HROUTPUT;
