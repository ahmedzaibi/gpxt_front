// src/App.js
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./interfaces/login/Login"; 
import XMLUploader from "./interfaces/upload/XMLUploader"; 
import FormRenderer from "./components/FormRenderer";
import PrivateRoute from "../src/interfaces/login/PrivateRoute";
import Logout from "./interfaces/login/Logout";
import Profile from "./interfaces/profile/profile";
function App() {
  return (
    <Router>
      
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Login />} />
            <Route element={<PrivateRoute />}> 
            <Route path="/Profile" element={<Profile />} />
            <Route path="/logout" element={<Logout />} />  
            <Route path="/upload" element={<XMLUploader />} />
            <Route path="/form-render" element={<FormRenderer />} />
            </Route>
          </Routes>
        
    </Router>
  );
}

export default App;
