import api from "./api";

// ======================================
// Get All Notifications
// ======================================

export const getNotifications = () => {
  return api.get("/notifications");
};

// ======================================
// Get Unread Count
// ======================================

export const getUnreadCount = () => {
  return api.get("/notifications/unread-count");
};

// ======================================
// Mark Single Notification as Read
// ======================================

export const markAsRead = (id) => {
  return api.patch(`/notifications/${id}/read`);
};

// ======================================
// Mark All Notifications as Read
// ======================================

export const markAllAsRead = () => {
  return api.patch("/notifications/read-all");
};