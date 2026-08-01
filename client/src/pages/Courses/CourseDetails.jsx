import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { createEnrollment } from "../../services/enrollmentService";

import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Chip,
  CircularProgress,
  Button,
  Divider,
  Avatar,
  Alert,
  Stack,
} from "@mui/material";

import {
  AccessTime,
  Star,
  School,
  PlayCircle,
  CheckCircle,
  ArrowBack,
  Edit,
  VideoLibrary,
} from "@mui/icons-material";

import { getCourseById } from "../../services/courseService";
import { getVideosByCourse } from "../../services/videoService";

const CourseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // =========================
  // COURSE STATE
  // =========================

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================
  // ENROLLMENT STATE
  // =========================

  const [enrolling, setEnrolling] = useState(false);
  const [enrolled, setEnrolled] = useState(false);
  const [enrollError, setEnrollError] = useState("");

  // =========================
  // VIDEO STATE
  // =========================

  const [videos, setVideos] = useState([]);
  const [videosLoading, setVideosLoading] = useState(true);
  const [videosError, setVideosError] = useState("");

  // =========================
  // GET LOGGED-IN USER
  // =========================

  const storedUser = localStorage.getItem("user");

  let user = null;

  try {
    user = storedUser ? JSON.parse(storedUser) : null;
  } catch (error) {
    console.log("User data error:", error);
  }

  // =========================
  // ROLE + COURSE OWNER CHECK
  // =========================

  const isAdmin = user?.role === "admin";

  const isCourseOwner =
    user?.role === "teacher" &&
    (
      Number(course?.teacher?.id) === Number(user?.id) ||
      Number(course?.teacherId) === Number(user?.id)
    );

  const canManageCourse =
    isAdmin || isCourseOwner;

  // =========================
  // ENROLL
  // =========================

  const handleEnroll = async () => {
    try {
      setEnrolling(true);
      setEnrollError("");

      await createEnrollment(course.id);

      setEnrolled(true);

      alert("Enrolled successfully!");
    } catch (error) {
      console.log("Enrollment error:", error);

      setEnrollError(
        error.response?.data?.message ||
          "Failed to enroll in this course."
      );
    } finally {
      setEnrolling(false);
    }
  };

  // =========================
  // FETCH COURSE + VIDEOS
  // =========================

  useEffect(() => {
    fetchCourse();
    fetchVideos();
  }, [id]);

  // =========================
  // FETCH COURSE
  // =========================

  const fetchCourse = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getCourseById(id);

      console.log("Course API response:", response.data);

      setCourse(response.data);
    } catch (error) {
      console.log("Course details error:", error);

      setError(
        error.response?.data?.message ||
          "Unable to load course details."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // FETCH VIDEOS
  // =========================

  const fetchVideos = async () => {
    try {
      setVideosLoading(true);
      setVideosError("");

      const response = await getVideosByCourse(id);

      setVideos(response.data || []);
    } catch (error) {
      console.log("Fetch videos error:", error);

      setVideosError(
        error.response?.data?.message ||
          error.message ||
          "Unable to load course videos."
      );
    } finally {
      setVideosLoading(false);
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
  // ERROR / NOT FOUND
  // =========================

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
            mb: 3,
          }}
        >
          {error || "Course not found."}
        </Alert>

        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate("/courses")}
        >
          Back to Courses
        </Button>
      </Container>
    );
  }

  // =========================
  // COURSE DATA
  // =========================

  const instructorName =
    course.instructor?.name ||
    course.teacher?.name ||
    "LearnHub Instructor";

  const instructorRole =
    course.instructor?.role ||
    "Full Stack Developer";

  const instructorInitial =
    instructorName.charAt(0).toUpperCase();

  const thumbnail =
    course.thumbnail || "";

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
          BACK BUTTON
      ========================= */}

      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate("/courses")}
        sx={{
          mb: 3,
        }}
      >
        Back to Courses
      </Button>

      {/* =========================
          COURSE HERO
      ========================= */}

      <Paper
        elevation={0}
        sx={{
          mb: 4,
          borderRadius: 4,
          overflow: "hidden",
          background:
            "linear-gradient(135deg, #1976d2 0%, #7b1fa2 100%)",
          color: "white",
        }}
      >
        <Grid
          container
          spacing={0}
          alignItems="stretch"
        >
          {/* HERO CONTENT */}

          <Grid
            size={{
              xs: 12,
              md: 7,
            }}
          >
            <Box
              sx={{
                p: {
                  xs: 3,
                  md: 5,
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
                    sx={{
                      color: "white",
                      borderColor:
                        "rgba(255,255,255,0.5)",
                      backgroundColor:
                        "rgba(255,255,255,0.12)",
                    }}
                    variant="outlined"
                  />
                )}

                <Chip
                  label={course.level || "Beginner"}
                  sx={{
                    color: "white",
                    borderColor:
                      "rgba(255,255,255,0.5)",
                    backgroundColor:
                      "rgba(255,255,255,0.12)",
                  }}
                  variant="outlined"
                />
              </Stack>

              <Typography
                variant="h2"
                fontWeight={700}
                sx={{
                  fontSize: {
                    xs: "2rem",
                    sm: "2.5rem",
                    md: "3.2rem",
                  },
                  lineHeight: 1.15,
                }}
              >
                {course.title}
              </Typography>

              <Typography
                sx={{
                  mt: 2,
                  opacity: 0.9,
                  fontSize: {
                    xs: "1rem",
                    md: "1.15rem",
                  },
                  maxWidth: 750,
                }}
              >
                {course.description}
              </Typography>

              {/* COURSE META */}

              <Stack
                direction="row"
                spacing={2}
                flexWrap="wrap"
                useFlexGap
                sx={{
                  mt: 3,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.7,
                  }}
                >
                  <AccessTime />

                  <Typography>
                    {course.duration || "10 Hours"}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.7,
                  }}
                >
                  <Star />

                  <Typography>
                    {course.rating || "4.8"} Rating
                  </Typography>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.7,
                  }}
                >
                  <School />

                  <Typography>
                    Beginner Friendly
                  </Typography>
                </Box>
              </Stack>
            </Box>
          </Grid>

          {/* HERO THUMBNAIL */}

          <Grid
            size={{
              xs: 12,
              md: 5,
            }}
          >
            <Box
              sx={{
                minHeight: {
                  xs: 240,
                  md: 360,
                },

                height: "100%",

                position: "relative",

                display: "flex",
                alignItems: "center",
                justifyContent: "center",

                background:
                  "linear-gradient(135deg, #1976d2, #7b1fa2)",
              }}
            >
              {thumbnail ? (
                <Box
                  component="img"
                  src={thumbnail}
                  alt={course.title}
                  sx={{
                    width: "100%",
                    height: "100%",
                    minHeight: {
                      xs: 240,
                      md: 360,
                    },
                    objectFit: "cover",
                    display: "block",
                  }}
                />
              ) : (
                <PlayCircle
                  sx={{
                    fontSize: {
                      xs: 80,
                      md: 110,
                    },
                  }}
                />
              )}

              {/* IMAGE OVERLAY */}

              {thumbnail && (
                <Box
                  sx={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(to top, rgba(0,0,0,0.25), rgba(0,0,0,0.02))",
                  }}
                />
              )}
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* =========================
          MAIN CONTENT
      ========================= */}

      <Grid
        container
        spacing={4}
        alignItems="flex-start"
      >
        {/* =========================
            LEFT CONTENT
        ========================= */}

        <Grid
          size={{
            xs: 12,
            md: 8,
          }}
        >
          {/* =========================
              COURSE VIDEOS
          ========================= */}

          <Paper
            elevation={0}
            sx={{
              p: {
                xs: 3,
                md: 4,
              },

              borderRadius: 3,

              border: "1px solid",
              borderColor: "divider",

              mb: 4,
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                mb: 3,
              }}
            >
              <VideoLibrary
                color="primary"
                sx={{
                  fontSize: 30,
                }}
              />

              <Typography
                variant="h5"
                fontWeight={700}
              >
                Course Videos
              </Typography>
            </Box>

            {/* VIDEO LOADING */}

            {videosLoading && (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  py: 5,
                }}
              >
                <CircularProgress />
              </Box>
            )}

            {/* VIDEO ERROR */}

            {!videosLoading && videosError && (
              <Alert severity="error">
                {videosError}
              </Alert>
            )}

            {/* NO VIDEOS */}

            {!videosLoading &&
              !videosError &&
              videos.length === 0 && (
                <Alert severity="info">
                  No videos have been added to
                  this course yet.
                </Alert>
              )}

            {/* VIDEO LIST */}

            {!videosLoading &&
              !videosError &&
              videos.length > 0 && (
                <Stack spacing={3}>
                  {videos.map((video, index) => (
                    <Paper
                      key={video.id}
                      variant="outlined"
                      sx={{
                        p: {
                          xs: 2,
                          md: 2.5,
                        },

                        borderRadius: 3,

                        overflow: "hidden",
                      }}
                    >
                      {/* VIDEO PLAYER */}

                      <Box
                        sx={{
                          width: "100%",
                          backgroundColor: "#000",
                          borderRadius: 2,
                          overflow: "hidden",
                        }}
                      >
                        <video
                          controls
                          preload="metadata"
                          style={{
                            display: "block",
                            width: "100%",
                            maxHeight: "500px",
                          }}
                          src={video.videoUrl}
                        >
                          Your browser does not
                          support the video player.
                        </video>
                      </Box>

                      {/* VIDEO INFORMATION */}

                      <Box
                        sx={{
                          pt: 2,
                        }}
                      >
                        <Typography
                          variant="h6"
                          fontWeight={700}
                        >
                          {index + 1}. {video.title}
                        </Typography>

                        <Typography
                          color="text.secondary"
                          sx={{
                            mt: 0.7,
                            lineHeight: 1.7,
                          }}
                        >
                          {video.description}
                        </Typography>

                        {video.duration && (
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                              mt: 1,
                            }}
                          >
                            Duration:{" "}
                            {Math.floor(
                              video.duration / 60
                            )}
                            :
                            {String(
                              Math.floor(
                                video.duration % 60
                              )
                            ).padStart(2, "0")}
                          </Typography>
                        )}
                      </Box>
                    </Paper>
                  ))}
                </Stack>
              )}
          </Paper>

          {/* =========================
              WHAT YOU WILL LEARN
          ========================= */}

          <Paper
            elevation={0}
            sx={{
              p: {
                xs: 3,
                md: 4,
              },

              borderRadius: 3,

              border: "1px solid",
              borderColor: "divider",

              mb: 4,
            }}
          >
            <Typography
              variant="h5"
              fontWeight={700}
              sx={{
                mb: 3,
              }}
            >
              What you'll learn
            </Typography>

            <Grid
              container
              spacing={2}
            >
              {[
                "Build real-world applications",
                "Learn industry best practices",
                "Work with modern technologies",
                "Create practical projects",
              ].map((item) => (
                <Grid
                  key={item}
                  size={{
                    xs: 12,
                    sm: 6,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 1.5,
                    }}
                  >
                    <CheckCircle
                      color="success"
                      sx={{
                        mt: 0.2,
                      }}
                    />

                    <Typography>
                      {item}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Paper>

          {/* =========================
              COURSE DESCRIPTION
          ========================= */}

          <Paper
            elevation={0}
            sx={{
              p: {
                xs: 3,
                md: 4,
              },

              borderRadius: 3,

              border: "1px solid",
              borderColor: "divider",

              mb: 4,
            }}
          >
            <Typography
              variant="h5"
              fontWeight={700}
              sx={{
                mb: 2,
              }}
            >
              About this course
            </Typography>

            <Typography
              color="text.secondary"
              sx={{
                lineHeight: 1.8,
              }}
            >
              {course.description ||
                "This course is designed to help you develop practical skills and build real-world projects."}
            </Typography>
          </Paper>

          {/* =========================
              INSTRUCTOR
          ========================= */}

          <Paper
            elevation={0}
            sx={{
              p: {
                xs: 3,
                md: 4,
              },

              borderRadius: 3,

              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <Typography
              variant="h5"
              fontWeight={700}
              sx={{
                mb: 3,
              }}
            >
              Instructor
            </Typography>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
              }}
            >
              <Avatar
                sx={{
                  width: 58,
                  height: 58,
                  bgcolor: "primary.main",
                  fontSize: 22,
                  fontWeight: 600,
                }}
              >
                {instructorInitial}
              </Avatar>

              <Box>
                <Typography
                  fontWeight={700}
                  variant="h6"
                >
                  {instructorName}
                </Typography>

                <Typography color="text.secondary">
                  {instructorRole}
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* =========================
            RIGHT SIDEBAR
        ========================= */}

        <Grid
          size={{
            xs: 12,
            md: 4,
          }}
        >
          <Paper
            elevation={0}
            sx={{
              p: 3,

              borderRadius: 3,

              border: "1px solid",
              borderColor: "divider",

              position: {
                xs: "static",
                md: "sticky",
              },

              top: {
                md: 20,
              },
            }}
          >
            {/* =========================
                COURSE THUMBNAIL
            ========================= */}

            <Box
              sx={{
                height: 190,

                borderRadius: 3,

                overflow: "hidden",

                position: "relative",

                display: "flex",
                alignItems: "center",
                justifyContent: "center",

                background:
                  "linear-gradient(135deg, #1976d2, #7b1fa2)",
              }}
            >
              {thumbnail ? (
                <Box
                  component="img"
                  src={thumbnail}
                  alt={course.title}
                  sx={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
              ) : (
                <PlayCircle
                  sx={{
                    fontSize: 70,
                    color: "white",
                  }}
                />
              )}
            </Box>

            {/* PRICE */}

            <Typography
              variant="h4"
              fontWeight={700}
              color="success.main"
              sx={{
                mt: 3,
              }}
            >
              ₹{course.price ?? 0}
            </Typography>

            {/* =========================
                STUDENT ENROLL
            ========================= */}

            {user?.role === "student" && (
              <>
                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={
                    enrolling || enrolled
                  }
                  onClick={handleEnroll}
                  sx={{
                    mt: 3,
                    borderRadius: 3,
                  }}
                >
                  {enrolling
                    ? "Enrolling..."
                    : enrolled
                      ? "Enrolled ✓"
                      : "Enroll Now"}
                </Button>

                {enrollError && (
                  <Alert
                    severity="error"
                    sx={{
                      mt: 2,
                      borderRadius: 2,
                    }}
                  >
                    {Array.isArray(enrollError)
                      ? enrollError.join(", ")
                      : enrollError}
                  </Alert>
                )}
              </>
            )}

            {/* =========================
                COURSE OWNER / ADMIN
            ========================= */}

            {canManageCourse && (
              <>
                {/* EDIT COURSE */}

                <Button
                  fullWidth
                  variant="outlined"
                  size="large"
                  startIcon={<Edit />}
                  sx={{
                    mt: 3,
                    py: 1.3,
                    borderRadius: 2,
                  }}
                  onClick={() =>
                    navigate(
                      `/courses/edit/${course.id}`
                    )
                  }
                >
                  Edit Course
                </Button>

                {/* MANAGE CONTENT */}

                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  sx={{
                    mt: 2,
                    py: 1.3,
                    borderRadius: 2,
                  }}
                  onClick={() =>
                    navigate(
                      `/courses/${course.id}/manage-content`
                    )
                  }
                >
                  Manage Content
                </Button>
              </>
            )}

            <Divider
              sx={{
                my: 3,
              }}
            />

            {/* FEATURES */}

            <Stack spacing={2}>
              <Box
                sx={{
                  display: "flex",
                  gap: 1.5,
                  alignItems: "center",
                }}
              >
                <CheckCircle color="success" />

                <Typography>
                  Lifetime Access
                </Typography>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  gap: 1.5,
                  alignItems: "center",
                }}
              >
                <CheckCircle color="success" />

                <Typography>
                  Certificate Included
                </Typography>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  gap: 1.5,
                  alignItems: "center",
                }}
              >
                <CheckCircle color="success" />

                <Typography>
                  Project Based Learning
                </Typography>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  gap: 1.5,
                  alignItems: "center",
                }}
              >
                <CheckCircle color="success" />

                <Typography>
                  Learn at Your Own Pace
                </Typography>
              </Box>
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CourseDetails;