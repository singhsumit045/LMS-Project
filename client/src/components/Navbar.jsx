import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Box,
    IconButton
} from "@mui/material";

import {
    DarkMode,
    LightMode
} from "@mui/icons-material";

import { useState, useEffect } from "react";

import { getProfile } from "../services/authService";

import { Link, useNavigate } from "react-router-dom";


const Navbar = () => {

    const [darkMode, setDarkMode] = useState(true);

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
                        flexGrow:1,
                        fontWeight:"bold"
                    }}
                >
                    LearnHub
                </Typography>



                <Box
                    sx={{
                        display:"flex",
                        alignItems:"center"
                    }}
                >


                    <Button
                        color="inherit"
                        component={Link}
                        to="/dashboard"
                    >
                        Dashboard
                    </Button>



                    {
                        (user?.role === "teacher" ||
                         user?.role === "admin") && (

                            <Button
                                color="inherit"
                                component={Link}
                                to="/courses/create"
                            >
                                Create Course
                            </Button>

                        )
                    }



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



                    <IconButton
                        color="inherit"
                        onClick={() => setDarkMode(!darkMode)}
                    >

                        {
                            darkMode
                            ?
                            <LightMode />
                            :
                            <DarkMode />
                        }

                    </IconButton>



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