import api from "./api";

export const getAnalyticsOverview = () => {
    return api.get("/admin/analytics/overview");
};

export const getMonthlyUsers = () => {
    return api.get("/admin/analytics/user-growth");
};


export const getCourseEnrollment = () => {
    return api.get("/admin/analytics/course-enrollment");
};


export const getTopCourses = () => {
 return api.get("/admin/analytics/top-courses");
};