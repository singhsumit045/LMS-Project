
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  Container,
  Paper,
  Typography,
  Button,
  Box,
  CircularProgress,
  Alert,
  Divider,
  TextField,
  Stack,
} from "@mui/material";

import {
  ArrowBack,
  CloudUpload,
  VideoLibrary,
  PlayCircle,
} from "@mui/icons-material";

import { getCourseById } from "../../services/courseService";
import {
  uploadVideo,
  getVideosByCourse,
} from "../../services/videoService";

const ManageVideos = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================
  // VIDEOS
  // =========================

  const [videos, setVideos] = useState([]);
  const [videosLoading, setVideosLoading] = useState(true);
  const [videosError, setVideosError] = useState("");

  // =========================
  // VIDEO FORM
  // =========================

  const [showForm, setShowForm] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoFile, setVideoFile] = useState(null);

  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState("");

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

      setCourse(response.data);
    } catch (error) {
      console.log("Manage videos error:", error);

      setError(
        error.response?.data?.message ||
          "Unable to load course."
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

      setVideos(response.data);
    } catch (error) {
      console.log("Fetch videos error:", error);

      setVideosError(
        error.response?.data?.message ||
          "Unable to load videos."
      );
    } finally {
      setVideosLoading(false);
    }
  };

  // =========================
  // OPEN FORM
  // =========================

  const handleOpenForm = () => {
    setShowForm(true);
    setUploadError("");
    setUploadSuccess("");
  };

  // =========================
  // CLOSE FORM
  // =========================

  const handleCloseForm = () => {
    setShowForm(false);

    setTitle("");
    setDescription("");
    setVideoFile(null);

    setUploadError("");
    setUploadSuccess("");
  };

  // =========================
  // SELECT VIDEO
  // =========================

  const handleVideoChange = (event) => {
    const file = event.target.files[0];

    if (!file) {
      setVideoFile(null);
      return;
    }

    setVideoFile(file);
  };

  // =========================
  // UPLOAD VIDEO
  // =========================

  const handleUploadVideo = async () => {
    try {
      setUploadError("");
      setUploadSuccess("");

      // TITLE VALIDATION
      if (!title.trim()) {
        setUploadError(
          "Please enter video title."
        );
        return;
      }

      // DESCRIPTION VALIDATION
      if (!description.trim()) {
        setUploadError(
          "Please enter video description."
        );
        return;
      }

      // FILE VALIDATION
      if (!videoFile) {
        setUploadError(
          "Please select a video file."
        );
        return;
      }

      setUploading(true);

      // =========================
      // UPLOAD USING VIDEO SERVICE
      // =========================

      const response = await uploadVideo(
        title,
        description,
        course.id,
        videoFile
      );

      console.log(
        "Video uploaded:",
        response.data
      );

      // SUCCESS MESSAGE
      setUploadSuccess(
        "Video uploaded successfully!"
      );

      // RESET FORM
      setTitle("");
      setDescription("");
      setVideoFile(null);

      // REFRESH VIDEO LIST
      await fetchVideos();

      // CLOSE FORM
      setShowForm(false);

    } catch (error) {
      console.log(
        "Video upload error:",
        error
      );

      setUploadError(
        error.response?.data?.message ||
          error.message ||
          "Something went wrong while uploading video."
      );
    } finally {
      setUploading(false);
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
      <Container
        maxWidth="md"
        sx={{
          py: 8,
        }}
      >
        <Alert severity="error">
          {error || "Course not found."}
        </Alert>

        <Button
          startIcon={<ArrowBack />}
          sx={{
            mt: 3,
          }}
          onClick={() =>
            navigate(
              `/courses/${id}/manage-content`
            )
          }
        >
          Back to Manage Content
        </Button>
      </Container>
    );
  }

  // =========================
  // UI
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
          navigate(
            `/courses/${course.id}/manage-content`
          )
        }
        sx={{
          mb: 3,
        }}
      >
        Back to Manage Content
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
          borderRadius: 4,
          border: "1px solid",
          borderColor: "divider",
          mb: 4,
        }}
      >
        <Typography
          variant="h4"
          fontWeight={700}
        >
          Manage Videos
        </Typography>

        <Typography
          color="text.secondary"
          sx={{
            mt: 1,
          }}
        >
          {course.title}
        </Typography>

        <Divider
          sx={{
            my: 3,
          }}
        />

        <Button
          variant="contained"
          startIcon={<CloudUpload />}
          size="large"
          onClick={handleOpenForm}
        >
          Add Video
        </Button>
      </Paper>

      {/* =========================
          SUCCESS MESSAGE
      ========================= */}

      {uploadSuccess && (
        <Alert
          severity="success"
          sx={{
            mb: 3,
            borderRadius: 2,
          }}
        >
          {uploadSuccess}
        </Alert>
      )}

      {/* =========================
          ADD VIDEO FORM
      ========================= */}

      {showForm && (
        <Paper
          elevation={0}
          sx={{
            p: {
              xs: 3,
              md: 4,
            },
            borderRadius: 4,
            border: "1px solid",
            borderColor: "divider",
            mb: 4,
          }}
        >
          <Stack spacing={3}>
            {/* FORM HEADER */}

            <Box>
              <Typography
                variant="h5"
                fontWeight={700}
              >
                Add New Video
              </Typography>

              <Typography
                color="text.secondary"
                sx={{
                  mt: 0.5,
                }}
              >
                Add a video to "{course.title}"
              </Typography>
            </Box>

            {/* =========================
                TITLE
            ========================= */}

            <TextField
              fullWidth
              label="Video Title"
              placeholder="Enter video title"
              value={title}
              onChange={(event) =>
                setTitle(event.target.value)
              }
            />

            {/* =========================
                DESCRIPTION
            ========================= */}

            <TextField
              fullWidth
              multiline
              minRows={4}
              label="Description"
              placeholder="Enter video description"
              value={description}
              onChange={(event) =>
                setDescription(
                  event.target.value
                )
              }
            />
            {/* =========================
                VIDEO FILE
            ========================= */}

            <Box>
              <Button
                component="label"
                variant="outlined"
                startIcon={<VideoLibrary />}
              >
                Choose Video

                <input
                  type="file"
                  hidden
                  accept="video/*"
                  onChange={handleVideoChange}
                />
              </Button>

              {videoFile && (
                <Typography
                  color="text.secondary"
                  sx={{
                    mt: 1,
                  }}
                >
                  Selected: {videoFile.name}
                </Typography>
              )}
            </Box>

            {/* =========================
                UPLOAD ERROR
            ========================= */}

            {uploadError && (
              <Alert severity="error">
                {uploadError}
              </Alert>
            )}

            {/* =========================
                ACTIONS
            ========================= */}

            <Stack
              direction={{
                xs: "column",
                sm: "row",
              }}
              spacing={2}
            >
              <Button
                variant="contained"
                startIcon={<CloudUpload />}
                onClick={handleUploadVideo}
                disabled={uploading}
              >
                {uploading
                  ? "Uploading..."
                  : "Upload Video"}
              </Button>

              <Button
                variant="outlined"
                onClick={handleCloseForm}
                disabled={uploading}
              >
                Cancel
              </Button>
            </Stack>
          </Stack>
        </Paper>
      )}

      {/* =========================
          VIDEO LIST
      ========================= */}

      <Paper
        elevation={0}
        sx={{
          p: {
            xs: 3,
            md: 4,
          },
          borderRadius: 4,
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
          Course Videos
        </Typography>

        {/* =========================
            VIDEO LOADING
        ========================= */}

        {videosLoading && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              py: 4,
            }}
          >
            <CircularProgress />
          </Box>
        )}

        {/* =========================
            VIDEO ERROR
        ========================= */}

        {!videosLoading &&
          videosError && (
            <Alert severity="error">
              {videosError}
            </Alert>
          )}

        {/* =========================
            NO VIDEOS
        ========================= */}

        {!videosLoading &&
          !videosError &&
          videos.length === 0 && (
            <Typography color="text.secondary">
              No videos added yet.
            </Typography>
          )}

        {/* =========================
            VIDEO LIST
        ========================= */}

        {!videosLoading &&
          !videosError &&
          videos.length > 0 && (
            <Stack spacing={2}>
              {videos.map((video) => (
                <Paper
                  key={video.id}
                  variant="outlined"
                  sx={{
                    p: 2.5,
                    borderRadius: 3,
                  }}
                >
                  <Typography
                    variant="h6"
                    fontWeight={600}
                  >
                    {video.title}
                  </Typography>

                  <Typography
                    color="text.secondary"
                    sx={{
                      mt: 0.5,
                    }}
                  >
                    {video.description}
                  </Typography>

                  <Button
                    variant="outlined"
                    startIcon={
                      <PlayCircle />
                    }
                    sx={{
                      mt: 2,
                    }}
                    onClick={() =>
                      window.open(
                        video.videoUrl,
                        "_blank"
                      )
                    }
                  >
                    Watch Video
                  </Button>
                </Paper>
              ))}
            </Stack>
          )}
      </Paper>
    </Container>
  );
};

export default ManageVideos;

