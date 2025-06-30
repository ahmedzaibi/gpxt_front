import React, { useCallback, useState, useEffect } from "react";
import axios from "axios";
import BLayout from "./backoffice/blayout";

const UploadInput = ({ onChange, isUploading }) => (
  <div className="flex flex-col items-center justify-center gap-4">
    <p className="font-semibold text-lg text-gray-800">
      Télécharger le ficher xml
    </p>
    <div className="input-div-light">
      <input
        className="input"
        name="file"
        type="file"
        onChange={onChange}
        accept=".xml, text/xml"
        disabled={isUploading}
      />
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="1em"
        height="1em"
        strokeLinejoin="round"
        strokeLinecap="round"
        viewBox="0 0 24 24"
        strokeWidth={2}
        fill="none"
        stroke="currentColor"
        className="icon"
      >
        <polyline points="16 16 12 12 8 16" />
        <line y2={21} x2={12} y1={12} x1={12} />
        <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
        <polyline points="16 16 12 12 8 16" />
      </svg>
    </div>
    {isUploading && <p className="text-blue-600">Uploading...</p>}
  </div>
);

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center items-center pt-8">
      <div className="join">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          className="join-item btn btn-neutral btn-outline"
          disabled={currentPage === 1}
        >
          «
        </button>
        <button className="join-item btn btn-neutral btn-outline pointer-events-none">
          Page {currentPage} of {totalPages}
        </button>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          className="join-item btn btn-neutral btn-outline"
          disabled={currentPage === totalPages}
        >
          »
        </button>
      </div>
    </div>
  );
};

