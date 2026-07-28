import {
    Container,
    Paper,
    Box,
    Typography,
    TextField,
    Button,
    Link,
} from "@mui/material";

import { Link as RouterLink } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import logo from "../../assets/LearnHub.png";

import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";

import { validateLogin } from "../../utils/validation";
import { loginUser } from "../../services/authService";


const Login = () => {

     const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
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


    const handleLogin = async (e) => {
        e.preventDefault();
        const validationErrors = validateLogin(formData);
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length > 0) {
            return;
        }

        try {
            const response = await loginUser(formData);

            console.log(response.data);

            localStorage.setItem(
                "token",
                response.data.access_token
            );
            alert("Login Successful");
            navigate("/dashboard");

        } catch (error) {

            console.log(error.response?.data);

            alert(
                error.response?.data?.message ||
                "Invalid email or password"
            );
        }
    };

    return (
        <Container
            maxWidth="sm"
            sx={{
                mt: 8,
            }}
        >

            <Paper
                elevation={8}
                sx={{
                    p: 4,
                    borderRadius: 3,
                }}
            >

                <Box
                    component="form"
                    onSubmit={handleLogin}
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                    }}
                >
                    <Box sx={{
                        textAlign: "center",
                        mt: 2,
                    }}>

                        <Box
                            sx={{
                                width: 180,
                                height: 40,
                                overflow: "hidden",
                                mx: "auto",
                                mb: 2,
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >
                            <Box
                                component="img"
                                src={logo}
                                alt="LearnHub Logo"
                                sx={{
                                    width: 250,
                                    height: "auto",
                                    objectFit: "contain",
                                    ml: "-65px",
                                }}
                            />
                        </Box>
                        <Typography
                            variant="h4"
                            fontWeight="bold"
                            mb={1}
                        >
                            Welcome Back 👋
                        </Typography>


                        <Typography
                            variant="body1"
                            color="text.secondary"
                        >
                            Sign in to continue learning
                        </Typography>

                    </Box>



                    <TextField
                        fullWidth
                        required
                        margin="normal"
                        label="Email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        value={formData.email}
                        onChange={handleChange}
                        error={!!errors.email}
                        helperText={errors.email || " "}
                    />



                    <TextField
                        fullWidth
                        required
                        margin="normal"
                        label="Password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="current-password"
                        value={formData.password}
                        onChange={handleChange}
                        error={!!errors.password}
                        helperText={errors.password || " "}

                        slotProps={{
                            input: {
                                endAdornment: (
                                    <InputAdornment position="end">

                                        <IconButton
                                            onClick={() =>
                                                setShowPassword(!showPassword)
                                            }
                                            edge="end"
                                        >

                                            {
                                                showPassword
                                                    ? <VisibilityOff />
                                                    : <Visibility />
                                            }

                                        </IconButton>

                                    </InputAdornment>
                                ),
                            },
                        }}
                    />



                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "flex-end",
                            mt: 1,
                            mb: 2,
                        }}
                    >

                        <Link
                            component={RouterLink}
                            to="/forgot-password"
                            underline="hover"
                        >
                            Forgot Password?
                        </Link>

                    </Box>



                    <Button
                        variant="contained"
                        type="submit"
                        fullWidth
                        size="large"
                        sx={{
                            py: 1.3,
                            textTransform: "none",
                            borderRadius: 2,
                        }}
                    >
                        Login
                    </Button>



                    <Box
                        sx={{
                            mt: 2,
                            textAlign: "center",
                        }}
                    >

                        <Typography variant="body2">

                            Don't have an account?{" "}

                            <Link
                                component={RouterLink}
                                to="/register"
                                underline="hover"
                            >
                                Register
                            </Link>
                        </Typography>
                    </Box>
                </Box>
            </Paper>
        </Container>
    );
};


export default Login;