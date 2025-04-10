import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function XMLUploader() {
  const navigate = useNavigate();
  const [dragActive, setDragActive] = useState(false);
  const [fileName, setFileName] = useState('');
  const [error, setError] = useState('');

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const file = e.dataTransfer.files?.[0];
    processFile(file);
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    processFile(file);
  };

  const processFile = (file) => {
    if (!file) return;
    
    setError('');
    
    if (!file.name.toLowerCase().endsWith('.xml')) {
      setError('Please upload an XML file');
      return;
    }
    
    setFileName(file.name);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        const xmlString = e.target.result;
        try {
          // Simple validation: check if it looks like XML
          if (!xmlString.toString().includes('<?xml') && !xmlString.toString().includes('<')) {
            setError('The file does not appear to be valid XML');
            return;
          }
          
          localStorage.setItem("xmlData", xmlString); // Save to localStorage
          navigate('/form-render', { state: { xmlData: xmlString } });
        } catch (err) {
          setError('Error processing XML file. Please try again.');
        }
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-primary">XML Uploader</h1>
        <p className="text-base-content/70 mt-2">Upload your XML file to generate a dynamic form</p>
      </div>
      
      {error && (
        <div className="alert alert-error mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
        </div>
      )}
      
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <div 
            className={`border-2 border-dashed rounded-lg p-10 text-center cursor-pointer transition-all ${dragActive ? 'border-primary bg-primary/10' : 'border-base-300 hover:border-primary/50'}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => document.getElementById('file-upload').click()}
          >
            <input
              id="file-upload"
              type="file"
              accept=".xml"
              onChange={handleFileChange}
              className="hidden"
            />
            
            <div className="flex flex-col items-center justify-center space-y-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-primary/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              
              {fileName ? (
                <div>
                  <p className="text-lg font-medium">{fileName}</p>
                  <p className="text-sm text-base-content/70 mt-1">Click or drag to replace</p>
                </div>
              ) : (
                <div>
                  <p className="text-lg font-medium">
                    {dragActive ? 'Drop your XML file here' : 'Click to upload or drag and drop'}
                  </p>
                  <p className="text-sm text-base-content/70 mt-1">Only XML files are supported</p>
                </div>
              )}
            </div>
          </div>
          
          {fileName && (
            <div className="card-actions justify-end mt-6">
              <button 
                className="btn btn-primary"
                onClick={() => {
                  if (localStorage.getItem("xmlData")) {
                    navigate('/form-render', { state: { xmlData: localStorage.getItem("xmlData") } });
                  }
                }}
              >
                Proceed to Form
              </button>
            </div>
          )}
        </div>
      </div>
      
      <div className="divider my-12">OR</div>
      
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Use Recent XML Files</h2>
          <p className="text-base-content/70">
            Your recently uploaded XML files will appear here for quick access.
          </p>
          
          <div className="py-4">
            <div className="alert alert-info">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-info shrink-0 w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span>No recent files found. Upload an XML file to get started.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
