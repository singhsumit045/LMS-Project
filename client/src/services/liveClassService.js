
import api from "./api";

// =====================================================
// CREATE LIVE CLASS - TEACHER / ADMIN
// POST /live-classes
// =====================================================
export const createLiveClass = async (data) => {
  return api.post("/live-classes", data);
};


// =====================================================
// GET MY LIVE CLASSES - TEACHER
// GET /live-classes/teacher/my-classes
// =====================================================
export const getMyLiveClasses = async () => {
  return api.get("/live-classes/teacher/my-classes");
};

// =====================================================
// GET SINGLE LIVE CLASS
// GET /live-classes/:id
// =====================================================
export const getLiveClass = async (id) => {
  const numericId = Number(id);

  if (
    !id ||
    !Number.isInteger(numericId) ||
    numericId <= 0
  ) {
    return Promise.reject(
      new Error(`Invalid live class ID: ${id}`)
    );
  }

  return api.get(`/live-classes/${numericId}`);
};

// =====================================================
// START LIVE CLASS - TEACHER
// POST /live-classes/:id/start
// =====================================================
export const startLiveClass = async (id) => {
  const numericId = Number(id);

  if (
    !id ||
    !Number.isInteger(numericId) ||
    numericId <= 0
  ) {
    return Promise.reject(
      new Error(`Invalid live class ID: ${id}`)
    );
  }

  return api.post(
    `/live-classes/${numericId}/start`
  );
};


// =====================================================
// END LIVE CLASS - TEACHER
// POST /live-classes/:id/end
// =====================================================
export const endLiveClass = async (id) => {
  const numericId = Number(id);

  if (
    !id ||
    !Number.isInteger(numericId) ||
    numericId <= 0
  ) {
    return Promise.reject(
      new Error(`Invalid live class ID: ${id}`)
    );
  }

  return api.post(
    `/live-classes/${numericId}/end`
  );
};

