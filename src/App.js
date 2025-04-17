// src/App.js
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./interfaces/login/Login"; // Correct casing for Login.js
import XMLUploader from "./interfaces/upload/XMLUploader"; // Import XMLUploader component
import FormRenderer from "./components/FormRenderer"; // Import FormRenderer component

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/upload" element={<XMLUploader />} />
        <Route path="/form-render" element={<FormRenderer />} />
      </Routes>
    </Router>
  );
}

export default App;
