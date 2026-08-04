import api from "./api";

// =====================================================
// CREATE ANNOUNCEMENT
// =====================================================

export const createAnnouncement = (data) => {
  return api.post("/announcements", data);
};

// =====================================================
// GET ANNOUNCEMENTS BY COURSE
// =====================================================

export const getAnnouncementsByCourse = (courseId) => {
  return api.get(`/announcements/course/${courseId}`);
};

// =====================================================
// GET SINGLE ANNOUNCEMENT
// =====================================================

export const getAnnouncementById = (id) => {
  return api.get(`/announcements/${id}`);
};

// =====================================================
// UPDATE ANNOUNCEMENT
// =====================================================

export const updateAnnouncement = (id, data) => {
  return api.patch(`/announcements/${id}`, data);
};

// =====================================================
// DELETE ANNOUNCEMENT
// =====================================================

export const deleteAnnouncement = (id) => {
  return api.delete(`/announcements/${id}`);
};