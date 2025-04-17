import React from 'react';


const HREDIT = ({  left, top, width, height }) => {
  return (<div>
    <input type="text" placeholder="Type here" 
      style={{
        position: "absolute",
        left: `${left}px`,
        top: `${top}px`,
        width: `${width}px`,
        height: `${height}px`,
        fontSize:"10px"
      }}
      className=" input border border-blue-500 bg-blue-50"
    /></div>
  );
};

export default HREDIT;

