import { useContext, useState } from "react";
import Layout from "../interfaces/frontoffice/layout";
import { DataContext } from "../context/DataContext";
import axios from "axios";

export default function RequestList() {
  const { requests } = useContext(DataContext);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [processingId, setProcessingId] = useState(null);
  const currentRole = JSON.parse(sessionStorage.getItem("current-user-ss"));

  const API_BASE_URL =
    "http://localhost:8181/https://tnhldapp0144.interpresales.mysoprahronline.com/hr-business-services-rest/business-services";
  const ROLE_PARAM = encodeURIComponent(currentRole["@name"]);

  const handleCancelRequest = async (request) => {
    setProcessingId(request["@id"]);
    const payload = {
      cancelRequests: [
        {
          "@gpId": request["@gpID"],
          "@nudoss": request["@id"],
        },
      ],
    };
    try {
      const response = await axios.post(
        `${API_BASE_URL}/cancel/requests?role=${ROLE_PARAM}`,
        payload,
        { withCredentials: true }
      );
      if (response.data?.status === "OK") {
        alert("Request successfully cancelled!");
        window.location.reload();
      } else {
        throw new Error("API responded with an error.");
      }
    } catch (err) {
      console.error("Error canceling request:", err);
      alert("An error occurred while canceling the request.");
    } finally {
      setProcessingId(null);
    }
  };

  const handleDeleteRequest = async (request) => {
    if (
      !window.confirm(
        "Are you sure you want to permanently delete this request?"
      )
    ) {
      return;
    }
    setProcessingId(request["@id"]);
    const payload = {
      deleteRequests: [
        {
          "@gpId": request["@gpID"],
          "@nudoss": request["@id"],
        },
      ],
    };
    try {
      const response = await axios.post(
        `${API_BASE_URL}/delete/requests?role=${ROLE_PARAM}`,
        payload,
        { withCredentials: true }
      );
      if (response.data?.status === "OK") {
        alert("Request successfully deleted!");
        window.location.reload();
      } else {
        throw new Error("API responded with an error.");
      }
    } catch (err) {
      console.error("Error deleting request:", err);
      alert("An error occurred while deleting the request.");
    } finally {
      setProcessingId(null);
    }
  };

  if (!requests) {
    return (
      <Layout>
        <div className="text-white text-center mt-10">no requests found</div>
      </Layout>
    );
  }

  const filteredRequests = requests.filter((request) =>
    request["@label"]?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredRequests.length / rowsPerPage);
  const startIdx = (currentPage - 1) * rowsPerPage;
  const currentRequests = filteredRequests.slice(
    startIdx,
    startIdx + rowsPerPage
  );

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
    setCurrentPage(1);
  };

  return (
    <Layout>
      <div className="flex items-center justify-center min-h-screen bg-cover bg-center pt-32">
        <div className="relative w-full max-w-5xl px-6 py-12 bg-white/10 backdrop-blur-md rounded-3xl shadow-lg border border-white/20 text-white">
          <h2 className="text-center text-3xl font-bold mb-2">Requests</h2>

          <div className="flex flex-col sm:flex-row justify-between mb-4 items-center gap-4 text-sm">
            <input
              type="text"
              placeholder="Chercher par label"
              value={searchTerm}
              onChange={handleSearchChange}
              className="px-3 py-1 rounded bg-white/10 text-white placeholder-white/70 border border-white/20 focus:outline-none focus:ring-1 focus:ring-white"
            />
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
                  <th className="px-4 py-2 border-b border-white/30">Label</th>
                  <th className="px-4 py-2 border-b border-white/30">
                    Recipient
                  </th>
                  <th className="px-4 py-2 border-b border-white/30">Status</th>
                  <th className="px-4 py-2 border-b border-white/30">
                    Start Date
                  </th>
                  <th className="px-4 py-2 border-b border-white/30 text-center">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white/5">
                {currentRequests.map((request, index) => {
                  const isProcessing = processingId === request["@id"];

                  return (
                    <tr
                      key={index}
                      className="hover:bg-white/10 transition-colors border-t border-white/10"
                    >
                      <td className="px-4 py-2">
                        {request["@label"] || "N/A"}
                      </td>
                      <td className="px-4 py-2">
                        {request["@recipient"] || "N/A"}
                      </td>
                      <td className="px-4 py-2">
                        {request["@status"] || "N/A"}
                      </td>
                      <td className="px-4 py-2">
                        {request["@startDate"] || "N/A"}
                      </td>
                      <td className="px-4 py-2 text-center">
                        {request["@status"] === "EN COURS" && (
                          <button
                            onClick={() => handleCancelRequest(request)}
                            disabled={isProcessing}
                            className="font-semibold text-yellow-400 hover:text-yellow-300 disabled:opacity-50 transition-colors"
                          >
                            {isProcessing ? "Canceling..." : "Annuler"}
                          </button>
                        )}

                        {request["@status"] === "Annulé par le demandeur" && (
                          <button
                            onClick={() => handleDeleteRequest(request)}
                            disabled={isProcessing}
                            className="font-semibold text-red-400 hover:text-red-300 disabled:opacity-50 transition-colors"
                          >
                            {isProcessing ? "Deleting..." : "Delete"}
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center mt-8 text-white/80 text-sm">
            <p>Total records: {filteredRequests.length}</p>
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
