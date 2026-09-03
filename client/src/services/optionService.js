import api from "./api";

// =====================================================
// CREATE OPTION
// =====================================================

export const createOption = async (
  questionId,
  optionData
) => {
  const response = await api.post(
    `/exams/questions/${questionId}/options`,
    optionData
  ); 

  return response.data;
};

// =====================================================
// GET OPTIONS BY QUESTION
// =====================================================

export const getOptionsByQuestion = async (
  questionId
) => {
  const response = await api.get(
    `/exams/questions/${questionId}/options`
  );

  return response.data;
};

// =====================================================
// UPDATE OPTION
// =====================================================

export const updateOption = async (
  optionId,
  optionData
) => {
  const response = await api.patch(
    `/exams/options/${optionId}`,
    optionData
  );

  return response.data;
};

// =====================================================
// DELETE OPTION
// =====================================================

export const deleteOption = async (optionId) => {
  const response = await api.delete(
    `/exams/options/${optionId}`
  );

  return response.data;
};