import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Grid,
  CircularProgress,
  Alert,
  Chip,
  Stack,
  Divider,
} from "@mui/material";

import {
  ArrowBack,
  VideoLibrary,
  Description,
  Campaign,
  Quiz,
  School,
  PlayCircle,
  ArrowForward,
} from "@mui/icons-material";

import { getCourseById } from "../../../services/courseService";

const ManageCourseContent = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =====================================================
  // FETCH COURSE
  // =====================================================

  useEffect(() => {
    fetchCourse();
  }, [id]);

  const fetchCourse = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getCourseById(id);

      setCourse(response.data);
    } catch (error) {
      console.log("Manage content error:", error);

      setError(
        error.response?.data?.message ||
          "Unable to load course."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "70vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (error || !course) {
    return (
      <Container
        maxWidth="md"
        sx={{
          py: 8,
        }}
      >
        <Alert
          severity="error"
          sx={{
            borderRadius: 3,
          }}
        >
          {error || "Course not found."}
        </Alert>

        <Button
          startIcon={<ArrowBack />}
          sx={{
            mt: 3,
            textTransform: "none",
          }}
          onClick={() => navigate("/courses")}
        >
          Back to Courses
        </Button>
      </Container>
    );
  }

  // =====================================================
  // CONTENT OPTIONS
  // =====================================================

  const contentOptions = [
    {
      title: "Videos",
      description:
        "Upload, organize and manage video lessons for your students.",
      icon: <VideoLibrary />,
      button: "Manage Videos",
      color: "primary",
      available: true,
    },

    {
      title: "Notes",
      description:
        "Upload PDFs, documents and other learning materials.",
      icon: <Description />,
      button: "Manage Notes",
      color: "secondary",
      available: true,
    },

    {
      title: "Posts",
      description:
        "Create announcements, updates and important course posts.",
      icon: <Campaign />,
      button: "Manage Announcements",
      color: "warning",
      available: true,
    },

    {
      title: "Exams",
      description:
        "Create quizzes, exams and assessments for students.",
      icon: <Quiz />,
      button: "Manage Exams",
      color: "success",
      available: true,
    },
  ];

  // =====================================================
  // HANDLE CONTENT NAVIGATION
  // =====================================================

  const handleContentNavigation = (title) => {
    if (title === "Videos") {
      navigate(
        `/courses/${course.id}/manage-videos`
      );
      return;
    }

    if (title === "Notes") {
      navigate(
        `/courses/${course.id}/manage-notes`
      );
      return;
    }

    // =================================================
    // MANAGE ANNOUNCEMENTS
    // =================================================

    if (title === "Posts") {
      navigate(
        `/courses/${course.id}/manage-announcements`
      );
      return;
    }

    // =================================================
    // MANAGE EXAMS
    // =================================================

    if (title === "Exams") {
      navigate(
        `/courses/${course.id}/manage-exams`
      );
      return;
    }
  };

  // =====================================================
  // PAGE
  // =====================================================

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
      {/* =================================================
          BACK BUTTON
      ================================================= */}

      <Button
        startIcon={<ArrowBack />}
        onClick={() =>
          navigate(`/courses/${course.id}`)
        }
        sx={{
          mb: 3,
          textTransform: "none",
          fontWeight: 600,
        }}
      >
        Back to Course
      </Button>

      {/* =================================================
          COURSE HEADER
      ================================================= */}

      <Paper
        elevation={0}
        sx={{
          mb: 4,
          borderRadius: 4,
          overflow: "hidden",
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <Grid
          container
          alignItems="stretch"
        >
          {/* =================================================
              THUMBNAIL
          ================================================= */}

          <Grid
            size={{
              xs: 12,
              md: 4,
            }}
          >
            <Box
              sx={{
                height: {
                  xs: 220,
                  md: "100%",
                },
                minHeight: {
                  md: 260,
                },
                position: "relative",
                overflow: "hidden",
                background:
                  "linear-gradient(135deg, #1976d2, #7b1fa2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {course.thumbnail ? (
                <Box
                  component="img"
                  src={course.thumbnail}
                  alt={course.title}
                  onError={(e) => {
                    e.currentTarget.style.display =
                      "none";
                  }}
                  sx={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
              ) : (
                <School
                  sx={{
                    fontSize: 90,
                    color: "white",
                    opacity: 0.85,
                  }}
                />
              )}

              <Chip
                label="Course Management"
                sx={{
                  position: "absolute",
                  top: 18,
                  left: 18,
                  color: "white",
                  backgroundColor:
                    "rgba(0,0,0,0.55)",
                  backdropFilter: "blur(6px)",
                  fontWeight: 600,
                }}
              />
            </Box>
          </Grid>

          {/* =================================================
              COURSE INFORMATION
          ================================================= */}

          <Grid
            size={{
              xs: 12,
              md: 8,
            }}
          >
            <Box
              sx={{
                p: {
                  xs: 3,
                  md: 4,
                },
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <Stack
                direction="row"
                spacing={1}
                flexWrap="wrap"
                useFlexGap
                sx={{
                  mb: 2,
                }}
              >
                {course.category && (
                  <Chip
                    label={course.category}
                    color="primary"
                    variant="outlined"
                    size="small"
                  />
                )}

                <Chip
                  label="Teacher"
                  variant="outlined"
                  size="small"
                />
              </Stack>

              <Typography
                variant="h4"
                fontWeight={800}
                sx={{
                  fontSize: {
                    xs: "1.8rem",
                    md: "2.4rem",
                  },
                  lineHeight: 1.2,
                }}
              >
                {course.title}
              </Typography>

              <Typography
                color="text.secondary"
                sx={{
                  mt: 1.5,
                  lineHeight: 1.7,
                  maxWidth: 750,
                }}
              >
                {course.description ||
                  "Manage all learning content for this course from one place."}
              </Typography>

              <Divider
                sx={{
                  my: 2.5,
                }}
              />

              <Stack
                direction={{
                  xs: "column",
                  sm: "row",
                }}
                spacing={{
                  xs: 1,
                  sm: 3,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <PlayCircle color="primary" />

                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    Video Lessons
                  </Typography>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <School color="primary" />

                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    Learning Content
                  </Typography>
                </Box>
              </Stack>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* =================================================
          PAGE TITLE
      ================================================= */}

      <Box
        sx={{
          mb: 3,
        }}
      >
        <Typography
          variant="h5"
          fontWeight={800}
        >
          Manage Course Content
        </Typography>

        <Typography
          color="text.secondary"
          sx={{
            mt: 0.7,
          }}
        >
          Add and organize learning resources for your
          students.
        </Typography>
      </Box>

      {/* =================================================
          CONTENT CARDS
      ================================================= */}

      <Grid
        container
        spacing={3}
      >
        {contentOptions.map((item) => (
          <Grid
            key={item.title}
            size={{
              xs: 12,
              sm: 6,
              lg: 3,
            }}
          >
            <Paper
              elevation={0}
              sx={{
                height: "100%",
                minHeight: 320,
                p: 3,
                borderRadius: 4,
                border: "1px solid",
                borderColor: "divider",
                display: "flex",
                flexDirection: "column",
                transition:
                  "transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease",

                "&:hover": {
                  transform:
                    "translateY(-5px)",
                  boxShadow: 5,
                  borderColor:
                    `${item.color}.main`,
                },
              }}
            >
              {/* =================================================
                  ICON
              ================================================= */}

              <Box
                sx={{
                  width: 64,
                  height: 64,
                  borderRadius: 3,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mb: 2.5,
                  color: `${item.color}.main`,
                  backgroundColor:
                    item.color === "primary"
                      ? "rgba(25,118,210,0.10)"
                      : item.color === "secondary"
                        ? "rgba(156,39,176,0.10)"
                        : item.color === "warning"
                          ? "rgba(237,108,2,0.10)"
                          : "rgba(46,125,50,0.10)",
                }}
              >
                {item.icon}
              </Box>

              {/* =================================================
                  TITLE
              ================================================= */}

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent:
                    "space-between",
                  gap: 1,
                }}
              >
                <Typography
                  variant="h6"
                  fontWeight={800}
                >
                  {item.title}
                </Typography>
              </Box>

              {/* =================================================
                  DESCRIPTION
              ================================================= */}

              <Typography
                color="text.secondary"
                sx={{
                  mt: 1,
                  lineHeight: 1.7,
                  flexGrow: 1,
                }}
              >
                {item.description}
              </Typography>

              {/* =================================================
                  BUTTON
              ================================================= */}

              <Button
                fullWidth
                variant="contained"
                endIcon={<ArrowForward />}
                onClick={() =>
                  handleContentNavigation(
                    item.title
                  )
                }
                sx={{
                  py: 1.2,
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 600,
                }}
              >
                {item.button}
              </Button>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* =================================================
          INFO SECTION
      ================================================= */}

      <Paper
        elevation={0}
        sx={{
          mt: 4,
          p: {
            xs: 2.5,
            md: 3,
          },
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
          backgroundColor: "action.hover",
        }}
      >
        <Typography fontWeight={700}>
          💡 Content Management
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mt: 0.7,
            lineHeight: 1.7,
          }}
        >
          You can now manage video lessons, notes,
          announcements and exams for this course.
        </Typography>
      </Paper>
    </Container>
  );
};

export default ManageCourseContent;