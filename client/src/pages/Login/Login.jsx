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

import logo from "../../assets/LearnHub.png";

import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = (e) => {
        e.preventDefault();

        if (!email || !password) {
            alert("Please fill all fields");
            return;
        }

        console.log({
            email,
            password,
        });
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
                    <Box textAlign="center" mb={3}>
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
                        label="Email"
                        type="email"
                        value={email}
                        autoComplete="email"
                        onChange={(e) => setEmail(e.target.value)}
                        fullWidth
                        margin="normal"
                    />

                    <TextField
                        label="Password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        autoComplete="current-password"
                        onChange={(e) => setPassword(e.target.value)}
                        fullWidth
                        margin="normal"
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

                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "flex-end",
                            mt: 1,
                            mb: 2,
                        }}
                    >
                        <Link href="#" underline="hover">
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