
import { Routes, Route } from "react-router-dom";

// =========================
// Layout
// =========================

import MainLayout from "../layouts/MainLayout";

// =========================
// Components
// =========================

import ProtectedRoute from "../components/ProtectedRoute";
import RoleProtectedRoute from "../components/RoleProtectedRoute";

// =========================
// Pages
// =========================

import Home from "../pages/Home/Home";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";

import DashboardRouter from "../pages/Dashboard/DashboardRouter";

import Profile from "../pages/Profile/Profile";
import NotFound from "../pages/NotFound/NotFound";

// =========================
// Courses
// =========================

import CourseList from "../pages/Courses/CourseList";
import CreateCourse from "../pages/Courses/CreateCourse";
import EditCourse from "../pages/Courses/EditCourse";
import CourseDetails from "../pages/Courses/CourseDetails";

import MyCourses from "../pages/MyCourses/MyCourse";

import ManageCourseContent from "../pages/Courses/ManageCourseContent/ManageCourseContent";

import ManageVideos from "../pages/Courses/ManageVideos/ManageVideos";

import ManageNotes from "../pages/Courses/ManageNotes/ManageNotes";

import ManageAnnouncements from "../pages/Courses/ManageAnnouncements/ManageAnnouncements";

// =========================
// EXAM
// =========================

import ManageExams from "../pages/Courses/ManageExam/ManageExam";
import ManageQuestions from "../pages/Courses/ManageExam/ManageQuestions";
import StudentExam from "../pages/Courses/ManageExam/StudentExam";
import ExamResult from "../pages/Courses/ManageExam/ExamResult";
import StudentExamResult from "../pages/Courses/ManageExam/StudentExamResult";


import CertificateDetails from "../pages/Courses/Certificates/CertificateDetails";

// =========================
// Admin
// =========================

import ManageUsers from "../pages/Admin/ManageUsers";
import ManageEnrollments from "../pages/Admin/ManageEnrollments";
import ManageCourses from "../pages/Admin/ManageCourses";


import ForgotPassword from "../pages/ResetPassword/ResetPassword";
import VerifyEmail from "../pages/VerifyEmail/VerifyEmail";

// =========================
// APP ROUTES
// =========================

