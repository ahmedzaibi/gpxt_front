import React, { useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { useFieldId } from "../hooks/useFieldId";

const HRBLOB = ({ node, children }) => {
  const id = useFieldId(node);
  const [imagePreview, setImagePreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file, file.name);

    const UPLOAD_TARGET_URL = `https://tnhldapp0144.interpresales.mysoprahronline.com//hr-business-services-rest/business-services/fileresource/upload`;
    const PROXY_UPLOAD_URL = `http://localhost:8181/${UPLOAD_TARGET_URL}`;

    try {
      console.log(`Uploading ${file.name} to ${PROXY_UPLOAD_URL}`);

      await axios.post(PROXY_UPLOAD_URL, formData, {
        withCredentials: true,
      });

      console.log(`File ${file.name} uploaded successfully.`);
    } catch (error) {
      console.error("File upload failed:", error);
      alert(
        `Error uploading file: ${
          error.response?.data?.message || error.message
        }`
      );
      setImagePreview(null);
    } finally {
      setIsUploading(false);
    }
  };

  if (!id) {
    return (
      <div style={{ color: "red", position: "absolute" }}>
        Error: Input misconfigured (no valid ID)
      </div>
    );
  }

  const left = parseInt(node.getAttribute("Left") || "0", 10);
  const top = parseInt(node.getAttribute("Top") || "0", 10);

  return (
    <StyledWrapper
      style={{ position: "absolute", left: `${left}px`, top: `${top}px` }}
    >
      <div className="input-div">
        {isUploading && <div className="upload-indicator">Uploading...</div>}
        <input
          className="input"
          name="file"
          type="file"
          data-id={id}
          onChange={handleChange}
          disabled={isUploading}
        />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="2rem"
          height="2rem"
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
        {imagePreview && (
          <img
            src={imagePreview}
            alt="Uploaded"
            className="preview"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              borderRadius: "50%",
              zIndex: 0,
            }}
          />
        )}
      </div>
      {children}
    </StyledWrapper>
  );
};

export default HRBLOB;

const StyledWrapper = styled.div`
  .input-div {
    position: relative;
    width: 100px;
    height: 100px;
    border-radius: 50%;
    border: 2px solid rgb(1, 235, 252);
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    box-shadow: 0px 0px 100px rgb(1, 235, 252),
      inset 0px 0px 10px rgb(1, 235, 252), 0px 0px 5px rgb(255, 255, 255);
    animation: flicker 2s linear infinite;
    z-index: 1;
  }

  .icon {
    color: rgb(1, 235, 252);
    font-size: 2rem;
    cursor: pointer;
    animation: iconflicker 2s linear infinite;
    z-index: 2;
  }

  .input {
    position: absolute;
    opacity: 0;
    width: 100%;
    height: 100%;
    cursor: pointer !important;
    z-index: 3;
  }

  @keyframes flicker {
    0%,
    10%,
    30%,
    100% {
      border: 2px solid rgb(1, 235, 252);
      box-shadow: 0px 0px 100px rgb(1, 235, 252),
        inset 0px 0px 10px rgb(1, 235, 252), 0px 0px 5px rgb(255, 255, 255);
    }
    5%,
    25% {
      border: none;
      box-shadow: none;
    }
  }

  @keyframes iconflicker {
    0%,
    10%,
    30%,
    100% {
      opacity: 1;
    }
    5%,
    25% {
      opacity: 0.2;
    }
  }
`;
