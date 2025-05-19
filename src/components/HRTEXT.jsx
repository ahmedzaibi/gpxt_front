import React from "react";

const HRTEXT = (props) => {
  return (
    <div>
      <button
        className="btn btn-disabled"
        tabIndex="-1"
        aria-disabled="true"
        style={{
          position: "absolute",
          left: `${parseInt(props.node.getAttribute("Left") || "0", 10)}px`,
          top: `${parseInt(props.node.getAttribute("Top") || "0", 10)}px`,
          width: `${parseInt(props.node.getAttribute("Width") || "0", 10)}px`,
          height: `${parseInt(props.node.getAttribute("Height") || "0", 10)}px`,
          fontWeight: "bold",
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
          padding: "4px",
          backgroundColor: "#f0f0f0",
          border: "1px solid #ccc",
          fontSize: "8px",
        }}
      >
        {extractLabel(props.node)}
      </button>
      {props.children}
    </div>
  );
};
const extractLabel = (hrTextNode) => {
  var lang = localStorage.getItem("lang");
  const labelNode = hrTextNode.querySelector("HRLABELS > HRLABEL");
  if (labelNode) {
    if (lang) {
      var label = Array.from(labelNode.childNodes).filter(
        (node) =>
          node.nodeType === Node.ELEMENT_NODE &&
          node.getAttribute("Lang") === lang
      );
      if (label.length > 0) {
        return label[0].textContent.trim();
      }
    }
    label = Array.from(labelNode.childNodes).filter(
      (node) => node.nodeType === Node.TEXT_NODE
    );
    if (label.length > 0) {
      return label[0].nodeValue.trim();
    }
  }
  return "";
};
export default HRTEXT;
