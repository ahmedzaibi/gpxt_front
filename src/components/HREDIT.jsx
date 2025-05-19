import React, { useState, useEffect } from 'react';

const HREDIT = ({ node, children }) => {
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
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Type here"
        value={value}
        onChange={handleChange}
        style={{
          position: "absolute",
          left: `${parseInt(node.getAttribute("Left") || "0", 10)}px`,
          top: `${parseInt(node.getAttribute("Top") || "0", 10)}px`,
          width: `${parseInt(node.getAttribute("Width") || "0", 10)}px`,
          height: `${parseInt(node.getAttribute("Height") || "0", 10)}px`,
          fontSize: "10px"
        }}
        className="input border border-blue-500 bg-blue-50"
        data-id={id}  // Important: add an attribute to identify input later
      />
      {children}
    </div>
  );
};

export default HREDIT;
