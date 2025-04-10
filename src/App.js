import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./interfaces/login/Login";
import XMLUploader from "./interfaces/upload/XMLUploader";
import FormRenderer from "./components/FormRenderer";
import Layout from "./components/Layout";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <Layout>
            <Login />
          </Layout>
        } />
        <Route path="/upload" element={
          <Layout>
            <XMLUploader />
          </Layout>
        } />
        <Route path="/form-render" element={
          <Layout>
            <FormRenderer />
          </Layout>
        } />
      </Routes>
    </Router>
  );
}

export default App;