import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import HRINFODATAGRID from "./HRINFODATAGRID.jsx";
import HRITEM from "./HRITEM";
import HRTEXT from "./HRTEXT";
import HROUTPUT from "./HROUTPUT.jsx";
import HREDIT from "./HREDIT.jsx";
import HRCOMBO from "./HRCOMBO.jsx";
import HRPAGE from "./HRPAGE.jsx";
import Layout from "../interfaces/frontoffice/layout.js";
import HRBLOB from "./HRBLOB.jsx";

const FormRenderer = () => {
  const location = useLocation();
  const { xmlData, formName, formLabel } = location.state || {};

  const [components, setComponents] = useState([]);
  const [labelNode, setLabelNode] = useState(formLabel || "no label found");
  const [showSaveButton, setShowSaveButton] = useState(false);
  const [formMetadata, setFormMetadata] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!xmlData) return;
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlData, "text/xml");
    const defined = {
      HRINFODATAGRID,
      HRPAGE,
      HRITEM,
      HRTEXT,
      HROUTPUT,
      HREDIT,
      HRCOMBO,
      HRBLOB,
    };
    const population = xmlDoc.querySelector("HRDS")?.getAttribute("Population");
    const domain = xmlDoc.querySelector("HRDOMAIN")?.getAttribute("Domain");
    const dataSection = xmlDoc.querySelector("[Info]")?.getAttribute("Info");
    if (population && domain && dataSection) {
      setFormMetadata({ population, domain, dataSection });
    } else {
      console.error("Could not find all required metadata in XML.");
    }
    setLabelNode(
      formLabel ||
        xmlDoc.querySelector("OBJECT")?.getAttribute("Label") ||
        "no label found"
    );
    const walk = (nodes) => {
      const arr = [];
      nodes.forEach((n) => {
        if (n.nodeType === Node.ELEMENT_NODE && defined[n.tagName]) {
          if (["HREDIT", "HRCOMBO", "HRBLOB"].includes(n.tagName)) {
            setShowSaveButton(true);
          }
          const children = walk(n.childNodes);
          const Elem = React.createElement(defined[n.tagName], {
            node: n,
            children,
          });
          arr.push(Elem);
        } else if (n.nodeType === Node.ELEMENT_NODE) {
          arr.push(...walk(n.childNodes));
        }
      });
      return arr;
    };
    const page = xmlDoc.getElementsByTagName("HRPAGE")[0];
    if (page) {
      const comp = walk(page.childNodes);
      setComponents([
        React.createElement(defined.HRPAGE, { node: page, children: comp }),
      ]);
    }
  }, [xmlData, formLabel]);

  const handleSave = async () => {
    if (!formMetadata) {
      alert("Form metadata not loaded from XML. Cannot save.");
      return;
    }
    setIsSaving(true);

    let role, dossier;
    try {
      const userSession = JSON.parse(sessionStorage.getItem("current-user-ss"));
      role = userSession?.["@name"];
      dossier = userSession?.["@dossierID"];
      if (!role || dossier === undefined)
        throw new Error("Role or Dossier ID not found.");
    } catch (error) {
      alert("Error: Could not get user data. Please log in again.");
      setIsSaving(false);
      return;
    }

    const inputs = document.querySelectorAll("input[data-id], select[data-id]");
    const vals = {};
    inputs.forEach((input) => {
      const id = input.getAttribute("data-id");
      if (!id) return;

      if (input.type === "file") {
        if (input.files && input.files.length > 0) {
          vals[id] = `blobpath:${input.files[0].name}`;
        } else {
          vals[id] = "";
        }
      } else {
        vals[id] = input.value;
      }
    });

    const finalVals = Object.fromEntries(
      Object.entries(vals).filter(([_, v]) => v !== "")
    );

    const dataItems = Object.entries(finalVals).map(([key, value]) => ({
      item: key,
      value: String(value),
    }));

    if (dataItems.length === 0) {
      alert("No data to save. Please fill out the form.");
      setIsSaving(false);
      return;
    }

    dataItems.push({ item: "NULIGN", value: "0" });

    const payload = {
      occurrences: {
        occurrence: [
          {
            "@population": formMetadata.population,
            "@domain": formMetadata.domain,
            "@datasection": formMetadata.dataSection,
            "@dossier": String(dossier),
            "@action": "M",
            data: dataItems,
            modified: true,
          },
        ],
      },
    };

    const targetUrl = `https://tnhldapp0144.interpresales.mysoprahronline.com/hr-business-services-rest/business-services/gp/${formName}?role=${role}&lang=F&voc=FGA`;
    const proxyUrl = `http://localhost:8181/${targetUrl}`;

    try {
      console.log("Sending FINAL SAVE request to proxy:", proxyUrl);
      console.log("With JSON Payload:", JSON.stringify(payload, null, 2));
      const response = await axios.post(proxyUrl, payload, {
        withCredentials: true,
      });
      console.log("Server Response:", response.data);
      alert("Form data saved successfully!");
    } catch (error) {
      console.error("Failed to save form data:", error);
      const errorMsg =
        error.response?.data?.message || error.response?.data || error.message;
      alert(`Error saving form: ${errorMsg}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Layout>
      <div className="flex items-center justify-center min-h-screen pt-32">
        <div className="w-full max-w-6xl p-16 shadow-xl rounded-lg">
          <h2 className="text-3xl font-bold mb-6 text-center text-white">
            {labelNode}
          </h2>
          <div
            className="relative w-full max-w-4xl px-6 py-20 bg-white/10 backdrop-blur-md rounded-3xl shadow-lg border border-white/20 text-white"
            style={{ minHeight: "400px" }}
          >
            {components[0]}
          </div>
          {showSaveButton && (
            <div className="mt-6 text-center">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="btn btn-warning btn-outline text-xl text-white disabled:opacity-50"
              >
                {isSaving ? "Saving..." : "Save Form"}
              </button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default FormRenderer;
