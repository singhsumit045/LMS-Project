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
            sx={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background:
                    "linear-gradient(135deg, #eef2ff 0%, #f8fafc 50%, #e0f2fe 100%)",
                px: 2,
                py: 4,
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
                        maxWidth: 460,
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
                    {/* Header */}


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
                                color: "white",
                                boxShadow:
                                    "0 10px 25px rgba(37, 99, 235, 0.25)",
                            }}
                        >
                            <CheckCircle
                                sx={{ fontSize: 34 }}
                            />
                        </Box>

                        <Box sx={{ textAlign: "center" }}>
                            <Typography
                                variant="h5"
                                fontWeight={700}
                                color="text.primary"
                            >
                                Verify Your Email
                            </Typography>

                            <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{
                                    mt: 1,
                                    lineHeight: 1.7,
                                }}
                            >
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
                            sx={{
                                mb: 2.5,
                                "& .MuiOutlinedInput-root": {
                                    borderRadius: 2.5,
                                },
                            }}
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
                                "& .MuiOutlinedInput-root": {
                                    borderRadius: 2.5,
                                },
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
                                    boxShadow:
                                        "0 10px 25px rgba(37, 99, 235, 0.28)",
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
                                    <span>Verifying...</span>
                                </Stack>
                            ) : (
                                "Verify Email"
                            )}
                        </Button>
                    </Box>

                    {/* Security Information */}

                    <Box
                        sx={{
                            mt: 3,
                            p: 2,
                            borderRadius: 2.5,
                            backgroundColor: "grey.50",
                            border: "1px solid",
                            borderColor: "grey.200",
                        }}
                    >
                        <Typography
                            variant="body2"
                            fontWeight={600}
                        >
                            🔒 Secure Verification
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
                        sx={{
                            mt: 2.5,
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

                    {/* Footer */}

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

export default VerifyEmail;
