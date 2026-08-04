
import api from "./api";

// =====================================================
// CREATE QUESTION
// =====================================================

export const createQuestion = async (
  examId,
  questionData
) => {
  const response = await api.post(
    `/exams/${examId}/questions`,
    questionData
  );

  return response.data;
};

// =====================================================
// GET QUESTIONS BY EXAM
// =====================================================

export const getQuestionsByExam = async (
  examId
) => {
  const response = await api.get(
    `/exams/${examId}/questions`
  );

  return response.data;
};

// =====================================================
// GET QUESTION BY ID
// =====================================================

export const getQuestionById = async (
  questionId
) => {
  const response = await api.get(
    `/exams/questions/${questionId}`
  );

  return response.data;
};

// =====================================================
// UPDATE QUESTION
// =====================================================

export const updateQuestion = async (
  questionId,
  questionData
) => {
  const response = await api.patch(
    `/exams/questions/${questionId}`,
    questionData
  );

  return response.data;
};

// =====================================================
// DELETE QUESTION
// =====================================================

export const deleteQuestion = async (
  questionId
) => {
  const response = await api.delete(
    `/exams/questions/${questionId}`
  );

  return response.data;
};

