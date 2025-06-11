import React, { useState } from "react";
import Groq from "groq-sdk";
const groq = new Groq({
  apiKey: "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",
  dangerouslyAllowBrowser: true,
});
export default function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const getGroqChatCompletion = () => {
    return groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "meta-llama/llama-4-scout-17b-16e-instruct",
    });
  };
  const sendMessage = async () => {
    // Print the completion returned by the LLM.
    if (!prompt.trim()) return;

    const userMessage = { sender: "user", text: prompt };
    setMessages((prev) => [...prev, userMessage]);
    setPrompt(
      "If the questionis not about a sopra steria solution, repond with i cant respond and list the solutions" +
        userMessage
    );
    setLoading(true);
    setError(null);

    try {
      const chatCompletion = await getGroqChatCompletion();
      const botMessage = {
        sender: "bot",
        text: chatCompletion.choices[0]?.message?.content || "No reply.",
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      setError("Failed to fetch response.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <div className="max-w-md mx-auto p-4 border rounded-xl shadow-lg">
      <h2 className="text-xl font-bold mb-4">Simple Chatbot</h2>
      <div className="h-64 overflow-y-auto border p-2 mb-4 bg-gray-50 rounded">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`mb-2 ${
              msg.sender === "user" ? "text-right" : "text-left"
            }`}
          >
            <span
              className={`inline-block px-3 py-2 rounded-lg ${
                msg.sender === "user"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-black"
              }`}
            >
              {msg.text}
            </span>
          </div>
        ))}
        {loading && (
          <div className="text-sm text-gray-400">Bot is typing...</div>
        )}
      </div>

      {error && <div className="text-red-500 mb-2 text-sm">{error}</div>}

      <div className="flex gap-2">
        <input
          className="flex-1 border p-2 rounded"
          placeholder="Type your message..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          disabled={loading}
        >
          Send
        </button>
      </div>
    </div>
  );
}
