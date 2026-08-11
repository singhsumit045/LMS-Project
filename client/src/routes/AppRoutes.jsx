
import { Routes, Route } from "react-router-dom";

// =========================
// Layout
// =========================
import MainLayout from "../layouts/MainLayout";

// =========================
// Route Guards
// =========================
import ProtectedRoute from "../components/ProtectedRoute";
import RoleProtectedRoute from "../components/RoleProtectedRoute";

// =========================
// Public Pages
// =========================
import Home from "../pages/Home/Home";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import ForgotPassword from "../pages/ResetPassword/ResetPassword";
import VerifyEmail from "../pages/VerifyEmail/VerifyEmail";
import NotFound from "../pages/NotFound/NotFound";

// =========================
// Dashboard
// =========================
import DashboardRouter from "../pages/Dashboard/DashboardRouter";

// =========================
// Profile
// =========================
import Profile from "../pages/Profile/Profile";

// =========================
// Courses
// =========================
import CourseList from "../pages/Courses/CourseList";
import CourseDetails from "../pages/Courses/CourseDetails";
import CreateCourse from "../pages/Courses/CreateCourse";
import EditCourse from "../pages/Courses/EditCourse";
import MyCourses from "../pages/MyCourses/MyCourse";

import ManageCourseContent from "../pages/Courses/ManageCourseContent/ManageCourseContent";
import ManageVideos from "../pages/Courses/ManageVideos/ManageVideos";
import ManageNotes from "../pages/Courses/ManageNotes/ManageNotes";
import ManageAnnouncements from "../pages/Courses/ManageAnnouncements/ManageAnnouncements";

// =========================
// Exams
// =========================
import ManageExams from "../pages/Courses/ManageExam/ManageExam";
import ManageQuestions from "../pages/Courses/ManageExam/ManageQuestions";
import StudentExam from "../pages/Courses/ManageExam/StudentExam";
import ExamResult from "../pages/Courses/ManageExam/ExamResult";
import StudentExamResult from "../pages/Courses/ManageExam/StudentExamResult";

// =========================
// Certificates
// =========================
import CertificateDetails from "../pages/Courses/Certificates/CertificateDetails";

// =========================
// Admin
// =========================
import ManageUsers from "../pages/Admin/ManageUsers";
import ManageEnrollments from "../pages/Admin/ManageEnrollments";
import ManageCourses from "../pages/Admin/ManageCourses";

// =========================
// Live Classes
// =========================
import LiveClassRoom from "../pages/live-class/LiveClassRoom";
import CreateLiveClass from "../pages/live-class/CreateLiveClass";


import AIAssistant from "../pages/AI/AIAssistant";

// =====================================================
// APP ROUTES
// =====================================================

const AppRoutes = ({ darkMode, toggleTheme }) => {
  return (
    <Routes>

      {/* =================================================
          PUBLIC ROUTES
      ================================================= */}

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

      <Route
        path="/forgot-password"
        element={<ForgotPassword />}
      />

      <Route
        path="/verify-email"
        element={<VerifyEmail />}
      />


      <Route
        path="/ai-assistant"
        element={
          <ProtectedRoute>
            <AIAssistant />
          </ProtectedRoute>
        }
      />


      {/* =================================================
          PROTECTED ROUTES
          MainLayout
      ================================================= */}

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
            LIVE CLASS
            IMPORTANT:

            /live-class/create MUST come before
            /live-class/:liveClassId
        ================================================= */}

        <Route
          path="/live-class/create"
          element={
            <RoleProtectedRoute
              allowedRoles={["teacher", "admin"]}
            >
              <CreateLiveClass />
            </RoleProtectedRoute>
          }
        />

        <Route
          path="/live-class/:liveClassId"
          element={<LiveClassRoom />}
        />


        {/* =================================================
            CREATE COURSE
            TEACHER + ADMIN
        ================================================= */}

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


        {/* =================================================
            EDIT COURSE
            TEACHER + ADMIN
        ================================================= */}

        <Route
          path="/courses/edit/:id"
          element={
            <RoleProtectedRoute
              allowedRoles={["teacher", "admin"]}
            >
              <EditCourse />
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
              allowedRoles={["teacher", "admin"]}
            >
              <ManageCourseContent />
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
              allowedRoles={["teacher", "admin"]}
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
              allowedRoles={["teacher", "admin"]}
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
              allowedRoles={["teacher", "admin"]}
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
              allowedRoles={["teacher", "admin"]}
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


        {/* =================================================
            CERTIFICATE
        ================================================= */}

        <Route
          path="/certificate/:certificateId"
          element={<CertificateDetails />}
        />


        {/* =================================================
            ADMIN - USERS
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
            ADMIN - ENROLLMENTS
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
            ADMIN - COURSES
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


      {/* =================================================
          404
      ================================================= */}

      <Route
        path="*"
        element={<NotFound />}
      />

    </Routes>
  );
};

export default AppRoutes;

