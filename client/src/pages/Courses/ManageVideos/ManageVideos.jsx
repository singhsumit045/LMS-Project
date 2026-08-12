
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
  IconButton,
  Tooltip,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
} from "@mui/material";

import {
  ArrowBack,
  CloudUpload,
  VideoLibrary,
  PlayCircle,
  Delete,
  Close,
  Add,
  Movie,
} from "@mui/icons-material";

import { getCourseById } from "../../../services/courseService";

import {
  uploadVideo,
  getVideosByCourse,
} from "../../../services/videoService";

import api from "../../../services/api";

const ManageVideos = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // =====================================================
  // COURSE
  // =====================================================

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =====================================================
  // VIDEOS
  // =====================================================

  const [videos, setVideos] = useState([]);
  const [videosLoading, setVideosLoading] = useState(true);
  const [videosError, setVideosError] = useState("");

  // =====================================================
  // UPLOAD FORM
  // =====================================================

  const [showForm, setShowForm] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoFile, setVideoFile] = useState(null);

  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  // =====================================================
  // DELETE
  // =====================================================

  const [deleteDialogOpen, setDeleteDialogOpen] =
    useState(false);

  const [selectedVideo, setSelectedVideo] =
    useState(null);

  const [deletingId, setDeletingId] =
    useState(null);

  // =====================================================
  // SUCCESS MESSAGE
  // =====================================================

  const [success, setSuccess] = useState("");

  // =====================================================
  // FETCH DATA
  // =====================================================

  useEffect(() => {
    if (!id) {
      return;
    }

    fetchCourse();
    fetchVideos();
  }, [id]);

  // =====================================================
  // FETCH COURSE
  // =====================================================

  const fetchCourse = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getCourseById(id);

      setCourse(response.data);
    } catch (error) {
      console.error(
        "Manage videos error:",
        error
      );

      setError(
        error.response?.data?.message ||
        "Unable to load course."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // FETCH VIDEOS
  // =====================================================

  const fetchVideos = async () => {
    try {
      setVideosLoading(true);
      setVideosError("");

      const response =
        await getVideosByCourse(id);

      setVideos(
        Array.isArray(response.data)
          ? response.data
          : []
      );
    } catch (error) {
      console.error(
        "Fetch videos error:",
        error
      );

      setVideosError(
        error.response?.data?.message ||
        "Unable to load videos."
      );
    } finally {
      setVideosLoading(false);
    }
  };

  // =====================================================
  // OPEN UPLOAD FORM
  // =====================================================

  const handleOpenForm = () => {
    setShowForm(true);
    setUploadError("");
  };

  // =====================================================
  // CLOSE UPLOAD FORM
  // =====================================================

  const handleCloseForm = () => {
    if (uploading) {
      return;
    }

    setShowForm(false);

    setTitle("");
    setDescription("");
    setVideoFile(null);

    setUploadError("");
  };

  // =====================================================
  // SELECT VIDEO
  // =====================================================

  const handleVideoChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      setVideoFile(null);
      return;
    }

    if (!file.type.startsWith("video/")) {
      setUploadError(
        "Please select a valid video file."
      );

      event.target.value = "";
      setVideoFile(null);

      return;
    }

    setUploadError("");
    setVideoFile(file);
  };

  // =====================================================
  // UPLOAD VIDEO
  // =====================================================

  const handleUploadVideo = async () => {
    try {
      setUploadError("");

      if (!title.trim()) {
        setUploadError(
          "Please enter video title."
        );
        return;
      }

      if (!description.trim()) {
        setUploadError(
          "Please enter video description."
        );
        return;
      }

      if (!videoFile) {
        setUploadError(
          "Please select a video file."
        );
        return;
      }

      setUploading(true);

      const response = await uploadVideo(
        title.trim(),
        description.trim(),
        course.id,
        videoFile
      );

      console.log(
        "Video uploaded:",
        response.data
      );

      // Add new video immediately
      if (response.data) {
        setVideos((prev) => [
          response.data,
          ...prev,
        ]);
      } else {
        await fetchVideos();
      }

      setSuccess(
        "Video uploaded successfully."
      );

      setTitle("");
      setDescription("");
      setVideoFile(null);

      setShowForm(false);
    } catch (error) {
      console.error(
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

  // =====================================================
  // OPEN DELETE DIALOG
  // =====================================================

  const handleOpenDelete = (video) => {
    setSelectedVideo(video);
    setDeleteDialogOpen(true);
  };

  // =====================================================
  // CLOSE DELETE DIALOG
  // =====================================================

  const handleCloseDelete = () => {
    if (deletingId) {
      return;
    }

    setDeleteDialogOpen(false);
    setSelectedVideo(null);
  };

  // =====================================================
  // DELETE VIDEO
  // =====================================================

  const handleDeleteVideo = async () => {
    if (!selectedVideo) {
      return;
    }

    try {
      setDeletingId(selectedVideo.id);
      // Backend:
      // DELETE /videos/:id

      await api.delete(
        `/videos/${selectedVideo.id}`
      );

      // Remove immediately from UI
      setVideos((prev) =>
        prev.filter(
          (video) =>
            video.id !== selectedVideo.id
        )
      );

      setSuccess(
        "Video deleted successfully."
      );

      setDeleteDialogOpen(false);
      setSelectedVideo(null);
    } catch (error) {
      console.error(
        "Delete video error:",
        error
      );

      setVideosError(
        error.response?.data?.message ||
        "Unable to delete video."
      );
    } finally {
      setDeletingId(null);
    }
  };

  // =====================================================
  // WATCH VIDEO
  // =====================================================

  const handleWatchVideo = (url) => {
    if (!url) {
      setVideosError(
        "Video URL is not available."
      );

      return;
    }

    window.open(
      url,
      "_blank",
      "noopener,noreferrer"
    );
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
  // COURSE ERROR
  // =====================================================

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
            textTransform: "none",
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

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <Container
      maxWidth="lg"
      sx={{
        py: {
          xs: 2.5,
          md: 4,
        },
      }}
    >
      {/* =================================================
          BACK BUTTON
      ================================================= */}

      <Button
        size="small"
        startIcon={<ArrowBack />}
        onClick={() =>
          navigate(
            `/courses/${course.id}/manage-content`
          )
        }
        sx={{
          mb: 2,
          textTransform: "none",
          fontWeight: 600,
        }}
      >
        Back to Manage Content
      </Button>

      {/* =================================================
          HEADER
      ================================================= */}

      <Paper
        elevation={0}
        sx={{
          p: {
            xs: 2,
            sm: 2.5,
          },
          mb: 2,
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <Stack
          direction={{
            xs: "column",
            sm: "row",
          }}
          spacing={2}
          sx={{
            alignItems: {
              xs: "flex-start",
              sm: "center",
            },
            justifyContent: "space-between",
          }}
        >
          <Stack
            direction="row"
            spacing={1.5}
            sx={{
              alignItems: "center",
            }}

          >
            <Box
              sx={{
                width: 46,
                height: 46,
                borderRadius: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: "primary.50",
                color: "primary.main",
              }}
            >
              <VideoLibrary />
            </Box>

            <Box>
              <Typography
                variant="h5"
                fontWeight={800}
                sx={{
                  fontSize: {
                    xs: "1.25rem",
                    sm: "1.5rem",
                  },
                }}
              >
                Manage Videos
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
              >
                {course.title}
              </Typography>
            </Box>
          </Stack>

          <Button
            variant="contained"
            size="small"
            startIcon={<Add />}
            onClick={handleOpenForm}
            sx={{
              textTransform: "none",
              borderRadius: 2,
              fontWeight: 700,
            }}
          >
            Add Video
          </Button>
        </Stack>
      </Paper>

      {/* =================================================
          ADD VIDEO FORM
      ================================================= */}

      {showForm && (
        <Paper
          elevation={0}
          sx={{
            p: {
              xs: 2,
              sm: 2.5,
            },
            mb: 2,
            borderRadius: 3,
            border: "1px solid",
            borderColor: "primary.200",
          }}
        >
          <Stack spacing={2}>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <Box>
                <Typography
                  variant="h6"
                  fontWeight={800}
                >
                  Add New Video
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  Add a video to this course.
                </Typography>
              </Box>

              <IconButton
                size="small"
                onClick={handleCloseForm}
                disabled={uploading}
              >
                <Close fontSize="small" />
              </IconButton>
            </Stack>

            <Divider />

            <TextField
              fullWidth
              size="small"
              label="Video Title"
              placeholder="Enter video title"
              value={title}
              onChange={(event) =>
                setTitle(event.target.value)
              }
            />

            <TextField
              fullWidth
              size="small"
              multiline
              minRows={3}
              label="Description"
              placeholder="Enter video description"
              value={description}
              onChange={(event) =>
                setDescription(
                  event.target.value
                )
              }
            />

            {/* VIDEO FILE */}

            <Box
              sx={{
                border: "1px dashed",
                borderColor: videoFile
                  ? "success.main"
                  : "divider",
                borderRadius: 2,
                p: 1.5,
              }}
            >
              <Stack
                direction={{
                  xs: "column",
                  sm: "row",
                }}
                spacing={1.5}
                alignItems={{
                  xs: "flex-start",
                  sm: "center",
                }}
                justifyContent="space-between"
              >
                <Box>
                  <Typography
                    variant="body2"
                    fontWeight={700}
                  >
                    {videoFile
                      ? videoFile.name
                      : "No video selected"}
                  </Typography>

                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    MP4, WebM, MOV or other video
                    formats
                  </Typography>
                </Box>

                <Button
                  component="label"
                  size="small"
                  variant="outlined"
                  startIcon={<VideoLibrary />}
                  sx={{
                    textTransform: "none",
                    borderRadius: 2,
                  }}
                >
                  Choose Video

                  <input
                    type="file"
                    hidden
                    accept="video/*"
                    onChange={
                      handleVideoChange
                    }
                  />
                </Button>
              </Stack>
            </Box>

            {uploadError && (
              <Alert
                severity="error"
                onClose={() =>
                  setUploadError("")
                }
              >
                {uploadError}
              </Alert>
            )}

            <Stack
              direction="row"
              spacing={1}
            >
              <Button
                variant="contained"
                size="small"
                startIcon={
                  uploading ? (
                    <CircularProgress
                      size={16}
                      color="inherit"
                    />
                  ) : (
                    <CloudUpload />
                  )
                }
                onClick={
                  handleUploadVideo
                }
                disabled={uploading}
                sx={{
                  textTransform: "none",
                  borderRadius: 2,
                  fontWeight: 700,
                }}
              >
                {uploading
                  ? "Uploading..."
                  : "Upload Video"}
              </Button>

              <Button
                variant="outlined"
                size="small"
                onClick={handleCloseForm}
                disabled={uploading}
                sx={{
                  textTransform: "none",
                  borderRadius: 2,
                }}
              >
                Cancel
              </Button>
            </Stack>
          </Stack>
        </Paper>
      )}

      {/* =================================================
          VIDEOS SECTION
      ================================================= */}

      <Paper
        elevation={0}
        sx={{
          p: {
            xs: 2,
            sm: 2.5,
          },
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <Stack
          direction="row"

          sx={{
            mb: 2,
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box>
            <Typography
              variant="h6"
              fontWeight={800}
            >
              Course Videos
            </Typography>

            <Typography
              variant="caption"
              color="text.secondary"
            >
              {videos.length}{" "}
              {videos.length === 1
                ? "video"
                : "videos"}
            </Typography>
          </Box>

          <Chip
            size="small"
            icon={<Movie />}
            label={videos.length}
            color="primary"
            variant="outlined"
          />
        </Stack>

        <Divider sx={{ mb: 2 }} />

        {/* =================================================
            VIDEO LOADING
        ================================================= */}

        {videosLoading && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              py: 5,
            }}
          >
            <CircularProgress size={30} />
          </Box>
        )}

        {/* =================================================
            VIDEO ERROR
        ================================================= */}

        {!videosLoading &&
          videosError && (
            <Alert
              severity="error"
              onClose={() =>
                setVideosError("")
              }
            >
              {videosError}
            </Alert>
          )}

        {/* =================================================
            NO VIDEOS
        ================================================= */}

        {!videosLoading &&
          !videosError &&
          videos.length === 0 && (
            <Box
              sx={{
                py: 5,
                textAlign: "center",
              }}
            >
              <Movie
                sx={{
                  fontSize: 42,
                  color: "text.disabled",
                  mb: 1,
                }}
              />

              <Typography
                fontWeight={700}
              >
                No videos added yet
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  mt: 0.5,
                }}
              >
                Add your first course video.
              </Typography>

              <Button
                variant="contained"
                size="small"
                startIcon={<Add />}
                onClick={handleOpenForm}
                sx={{
                  mt: 2,
                  textTransform: "none",
                  borderRadius: 2,
                }}
              >
                Add Video
              </Button>
            </Box>
          )}

        {/* =================================================
            VIDEO LIST
        ================================================= */}

        {!videosLoading &&
          !videosError &&
          videos.length > 0 && (
            <Stack spacing={1.5}>
              {videos.map(
                (video, index) => (
                  <Paper
                    key={video.id}
                    variant="outlined"
                    sx={{
                      p: {
                        xs: 1.5,
                        sm: 2,
                      },
                      borderRadius: 2.5,
                      transition:
                        "all 0.2s ease",

                      "&:hover": {
                        borderColor:
                          "primary.main",
                        boxShadow:
                          "0 4px 14px rgba(0,0,0,0.06)",
                      },
                    }}
                  >
                    <Stack
                      direction={{
                        xs: "column",
                        sm: "row",
                      }}
                      spacing={1.5}
                      sx={{
                        alignItems: {
                          xs: "stretch",
                          sm: "center",
                        },
                      }}
                    >
                      {/* NUMBER / ICON */}

                      <Box
                        sx={{
                          width: 42,
                          height: 42,
                          flexShrink: 0,
                          borderRadius: 2,
                          display: "flex",
                          alignItems:
                            "center",
                          justifyContent:
                            "center",
                          bgcolor:
                            "primary.50",
                          color:
                            "primary.main",
                        }}
                      >
                        <PlayCircle />
                      </Box>

                      {/* INFO */}

                      <Box
                        sx={{
                          flex: 1,
                          minWidth: 0,
                        }}
                      >
                        <Stack
                          direction="row"
                          spacing={1}
                          sx={{
                            alignItems: "center",
                            flexWrap: "wrap",
                            columnGap: 1,
                            rowGap: 1,
                          }}
                        >
                          <Typography
                            fontWeight={800}
                            sx={{
                              wordBreak:
                                "break-word",
                            }}
                          >
                            {index + 1}.{" "}
                            {video.title ||
                              "Untitled Video"}
                          </Typography>

                          <Chip
                            label="VIDEO"
                            size="small"
                            variant="outlined"
                            color="primary"
                            sx={{
                              height: 22,
                              fontSize: 10,
                              fontWeight: 700,
                            }}
                          />
                        </Stack>

                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            mt: 0.4,
                            display:
                              "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient:
                              "vertical",
                            overflow: "hidden",
                            lineHeight: 1.45,
                          }}
                        >
                          {video.description ||
                            "No description available."}
                        </Typography>
                      </Box>

                      {/* ACTIONS */}

                      <Stack
                        direction="row"
                        spacing={0.5}
                        sx={{
                          justifyContent: {
                            xs: "flex-end",
                            sm: "initial",
                          },
                        }}
                      >
                        <Tooltip title="Watch Video">
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() =>
                              handleWatchVideo(
                                video.videoUrl
                              )
                            }
                            sx={{
                              border:
                                "1px solid",
                              borderColor:
                                "divider",
                            }}
                          >
                            <PlayCircle fontSize="small" />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Delete Video">
                          <span>
                            <IconButton
                              size="small"
                              color="error"
                              disabled={
                                deletingId ===
                                video.id
                              }
                              onClick={() =>
                                handleOpenDelete(
                                  video
                                )
                              }
                              sx={{
                                border:
                                  "1px solid",
                                borderColor:
                                  "divider",
                              }}
                            >
                              {deletingId ===
                                video.id ? (
                                <CircularProgress
                                  size={18}
                                />
                              ) : (
                                <Delete fontSize="small" />
                              )}
                            </IconButton>
                          </span>
                        </Tooltip>
                      </Stack>
                    </Stack>
                  </Paper>
                )
              )}
            </Stack>
          )}
      </Paper>

      {/* =================================================
          DELETE CONFIRMATION DIALOG
      ================================================= */}

      <Dialog
        open={deleteDialogOpen}
        onClose={handleCloseDelete}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle
          sx={{
            fontWeight: 800,
          }}
        >
          Delete Video?
        </DialogTitle>

        <DialogContent>
          <Typography
            variant="body2"
            color="text.secondary"
          >
            Are you sure you want to delete{" "}
            <strong>
              "{selectedVideo?.title}"
            </strong>
            ?
          </Typography>

          <Alert
            severity="warning"
            sx={{
              mt: 2,
              borderRadius: 2,
            }}
          >
            This will permanently remove the
            video from the course and Cloudinary.
          </Alert>
        </DialogContent>

        <DialogActions
          sx={{
            px: 3,
            pb: 2,
          }}
        >
          <Button
            onClick={handleCloseDelete}
            disabled={Boolean(deletingId)}
            sx={{
              textTransform: "none",
            }}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            color="error"
            startIcon={
              deletingId ? (
                <CircularProgress
                  size={16}
                  color="inherit"
                />
              ) : (
                <Delete />
              )
            }
            onClick={handleDeleteVideo}
            disabled={Boolean(deletingId)}
            sx={{
              textTransform: "none",
              fontWeight: 700,
              borderRadius: 2,
            }}
          >
            {deletingId
              ? "Deleting..."
              : "Delete Video"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* =================================================
          SUCCESS SNACKBAR
      ================================================= */}

      <Snackbar
        open={Boolean(success)}
        autoHideDuration={3000}
        onClose={() =>
          setSuccess("")
        }
        message={success}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
      />
    </Container>
  );
};

export default ManageVideos;

