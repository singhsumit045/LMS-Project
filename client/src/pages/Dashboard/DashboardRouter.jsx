import { Navigate } from "react-router-dom";

import StudentDashboard from "./StudentDashboard";
import TeacherDashboard from "./TeacherDashboard";
import AdminDashboard from "./AdminDashboard";

const DashboardRouter = () => {

    // =========================
    // GET USER
    // =========================

    const storedUser = localStorage.getItem("user");

    // =========================
    // USER NOT LOGGED IN
    // =========================

    if (!storedUser) {
        return (
            <Navigate
                to="/login"
                replace
            />
        );
    }


    // =========================
    // PARSE USER
    // =========================

    let user;

    try {

        user = JSON.parse(storedUser);

    } catch (error) {

        console.error(
            "Invalid user data:",
            error
        );

        localStorage.removeItem("user");

        return (
            <Navigate
                to="/login"
                replace
            />
        );
    }


    // =========================
    // STUDENT
    // =========================

    if (user.role === "student") {

        return <StudentDashboard />;

    }


    // =========================
    // TEACHER
    // =========================

    if (user.role === "teacher") {

        return <TeacherDashboard />;

    }


    // =========================
    // ADMIN
    // =========================

    if (user.role === "admin") {

        return <AdminDashboard />;

    }


    // =========================
    // UNKNOWN ROLE
    // =========================

    return (
        <Navigate
            to="/login"
            replace
        />
    );
};


export default DashboardRouter;