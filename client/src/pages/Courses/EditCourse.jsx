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
} from "@mui/material";

import {
  Edit,
  Save,
  ArrowBack,
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

    // Validation

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
        title: course.title,
        description: course.description,
        category: course.category,
        price: Number(course.price),
        thumbnail: course.thumbnail,
      });

      alert("Course updated successfully!");

      navigate(`/courses/${id}`);
    } catch (error) {
      console.error("Update course error:", error);

      const message = error.response?.data?.message;

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
      maxWidth="md"
      sx={{
        py: {
          xs: 3,
          sm: 4,
          md: 6,
        },
      }}
    >
      {/* BACK BUTTON */}

      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate(`/courses/${id}`)}
        sx={{
          mb: 2,
          textTransform: "none",
        }}
      >
        Back to Course
      </Button>

      {/* MAIN CARD */}

      <Paper
        elevation={0}
        sx={{
          p: {
            xs: 2.5,
            sm: 4,
            md: 5,
          },
          borderRadius: 4,
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        {/* HEADER */}

        <Box
          sx={{
            textAlign: "center",
            mb: 4,
          }}
        >
          <Box
            sx={{
              width: 64,
              height: 64,
              mx: "auto",
              mb: 2,
              borderRadius: "50%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              bgcolor: "primary.main",
              color: "primary.contrastText",
            }}
          >
            <Edit fontSize="large" />
          </Box>

          <Typography
            variant="h4"
            fontWeight={700}
            sx={{
              fontSize: {
                xs: "1.8rem",
                sm: "2.2rem",
              },
            }}
          >
            Edit Course
          </Typography>

          <Typography
            color="text.secondary"
            sx={{
              mt: 1,
            }}
          >
            Update your course information
          </Typography>
        </Box>

        <Divider sx={{ mb: 4 }} />

        {/* ERROR */}

        {error && (
          <Alert
            severity="error"
            sx={{
              mb: 3,
              borderRadius: 2,
            }}
          >
            {error}
          </Alert>
        )}

        {/* FORM */}

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
            value={course.title}
            onChange={handleChange}
            margin="normal"
          />

          {/* CATEGORY */}

          <TextField
            fullWidth
            required
            label="Category"
            name="category"
            value={course.category}
            onChange={handleChange}
            margin="normal"
          />

          {/* PRICE */}

          <TextField
            fullWidth
            required
            type="number"
            label="Course Price"
            name="price"
            value={course.price}
            onChange={handleChange}
            margin="normal"
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

          {/* THUMBNAIL */}

          <TextField
            fullWidth
            label="Thumbnail URL"
            name="thumbnail"
            value={course.thumbnail}
            onChange={handleChange}
            margin="normal"
            placeholder="https://example.com/image.jpg"
            helperText="Optional course thumbnail URL"
          />

          {/* THUMBNAIL PREVIEW */}

          {course.thumbnail && (
            <Box
              sx={{
                mt: 2,
                mb: 2,
              }}
            >
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mb: 1 }}
              >
                Thumbnail Preview
              </Typography>

              <Box
                component="img"
                src={course.thumbnail}
                alt="Course thumbnail"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
                sx={{
                  width: "100%",
                  maxHeight: 250,
                  objectFit: "cover",
                  borderRadius: 3,
                  border: "1px solid",
                  borderColor: "divider",
                }}
              />
            </Box>
          )}

          {/* DESCRIPTION */}

          <TextField
            fullWidth
            required
            multiline
            minRows={5}
            label="Course Description"
            name="description"
            value={course.description}
            onChange={handleChange}
            margin="normal"
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
                py: 1.2,
                borderRadius: 2,
                textTransform: "none",
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
                  sm: 170,
                },
                py: 1.2,
                borderRadius: 2,
                textTransform: "none",
              }}
            >
              {saving
                ? "Updating..."
                : "Update Course"}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default EditCourse;