import React from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../frontoffice/layout.js";
export default function XMLUploader() {
  const navigate = useNavigate();

  const handleFileUpload = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const xmlString = e.target?.result;
        localStorage.setItem("xmlData", xmlString);
        navigate("/form-render", { state: { xmlData: xmlString } });
      };
      reader.readAsText(file);
    }
  };

  return (
    <Layout>
      <div
        className="min-h-screen flex items-center justify-center"
        style={{
          backgroundImage: "url(/images/bg_login.png)",
          backgroundSize: "cover",
          backgroundPosition: "60% 36%",
        }}
      >
        <div className="card w-full max-w-xl bg-base-100 shadow-xl p-6">
          <h2 className="text-2xl font-bold mb-4 text-center">
            Please upload the step as XML file
          </h2>
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
    </Layout>
  );
}
