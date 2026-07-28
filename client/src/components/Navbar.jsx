import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Box
} from "@mui/material";

import { useState, useEffect } from "react";
import { getProfile } from "../services/authService";

import { Link, useNavigate } from "react-router-dom";
const Navbar = () => {

    const [user, setUser] = useState(null);
    const navigate = useNavigate();


    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await getProfile();
                setUser(response.data);
            } catch (error) {
                console.log(error);
            }
        };

        if (localStorage.getItem("token")) {
            fetchProfile();
        }
    }, []);


    const handleLogout = () => {
        localStorage.clear();
        navigate("/login");
    };


    return (
        <AppBar position="static">
            <Toolbar>
                <Typography
                    variant="h6"
                    sx={{
                        flexGrow: 1
                    }}
                >
                    LearnHub
                </Typography>
                <Box>
                    <Button
                        color="inherit"
                        component={Link}
                        to="/dashboard"
                    >
                        Dashboard
                    </Button>

                    {user?.role === "teacher" && (
                        <Button
                            color="inherit"
                            component={Link}
                            to="/courses/create"
                        >
                            Create Course
                        </Button>
                    )}
                    <Button
                        color="inherit"
                        component={Link}
                        to="/courses"
                    >
                        Courses
                    </Button>

                    <Button
                        color="inherit"
                        component={Link}
                        to="/profile"
                    >
                        Profile
                    </Button>

                    <Button
                        color="inherit"
                        onClick={handleLogout}
                    >
                        Logout
                    </Button>

                </Box>

            </Toolbar>

        </AppBar>
    );
};


export default Navbar;