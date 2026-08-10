import {
    Box,
    Typography,
    TextField,
    Button,
    Link,
    Paper,
    InputAdornment,
    IconButton,
    Divider,
    CircularProgress,
} from "@mui/material";

import {
    Link as RouterLink,
    useNavigate,
} from "react-router-dom";

import { useState } from "react";
import { useTheme } from "@mui/material/styles";

import logo from "../../assets/LearnHub.png";

import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import MenuBookOutlinedIcon from "@mui/icons-material/MenuBookOutlined";
import TrendingUpOutlinedIcon from "@mui/icons-material/TrendingUpOutlined";

import { validateLogin } from "../../utils/validation";
import { loginUser } from "../../services/authService";

const Login = () => {
    const navigate = useNavigate();
    const theme = useTheme();

    const isDark = theme.palette.mode === "dark";

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [errors, setErrors] = useState({});

    // =========================
    // HANDLE INPUT CHANGE
    // =========================

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        setErrors((prev) => ({
            ...prev,
            [name]: "",
        }));
    };

    // =========================
    // LOGIN
    // =========================

    const handleLogin = async (e) => {
        e.preventDefault();

        const validationErrors = validateLogin(formData);

        setErrors(validationErrors);

        if (Object.keys(validationErrors).length > 0) {
            return;
        }

        try {
            setLoading(true);

            const response = await loginUser(formData);

            console.log("LOGIN SUCCESS:", response.data);

            // Save token if backend returns it
            if (response.data?.access_token) {
                localStorage.setItem(
                    "token",
                    response.data.access_token
                );
            }

            // Save user information if available
            if (response.data?.user) {
                localStorage.setItem(
                    "user",
                    JSON.stringify(response.data.user)
                );
            }

            navigate("/dashboard");
        } catch (error) {
            console.log("LOGIN ERROR:", error);
            console.log("RESPONSE:", error.response?.data);

            const message =
                error.response?.data?.message ||
                "Invalid email or password";

            setErrors({
                general: Array.isArray(message)
                    ? message[0]
                    : message,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            sx={{
                minHeight: "100dvh",
                width: "100%",
                overflowX: "hidden",
                overflowY: "auto",

                display: "flex",

                alignItems: {
                    xs: "flex-start",
                    sm: "center",
                },

                justifyContent: "center",

                background: isDark
                    ? "linear-gradient(135deg, #0f0f0f 0%, #171717 100%)"
                    : "linear-gradient(135deg, #f4f8ff 0%, #eef3fa 100%)",

                boxSizing: "border-box",

                p: {
                    xs: 0,
                    sm: 2,
                    md: 3,
                },
            }}
        >
            {/* =========================
          MAIN CARD
      ========================= */}

            <Paper
                elevation={0}
                sx={{
                    width: "100%",

                    maxWidth: {
                        xs: "100%",
                        sm: 720,
                        md: 1000,
                        lg: 1120,
                    },

                    minHeight: {
                        xs: "100dvh",
                        sm: "auto",
                        md: 620,
                    },

                    display: "flex",

                    flexDirection: {
                        xs: "column",
                        md: "row",
                    },

                    overflow: "hidden",

                    borderRadius: {
                        xs: 0,
                        sm: 4,
                        md: 5,
                    },

                    border: {
                        xs: "none",
                        sm: "1px solid",
                    },

                    borderColor: isDark
                        ? "rgba(255,255,255,0.08)"
                        : "rgba(15,23,42,0.08)",

                    backgroundColor: isDark
                        ? "#1b1b1b"
                        : "#ffffff",

                    boxShadow: {
                        xs: "none",
                        sm: isDark
                            ? "0 25px 70px rgba(0,0,0,0.45)"
                            : "0 25px 70px rgba(31,41,55,0.12)",
                    },
                }}
            >
                {/* =====================================================
            LEFT SIDE
        ===================================================== */}

                <Box
                    sx={{
                        width: {
                            xs: "100%",
                            md: "47%",
                        },

                        minHeight: {
                            xs: "auto",
                            md: 620,
                        },

                        display: {
                            xs: "none",
                            md: "flex",
                        },

                        position: "relative",
                        overflow: "hidden",

                        flexDirection: "column",
                        justifyContent: "space-between",

                        p: {
                            md: 4,
                            lg: 5,
                        },

                        color: "#ffffff",

                        background:
                            "linear-gradient(145deg, #1976d2 0%, #1565c0 45%, #0d47a1 100%)",
                    }}
                >
                    {/* Decorative Circle */}

                    <Box
                        sx={{
                            position: "absolute",

                            width: {
                                md: 220,
                                lg: 320,
                            },

                            height: {
                                md: 220,
                                lg: 320,
                            },

                            borderRadius: "50%",

                            background:
                                "rgba(255,255,255,0.07)",

                            top: {
                                md: -100,
                                lg: -130,
                            },

                            right: {
                                md: -80,
                                lg: -100,
                            },
                        }}
                    />

                    <Box
                        sx={{
                            position: "absolute",

                            width: {
                                md: 180,
                                lg: 250,
                            },

                            height: {
                                md: 180,
                                lg: 250,
                            },

                            borderRadius: "50%",

                            background:
                                "rgba(255,255,255,0.06)",

                            bottom: -90,
                            left: -90,
                        }}
                    />

                    {/* =========================
              LOGO
          ========================= */}

                    <Box
                        sx={{
                            position: "relative",
                            zIndex: 2,
                        }}
                    >
                        <Box
                            sx={{
                                display: "inline-flex",

                                alignItems: "center",

                                backgroundColor: "#ffffff",

                                borderRadius: 2.5,

                                px: {
                                    md: 1.5,
                                    lg: 2,
                                },

                                py: {
                                    md: 0.75,
                                    lg: 1,
                                },

                                boxShadow:
                                    "0 8px 20px rgba(0,0,0,0.10)",
                            }}
                        >
                            <Box
                                component="img"
                                src={logo}
                                alt="LearnHub Logo"
                                sx={{
                                    width: {
                                        md: 120,
                                        lg: 145,
                                    },

                                    height: "auto",
                                    display: "block",
                                }}
                            />
                        </Box>
                    </Box>

                    {/* =========================
              CENTER CONTENT
          ========================= */}

                    <Box
                        sx={{
                            position: "relative",
                            zIndex: 2,

                            textAlign: "center",
                            px: 2,
                        }}
                    >
                        <Box
                            sx={{
                                width: {
                                    md: 135,
                                    lg: 170,
                                },

                                height: {
                                    md: 135,
                                    lg: 170,
                                },

                                borderRadius: "50%",

                                mx: "auto",

                                mb: {
                                    md: 2,
                                    lg: 3,
                                },

                                display: "flex",

                                alignItems: "center",
                                justifyContent: "center",

                                position: "relative",

                                background:
                                    "rgba(255,255,255,0.12)",

                                border:
                                    "1px solid rgba(255,255,255,0.12)",

                                boxShadow:
                                    "inset 0 0 40px rgba(255,255,255,0.04)",
                            }}
                        >
                            <SchoolOutlinedIcon
                                sx={{
                                    fontSize: {
                                        md: 65,
                                        lg: 85,
                                    },
                                }}
                            />

                            <Box
                                sx={{
                                    position: "absolute",

                                    right: {
                                        md: 0,
                                        lg: 5,
                                    },

                                    bottom: {
                                        md: 5,
                                        lg: 10,
                                    },

                                    width: {
                                        md: 40,
                                        lg: 48,
                                    },

                                    height: {
                                        md: 40,
                                        lg: 48,
                                    },

                                    borderRadius: "50%",

                                    display: "flex",

                                    alignItems: "center",
                                    justifyContent: "center",

                                    color: "#1976d2",

                                    backgroundColor: "#ffffff",

                                    boxShadow:
                                        "0 8px 20px rgba(0,0,0,0.15)",
                                }}
                            >
                                <MenuBookOutlinedIcon fontSize="small" />
                            </Box>
                        </Box>

                        <Typography
                            fontWeight={800}
                            sx={{
                                fontSize: {
                                    md: "1.65rem",
                                    lg: "2rem",
                                },

                                mb: 1,
                            }}
                        >
                            Learn. Grow. Succeed.
                        </Typography>

                        <Typography
                            sx={{
                                maxWidth: 390,

                                mx: "auto",

                                color:
                                    "rgba(255,255,255,0.82)",

                                fontSize: {
                                    md: "0.88rem",
                                    lg: "0.98rem",
                                },

                                lineHeight: 1.7,
                            }}
                        >
                            Continue your learning journey
                            with LearnHub and build the
                            skills that shape your future.
                        </Typography>

                        {/* FEATURES */}

                        <Box
                            sx={{
                                display: "flex",

                                justifyContent: "center",

                                gap: {
                                    md: 3,
                                    lg: 5,
                                },

                                mt: {
                                    md: 3,
                                    lg: 4,
                                },
                            }}
                        >
                            <Box sx={{ textAlign: "center" }}>
                                <MenuBookOutlinedIcon />

                                <Typography
                                    variant="caption"
                                    display="block"
                                    sx={{ mt: 0.5 }}
                                >
                                    Courses
                                </Typography>
                            </Box>

                            <Box sx={{ textAlign: "center" }}>
                                <SchoolOutlinedIcon />

                                <Typography
                                    variant="caption"
                                    display="block"
                                    sx={{ mt: 0.5 }}
                                >
                                    Learning
                                </Typography>
                            </Box>

                            <Box sx={{ textAlign: "center" }}>
                                <TrendingUpOutlinedIcon />

                                <Typography
                                    variant="caption"
                                    display="block"
                                    sx={{ mt: 0.5 }}
                                >
                                    Progress
                                </Typography>
                            </Box>
                        </Box>
                    </Box>

                    {/* FOOTER */}

                    <Typography
                        variant="body2"
                        sx={{
                            position: "relative",
                            zIndex: 2,

                            textAlign: "center",

                            color:
                                "rgba(255,255,255,0.65)",

                            fontSize: "0.8rem",
                        }}
                    >
                        Empowering learners, one course
                        at a time.
                    </Typography>
                </Box>

                {/* =====================================================
            RIGHT SIDE
        ===================================================== */}

                <Box
                    sx={{
                        width: {
                            xs: "100%",
                            md: "53%",
                        },

                        minWidth: 0,

                        display: "flex",

                        flexDirection: "column",

                        justifyContent: {
                            xs: "flex-start",
                            sm: "center",
                        },

                        p: {
                            xs: 2.5,
                            sm: 4,
                            md: 5,
                            lg: 6,
                        },

                        backgroundColor:
                            isDark
                                ? "#1b1b1b"
                                : "#ffffff",
                    }}
                >
                    {/* MOBILE LOGO */}

                    <Box
                        sx={{
                            display: {
                                xs: "flex",
                                md: "none",
                            },

                            justifyContent: "center",

                            mb: {
                                xs: 3,
                                sm: 3,
                            },
                        }}
                    >
                        <Box
                            component="img"
                            src={logo}
                            alt="LearnHub Logo"
                            sx={{
                                width: {
                                    xs: 130,
                                    sm: 150,
                                },

                                maxWidth: "60vw",
                                height: "auto",
                                display: "block",
                            }}
                        />
                    </Box>

                    {/* FORM CONTAINER */}

                    <Box
                        sx={{
                            width: "100%",

                            maxWidth: {
                                xs: 440,
                                sm: 430,
                                md: 430,
                            },

                            mx: "auto",
                        }}
                    >
                        {/* HEADING */}

                        <Typography
                            fontWeight={800}
                            sx={{
                                color:
                                    isDark
                                        ? "#ffffff"
                                        : "#172033",

                                fontSize: {
                                    xs: "1.65rem",
                                    sm: "1.9rem",
                                    md: "2rem",
                                    lg: "2.1rem",
                                },

                                lineHeight: 1.25,

                                mb: 1,
                            }}
                        >
                            Welcome Back 👋
                        </Typography>

                        <Typography
                            sx={{
                                color:
                                    isDark
                                        ? "#bdbdbd"
                                        : "#6b7280",

                                fontSize: {
                                    xs: "0.88rem",
                                    sm: "0.95rem",
                                },

                                lineHeight: 1.6,

                                mb: {
                                    xs: 3,
                                    sm: 3.5,
                                    md: 4,
                                },
                            }}
                        >
                            Sign in to continue your
                            learning journey.
                        </Typography>

                        {/* FORM */}

                        <Box
                            component="form"
                            onSubmit={handleLogin}
                            noValidate
                        >
                            {/* EMAIL */}

                            <Typography
                                variant="body2"
                                fontWeight={600}
                                sx={{
                                    mb: 0.8,

                                    color:
                                        isDark
                                            ? "#ffffff"
                                            : "#374151",
                                }}
                            >
                                Email Address
                            </Typography>

                            <TextField
                                fullWidth
                                required
                                name="email"
                                type="email"
                                placeholder="Enter your email"
                                autoComplete="email"
                                value={formData.email}
                                onChange={handleChange}
                                error={!!errors.email}
                                helperText={errors.email || " "}
                                sx={{
                                    mb: 0.5,

                                    "& .MuiOutlinedInput-root": {
                                        minHeight: {
                                            xs: 52,
                                            sm: 54,
                                            md: 56,
                                        },

                                        borderRadius: 2.2,

                                        backgroundColor:
                                            isDark
                                                ? "#252525"
                                                : "#fafbfc",

                                        "& input": {
                                            color:
                                                isDark
                                                    ? "#ffffff"
                                                    : "#1f2937",

                                            WebkitTextFillColor:
                                                isDark
                                                    ? "#ffffff"
                                                    : "#1f2937",

                                            caretColor: "#1976d2",
                                        },

                                        "& input::placeholder": {
                                            color:
                                                isDark
                                                    ? "#a9a9a9"
                                                    : "#6b7280",

                                            opacity: 1,
                                        },

                                        "& fieldset": {
                                            borderColor:
                                                isDark
                                                    ? "#555555"
                                                    : "#d1d5db",
                                        },

                                        "&:hover fieldset": {
                                            borderColor: "#1976d2",
                                        },

                                        "&.Mui-focused": {
                                            backgroundColor:
                                                isDark
                                                    ? "#292929"
                                                    : "#ffffff",

                                            boxShadow:
                                                "0 0 0 3px rgba(25,118,210,0.08)",
                                        },

                                        "&.Mui-focused fieldset": {
                                            borderColor: "#1976d2",
                                            borderWidth: 2,
                                        },
                                    },
                                }}
                            />

                            {/* PASSWORD HEADER */}

                            <Box
                                sx={{
                                    display: "flex",

                                    justifyContent:
                                        "space-between",

                                    alignItems: "center",

                                    gap: 1,

                                    mb: 0.8,
                                }}
                            >
                                <Typography
                                    variant="body2"
                                    fontWeight={600}
                                    sx={{
                                        color:
                                            isDark
                                                ? "#ffffff"
                                                : "#374151",
                                    }}
                                >
                                    Password
                                </Typography>

                                {/* =========================
                    FORGOT PASSWORD
                ========================= */}

                                <Link
                                    component={RouterLink}
                                    to="/forgot-password"
                                    underline="hover"
                                    sx={{
                                        color: "#1976d2",

                                        fontSize: {
                                            xs: "0.76rem",
                                            sm: "0.82rem",
                                        },

                                        fontWeight: 600,

                                        whiteSpace: "nowrap",

                                        cursor: "pointer",
                                    }}
                                >
                                    Forgot Password?
                                </Link>
                            </Box>

                            {/* PASSWORD */}

                            <TextField
                                fullWidth
                                required
                                name="password"
                                type={
                                    showPassword
                                        ? "text"
                                        : "password"
                                }
                                placeholder="Enter your password"
                                autoComplete="current-password"
                                value={formData.password}
                                onChange={handleChange}
                                error={!!errors.password}
                                helperText={
                                    errors.password || " "
                                }
                                slotProps={{
                                    input: {
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    type="button"
                                                    onClick={() =>
                                                        setShowPassword(
                                                            !showPassword
                                                        )
                                                    }
                                                    edge="end"
                                                    aria-label={
                                                        showPassword
                                                            ? "Hide password"
                                                            : "Show password"
                                                    }
                                                    sx={{
                                                        color:
                                                            isDark
                                                                ? "#ffffff"
                                                                : "#4b5563",
                                                    }}
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
                                sx={{
                                    mb: 1,

                                    "& .MuiOutlinedInput-root": {
                                        minHeight: {
                                            xs: 52,
                                            sm: 54,
                                            md: 56,
                                        },

                                        borderRadius: 2.2,

                                        backgroundColor:
                                            isDark
                                                ? "#252525"
                                                : "#fafbfc",

                                        "& input": {
                                            color:
                                                isDark
                                                    ? "#ffffff"
                                                    : "#1f2937",

                                            WebkitTextFillColor:
                                                isDark
                                                    ? "#ffffff"
                                                    : "#1f2937",

                                            caretColor: "#1976d2",
                                        },

                                        "& input::placeholder": {
                                            color:
                                                isDark
                                                    ? "#a9a9a9"
                                                    : "#6b7280",

                                            opacity: 1,
                                        },

                                        "& fieldset": {
                                            borderColor:
                                                isDark
                                                    ? "#555555"
                                                    : "#d1d5db",
                                        },

                                        "&:hover fieldset": {
                                            borderColor: "#1976d2",
                                        },

                                        "&.Mui-focused": {
                                            backgroundColor:
                                                isDark
                                                    ? "#292929"
                                                    : "#ffffff",

                                            boxShadow:
                                                "0 0 0 3px rgba(25,118,210,0.08)",
                                        },

                                        "&.Mui-focused fieldset": {
                                            borderColor: "#1976d2",
                                            borderWidth: 2,
                                        },
                                    },
                                }}
                            />

                            {/* GENERAL ERROR */}

                            {errors.general && (
                                <Typography
                                    sx={{
                                        color: "#d32f2f",
                                        fontSize: "0.82rem",
                                        mb: 1.5,
                                        mt: 0.5,
                                    }}
                                >
                                    {errors.general}
                                </Typography>
                            )}

                            {/* LOGIN BUTTON */}

                            <Button
                                variant="contained"
                                type="button"
                                onClick={handleLogin}
                                fullWidth
                                size="large"
                                disabled={loading}
                                sx={{
                                    minHeight: {
                                        xs: 52,
                                        sm: 54,
                                        md: 56,
                                    },

                                    mt: 1,

                                    borderRadius: 2.2,

                                    textTransform: "none",

                                    fontSize: {
                                        xs: "0.98rem",
                                        sm: "1rem",
                                    },

                                    fontWeight: 700,

                                    background:
                                        "linear-gradient(135deg, #1976d2 0%, #1565c0 100%)",

                                    boxShadow:
                                        "0 8px 22px rgba(25,118,210,0.25)",

                                    "&:hover": {
                                        background:
                                            "linear-gradient(135deg, #1565c0 0%, #0d47a1 100%)",

                                        transform:
                                            "translateY(-1px)",

                                        boxShadow:
                                            "0 11px 28px rgba(25,118,210,0.30)",
                                    },
                                }}
                            >
                                {loading ? (
                                    <CircularProgress
                                        size={24}
                                        sx={{ color: "#ffffff" }}
                                    />
                                ) : (
                                    "Login"
                                )}
                            </Button>

                            {/* DIVIDER */}

                            <Box
                                sx={{
                                    display: "flex",

                                    alignItems: "center",

                                    gap: 1.5,

                                    my: {
                                        xs: 2.5,
                                        sm: 3,
                                    },
                                }}
                            >
                                <Divider
                                    sx={{
                                        flex: 1,

                                        borderColor:
                                            isDark
                                                ? "#383838"
                                                : "#e5e7eb",
                                    }}
                                />

                                <Typography
                                    sx={{
                                        fontSize: "0.75rem",

                                        color:
                                            isDark
                                                ? "#888888"
                                                : "#9ca3af",
                                    }}
                                >
                                    OR
                                </Typography>

                                <Divider
                                    sx={{
                                        flex: 1,

                                        borderColor:
                                            isDark
                                                ? "#383838"
                                                : "#e5e7eb",
                                    }}
                                />
                            </Box>

                            {/* REGISTER */}

                            <Box
                                sx={{
                                    textAlign: "center",
                                }}
                            >
                                <Typography
                                    variant="body2"
                                    sx={{
                                        color:
                                            isDark
                                                ? "#bdbdbd"
                                                : "#6b7280",

                                        fontSize: {
                                            xs: "0.82rem",
                                            sm: "0.875rem",
                                        },

                                        lineHeight: 1.6,
                                    }}
                                >
                                    Don't have an account?{" "}

                                    <Link
                                        component={RouterLink}
                                        to="/register"
                                        underline="hover"
                                        sx={{
                                            color: "#1976d2",

                                            fontWeight: 700,

                                            ml: 0.3,
                                        }}
                                    >
                                        Create an account
                                    </Link>
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Paper>
        </Box>
    );
};

export default Login;