import React from "react";

const HRITEM = ({ 
  left, 
  top, 
  width, 
  height, 
  uuid, 
  style, 
  field, 
  value = "", 
  labelText 
}) => {
  return (
    <div
      className="absolute"
      style={{
        left: `${left}px`,
        top: `${top}px`,
        width: `${width}px`,
        height: `${height}px`,
      }}
    >
      {/* Label for the input */}
      {labelText && (
        <label 
          htmlFor={uuid}
          className="block text-sm font-medium text-base-content mb-1"
        >
          {labelText}
        </label>
      )}
      
      {/* The input field */}
      <input
        type="text"
        defaultValue={value}
        className="input input-bordered w-full h-full focus:input-primary"
        name={field}
        id={uuid}
      />
    </div>
  );
};

export default HRITEM;