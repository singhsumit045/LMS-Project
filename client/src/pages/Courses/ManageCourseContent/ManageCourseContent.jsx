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
} from "@mui/material";

import {
  ArrowBack,
  VideoLibrary,
  Description,
  Campaign,
  Quiz,
} from "@mui/icons-material";

import { getCourseById } from "../../../services/courseService";

const ManageCourseContent = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  // =========================
  // LOADING
  // =========================

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

  // =========================
  // ERROR
  // =========================

  if (error || !course) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Alert severity="error">
          {error || "Course not found."}
        </Alert>

        <Button
          startIcon={<ArrowBack />}
          sx={{ mt: 3 }}
          onClick={() => navigate("/courses")}
        >
          Back to Courses
        </Button>
      </Container>
    );
  }

  // =========================
  // CONTENT OPTIONS
  // =========================

  const contentOptions = [
    {
      title: "Videos",
      description: "Upload and manage course videos.",
      icon: <VideoLibrary sx={{ fontSize: 45 }} />,
      button: "Manage Videos",
    },
    {
      title: "Notes",
      description: "Upload PDFs and learning materials.",
      icon: <Description sx={{ fontSize: 45 }} />,
      button: "Manage Notes",
    },
    {
      title: "Posts",
      description: "Create announcements and updates.",
      icon: <Campaign sx={{ fontSize: 45 }} />,
      button: "Manage Posts",
    },
    {
      title: "Exams",
      description: "Create and manage course exams.",
      icon: <Quiz sx={{ fontSize: 45 }} />,
      button: "Manage Exams",
    },
  ];

  return (
    <Container
      maxWidth="lg"
      sx={{
        py: {
          xs: 3,
          md: 5,
        },
      }}
    >
      {/* =========================
          BACK BUTTON
      ========================= */}

      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate(`/courses/${course.id}`)}
        sx={{
          mb: 3,
        }}
      >
        Back to Course
      </Button>

      {/* =========================
          HEADER
      ========================= */}

      <Paper
        elevation={0}
        sx={{
          p: {
            xs: 3,
            md: 4,
          },

          mb: 4,

          borderRadius: 4,

          border: "1px solid",

          borderColor: "divider",
        }}
      >
        <Typography
          variant="h4"
          fontWeight={700}
        >
          Manage Course Content
        </Typography>

        <Typography
          color="text.secondary"
          sx={{
            mt: 1,
          }}
        >
          {course.title}
        </Typography>

        <Typography
          color="text.secondary"
          sx={{
            mt: 2,
            maxWidth: 700,
          }}
        >
          Add and manage videos, notes, posts and
          exams for this course.
        </Typography>
      </Paper>

      {/* =========================
          CONTENT OPTIONS
      ========================= */}

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
            }}
          >
            <Paper
              elevation={0}
              sx={{
                p: 3,

                height: "100%",

                borderRadius: 3,

                border: "1px solid",

                borderColor: "divider",

                transition: "0.2s",

                "&:hover": {
                  transform: "translateY(-3px)",
                  boxShadow: 4,
                },
              }}
            >
              {/* ICON */}

              <Box
                sx={{
                  mb: 2,

                  color: "primary.main",
                }}
              >
                {item.icon}
              </Box>

              {/* TITLE */}

              <Typography
                variant="h6"
                fontWeight={700}
              >
                {item.title}
              </Typography>

              {/* DESCRIPTION */}

              <Typography
                color="text.secondary"
                sx={{
                  mt: 1,
                  mb: 3,
                }}
              >
                {item.description}
              </Typography>

              {/* BUTTON */}

              <Button
                variant="contained"
                fullWidth
                onClick={() => {
                  if (item.title === "Videos") {
                    navigate(
                      `/courses/${course.id}/manage-videos`
                    );
                  }
                }}
              >
                {item.button}
              </Button>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default ManageCourseContent;