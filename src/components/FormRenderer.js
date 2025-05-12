import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import HRITEM from "./HRITEM";
import HRTEXT from "./HRTEXT";
import HROUTPUT from "./HROUTPUT.jsx";
import HREDIT from "./HREDIT.jsx";
import HRPAGE from "./HRPAGE.jsx";
import Layout from "../interfaces/frontoffice/layout.js";
const FormRenderer = () => {
  const location = useLocation();
  const xmlData = location.state?.xmlData;
  const [components, setComponents] = useState([]);
  const [labelNode, setLabelNode] = useState("no label found");
  useEffect(() => {
    if (!xmlData) return;

    const parser = new DOMParser();
    const definedlm = {
      HRPAGE: HRPAGE,
      HRITEM: HRITEM,
      HRTEXT: HRTEXT,
      HROUTPUT: HROUTPUT,
      HREDIT: HREDIT,
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
          var elemChildren = [];
          if (child.hasChildNodes) {
            elemChildren = getChildren(child.childNodes);
          }
          const elem = React.createElement(definedlm[child.tagName], {
            node: child,
            children: elemChildren,
          });
          children.push(elem);
        }
        if (
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
      const node = Array.from(xmlDoc.getElementsByTagName("HRPAGE"))[0];
      var children = getChildren(node.childNodes);
      const elem = React.createElement(definedlm[node.tagName], {
        node: node,
        children: children,
      });
      parsed.push(elem);
      console.log(parsed);
      setComponents(parsed);
    };
    parseComponents();
    if (hrpageLabelnode) {
      setLabelNode(hrpageLabelnode.getAttribute("Label"));
  }
  else {setLabelNode("no label found")}
  
  }, [xmlData,labelNode]);



  return (
    <Layout>
      <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4 py-8">
        <div className="w-full max-w-6xl p-6 shadow-xl bg-white border rounded-lg">
          <h2 className="text-3xl font-bold mb-6 text-center">{labelNode}</h2>

          <div
            className="relative bg-gray-50 border border-dashed border-gray-300 overflow-auto mx-auto"
            style={{
              width: "100%",
              position: "relative",
            }}
          >
            {components[0]}
            {}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default FormRenderer;
