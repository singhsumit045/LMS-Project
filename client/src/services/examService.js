import api from "./api";

// =====================================================
// CREATE EXAM
// =====================================================

export const createExam = async (examData) => {
  const response = await api.post(
    "/exams",
    examData
  );

  return response.data;
};

// =====================================================
// GET ALL EXAMS
// =====================================================

export const getTeacherExams  = async () => {
  const response = await api.get(
    "/exams/teacher"
  );

  return response.data;
};

// =====================================================
// GET EXAM BY ID
// =====================================================

export const getExamById = async (id) => {
  const response = await api.get(
    `/exams/${id}`
  );

  return response.data;
};

// =====================================================
// UPDATE EXAM
// =====================================================

export const updateExam = async (
  id,
  examData
) => {
  const response = await api.patch(
    `/exams/${id}`,
    examData
  );

  return response.data;
};

// =====================================================
// DELETE EXAM
// =====================================================

export const deleteExam = async (id) => {
  const response = await api.delete(
    `/exams/${id}`
  );

  return response.data;
};

// =====================================================
// GET TEACHER EXAM RESULTS
// =====================================================

export const getTeacherExamResults =
  async () => {
    const response = await api.get(
      "/exams/teacher/results"
    );

    return response.data;
  };