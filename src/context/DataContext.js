import React, { createContext, useState } from "react";

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [requests, setRequests] = useState([]);
  const [reports, setReports] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [closedTasks, setClosedTasks] = useState([]);
  const [menudata, setmenudata] = useState([]);
  const value = {
    menudata,
    setmenudata,
    requests,
    setRequests,
    reports,
    setReports,
    notifications,
    setNotifications,
    tasks,
    setTasks,
    closedTasks,
    setClosedTasks,
  };

  return (
    <DataContext.Provider value={(isAuthenticated, setIsAuthenticated, value)}>
      {children}
    </DataContext.Provider>
  );
};
