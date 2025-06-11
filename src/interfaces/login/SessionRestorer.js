import { useEffect, useContext, useRef } from "react";
import { DataContext } from "../../context/DataContext";
import axios from "axios";

const SessionRestorer = () => {
  const {
    setmenudata,
    setReports,
    setRequests,
    setNotifications,
    setTasks,
    setClosedTasks,
  } = useContext(DataContext);

  const hasFetchedRef = useRef(false);

  useEffect(() => {
    if (hasFetchedRef.current) return;
    hasFetchedRef.current = true;

    const userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
    const currentRole = JSON.parse(sessionStorage.getItem("current-user-ss"));

    if (!userInfo || !currentRole) return;

    const roleParam = encodeURIComponent(currentRole["@name"]);

    const baseUrl =
      "http://localhost:8181/https://tnhldapp0144.interpresales.mysoprahronline.com/hr-business-services-rest/business-services";

    const endpoints = {
      requests: `${baseUrl}/requests?role=${roleParam}`,
      notifications: `${baseUrl}/notifications?role=${roleParam}`,
      tasks: `${baseUrl}/tasks?role=${roleParam}`,
      reports: `${baseUrl}/query?role=${roleParam}`,
      closedTasks: `${baseUrl}/closedtasks?role=${roleParam}`,
      menudata: `${baseUrl}/gpmenu?path=employee&role=${roleParam}`,
    };

    const fetchAll = async () => {
      try {
        const [
          requestsRes,
          notificationsRes,
          tasksRes,
          reportsRes,
          closedTasksRes,
          menuRes,
        ] = await Promise.all([
          axios.get(endpoints.requests, { withCredentials: true }),
          axios.get(endpoints.notifications, { withCredentials: true }),
          axios.get(endpoints.tasks, { withCredentials: true }),
          axios.get(endpoints.reports, { withCredentials: true }),
          axios.get(endpoints.closedTasks, { withCredentials: true }),
          axios.get(endpoints.menudata, { withCredentials: true }),
        ]);

        setRequests(requestsRes.data.request || []);
        setNotifications(notificationsRes.data.notification || []);
        setTasks(tasksRes.data.task || []);
        setReports(reportsRes.data.query || []);
        setClosedTasks(closedTasksRes.data.closedTask || []);
        setmenudata(menuRes.data.topic || []);
      } catch (error) {
        console.error("Error restoring session data:", error);
      }
    };

    fetchAll();
  }, [
    setmenudata,
    setReports,
    setRequests,
    setNotifications,
    setTasks,
    setClosedTasks,
  ]);

  return null;
};

export default SessionRestorer;
