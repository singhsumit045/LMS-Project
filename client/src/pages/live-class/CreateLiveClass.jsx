
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
  Alert,
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import VideoCallIcon from "@mui/icons-material/VideoCall";
import SchoolIcon from "@mui/icons-material/School";

import { createLiveClass } from "../../services/liveClassService";

// IMPORTANT:
// Apne existing courseService.js ke according function name check karo.
// Agar tumhare paas getMyCourses nahi hai to mujhe courseService.js bhejna.
import { getCourses } from "../../services/courseService";

const CreateLiveClass = () => {
  const navigate = useNavigate();

  // ==========================================
  // FORM
  // ==========================================

  const [form, setForm] = useState({
    title: "",
    description: "",
    courseId: "",
    scheduledAt: "",
  });

  // ==========================================
  // STATES
  // ==========================================

  const [courses, setCourses] = useState([]);

  const [loadingCourses, setLoadingCourses] = useState(true);
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ==========================================
  // GET TEACHER COURSES
  // ==========================================

  useEffect(() => {
    const loadCourses = async () => {
      try {
        setLoadingCourses(true);
        setError("");

        const response = await getCourses();

        console.log("Teacher Courses Response:", response);

        const data =
          response?.data?.data ||
          response?.data ||
          [];

        const courseList = Array.isArray(data)
          ? data
          : data?.courses || [];

        setCourses(courseList);

        console.log("Teacher Courses:", courseList);
      } catch (err) {
        console.error("Load Courses Error:", err);

        setError(
          err?.response?.data?.message ||
            "Unable to load your courses."
        );
      } finally {
        setLoadingCourses(false);
      }
    };

    loadCourses();
  }, []);

  // ==========================================
  // HANDLE INPUT CHANGE
  // ==========================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  // ==========================================
  // SUBMIT
  // ==========================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    // ------------------------------------------
    // BASIC VALIDATION
    // ------------------------------------------

    if (!form.title.trim()) {
      setError("Please enter live class title.");
      return;
    }

    if (!form.courseId) {
      setError("Please select a course.");
      return;
    }

    if (!form.scheduledAt) {
      setError("Please select date and time.");
      return;
    }

    const courseId = Number(form.courseId);

    if (!Number.isInteger(courseId) || courseId <= 0) {
      setError("Invalid course selected.");
      return;
    }

    try {
      setLoading(true);

      // ------------------------------------------
      // CREATE LIVE CLASS
      // ------------------------------------------

      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
        courseId,
        scheduledAt: form.scheduledAt,
      };

      console.log("Creating Live Class:", payload);

      const response = await createLiveClass(payload);

      console.log(
        "Create Live Class Response:",
        response
      );

      // ------------------------------------------
      // GET CREATED LIVE CLASS
      // ------------------------------------------

      const createdLiveClass =
        response?.data?.data ||
        response?.data?.liveClass ||
        response?.data;

      const liveClassId = Number(
        createdLiveClass?.id
      );

      // ------------------------------------------
      // VALIDATE ID
      // ------------------------------------------

      if (
        !Number.isInteger(liveClassId) ||
        liveClassId <= 0
      ) {
        console.error(
          "Invalid Live Class Response:",
          response
        );

        throw new Error(
          "Server did not return a valid Live Class ID."
        );
      }

      console.log(
        "Created Live Class ID:",
        liveClassId
      );

      setSuccess(
        "Live class created successfully!"
      );

      // ------------------------------------------
      // OPEN LIVE CLASS ROOM
      // ------------------------------------------

      navigate(`/live-class/${liveClassId}`);
    } catch (err) {
      console.error(
        "Create Live Class Error:",
        err
      );

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to create live class."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // BACK
  // ==========================================

  const handleBack = () => {
    navigate(-1);
  };

  // ==========================================
  // UI
  // ==========================================

  return (
    <Box
      sx={{
        minHeight: "100vh",
        py: { xs: 3, md: 6 },
        px: { xs: 2, md: 4 },
        bgcolor: "background.default",
      }}
    >
      <Box
        sx={{
          maxWidth: 800,
          mx: "auto",
        }}
      >
        {/* ======================================
            BACK BUTTON
        ====================================== */}

        <Button
          startIcon={<ArrowBackIcon />}
          onClick={handleBack}
          sx={{
            mb: 3,
            textTransform: "none",
            fontWeight: 600,
          }}
        >
          Back
        </Button>

        {/* ======================================
            CARD
        ====================================== */}

        <Card
          elevation={0}
          sx={{
            borderRadius: 4,
            border: "1px solid",
            borderColor: "divider",
            overflow: "hidden",
          }}
        >
          {/* ====================================
              HEADER
          ==================================== */}

          <Box
            sx={{
              px: { xs: 3, md: 5 },
              py: 4,
              background:
                "linear-gradient(135deg, #1565c0, #42a5f5)",
              color: "#fff",
            }}
          >
            <Stack
              direction="row"
              spacing={2}
              alignItems="center"
            >
              <Box
                sx={{
                  width: 52,
                  height: 52,
                  borderRadius: 3,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  bgcolor: "rgba(255,255,255,0.18)",
                }}
              >
                <VideoCallIcon fontSize="large" />
              </Box>

              <Box>
                <Typography
                  variant="h5"
                  fontWeight={700}
                >
                  Create Live Class
                </Typography>

                <Typography
                  variant="body2"
                  sx={{
                    mt: 0.5,
                    opacity: 0.9,
                  }}
                >
                  Schedule a live class for your students
                </Typography>
              </Box>
            </Stack>
          </Box>

          <CardContent
            sx={{
              p: { xs: 3, md: 5 },
            }}
          >
            <Box
              component="form"
              onSubmit={handleSubmit}
            >
              <Stack spacing={3}>

                {/* ==================================
                    ERROR
                ================================== */}

                {error && (
                  <Alert
                    severity="error"
                    onClose={() => setError("")}
                  >
                    {Array.isArray(error)
                      ? error.join(", ")
                      : error}
                  </Alert>
                )}

                {/* ==================================
                    SUCCESS
                ================================== */}

                {success && (
                  <Alert severity="success">
                    {success}
                  </Alert>
                )}

                {/* ==================================
                    TITLE
                ================================== */}

                <TextField
                  fullWidth
                  label="Live Class Title"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="e.g. Java OOP Live Class"
                  required
                  disabled={loading}
                />

                {/* ==================================
                    COURSE DROPDOWN
                ================================== */}

                <FormControl
                  fullWidth
                  required
                  disabled={
                    loading ||
                    loadingCourses ||
                    courses.length === 0
                  }
                >
                  <InputLabel id="course-select-label">
                    Select Course
                  </InputLabel>

                  <Select
                    labelId="course-select-label"
                    name="courseId"
                    value={form.courseId}
                    label="Select Course"
                    onChange={handleChange}
                    startAdornment={
                      <SchoolIcon
                        sx={{
                          mr: 1,
                          color: "text.secondary",
                        }}
                      />
                    }
                  >
                    {loadingCourses ? (
                      <MenuItem disabled>
                        <Stack
                          direction="row"
                          spacing={1}
                          alignItems="center"
                        >
                          <CircularProgress
                            size={20}
                          />

                          <Typography>
                            Loading courses...
                          </Typography>
                        </Stack>
                      </MenuItem>
                    ) : courses.length === 0 ? (
                      <MenuItem disabled>
                        No courses found
                      </MenuItem>
                    ) : (
                      courses.map((course) => (
                        <MenuItem
                          key={course.id}
                          value={course.id}
                        >
                          {course.title ||
                            course.name ||
                            `Course #${course.id}`}
                        </MenuItem>
                      ))
                    )}
                  </Select>
                </FormControl>

                {/* ==================================
                    SELECTED COURSE INFO
                ================================== */}

                {form.courseId && (
                  <Alert
                    severity="info"
                    icon={<SchoolIcon />}
                  >
                    <strong>
                      Selected Course:
                    </strong>{" "}
                    {courses.find(
                      (course) =>
                        Number(course.id) ===
                        Number(form.courseId)
                    )?.title ||
                      courses.find(
                        (course) =>
                          Number(course.id) ===
                          Number(form.courseId)
                      )?.name ||
                      "Selected course"}
                  </Alert>
                )}

                {/* ==================================
                    DESCRIPTION
                ================================== */}

                <TextField
                  fullWidth
                  multiline
                  minRows={4}
                  label="Description"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Describe what will be covered in this live class..."
                  disabled={loading}
                />

                {/* ==================================
                    SCHEDULE
                ================================== */}

                <TextField
                  fullWidth
                  type="datetime-local"
                  label="Scheduled Date & Time"
                  name="scheduledAt"
                  value={form.scheduledAt}
                  onChange={handleChange}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  required
                  disabled={loading}
                />

                {/* ==================================
                    BUTTONS
                ================================== */}

                <Stack
                  direction={{
                    xs: "column",
                    sm: "row",
                  }}
                  spacing={2}
                  justifyContent="flex-end"
                  sx={{
                    pt: 2,
                  }}
                >
                  <Button
                    variant="outlined"
                    onClick={handleBack}
                    disabled={loading}
                    sx={{
                      minWidth: 130,
                      textTransform: "none",
                      fontWeight: 600,
                    }}
                  >
                    Cancel
                  </Button>

                  <Button
                    type="submit"
                    variant="contained"
                    disabled={
                      loading ||
                      loadingCourses ||
                      courses.length === 0
                    }
                    startIcon={
                      loading ? (
                        <CircularProgress
                          size={20}
                          color="inherit"
                        />
                      ) : (
                        <VideoCallIcon />
                      )
                    }
                    sx={{
                      minWidth: 190,
                      textTransform: "none",
                      fontWeight: 700,
                      py: 1.3,
                      borderRadius: 2,
                    }}
                  >
                    {loading
                      ? "Creating..."
                      : "Create Live Class"}
                  </Button>
                </Stack>
              </Stack>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default CreateLiveClass;

