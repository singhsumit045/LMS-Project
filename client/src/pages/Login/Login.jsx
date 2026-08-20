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
    Fade,
    GlobalStyles,
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
import MailOutlineOutlinedIcon from "@mui/icons-material/MailOutlineOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

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

    // Compact field styling with icons + focus glow — no-scroll friendly
    const fieldSx = {
        mb: 0.3,
        "& .MuiOutlinedInput-root": {
            minHeight: 48,
            borderRadius: 2.2,
            backgroundColor: isDark ? "#252525" : "#fafbfc",
            transition: "all 0.2s ease",

            "& input": {
                color: isDark ? "#ffffff" : "#1f2937",
                WebkitTextFillColor: isDark ? "#ffffff" : "#1f2937",
                caretColor: "#1976d2",
                py: 1.3,
            },

            "& input::placeholder": {
                color: isDark ? "#a9a9a9" : "#6b7280",
                opacity: 1,
            },

            "& fieldset": {
                borderColor: isDark ? "#555555" : "#d1d5db",
                transition: "border-color 0.2s ease",
            },

            "&:hover fieldset": {
                borderColor: "#1976d2",
            },

            "&.Mui-focused": {
                backgroundColor: isDark ? "#292929" : "#ffffff",
                boxShadow: isDark
                    ? "0 0 0 4px rgba(25,118,210,0.25)"
                    : "0 0 0 4px rgba(25,118,210,0.12)",
            },

            "&.Mui-focused fieldset": {
                borderColor: "#1976d2",
                borderWidth: 1.5,
            },
        },
        "& .MuiFormHelperText-root": {
            ml: 0.5,
            mt: 0.3,
            fontSize: "0.72rem",
            lineHeight: 1.2,
            minHeight: "1em",
        },
    };

    return (
        <>
            <GlobalStyles
                styles={{
                    html: { margin: 0, padding: 0, height: "100%" },
                    body: { margin: 0, padding: 0, height: "100%" },
                    "#root": { height: "100%" },
                }}
            />

            <Box
                sx={{
                    height: "100vh",
                    maxHeight: "100vh",
                    width: "100%",
                    overflow: "hidden",
                    position: "relative",

                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",

                    background: isDark
                        ? "linear-gradient(135deg, #0f0f0f 0%, #171717 100%)"
                        : "linear-gradient(135deg, #f4f8ff 0%, #eef3fa 100%)",

                    boxSizing: "border-box",

                    p: { xs: 1.5, sm: 2 },
                }}
            >
                {/* =========================
                      MAIN CARD
                ========================= */}

                <Fade in timeout={500}>
                    <Paper
                        elevation={0}
                        sx={{
                            width: "100%",
                            maxWidth: { xs: "100%", sm: 720, md: 1000, lg: 1050 },

                            height: "100%",
                            maxHeight: 640,
                           

                            display: "flex",
                            flexDirection: { xs: "column", md: "row" },

                            overflow: "hidden",

                            borderRadius: { xs: 3, sm: 4, md: 5 },
                            border: "1px solid",

                            border: {
                                xs: "none",
                                sm: "1px solid",
                            },

                            borderColor: isDark
                                ? "rgba(255,255,255,0.08)"
                                : "rgba(15,23,42,0.08)",

                            backgroundColor: isDark ? "#1b1b1b" : "#ffffff",

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
                                width: { xs: "100%", md: "47%" },

                                display: { xs: "none", md: "flex" },

                                position: "relative",
                                overflow: "hidden",

                                flexDirection: "column",
                                justifyContent: "space-between",

                                p: { md: 4, lg: 4.5 },

                                color: "#ffffff",

                                background:
                                    "linear-gradient(145deg, #1976d2 0%, #1565c0 45%, #0d47a1 100%)",
                            }}
                        >
                            {/* Decorative Circles */}
                            <Box
                                sx={{
                                    position: "absolute",
                                    width: { md: 220, lg: 300 },
                                    height: { md: 220, lg: 300 },
                                    borderRadius: "50%",
                                    background: "rgba(255,255,255,0.07)",
                                    top: { md: -100, lg: -120 },
                                    right: { md: -80, lg: -90 },
                                }}
                            />

                            <Box
                                sx={{
                                    position: "absolute",
                                    width: { md: 180, lg: 230 },
                                    height: { md: 180, lg: 230 },
                                    borderRadius: "50%",
                                    background: "rgba(255,255,255,0.06)",
                                    bottom: -80,
                                    left: -80,
                                }}
                            />

                            {/* LOGO */}
                            <Box sx={{ position: "relative", zIndex: 2 }}>
                                <Box
                                    sx={{
                                        display: "inline-flex",
                                        alignItems: "center",
                                        backgroundColor: "#ffffff",
                                        borderRadius: 2.5,
                                        px: { md: 1.5, lg: 1.8 },
                                        py: { md: 0.75, lg: 0.9 },
                                        boxShadow: "0 8px 20px rgba(0,0,0,0.10)",
                                    }}
                                >
                                    <Box
                                        component="img"
                                        src={logo}
                                        alt="LearnHub Logo"
                                        sx={{
                                            width: { md: 115, lg: 130 },
                                            height: "auto",
                                            display: "block",
                                        }}
                                    />
                                </Box>
                            </Box>

                            {/* CENTER CONTENT */}
                            <Box sx={{ position: "relative", zIndex: 2, textAlign: "center", px: 2 }}>
                                <Box
                                    sx={{
                                        width: { md: 110, lg: 130 },
                                        height: { md: 110, lg: 130 },
                                        borderRadius: "50%",
                                        mx: "auto",
                                        mb: { md: 2, lg: 2.5 },
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        position: "relative",
                                        background: "rgba(255,255,255,0.12)",
                                        border: "1px solid rgba(255,255,255,0.12)",
                                        boxShadow: "inset 0 0 40px rgba(255,255,255,0.04)",
                                    }}
                                >
                                    <SchoolOutlinedIcon sx={{ fontSize: { md: 54, lg: 66 } }} />

                                    <Box
                                        sx={{
                                            position: "absolute",
                                            right: { md: 0, lg: 4 },
                                            bottom: { md: 4, lg: 8 },
                                            width: { md: 38, lg: 42 },
                                            height: { md: 38, lg: 42 },
                                            borderRadius: "50%",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            color: "#1976d2",
                                            backgroundColor: "#ffffff",
                                            boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
                                        }}
                                    >
                                        <MenuBookOutlinedIcon fontSize="small" />
                                    </Box>
                                </Box>

                                <Typography
                                    fontWeight={800}
                                    sx={{
                                        fontSize: { md: "1.45rem", lg: "1.7rem" },
                                        mb: 1,
                                    }}
                                >
                                    Learn. Grow. Succeed.
                                </Typography>

                                <Typography
                                    sx={{
                                        maxWidth: 370,
                                        mx: "auto",
                                        color: "rgba(255,255,255,0.82)",
                                        fontSize: { md: "0.84rem", lg: "0.92rem" },
                                        lineHeight: 1.65,
                                    }}
                                >
                                    Continue your learning journey with LearnHub
                                    and build the skills that shape your future.
                                </Typography>

                                {/* FEATURES */}
                                <Box sx={{ display: "flex", justifyContent: "center", gap: { md: 3, lg: 4 }, mt: { md: 2.5, lg: 3.5 } }}>
                                    {[
                                        { icon: <MenuBookOutlinedIcon />, label: "Courses" },
                                        { icon: <SchoolOutlinedIcon />, label: "Learning" },
                                        { icon: <TrendingUpOutlinedIcon />, label: "Progress" },
                                    ].map((item) => (
                                        <Box key={item.label} sx={{ textAlign: "center" }}>
                                            {item.icon}
                                            <Typography variant="caption" display="block" sx={{ mt: 0.5 }}>
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
                                    textAlign: "center",
                                    color: "rgba(255,255,255,0.65)",
                                    fontSize: "0.8rem",
                                }}
                            >
                                Empowering learners, one course at a time.
                            </Typography>
                        </Box>

                        {/* =====================================================
                    RIGHT SIDE
                ===================================================== */}

                        <Box
                            sx={{
                                width: { xs: "100%", md: "53%" },
                                minWidth: 0,

                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",

                                overflow: "hidden",
                                height: "100%",
                                boxSizing: "border-box",

                                p: { xs: 2.5, sm: 3.5, md: 4.5, lg: 5 },
                            }}
                        >
                            {/* MOBILE LOGO */}
                            <Box sx={{ display: { xs: "flex", md: "none" }, justifyContent: "center", mb: 1.5 }}>
                                <Box
                                    component="img"
                                    src={logo}
                                    alt="LearnHub Logo"
                                    sx={{ width: 120, maxWidth: "55vw", height: "auto", display: "block" }}
                                />
                            </Box>

                            {/* FORM CONTAINER */}
                            <Box sx={{ width: "100%", maxWidth: 420, mx: "auto" }}>
                                {/* HEADING */}
                                <Typography
                                    fontWeight={800}
                                    sx={{
                                        color: isDark ? "#ffffff" : "#172033",
                                        fontSize: { xs: "1.4rem", sm: "1.55rem", md: "1.65rem" },
                                        lineHeight: 1.25,
                                        mb: 0.5,
                                    }}
                                >
                                    Welcome Back 👋
                                </Typography>

                                <Typography
                                    sx={{
                                        color: isDark ? "#bdbdbd" : "#6b7280",
                                        fontSize: { xs: "0.82rem", sm: "0.88rem" },
                                        lineHeight: 1.5,
                                        mb: { xs: 2, sm: 2.5 },
                                    }}
                                >
                                    Sign in to continue your learning journey.
                                </Typography>

                                {/* FORM */}
                                <Box component="form" onSubmit={handleLogin} noValidate>
                                    {/* EMAIL */}
                                    <Typography
                                        variant="body2"
                                        fontWeight={600}
                                        sx={{ mb: 0.5, color: isDark ? "#ffffff" : "#374151", fontSize: "0.82rem" }}
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
                                        value={formData.email}
                                        onChange={handleChange}
                                        error={!!errors.email}
                                        helperText={errors.email || " "}
                                        slotProps={{
                                            input: {
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <MailOutlineOutlinedIcon
                                                            sx={{ color: isDark ? "#a9a9a9" : "#6b7280", fontSize: 18 }}
                                                        />
                                                    </InputAdornment>
                                                ),
                                            },
                                        }}
                                        sx={fieldSx}
                                    />

                                    {/* PASSWORD HEADER */}
                                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 1, mb: 0.5, mt: 0.3 }}>
                                        <Typography
                                            variant="body2"
                                            fontWeight={600}
                                            sx={{ color: isDark ? "#ffffff" : "#374151", fontSize: "0.82rem" }}
                                        >
                                            Password
                                        </Typography>

                                        <Link
                                            component={RouterLink}
                                            to="/forgot-password"
                                            underline="hover"
                                            sx={{
                                                color: "#1976d2",
                                                fontSize: "0.75rem",
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
                                        size="small"
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Enter your password"
                                        autoComplete="current-password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        error={!!errors.password}
                                        helperText={errors.password || " "}
                                        slotProps={{
                                            input: {
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <LockOutlinedIcon
                                                            sx={{ color: isDark ? "#a9a9a9" : "#6b7280", fontSize: 18 }}
                                                        />
                                                    </InputAdornment>
                                                ),
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <IconButton
                                                            type="button"
                                                            onClick={() => setShowPassword(!showPassword)}
                                                            edge="end"
                                                            size="small"
                                                            aria-label={showPassword ? "Hide password" : "Show password"}
                                                            sx={{ color: isDark ? "#ffffff" : "#4b5563" }}
                                                        >
                                                            {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                                                        </IconButton>
                                                    </InputAdornment>
                                                ),
                                            },
                                        }}
                                        sx={fieldSx}
                                    />

                                    {/* GENERAL ERROR */}
                                    <Box sx={{ minHeight: errors.general ? "auto" : 0, mt: errors.general ? 0.5 : 0 }}>
                                        {errors.general && (
                                            <Typography sx={{ color: "#d32f2f", fontSize: "0.78rem" }}>
                                                {errors.general}
                                            </Typography>
                                        )}
                                    </Box>

                                    {/* LOGIN BUTTON */}
                                    <Button
                                        variant="contained"
                                        type="button"
                                        onClick={handleLogin}
                                        fullWidth
                                        disabled={loading}
                                        sx={{
                                            minHeight: 46,
                                            mt: 1,
                                            borderRadius: 2.2,
                                            textTransform: "none",
                                            fontSize: "0.92rem",
                                            fontWeight: 700,
                                            background: "linear-gradient(135deg, #1976d2 0%, #1565c0 100%)",
                                            boxShadow: "0 8px 22px rgba(25,118,210,0.25)",
                                            transition: "all 0.2s ease",
                                            "&:hover": {
                                                background: "linear-gradient(135deg, #1565c0 0%, #0d47a1 100%)",
                                                boxShadow: "0 11px 28px rgba(25,118,210,0.30)",
                                                transform: "translateY(-1px)",
                                            },
                                            "&:active": {
                                                transform: "translateY(0)",
                                            },
                                            "&.Mui-disabled": {
                                                background: "linear-gradient(135deg, #1976d2 0%, #1565c0 100%)",
                                                opacity: 0.7,
                                                color: "#fff",
                                            },
                                        }}
                                    >
                                        {loading ? <CircularProgress size={22} sx={{ color: "#ffffff" }} /> : "Login"}
                                    </Button>

                                    {/* DIVIDER */}
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, my: 1.8 }}>
                                        <Divider sx={{ flex: 1, borderColor: isDark ? "#383838" : "#e5e7eb" }} />
                                        <Typography sx={{ fontSize: "0.72rem", color: isDark ? "#888888" : "#9ca3af" }}>
                                            OR
                                        </Typography>
                                        <Divider sx={{ flex: 1, borderColor: isDark ? "#383838" : "#e5e7eb" }} />
                                    </Box>

                                    {/* REGISTER */}
                                    <Box sx={{ textAlign: "center" }}>
                                        <Typography
                                            variant="body2"
                                            sx={{ color: isDark ? "#bdbdbd" : "#6b7280", fontSize: "0.82rem", lineHeight: 1.5 }}
                                        >
                                            Don't have an account?{" "}
                                            <Link
                                                component={RouterLink}
                                                to="/register"
                                                underline="hover"
                                                sx={{ color: "#1976d2", fontWeight: 700, ml: 0.3 }}
                                            >
                                                Create an account
                                            </Link>
                                        </Typography>
                                    </Box>
                                </Box>
                            </Box>
                        </Box>
                    </Paper>
                </Fade>
            </Box>
        </>
    );
};

export default Login;