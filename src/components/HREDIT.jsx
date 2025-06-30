import React, { useState, useEffect } from "react";
import { useFieldId } from "../hooks/useFieldId";

const HREDIT = ({ node, children }) => {
  const id = useFieldId(node);
  const [value, setValue] = useState("");

  useEffect(() => {
    if (!id) return;
    const saved = localStorage.getItem("formData");
    if (saved) {
      const data = JSON.parse(saved);
      if (data[id]) setValue(data[id]);
    }
  }, [id]);

  if (!id) {
    return (
      <div style={{ color: "red", position: "absolute" }}>
        Error: HREDIT misconfigured
      </div>
    );
  }

  return (
    <div>
      <input
        type="text"
        placeholder="Type here"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        style={{
          position: "absolute",
          left: `${parseInt(node.getAttribute("Left") || "0", 10)}px`,
          top: `${parseInt(node.getAttribute("Top") || "0", 10)}px`,
          width: `${parseInt(node.getAttribute("Width") || "150", 10)}px`,
          height: `${parseInt(node.getAttribute("Height") || "30", 10)}px`,
          fontSize: "10px",
        }}
        className="bg-white/10 text-white rounded-md px-2 flex items-center text-xs"
        data-id={id}
      />
      {children}
    </div>
  );
};

export default HREDIT;
