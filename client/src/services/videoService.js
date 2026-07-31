
import api from "./api";

// =========================
// UPLOAD VIDEO
// =========================

export const uploadVideo = (
  title,
  description,
  courseId,
  videoFile
) => {
  const formData = new FormData();

  formData.append("title", title);
  formData.append("description", description);
  formData.append("courseId", courseId);
  formData.append("video", videoFile);

  return api.post("/videos/upload", formData);
};

// =========================
// GET VIDEOS BY COURSE
// =========================

export const getVideosByCourse = (courseId) => {
  return api.get(`/videos/course/${courseId}`);
};

