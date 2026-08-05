import api from "./api";

// Start Exam
export const startExam = async (examId) => {
  const response = await api.post(`/exams/${examId}/start`);
  return response.data;
};

// Submit Exam
export const submitExam = async (attemptId, answers) => {
  const response = await api.post(
    `/exams/attempts/${attemptId}/submit`,
    {
      answers,
    }
  );
  return response.data;
};

// Get Exam Result
export const getExamResult = async (attemptId) => {
  const response = await api.get(
    `/exams/attempts/${attemptId}/result`
  );

  return response.data;
};