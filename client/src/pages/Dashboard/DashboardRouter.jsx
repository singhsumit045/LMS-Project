import { Navigate } from "react-router-dom";

import StudentDashboard from "./StudentDashboard";
import TeacherDashboard from "./TeacherDashboard";
import Dashboard from "./Dashboard";

const DashboardRouter = () => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
        return <Navigate to="/login" replace />;
    }

    let user;

    try {
        user = JSON.parse(storedUser);
    } catch (error) {
        console.error("Invalid user data:", error);

        localStorage.removeItem("user");

        return <Navigate to="/login" replace />;
    }

    if (user.role === "student") {
        return <StudentDashboard />;
    }

    if (user.role === "teacher") {
        return <TeacherDashboard />;
    }

    if (user.role === "admin") {
        return <Dashboard />;
    }

    return <Navigate to="/login" replace />;
};

export default DashboardRouter;