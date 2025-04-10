// src/components/InputField.js
import React from 'react';

export default function InputField({ id, label, placeholder }) {
  return (
    <div>
      <label htmlFor={id}>{label}</label>
      <input id={id} placeholder={placeholder} className="border p-2" />
    </div>
  );
}
