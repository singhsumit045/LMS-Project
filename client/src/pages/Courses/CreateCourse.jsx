
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
} from "@mui/material";

import {
  School,
  Save,
  ArrowBack,
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

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

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

    if (formData.price === "" || Number(formData.price) < 0) {
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
      console.log("Create course error:", error);

      setError(
        error.response?.data?.message ||
          "Failed to create course. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container
      maxWidth="md"
      sx={{
        py: {
          xs: 3,
          md: 6,
        },
      }}
    >
      {/* Back Button */}

      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate("/courses")}
        sx={{
          mb: 2,
          textTransform: "none",
        }}
      >
        Back to Courses
      </Button>

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
        {/* Header */}

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
              alignItems: "center",
              justifyContent: "center",
              bgcolor: "primary.main",
              color: "primary.contrastText",
            }}
          >
            <School fontSize="large" />
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
            Create New Course
          </Typography>

          <Typography
            color="text.secondary"
            sx={{
              mt: 1,
            }}
          >
            Add course information and publish it on LearnHub.
          </Typography>
        </Box>

        <Divider sx={{ mb: 4 }} />

        {/* Error */}

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

        {/* Form */}

        <Box
          component="form"
          onSubmit={handleSubmit}
        >
          <Grid container spacing={2.5}>
            {/* Title */}

            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                required
                label="Course Title"
                name="title"
                placeholder="e.g. Full Stack Web Development"
                value={formData.title}
                onChange={handleChange}
              />
            </Grid>

            {/* Category */}

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                required
                label="Category"
                name="category"
                placeholder="e.g. Web Development"
                value={formData.category}
                onChange={handleChange}
              />
            </Grid>

            {/* Price */}

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                required
                type="number"
                label="Course Price"
                name="price"
                value={formData.price}
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

            {/* Thumbnail */}

            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Thumbnail URL"
                name="thumbnail"
                placeholder="https://example.com/course-image.jpg"
                value={formData.thumbnail}
                onChange={handleChange}
                helperText="Optional — add an image URL for the course thumbnail."
              />
            </Grid>

            {/* Thumbnail Preview */}

            {formData.thumbnail && (
              <Grid size={{ xs: 12 }}>
                <Box
                  component="img"
                  src={formData.thumbnail}
                  alt="Course thumbnail preview"
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
              </Grid>
            )}

            {/* Description */}

            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                required
                multiline
                minRows={5}
                label="Course Description"
                name="description"
                placeholder="Describe what students will learn in this course..."
                value={formData.description}
                onChange={handleChange}
              />
            </Grid>

            {/* Buttons */}

            <Grid size={{ xs: 12 }}>
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
                  onClick={() => navigate("/courses")}
                  disabled={loading}
                  sx={{
                    minWidth: 140,
                    textTransform: "none",
                    borderRadius: 2,
                    py: 1.2,
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
                    minWidth: 170,
                    textTransform: "none",
                    borderRadius: 2,
                    py: 1.2,
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
    </Container>
  );
};

export default CreateCourse;