const GPM = () => {
  const [guidedProcesses, setGuidedProcesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isXmlModalOpen, setIsXmlModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const [activeAccordion, setActiveAccordion] = useState(null);
  const [selectedXmlContent, setSelectedXmlContent] = useState("");
  const [gpToDelete, setGpToDelete] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "success",
  });

  const showNotification = (message, type = "success") => {
    setNotification({ show: true, message, type });
    setTimeout(
      () => setNotification({ show: false, message: "", type: "success" }),
      4000
    );
  };

  const fetchGPs = useCallback(async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/gp/getgps");
      let parsedData = response.data;
      if (typeof response.data === "string") {
        parsedData = JSON.parse(response.data);
      }
      if (Array.isArray(parsedData)) {
        setGuidedProcesses(parsedData);
      } else {
        throw new Error("API response was not an array.");
      }
    } catch (err) {
      console.error("Failed to fetch or parse guided processes:", err);
      setError(
        "Failed to load data. Please check the server connection and data format."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchGPs();
  }, [fetchGPs]);

  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      await axios.post("http://localhost:8080/api/forms/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setIsUploadModalOpen(false);
      showNotification("Upload successful! Refreshing list...", "success");
      setLoading(true);
      await fetchGPs();
      setCurrentPage(1);
    } catch (error) {
      console.error("Upload error:", error);
      showNotification(
        "Error uploading file. Check console for details.",
        "error"
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteGP = async () => {
    if (!gpToDelete) return;
    try {
      await axios.delete(
        `http://localhost:8080/api/gp/delete/${gpToDelete.id}`
      );
      const updatedProcesses = guidedProcesses.filter(
        (gp) => gp.id !== gpToDelete.id
      );
      setGuidedProcesses(updatedProcesses);

      const totalPages = Math.ceil(updatedProcesses.length / itemsPerPage);
      if (currentPage > totalPages && totalPages > 0) {
        setCurrentPage(totalPages);
      }

      showNotification("Process deleted successfully.", "success");
    } catch (err) {
      console.error("Error deleting guided process:", err);
      showNotification("Error deleting process.", "error");
    } finally {
      setIsDeleteModalOpen(false);
      setGpToDelete(null);
    }
  };

  const handleShowXml = (step) => {
    setSelectedXmlContent(
      step.form?.xmlContent || "No XML content available for this step."
    );
    setIsXmlModalOpen(true);
  };

  const handleDownloadXml = () => {
    if (!selectedXmlContent) return;
    const blob = new Blob([selectedXmlContent], { type: "text/xml" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "form.xml";
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  };

  const filteredProcesses = guidedProcesses.filter((gp) =>
    gp.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProcesses.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredProcesses.length / itemsPerPage);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const renderMainContent = () => {
    if (loading)
      return <div className="text-center p-10 text-gray-500">Loading...</div>;
    if (error)
      return (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative text-center">
          {error}
        </div>
      );

    return (
      <div className="card">
        <div className="blob" />
        <div className="bg">
          <div className="p-6 md:p-8">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-3xl font-bold text-gray-900">
                Guided Process Management
              </h1>
              <button
                onClick={() => setIsUploadModalOpen(true)}
                className="btn btn-neutral btn-outline"
              >
                Ajouter GP
              </button>
            </div>
            <div className="mb-6 relative">
              <input
                type="text"
                placeholder="Rechercher par nom de GP..."
                className="input input-bordered w-full"
                value={searchTerm}
                onChange={handleSearchChange}
              />
              <span className="absolute inset-y-0 right-4 flex items-center pr-3 pointer-events-none">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </span>
            </div>

            <div className="space-y-2">
              {currentItems.length > 0 ? (
                currentItems.map((gp) => (
                  <div
                    key={gp.id}
                    className="collapse collapse-arrow bg-white/80 border border-gray-200 rounded-lg shadow-sm"
                  >
                    <input
                      type="radio"
                      name="my-accordion-1"
                      id={`gp-${gp.id}`}
                      checked={activeAccordion === gp.id}
                      onChange={() =>
                        setActiveAccordion(
                          activeAccordion === gp.id ? null : gp.id
                        )
                      }
                    />
                    <div className="collapse-title text-xl font-semibold text-gray-800 flex justify-between items-center pr-12">
                      {gp.name}
                      <div className="flex items-center space-x-2 z-10">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setGpToDelete(gp);
                            setIsDeleteModalOpen(true);
                          }}
                          className="btn btn-neutral btn-outline btn-sm"
                        >
                          Supprimer
                        </button>
                      </div>
                    </div>
                    <div className="collapse-content">
                      {gp.steps?.length > 0 ? (
                        <ul className="space-y-3 p-4 border-t">
                          {gp.steps.map((step) => (
                            <li
                              key={step.id}
                              className="flex justify-between items-center p-3 bg-gray-50/50 rounded-md"
                            >
                              <div>
                                <span className="font-bold text-gray-700">
                                  Step {step.orderIndex || "N/A"}:
                                </span>
                                <span className="ml-2 text-gray-600">
                                  {step.objectName}
                                </span>
                              </div>
                              <button
                                onClick={() => handleShowXml(step)}
                                className="btn btn-neutral btn-outline btn-sm"
                              >
                                View XML
                              </button>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-gray-500 pt-2 p-4 border-t">
                          No steps defined.
                        </p>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 py-10">
                  No results found .
                </p>
              )}
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <BLayout>
      <style>{`
                /* Animated Blob Card Styles */
                .card { position: relative; width: 100%; border-radius: 14px; z-index: 1; overflow: hidden; box-shadow: 20px 20px 60px #bebebe, -20px -20px 60px #ffffff; }
                .bg { position: relative; z-index: 2; margin: 5px; width: calc(100% - 10px); background: rgba(255, 255, 255, .95); backdrop-filter: blur(24px); border-radius: 10px; overflow: hidden; outline: 2px solid white; }
                .blob { position: absolute; z-index: 1; top: 50%; left: 50%; width: 450px; height: 450px; border-radius: 50%; background-color: #ff0000; opacity: 1; filter: blur(24px); animation: blob-bounce 8s infinite ease; }
                @keyframes blob-bounce { 0% { transform: translate(-100%, -100%) translate3d(0, 0, 0); } 25% { transform: translate(-100%, -100%) translate3d(100%, 0, 0); } 50% { transform: translate(-100%, -100%) translate3d(100%, 100%, 0); } 75% { transform: translate(-100%, -100%) translate3d(0, 100%, 0); } 100% { transform: translate(-100%, -100%) translate3d(0, 0, 0); } }

                /* Upload Input Styles (Light Theme) */
                .input-div-light { position: relative; width: 100px; height: 100px; border-radius: 50%; border: 2px solid #0077ff; display: flex; justify-content: center; align-items: center; overflow: hidden; box-shadow: 0px 0px 20px rgba(0, 119, 255, 0.5), inset 0px 0px 5px rgba(0, 119, 255, 0.5); }
                .input-div-light .icon { color: #0077ff; font-size: 2rem; cursor: pointer; }
                .input-div-light .input { position: absolute; opacity: 0; width: 100%; height: 100%; cursor: pointer !important; }
            `}</style>

      {notification.show && (
        <div
          className={`fixed top-5 right-5 z-[100] p-4 rounded-lg shadow-lg text-white ${
            notification.type === "success" ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {notification.message}
        </div>
      )}

      {renderMainContent()}

      {isUploadModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4"
          onClick={() => !isUploading && setIsUploadModalOpen(false)}
        >
          <div
            className="bg-white text-gray-800 rounded-xl shadow-xl w-full max-w-lg flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold">Upload New Process</h2>
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="btn btn-sm btn-circle btn-ghost"
                disabled={isUploading}
              >
                ✕
              </button>
            </div>
            <div className="p-8">
              <UploadInput
                onChange={handleFileUpload}
                isUploading={isUploading}
              />
            </div>
          </div>
        </div>
      )}

      {isXmlModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4"
          onClick={() => setIsXmlModalOpen(false)}
        >
          <div
            className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-4 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800">
                Form XML Content
              </h3>
              <button
                onClick={() => setIsXmlModalOpen(false)}
                className="btn btn-sm btn-circle btn-ghost"
              >
                ✕
              </button>
            </div>
            <div className="p-2 sm:p-6 overflow-y-auto">
              <pre className="bg-gray-100 p-4 rounded-lg text-sm text-gray-800 whitespace-pre-wrap">
                <code>{selectedXmlContent}</code>
              </pre>
            </div>
            <div className="flex justify-end space-x-4 bg-gray-50 p-4 rounded-b-xl border-t border-gray-200">
              <button
                onClick={handleDownloadXml}
                className="btn btn-neutral btn-outline"
              >
                Download XML
              </button>
            </div>
          </div>
        </div>
      )}

      {isDeleteModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4"
          onClick={() => setIsDeleteModalOpen(false)}
        >
          <div
            className="bg-white rounded-xl shadow-xl w-full max-w-md flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 text-center">
              <svg
                className="w-16 h-16 mx-auto text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <h3 className="text-xl font-semibold text-gray-800 mt-4">
                Confirm Deletion
              </h3>
              <p className="text-gray-500 mt-2">
                Are you sure you want to delete the process:{" "}
                <span className="font-bold text-gray-700">
                  {gpToDelete?.name}
                </span>
                ? This action cannot be undone.
              </p>
            </div>
            <div className="flex justify-center space-x-4 bg-gray-50 p-4 rounded-b-xl border-t border-gray-200">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="btn btn-neutral btn-outline"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteGP}
                className="btn btn-error text-white"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </BLayout>
  );
};

export default GPM;
