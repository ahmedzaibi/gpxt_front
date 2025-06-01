import { useContext, useState } from "react";
import Layout from "../interfaces/frontoffice/layout";
import { DataContext } from "../context/DataContext";

export default function ReportList() {
  const { reports } = useContext(DataContext);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  if (!reports || reports.length === 0) {
    return (
      <Layout>
        <div className="text-white text-center mt-10">Loading reports...</div>
      </Layout>
    );
  }

  const filteredReports = reports.filter((report) =>
    report["@titre"]?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredReports.length / rowsPerPage);
  const startIdx = (currentPage - 1) * rowsPerPage;
  const currentReport = filteredReports.slice(startIdx, startIdx + rowsPerPage);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleRowsPerPageChange = (e) => {
    setRowsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // reset to first page on search
  };

  return (
    <Layout>
      <div
        className="flex items-center justify-center min-h-screen bg-cover bg-center pt-32"
        style={{
          backgroundImage: "url('/images/bg_login.png')",
          backgroundSize: "cover",
          backgroundPosition: "90% 36%",
        }}
      >
        <div className="relative w-full max-w-5xl px-6 py-12 bg-white/10 backdrop-blur-md rounded-3xl shadow-lg border border-white/20 text-white">
          <h2 className="text-center text-3xl font-bold mb-2">Reports</h2>

          {/* Top controls */}
          <div className="flex flex-col sm:flex-row justify-between mb-4 items-center gap-4 text-sm">
            {/* Search Field */}
            <input
              type="text"
              placeholder="Chercher par label"
              value={searchTerm}
              onChange={handleSearchChange}
              className="px-3 py-1 rounded bg-white/10 text-white placeholder-white/70 border border-white/20 focus:outline-none focus:ring-1 focus:ring-white"
            />

            {/* Rows per page selector */}
            <div className="flex items-center gap-2">
              <label htmlFor="rowsPerPage" className="text-white/80">
                Rows per page:
              </label>
              <select
                id="rowsPerPage"
                value={rowsPerPage}
                onChange={handleRowsPerPageChange}
                className="bg-white/20 backdrop-blur-sm rounded-lg px-2 py-1 text-white border border-white/30"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={15}>15</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full table-auto text-sm text-white border-collapse">
              <thead>
                <tr className="bg-white/20 text-left uppercase text-xs tracking-wider">
                  <th className="px-4 py-2 border-b border-white/30">Title</th>
                  <th className="px-4 py-2 border-b border-white/30">Code</th>
                </tr>
              </thead>
              <tbody className="bg-white/5">
                {currentReport.map((report, index) => (
                  <tr
                    key={index}
                    className="hover:bg-white/10 transition-colors border-t border-white/10"
                  >
                    <td className="px-4 py-2">{report["@titre"] || "N/A"}</td>

                    <td className="px-4 py-2">{report["@code"] || "N/A"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer: Total records + Pagination */}
          <div className="flex flex-col md:flex-row justify-between items-center mt-8 text-white/80 text-sm">
            <p>Total records: {filteredReports.length}</p>

            <div className="flex items-center gap-2 mt-4 md:mt-0">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                className="px-2 py-1 bg-white/10 border border-white/20 rounded hover:bg-white/20"
                disabled={currentPage === 1}
              >
                ⬅
              </button>
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                className="px-2 py-1 bg-white/10 border border-white/20 rounded hover:bg-white/20"
                disabled={currentPage === totalPages}
              >
                ➡
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
