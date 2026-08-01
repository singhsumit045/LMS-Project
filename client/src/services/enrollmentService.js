import api from "./api";

// =====================================================
// CREATE ENROLLMENT
// =====================================================

export const createEnrollment = (courseId) => {
  return api.post("/enrollments", {
    courseId,
  });
};

// =====================================================
// GET ALL ENROLLMENTS
// =====================================================

export const getEnrollments = () => {
  return api.get("/enrollments");
};

// =====================================================
// STUDENT - MY COURSES
// =====================================================

export const getMyCourses = () => {
  return api.get("/enrollments/my-courses");
};

// =====================================================
// TEACHER - DASHBOARD
// =====================================================

export const getTeacherDashboard = () => {
  return api.get("/enrollments/teacher/dashboard");
};

// =====================================================
// GET ENROLLMENT BY ID
// =====================================================

export const getEnrollmentById = (id) => {
  return api.get(`/enrollments/${id}`);
};

// =====================================================
// UPDATE ENROLLMENT PROGRESS
// =====================================================

export const updateEnrollment = (id, progress) => {
  return api.patch(`/enrollments/${id}`, {
    progress,
  });
};

// =====================================================
// DELETE ENROLLMENT
// =====================================================

export const deleteEnrollment = (id) => {
  return api.delete(`/enrollments/${id}`);
};