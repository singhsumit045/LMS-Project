import api from "./api";

export const createEnrollment = (courseId) => {
  return api.post("/enrollments", {
    courseId,
  });
};

export const getEnrollments = () => {
  return api.get("/enrollments");
};

// Logged-in user's enrolled courses
export const getMyCourses = () => {
  return api.get("/enrollments/my-courses");
};

export const getEnrollmentById = (id) => {
  return api.get(`/enrollments/${id}`);
};

export const updateEnrollment = (id, progress) => {
  return api.patch(`/enrollments/${id}`, {
    progress,
  });
};

export const deleteEnrollment = (id) => {
  return api.delete(`/enrollments/${id}`);
};