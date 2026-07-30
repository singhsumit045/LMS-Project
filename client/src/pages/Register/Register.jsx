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
} from "@mui/material";

import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useState } from "react";

import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import MenuBookOutlinedIcon from "@mui/icons-material/MenuBookOutlined";
import PersonAddOutlinedIcon from "@mui/icons-material/PersonAddOutlined";

import logo from "../../assets/LearnHub.png";

import { validateRegister } from "../../utils/validation";
import { registerUser } from "../../services/authService";

function Register() {
    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "",
    });

    const [errors, setErrors] = useState({});

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

    const handleSubmit = async (e) => {
        e.preventDefault();

        const validationErrors = validateRegister(formData);

        setErrors(validationErrors);

        if (Object.keys(validationErrors).length > 0) {
            return;
        }

        try {
            const response = await registerUser({
                name: formData.name,
                email: formData.email,
                password: formData.password,
                role: formData.role,
            });

            console.log(response.data);

            alert("Registration Successful");
            navigate("/login");
        } catch (error) {
            console.log(error.response?.data);

            alert(
                error.response?.data?.message ||
                "Registration failed"
            );
        }
    };

    return (
        <Box
            sx={{
                minHeight: "100vh",
                width: "100%",
                backgroundColor: "#f5f7fb",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                p: { xs: 1.5, sm: 2 },
                boxSizing: "border-box",
            }}
        >
            <Paper
                elevation={0}
                sx={{
                    width: "100%",
                    maxWidth: 1050,
                    height: { xs: "auto", md: "calc(100vh - 32px)" },
                    maxHeight: { md: 680 },
                    borderRadius: 4,
                    overflow: "hidden",
                    display: "flex",
                    border: "1px solid #e5e7eb",
                    boxShadow:
                        "0 20px 60px rgba(15, 23, 42, 0.10)",
                }}
            >
                {/* ================= LEFT SIDE ================= */}

                <Box
                    sx={{
                        width: "50%",
                        display: { xs: "none", md: "flex" },
                        position: "relative",
                        overflow: "hidden",
                        background:
                            "linear-gradient(145deg, #1976d2 0%, #1259a7 100%)",
                        color: "#fff",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        p: 5,
                    }}
                >
                    {/* Decorative circle */}

                    <Box
                        sx={{
                            position: "absolute",
                            width: 280,
                            height: 280,
                            borderRadius: "50%",
                            backgroundColor:
                                "rgba(255,255,255,0.07)",
                            top: -100,
                            right: -80,
                        }}
                    />

                    <Box
                        sx={{
                            position: "absolute",
                            width: 220,
                            height: 220,
                            borderRadius: "50%",
                            backgroundColor:
                                "rgba(255,255,255,0.06)",
                            bottom: -80,
                            left: -80,
                        }}
                    />

                    {/* Logo */}

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
                            }}
                        >
                            <Box
                                component="img"
                                src={logo}
                                alt="LearnHub Logo"
                                sx={{
                                    width: 145,
                                    height: "auto",
                                    objectFit: "contain",
                                }}
                            />
                        </Box>
                    </Box>

                    {/* Main content */}

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
                                width: 155,
                                height: 155,
                                borderRadius: "50%",
                                backgroundColor:
                                    "rgba(255,255,255,0.12)",
                                mx: "auto",
                                mb: 3,
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                position: "relative",
                            }}
                        >
                            <PersonAddOutlinedIcon
                                sx={{
                                    fontSize: 78,
                                    color: "#fff",
                                }}
                            />

                            <Box
                                sx={{
                                    position: "absolute",
                                    right: 2,
                                    bottom: 8,
                                    width: 46,
                                    height: 46,
                                    borderRadius: "50%",
                                    backgroundColor: "#fff",
                                    color: "#1976d2",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                <SchoolOutlinedIcon />
                            </Box>
                        </Box>

                        <Typography
                            variant="h4"
                            fontWeight={700}
                            sx={{ mb: 1.5 }}
                        >
                            Start Your Learning Journey
                        </Typography>

                        <Typography
                            sx={{
                                color:
                                    "rgba(255,255,255,0.82)",
                                fontSize: "1rem",
                                lineHeight: 1.7,
                                maxWidth: 390,
                                mx: "auto",
                            }}
                        >
                            Create your LearnHub account and
                            unlock a world of learning opportunities.
                        </Typography>

                        {/* Features */}

                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "center",
                                gap: 4,
                                mt: 4,
                            }}
                        >
                            <Box>
                                <MenuBookOutlinedIcon />

                                <Typography
                                    variant="caption"
                                    display="block"
                                    sx={{ mt: 0.5 }}
                                >
                                    Courses
                                </Typography>
                            </Box>

                            <Box>
                                <SchoolOutlinedIcon />

                                <Typography
                                    variant="caption"
                                    display="block"
                                    sx={{ mt: 0.5 }}
                                >
                                    Learning
                                </Typography>
                            </Box>

                            <Box>
                                <PersonAddOutlinedIcon />

                                <Typography
                                    variant="caption"
                                    display="block"
                                    sx={{ mt: 0.5 }}
                                >
                                    Community
                                </Typography>
                            </Box>
                        </Box>
                    </Box>

                    <Typography
                        variant="body2"
                        sx={{
                            position: "relative",
                            zIndex: 2,
                            color:
                                "rgba(255,255,255,0.65)",
                            textAlign: "center",
                        }}
                    >
                        Join LearnHub and grow your skills.
                    </Typography>
                </Box>

                {/* ================= RIGHT SIDE ================= */}

                <Box
                    sx={{
                        width: { xs: "100%", md: "50%" },
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        p: { xs: 3, sm: 4, md: 5 },
                        backgroundColor: "#fff",
                        overflowY: { xs: "auto", md: "hidden" },
                    }}
                >
                    {/* Mobile Logo */}

                    <Box
                        sx={{
                            display: {
                                xs: "flex",
                                md: "none",
                            },
                            justifyContent: "center",
                            mb: 3,
                        }}
                    >
                        <Box
                            component="img"
                            src={logo}
                            alt="LearnHub Logo"
                            sx={{
                                width: 165,
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
                        <Typography
                            variant="h4"
                            fontWeight={700}
                            sx={{
                                color: "#172033",
                                mb: 0.7,
                            }}
                        >
                            Create Account
                        </Typography>

                        <Typography
                            sx={{
                                color: "#6b7280",
                                mb: 2.5,
                                fontSize: "0.95rem",
                            }}
                        >
                            Join LearnHub and start your learning journey.
                        </Typography>

                        <Box
                            component="form"
                            onSubmit={handleSubmit}
                            noValidate
                        >
                            {/* Name + Email */}

                            <Box
                                sx={{
                                    display: "grid",
                                    gridTemplateColumns: {
                                        xs: "1fr",
                                        sm: "1fr 1fr",
                                    },
                                    gap: 1.5,
                                }}
                            >
                                {/* Name */}

                                <Box>
                                    <Typography
                                        variant="body2"
                                        fontWeight={600}
                                        sx={{
                                            mb: 0.7,
                                            color: "#374151",
                                        }}
                                    >
                                        Full Name
                                    </Typography>

                                    <TextField
                                        fullWidth
                                        required
                                        name="name"
                                        placeholder="Enter your name"
                                        autoComplete="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        error={!!errors.name}
                                        helperText={
                                            errors.name || " "
                                        }
                                        sx={{
                                            "& .MuiOutlinedInput-root":
                                                {
                                                    borderRadius: 2,
                                                    backgroundColor:
                                                        "#fafbfc",
                                                    "&:hover fieldset":
                                                        {
                                                            borderColor:
                                                                "#1976d2",
                                                        },
                                                    "&.Mui-focused fieldset":
                                                        {
                                                            borderColor:
                                                                "#1976d2",
                                                        },
                                                },
                                        }}
                                    />
                                </Box>

                                {/* Email */}

                                <Box>
                                    <Typography
                                        variant="body2"
                                        fontWeight={600}
                                        sx={{
                                            mb: 0.7,
                                            color: "#374151",
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
                                        helperText={
                                            errors.email || " "
                                        }
                                        sx={{
                                            "& .MuiOutlinedInput-root":
                                                {
                                                    borderRadius: 2,
                                                    backgroundColor:
                                                        "#fafbfc",
                                                    "&:hover fieldset":
                                                        {
                                                            borderColor:
                                                                "#1976d2",
                                                        },
                                                    "&.Mui-focused fieldset":
                                                        {
                                                            borderColor:
                                                                "#1976d2",
                                                        },
                                                },
                                        }}
                                    />
                                </Box>
                            </Box>

                            {/* Password + Confirm Password */}

                            <Box
                                sx={{
                                    display: "grid",
                                    gridTemplateColumns: {
                                        xs: "1fr",
                                        sm: "1fr 1fr",
                                    },
                                    gap: 1.5,
                                }}
                            >
                                {/* Password */}

                                <Box>
                                    <Typography
                                        variant="body2"
                                        fontWeight={600}
                                        sx={{
                                            mb: 0.7,
                                            color: "#374151",
                                        }}
                                    >
                                        Password
                                    </Typography>

                                    <TextField
                                        fullWidth
                                        required
                                        name="password"
                                        type={
                                            showPassword
                                                ? "text"
                                                : "password"
                                        }
                                        placeholder="Create password"
                                        autoComplete="new-password"
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
                                        sx={{
                                            "& .MuiOutlinedInput-root":
                                                {
                                                    borderRadius: 2,
                                                    backgroundColor:
                                                        "#fafbfc",
                                                    "&:hover fieldset":
                                                        {
                                                            borderColor:
                                                                "#1976d2",
                                                        },
                                                    "&.Mui-focused fieldset":
                                                        {
                                                            borderColor:
                                                                "#1976d2",
                                                        },
                                                },
                                        }}
                                    />
                                </Box>

                                {/* Confirm Password */}

                                <Box>
                                    <Typography
                                        variant="body2"
                                        fontWeight={600}
                                        sx={{
                                            mb: 0.7,
                                            color: "#374151",
                                        }}
                                    >
                                        Confirm Password
                                    </Typography>

                                    <TextField
                                        fullWidth
                                        required
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
                                        onChange={handleChange}
                                        error={
                                            !!errors.confirmPassword
                                        }
                                        helperText={
                                            errors.confirmPassword || " "
                                        }
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
                                        sx={{
                                            "& .MuiOutlinedInput-root":
                                                {
                                                    borderRadius: 2,
                                                    backgroundColor:
                                                        "#fafbfc",
                                                    "&:hover fieldset":
                                                        {
                                                            borderColor:
                                                                "#1976d2",
                                                        },
                                                    "&.Mui-focused fieldset":
                                                        {
                                                            borderColor:
                                                                "#1976d2",
                                                        },
                                                },
                                        }}
                                    />
                                </Box>
                            </Box>

                            {/* Role */}

                            <Typography
                                variant="body2"
                                fontWeight={600}
                                sx={{
                                    mb: 0.7,
                                    color: "#374151",
                                }}
                            >
                                Account Type
                            </Typography>

                            <TextField
                                select
                                fullWidth
                                required
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                error={!!errors.role}
                                helperText={
                                    errors.role ||
                                    "Choose your account type"
                                }
                                sx={{
                                    mb: 1,
                                    "& .MuiOutlinedInput-root": {
                                        borderRadius: 2,
                                        backgroundColor:
                                            "#fafbfc",
                                        "&:hover fieldset": {
                                            borderColor:
                                                "#1976d2",
                                        },
                                        "&.Mui-focused fieldset": {
                                            borderColor:
                                                "#1976d2",
                                        },
                                    },
                                }}
                            >
                                <MenuItem value="student">
                                    Student
                                </MenuItem>

                                <MenuItem value="teacher">
                                    Teacher
                                </MenuItem>
                            </TextField>

                            {/* Create Account */}

                            <Button
                                fullWidth
                                variant="contained"
                                type="submit"
                                size="large"
                                sx={{
                                    py: 1.4,
                                    mt: 1,
                                    borderRadius: 2,
                                    textTransform: "none",
                                    fontSize: "1rem",
                                    fontWeight: 600,
                                    backgroundColor: "#1976d2",
                                    boxShadow:
                                        "0 8px 20px rgba(25,118,210,0.25)",
                                    "&:hover": {
                                        backgroundColor:
                                            "#1565c0",
                                        boxShadow:
                                            "0 10px 25px rgba(25,118,210,0.30)",
                                    },
                                }}
                            >
                                Create Account
                            </Button>

                            {/* Login */}

                            <Box
                                sx={{
                                    textAlign: "center",
                                    mt: 2,
                                }}
                            >
                                <Typography
                                    variant="body2"
                                    sx={{
                                        color: "#6b7280",
                                    }}
                                >
                                    Already have an account?{" "}
                                    <Link
                                        component={RouterLink}
                                        to="/login"
                                        underline="hover"
                                        sx={{
                                            color: "#1976d2",
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
        </Box>
    );
}

export default Register;