import api from "./api";

export const createCourse = (data) => {
  return api.post("/courses", data);
};

export const getCourses = () => {
  return api.get("/courses");
};

export const getCourseById = (id) => {
  return api.get(`/courses/${id}`);
};

export const updateCourse = (id, data) => {
  return api.patch(`/courses/${id}`, data);
};

export const deleteCourse = (id) => {
  return api.delete(`/courses/${id}`);
};