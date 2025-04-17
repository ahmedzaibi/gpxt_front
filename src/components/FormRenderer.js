import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import HRITEM from "./HRITEM";
import HRTEXT from "./HRTEXT";
import HROUTPUT from "./HROUTPUT.jsx";
import HREDIT from "./HREDIT.jsx";

const FormRenderer = () => {
  const location = useLocation();
  const xmlData = location.state?.xmlData;
  const [components, setComponents] = useState([]);

  useEffect(() => {
    if (!xmlData) return;

    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlData, "text/xml");
    const extractLabel = (hrTextNode) => {
      var lang = localStorage.getItem("lang");
      const labelNode = hrTextNode.querySelector("HRLABELS > HRLABEL");
      if (labelNode) {
      if(lang){
          var label= Array.from(labelNode.childNodes)
          .filter((node) => node.nodeType === Node.ELEMENT_NODE && node.getAttribute("Lang") === lang)
          if(label.length>0){
              return label[0].textContent.trim();
          }
      }
          label= Array.from(labelNode.childNodes)
          .filter((node) => node.nodeType === Node.TEXT_NODE)
          if (label.length > 0) {
          return label[0].nodeValue.trim();
          }
      }
      return "";
  };
    const parseComponents = () => {
      const parsed = [];

      // Parse HRITEMs
      const itemNodes = Array.from(xmlDoc.getElementsByTagName("HRITEM"));
      itemNodes.forEach((item) => {
        const itemObj = {
          uuid: item.getAttribute("uuid"),
          type: "HRITEM",
          field: item.getAttribute("Field"),
          left: parseInt(item.getAttribute("Left") || "0", 10),
          top: parseInt(item.getAttribute("Top") || "0", 10),
          width: parseInt(item.getAttribute("Width") || "150", 10),
          height: parseInt(item.getAttribute("Height") || "40", 10),
          children: [],
        };
        
      

        // Check for HRTEXT child
        const hrText = item.querySelector("HRTEXT");
        if (hrText) {
          itemObj.children.push({
            type: "HRTEXT",
            label: extractLabel(hrText),
            left: parseInt(hrText.getAttribute("Left") || "0", 10),
            top: parseInt(hrText.getAttribute("Top") || "0", 10),
            width: parseInt(hrText.getAttribute("Width") || "100", 10),
            height: parseInt(hrText.getAttribute("Height") || "20", 10),
          });
        }
        const hredit = item.querySelector("HREDIT");
        if (hredit) {
          itemObj.children.push({
            type: "HREDIT",
            left: parseInt(hredit.getAttribute("Left") || "0", 10),
            top: parseInt(hredit.getAttribute("Top") || "0", 10),
            width: parseInt(hredit.getAttribute("Width") || "100", 10),
            height: parseInt(hredit.getAttribute("Height") || "20", 10),
          });
          console.log(hredit.getAttribute("Left"))
        }
        // Check for HROUTPUT child
        const hrOutput = item.querySelector("HROUTPUT");
        if (hrOutput) {
          itemObj.children.push({
            type: "HROUTPUT",
            value: hrOutput.textContent.trim(),
            left: parseInt(hrOutput.getAttribute("Left") || "0", 10),
            top: parseInt(hrOutput.getAttribute("Top") || "0", 10),
            width: parseInt(hrOutput.getAttribute("Width") || "100", 10),
            height: parseInt(hrOutput.getAttribute("Height") || "20", 10),
          });
        }

        parsed.push(itemObj);
      });

      // Parse standalone HRTEXT
      
      const textNodes = Array.from(xmlDoc.getElementsByTagName("HRTEXT"));
      textNodes.forEach((el) => {
        const isInsideItem = el.closest("HRITEM");
        if (!isInsideItem) {
          parsed.push({
            type: "HRTEXT",
            label: extractLabel(el),
            left: parseInt(el.getAttribute("Left") || "0", 10),
            top: parseInt(el.getAttribute("Top") || "0", 10),
            width: parseInt(el.getAttribute("Width") || "150", 10),
            height: parseInt(el.getAttribute("Height") || "40", 10),
          });
        }
      });

      const hredits = Array.from(xmlDoc.getElementsByTagName("HREDIT"));
      hredits.forEach((el) => {
        const isInsideItem = el.closest("HRITEM");
        if (!isInsideItem) {
          parsed.push({
            type: "HREDIT",
            label: extractLabel(el),
            left: parseInt(el.getAttribute("Left") || "0", 10),
            top: parseInt(el.getAttribute("Top") || "0", 10),
            width: parseInt(el.getAttribute("Width") || "150", 10),
            height: parseInt(el.getAttribute("Height") || "40", 10),
          });
        }
      });

      // Parse standalone HROUTPUT
      const outputNodes = Array.from(xmlDoc.getElementsByTagName("HROUTPUT"));
      outputNodes.forEach((el) => {
        const isInsideItem = el.closest("HRITEM");
        if (!isInsideItem) {
          parsed.push({
            type: "HROUTPUT",
            value: el.textContent.trim(),
            left: parseInt(el.getAttribute("Left") || "0", 10),
            top: parseInt(el.getAttribute("Top") || "0", 10),
            width: parseInt(el.getAttribute("Width") || "150", 10),
            height: parseInt(el.getAttribute("Height") || "40", 10),
          });
        }
      });


      setComponents(parsed);
    };

    parseComponents();
  }, [xmlData]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4 py-8">
      <div className="w-full max-w-6xl p-6 shadow-xl bg-white border rounded-lg">
        <h2 className="text-3xl font-bold mb-6 text-center">🧾 Dynamic Form</h2>

        <div
          className="relative bg-gray-50 border border-dashed border-gray-300 overflow-auto mx-auto"
          style={{
            width: "100%",
            position: "relative",
          }}
        >
          {components.map((comp, idx) => {
            if (comp.type === "HRITEM") {
              return (
                <HRITEM
                  key={idx}
                  left={comp.left}
                  top={comp.top}
                  width={comp.width}
                  height={comp.height}
                  field={comp.field}
                >
                  {comp.children.map((child, cidx) =>
                    child.type === "HRTEXT" ? (
                      <HRTEXT
                        key={cidx}
                        label={child.label}
                        left={child.left}
                        top={child.top}
                        width={child.width}
                        height={child.height}
                      />
                    ) : (child.type === "HROUTPUT" ? (
                      <HROUTPUT
                        key={cidx}
                        value={child.value}
                        left={child.left}
                        top={child.top}
                        width={child.width}
                        height={child.height}
                      />
                    ) : (
                      <HREDIT
                        key={idx}
                        value={child.value}
                        left={child.left}
                        top={child.top}
                        width={child.width}
                        height={child.height}
                      />
                    ))
                  )}
                </HRITEM>
              );
            } else if (comp.type === "HRTEXT") {
              return (
                <HRTEXT
                  key={idx}
                  label={comp.label}
                  left={comp.left}
                  top={comp.top}
                  width={comp.width}
                  height={comp.height}
                />
              );
            } else if (comp.type === "HROUTPUT") {
              return (
                <HROUTPUT
                  key={idx}
                  value={comp.value}
                  left={comp.left}
                  top={comp.top}
                  width={comp.width}
                  height={comp.height}
                />
              );
            }else if (comp.type === "HREDIT") {
              return (
                <HREDIT
                  key={idx}
                  value={comp.value}
                  left={comp.left}
                  top={comp.top}
                  width={comp.width}
                  height={comp.height}
                />
              );
            }
            return null;
          })}
        </div>
      </div>
    </div>
  );
};

export default FormRenderer;
