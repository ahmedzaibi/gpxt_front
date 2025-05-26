import React from "react";

const HRTEXT = ({ node, children }) => {
  const label = extractLabel(node);

  return (
    <div>
      <div
        className="bg-white/10 text-white rounded-md px-2 flex items-center font-bold text-xs"
        style={{
          position: "absolute",
          left: `${parseInt(node.getAttribute("Left") || "0", 10)}px`,
          top: `${parseInt(node.getAttribute("Top") || "0", 10)}px`,
          width: `${parseInt(node.getAttribute("Width") || "0", 10)}px`,
          height: `${parseInt(node.getAttribute("Height") || "0", 10)}px`,
          fontSize: "10px",
        }}
        tabIndex="-1"
        aria-disabled="true"
      >
        {label}
      </div>
      {children}
    </div>
  );
};

const extractLabel = (hrTextNode) => {
  const lang = localStorage.getItem("lang");
  const labelNode = hrTextNode.querySelector("HRLABELS > HRLABEL");

  if (labelNode) {
    if (lang) {
      const localized = Array.from(labelNode.childNodes).find(
        (node) =>
          node.nodeType === Node.ELEMENT_NODE &&
          node.getAttribute("Lang") === lang
      );
      if (localized) return localized.textContent.trim();
    }

    const defaultText = Array.from(labelNode.childNodes).find(
      (node) => node.nodeType === Node.TEXT_NODE
    );
    if (defaultText) return defaultText.nodeValue.trim();
  }

  return "";
};

export default HRTEXT;
