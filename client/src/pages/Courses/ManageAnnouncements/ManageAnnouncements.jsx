import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Divider,
  IconButton,
  Paper,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";

import {
  Add,
  Announcement as AnnouncementIcon,
  ArrowBack,
  Delete,
} from "@mui/icons-material";

import {
  createAnnouncement,
  getAnnouncementsByCourse,
  deleteAnnouncement,
} from "../../../services/announcementService";

const ManageAnnouncements = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // =====================================================
  // STATE
  // =====================================================

  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");

  const [announcements, setAnnouncements] = useState([]);

  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // =====================================================
  // FETCH ANNOUNCEMENTS
  // =====================================================

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getAnnouncementsByCourse(id);

      setAnnouncements(
        Array.isArray(response.data) ? response.data : []
      );
    } catch (error) {
      console.log("Fetch announcements error:", error);

      setError(
        error.response?.data?.message ||
          "Unable to load announcements."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    if (id) {
      fetchAnnouncements();
    }
  }, [id]);

  // =====================================================
  // CREATE ANNOUNCEMENT
  // =====================================================

  const handleCreate = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!title.trim()) {
      setError("Please enter announcement title.");
      return;
    }

    if (!message.trim()) {
      setError("Please enter announcement message.");
      return;
    }

    try {
      setCreating(true);

      await createAnnouncement({
        courseId: Number(id),
        title: title.trim(),
        message: message.trim(),
      });

      setTitle("");
      setMessage("");

      setSuccess("Announcement published successfully.");

      await fetchAnnouncements();
    } catch (error) {
      console.log("Create announcement error:", error);

      setError(
        error.response?.data?.message ||
          "Failed to create announcement."
      );
    } finally {
      setCreating(false);
    }
  };

  // =====================================================
  // DELETE ANNOUNCEMENT
  // =====================================================

  const handleDelete = async (announcementId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this announcement?"
    );

    if (!confirmed) return;

    try {
      setDeletingId(announcementId);
      setError("");
      setSuccess("");

      await deleteAnnouncement(announcementId);

      setAnnouncements((prev) =>
        prev.filter(
          (announcement) =>
            announcement.id !== announcementId
        )
      );

      setSuccess("Announcement deleted successfully.");
    } catch (error) {
      console.log("Delete announcement error:", error);

      setError(
        error.response?.data?.message ||
          "Failed to delete announcement."
      );
    } finally {
      setDeletingId(null);
    }
  };

  // =====================================================
  // PAGE
  // =====================================================

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
      {/* =================================================
          BACK
      ================================================= */}

      <Button
        startIcon={<ArrowBack />}
        onClick={() =>
          navigate(`/courses/${id}/manage-content`)
        }
        sx={{
          mb: 3,
          textTransform: "none",
          fontWeight: 600,
        }}
      >
        Back to Manage Content
      </Button>

      {/* =================================================
          HEADER
      ================================================= */}

      <Box sx={{ mb: 4 }}>
        <Stack
          direction="row"
          spacing={1.5}
          alignItems="center"
        >
          <Box
            sx={{
              width: 50,
              height: 50,
              borderRadius: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: "primary.main",
              color: "primary.contrastText",
            }}
          >
            <AnnouncementIcon />
          </Box>

          <Box>
            <Typography
              variant="h4"
              fontWeight={800}
              sx={{
                fontSize: {
                  xs: "1.8rem",
                  md: "2.2rem",
                },
              }}
            >
              Manage Announcements
            </Typography>

            <Typography
              color="text.secondary"
              sx={{ mt: 0.3 }}
            >
              Share important updates and notices with
              your students.
            </Typography>
          </Box>
        </Stack>
      </Box>

      {/* =================================================
          ALERTS
      ================================================= */}

      {error && (
        <Alert
          severity="error"
          onClose={() => setError("")}
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

      {success && (
        <Alert
          severity="success"
          onClose={() => setSuccess("")}
          sx={{
            mb: 3,
            borderRadius: 2,
          }}
        >
          {success}
        </Alert>
      )}

      {/* =================================================
          CREATE ANNOUNCEMENT
      ================================================= */}

      <Paper
        elevation={0}
        sx={{
          p: {
            xs: 2.5,
            md: 4,
          },
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
          mb: 4,
        }}
      >
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          sx={{ mb: 3 }}
        >
          <Add color="primary" />

          <Typography
            variant="h6"
            fontWeight={800}
          >
            Create Announcement
          </Typography>
        </Stack>

        <Box
          component="form"
          onSubmit={handleCreate}
        >
          <Stack spacing={2.5}>
            <TextField
              fullWidth
              label="Announcement Title"
              placeholder="Enter announcement title"
              value={title}
              onChange={(event) =>
                setTitle(event.target.value)
              }
              disabled={creating}
            />

            <TextField
              fullWidth
              multiline
              minRows={5}
              label="Message"
              placeholder="Write your announcement..."
              value={message}
              onChange={(event) =>
                setMessage(event.target.value)
              }
              disabled={creating}
            />

            <Button
              type="submit"
              variant="contained"
              size="large"
              startIcon={
                creating ? (
                  <CircularProgress
                    size={20}
                    color="inherit"
                  />
                ) : (
                  <AnnouncementIcon />
                )
              }
              disabled={creating}
              sx={{
                alignSelf: {
                  xs: "stretch",
                  sm: "flex-start",
                },
                px: 4,
                py: 1.2,
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 700,
              }}
            >
              {creating
                ? "Publishing..."
                : "Publish Announcement"}
            </Button>
          </Stack>
        </Box>
      </Paper>

      {/* =================================================
          ANNOUNCEMENTS LIST
      ================================================= */}

      <Paper
        elevation={0}
        sx={{
          p: {
            xs: 2.5,
            md: 4,
          },
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <Typography
          variant="h6"
          fontWeight={800}
          sx={{ mb: 1 }}
        >
          Published Announcements
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
        >
          All announcements published for this course.
        </Typography>

        <Divider sx={{ my: 3 }} />

        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              py: 6,
            }}
          >
            <CircularProgress />
          </Box>
        ) : announcements.length === 0 ? (
          <Box
            sx={{
              py: 6,
              textAlign: "center",
            }}
          >
            <AnnouncementIcon
              sx={{
                fontSize: 60,
                color: "text.disabled",
                mb: 1,
              }}
            />

            <Typography
              variant="h6"
              fontWeight={700}
            >
              No announcements yet
            </Typography>

            <Typography
              color="text.secondary"
              sx={{ mt: 0.5 }}
            >
              Published announcements will appear here.
            </Typography>
          </Box>
        ) : (
          <Stack spacing={2}>
            {announcements.map((announcement) => (
              <Paper
                key={announcement.id}
                variant="outlined"
                sx={{
                  p: {
                    xs: 2,
                    md: 2.5,
                  },
                  borderRadius: 3,
                  transition: "all 0.2s ease",
                  "&:hover": {
                    boxShadow: 2,
                    borderColor: "primary.main",
                  },
                }}
              >
                <Stack
                  direction={{
                    xs: "column",
                    sm: "row",
                  }}
                  spacing={2}
                  alignItems={{
                    xs: "flex-start",
                    sm: "center",
                  }}
                >
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      flexShrink: 0,
                      borderRadius: 2,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      bgcolor: "primary.50",
                      color: "primary.main",
                    }}
                  >
                    <AnnouncementIcon />
                  </Box>

                  <Box
                    sx={{
                      flex: 1,
                      minWidth: 0,
                    }}
                  >
                    <Typography
                      variant="h6"
                      fontWeight={800}
                      sx={{
                        wordBreak: "break-word",
                      }}
                    >
                      {announcement.title}
                    </Typography>

                    <Typography
                      color="text.secondary"
                      sx={{
                        mt: 0.7,
                        lineHeight: 1.7,
                        whiteSpace: "pre-wrap",
                        wordBreak: "break-word",
                      }}
                    >
                      {announcement.message}
                    </Typography>

                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{
                        display: "block",
                        mt: 1,
                      }}
                    >
                      {announcement.createdAt
                        ? new Date(
                            announcement.createdAt
                          ).toLocaleString()
                        : "Recently published"}
                    </Typography>
                  </Box>

                  <Tooltip title="Delete announcement">
                    <span>
                      <IconButton
                        color="error"
                        disabled={
                          deletingId === announcement.id
                        }
                        onClick={() =>
                          handleDelete(
                            announcement.id
                          )
                        }
                      >
                        {deletingId === announcement.id ? (
                          <CircularProgress size={22} />
                        ) : (
                          <Delete />
                        )}
                      </IconButton>
                    </span>
                  </Tooltip>
                </Stack>
              </Paper>
            ))}
          </Stack>
        )}
      </Paper>
    </Container>
  );
};

export default ManageAnnouncements;