import {
    Box,
    Typography,
    TextField,
    Button,
    Link,
    Paper,
    MenuItem,
    InputAdornment,
    IconButton,
    LinearProgress,
    Fade,
} from "@mui/material";

import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useState, useMemo } from "react";

import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import MenuBookOutlinedIcon from "@mui/icons-material/MenuBookOutlined";
import PersonAddOutlinedIcon from "@mui/icons-material/PersonAddOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import MailOutlineOutlinedIcon from "@mui/icons-material/MailOutlineOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import WorkspacePremiumOutlinedIcon from "@mui/icons-material/WorkspacePremiumOutlined";

import logo from "../../assets/LearnHub-removebg-preview.png";

import { validateRegister } from "../../utils/validation";
import { registerUser } from "../../services/authService";

// =========================
// PASSWORD STRENGTH HELPER
// =========================
function getPasswordStrength(password) {
    if (!password) {
        return {
            score: 0,
            label: "",
            color: "grey.400",
        };
    }

    let score = 0;

    if (password.length >= 8) score += 25;
    if (/[A-Z]/.test(password)) score += 25;
    if (/[0-9]/.test(password)) score += 25;
    if (/[^A-Za-z0-9]/.test(password)) score += 25;

    if (score <= 25) {
        return {
            score,
            label: "Weak",
            color: "error.main",
        };
    }

    if (score <= 50) {
        return {
            score,
            label: "Fair",
            color: "warning.main",
        };
    }

    if (score <= 75) {
        return {
            score,
            label: "Good",
            color: "info.main",
        };
    }

    return {
        score,
        label: "Strong",
        color: "success.main",
    };
}

// =========================
// REUSABLE FIELD STYLING
// =========================
const fieldSx = {
    "& .MuiOutlinedInput-root": {
        borderRadius: 2.5,
        backgroundColor: "background.default",
        transition: "all 0.2s ease",

        "& fieldset": {
            borderColor: "divider",
            transition: "border-color 0.2s ease",
        },

        "&:hover fieldset": {
            borderColor: "primary.main",
        },

        "&.Mui-focused": {
            boxShadow: (theme) =>
                `0 0 0 4px ${theme.palette.mode === "dark"
                    ? "rgba(25,118,210,0.25)"
                    : "rgba(25,118,210,0.12)"
                }`,
        },

        "&.Mui-focused fieldset": {
            borderColor: "primary.main",
            borderWidth: 1.5,
        },
    },

    "& .MuiInputBase-input": {
        color: "text.primary",
        py: 1.3,

        "&::placeholder": {
            color: "text.secondary",
            opacity: 0.8,
        },
    },

    "& .MuiFormHelperText-root": {
        color: "text.secondary",
        ml: 0.5,
        mt: 0.3,
        fontSize: "0.72rem",
        lineHeight: 1.2,
        minHeight: "1em",
    },
};