const AppRoutes = ({ darkMode, toggleTheme }) => {
  return (
    <Routes>

      {/* =====================================================
          PUBLIC ROUTES
      ===================================================== */}

      <Route
        path="/"
        element={<Home />}
      />

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/register"
        element={<Register />}
      />


      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/verify-email" element={<VerifyEmail />} />
      {/* =====================================================
          PROTECTED ROUTES
          ALL INSIDE MAIN LAYOUT
      ===================================================== */}

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

        {/* =================================================
            DASHBOARD
        ================================================= */}

        <Route
          path="/dashboard"
          element={<DashboardRouter />}
        />

        {/* =================================================
            PROFILE
        ================================================= */}

        <Route
          path="/profile"
          element={<Profile />}
        />

        {/* =================================================
            COURSES
        ================================================= */}

        <Route
          path="/courses"
          element={<CourseList />}
        />

        <Route
          path="/courses/:id"
          element={<CourseDetails />}
        />

        {/* =================================================
            CREATE COURSE
            TEACHER + ADMIN
        ================================================= */}

        <Route
          path="/courses/create"
          element={
            <RoleProtectedRoute
              allowedRoles={[
                "teacher",
                "admin",
              ]}
            >
              <CreateCourse />
            </RoleProtectedRoute>
          }
        />

        {/* =================================================
            MANAGE COURSE CONTENT
            TEACHER + ADMIN
        ================================================= */}

        <Route
          path="/courses/:id/manage-content"
          element={
            <RoleProtectedRoute
              allowedRoles={[
                "teacher",
                "admin",
              ]}
            >
              <ManageCourseContent />
            </RoleProtectedRoute>
          }
        />

        {/* =================================================
            EDIT COURSE
            TEACHER + ADMIN
        ================================================= */}

        <Route
          path="/courses/edit/:id"
          element={
            <RoleProtectedRoute
              allowedRoles={[
                "teacher",
                "admin",
              ]}
            >
              <EditCourse />
            </RoleProtectedRoute>
          }
        />

        {/* =================================================
            MANAGE VIDEOS
            TEACHER + ADMIN
        ================================================= */}

        <Route
          path="/courses/:id/manage-videos"
          element={
            <RoleProtectedRoute
              allowedRoles={[
                "teacher",
                "admin",
              ]}
            >
              <ManageVideos />
            </RoleProtectedRoute>
          }
        />

        {/* =================================================
            MANAGE NOTES
            TEACHER + ADMIN
        ================================================= */}

        <Route
          path="/courses/:id/manage-notes"
          element={
            <RoleProtectedRoute
              allowedRoles={[
                "teacher",
                "admin",
              ]}
            >
              <ManageNotes />
            </RoleProtectedRoute>
          }
        />

        {/* =================================================
            MANAGE ANNOUNCEMENTS
            TEACHER + ADMIN
        ================================================= */}

        <Route
          path="/courses/:id/manage-announcements"
          element={
            <RoleProtectedRoute
              allowedRoles={[
                "teacher",
                "admin",
              ]}
            >
              <ManageAnnouncements />
            </RoleProtectedRoute>
          }
        />

        {/* =================================================
            MANAGE EXAMS
            TEACHER + ADMIN
        ================================================= */}

        <Route
          path="/courses/:id/manage-exams"
          element={
            <RoleProtectedRoute
              allowedRoles={[
                "teacher",
                "admin",
              ]}
            >
              <ManageExams />
            </RoleProtectedRoute>
          }
        />

        {/* =================================================
            MANAGE QUESTIONS
        ================================================= */}

        <Route
          path="/exams/:examId/questions"
          element={<ManageQuestions />}
        />

        {/* =================================================
            STUDENT EXAM ATTEMPT
        ================================================= */}

        <Route
          path="/exams/:examId/attempt"
          element={<StudentExam />}
        />

        {/* =================================================
    STUDENT EXAM RESULT
================================================= */}

        <Route
          path="/exams/attempts/:attemptId/result"
          element={<StudentExamResult />}
        />

        {/* =================================================
            TEACHER EXAM RESULTS
        ================================================= */}

        <Route
          path="/teacher/exam-results"
          element={
            <RoleProtectedRoute
              allowedRoles={["teacher"]}
            >
              <ExamResult />
            </RoleProtectedRoute>
          }
        />

        {/* =================================================
            MY COURSES
        ================================================= */}

        <Route
          path="/my-courses"
          element={<MyCourses />}
        />


        <Route
          path="/certificate/:certificateId"
          element={
            <ProtectedRoute>
              <CertificateDetails />
            </ProtectedRoute>
          }
        />

        {/* =================================================
            ADMIN - MANAGE USERS
        ================================================= */}

        <Route
          path="/admin/users"
          element={
            <RoleProtectedRoute
              allowedRoles={["admin"]}
            >
              <ManageUsers />
            </RoleProtectedRoute>
          }
        />

        {/* =================================================
            ADMIN - MANAGE ENROLLMENTS
        ================================================= */}

        <Route
          path="/admin/enrollments"
          element={
            <RoleProtectedRoute
              allowedRoles={["admin"]}
            >
              <ManageEnrollments />
            </RoleProtectedRoute>
          }
        />

        {/* =================================================
            ADMIN - MANAGE COURSES
        ================================================= */}

        <Route
          path="/admin/courses"
          element={
            <RoleProtectedRoute
              allowedRoles={["admin"]}
            >
              <ManageCourses />
            </RoleProtectedRoute>
          }
        />

      </Route>


      {/* =====================================================
          404
      ===================================================== */}

      <Route
        path="*"
        element={<NotFound />}
      />

    </Routes>
  );
};

export default AppRoutes;

