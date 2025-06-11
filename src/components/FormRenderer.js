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
const FormRenderer = () => {
  const location = useLocation();
  const xmlData = location.state?.xmlData;
  const [components, setComponents] = useState([]);
  const [labelNode, setLabelNode] = useState("no label found");
  const [showSaveButton, setShowSaveButton] = useState(false);

  useEffect(() => {
    if (!xmlData) return;

    const parser = new DOMParser();
    const definedlm = {
      HRINFODATAGRID: HRINFODATAGRID,
      HRPAGE: HRPAGE,
      HRITEM: HRITEM,
      HRTEXT: HRTEXT,
      HROUTPUT: HROUTPUT,
      HREDIT: HREDIT,
      HRCOMBO: HRCOMBO,
    };

    const xmlDoc = parser.parseFromString(xmlData, "text/xml");

    const hrpageLabelnode = xmlDoc.querySelector("OBJECT");

    const getChildren = (nodes) => {
      const children = [];
      nodes.forEach((child) => {
        if (
          child.nodeType === Node.ELEMENT_NODE &&
          Object.keys(definedlm).includes(child.tagName)
        ) {
          if (child.tagName === "HREDIT" || child.tagName === "HRCOMBO") {
            setShowSaveButton(true);
          }

          let elemChildren = [];
          if (child.hasChildNodes) {
            elemChildren = getChildren(child.childNodes);
          }

          const elem = React.createElement(definedlm[child.tagName], {
            node: child,
            children: elemChildren,
          });
          children.push(elem);
        } else if (
          child.nodeType === Node.ELEMENT_NODE &&
          !Object.keys(definedlm).includes(child.tagName)
        ) {
          children.push(...getChildren(child.childNodes));
        }
      });
      return children;
    };

    const parseComponents = () => {
      const parsed = [];
      const node = xmlDoc.getElementsByTagName("HRPAGE")[0];
      const children = getChildren(node.childNodes);
      const elem = React.createElement(definedlm[node.tagName], {
        node,
        children,
      });
      parsed.push(elem);
      setComponents(parsed);
    };

    parseComponents();

    if (hrpageLabelnode) {
      const label = hrpageLabelnode.getAttribute("Label");
      setLabelNode(label);

      // Send the API request with label and file
      const formData = new FormData();
      const blob = new Blob([xmlData], { type: "text/xml" });

      formData.append("label", label);
      formData.append("file", blob, `${label || "form"}.xml`);

      fetch("http://localhost:8080/api/forms/upload", {
        method: "POST",
        body: formData,
      })
        .then((res) => {
          if (!res.ok) throw new Error("form saving failed");
          return res.text();
        })
        .then((text) => {
          console.log("✅ Form saved:", text);
        })
        .catch((err) => {
          console.error("❌ form saving error:", err);
        });
    }
  }, [xmlData]);

  const handleSave = () => {
    const container = document.querySelector(".relative.bg-gray-50");
    if (!container) return;

    const inputs = container.querySelectorAll(
      "input[data-id], select[data-id]"
    );
    const values = {};
    inputs.forEach((input) => {
      values[input.getAttribute("data-id")] = input.value;
    });

    localStorage.setItem("formData", JSON.stringify(values));
    alert("Form data saved to localStorage!");
  };

  return (
    <Layout>
      <div
        className="flex items-center justify-center min-h-screen bg-cover bg-center pt-32"
        style={{
          backgroundImage: `url('/images/bg_login.png')`,
          backgroundSize: "cover",
          backgroundPosition: "90% 36%",
        }}
      >
        <div className="w-full max-w-6xl p-16 shadow-xl  rounded-lg">
          <h2 className="text-3xl font-bold mb-6 text-center text-white">
            {labelNode}
          </h2>
          <div
            className="relative w-full max-w-4xl px-6 py-20 bg-white/10 backdrop-blur-md rounded-3xl shadow-lg border border-white/20 text-white"
            style={{
              width: "100%",
              position: "relative",
              minHeight: "400px",
            }}
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
