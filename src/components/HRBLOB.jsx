import React, { useEffect, useState } from "react";
import styled from "styled-components";

const HRBLOB = ({ node, children }) => {
  const [imageData, setImageData] = useState(null);
  const id = node.getAttribute("ID") || Math.random().toString();

  useEffect(() => {
    const saved = localStorage.getItem("formData");
    if (saved) {
      const data = JSON.parse(saved);
      if (data[id]) setImageData(data[id]);
    }
  }, [id]);

  const handleChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageData(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const left = parseInt(node.getAttribute("Left") || "0", 10);
  const top = parseInt(node.getAttribute("Top") || "0", 10);

  return (
    <StyledWrapper
      style={{
        position: "absolute",
        left: `${left}px`,
        top: `${top}px`,
      }}
    >
      <div className="input-div">
        <input
          className="input"
          name="file"
          type="file"
          data-id={id}
          onChange={handleChange}
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
        {imageData && (
          <img
            src={imageData}
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
