import { useState } from "react";

import {
  Alert,
  Box,
  Button,
  CircularProgress,
  IconButton,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from "@mui/material";

import {
  Lock,
  Visibility,
  VisibilityOff,
  CheckCircle,
} from "@mui/icons-material";

import { changePassword } from "../../services/authService";

function ChangePassword() {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showCurrentPassword, setShowCurrentPassword] =
    useState(false);

  const [showNewPassword, setShowNewPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setSuccess("");
    setError("");

    if (
      !formData.currentPassword ||
      !formData.newPassword ||
      !formData.confirmPassword
    ) {
      setError("Please fill all fields.");
      return;
    }

    if (formData.newPassword.length < 6) {
      setError(
        "New password must be at least 6 characters."
      );
      return;
    }

    if (
      formData.newPassword !==
      formData.confirmPassword
    ) {
      setError("New passwords do not match.");
      return;
    }

    if (
      formData.currentPassword ===
      formData.newPassword
    ) {
      setError(
        "New password must be different from current password."
      );
      return;
    }

    try {
      setLoading(true);

      await changePassword({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });

      setSuccess("Password changed successfully.");

      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      // Backend invalidates refresh token after
      // successful password change.
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");

      setTimeout(() => {
        window.location.href = "/login";
      }, 1500);
    } catch (error) {
      console.log(error);

      const message =
        error.response?.data?.message;

      if (Array.isArray(message)) {
        setError(message[0]);
      } else {
        setError(
          message ||
            "Unable to change password. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
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
      {/* Header */}

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          mb: 1,
        }}
      >
        <Lock color="primary" />

        <Typography
          variant="h6"
          fontWeight={700}
        >
          Change Password
        </Typography>
      </Box>

      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ mb: 3 }}
      >
        Update your password to keep your account secure.
      </Typography>

      {/* Success */}

      {success && (
        <Alert
          severity="success"
          icon={<CheckCircle />}
          sx={{ mb: 3 }}
        >
          {success}
        </Alert>
      )}

      {/* Error */}

      {error && (
        <Alert
          severity="error"
          sx={{ mb: 3 }}
        >
          {error}
        </Alert>
      )}

      {/* Form */}

      <Box
        component="form"
        onSubmit={handleSubmit}
      >
        {/* Current Password */}

        <TextField
          fullWidth
          label="Current Password"
          name="currentPassword"
          type={
            showCurrentPassword
              ? "text"
              : "password"
          }
          value={formData.currentPassword}
          onChange={handleChange}
          disabled={loading}
          sx={{ mb: 2.5 }}
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() =>
                      setShowCurrentPassword(
                        !showCurrentPassword
                      )
                    }
                    edge="end"
                  >
                    {showCurrentPassword ? (
                      <VisibilityOff />
                    ) : (
                      <Visibility />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
        />

        {/* New Password */}

        <TextField
          fullWidth
          label="New Password"
          name="newPassword"
          type={
            showNewPassword
              ? "text"
              : "password"
          }
          value={formData.newPassword}
          onChange={handleChange}
          disabled={loading}
          helperText="Minimum 6 characters"
          sx={{ mb: 2.5 }}
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() =>
                      setShowNewPassword(
                        !showNewPassword
                      )
                    }
                    edge="end"
                  >
                    {showNewPassword ? (
                      <VisibilityOff />
                    ) : (
                      <Visibility />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
        />

        {/* Confirm Password */}

        <TextField
          fullWidth
          label="Confirm New Password"
          name="confirmPassword"
          type={
            showConfirmPassword
              ? "text"
              : "password"
          }
          value={formData.confirmPassword}
          onChange={handleChange}
          disabled={loading}
          sx={{ mb: 3 }}
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() =>
                      setShowConfirmPassword(
                        !showConfirmPassword
                      )
                    }
                    edge="end"
                  >
                    {showConfirmPassword ? (
                      <VisibilityOff />
                    ) : (
                      <Visibility />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
        />

        {/* Submit */}

        <Button
          type="submit"
          variant="contained"
          size="large"
          disabled={loading}
          startIcon={
            loading ? (
              <CircularProgress
                size={20}
                color="inherit"
              />
            ) : (
              <Lock />
            )
          }
          sx={{
            minWidth: 180,
            fontWeight: 600,
            textTransform: "none",
            borderRadius: 2,
          }}
        >
          {loading
            ? "Updating..."
            : "Change Password"}
        </Button>
      </Box>
    </Paper>
  );
}

export default ChangePassword;