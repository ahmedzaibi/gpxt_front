import React, { useState, useEffect } from 'react';

const HRCOMBO = ({ node, children }) => {
  const [value, setValue] = useState("");
  const id = node.getAttribute("ID") || Math.random().toString();

  useEffect(() => {
    const saved = localStorage.getItem("formData");
    if (saved) {
      const data = JSON.parse(saved);
      if (data[id]) setValue(data[id]);
    }
  }, [id]);

  const handleChange = (e) => {
    setValue(e.target.value);
    // no onChange callback here!
  };

  const options = [
    { value: "", label: "Select" },
    { value: "option1", label: "Option 1" },
    { value: "option2", label: "Option 2" },
    { value: "option3", label: "Option 3" },
  ];

  return (
    <div>
      <select
        value={value}
        onChange={handleChange}
        data-id={id}  // Add this attribute for later querying
        style={{
          position: "absolute",
          left: parseInt(node.getAttribute("Left") || "0", 10) + "px",
          top: parseInt(node.getAttribute("Top") || "0", 10) + "px",
          width: parseInt(node.getAttribute("Width") || "100", 10) + "px",
          height: parseInt(node.getAttribute("Height") || "30", 10) + "px",
          fontSize: "10px"
        }}
        className="input border border-blue-500 bg-blue-50"
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      {children}
    </div>
  );
};

export default HRCOMBO;
