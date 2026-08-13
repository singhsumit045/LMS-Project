import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Grid,
  CircularProgress,
  Alert,
  Divider,
  InputAdornment,
  Chip,
  Stack,
} from "@mui/material";

import {
  School,
  Save,
  ArrowBack,
  Image,
  Visibility,
  CurrencyRupee,
  Category,
  Description,
} from "@mui/icons-material";

import { createCourse } from "../../services/courseService";

const CreateCourse = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    thumbnail: "",
    price: "",
    category: "",
  });

  // =========================
  // HANDLE INPUT CHANGE
  // =========================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
  };

  // =========================
  // CREATE COURSE
  // =========================

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.title.trim()) {
      setError("Course title is required.");
      return;
    }

    if (!formData.description.trim()) {
      setError("Course description is required.");
      return;
    }

    if (!formData.category.trim()) {
      setError("Course category is required.");
      return;
    }

    if (
      formData.price === "" ||
      Number(formData.price) < 0
    ) {
      setError("Please enter a valid course price.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await createCourse({
        ...formData,
        price: Number(formData.price),
      });

      alert("Course created successfully!");

      navigate("/courses");
    } catch (error) {
      console.error("Create course error:", error);

      const backendMessage =
        error?.response?.data?.message;

      setError(
        Array.isArray(backendMessage)
          ? backendMessage.join(", ")
          : backendMessage ||
              "Failed to create course. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // CANCEL
  // =========================

  const handleCancel = () => {
    if (loading) return;

    navigate("/courses");
  };

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
        onClick={handleCancel}
        sx={{
          mb: 3,
          textTransform: "none",
          fontWeight: 600,
        }}
      >
        Back to Courses
      </Button>

      {/* =========================
          PAGE HEADER
      ========================= */}

      <Box
        sx={{
          mb: 4,
        }}
      >
        <Stack
          direction="row"
          spacing={2}
          sx={{
            mb: 1,
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              width: 52,
              height: 52,
              borderRadius: 3,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: "primary.main",
              color: "primary.contrastText",
              flexShrink: 0,
            }}
          >
            <School />
          </Box>

          <Box>
            <Typography
              variant="h4"
              fontWeight={800}
              sx={{
                fontSize: {
                  xs: "1.8rem",
                  sm: "2.2rem",
                  md: "2.5rem",
                },
              }}
            >
              Create New Course
            </Typography>

            <Typography
              color="text.secondary"
              sx={{
                mt: 0.5,
              }}
            >
              Create an engaging learning experience for
              your students.
            </Typography>
          </Box>
        </Stack>
      </Box>

      {/* =========================
          MAIN GRID

          IMPORTANT:
          Don't use alignItems directly on Grid.
          Use sx instead.
      ========================= */}

      <Grid
        container
        spacing={4}
        sx={{
          alignItems: "flex-start",
        }}
      >
        {/* =================================================
            LEFT - CREATE COURSE FORM
        ================================================= */}

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
                md: 4.5,
              },
              borderRadius: 4,
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            {/* FORM HEADER */}

            <Box
              sx={{
                mb: 3,
              }}
            >
              <Typography
                variant="h6"
                fontWeight={700}
              >
                Course Information
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  mt: 0.5,
                }}
              >
                Enter the basic information about your
                course.
              </Typography>
            </Box>

            <Divider
              sx={{
                mb: 3,
              }}
            />

            {/* ERROR */}

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

            {/* FORM */}

            <Box
              component="form"
              onSubmit={handleSubmit}
            >
              <Grid
                container
                spacing={2.5}
              >
                {/* =========================
                    TITLE
                ========================= */}

                <Grid
                  size={{
                    xs: 12,
                  }}
                >
                  <TextField
                    fullWidth
                    required
                    label="Course Title"
                    name="title"
                    placeholder="e.g. Full Stack Web Development"
                    value={formData.title}
                    onChange={handleChange}
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <School color="action" />
                          </InputAdornment>
                        ),
                      },
                    }}
                  />
                </Grid>

                {/* =========================
                    CATEGORY
                ========================= */}

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
                    value={formData.category}
                    onChange={handleChange}
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <Category color="action" />
                          </InputAdornment>
                        ),
                      },
                    }}
                  />
                </Grid>

                {/* =========================
                    PRICE
                ========================= */}

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
                    placeholder="0"
                    value={formData.price}
                    onChange={handleChange}
                    slotProps={{
                      htmlInput: {
                        min: 0,
                      },
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <CurrencyRupee color="action" />
                          </InputAdornment>
                        ),
                      },
                    }}
                  />
                </Grid>

                {/* =========================
                    THUMBNAIL
                ========================= */}

                <Grid
                  size={{
                    xs: 12,
                  }}
                >
                  <TextField
                    fullWidth
                    label="Thumbnail URL"
                    name="thumbnail"
                    placeholder="https://example.com/course-image.jpg"
                    value={formData.thumbnail}
                    onChange={handleChange}
                    helperText="Add a high-quality image URL for your course thumbnail."
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <Image color="action" />
                          </InputAdornment>
                        ),
                      },
                    }}
                  />
                </Grid>

                {/* =========================
                    DESCRIPTION
                ========================= */}

                <Grid
                  size={{
                    xs: 12,
                  }}
                >
                  <TextField
                    fullWidth
                    required
                    multiline
                    minRows={6}
                    label="Course Description"
                    name="description"
                    placeholder="Describe what students will learn in this course..."
                    value={formData.description}
                    onChange={handleChange}
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment
                            position="start"
                            sx={{
                              alignSelf: "flex-start",
                              mt: 1.5,
                            }}
                          >
                            <Description color="action" />
                          </InputAdornment>
                        ),
                      },
                    }}
                  />
                </Grid>

                {/* =========================
                    BUTTONS
                ========================= */}

                <Grid
                  size={{
                    xs: 12,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: {
                        xs: "column-reverse",
                        sm: "row",
                      },
                      justifyContent: "flex-end",
                      gap: 2,
                      mt: 1,
                    }}
                  >
                    <Button
                      variant="outlined"
                      onClick={handleCancel}
                      disabled={loading}
                      sx={{
                        minWidth: 140,
                        textTransform: "none",
                        borderRadius: 2,
                        py: 1.25,
                      }}
                    >
                      Cancel
                    </Button>

                    <Button
                      type="submit"
                      variant="contained"
                      disabled={loading}
                      startIcon={
                        loading ? (
                          <CircularProgress
                            size={20}
                            color="inherit"
                          />
                        ) : (
                          <Save />
                        )
                      }
                      sx={{
                        minWidth: 180,
                        textTransform: "none",
                        borderRadius: 2,
                        py: 1.25,
                        fontWeight: 600,
                      }}
                    >
                      {loading
                        ? "Creating..."
                        : "Create Course"}
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </Grid>

        {/* =================================================
            RIGHT - LIVE COURSE PREVIEW
        ================================================= */}

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
              border: "1px solid",
              borderColor: "divider",
              overflow: "hidden",
              position: {
                xs: "static",
                md: "sticky",
              },
              top: {
                md: 20,
              },
            }}
          >
            {/* PREVIEW HEADER */}

            <Box
              sx={{
                px: 3,
                py: 2.5,
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                borderBottom: "1px solid",
                borderColor: "divider",
              }}
            >
              <Visibility color="primary" />

              <Box>
                <Typography fontWeight={700}>
                  Course Preview
                </Typography>

                <Typography
                  variant="caption"
                  color="text.secondary"
                >
                  Live preview
                </Typography>
              </Box>
            </Box>

            {/* THUMBNAIL */}

            <Box
              sx={{
                height: {
                  xs: 220,
                  sm: 260,
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
              {formData.thumbnail ? (
                <Box
                  component="img"
                  src={formData.thumbnail}
                  alt="Course preview"
                  onError={(event) => {
                    event.currentTarget.style.display =
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
                <Box
                  sx={{
                    textAlign: "center",
                    color: "white",
                  }}
                >
                  <Image
                    sx={{
                      fontSize: 60,
                      opacity: 0.8,
                    }}
                  />

                  <Typography
                    variant="body2"
                    sx={{
                      mt: 1,
                      opacity: 0.9,
                    }}
                  >
                    Course thumbnail
                  </Typography>
                </Box>
              )}

              {/* PREVIEW LABEL */}

              <Chip
                label="Preview"
                size="small"
                sx={{
                  position: "absolute",
                  top: 15,
                  left: 15,
                  bgcolor: "rgba(0,0,0,0.6)",
                  color: "white",
                  backdropFilter: "blur(5px)",
                }}
              />
            </Box>

            {/* COURSE PREVIEW CONTENT */}

            <Box
              sx={{
                p: 3,
              }}
            >
              {/* CATEGORY */}

              <Stack
                direction="row"
                spacing={1}
                sx={{
                  mb: 1.5,
                }}
              >
                {formData.category && (
                  <Chip
                    label={formData.category}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                )}

                <Chip
                  label="Beginner"
                  size="small"
                  variant="outlined"
                />
              </Stack>

              {/* TITLE */}

              <Typography
                variant="h5"
                fontWeight={700}
                sx={{
                  lineHeight: 1.25,
                  wordBreak: "break-word",
                }}
              >
                {formData.title ||
                  "Your Course Title"}
              </Typography>

              {/* DESCRIPTION */}

              <Typography
                color="text.secondary"
                sx={{
                  mt: 1.5,
                  lineHeight: 1.7,
                  display: "-webkit-box",
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {formData.description ||
                  "Your course description will appear here. Add a clear description to help students understand what they will learn."}
              </Typography>

              <Divider
                sx={{
                  my: 2.5,
                }}
              />

              {/* PRICE */}

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  Course Price
                </Typography>

                <Typography
                  variant="h5"
                  fontWeight={800}
                  color="success.main"
                >
                  ₹
                  {formData.price !== ""
                    ? Number(
                        formData.price
                      ).toLocaleString("en-IN")
                    : "0"}
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CreateCourse;