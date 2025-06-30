import React, { useState, useEffect, useMemo } from "react";
import { useFieldId } from "../hooks/useFieldId";

const HRCOMBO = ({ node, children }) => {
  const id = useFieldId(node);
  const [value, setValue] = useState("");

  const options = useMemo(() => {
    const optionNodes = Array.from(node.querySelectorAll("HROPTION"));
    const parsedOptions = optionNodes.map((optNode) => ({
      value: optNode.getAttribute("Value"),
      label: optNode.textContent.trim(),
    }));
    return [{ value: "", label: "Select..." }, ...parsedOptions];
  }, [node]);

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
        Error: HRCOMBO misconfigured
      </div>
    );
  }

  return (
    <div>
      <select
        value={value}
        onChange={(e) => setValue(e.target.value)}
        data-id={id}
        style={{
          position: "absolute",
          left: parseInt(node.getAttribute("Left") || "0", 10) + "px",
          top: parseInt(node.getAttribute("Top") || "0", 10) + "px",
          width: parseInt(node.getAttribute("Width") || "100", 10) + "px",
          height: parseInt(node.getAttribute("Height") || "30", 10) + "px",
          fontSize: "10px",
        }}
        className="bg-white/10 text-white rounded-md px-2 flex items-center text-xs"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {children}
    </div>
  );
};

export default HRCOMBO;
