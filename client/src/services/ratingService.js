import api from "./api";


// =====================================================
// CREATE RATING
// POST /ratings
// =====================================================

export const createRating = (data) => {
  return api.post("/ratings", data);
};


// =====================================================
// GET ALL RATINGS OF COURSE
// GET /ratings/course/:courseId
// =====================================================

export const getCourseRatings = (courseId) => {
  return api.get(`/ratings/course/${courseId}`);
};


// =====================================================
// GET AVERAGE RATING
// GET /ratings/course/:courseId/average
// =====================================================

export const getAverageRating = (courseId) => {
  return api.get(
    `/ratings/course/${courseId}/average`
  );
};


// =====================================================
// UPDATE RATING
// PATCH /ratings/:id
// =====================================================

export const updateRating = (
  id,
  data
) => {
  return api.patch(
    `/ratings/${id}`,
    data
  );
};

// =====================================================
// DELETE RATING
// DELETE /ratings/:id
// =====================================================

export const deleteRating = (id) => {
  return api.delete(
    `/ratings/${id}`
  );
};