import React, { createContext, useState } from "react";

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [requests, setRequests] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [closedTasks, setClosedTasks] = useState([]);

  const value = {
    requests,
    setRequests,
    documents,
    setDocuments,
    notifications,
    setNotifications,
    tasks,
    setTasks,
    closedTasks,
    setClosedTasks,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};
