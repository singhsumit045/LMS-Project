
import { useEffect, useState } from "react";
import {
  getProfile,
  updateProfile,
} from "../../services/authService";

import {
  Box,
  Container,
  Paper,
  Typography,
  Avatar,
  Chip,
  Divider,
  CircularProgress,
  Alert,
  Grid,
  IconButton,
  TextField,
  Button,
} from "@mui/material";

import {
  Person,
  Email,
  Badge,
  AccountCircle,
  Edit,
  Check,
  Close,
} from "@mui/icons-material";

function Profile() {
  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");

  useEffect(() => {
    loadProfile();
  }, []);

  // =========================
  // LOAD PROFILE
  // =========================

  const loadProfile = async () => {
    try {
      const response = await getProfile();

      setUser(response.data);
      setName(response.data.name || "");
    } catch (error) {
      console.log(error);
      setError("Unable to load profile.");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // START EDITING
  // =========================

  const handleEdit = () => {
    setName(user.name || "");
    setEditing(true);
    setSuccess("");
    setError("");
  };

  // =========================
  // CANCEL EDITING
  // =========================

  const handleCancel = () => {
    setName(user.name || "");
    setEditing(false);
    setError("");
  };

  // =========================
  // SAVE PROFILE
  // =========================

  const handleSave = async () => {
    const trimmedName = name.trim();

    if (!trimmedName) {
      setError("Name cannot be empty.");
      return;
    }

    if (trimmedName.length < 2) {
      setError("Name must contain at least 2 characters.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const response = await updateProfile({
        name: trimmedName,
      });

      setUser(response.data.user);
      setName(response.data.user.name);

      setEditing(false);
      setSuccess("Profile updated successfully.");
    } catch (error) {
      console.log(error);

      setError(
        error.response?.data?.message ||
          "Unable to update profile."
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
  // ERROR
  // =========================

  if (error && !user) {
    return (
      <Container maxWidth="md" sx={{ mt: 5 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  // =========================
  // NO USER
  // =========================

  if (!user) {
    return (
      <Container maxWidth="md" sx={{ mt: 5 }}>
        <Alert severity="warning">
          Profile information not available.
        </Alert>
      </Container>
    );
  }

  const firstLetter = user.name
    ? user.name.charAt(0).toUpperCase()
    : "U";

  return (
    <Box
      sx={{
        minHeight: "80vh",
        backgroundColor: "#f5f7fb",
        py: {
          xs: 4,
          md: 7,
        },
      }}
    >
      <Container maxWidth="md">
        {/* =========================
            PAGE TITLE
        ========================= */}

        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h4"
            fontWeight={700}
            sx={{
              fontSize: {
                xs: "1.8rem",
                md: "2.2rem",
              },
            }}
          >
            My Profile
          </Typography>

          <Typography
            color="text.secondary"
            sx={{ mt: 0.5 }}
          >
            Manage and view your LearnHub account information.
          </Typography>
        </Box>

        {/* =========================
            SUCCESS / ERROR
        ========================= */}

        {success && (
          <Alert
            severity="success"
            sx={{
              mb: 3,
              borderRadius: 2,
            }}
          >
            {success}
          </Alert>
        )}

        {error && user && (
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

        {/* =========================
            PROFILE HEADER
        ========================= */}

        <Paper
          elevation={0}
          sx={{
            borderRadius: 3,
            border: "1px solid",
            borderColor: "divider",
            overflow: "hidden",
          }}
        >
          {/* COVER */}

          <Box
            sx={{
              height: 120,
              background:
                "linear-gradient(135deg, #1976d2, #42a5f5)",
            }}
          />

          {/* PROFILE CONTENT */}

          <Box
            sx={{
              position: "relative",
              px: {
                xs: 3,
                md: 5,
              },
              pb: 4,
            }}
          >
            {/* EDIT ICON */}

            {!editing && (
              <IconButton
                onClick={handleEdit}
                aria-label="Edit profile"
                sx={{
                  position: "absolute",
                  top: 20,
                  right: {
                    xs: 20,
                    md: 32,
                  },
                  backgroundColor: "background.paper",
                  border: "1px solid",
                  borderColor: "divider",
                  boxShadow: 1,
                  "&:hover": {
                    backgroundColor: "action.hover",
                  },
                }}
              >
                <Edit fontSize="small" />
              </IconButton>
            )}

            {/* AVATAR */}

            <Avatar
              sx={{
                width: 100,
                height: 100,
                mt: -6,
                mb: 2,
                border: "5px solid white",
                backgroundColor: "primary.main",
                fontSize: "2.5rem",
                fontWeight: 700,
              }}
            >
              {firstLetter}
            </Avatar>

            {/* NAME */}

            {editing ? (
              <Box
                sx={{
                  maxWidth: 400,
                  mt: 1,
                }}
              >
                <TextField
                  fullWidth
                  label="Full Name"
                  value={name}
                  onChange={(event) =>
                    setName(event.target.value)
                  }
                  autoFocus
                  size="small"
                />

                {/* SAVE / CANCEL */}

                <Box
                  sx={{
                    display: "flex",
                    gap: 1,
                    mt: 2,
                  }}
                >
                  <Button
                    variant="contained"
                    size="small"
                    startIcon={<Check />}
                    onClick={handleSave}
                    disabled={saving}
                  >
                    {saving ? "Saving..." : "Save"}
                  </Button>

                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<Close />}
                    onClick={handleCancel}
                    disabled={saving}
                  >
                    Cancel
                  </Button>
                </Box>
              </Box>
            ) : (
              <Typography
                variant="h5"
                fontWeight={700}
              >
                {user.name}
              </Typography>
            )}

            {/* EMAIL */}

            <Typography
              color="text.secondary"
              sx={{
                mt: 0.8,
              }}
            >
              {user.email}
            </Typography>

            {/* ROLE */}

            <Chip
              label={
                user.role
                  ? user.role.charAt(0).toUpperCase() +
                    user.role.slice(1)
                  : "User"
              }
              color="primary"
              size="small"
              sx={{
                mt: 2,
                fontWeight: 600,
                textTransform: "capitalize",
              }}
            />
          </Box>
        </Paper>

        {/* =========================
            ACCOUNT INFORMATION
        ========================= */}

        <Paper
          elevation={0}
          sx={{
            mt: 3,
            borderRadius: 3,
            border: "1px solid",
            borderColor: "divider",
            p: {
              xs: 3,
              md: 5,
            },
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
            <AccountCircle color="primary" />

            <Typography
              variant="h6"
              fontWeight={700}
            >
              Account Information
            </Typography>
          </Box>

          <Divider sx={{ mb: 3 }} />

          <Grid container spacing={3}>
            {/* NAME */}

            <Grid size={{ xs: 12, sm: 6 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <Person color="primary" />
                <Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    Full Name
                  </Typography>

                  <Typography
                    fontWeight={600}
                    sx={{ mt: 0.3 }}
                  >
                    {user.name}
                  </Typography>
                </Box>
              </Box>
            </Grid>

            {/* EMAIL */}

            <Grid size={{ xs: 12, sm: 6 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <Email color="primary" />

                <Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    Email Address
                  </Typography>

                  <Typography
                    fontWeight={600}
                    sx={{
                      mt: 0.3,
                      wordBreak: "break-word",
                    }}
                  >
                    {user.email}
                  </Typography>
                </Box>
              </Box>
            </Grid>

            {/* ROLE */}

            <Grid size={{ xs: 12, sm: 6 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <Badge color="primary" />

                <Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    Account Role
                  </Typography>

                  <Typography
                    fontWeight={600}
                    sx={{
                      mt: 0.3,
                      textTransform: "capitalize",
                    }}
                  >
                    {user.role}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
}

export default Profile;

