import api from "./api";

// =====================================================
// TEACHER - CREATE LIVE CLASS
// =====================================================
export const createLiveClass = (data) => {
    return api.post("/live-classes", data);
};



// =====================================================
// TEACHER - MY LIVE CLASSES
// =====================================================
export const getMyLiveClasses = () => {
    return api.get("/live-classes/teacher/my-classes");
};

// =====================================================
// STUDENT - AVAILABLE LIVE CLASSES
// =====================================================
export const getStudentLiveClasses = () => {
    return api.get("/live-classes/student/available");
};

// =====================================================
// GET SINGLE LIVE CLASS
// =====================================================
export const getLiveClass = (id) => {
    if (!id || !Number.isInteger(Number(id))) {
        return Promise.reject(
            new Error("Invalid live class ID")
        );
    }

    return api.get(`/live-classes/${Number(id)}`);
};

// =====================================================
// TEACHER - START LIVE CLASS
// =====================================================
export const startLiveClass = (id) => {
    if (!id || !Number.isInteger(Number(id))) {
        return Promise.reject(
            new Error("Invalid live class ID")
        );
    }

    return api.post(
        `/live-classes/${Number(id)}/start`
    );
};

// =====================================================
// TEACHER - END LIVE CLASS
// =====================================================
export const endLiveClass = (id) => {
    if (!id || !Number.isInteger(Number(id))) {
        return Promise.reject(
            new Error("Invalid live class ID")
        );
    }

    return api.post(
        `/live-classes/${Number(id)}/end`
    );
};