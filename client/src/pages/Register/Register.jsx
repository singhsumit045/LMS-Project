import {
    Container,
    Paper,
    Box,
    Typography,
    TextField,
    Button,
    Link,
    MenuItem
} from "@mui/material";

import { Link as RouterLink } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";

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
        <Container maxWidth="sm">

            <Paper elevation={8}
                sx={{
                    padding: 4,
                    marginTop: 8
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
                            alignItems: "center"
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
                                ml: "-65px"
                            }}
                        />
                    </Box>

                    <Typography
                        variant="h4"
                        fontWeight="bold"
                    >
                        Create Account
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                        mt={1}
                    >
                        Join LearnHub and start your learning journey
                    </Typography>

                </Box>


                <Box component="form" onSubmit={handleSubmit}>

                    <TextField
                        fullWidth
                        required
                        label="Full Name"
                        name="name"
                        autoComplete="name"
                        margin="normal"
                        value={formData.name}
                        onChange={handleChange}
                        error={!!errors.name}
                        helperText={errors.name}
                    />

                    <TextField
                        fullWidth
                        required
                        label="Email"
                        name="email"
                        autoComplete="email"
                        margin="normal"
                        value={formData.email}
                        onChange={handleChange}
                        error={!!errors.email}
                        helperText={errors.email}
                    />

                    <TextField
                        fullWidth
                        required
                        label="Password"
                        type={showPassword ? "text" : "password"}
                        name="password"
                        autoComplete="new-password"
                        margin="normal"
                        value={formData.password}
                        onChange={handleChange}
                        error={!!errors.password}
                        helperText={errors.password}

                        slotProps={{
                            input: {
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => setShowPassword(!showPassword)}
                                            edge="end"
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            },
                        }}
                    />

                    <TextField
                        fullWidth
                        required
                        label="Confirm Password"
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        autoComplete="new-password"
                        margin="normal"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        error={!!errors.confirmPassword}
                        helperText={errors.confirmPassword}

                        slotProps={{
                            input: {
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            edge="end"
                                        >
                                            {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            },
                        }}
                    />

                    <TextField
                        select
                        fullWidth
                        label="Select Role"
                        name="role"
                        margin="normal"
                        value={formData.role}
                        onChange={handleChange}
                        error={!!errors.role}
                        helperText={errors.role}
                    >

                        <MenuItem value="student">
                            Student
                        </MenuItem>

                        <MenuItem value="teacher">
                            Teacher
                        </MenuItem>

                    </TextField>

                    <Button
                        fullWidth
                        variant="contained"
                        type="submit"
                        sx={{ mt: 3 }}
                    >
                        Create Account
                    </Button>

                    <Typography textAlign="center" mt={2}>
                        Already have an account?{" "}
                        <Link component={RouterLink} to="/login">
                            Login
                        </Link>
                    </Typography>

                </Box>

            </Paper>

        </Container >
    );
}

export default Register;