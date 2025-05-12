import React from 'react';


const HREDIT = (props) => {
  return (<div>
    <input type="text" placeholder="Type here" 
      style={{
        position: "absolute",
        left: `${parseInt(props.node.getAttribute("Left") || "0", 10)}px`,
        top: `${parseInt(props.node.getAttribute("Top") || "0", 10)}px`,
        width: `${parseInt(props.node.getAttribute("Width") || "0", 10)}px`,
        height: `${parseInt(props.node.getAttribute("Height") || "0", 10)}px`,
        fontSize:"10px"
      }}
      className=" input border border-blue-500 bg-blue-50"
    />{props.children}</div>
  );
};

export default HREDIT;

