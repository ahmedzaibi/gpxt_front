import React from "react";

const HRINFODATAGRID = ({ node }) => {
  const left = parseInt(node.getAttribute("Left") || "0", 10);
  const top = parseInt(node.getAttribute("Top") || "0", 10);
  const width = parseInt(node.getAttribute("Width") || "600", 10);
  const height = parseInt(node.getAttribute("Height") || "200", 10);

  const columns = Array.from(node.getElementsByTagName("HRCOLUMN")).map(
    (col) => {
      const labelsNode = col.getElementsByTagName("HRLABEL")[0];
      const labelText =
        labelsNode?.childNodes[0]?.nodeValue?.trim() || "Colonne";
      return labelText;
    }
  );

  return (
    <div
      style={{
        position: "absolute",
        left,
        top,
        width,
        height,
        overflowX: "auto",
        border: "1px solid rgba(255, 255, 255, 0.2)",
        borderRadius: "6px",
      }}
      className="bg-white/5 text-white text-sm"
    >
      <table className="w-full border-collapse">
        <thead className="bg-white/10 text-left">
          <tr>
            {columns.map((label, index) => (
              <th key={index} className="px-2 py-1 border-b border-white/20">
                {label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td
              colSpan={columns.length}
              className="px-2 py-2 italic text-white/70 text-center"
            >
              Il n'y a pas d'éléments
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default HRINFODATAGRID;
