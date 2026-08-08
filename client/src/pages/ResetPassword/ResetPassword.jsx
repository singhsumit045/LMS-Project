
import { useState } from "react";

import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  InputAdornment,
  Container,
  Stack,
  IconButton,
  Divider,
} from "@mui/material";

import {
  EmailOutlined,
  ArrowBack,
  LockResetOutlined,
  SecurityOutlined,
  Visibility,
  VisibilityOff,
  MarkEmailReadOutlined,
  CheckCircle,
} from "@mui/icons-material";

import { Link, useNavigate } from "react-router-dom";

import api from "../../services/api";

const ForgotPassword = () => {
  const navigate = useNavigate();

  // =====================================================
  // STATES
  // =====================================================

  const [step, setStep] = useState(1);

  const [email, setEmail] = useState("");

  const [otp, setOtp] = useState("");

  const [password, setPassword] = useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  // =====================================================
  // CLEAR MESSAGES
  // =====================================================

  const clearMessages = () => {
    setError("");
    setSuccess("");
  };

  // =====================================================
  // SEND OTP
  // =====================================================

  const handleSendOtp = async (e) => {
    e.preventDefault();

    clearMessages();

    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      setError("Please enter your email address.");
      return;
    }

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(trimmedEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post(
        "/auth/forgot-password",
        {
          email: trimmedEmail,
        }
      );

      setSuccess(
        response.data?.message ||
          "OTP has been sent to your email."
      );

      setStep(2);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to send OTP. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // VERIFY OTP
  // =====================================================

  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    clearMessages();

    const trimmedOtp = otp.trim();

    if (!trimmedOtp) {
      setError("Please enter the OTP.");
      return;
    }

    if (!/^\d{6}$/.test(trimmedOtp)) {
      setError("OTP must be exactly 6 digits.");
      return;
    }

    try {
      setLoading(true);

      await api.post(
        "/auth/verify-reset-otp",
        {
          email: email.trim(),
          otp: trimmedOtp,
        }
      );

      setSuccess(
        "OTP verified successfully. Create your new password."
      );

      setStep(3);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Invalid or expired OTP."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // RESET PASSWORD
  // =====================================================

  const handleResetPassword = async (e) => {
    e.preventDefault();

    clearMessages();

    if (!password) {
      setError("Please enter your new password.");
      return;
    }

    if (password.length < 8) {
      setError(
        "Password must be at least 8 characters."
      );
      return;
    }

    if (!confirmPassword) {
      setError("Please confirm your password.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post(
        "/auth/reset-password",
        {
          email: email.trim(),
          otp: otp.trim(),
          password,
        }
      );

      setSuccess(
        response.data?.message ||
          "Password reset successfully."
      );

      setTimeout(() => {
        navigate("/login");
      }, 1800);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to reset password. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // RESEND OTP
  // =====================================================

  const handleResendOtp = async () => {
    clearMessages();

    try {
      setLoading(true);

      const response = await api.post(
        "/auth/forgot-password",
        {
          email: email.trim(),
        }
      );

      setSuccess(
        response.data?.message ||
          "A new OTP has been sent to your email."
      );

      setOtp("");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to resend OTP."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // BACK TO PREVIOUS STEP
  // =====================================================

  const handleBack = () => {
    clearMessages();

    if (step === 2) {
      setOtp("");
      setStep(1);
      return;
    }

    if (step === 3) {
      setPassword("");
      setConfirmPassword("");
      setStep(2);
    }
  };

  // =====================================================
  // STEP TITLE
  // =====================================================

  const getTitle = () => {
    if (step === 1) {
      return "Forgot Password?";
    }

    if (step === 2) {
      return "Verify OTP";
    }

    return "Create New Password";
  };

  const getSubtitle = () => {
    if (step === 1) {
      return "Enter your registered email address and we'll send you a secure OTP.";
    }

    if (step === 2) {
      return `We've sent a 6-digit OTP to ${email}`;
    }

    return "Your identity has been verified. Create a strong new password.";
  };

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",

        background:
          "linear-gradient(135deg, #eef2ff 0%, #f8fafc 50%, #e0f2fe 100%)",

        py: 4,
        px: 2,
      }}
    >
      <Container
        maxWidth="sm"
        sx={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Paper
          elevation={0}
          sx={{
            width: "100%",
            maxWidth: 470,

            p: {
              xs: 3,
              sm: 4,
            },

            borderRadius: 4,

            border: "1px solid",
            borderColor: "divider",

            boxShadow:
              "0 20px 50px rgba(15, 23, 42, 0.10)",
          }}
        >
          {/* =====================================================
              HEADER
          ===================================================== */}

          <Stack
            spacing={2}
            alignItems="center"
            sx={{ mb: 3 }}
          >
            <Box
              sx={{
                width: 68,
                height: 68,

                borderRadius: "50%",

                display: "flex",
                alignItems: "center",
                justifyContent: "center",

                background:
                  "linear-gradient(135deg, #4f46e5, #2563eb)",

                color: "#fff",

                boxShadow:
                  "0 10px 25px rgba(37, 99, 235, 0.25)",
              }}
            >
              {step === 1 && (
                <LockResetOutlined
                  sx={{ fontSize: 34 }}
                />
              )}

              {step === 2 && (
                <MarkEmailReadOutlined
                  sx={{ fontSize: 34 }}
                />
              )}

              {step === 3 && (
                <CheckCircle
                  sx={{ fontSize: 34 }}
                />
              )}
            </Box>

            <Box sx={{ textAlign: "center" }}>
              <Typography
                variant="h5"
                fontWeight={700}
                color="text.primary"
              >
                {getTitle()}
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  mt: 1,
                  lineHeight: 1.7,
                }}
              >
                {getSubtitle()}
              </Typography>
            </Box>
          </Stack>

          {/* =====================================================
              STEP INDICATOR
          ===================================================== */}

          <Stack
            direction="row"
            alignItems="center"
            sx={{ mb: 3 }}
          >
            {[1, 2, 3].map((item, index) => (
              <Box
                key={item}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  flex: index < 2 ? 1 : "unset",
                }}
              >
                <Box
                  sx={{
                    width: 32,
                    height: 32,

                    borderRadius: "50%",

                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",

                    fontSize: "0.8rem",
                    fontWeight: 700,

                    color:
                      item <= step
                        ? "#fff"
                        : "#64748b",

                    backgroundColor:
                      item <= step
                        ? "#2563eb"
                        : "#e2e8f0",

                    transition:
                      "all 0.25s ease",
                  }}
                >
                  {item < step ? "✓" : item}
                </Box>

                {index < 2 && (
                  <Box
                    sx={{
                      flex: 1,
                      height: 2,
                      mx: 1,

                      backgroundColor:
                        item < step
                          ? "#2563eb"
                          : "#e2e8f0",

                      transition:
                        "all 0.25s ease",
                    }}
                  />
                )}
              </Box>
            ))}
          </Stack>

          {/* =====================================================
              ALERTS
          ===================================================== */}

          {error && (
            <Alert
              severity="error"
              sx={{
                mb: 2.5,
                borderRadius: 2,
              }}
            >
              {error}
            </Alert>
          )}

          {success && (
            <Alert
              severity="success"
              sx={{
                mb: 2.5,
                borderRadius: 2,
              }}
            >
              {success}
            </Alert>
          )}

          {/* =====================================================
              STEP 1 - EMAIL
          ===================================================== */}

          {step === 1 && (
            <Box
              component="form"
              onSubmit={handleSendOtp}
            >
              <TextField
                fullWidth
                label="Email Address"
                placeholder="Enter your registered email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  clearMessages();
                }}
                disabled={loading}
                autoComplete="email"
                sx={{
                  mb: 2.5,

                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2.5,
                  },
                }}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailOutlined color="action" />
                      </InputAdornment>
                    ),
                  },
                }}
              />

              <Button
                fullWidth
                type="submit"
                variant="contained"
                disabled={loading}
                sx={{
                  minHeight: 50,
                  borderRadius: 2.5,

                  textTransform: "none",
                  fontSize: "1rem",
                  fontWeight: 600,

                  background:
                    "linear-gradient(135deg, #4f46e5, #2563eb)",

                  boxShadow:
                    "0 8px 20px rgba(37, 99, 235, 0.20)",

                  "&:hover": {
                    background:
                      "linear-gradient(135deg, #4338ca, #1d4ed8)",
                  },
                }}
              >
                {loading ? (
                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                  >
                    <CircularProgress
                      size={21}
                      color="inherit"
                    />
                    <span>Sending OTP...</span>
                  </Stack>
                ) : (
                  "Send OTP"
                )}
              </Button>
            </Box>
          )}

          {/* =====================================================
              STEP 2 - OTP
          ===================================================== */}

          {step === 2 && (
            <Box
              component="form"
              onSubmit={handleVerifyOtp}
            >
              <TextField
                fullWidth
                label="Enter OTP"
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(e) => {
                  const value =
                    e.target.value
                      .replace(/\D/g, "")
                      .slice(0, 6);

                  setOtp(value);
                  clearMessages();
                }}
                disabled={loading}
                inputMode="numeric"
                autoComplete="one-time-code"
                slotProps={{
                  htmlInput: {
                    maxLength: 6,
                    inputMode: "numeric",
                  },
                }}
                sx={{
                  mb: 2.5,

                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2.5,
                  },

                  "& input": {
                    textAlign: "center",
                    letterSpacing: "8px",
                    fontSize: "1.3rem",
                    fontWeight: 700,
                  },
                }}
              />

              <Button
                fullWidth
                type="submit"
                variant="contained"
                disabled={
                  loading || otp.length !== 6
                }
                sx={{
                  minHeight: 50,
                  borderRadius: 2.5,

                  textTransform: "none",
                  fontSize: "1rem",
                  fontWeight: 600,

                  background:
                    "linear-gradient(135deg, #4f46e5, #2563eb)",
                }}
              >
                {loading ? (
                  <CircularProgress
                    size={22}
                    color="inherit"
                  />
                ) : (
                  "Verify OTP"
                )}
              </Button>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  mt: 2,
                }}
              >
                <Button
                  onClick={handleResendOtp}
                  disabled={loading}
                  sx={{
                    textTransform: "none",
                    fontWeight: 600,
                  }}
                >
                  Didn't receive OTP? Resend
                </Button>
              </Box>

              <Button
                onClick={handleBack}
                startIcon={<ArrowBack />}
                fullWidth
                sx={{
                  mt: 1,
                  textTransform: "none",
                  color: "text.secondary",
                }}
              >
                Change Email
              </Button>
            </Box>
          )}

          {/* =====================================================
              STEP 3 - NEW PASSWORD
          ===================================================== */}

          {step === 3 && (
            <Box
              component="form"
              onSubmit={handleResetPassword}
            >
              <TextField
                fullWidth
                label="New Password"
                placeholder="Enter new password"
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  clearMessages();
                }}
                disabled={loading}
                autoComplete="new-password"
                sx={{
                  mb: 2,

                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2.5,
                  },
                }}
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() =>
                            setShowPassword(
                              !showPassword
                            )
                          }
                          edge="end"
                        >
                          {showPassword ? (
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

              <TextField
                fullWidth
                label="Confirm Password"
                placeholder="Confirm new password"
                type={
                  showConfirmPassword
                    ? "text"
                    : "password"
                }
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(
                    e.target.value
                  );
                  clearMessages();
                }}
                disabled={loading}
                autoComplete="new-password"
                sx={{
                  mb: 2.5,

                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2.5,
                  },
                }}
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

              <Button
                fullWidth
                type="submit"
                variant="contained"
                disabled={loading}
                sx={{
                  minHeight: 50,
                  borderRadius: 2.5,

                  textTransform: "none",
                  fontSize: "1rem",
                  fontWeight: 600,

                  background:
                    "linear-gradient(135deg, #4f46e5, #2563eb)",

                  boxShadow:
                    "0 8px 20px rgba(37, 99, 235, 0.20)",

                  "&:hover": {
                    background:
                      "linear-gradient(135deg, #4338ca, #1d4ed8)",
                  },
                }}
              >
                {loading ? (
                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                  >
                    <CircularProgress
                      size={21}
                      color="inherit"
                    />
                    <span>Updating Password...</span>
                  </Stack>
                ) : (
                  "Reset Password"
                )}
              </Button>

              <Button
                onClick={handleBack}
                startIcon={<ArrowBack />}
                fullWidth
                sx={{
                  mt: 1.5,
                  textTransform: "none",
                  color: "text.secondary",
                }}
              >
                Back to OTP
              </Button>
            </Box>
          )}

          {/* =====================================================
              SECURITY INFO
          ===================================================== */}

          <Box
            sx={{
              mt: 3,

              p: 2,

              borderRadius: 2.5,

              backgroundColor: "#f8fafc",

              border: "1px solid",
              borderColor: "#e2e8f0",
            }}
          >
            <Stack
              direction="row"
              spacing={1.5}
              alignItems="flex-start"
            >
              <SecurityOutlined
                sx={{
                  color: "primary.main",
                  mt: 0.2,
                }}
              />

              <Box>
                <Typography
                  variant="body2"
                  fontWeight={600}
                >
                  Secure Password Recovery
                </Typography>

                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{
                    display: "block",
                    mt: 0.5,
                    lineHeight: 1.6,
                  }}
                >
                  Your OTP is time-limited and can
                  only be used to reset your password.
                </Typography>
              </Box>
            </Stack>
          </Box>

          <Divider sx={{ mt: 3 }} />

          {/* =====================================================
              BACK TO LOGIN
          ===================================================== */}

          <Button
            component={Link}
            to="/login"
            fullWidth
            startIcon={<ArrowBack />}
            sx={{
              mt: 2,

              textTransform: "none",
              fontWeight: 600,

              color: "text.secondary",

              "&:hover": {
                backgroundColor: "grey.100",
              },
            }}
          >
            Back to Login
          </Button>

          {/* =====================================================
              FOOTER
          ===================================================== */}

          <Typography
            variant="caption"
            color="text.secondary"
            align="center"
            sx={{
              display: "block",
              mt: 3,
            }}
          >
            © {new Date().getFullYear()} LearnHub LMS
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};

export default ForgotPassword;

