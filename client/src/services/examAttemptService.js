
import api from "./api";

// =====================================================
// START EXAM
// =====================================================

export const startExam = async (examId) => {
  const response = await api.post(
    `/exams/${examId}/start`
  );

  return response.data;
};

// =====================================================
// SUBMIT EXAM
// =====================================================

export const submitExam = async (
  attemptId,
  answers
) => {
  const response = await api.post(
    `/exams/attempts/${attemptId}/submit`,
    {
      answers,
    }
  );

  return response.data;
};

// =====================================================
// GET EXAM RESULT BY ATTEMPT ID
// =====================================================

export const getExamResult = async (
  attemptId
) => {
  const response = await api.get(
    `/exams/attempts/${attemptId}/result`
  );

  return response.data;
};

// =====================================================
// GET LAST RESULT OF CURRENT STUDENT
// =====================================================

export const getLastResult = async (
  examId
) => {
  const response = await api.get(
    `/exams/${examId}/last-result`
  );

  return response.data;
};

