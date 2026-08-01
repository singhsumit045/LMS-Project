
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Divider,
  InputAdornment,
  Grid,
  Chip,
  Stack,
} from "@mui/material";

import {
  Edit,
  Save,
  ArrowBack,
  School,
  Visibility,
  Category,
  CurrencyRupee,
} from "@mui/icons-material";

import {
  getCourseById,
  updateCourse,
} from "../../services/courseService";

const EditCourse = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState({
    title: "",
    description: "",
    category: "",
    price: "",
    thumbnail: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // =========================
  // FETCH COURSE
  // =========================

  useEffect(() => {
    fetchCourse();
  }, [id]);

  const fetchCourse = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getCourseById(id);

      const data = response.data;

      setCourse({
        title: data.title || "",
        description: data.description || "",
        category: data.category || "",
        price: data.price ?? "",
        thumbnail: data.thumbnail || "",
      });
    } catch (error) {
      console.error("Fetch course error:", error);

      setError(
        error.response?.data?.message ||
          "Unable to load course."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // HANDLE CHANGE
  // =========================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setCourse((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
  };

  // =========================
  // UPDATE COURSE
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!course.title.trim()) {
      setError("Course title is required.");
      return;
    }

    if (!course.description.trim()) {
      setError("Course description is required.");
      return;
    }

    if (!course.category.trim()) {
      setError("Course category is required.");
      return;
    }

    if (
      course.price === "" ||
      Number(course.price) < 0
    ) {
      setError("Please enter a valid course price.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      await updateCourse(id, {
        title: course.title.trim(),
        description: course.description.trim(),
        category: course.category.trim(),
        price: Number(course.price),
        thumbnail: course.thumbnail.trim(),
      });

      alert("Course updated successfully!");

      navigate(`/courses/${id}`);
    } catch (error) {
      console.error("Update course error:", error);

      const message =
        error.response?.data?.message;

      setError(
        Array.isArray(message)
          ? message.join(", ")
          : message || "Failed to update course."
      );
    } finally {
      setSaving(false);
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
  // PAGE
  // =========================

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
        onClick={() =>
          navigate(`/courses/${id}`)
        }
        sx={{
          mb: 3,
          textTransform: "none",
          fontWeight: 600,
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
          mb: 4,
          borderRadius: 4,
          overflow: "hidden",
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <Box
          sx={{
            p: {
              xs: 3,
              md: 4,
            },
            background:
              "linear-gradient(135deg, #1976d2 0%, #7b1fa2 100%)",
            color: "white",
          }}
        >
          <Stack
            direction="row"
            spacing={2}
            alignItems="center"
          >
            <Box
              sx={{
                width: 58,
                height: 58,
                borderRadius: 3,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor:
                  "rgba(255,255,255,0.15)",
                border:
                  "1px solid rgba(255,255,255,0.25)",
              }}
            >
              <Edit fontSize="large" />
            </Box>

            <Box>
              <Typography
                variant="h4"
                fontWeight={800}
                sx={{
                  fontSize: {
                    xs: "1.7rem",
                    sm: "2.2rem",
                  },
                }}
              >
                Edit Course
              </Typography>

              <Typography
                sx={{
                  mt: 0.5,
                  opacity: 0.9,
                }}
              >
                Update your course information
                and keep it up to date.
              </Typography>
            </Box>
          </Stack>
        </Box>

        {/* COURSE MINI INFO */}

        <Box
          sx={{
            p: 2.5,
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            flexWrap: "wrap",
          }}
        >
          <Chip
            icon={<School />}
            label="Course Editor"
            color="primary"
            variant="outlined"
          />

          {course.category && (
            <Chip
              icon={<Category />}
              label={course.category}
              variant="outlined"
            />
          )}

          <Chip
            icon={<CurrencyRupee />}
            label={`${course.price || 0}`}
            variant="outlined"
          />
        </Box>
      </Paper>

      {/* =========================
          ERROR
      ========================= */}

      {error && (
        <Alert
          severity="error"
          sx={{
            mb: 3,
            borderRadius: 3,
          }}
        >
          {Array.isArray(error)
            ? error.join(", ")
            : error}
        </Alert>
      )}

      {/* =========================
          MAIN CONTENT
      ========================= */}

      <Grid
        container
        spacing={4}
        alignItems="flex-start"
      >
        {/* =========================
            LEFT - FORM
        ========================= */}

        <Grid
          size={{
            xs: 12,
            md: 7,
          }}
        >
          <Paper
            elevation={0}
            sx={{
              p: {
                xs: 2.5,
                sm: 4,
              },
              borderRadius: 4,
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <Typography
              variant="h6"
              fontWeight={800}
            >
              Course Information
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mt: 0.5,
                mb: 3,
              }}
            >
              Modify the details of your course
              below.
            </Typography>

            <Divider sx={{ mb: 3 }} />

            <Box
              component="form"
              onSubmit={handleSubmit}
            >
              {/* TITLE */}

              <TextField
                fullWidth
                required
                label="Course Title"
                name="title"
                placeholder="e.g. Full Stack Web Development"
                value={course.title}
                onChange={handleChange}
                sx={{ mb: 2.5 }}
              />

              {/* CATEGORY + PRICE */}

              <Grid
                container
                spacing={2}
              >
                <Grid
                  size={{
                    xs: 12,
                    sm: 6,
                  }}
                >
                  <TextField
                    fullWidth
                    required
                    label="Category"
                    name="category"
                    placeholder="e.g. Web Development"
                    value={course.category}
                    onChange={handleChange}
                  />
                </Grid>

                <Grid
                  size={{
                    xs: 12,
                    sm: 6,
                  }}
                >
                  <TextField
                    fullWidth
                    required
                    type="number"
                    label="Course Price"
                    name="price"
                    value={course.price}
                    onChange={handleChange}
                    slotProps={{
                      htmlInput: {
                        min: 0,
                      },
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            ₹
                          </InputAdornment>
                        ),
                      },
                    }}
                  />
                </Grid>
              </Grid>

              {/* THUMBNAIL URL */}

              <TextField
                fullWidth
                label="Thumbnail URL"
                name="thumbnail"
                value={course.thumbnail}
                onChange={handleChange}
                placeholder="https://example.com/course-image.jpg"
                helperText="Paste an image URL to update the course thumbnail."
                sx={{
                  mt: 2.5,
                }}
              />

              {/* DESCRIPTION */}

              <TextField
                fullWidth
                required
                multiline
                minRows={6}
                label="Course Description"
                name="description"
                placeholder="Describe what students will learn in this course..."
                value={course.description}
                onChange={handleChange}
                sx={{
                  mt: 2.5,
                }}
              />

              {/* BUTTONS */}

              <Box
                sx={{
                  display: "flex",
                  flexDirection: {
                    xs: "column-reverse",
                    sm: "row",
                  },
                  justifyContent: "flex-end",
                  gap: 2,
                  mt: 4,
                }}
              >
                <Button
                  variant="outlined"
                  disabled={saving}
                  onClick={() =>
                    navigate(`/courses/${id}`)
                  }
                  sx={{
                    minWidth: {
                      xs: "100%",
                      sm: 140,
                    },
                    py: 1.3,
                    borderRadius: 2,
                    textTransform: "none",
                    fontWeight: 600,
                  }}
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  variant="contained"
                  disabled={saving}
                  startIcon={
                    saving ? (
                      <CircularProgress
                        size={20}
                        color="inherit"
                      />
                    ) : (
                      <Save />
                    )
                  }
                  sx={{
                    minWidth: {
                      xs: "100%",
                      sm: 180,
                    },
                    py: 1.3,
                    borderRadius: 2,
                    textTransform: "none",
                    fontWeight: 600,
                  }}
                >
                  {saving
                    ? "Updating..."
                    : "Update Course"}
                </Button>
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* =========================
            RIGHT - PREVIEW
        ========================= */}

        <Grid
          size={{
            xs: 12,
            md: 5,
          }}
        >
          <Paper
            elevation={0}
            sx={{
              borderRadius: 4,
              overflow: "hidden",
              border: "1px solid",
              borderColor: "divider",
              position: {
                xs: "static",
                md: "sticky",
              },
              top: 20,
            }}
          >
            {/* PREVIEW HEADER */}

            <Box
              sx={{
                p: 2.5,
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <Visibility color="primary" />

              <Box>
                <Typography
                  fontWeight={800}
                >
                  Course Preview
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  How your course thumbnail
                  will appear
                </Typography>
              </Box>
            </Box>

            {/* THUMBNAIL */}

            <Box
              sx={{
                width: "100%",
                height: 240,
                background:
                  "linear-gradient(135deg, #1976d2, #7b1fa2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
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
                  }}
                />
              ) : (
                <School
                  sx={{
                    fontSize: 90,
                    color: "white",
                    opacity: 0.8,
                  }}
                />
              )}
            </Box>

            {/* PREVIEW DETAILS */}

            <Box
              sx={{
                p: 3,
              }}
            >
              <Chip
                label={
                  course.category ||
                  "Course Category"
                }
                size="small"
                color="primary"
                sx={{
                  mb: 1.5,
                }}
              />

              <Typography
                variant="h6"
                fontWeight={800}
                sx={{
                  lineHeight: 1.3,
                }}
              >
                {course.title ||
                  "Your Course Title"}
              </Typography>

              <Typography
                color="text.secondary"
                variant="body2"
                sx={{
                  mt: 1,
                  lineHeight: 1.6,
                  display: "-webkit-box",
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {course.description ||
                  "Your course description will appear here."}
              </Typography>

              <Divider
                sx={{
                  my: 2,
                }}
              />

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  Course Price
                </Typography>

                <Typography
                  variant="h6"
                  fontWeight={800}
                  color="success.main"
                >
                  ₹{course.price || 0}
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default EditCourse;

