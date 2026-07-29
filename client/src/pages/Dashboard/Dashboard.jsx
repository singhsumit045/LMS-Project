import {
    Container,
    Box,
    Paper,
    Typography,
    Button,
    Grid,
    LinearProgress,
    Chip,
    Avatar,
} from "@mui/material";

import {
    School,
    PlayCircle,
    CheckCircle,
    EmojiEvents,
    ArrowForward,
    AccessTime,
} from "@mui/icons-material";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


const Dashboard = () => {

    const navigate = useNavigate();

    const [user, setUser] = useState(null);


    // =========================
    // GET USER FROM LOCAL STORAGE
    // =========================

    useEffect(() => {

        const storedUser = localStorage.getItem("user");

        if (storedUser) {

            try {

                setUser(JSON.parse(storedUser));

            } catch (error) {

                console.log(
                    "User data error:",
                    error
                );

            }

        }

    }, []);


    const userName = user?.name || "Learner";


    // =========================
    // DASHBOARD STATS
    // =========================

    const stats = [
        {
            title: "Total Courses",
            value: "0",
            icon: <School />,
        },

        {
            title: "Enrolled Courses",
            value: "0",
            icon: <PlayCircle />,
        },

        {
            title: "Completed",
            value: "0",
            icon: <CheckCircle />,
        },

        {
            title: "Certificates",
            value: "0",
            icon: <EmojiEvents />,
        },
    ];


    return (

        <Container
            maxWidth="xl"
            sx={{
                py: {
                    xs: 3,
                    md: 5,
                },
            }}
        >

            {/* =====================================
                WELCOME SECTION
            ===================================== */}

            <Paper
                elevation={0}
                sx={{
                    p: {
                        xs: 3,
                        sm: 4,
                        md: 5,
                    },

                    mb: 4,

                    borderRadius: 4,

                    background:
                        "linear-gradient(135deg, #1976d2 0%, #7b1fa2 100%)",

                    color: "white",

                    position: "relative",

                    overflow: "hidden",
                }}
            >

                <Box
                    sx={{
                        position: "relative",
                        zIndex: 1,
                    }}
                >

                    <Chip
                        label={
                            user?.role
                                ? user.role.toUpperCase()
                                : "LEARNER"
                        }

                        variant="outlined"

                        sx={{
                            mb: 2,

                            color: "white",

                            borderColor:
                                "rgba(255,255,255,0.5)",

                            backgroundColor:
                                "rgba(255,255,255,0.12)",

                            fontWeight: 600,
                        }}
                    />


                    <Typography
                        variant="h3"
                        sx={{
                            fontWeight: 700,

                            fontSize: {
                                xs: "2rem",
                                sm: "2.4rem",
                                md: "3rem",
                            },

                            lineHeight: 1.2,
                        }}
                    >
                        Welcome back, {userName} 👋
                    </Typography>


                    <Typography
                        variant="h6"
                        sx={{
                            mt: 1.5,

                            opacity: 0.9,

                            maxWidth: 650,

                            fontWeight: 400,

                            fontSize: {
                                xs: "1rem",
                                md: "1.25rem",
                            },
                        }}
                    >
                        Continue your learning journey
                        and build your skills with LearnHub.
                    </Typography>


                    <Button
                        variant="contained"

                        onClick={() =>
                            navigate("/courses")
                        }

                        endIcon={<ArrowForward />}

                        sx={{
                            mt: 3,

                            backgroundColor: "white",

                            color: "primary.main",

                            "&:hover": {
                                backgroundColor: "#f5f5f5",
                            },
                        }}
                    >
                        Explore Courses
                    </Button>

                </Box>

            </Paper>


            {/* =====================================
                STATISTICS
            ===================================== */}

            <Typography
                variant="h5"
                fontWeight={700}
                sx={{
                    mb: 2.5,
                }}
            >
                Your Learning Overview
            </Typography>


            <Grid
                container
                spacing={2.5}
                sx={{
                    mb: 5,
                }}
            >

                {stats.map((stat) => (

                    <Grid
                        key={stat.title}
                        size={{
                            xs: 12,
                            sm: 6,
                            md: 3,
                        }}
                    >

                        <Paper
                            elevation={0}

                            sx={{
                                p: 3,

                                height: "100%",

                                border: "1px solid",

                                borderColor: "divider",

                                borderRadius: 3,

                                transition:
                                    "transform 0.2s ease, box-shadow 0.2s ease",

                                "&:hover": {
                                    transform:
                                        "translateY(-4px)",

                                    boxShadow:
                                        "0 8px 25px rgba(0,0,0,0.08)",
                                },
                            }}
                        >

                            <Box
                                sx={{
                                    display: "flex",

                                    justifyContent:
                                        "space-between",

                                    alignItems: "center",
                                }}
                            >

                                <Box>

                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                    >
                                        {stat.title}
                                    </Typography>


                                    <Typography
                                        variant="h4"
                                        fontWeight={700}
                                        sx={{
                                            mt: 1,
                                        }}
                                    >
                                        {stat.value}
                                    </Typography>

                                </Box>


                                <Avatar
                                    sx={{
                                        width: 48,

                                        height: 48,

                                        bgcolor:
                                            "primary.main",

                                        color: "white",
                                    }}
                                >
                                    {stat.icon}
                                </Avatar>

                            </Box>

                        </Paper>

                    </Grid>

                ))}

            </Grid>


            {/* =====================================
                MY COURSES HEADER
            ===================================== */}

            <Box
                sx={{
                    display: "flex",

                    justifyContent:
                        "space-between",

                    alignItems: "center",

                    mb: 2.5,

                    gap: 2,
                }}
            >

                <Typography
                    variant="h5"
                    fontWeight={700}
                >
                    My Courses
                </Typography>


                <Button
                    endIcon={<ArrowForward />}
                    onClick={() =>
                        navigate("/courses")
                    }
                >
                    View All
                </Button>

            </Box>


            {/* =====================================
                MY COURSES EMPTY STATE
            ===================================== */}

            <Paper
                elevation={0}

                sx={{
                    p: {
                        xs: 3,
                        md: 4,
                    },

                    mb: 5,

                    borderRadius: 3,

                    border: "1px solid",

                    borderColor: "divider",

                    textAlign: "center",
                }}
            >

                <School
                    sx={{
                        fontSize: 55,

                        color: "text.secondary",

                        mb: 1,
                    }}
                />


                <Typography
                    variant="h6"
                    fontWeight={600}
                >
                    No courses yet
                </Typography>


                <Typography
                    color="text.secondary"

                    sx={{
                        mt: 1,

                        maxWidth: 500,

                        mx: "auto",
                    }}
                >
                    You haven't enrolled in any courses yet.
                    Explore our courses and start learning today.
                </Typography>


                <Button
                    variant="contained"

                    onClick={() =>
                        navigate("/courses")
                    }

                    sx={{
                        mt: 2.5,
                    }}
                >
                    Browse Courses
                </Button>

            </Paper>


            {/* =====================================
                LEARNING PROGRESS
            ===================================== */}

            <Typography
                variant="h5"
                fontWeight={700}
                sx={{
                    mb: 2.5,
                }}
            >
                Learning Progress
            </Typography>


            <Paper
                elevation={0}

                sx={{
                    p: {
                        xs: 3,
                        md: 4,
                    },

                    borderRadius: 3,

                    border: "1px solid",

                    borderColor: "divider",
                }}
            >

                <Box
                    sx={{
                        display: "flex",

                        justifyContent:
                            "space-between",

                        alignItems: "center",

                        mb: 1,
                    }}
                >

                    <Box
                        sx={{
                            display: "flex",

                            alignItems: "center",

                            gap: 1,
                        }}
                    >

                        <AccessTime />

                        <Typography
                            fontWeight={600}
                        >
                            Overall Progress
                        </Typography>

                    </Box>


                    <Typography
                        fontWeight={700}
                        color="primary"
                    >
                        0%
                    </Typography>

                </Box>


                <LinearProgress
                    variant="determinate"
                    value={0}

                    sx={{
                        height: 8,

                        borderRadius: 5,
                    }}
                />

                <Typography
                    variant="body2"
                    color="text.secondary"

                    sx={{
                        mt: 1.5,
                    }}
                >

                    Start a course to track your
                    learning progress.
                </Typography>
            </Paper>
        </Container>

    );
};

export default Dashboard;