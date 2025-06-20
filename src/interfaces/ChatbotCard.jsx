import React, { useState } from "react";
import styled from "styled-components";
import Chatbot from "../components/chatbot";

const ChatbotCard = () => {
  const [open, setOpen] = useState(false);

  return (
    <Wrapper>
      {!open && (
        <ToggleButton onClick={() => setOpen(true)}>
          demander à l'IA
        </ToggleButton>
      )}

      {open && (
        <div className="chatbot-container">
          <div className="chatbot-card">
            <div className="chatbot-header">
              <span className="title">demander à l'IA</span>
              <button className="close" onClick={() => setOpen(false)}>
                ✖
              </button>
            </div>
            <div className="chatbot-body">
              <Chatbot />
            </div>
          </div>
        </div>
      )}
    </Wrapper>
  );
};

export default ChatbotCard;
const Wrapper = styled.div`
  position: fixed;
  bottom: 1.5rem;
  right: 1.5rem;
  z-index: 1000;

  .chatbot-container {
    width: 350px;
    height: 480px;
  }

  .chatbot-card {
    background-color: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(12px);
    border-radius: 1.5rem;
    padding: 1rem;
    border: 1px solid rgba(255, 255, 255, 0.2);
    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
    color: white;
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .chatbot-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  }

  .chatbot-header .title {
    font-weight: bold;
    font-size: 1.1rem;
  }

  .chatbot-header .close {
    background: transparent;
    border: none;
    color: white;
    font-size: 1.2rem;
    cursor: pointer;
  }

  .chatbot-body {
    flex: 1;
    overflow-y: auto;
    margin-top: 1rem;
  }
`;

const ToggleButton = styled.button`
  background-color: #7e00b5;
  color: white;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 10px 10px 0 0;
  font-weight: bold;
  cursor: pointer;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
`;
