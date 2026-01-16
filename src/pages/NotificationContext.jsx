import React, { createContext, useContext, useState, useEffect } from 'react';

const NotificationContext = createContext();

export const useNotificationContext = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotificationContext must be used within NotificationProvider');
  }
  return context;
};

const API = "https://projects.growtechnologies.in/srisaigroups/api";

export function NotificationProvider({ children }) {
  const [notifyCount, setNotifyCount] = useState(0);
  const [formsCount, setFormsCount] = useState(0);

  const user = JSON.parse(localStorage.getItem("user"));

  // Function to refresh notification count
  const refreshNotificationCount = () => {
    if (!user?.role) return;

    fetch(`${API}/notifications/user_notifications.php?user_type=${user.role}`, { cache: "no-store" })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          const visitedNotificationIds = localStorage.getItem('visitedNotificationIds') || '';
          const visitedIds = visitedNotificationIds.split(',').filter(Boolean);
          const newNotifications = data.filter(notif => !visitedIds.includes(String(notif.id)));
          setNotifyCount(newNotifications.length);
        }
      })
      .catch(err => console.error("Notification count error:", err));
  };

  // Function to refresh forms count
  const refreshFormsCount = () => {
    fetch(`${API}/forms/list.php`, { cache: "no-store" })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          const visitedFormIds = localStorage.getItem('visitedFormIds') || '';
          const visitedIds = visitedFormIds.split(',').filter(Boolean);
          const newForms = data.filter(form => !visitedIds.includes(String(form.id)));
          setFormsCount(newForms.length);
        }
      })
      .catch(err => console.error("Forms count error:", err));
  };

  // Function to mark notifications as visited
  const markNotificationsVisited = (notificationIds) => {
    localStorage.setItem('visitedNotificationIds', notificationIds.join(','));
    localStorage.setItem('lastVisitedNotificationsTime', Date.now().toString());
    setNotifyCount(0); // Immediately hide count
  };

  // Function to mark forms as visited
  const markFormsVisited = (formIds) => {
    localStorage.setItem('visitedFormIds', formIds.join(','));
    localStorage.setItem('lastVisitedFormsTime', Date.now().toString());
    setFormsCount(0); // Immediately hide count
  };

  // Initial load
  useEffect(() => {
    refreshNotificationCount();
    refreshFormsCount();
  }, [user?.role]);

  return (
    <NotificationContext.Provider
      value={{
        notifyCount,
        formsCount,
        refreshNotificationCount,
        refreshFormsCount,
        markNotificationsVisited,
        markFormsVisited
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}