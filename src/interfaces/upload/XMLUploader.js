import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function XMLUploader() {
  const navigate = useNavigate();

  const handleFileUpload = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const xmlString = e.target?.result;
        localStorage.setItem("xmlData", xmlString);
        navigate('/form-render', { state: { xmlData: xmlString } });
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center">
      <div className="card w-full max-w-xl bg-base-100 shadow-xl p-6">
        <h2 className="text-2xl font-bold mb-4 text-center">Upload XML File</h2>
        <div className="form-control">
          <input
            type="file"
            accept=".xml"
            onChange={handleFileUpload}
            className="file-input file-input-bordered w-full"
          />
        </div>
      </div>
    </div>
  );
}
