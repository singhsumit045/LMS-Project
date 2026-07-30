
import {
    Box,
    Typography,
    TextField,
    Button,
    Link,
    Paper,
    InputAdornment,
    IconButton,
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

import { validateLogin } from "../../utils/validation";
import { loginUser } from "../../services/authService";


const Login = () => {

    const navigate = useNavigate();

    const theme = useTheme();

    const isDark = theme.palette.mode === "dark";


    const [showPassword, setShowPassword] =
        useState(false);


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

        const validationErrors =
            validateLogin(formData);

        setErrors(validationErrors);

        if (
            Object.keys(validationErrors).length > 0
        ) {
            return;
        }

        try {

            const response =
                await loginUser(formData);

            console.log(
                "LOGIN SUCCESS:",
                response.data
            );

            alert("Login Successful");

            navigate("/dashboard");

        } catch (error) {

            console.log(
                "LOGIN ERROR:",
                error
            );

            console.log(
                "RESPONSE:",
                error.response?.data
            );

            alert(
                error.response?.data?.message ||
                "Invalid email or password"
            );
        }
    };


    return (

        <Box
            sx={{
                height: "100vh",
                width: "100%",
                overflow: "hidden",

                backgroundColor:
                    isDark
                        ? "#121212"
                        : "#f5f7fb",

                display: "flex",

                alignItems: "center",

                justifyContent: "center",

                p: {
                    xs: 1.5,
                    sm: 2,
                },

                boxSizing: "border-box",
            }}
        >

            <Paper
                elevation={0}
                sx={{
                    width: "100%",

                    maxWidth: 1050,

                    height: {
                        xs: "auto",
                        md: "calc(100vh - 32px)",
                    },

                    maxHeight: "680px",

                    borderRadius: 4,

                    overflow: "hidden",

                    display: "flex",

                    border: "1px solid",

                    borderColor:
                        isDark
                            ? "#333333"
                            : "#e5e7eb",

                    boxShadow:
                        isDark
                            ? "0 20px 60px rgba(0,0,0,0.45)"
                            : "0 20px 60px rgba(15,23,42,0.10)",
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
                            "linear-gradient(145deg, #1976d2 0%, #1259a7 100%)",

                        color: "#fff",

                        flexDirection: "column",

                        justifyContent:
                            "space-between",

                        p: 5,
                    }}
                >

                    {/* Decorative Circle */}

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
                                width: 170,

                                height: 170,

                                borderRadius: "50%",

                                backgroundColor:
                                    "rgba(255,255,255,0.12)",

                                mx: "auto",

                                mb: 3,

                                display: "flex",

                                justifyContent:
                                    "center",

                                alignItems: "center",

                                position: "relative",
                            }}
                        >

                            <SchoolOutlinedIcon
                                sx={{
                                    fontSize: 85,

                                    color: "#fff",
                                }}
                            />


                            <Box
                                sx={{
                                    position:
                                        "absolute",

                                    right: 5,

                                    bottom: 10,

                                    width: 48,

                                    height: 48,

                                    borderRadius: "50%",

                                    backgroundColor: "#fff",

                                    color: "#1976d2",

                                    display: "flex",

                                    alignItems:
                                        "center",

                                    justifyContent:
                                        "center",
                                }}
                            >

                                <SchoolOutlinedIcon
                                    fontSize="medium"
                                />

                            </Box>

                        </Box>


                        <Typography
                            variant="h4"
                            fontWeight={700}
                            sx={{
                                mb: 1.5,
                            }}
                        >
                            Learn. Grow. Succeed.
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
                            Continue your learning journey
                            with LearnHub and build the
                            skills that shape your future.
                        </Typography>


                        {/* Feature Icons */}

                        <Box
                            sx={{
                                display: "flex",

                                justifyContent:
                                    "center",

                                gap: 4,

                                mt: 4,
                            }}
                        >

                            <Box>

                                <MenuBookOutlinedIcon />

                                <Typography
                                    variant="caption"
                                    display="block"
                                    sx={{
                                        mt: 0.5,
                                    }}
                                >
                                    Courses
                                </Typography>

                            </Box>


                            <Box>

                                <SchoolOutlinedIcon />

                                <Typography
                                    variant="caption"
                                    display="block"
                                    sx={{
                                        mt: 0.5,
                                    }}
                                >
                                    Learning
                                </Typography>

                            </Box>


                            <Box>

                                <SchoolOutlinedIcon />

                                <Typography
                                    variant="caption"
                                    display="block"
                                    sx={{
                                        mt: 0.5,
                                    }}
                                >
                                    Progress
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
                        Empowering learners, one course
                        at a time.
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

                        justifyContent: "center",

                        p: {
                            xs: 3,
                            sm: 5,
                            md: 6,
                        },

                        backgroundColor:
                            isDark
                                ? "#1e1e1e"
                                : "#fff",
                    }}
                >

                    {/* Mobile Logo */}

                    <Box
                        sx={{
                            display: {
                                xs: "flex",
                                md: "none",
                            },

                            justifyContent:
                                "center",

                            mb: 4,
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
                            maxWidth: 420,

                            width: "100%",

                            mx: "auto",
                        }}
                    >

                        {/* =========================
                            TITLE
                        ========================= */}

                        <Typography
                            variant="h4"
                            fontWeight={700}
                            sx={{
                                color:
                                    isDark
                                        ? "#ffffff"
                                        : "#172033",

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

                                mb: 4,
                            }}
                        >
                            Sign in to continue your
                            learning journey.
                        </Typography>


                        {/* =========================
                            FORM
                        ========================= */}

                        <Box
                            component="form"
                            onSubmit={handleLogin}
                            noValidate
                        >

                            {/* EMAIL LABEL */}

                            <Typography
                                variant="body2"
                                fontWeight={600}
                                sx={{
                                    mb: 1,

                                    color:
                                        isDark
                                            ? "#ffffff"
                                            : "#374151",
                                }}
                            >
                                Email Address
                            </Typography>


                            {/* EMAIL */}

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
                                    mb: 1,

                                    "& .MuiOutlinedInput-root":
                                        {
                                            borderRadius: 2,

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

                                                caretColor:
                                                    isDark
                                                        ? "#ffffff"
                                                        : "#1976d2",
                                            },

                                            "& input::placeholder":
                                                {
                                                    color:
                                                        isDark
                                                            ? "#bdbdbd"
                                                            : "#6b7280",

                                                    opacity: 1,
                                                },

                                            "& fieldset": {
                                                borderColor:
                                                    isDark
                                                        ? "#666666"
                                                        : "#c4c4c4",
                                            },

                                            "&:hover fieldset":
                                                {
                                                    borderColor:
                                                        "#1976d2",
                                                },

                                            "&.Mui-focused fieldset":
                                                {
                                                    borderColor:
                                                        "#1976d2",

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

                                    mb: 1,
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


                                <Link
                                    component={RouterLink}
                                    to="/forgot-password"
                                    underline="hover"
                                    sx={{
                                        fontSize:
                                            "0.85rem",

                                        fontWeight: 500,

                                        color:
                                            "#1976d2",
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
                                            <InputAdornment
                                                position="end"
                                            >

                                                <IconButton
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
                                                                : "#424242",
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
                                    mb: 2,

                                    "& .MuiOutlinedInput-root":
                                        {
                                            borderRadius: 2,

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

                                                caretColor:
                                                    isDark
                                                        ? "#ffffff"
                                                        : "#1976d2",
                                            },

                                            "& input::placeholder":
                                                {
                                                    color:
                                                        isDark
                                                            ? "#bdbdbd"
                                                            : "#6b7280",

                                                    opacity: 1,
                                                },

                                            "& fieldset": {
                                                borderColor:
                                                    isDark
                                                        ? "#666666"
                                                        : "#c4c4c4",
                                            },

                                            "&:hover fieldset":
                                                {
                                                    borderColor:
                                                        "#1976d2",
                                                },

                                            "&.Mui-focused fieldset":
                                                {
                                                    borderColor:
                                                        "#1976d2",

                                                    borderWidth: 2,
                                                },
                                        },
                                }}
                            />


                            {/* =========================
                                LOGIN BUTTON
                            ========================= */}

                            <Button
                                variant="contained"

                                type="submit"

                                fullWidth

                                size="large"

                                sx={{
                                    py: 1.5,

                                    mt: 1,

                                    borderRadius: 2,

                                    textTransform:
                                        "none",

                                    fontSize: "1rem",

                                    fontWeight: 600,

                                    backgroundColor:
                                        "#1976d2",

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
                                Login
                            </Button>


                            {/* =========================
                                REGISTER
                            ========================= */}

                            <Box
                                sx={{
                                    textAlign: "center",

                                    mt: 3,
                                }}
                            >

                                <Typography
                                    variant="body2"
                                    sx={{
                                        color:
                                            isDark
                                                ? "#bdbdbd"
                                                : "#6b7280",
                                    }}
                                >
                                    Don't have an account?{" "}

                                    <Link
                                        component={RouterLink}
                                        to="/register"
                                        underline="hover"
                                        sx={{
                                            color:
                                                "#1976d2",

                                            fontWeight: 600,
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