function Register() {
    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "",
    });

    const [errors, setErrors] = useState({});

    const strength = useMemo(
        () => getPasswordStrength(formData.password),
        [formData.password]
    );

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
    // HANDLE REGISTER
    // =========================
    const handleSubmit = async (e) => {
        e.preventDefault();

        const validationErrors = validateRegister(formData);

        setErrors(validationErrors);

        if (Object.keys(validationErrors).length > 0) {
            return;
        }

        if (isSubmitting) {
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await registerUser({
                name: formData.name,
                email: formData.email,
                password: formData.password,
                role: formData.role,
            });

            console.log(response.data);

            navigate("/verify-email", {
                state: {
                    email: formData.email,
                },
            });
        } catch (error) {
            console.log(error.response?.data);

            alert(
                error.response?.data?.message ||
                "Registration failed"
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Box
            sx={{
    height: "100dvh",
    width: "100%",
    position: "relative",
    overflow: "hidden",

    display: "flex",
    alignItems: "center",
    justifyContent: "center",

    p: 0,
    m:0,

    boxSizing: "border-box",

    background: (theme) =>
        theme.palette.mode === "dark"
            ? "radial-gradient(circle at 20% 20%, #14213d 0%, #0a0e1a 60%)"
            : "radial-gradient(circle at 20% 20%, #eaf2fd 0%, #f5f7fb 60%)",
}}
        >
            {/* =========================
                AMBIENT FLOATING BLOBS
            ========================= */}

            <Box
                sx={{
                    position: "absolute",
                    width: 420,
                    height: 420,
                    borderRadius: "50%",

                    background:
                        "radial-gradient(circle, rgba(25,118,210,0.25) 0%, rgba(25,118,210,0) 70%)",

                    top: -120,
                    left: -100,

                    filter: "blur(10px)",

                    animation:
                        "float1 9s ease-in-out infinite",

                    pointerEvents: "none",

                    "@keyframes float1": {
                        "0%, 100%": {
                            transform: "translate(0,0)",
                        },
                        "50%": {
                            transform: "translate(30px, 40px)",
                        },
                    },
                }}
            />

            <Box
                sx={{
                    position: "absolute",
                    width: 360,
                    height: 360,
                    borderRadius: "50%",

                    background:
                        "radial-gradient(circle, rgba(156,39,176,0.18) 0%, rgba(156,39,176,0) 70%)",

                    bottom: -100,
                    right: -80,

                    filter: "blur(10px)",

                    animation:
                        "float2 11s ease-in-out infinite",

                    pointerEvents: "none",

                    "@keyframes float2": {
                        "0%, 100%": {
                            transform: "translate(0,0)",
                        },
                        "50%": {
                            transform: "translate(-30px, -30px)",
                        },
                    },
                }}
            />

            {/* =========================
                MAIN CARD
            ========================= */}

            <Fade in timeout={500}>
    <Paper
    elevation={0}
    sx={{
        width: "100%",
        maxWidth: "none", 
        height: "100dvh",
        minHeight: "100dvh",
        maxHeight: "100dvh",

        borderRadius: {
            xs: 0,
            sm: 2,
            md: 0,
        },

        overflow: "hidden",

        display: "flex",

        position: "relative",
        zIndex: 1,

        border: "1px solid",
        borderColor: "divider",

        backdropFilter: "blur(20px)",

        bgcolor: (theme) =>
            theme.palette.mode === "dark"
                ? "rgba(30,34,44,0.75)"
                : "rgba(255,255,255,0.75)",

        boxShadow: (theme) =>
            theme.palette.mode === "dark"
                ? "0 25px 70px rgba(0,0,0,0.55)"
                : "0 25px 70px rgba(15,23,42,0.14)",
    }}
>
                    {/* =========================
                        LEFT SIDE
                    ========================= */}

                    <Box
                        sx={{
                            width: "50%",

                            display: {
                                xs: "none",
                                md: "flex",
                            },

                            position: "relative",
                            overflow: "hidden",

                            background:
                                "linear-gradient(155deg, #1e88e5 0%, #1565c0 45%, #0d47a1 100%)",

                            color: "#fff",

                            flexDirection: "column",
                            justifyContent: "space-between",

                            p: 4.5,
                        }}
                    >
                        {/* Decorative circle 1 */}

                        <Box
                            sx={{
                                position: "absolute",
                                width: 300,
                                height: 300,
                                borderRadius: "50%",

                                backgroundColor:
                                    "rgba(255,255,255,0.08)",

                                top: -110,
                                right: -90,
                            }}
                        />

                        {/* Decorative circle 2 */}

                        <Box
                            sx={{
                                position: "absolute",
                                width: 230,
                                height: 230,
                                borderRadius: "50%",

                                border:
                                    "1px solid rgba(255,255,255,0.15)",

                                bottom: -60,
                                left: -60,
                            }}
                        />

                        {/* Decorative circle 3 */}

                        <Box
                            sx={{
                                position: "absolute",
                                width: 130,
                                height: 130,
                                borderRadius: "50%",

                                backgroundColor:
                                    "rgba(255,255,255,0.06)",

                                bottom: 40,
                                left: 60,
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
                                    backgroundColor: "#fff",
                                    borderRadius: 2,

                                    display: "inline-flex",
                                    alignItems: "center",

                                    px: 2,
                                    py: 1,

                                    boxShadow:
                                        "0 8px 20px rgba(0,0,0,0.15)",
                                }}
                            >
                                <Box
                                    component="img"
                                    src={logo}
                                    alt="LearnHub Logo"
                                    sx={{
                                        width: 130,
                                        height: "auto",
                                        objectFit: "contain",
                                    }}
                                />
                            </Box>
                        </Box>

                        {/* =========================
                            MAIN CONTENT
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
                                    width: 120,
                                    height: 120,

                                    borderRadius: "50%",

                                    background:
                                        "linear-gradient(135deg, rgba(255,255,255,0.18), rgba(255,255,255,0.06))",

                                    border:
                                        "1px solid rgba(255,255,255,0.25)",

                                    mx: "auto",
                                    mb: 2.5,

                                    display: "flex",

                                    justifyContent: "center",
                                    alignItems: "center",

                                    position: "relative",
                                }}
                            >
                                <PersonAddOutlinedIcon
                                    sx={{
                                        fontSize: 60,
                                        color: "#fff",
                                    }}
                                />

                                <Box
                                    sx={{
                                        position: "absolute",

                                        right: 0,
                                        bottom: 6,

                                        width: 38,
                                        height: 38,

                                        borderRadius: "50%",

                                        backgroundColor: "#fff",

                                        color: "#1565c0",

                                        display: "flex",

                                        alignItems: "center",
                                        justifyContent: "center",

                                        boxShadow:
                                            "0 6px 16px rgba(0,0,0,0.2)",
                                    }}
                                >
                                    <SchoolOutlinedIcon fontSize="small" />
                                </Box>
                            </Box>

                            <Typography
                                variant="h5"
                                sx={{
                                    fontWeight: 700,
                                    mb: 1.2,
                                }}
                            >
                                Start Your Learning Journey
                            </Typography>

                            <Typography
                                sx={{
                                    color:
                                        "rgba(255,255,255,0.85)",

                                    fontSize: "0.9rem",
                                    lineHeight: 1.6,

                                    maxWidth: 360,

                                    mx: "auto",
                                }}
                            >
                                Create your LearnHub account and
                                unlock a world of learning
                                opportunities.
                            </Typography>

                            {/* FEATURES */}

                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "center",

                                    gap: 3.5,

                                    mt: 3,
                                }}
                            >
                                {[
                                    {
                                        icon: (
                                            <MenuBookOutlinedIcon fontSize="small" />
                                        ),
                                        label: "Courses",
                                    },
                                    {
                                        icon: (
                                            <SchoolOutlinedIcon fontSize="small" />
                                        ),
                                        label: "Learning",
                                    },
                                    {
                                        icon: (
                                            <PersonAddOutlinedIcon fontSize="small" />
                                        ),
                                        label: "Community",
                                    },
                                ].map((item) => (
                                    <Box
                                        key={item.label}
                                        sx={{
                                            display: "flex",

                                            flexDirection:
                                                "column",

                                            alignItems:
                                                "center",

                                            gap: 0.6,
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                width: 38,
                                                height: 38,

                                                borderRadius: 2,

                                                backgroundColor:
                                                    "rgba(255,255,255,0.12)",

                                                display: "flex",

                                                alignItems:
                                                    "center",

                                                justifyContent:
                                                    "center",
                                            }}
                                        >
                                            {item.icon}
                                        </Box>

                                        <Typography
                                            variant="caption"
                                            sx={{
                                                fontSize:
                                                    "0.7rem",
                                            }}
                                        >
                                            {item.label}
                                        </Typography>
                                    </Box>
                                ))}
                            </Box>
                        </Box>

                        {/* FOOTER */}

                        <Typography
                            variant="body2"
                            sx={{
                                position: "relative",
                                zIndex: 2,

                                color:
                                    "rgba(255,255,255,0.65)",

                                textAlign: "center",

                                fontSize: "0.8rem",
                            }}
                        >
                            Join LearnHub and grow your skills.
                        </Typography>
                    </Box>

                    {/* =========================
                        RIGHT SIDE
                    ========================= */}

                    <Box
                        sx={{
                            width: {
                                xs: "100%",
                                md: "50%",
                            },

                            display: "flex",

                            flexDirection: "column",

                            /*
                             * Mobile:
                             * Start from top and allow natural height.
                             *
                             * Desktop:
                             * Keep centered.
                             */
                            justifyContent: {
                                xs: "flex-start",
                                md: "center",
                            },

                            p: {
                                xs: 2,
                                sm: 3.5,
                                md: 4.5,
                            },

                            /*
                             * IMPORTANT:
                             * Do not hide overflow on mobile.
                             */
                            overflow: "visible",

                            height: {
                                xs: "auto",
                                md: "100%",
                            },

                            boxSizing: "border-box",
                        }}
                    >
                        {/* =========================
                            MOBILE LOGO
                        ========================= */}

                        <Box
                            sx={{
                                display: {
                                    xs: "flex",
                                    md: "none",
                                },

                                justifyContent: "center",

                                mb: {
                                    xs: 1,
                                    sm: 1.5,
                                },
                            }}
                        >
                            <Box
                                component="img"
                                src={logo}
                                alt="LearnHub Logo"
                                sx={{
                                    width: {
                                        xs: 100,
                                        sm: 120,
                                    },

                                    height: "auto",
                                }}
                            />
                        </Box>

                        <Box
                            sx={{
                                maxWidth: 430,
                                width: "100%",
                                mx: "auto",
                            }}
                        >
                            {/* HEADER */}

                            <Typography
                                variant="h5"
                                sx={{
                                    fontWeight: 700,
                                    color: "text.primary",
                                    mb: 0.4,

                                    fontSize: {
                                        xs: "1.35rem",
                                        sm: "1.5rem",
                                    },
                                }}
                            >
                                Create Account
                            </Typography>

                            <Typography
                                sx={{
                                    color: "text.secondary",
                                    mb: 2,

                                    fontSize: "0.85rem",
                                }}
                            >
                                Join LearnHub and start your
                                learning journey.
                            </Typography>

                            {/* =========================
                                FORM
                            ========================= */}

                            <Box
                                component="form"
                                onSubmit={handleSubmit}
                                noValidate
                            >
                                {/* =========================
                                    NAME + EMAIL
                                ========================= */}

                                <Box
                                    sx={{
                                        display: "grid",

                                        gridTemplateColumns: {
                                            xs: "1fr",
                                            sm: "1fr 1fr",
                                        },

                                        gap: 1.2,
                                    }}
                                >
                                    {/* NAME */}

                                    <Box>
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                fontWeight: 600,
                                                mb: 0.4,

                                                color:
                                                    "text.primary",

                                                fontSize:
                                                    "0.82rem",
                                            }}
                                        >
                                            Full Name
                                        </Typography>

                                        <TextField
                                            fullWidth
                                            required
                                            size="small"
                                            name="name"
                                            placeholder="Enter your name"
                                            autoComplete="name"
                                            value={
                                                formData.name
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            disabled={
                                                isSubmitting
                                            }
                                            error={
                                                !!errors.name
                                            }
                                            helperText={
                                                errors.name || " "
                                            }
                                            slotProps={{
                                                input: {
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <PersonOutlineOutlinedIcon
                                                                sx={{
                                                                    color:
                                                                        "text.secondary",
                                                                    fontSize: 18,
                                                                }}
                                                            />
                                                        </InputAdornment>
                                                    ),
                                                },
                                            }}
                                            sx={fieldSx}
                                        />
                                    </Box>

                                    {/* EMAIL */}

                                    <Box>
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                fontWeight: 600,
                                                mb: 0.4,

                                                color:
                                                    "text.primary",

                                                fontSize:
                                                    "0.82rem",
                                            }}
                                        >
                                            Email Address
                                        </Typography>

                                        <TextField
                                            fullWidth
                                            required
                                            size="small"
                                            name="email"
                                            type="email"
                                            placeholder="Enter your email"
                                            autoComplete="email"
                                            value={
                                                formData.email
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            disabled={
                                                isSubmitting
                                            }
                                            error={
                                                !!errors.email
                                            }
                                            helperText={
                                                errors.email || " "
                                            }
                                            slotProps={{
                                                input: {
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <MailOutlineOutlinedIcon
                                                                sx={{
                                                                    color:
                                                                        "text.secondary",
                                                                    fontSize: 18,
                                                                }}
                                                            />
                                                        </InputAdornment>
                                                    ),
                                                },
                                            }}
                                            sx={fieldSx}
                                        />
                                    </Box>
                                </Box>

                                {/* =========================
                                    PASSWORD
                                ========================= */}

                                <Typography
                                    variant="body2"
                                    sx={{
                                        fontWeight: 600,
                                        mb: 0.4,
                                        mt: 0.5,

                                        color: "text.primary",

                                        fontSize: "0.82rem",
                                    }}
                                >
                                    Password
                                </Typography>

                                <TextField
                                    fullWidth
                                    required
                                    size="small"
                                    name="password"
                                    type={
                                        showPassword
                                            ? "text"
                                            : "password"
                                    }
                                    placeholder="Create password"
                                    autoComplete="new-password"
                                    value={
                                        formData.password
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    disabled={
                                        isSubmitting
                                    }
                                    error={
                                        !!errors.password
                                    }
                                    helperText={
                                        errors.password || " "
                                    }
                                    slotProps={{
                                        input: {
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <LockOutlinedIcon
                                                        sx={{
                                                            color:
                                                                "text.secondary",
                                                            fontSize: 18,
                                                        }}
                                                    />
                                                </InputAdornment>
                                            ),

                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        onClick={() =>
                                                            setShowPassword(
                                                                !showPassword
                                                            )
                                                        }
                                                        edge="end"
                                                        size="small"
                                                        aria-label={
                                                            showPassword
                                                                ? "Hide password"
                                                                : "Show password"
                                                        }
                                                        sx={{
                                                            color:
                                                                "text.secondary",
                                                        }}
                                                    >
                                                        {showPassword ? (
                                                            <VisibilityOff fontSize="small" />
                                                        ) : (
                                                            <Visibility fontSize="small" />
                                                        )}
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        },
                                    }}
                                    sx={fieldSx}
                                />

                                {/* =========================
                                    PASSWORD STRENGTH
                                ========================= */}

                                <Box
                                    sx={{
                                        height: 16,
                                        mt: 0.3,

                                        display: "flex",
                                        alignItems: "center",

                                        gap: 1,
                                    }}
                                >
                                    {formData.password && (
                                        <>
                                            <LinearProgress
                                                variant="determinate"
                                                value={
                                                    strength.score
                                                }
                                                sx={{
                                                    flex: 1,

                                                    height: 4,

                                                    borderRadius: 5,

                                                    backgroundColor:
                                                        "action.hover",

                                                    "& .MuiLinearProgress-bar":
                                                    {
                                                        borderRadius: 5,

                                                        backgroundColor:
                                                            strength.color,

                                                        transition:
                                                            "all 0.3s ease",
                                                    },
                                                }}
                                            />

                                            <Typography
                                                variant="caption"
                                                sx={{
                                                    color:
                                                        strength.color,

                                                    fontWeight: 600,

                                                    minWidth: 40,

                                                    fontSize:
                                                        "0.68rem",
                                                }}
                                            >
                                                {
                                                    strength.label
                                                }
                                            </Typography>
                                        </>
                                    )}
                                </Box>

                                {/* =========================
                                    CONFIRM PASSWORD
                                ========================= */}

                                <Typography
                                    variant="body2"
                                    sx={{
                                        fontWeight: 600,
                                        mb: 0.4,
                                        mt: 0.3,

                                        color: "text.primary",

                                        fontSize: "0.82rem",
                                    }}
                                >
                                    Confirm Password
                                </Typography>

                                <TextField
                                    fullWidth
                                    required
                                    size="small"
                                    name="confirmPassword"
                                    type={
                                        showConfirmPassword
                                            ? "text"
                                            : "password"
                                    }
                                    placeholder="Confirm password"
                                    autoComplete="new-password"
                                    value={
                                        formData.confirmPassword
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    disabled={
                                        isSubmitting
                                    }
                                    error={
                                        !!errors.confirmPassword
                                    }
                                    helperText={
                                        errors.confirmPassword ||
                                        " "
                                    }
                                    slotProps={{
                                        input: {
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <LockOutlinedIcon
                                                        sx={{
                                                            color:
                                                                "text.secondary",
                                                            fontSize: 18,
                                                        }}
                                                    />
                                                </InputAdornment>
                                            ),

                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        onClick={() =>
                                                            setShowConfirmPassword(
                                                                !showConfirmPassword
                                                            )
                                                        }
                                                        edge="end"
                                                        size="small"
                                                        aria-label={
                                                            showConfirmPassword
                                                                ? "Hide password"
                                                                : "Show password"
                                                        }
                                                        sx={{
                                                            color:
                                                                "text.secondary",
                                                        }}
                                                    >
                                                        {showConfirmPassword ? (
                                                            <VisibilityOff fontSize="small" />
                                                        ) : (
                                                            <Visibility fontSize="small" />
                                                        )}
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        },
                                    }}
                                    sx={fieldSx}
                                />

                                {/* =========================
                                    ROLE
                                ========================= */}

                                <Typography
                                    variant="body2"
                                    sx={{
                                        fontWeight: 600,
                                        mb: 0.4,
                                        mt: 0.3,

                                        color: "text.primary",

                                        fontSize: "0.82rem",
                                    }}
                                >
                                    Account Type
                                </Typography>

                                <TextField
                                    select
                                    fullWidth
                                    required
                                    size="small"
                                    name="role"
                                    value={
                                        formData.role
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    disabled={
                                        isSubmitting
                                    }
                                    error={
                                        !!errors.role
                                    }
                                    helperText={
                                        errors.role ||
                                        "Choose your account type"
                                    }
                                    slotProps={{
                                        input: {
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <WorkspacePremiumOutlinedIcon
                                                        sx={{
                                                            color:
                                                                "text.secondary",
                                                            fontSize: 18,
                                                        }}
                                                    />
                                                </InputAdornment>
                                            ),
                                        },
                                    }}
                                    sx={{
                                        mb: 0.8,
                                        ...fieldSx,
                                    }}
                                >
                                    <MenuItem value="student">
                                        Student
                                    </MenuItem>

                                    <MenuItem value="teacher">
                                        Teacher
                                    </MenuItem>
                                </TextField>

                                {/* =========================
                                    SUBMIT
                                ========================= */}

                                <Button
                                    fullWidth
                                    variant="contained"
                                    type="submit"
                                    disabled={
                                        isSubmitting
                                    }
                                    sx={{
                                        py: 1.1,

                                        mt: 0.5,

                                        borderRadius: 2.5,

                                        textTransform:
                                            "none",

                                        fontSize:
                                            "0.95rem",

                                        fontWeight: 600,

                                        background:
                                            "linear-gradient(135deg, #1e88e5, #1259a7)",

                                        boxShadow:
                                            "0 10px 24px rgba(25,118,210,0.30)",

                                        transition:
                                            "all 0.2s ease",

                                        "&:hover": {
                                            background:
                                                "linear-gradient(135deg, #1976d2, #0d47a1)",

                                            boxShadow:
                                                "0 12px 28px rgba(25,118,210,0.38)",

                                            transform:
                                                "translateY(-1px)",
                                        },

                                        "&:active": {
                                            transform:
                                                "translateY(0)",
                                        },

                                        "&.Mui-disabled": {
                                            background:
                                                "linear-gradient(135deg, #1e88e5, #1259a7)",

                                            opacity: 0.7,

                                            color: "#fff",
                                        },
                                    }}
                                >
                                    {isSubmitting
                                        ? "Creating Account..."
                                        : "Create Account"}
                                </Button>

                                {/* =========================
                                    LOGIN
                                ========================= */}

                                <Box
                                    sx={{
                                        textAlign: "center",
                                        mt: 1.5,

                                        pb: {
                                            xs: 0.5,
                                            md: 0,
                                        },
                                    }}
                                >
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            color:
                                                "text.secondary",

                                            fontSize:
                                                "0.82rem",
                                        }}
                                    >
                                        Already have an
                                        account?{" "}

                                        <Link
                                            component={
                                                RouterLink
                                            }
                                            to="/login"
                                            underline="hover"
                                            sx={{
                                                color:
                                                    "primary.main",

                                                fontWeight: 600,
                                            }}
                                        >
                                            Login
                                        </Link>
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                </Paper>
            </Fade>
        </Box>
    );
}

export default Register;