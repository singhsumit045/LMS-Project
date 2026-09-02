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
} from "@mui/material";
import { alpha } from "@mui/material/styles";

import {
    EmailOutlined,
    LockOutlined,
    CheckCircle,
    ArrowBack,
} from "@mui/icons-material";

import { useLocation, useNavigate, Link } from "react-router-dom";

import api from "../../services/api";

const VerifyEmail = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const emailFromState = location.state?.email || "";

    const [email, setEmail] = useState(emailFromState);
    const [otp, setOtp] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleOtpChange = (e) => {
        const value = e.target.value.replace(/\D/g, "");


        if (value.length <= 6) {
            setOtp(value);
            setError("");
        }


    };

    const handleSubmit = async (e) => {
        e.preventDefault();


        setError("");
        setSuccess("");

        const trimmedEmail = email.trim().toLowerCase();
        const trimmedOtp = otp.trim();

        if (!trimmedEmail) {
            setError("Please enter your email address.");
            return;
        }

        if (!trimmedOtp) {
            setError("Please enter the verification OTP.");
            return;
        }

        if (trimmedOtp.length !== 6) {
            setError("OTP must contain exactly 6 digits.");
            return;
        }

        try {
            setLoading(true);

            const response = await api.post(
                "/auth/verify-email",
                {
                    email: trimmedEmail,
                    otp: trimmedOtp,
                }
            );

            setSuccess(
                response.data?.message ||
                "Email verified successfully."
            );

            setTimeout(() => {
                navigate("/login");
            }, 1500);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to verify email. Please try again."
            );
        } finally {
            setLoading(false);
        }


    };

    return (
        <Box
            sx={(theme) => ({
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: `linear-gradient(135deg, ${alpha(
                    theme.palette.primary.light,
                    theme.palette.mode === "dark" ? 0.15 : 0.25
                )} 0%, ${theme.palette.background.default} 50%, ${alpha(
                    theme.palette.secondary.light,
                    theme.palette.mode === "dark" ? 0.15 : 0.2
                )} 100%)`,
                px: 2,
                py: 4,
            })}
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
                    sx={(theme) => ({
                        width: "100%",
                        maxWidth: 460,
                        p: {
                            xs: 3,
                            sm: 4,
                        },
                        borderRadius: 4,
                        border: "1px solid",
                        borderColor: "divider",
                        backgroundColor: "background.paper",
                        boxShadow: `0 20px 50px ${alpha(
                            theme.palette.common.black,
                            theme.palette.mode === "dark" ? 0.4 : 0.1
                        )}`,
                    })}
                >
                    {/* Header */}


                    <Stack
                        spacing={2}
                        sx={{
                            alignItems: "center",
                            mb: 3
                        }}>
                        <Box
                            sx={(theme) => ({
                                width: 68,
                                height: 68,
                                borderRadius: "50%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                                color: theme.palette.primary.contrastText,
                                boxShadow: `0 10px 25px ${alpha(
                                    theme.palette.primary.main,
                                    0.25
                                )}`,
                            })}
                        >
                            <CheckCircle
                                sx={{ fontSize: 34 }}
                            />
                        </Box>

                        <Box sx={{ textAlign: "center" }}>
                            <Typography
                                variant="h5"
                                sx={{
                                    fontWeight: 700,
                                    color: "text.primary"
                                }}>
                                Verify Your Email
                            </Typography>

                            <Typography
                                variant="body2"
                                sx={{
                                    color: "text.secondary",
                                    mt: 1,
                                    lineHeight: 1.7
                                }}>
                                We've sent a 6-digit verification
                                code to your email address.
                            </Typography>
                        </Box>
                    </Stack>

                    {/* Alerts */}

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

                    {/* Form */}

                    <Box
                        component="form"
                        onSubmit={handleSubmit}
                    >
                        <TextField
                            fullWidth
                            label="Email Address"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                setError("");
                            }}
                            disabled={loading}
                            autoComplete="email"
                            sx={{ mb: 2.5 }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <EmailOutlined color="action" />
                                    </InputAdornment>
                                ),
                            }}
                        />

                        <TextField
                            fullWidth
                            label="Verification OTP"
                            placeholder="Enter 6-digit OTP"
                            value={otp}
                            onChange={handleOtpChange}
                            disabled={loading}
                            inputProps={{
                                maxLength: 6,
                                inputMode: "numeric",
                            }}
                            sx={{
                                mb: 2.5,
                                "& input": {
                                    letterSpacing: "8px",
                                    fontWeight: 700,
                                    textAlign: "center",
                                    fontSize: "1.2rem",
                                },
                            }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <LockOutlined color="action" />
                                    </InputAdornment>
                                ),
                            }}
                        />

                        <Button
                            fullWidth
                            type="submit"
                            variant="contained"
                            color="primary"
                            disabled={loading}
                            sx={{ minHeight: 50 }}
                        >
                            {loading ? (
                                <Stack
                                    direction="row"
                                    spacing={1}
                                    sx={{
                                        alignItems: "center"
                                    }}
                                >
                                    <CircularProgress
                                        size={21}
                                        color="inherit"
                                    />
                                    <span>Verifying...</span>
                                </Stack>
                            ) : (
                                "Verify Email"
                            )}
                        </Button>
                    </Box>

                    {/* Security Information */}

                    <Box
                        sx={(theme) => ({
                            mt: 3,
                            p: 2,
                            borderRadius: 2.5,
                            backgroundColor:
                                theme.palette.mode === "dark"
                                    ? alpha(theme.palette.common.white, 0.05)
                                    : "grey.50",
                            border: "1px solid",
                            borderColor:
                                theme.palette.mode === "dark"
                                    ? alpha(theme.palette.common.white, 0.1)
                                    : "grey.200",
                        })}
                    >
                        <Typography
                            variant="body2"
                            sx={{
                                fontWeight: 600
                            }}
                        >
                            🔒 Secure Verification
                        </Typography>

                        <Typography
                            variant="caption"
                            sx={{
                                color: "text.secondary",
                                display: "block",
                                mt: 0.5,
                                lineHeight: 1.6
                            }}>
                            Your verification OTP is valid for
                            10 minutes. Never share this code
                            with anyone.
                        </Typography>
                    </Box>

                    {/* Back to Login */}

                    <Button
                        component={Link}
                        to="/login"
                        fullWidth
                        startIcon={<ArrowBack />}
                        color="inherit"
                        sx={{
                            mt: 2.5,
                            color: "text.secondary",
                        }}
                    >
                        Back to Login
                    </Button>

                    {/* Footer */}

                    <Typography
                        variant="caption"
                        align="center"
                        sx={{
                            color: "text.secondary",
                            display: "block",
                            mt: 3
                        }}>
                        © {new Date().getFullYear()} LearnHub LMS
                    </Typography>
                </Paper>
            </Container>
        </Box>
    );
};

export default VerifyEmail;
