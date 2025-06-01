import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./interfaces/login/Login";
import XMLUploader from "./interfaces/upload/XMLUploader";
import FormRenderer from "./components/FormRenderer";
import PrivateRoute from "../src/interfaces/login/PrivateRoute";
import Logout from "./interfaces/login/Logout";
import ProfileGPX from "./interfaces/profile/profileGPX";
import XmlFormsList from "./interfaces/XmlFormsList";
import UserList from "./interfaces/user-list";
import { DataProvider } from "./context/DataContext";
import TaskList from "./interfaces/TaskList";
import RequestList from "./interfaces/RequestList";
import ReportList from "./interfaces/ReportList";
import NotificationList from "./interfaces/NotificationList";
import SessionRestorer from "./interfaces/login/SessionRestorer";

function App() {
  return (
    <DataProvider>
      <SessionRestorer />
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Login />} />
          <Route element={<PrivateRoute />}>
            <Route path="/logout" element={<Logout />} />
            <Route path="/Profile" element={<ProfileGPX />} />
            <Route path="/Users" element={<UserList />} />
            <Route path="/XmlFormList" element={<XmlFormsList />} />
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
