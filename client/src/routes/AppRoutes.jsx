
import { Routes, Route } from "react-router-dom";

// Layout
import MainLayout from "../layouts/MainLayout";

// Components
import ProtectedRoute from "../components/ProtectedRoute";
import RoleProtectedRoute from "../components/RoleProtectedRoute";

// Pages
import Home from "../pages/Home/Home";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import Dashboard from "../pages/Dashboard/Dashboard";
import Profile from "../pages/Profile/Profile";
import NotFound from "../pages/NotFound/NotFound";

// Courses
import CourseList from "../pages/Courses/CourseList";
import CreateCourse from "../pages/Courses/CreateCourse";
import CourseDetails from "../pages/Courses/CourseDetails";

import MyCourses from "../pages/MyCourses/MyCourse";
import ManageCourseContent from "../pages/Courses/ManageCourseContent/ManageCourseContent";
import ManageVideos from "../pages/ManageVideos/ManageVideos";

// Teacher
// import TeacherDashboard from "../pages/teacher/TeacherDashboard";


const AppRoutes = ({ darkMode, toggleTheme }) => {
  return (
    <Routes>

      {/* =========================
          PUBLIC ROUTES
      ========================= */}

      <Route path="/" element={<Home />} />

      <Route path="/login" element={<Login />} />

      <Route path="/register" element={<Register />} />


      {/* =========================
          PROTECTED ROUTES
          WITH MAIN LAYOUT
      ========================= */}

      <Route
        element={
          <ProtectedRoute>
            <MainLayout
              darkMode={darkMode}
              toggleTheme={toggleTheme}
            />
          </ProtectedRoute>
        }
      >

        {/* =========================
            COMMON DASHBOARD
        ========================= */}

        <Route
          path="/dashboard"
          element={<Dashboard />}
        />


        {/* =========================
            TEACHER DASHBOARD
        ========================= */}

        {/* <Route
          path="/teacher/dashboard"
          element={
            <RoleProtectedRoute
              allowedRoles={["teacher"]}
            >
              <TeacherDashboard />
            </RoleProtectedRoute>
          }
        /> */}


        {/* =========================
            PROFILE
        ========================= */}

        <Route
          path="/profile"
          element={<Profile />}
        />


        {/* =========================
            COURSES
        ========================= */}

        <Route
          path="/courses"
          element={<CourseList />}
        />


        {/* =========================
            COURSE DETAILS
        ========================= */}

        <Route
          path="/courses/:id"
          element={<CourseDetails />}
        />


        {/* =========================
            MANAGE COURSE CONTENT
        ========================= */}

        <Route
          path="/courses/:id/manage-content"
          element={
            <RoleProtectedRoute
              allowedRoles={["teacher", "admin"]}
            >
              <ManageCourseContent />
            </RoleProtectedRoute>
          }
        />


        {/* =========================
            MANAGE VIDEOS
        ========================= */}

        <Route
          path="/courses/:id/manage-videos"
          element={
            <RoleProtectedRoute
              allowedRoles={["teacher", "admin"]}
            >
              <ManageVideos />
            </RoleProtectedRoute>
          }
        />


        {/* =========================
            CREATE COURSE
        ========================= */}

        <Route
          path="/courses/create"
          element={
            <RoleProtectedRoute
              allowedRoles={["teacher", "admin"]}
            >
              <CreateCourse />
            </RoleProtectedRoute>
          }
        />


        {/* =========================
            MY COURSES
        ========================= */}

        <Route
          path="/my-courses"
          element={<MyCourses />}
        />

      </Route>


      {/* =========================
          404
      ========================= */}

      <Route
        path="*"
        element={<NotFound />}
      />

    </Routes>
  );
};


export default AppRoutes;

