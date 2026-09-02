import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { Box, CircularProgress } from "@mui/material";

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
// Public Pages (lazy)
// =========================
const Home = lazy(() => import("../pages/Home/Home"));
const Login = lazy(() => import("../pages/Login/Login"));
const Register = lazy(() => import("../pages/Register/Register"));
const ForgotPassword = lazy(() =>
  import("../pages/ResetPassword/ResetPassword")
);
const VerifyEmail = lazy(() =>
  import("../pages/VerifyEmail/VerifyEmail")
);
const NotFound = lazy(() => import("../pages/NotFound/NotFound"));

// =========================
// Dashboard (lazy)
// =========================
const DashboardRouter = lazy(() =>
  import("../pages/Dashboard/DashboardRouter")
);

// =========================
// Profile (lazy)
// =========================
const Profile = lazy(() => import("../pages/Profile/Profile"));

// =========================
// Courses (lazy)
// =========================
const CourseList = lazy(() => import("../pages/Courses/CourseList"));
const CourseDetails = lazy(() =>
  import("../pages/Courses/CourseDetails")
);
const CreateCourse = lazy(() =>
  import("../pages/Courses/CreateCourse")
);
const EditCourse = lazy(() => import("../pages/Courses/EditCourse"));
const MyCourses = lazy(() => import("../pages/MyCourses/MyCourse"));

const ManageCourseContent = lazy(() =>
  import("../pages/Courses/ManageCourseContent/ManageCourseContent")
);
const ManageVideos = lazy(() =>
  import("../pages/Courses/ManageVideos/ManageVideos")
);
const ManageNotes = lazy(() =>
  import("../pages/Courses/ManageNotes/ManageNotes")
);
const ManageAnnouncements = lazy(() =>
  import("../pages/Courses/ManageAnnouncements/ManageAnnouncements")
);

// =========================
// Exams (lazy)
// =========================
const ManageExams = lazy(() =>
  import("../pages/Courses/ManageExam/ManageExam")
);
const ManageQuestions = lazy(() =>
  import("../pages/Courses/ManageExam/ManageQuestions")
);
const StudentExam = lazy(() =>
  import("../pages/Courses/ManageExam/StudentExam")
);
const ExamResult = lazy(() =>
  import("../pages/Courses/ManageExam/ExamResult")
);
const StudentExamResult = lazy(() =>
  import("../pages/Courses/ManageExam/StudentExamResult")
);

// =========================
// Certificates (lazy)
// =========================
const CertificateDetails = lazy(() =>
  import("../pages/Courses/Certificates/CertificateDetails")
);

// =========================
// Admin (lazy)
// =========================
const ManageUsers = lazy(() => import("../pages/Admin/ManageUsers"));
const ManageEnrollments = lazy(() =>
  import("../pages/Admin/ManageEnrollments")
);
const ManageCourses = lazy(() =>
  import("../pages/Admin/ManageCourses")
);

// =========================
// Live Classes (lazy)
// =========================
const LiveClassRoom = lazy(() =>
  import("../pages/live-class/LiveClassRoom")
);
const CreateLiveClass = lazy(() =>
  import("../pages/live-class/CreateLiveClass")
);

// =========================
// AI (lazy)
// =========================
const AIAssistant = lazy(() => import("../pages/AI/AIAssistant"));
const AIQuizGenerator = lazy(() =>
  import("../pages/AI/AIQuizGenerator")
);

// =========================
// Support (lazy)
// =========================
const HelpCenter = lazy(() => import("../pages/support/HelpCenter"));
const ContactUs = lazy(() => import("../pages/support/ContactUs"));
const PrivacyPolicy = lazy(() =>
  import("../pages/support/PrivacyPolicy")
);

// =====================================================
// LOADING FALLBACK
// =====================================================

const PageLoader = () => (
  <Box
    sx={{
      minHeight: "60vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <CircularProgress />
  </Box>
);

// =====================================================
// APP ROUTES
// =====================================================

const AppRoutes = ({ darkMode, toggleTheme }) => {
  return (
    <Suspense fallback={<PageLoader />}>
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

        {/* =================================================
            TEACHER AI QUIZ GENERATOR
        ================================================= */}

        <Route
          path="/teacher/ai-quiz-generator"
          element={
            <RoleProtectedRoute
              allowedRoles={["teacher"]}
            >
              <AIQuizGenerator />
            </RoleProtectedRoute>
          }
        />

        {/* =================================================
            SUPPORT / PUBLIC PAGES
        ================================================= */}

        <Route
          path="/help"
          element={<HelpCenter />}
        />

        <Route
          path="/contact"
          element={<ContactUs />}
        />

        <Route
          path="/privacy"
          element={<PrivacyPolicy />}
        />

        {/* =================================================
            PROTECTED ROUTES
            MAIN LAYOUT
            
            IMPORTANT:
            AI ASSISTANT IS INSIDE MAINLAYOUT
            SO NAVBAR WILL BE VISIBLE.
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
              AI ASSISTANT
              STUDENT ONLY

              MainLayout ke andar hone ki wajah se
              Navbar automatically visible rahega.
          ================================================= */}

          <Route
            path="/ai-assistant"
            element={
              <AIAssistant />

            }
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
          ================================================= */}

          <Route
            path="/live-class/create"
            element={
              <RoleProtectedRoute
                allowedRoles={[
                  "teacher",
                  "admin",
                ]}
              >
                <CreateLiveClass />
              </RoleProtectedRoute>
            }
          />

          <Route
            path="/live-class/:id"
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
    </Suspense>
  );
};

export default AppRoutes;
