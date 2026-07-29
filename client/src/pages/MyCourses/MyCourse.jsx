
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

import { getMyCourses } from "../../services/enrollmentService";

const MyCourse = () => {
  const navigate = useNavigate();

  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchEnrollments();
  }, []);

  const fetchEnrollments = async () => {
    try {
      setLoading(true);
      setError("");

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
        Courses you are currently enrolled in
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
            You haven't enrolled in any course yet.
          </Typography>

          <Typography
            color="text.secondary"
            sx={{ mt: 1 }}
          >
            Explore our courses and start learning.
          </Typography>

          <Button
            variant="contained"
            sx={{
              mt: 3,
              borderRadius: 2,
              textTransform: "none",
            }}
            onClick={() => navigate("/courses")}
          >
            Explore Courses
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
                  {/* COURSE IMAGE AREA */}

                  <Box
                    sx={{
                      height: 130,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      background:
                        "linear-gradient(135deg, #1976d2, #7b1fa2)",
                      color: "white",
                    }}
                  >
                    <School
                      sx={{
                        fontSize: 55,
                      }}
                    />
                  </Box>

                  {/* COURSE CONTENT */}

                  <CardContent
                    sx={{
                      flexGrow: 1,
                    }}
                  >
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

                    <Typography
                      variant="h6"
                      fontWeight={700}
                    >
                      {course.title}
                    </Typography>

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

                    <Typography
                      fontWeight={700}
                      color="primary"
                      sx={{
                        mt: 2,
                      }}
                    >
                      ₹{course.price ?? 0}
                    </Typography>

                    {/* PROGRESS */}

                    {typeof enrollment.progress ===
                      "number" && (
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          mt: 1,
                        }}
                      >
                        Progress: {enrollment.progress}%
                      </Typography>
                    )}
                  </CardContent>

                  {/* BUTTON */}

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
                      Continue Learning
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

