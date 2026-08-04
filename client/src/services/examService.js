import api from "./api";

// Create Exam
export const createExam = async (examData) => {
  const response = await api.post("/exams", examData);
  return response.data;
};

// Get All Exams
export const getAllExams = async () => {
  const response = await api.get("/exams");
  return response.data;
};

// Get Exam By ID
export const getExamById = async (id) => {
  const response = await api.get(`/exams/${id}`);
  return response.data;
};

// Update Exam
export const updateExam = async (id, examData) => {
  const response = await api.patch(`/exams/${id}`, examData);
  return response.data;
};

// Delete Exam
export const deleteExam = async (id) => {
  const response = await api.delete(`/exams/${id}`);
  return response.data;
};