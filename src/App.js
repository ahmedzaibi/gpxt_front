import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./interfaces/login/Login";
import XMLUploader from "./interfaces/upload/XMLUploader";
import Chatbot from "./components/chatbot";
import FormRenderer from "./components/FormRenderer";
import PrivateRoute from "../src/interfaces/login/PrivateRoute";
import Logout from "./interfaces/login/Logout";
import Profile from "./interfaces/profile/profile";
import XmlFormsList from "./interfaces/XmlFormsList";
import UserList from "./interfaces/user-list";
import { DataProvider } from "./context/DataContext";
import TaskList from "./interfaces/TaskList";
import RequestList from "./interfaces/RequestList";
import ReportList from "./interfaces/ReportList";
import NotificationList from "./interfaces/NotificationList";
import SessionRestorer from "./interfaces/login/SessionRestorer";
import ChangePassword from "./interfaces/login/ChangePassword";
function App() {
  return (
    <DataProvider>
      <SessionRestorer />
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/cp" element={<ChangePassword />} />
          <Route path="/" element={<Login />} />
          <Route element={<PrivateRoute />}>
            <Route path="/logout" element={<Logout />} />
            <Route path="/Profile" element={<Profile />} />
            <Route path="/Users" element={<UserList />} />
            <Route path="/XmlFormList" element={<XmlFormsList />} />
            <Route path="/chatbot" element={<Chatbot />} />
            <Route path="/tasks" element={<TaskList />} />
            <Route path="/request" element={<RequestList />} />
            <Route path="/tasks" element={<TaskList />} />
            <Route path="/report" element={<ReportList />} />
            <Route path="/upload" element={<XMLUploader />} />
            <Route path="/notification" element={<NotificationList />} />
            <Route path="/form-render" element={<FormRenderer />} />
          </Route>
        </Routes>
      </Router>
    </DataProvider>
  );
}

export default App;
