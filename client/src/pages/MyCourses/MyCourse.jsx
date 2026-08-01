import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Box,
  CircularProgress,
  Alert,
  Chip,
} from "@mui/material";

import {
  School,
  ArrowForward,
} from "@mui/icons-material";

import {
  getMyCourses,
  getTeacherDashboard,
} from "../../services/enrollmentService";

const MyCourse = () => {
  const navigate = useNavigate();

  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);

  // =========================
  // GET USER
  // =========================

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.log("User data error:", error);
      }
    }
  }, []);

  // =========================
  // FETCH COURSES
  // =========================

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError("");

      const storedUser = localStorage.getItem("user");

      let currentUser = null;

      try {
        currentUser = storedUser
          ? JSON.parse(storedUser)
          : null;
      } catch (error) {
        console.log("User data error:", error);
      }

      // =====================================
      // TEACHER
      // =====================================

      if (currentUser?.role === "teacher") {
        const response = await getTeacherDashboard();

        const teacherCourses =
          response.data?.courses || [];

        // Teacher dashboard ke courses ko
        // enrollment format me convert kar rahe hain
        const formattedCourses =
          teacherCourses.map((course) => ({
            id: course.id,
            course: course,
            progress: 0,
            completed: false,
          }));

        setEnrollments(formattedCourses);

        return;
      }

      // =====================================
      // STUDENT
      // =====================================

      const response = await getMyCourses();

      setEnrollments(response.data || []);
    } catch (error) {
      console.log("My courses error:", error);

      setError(
        error.response?.data?.message ||
          "Unable to load your courses."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
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
  }

  // =========================
  // ROLE
  // =========================

  const isTeacher = user?.role === "teacher";

  return (
    <Container
      maxWidth="xl"
      sx={{
        py: {
          xs: 3,
          md: 5,
        },
      }}
    >
      {/* =========================
          HEADER
      ========================= */}

      <Typography
        variant="h4"
        fontWeight={700}
        sx={{
          fontSize: {
            xs: "2rem",
            md: "2.5rem",
          },
        }}
      >
        My Courses
      </Typography>

      <Typography
        color="text.secondary"
        sx={{
          mt: 1,
          mb: 4,
        }}
      >
        {isTeacher
          ? "Courses you have created"
          : "Courses you are currently enrolled in"}
      </Typography>

      {/* =========================
          ERROR
      ========================= */}

      {error && (
        <Alert
          severity="error"
          sx={{
            mb: 3,
            borderRadius: 2,
          }}
        >
          {Array.isArray(error)
            ? error.join(", ")
            : error}
        </Alert>
      )}

      {/* =========================
          NO COURSES
      ========================= */}

      {enrollments.length === 0 ? (
        <Box
          sx={{
            textAlign: "center",
            py: 8,
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 3,
          }}
        >
          <School
            sx={{
              fontSize: 60,
              color: "text.secondary",
              mb: 2,
            }}
          />

          <Typography
            variant="h6"
            fontWeight={600}
          >
            {isTeacher
              ? "You haven't created any course yet."
              : "You haven't enrolled in any course yet."}
          </Typography>

          <Typography
            color="text.secondary"
            sx={{
              mt: 1,
            }}
          >
            {isTeacher
              ? "Create your first course to start teaching."
              : "Explore our courses and start learning."}
          </Typography>

          <Button
            variant="contained"
            sx={{
              mt: 3,
              borderRadius: 2,
              textTransform: "none",
            }}
            onClick={() =>
              navigate(
                isTeacher
                  ? "/courses/create"
                  : "/courses"
              )
            }
          >
            {isTeacher
              ? "Create Course"
              : "Explore Courses"}
          </Button>
        </Box>
      ) : (
        /* =========================
            COURSE GRID
        ========================= */

        <Grid container spacing={3}>
          {enrollments.map((enrollment) => {
            const course = enrollment.course;

            if (!course) {
              return null;
            }

            return (
              <Grid
                key={enrollment.id}
                size={{
                  xs: 12,
                  sm: 6,
                  md: 4,
                  lg: 3,
                }}
              >
                <Card
                  elevation={0}
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 3,
                    overflow: "hidden",
                    transition: "0.2s",

                    "&:hover": {
                      transform: "translateY(-5px)",
                      boxShadow: 5,
                    },
                  }}
                >
                  {/* =========================
                      COURSE THUMBNAIL
                  ========================= */}

                  <Box
                    sx={{
                      height: 180,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      background:
                        "linear-gradient(135deg, #1976d2, #7b1fa2)",
                      color: "white",
                      overflow: "hidden",
                    }}
                  >
                    {course.thumbnail ? (
                      <Box
                        component="img"
                        src={course.thumbnail}
                        alt={course.title}
                        sx={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          display: "block",
                        }}
                        onError={(event) => {
                          event.currentTarget.style.display =
                            "none";
                        }}
                      />
                    ) : (
                      <School
                        sx={{
                          fontSize: 55,
                        }}
                      />
                    )}
                  </Box>

                  {/* =========================
                      COURSE CONTENT
                  ========================= */}

                  <CardContent
                    sx={{
                      flexGrow: 1,
                    }}
                  >
                    {/* CATEGORY */}

                    {course.category && (
                      <Chip
                        label={course.category}
                        size="small"
                        color="primary"
                        variant="outlined"
                        sx={{
                          mb: 1.5,
                        }}
                      />
                    )}

                    {/* TITLE */}

                    <Typography
                      variant="h6"
                      fontWeight={700}
                    >
                      {course.title}
                    </Typography>

                    {/* DESCRIPTION */}

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        mt: 1,
                        display: "-webkit-box",
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {course.description ||
                        "No description available."}
                    </Typography>

                    {/* PRICE */}

                    <Typography
                      fontWeight={700}
                      color="primary"
                      sx={{
                        mt: 2,
                      }}
                    >
                      ₹{course.price ?? 0}
                    </Typography>

                    {/* =========================
                        STUDENT PROGRESS ONLY
                    ========================= */}

                    {!isTeacher &&
                      typeof enrollment.progress ===
                        "number" && (
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            mt: 1,
                          }}
                        >
                          Progress:{" "}
                          {enrollment.progress}%
                        </Typography>
                      )}
                  </CardContent>

                  {/* =========================
                      BUTTON
                  ========================= */}

                  <CardActions
                    sx={{
                      p: 2,
                    }}
                  >
                    <Button
                      fullWidth
                      variant="contained"
                      endIcon={<ArrowForward />}
                      onClick={() =>
                        navigate(
                          `/courses/${course.id}`
                        )
                      }
                      sx={{
                        textTransform: "none",
                        borderRadius: 2,
                      }}
                    >
                      {isTeacher
                        ? "View Course"
                        : "Continue Learning"}
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}
    </Container>
  );
};

export default MyCourse;