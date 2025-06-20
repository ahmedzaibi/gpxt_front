import React from "react";
import Layout from "../frontoffice/layout.js";
import UploadInput from "../../components/UploadInput"; // Adjust the import path as needed

export default function XMLUploader() {
  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const xmlString = e.target?.result;

        try {
          const formData = new FormData();
          const blob = new Blob([xmlString], { type: "text/xml" });

          // Only the file is sent (no label)
          formData.append("file", blob, file.name);

          const response = await fetch(
            "http://localhost:8080/api/forms/upload",
            {
              method: "POST",
              body: formData,
            }
          );

          if (!response.ok) throw new Error("Upload failed");

          const savedXml = await response.text();
          localStorage.setItem("xmlData", savedXml);
          alert("✅ Upload successful!");
        } catch (error) {
          console.error("❌ Upload error:", error);
          alert("Error uploading XML file.");
        }
      };

      reader.readAsText(file);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center">
        <div className="card w-full max-w-xl bg-white/10 backdrop-blur-md text-white border border-white/20 shadow-xl p-8 rounded-3xl flex flex-col items-center gap-8">
          <h2 className="text-2xl font-bold text-center">
            télécharger une étape en tant qu'un fichier XML
          </h2>
          <UploadInput onChange={handleFileUpload} />
        </div>
      </div>
    </Layout>
  );
}
