import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
} from "@mui/material";

import logo from "../../assets/LearnHub.png";
import { createCourse } from "../../services/courseService";

const CreateCourse = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await createCourse({
        ...formData,
        price: Number(formData.price),
      });

      alert("Course created successfully!");

      navigate("/courses");
    } catch (error) {
      console.log(error);

      alert(
        error.response?.data?.message ||
          "Failed to create course"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container
      maxWidth="md"
      sx={{
        mt: 6,
        mb: 4,
      }}
    >
      <Paper
        elevation={8}
        sx={{
          p: 4,
          borderRadius: 3,
        }}
      >
        <Box textAlign="center" mb={3}>
          <Box
            sx={{
              width: 180,
              height: 40,
              overflow: "hidden",
              mx: "auto",
              mb: 2,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Box
              component="img"
              src={logo}
              alt="LearnHub Logo"
              sx={{
                width: 250,
                height: "auto",
                objectFit: "contain",
                ml: "-65px",
              }}
            />
          </Box>

          <Typography
            variant="h4"
            fontWeight="bold"
          >
            Create New Course
          </Typography>

          <Typography
            variant="body1"
            color="text.secondary"
            mt={1}
          >
            Create and publish a new course
          </Typography>
        </Box>

        <Box
          component="form"
          onSubmit={handleSubmit}
        >
          <TextField
            fullWidth
            required
            label="Course Title"
            name="title"
            margin="normal"
            value={formData.title}
            onChange={handleChange}
          />

          <TextField
            fullWidth
            required
            multiline
            rows={4}
            label="Description"
            name="description"
            margin="normal"
            value={formData.description}
            onChange={handleChange}
          />

          <TextField
            fullWidth
            label="Thumbnail URL"
            name="thumbnail"
            margin="normal"
            value={formData.thumbnail}
            onChange={handleChange}
          />

          <TextField
            fullWidth
            required
            type="number"
            label="Price"
            name="price"
            margin="normal"
            value={formData.price}
            onChange={handleChange}
          />

          <TextField
            fullWidth
            required
            label="Category"
            name="category"
            margin="normal"
            value={formData.category}
            onChange={handleChange}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={loading}
            sx={{
              mt: 3,
              py: 1.4,
              textTransform: "none",
              borderRadius: 2,
            }}
          >
            {loading ? "Creating..." : "Create Course"}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default CreateCourse;