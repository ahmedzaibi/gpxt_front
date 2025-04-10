import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import HRITEM from "./HRITEM";

const FormRenderer = () => {
  const location = useLocation();
  const xmlData = location.state?.xmlData || localStorage.getItem("xmlData");
  const [components, setComponents] = useState([]);
  const [noLabelComponents, setNoLabelComponents] = useState([]);
  const [formTitle, setFormTitle] = useState("Dynamic Form");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!xmlData) {
      setIsLoading(false);
      setError("No XML data found. Please upload an XML file.");
      return;
    }

    try {
      setIsLoading(true);
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlData, "text/xml");

      // Check if parsing failed
      const parseError = xmlDoc.querySelector("parsererror");
      if (parseError) {
        throw new Error("Invalid XML format");
      }

      // Try to get form title
      const formNode = xmlDoc.querySelector("HRFORM");
      if (formNode && formNode.getAttribute("Caption")) {
        setFormTitle(formNode.getAttribute("Caption"));
      }

      // === Extract Translations and Store in LocalStorage ===
      const extractAndStoreTranslations = (xmlDoc) => {
        const translations = {};
        const lbStrings = Array.from(xmlDoc.getElementsByTagName("LBSTRING"));

        lbStrings.forEach((el) => {
          const stringId = el.getAttribute("StringId");
          const lang = el.getAttribute("Lang");
          const translate = el.getAttribute("Translate");

          if (stringId && lang && translate === "1") {
            const text = el.textContent.trim();
            if (!translations[stringId]) {
              translations[stringId] = {};
            }
            translations[stringId][lang] = text;
          }
        });

        // Save to localStorage
        localStorage.setItem("translations", JSON.stringify(translations));
      };

      // === Extract label from HRTEXT node ===
      const extractLabel = (hrTextNode) => {
        const labelNode = hrTextNode.querySelector("HRLABELS > HRLABEL");
        if (labelNode) {
          return Array.from(labelNode.childNodes)
            .filter((node) => node.nodeType === Node.TEXT_NODE)
            .map((node) => node.nodeValue.trim())
            .join(" ")
            .trim();
        }
        return "";
      };

      // === Associate HRITEM with HRTEXT ===
      const associateHritemsToHrtxts = (xmlDoc) => {
        const parsedComponents = [];
        const noLabelComponents = [];

        const hrItemElements = Array.from(xmlDoc.getElementsByTagName("HRITEM"));

        hrItemElements.forEach((el) => {
          const itemUuid = el.getAttribute("uuid");
          const nestedHrText = el.querySelector("HRTEXT");
          let labelText = "";

          if (nestedHrText) {
            labelText = extractLabel(nestedHrText);
          } else {
            const nextElement = el.nextElementSibling;
            if (nextElement && nextElement.tagName === "HRTEXT") {
              labelText = extractLabel(nextElement);
            } else {
              noLabelComponents.push({
                type: "input",
                uuid: itemUuid,
                left: parseInt(el.getAttribute("Left"), 10),
                top: parseInt(el.getAttribute("Top"), 10),
                width: parseInt(el.getAttribute("Width"), 10),
                height: parseInt(el.getAttribute("Height"), 10),
                style: el.getAttribute("Style"),
                field: el.getAttribute("Field"),
                value: "",
                labelText: "No Label",
              });
              return;
            }
          }

          parsedComponents.push({
            type: "input",
            uuid: itemUuid,
            left: parseInt(el.getAttribute("Left"), 10),
            top: parseInt(el.getAttribute("Top"), 10),
            width: parseInt(el.getAttribute("Width"), 10),
            height: parseInt(el.getAttribute("Height"), 10),
            style: el.getAttribute("Style"),
            field: el.getAttribute("Field"),
            value: "",
            labelText,
          });
        });

        return { parsedComponents, noLabelComponents };
      };

      // === Run parsing functions ===
      extractAndStoreTranslations(xmlDoc);
      const { parsedComponents, noLabelComponents } = associateHritemsToHrtxts(xmlDoc);
      setComponents(parsedComponents);
      setNoLabelComponents(noLabelComponents);
      setIsLoading(false);
    } catch (err) {
      console.error("Error parsing XML:", err);
      setIsLoading(false);
      setError("Failed to parse XML data. Please check the file format.");
    }
  }, [xmlData]);

  // === Render Components ===
  const renderComponent = (comp, idx) => {
    const componentStyle = {
      position: "absolute",
      left: `${comp.left}px`,
      top: `${comp.top}px`,
      width: `${comp.width}px`,
      height: `${comp.height}px`,
      zIndex: 10,
    };

    const adjustedStyle = { ...componentStyle };

    if (comp.type === "input" && comp.labelText) {
      adjustedStyle.left = `${comp.left + comp.width + 10}px`;
    }

    if (comp.type === "input" && !comp.labelText) {
      adjustedStyle.top = `${comp.top + 30}px`;
    }

    if (comp.type === "input") {
      return (
        <HRITEM
          key={idx}
          left={comp.left}
          top={comp.top}
          width={comp.width}
          height={comp.height}
          uuid={comp.uuid}
          field={comp.field}
          value={comp.value}
          labelText={comp.labelText}
        />
      );
    }

    return null;
  };

  const sortedComponents = [...components].sort((a, b) => a.top - b.top);
  const sortedNoLabelComponents = [...noLabelComponents].sort((a, b) => a.top - b.top);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card max-w-3xl mx-auto bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="alert alert-error">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </div>
          <div className="card-actions justify-center mt-4">
            <a href="/upload" className="btn btn-primary">
              Upload XML File
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-primary">{formTitle}</h1>
        <p className="text-base-content/70 mt-2">Generated form from your XML</p>
      </div>

      <div className="card bg-base-100 shadow-xl max-w-5xl mx-auto">
        <div className="card-body">
          <div className="tabs tabs-boxed mb-4">
            <a className="tab tab-active">Form Preview</a>
            <a className="tab">Form Data</a>
            <a className="tab">Export Options</a>
          </div>

          <div
            className="bg-white border border-base-300 rounded-lg"
            style={{
              position: "relative",
              width: "100%",
              minHeight: "600px",
              maxHeight: "800px",
              overflow: "auto",
              padding: "20px",
            }}
          >
            {sortedComponents.length === 0 && sortedNoLabelComponents.length === 0 ? (
              <div className="flex justify-center items-center h-[400px]">
                <div className="text-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-base-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <h3 className="mt-4 text-lg font-medium">No form elements found</h3>
                  <p className="text-sm text-base-content/70 mt-2">The XML file doesn't contain any form elements that can be rendered.</p>
                </div>
              </div>
            ) : (
              <>
                {sortedComponents.map((comp, idx) => renderComponent(comp, idx))}

                {noLabelComponents.length > 0 && (
                  <div className="mt-8 pt-8 border-t">
                    <h3 className="text-xl font-semibold mb-4">Fields Without Labels</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {sortedNoLabelComponents.map((comp, idx) => renderComponent(comp, idx))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          <div className="card-actions justify-end mt-6">
            <button className="btn btn-outline">Reset Form</button>
            <button className="btn btn-primary">Save Form Data</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormRenderer;