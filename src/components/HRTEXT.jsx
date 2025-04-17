import React from "react";

const HRTEXT = ({ label, left, top, width, height }) => {
  return (
    <button className="btn btn-disabled" tabIndex="-1" aria-disabled="true"      style={{
        position: "absolute",
        left,
        top,
        width,
        height,
        fontWeight: "bold",
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start",
        padding: "4px",
        backgroundColor: "#f0f0f0",
        border: "1px solid #ccc",
        fontSize:"8px"
      }}
    >
    {label}
  
      
    </button>
  );
};

export default HRTEXT;
