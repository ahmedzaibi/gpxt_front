import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
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
  const xmlData = location.state?.xmlData;
  const [components, setComponents] = useState([]);
  const [labelNode, setLabelNode] = useState("no label found");
  const [showSaveButton, setShowSaveButton] = useState(false);

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

    const hrpage = xmlDoc.querySelector("OBJECT");
    if (hrpage) setLabelNode(hrpage.getAttribute("Label") || "");

    const walk = (nodes) => {
      const arr = [];
      nodes.forEach((n) => {
        if (n.nodeType === Node.ELEMENT_NODE && defined[n.tagName]) {
          if (["HREDIT", "HRCOMBO", "HRBLOB"].includes(n.tagName))
            setShowSaveButton(true);

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
  }, [xmlData]);

  const handleSave = () => {
    const inputs = document.querySelectorAll("input[data-id], select[data-id]");
    const vals = {};
    inputs.forEach((i) => {
      const id = i.getAttribute("data-id");
      if (i.type === "file" && i.files[0]) {
        const reader = new FileReader();
        reader.onloadend = () => {
          vals[id] = reader.result;
          localStorage.setItem("formData", JSON.stringify(vals));
          alert("Form data saved!");
        };
        reader.readAsDataURL(i.files[0]);
      } else {
        vals[id] = i.value;
      }
    });

    // If no file input exists, save immediately
    const hasFile = Array.from(inputs).some(
      (i) => i.type === "file" && i.files[0]
    );
    if (!hasFile) {
      localStorage.setItem("formData", JSON.stringify(vals));
      alert("Form data saved!");
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
                className="btn btn-warning btn-outline text-xl text-white"
              >
                Save Form
              </button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default FormRenderer;
