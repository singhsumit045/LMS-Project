import { useEffect, useState } from "react";

import StudentDashboard from "./StudentDashboard";
import TeacherDashboard from "./TeacherDashboard";

const Dashboard = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Invalid user data:", error);
      }
    }
  }, []);

  if (!user) {
    return null;
  }

  // =========================
  // TEACHER DASHBOARD
  // =========================

  if (user.role === "teacher") {
    return <TeacherDashboard />;
  }

  // =========================
  // STUDENT DASHBOARD
  // =========================

  return <StudentDashboard />;
};

export default Dashboard;