import {
    Container,
    Box,
    Paper,
    Typography,
    Grid,
    Avatar,
    CircularProgress,
    Alert,
    Chip,
    Divider,
    Button,
} from "@mui/material";

import {
    School,
    People,
    MenuBook,
    Person,
    Visibility,
    Edit,
    Settings,
    ArrowForward,
} from "@mui/icons-material";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../../services/api";

const TeacherDashboard = () => {
    const navigate = useNavigate();

    const [dashboard, setDashboard] = useState({
        totalCourses: 0,
        totalStudents: 0,
        students: [],
        courses: [],
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // =========================
    // FETCH TEACHER DASHBOARD
    // =========================

    useEffect(() => {
        fetchTeacherDashboard();
    }, []);

    const fetchTeacherDashboard = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get(
                "/enrollments/teacher/dashboard"
            );

            setDashboard({
                totalCourses: response.data?.totalCourses || 0,
                totalStudents: response.data?.totalStudents || 0,
                students: response.data?.students || [],
                courses: response.data?.courses || [],
            });
        } catch (error) {
            console.error(
                "Teacher dashboard error:",
                error
            );

            setError(
                error.response?.data?.message ||
                    "Unable to load teacher dashboard."
            );
        } finally {
            setLoading(false);
        }
    };

    // =========================
    // LOADING
    // =========================

    if (loading) {
        return (
            <Box
                sx={{
                    minHeight: "70vh",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <CircularProgress />
            </Box>
        );
    }

    // =========================
    // ERROR
    // =========================

    if (error) {
        return (
            <Container
                maxWidth="xl"
                sx={{
                    py: 5,
                }}
            >
                <Alert severity="error">
                    {error}
                </Alert>
            </Container>
        );
    }

    // =========================
    // TOTAL ENROLLMENTS
    // =========================

    const totalEnrollments =
        dashboard.courses.reduce(
            (total, course) =>
                total +
                (course.students?.length || 0),
            0
        );

    return (
        <Container
            maxWidth="xl"
            sx={{
                py: {
                    xs: 2.5,
                    sm: 3.5,
                    md: 5,
                },
            }}
        >
            {/* =====================================================
                HEADER
            ===================================================== */}

            <Paper
                elevation={0}
                sx={{
                    p: {
                        xs: 2.5,
                        sm: 3.5,
                        md: 5,
                    },
                    mb: {
                        xs: 3,
                        md: 4,
                    },
                    borderRadius: {
                        xs: 3,
                        md: 4,
                    },
                    color: "white",
                    background:
                        "linear-gradient(135deg, #1976d2 0%, #7b1fa2 100%)",
                    position: "relative",
                    overflow: "hidden",
                }}
            >
                {/* Decorative Circle */}

                <Box
                    sx={{
                        position: "absolute",
                        width: {
                            xs: 140,
                            md: 250,
                        },
                        height: {
                            xs: 140,
                            md: 250,
                        },
                        borderRadius: "50%",
                        background:
                            "rgba(255,255,255,0.08)",
                        right: {
                            xs: -70,
                            md: -100,
                        },
                        top: {
                            xs: -70,
                            md: -120,
                        },
                    }}
                />

                <Box
                    sx={{
                        position: "relative",
                        zIndex: 1,
                    }}
                >
                    <Typography
                        fontWeight={700}
                        sx={{
                            fontSize: {
                                xs: "1.7rem",
                                sm: "2.2rem",
                                md: "3rem",
                            },
                            lineHeight: 1.2,
                        }}
                    >
                        Teacher Dashboard 👨‍🏫
                    </Typography>

                    <Typography
                        sx={{
                            mt: 1,
                            opacity: 0.9,
                            fontSize: {
                                xs: "0.9rem",
                                sm: "1rem",
                                md: "1.1rem",
                            },
                            maxWidth: 650,
                        }}
                    >
                        Manage your courses and monitor
                        your students.
                    </Typography>
                </Box>
            </Paper>

            {/* =====================================================
                OVERVIEW
            ===================================================== */}

            <Typography
                variant="h5"
                fontWeight={700}
                sx={{
                    mb: 2.5,
                    fontSize: {
                        xs: "1.35rem",
                        sm: "1.5rem",
                    },
                }}
            >
                Overview
            </Typography>

            <Grid
                container
                spacing={{
                    xs: 2,
                    sm: 2.5,
                    md: 3,
                }}
                sx={{
                    mb: {
                        xs: 4,
                        md: 5,
                    },
                }}
            >
                {/* TOTAL COURSES */}

                <Grid
                    size={{
                        xs: 12,
                        sm: 6,
                        md: 4,
                    }}
                >
                    <Paper
                        elevation={0}
                        sx={{
                            p: {
                                xs: 2.2,
                                sm: 2.5,
                                md: 3,
                            },
                            borderRadius: 3,
                            border: "1px solid",
                            borderColor: "divider",
                            height: "100%",
                            transition:
                                "all 0.25s ease",
                            "&:hover": {
                                transform:
                                    "translateY(-3px)",
                                boxShadow:
                                    "0 10px 25px rgba(0,0,0,0.08)",
                            },
                        }}
                    >
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent:
                                    "space-between",
                                alignItems: "center",
                                gap: 2,
                            }}
                        >
                            <Box>
                                <Typography
                                    color="text.secondary"
                                    fontSize={{
                                        xs: "0.85rem",
                                        sm: "0.9rem",
                                    }}
                                >
                                    My Courses
                                </Typography>

                                <Typography
                                    variant="h4"
                                    fontWeight={700}
                                    sx={{
                                        mt: 0.5,
                                        fontSize: {
                                            xs: "1.8rem",
                                            sm: "2rem",
                                        },
                                    }}
                                >
                                    {
                                        dashboard.totalCourses
                                    }
                                </Typography>
                            </Box>

                            <Avatar
                                sx={{
                                    width: {
                                        xs: 45,
                                        sm: 52,
                                    },
                                    height: {
                                        xs: 45,
                                        sm: 52,
                                    },
                                    bgcolor:
                                        "primary.main",
                                }}
                            >
                                <MenuBook />
                            </Avatar>
                        </Box>
                    </Paper>
                </Grid>

                {/* TOTAL STUDENTS */}

                <Grid
                    size={{
                        xs: 12,
                        sm: 6,
                        md: 4,
                    }}
                >
                    <Paper
                        elevation={0}
                        sx={{
                            p: {
                                xs: 2.2,
                                sm: 2.5,
                                md: 3,
                            },
                            borderRadius: 3,
                            border: "1px solid",
                            borderColor: "divider",
                            height: "100%",
                            transition:
                                "all 0.25s ease",
                            "&:hover": {
                                transform:
                                    "translateY(-3px)",
                                boxShadow:
                                    "0 10px 25px rgba(0,0,0,0.08)",
                            },
                        }}
                    >
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent:
                                    "space-between",
                                alignItems: "center",
                                gap: 2,
                            }}
                        >
                            <Box>
                                <Typography
                                    color="text.secondary"
                                    fontSize={{
                                        xs: "0.85rem",
                                        sm: "0.9rem",
                                    }}
                                >
                                    Total Students
                                </Typography>

                                <Typography
                                    variant="h4"
                                    fontWeight={700}
                                    sx={{
                                        mt: 0.5,
                                        fontSize: {
                                            xs: "1.8rem",
                                            sm: "2rem",
                                        },
                                    }}
                                >
                                    {
                                        dashboard.totalStudents
                                    }
                                </Typography>
                            </Box>

                            <Avatar
                                sx={{
                                    width: {
                                        xs: 45,
                                        sm: 52,
                                    },
                                    height: {
                                        xs: 45,
                                        sm: 52,
                                    },
                                    bgcolor:
                                        "success.main",
                                }}
                            >
                                <People />
                            </Avatar>
                        </Box>
                    </Paper>
                </Grid>

                {/* TOTAL ENROLLMENTS */}

                <Grid
                    size={{
                        xs: 12,
                        sm: 6,
                        md: 4,
                    }}
                >
                    <Paper
                        elevation={0}
                        sx={{
                            p: {
                                xs: 2.2,
                                sm: 2.5,
                                md: 3,
                            },
                            borderRadius: 3,
                            border: "1px solid",
                            borderColor: "divider",
                            height: "100%",
                            transition:
                                "all 0.25s ease",
                            "&:hover": {
                                transform:
                                    "translateY(-3px)",
                                boxShadow:
                                    "0 10px 25px rgba(0,0,0,0.08)",
                            },
                        }}
                    >
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent:
                                    "space-between",
                                alignItems: "center",
                                gap: 2,
                            }}
                        >
                            <Box>
                                <Typography
                                    color="text.secondary"
                                    fontSize={{
                                        xs: "0.85rem",
                                        sm: "0.9rem",
                                    }}
                                >
                                    Enrollments
                                </Typography>

                                <Typography
                                    variant="h4"
                                    fontWeight={700}
                                    sx={{
                                        mt: 0.5,
                                        fontSize: {
                                            xs: "1.8rem",
                                            sm: "2rem",
                                        },
                                    }}
                                >
                                    {totalEnrollments}
                                </Typography>
                            </Box>

                            <Avatar
                                sx={{
                                    width: {
                                        xs: 45,
                                        sm: 52,
                                    },
                                    height: {
                                        xs: 45,
                                        sm: 52,
                                    },
                                    bgcolor:
                                        "warning.main",
                                }}
                            >
                                <School />
                            </Avatar>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>

            {/* =====================================================
                MY COURSES
            ===================================================== */}

            <Box
                sx={{
                    mb: {
                        xs: 4,
                        md: 5,
                    },
                }}
            >
                {/* SECTION HEADER */}

                <Box
                    sx={{
                        display: "flex",
                        alignItems: {
                            xs: "flex-start",
                            sm: "center",
                        },
                        justifyContent:
                            "space-between",
                        flexDirection: {
                            xs: "column",
                            sm: "row",
                        },
                        gap: 1,
                        mb: 2.5,
                    }}
                >
                    <Box>
                        <Typography
                            variant="h5"
                            fontWeight={700}
                            sx={{
                                fontSize: {
                                    xs: "1.35rem",
                                    sm: "1.5rem",
                                },
                            }}
                        >
                            My Courses
                        </Typography>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                                mt: 0.5,
                            }}
                        >
                            Manage and monitor your
                            courses
                        </Typography>
                    </Box>

                    <Chip
                        icon={<MenuBook />}
                        label={`${dashboard.totalCourses} Courses`}
                        color="primary"
                        variant="outlined"
                    />
                </Box>

                {/* NO COURSES */}

                {dashboard.courses.length === 0 ? (
                    <Paper
                        elevation={0}
                        sx={{
                            p: {
                                xs: 4,
                                sm: 5,
                            },
                            textAlign: "center",
                            borderRadius: 3,
                            border: "1px solid",
                            borderColor: "divider",
                        }}
                    >
                        <MenuBook
                            sx={{
                                fontSize: 60,
                                color:
                                    "text.secondary",
                                mb: 1,
                            }}
                        />

                        <Typography
                            variant="h6"
                            fontWeight={600}
                        >
                            No courses created yet
                        </Typography>

                        <Typography
                            color="text.secondary"
                            sx={{
                                mt: 1,
                            }}
                        >
                            Create a course to see it
                            here.
                        </Typography>
                    </Paper>
                ) : (
                    <Grid
                        container
                        spacing={{
                            xs: 2,
                            sm: 2.5,
                            md: 3,
                        }}
                    >
                        {dashboard.courses.map(
                            (course) => {
                                const studentCount =
                                    course.students
                                        ?.length || 0;

                                return (
                                    <Grid
                                        key={
                                            course.id
                                        }
                                        size={{
                                            xs: 12,
                                            sm: 6,
                                            lg: 4,
                                        }}
                                    >
                                        <Paper
                                            elevation={0}
                                            sx={{
                                                height: "100%",
                                                display:
                                                    "flex",
                                                flexDirection:
                                                    "column",
                                                overflow:
                                                    "hidden",
                                                borderRadius: 3,
                                                border:
                                                    "1px solid",
                                                borderColor:
                                                    "divider",
                                                transition:
                                                    "all 0.25s ease",
                                                "&:hover":
                                                    {
                                                        transform:
                                                            "translateY(-5px)",
                                                        boxShadow:
                                                            "0 12px 30px rgba(0,0,0,0.10)",
                                                        borderColor:
                                                            "primary.main",
                                                    },
                                            }}
                                        >
                                            {/* THUMBNAIL */}

                                            <Box
                                                sx={{
                                                    height: {
                                                        xs: 190,
                                                        sm: 180,
                                                        md: 190,
                                                    },
                                                    position:
                                                        "relative",
                                                    overflow:
                                                        "hidden",
                                                    background:
                                                        "linear-gradient(135deg, #1976d2 0%, #7b1fa2 100%)",
                                                }}
                                            >
                                                {course.thumbnail ? (
                                                    <Box
                                                        component="img"
                                                        src={
                                                            course.thumbnail
                                                        }
                                                        alt={
                                                            course.title
                                                        }
                                                        sx={{
                                                            width: "100%",
                                                            height: "100%",
                                                            objectFit:
                                                                "cover",
                                                            display:
                                                                "block",
                                                            transition:
                                                                "transform 0.4s ease",
                                                            "&:hover":
                                                                {
                                                                    transform:
                                                                        "scale(1.05)",
                                                                },
                                                        }}
                                                        onError={(
                                                            event
                                                        ) => {
                                                            event.currentTarget.style.display =
                                                                "none";

                                                            const fallback =
                                                                event
                                                                    .currentTarget
                                                                    .parentElement?.querySelector(
                                                                        ".fallback-icon"
                                                                    );

                                                            if (
                                                                fallback
                                                            ) {
                                                                fallback.style.display =
                                                                    "flex";
                                                            }
                                                        }}
                                                    />
                                                ) : null}

                                                {/* FALLBACK */}

                                                <Box
                                                    className="fallback-icon"
                                                    sx={{
                                                        display:
                                                            course.thumbnail
                                                                ? "none"
                                                                : "flex",
                                                        position:
                                                            "absolute",
                                                        inset: 0,
                                                        alignItems:
                                                            "center",
                                                        justifyContent:
                                                            "center",
                                                    }}
                                                >
                                                    <MenuBook
                                                        sx={{
                                                            fontSize: 70,
                                                            color:
                                                                "white",
                                                            opacity: 0.9,
                                                        }}
                                                    />
                                                </Box>

                                                {/* CATEGORY */}

                                                {course.category && (
                                                    <Chip
                                                        label={
                                                            course.category
                                                        }
                                                        size="small"
                                                        sx={{
                                                            position:
                                                                "absolute",
                                                            top: 12,
                                                            left: 12,
                                                            color:
                                                                "white",
                                                            fontWeight:
                                                                600,
                                                            backgroundColor:
                                                                "rgba(0,0,0,0.55)",
                                                            backdropFilter:
                                                                "blur(5px)",
                                                        }}
                                                    />
                                                )}
                                            </Box>

                                            {/* COURSE CONTENT */}

                                            <Box
                                                sx={{
                                                    p: {
                                                        xs: 2.2,
                                                        sm: 2.5,
                                                    },
                                                    display:
                                                        "flex",
                                                    flexDirection:
                                                        "column",
                                                    flexGrow: 1,
                                                }}
                                            >
                                                {/* TITLE */}

                                                <Typography
                                                    variant="h6"
                                                    fontWeight={
                                                        700
                                                    }
                                                    sx={{
                                                        lineHeight:
                                                            1.35,
                                                        display:
                                                            "-webkit-box",
                                                        WebkitLineClamp:
                                                            2,
                                                        WebkitBoxOrient:
                                                            "vertical",
                                                        overflow:
                                                            "hidden",
                                                    }}
                                                >
                                                    {
                                                        course.title
                                                    }
                                                </Typography>

                                                {/* DESCRIPTION */}

                                                <Typography
                                                    variant="body2"
                                                    color="text.secondary"
                                                    sx={{
                                                        mt: 1,
                                                        lineHeight:
                                                            1.6,
                                                        display:
                                                            "-webkit-box",
                                                        WebkitLineClamp:
                                                            2,
                                                        WebkitBoxOrient:
                                                            "vertical",
                                                        overflow:
                                                            "hidden",
                                                        minHeight: 45,
                                                    }}
                                                >
                                                    {course.description ||
                                                        "No description available."}
                                                </Typography>

                                                {/* STUDENT COUNT */}

                                                <Box
                                                    sx={{
                                                        display:
                                                            "flex",
                                                        alignItems:
                                                            "center",
                                                        gap: 1,
                                                        mt: 2,
                                                    }}
                                                >
                                                    <Avatar
                                                        sx={{
                                                            width: 32,
                                                            height: 32,
                                                            bgcolor:
                                                                "primary.main",
                                                        }}
                                                    >
                                                        <People
                                                            sx={{
                                                                fontSize: 18,
                                                            }}
                                                        />
                                                    </Avatar>

                                                    <Box>
                                                        <Typography
                                                            variant="body2"
                                                            fontWeight={
                                                                600
                                                            }
                                                        >
                                                            {
                                                                studentCount
                                                            }{" "}
                                                            Student
                                                            {studentCount !==
                                                            1
                                                                ? "s"
                                                                : ""}
                                                        </Typography>

                                                        <Typography
                                                            variant="caption"
                                                            color="text.secondary"
                                                        >
                                                            Enrolled
                                                            learners
                                                        </Typography>
                                                    </Box>
                                                </Box>

                                                <Divider
                                                    sx={{
                                                        my: 2,
                                                    }}
                                                />

                                                {/* ACTION BUTTONS */}

                                                <Box
                                                    sx={{
                                                        display:
                                                            "flex",
                                                        flexDirection: {
                                                            xs: "column",
                                                            sm: "row",
                                                        },
                                                        gap: 1,
                                                        mt: "auto",
                                                    }}
                                                >
                                                    {/* VIEW */}

                                                    <Button
                                                        variant="outlined"
                                                        size="small"
                                                        fullWidth
                                                        startIcon={
                                                            <Visibility />
                                                        }
                                                        endIcon={
                                                            <ArrowForward
                                                                sx={{
                                                                    fontSize:
                                                                        "16px !important",
                                                                }}
                                                            />
                                                        }
                                                        onClick={() =>
                                                            navigate(
                                                                `/courses/${course.id}`
                                                            )
                                                        }
                                                        sx={{
                                                            borderRadius: 2,
                                                            textTransform:
                                                                "none",
                                                            fontWeight:
                                                                600,
                                                            py: 1,
                                                        }}
                                                    >
                                                        View
                                                    </Button>

                                                    {/* MANAGE */}

                                                    <Button
                                                        variant="contained"
                                                        size="small"
                                                        fullWidth
                                                        startIcon={
                                                            <Settings />
                                                        }
                                                        onClick={() =>
                                                            navigate(
                                                                `/courses/${course.id}/manage-content`
                                                            )
                                                        }
                                                        sx={{
                                                            borderRadius: 2,
                                                            textTransform:
                                                                "none",
                                                            fontWeight:
                                                                600,
                                                            py: 1,
                                                            boxShadow:
                                                                "none",
                                                            "&:hover":
                                                                {
                                                                    boxShadow:
                                                                        "none",
                                                                },
                                                        }}
                                                    >
                                                        Manage
                                                    </Button>

                                                    {/* EDIT */}

                                                    <Button
                                                        variant="text"
                                                        size="small"
                                                        fullWidth
                                                        startIcon={
                                                            <Edit />
                                                        }
                                                        onClick={() =>
                                                            navigate(
                                                                `/courses/edit/${course.id}`
                                                            )
                                                        }
                                                        sx={{
                                                            borderRadius: 2,
                                                            textTransform:
                                                                "none",
                                                            fontWeight:
                                                                600,
                                                            py: 1,
                                                        }}
                                                    >
                                                        Edit
                                                    </Button>
                                                </Box>
                                            </Box>
                                        </Paper>
                                    </Grid>
                                );
                            }
                        )}
                    </Grid>
                )}
            </Box>

            {/* =====================================================
                MY STUDENTS
            ===================================================== */}

            <Typography
                variant="h5"
                fontWeight={700}
                sx={{
                    mb: 2.5,
                    fontSize: {
                        xs: "1.35rem",
                        sm: "1.5rem",
                    },
                }}
            >
                My Students
            </Typography>

            {dashboard.students.length === 0 ? (
                <Paper
                    elevation={0}
                    sx={{
                        p: {
                            xs: 4,
                            sm: 5,
                        },
                        textAlign: "center",
                        borderRadius: 3,
                        border: "1px solid",
                        borderColor: "divider",
                    }}
                >
                    <People
                        sx={{
                            fontSize: 55,
                            color: "text.secondary",
                        }}
                    />

                    <Typography
                        variant="h6"
                        fontWeight={600}
                        sx={{
                            mt: 1,
                        }}
                    >
                        No students enrolled yet
                    </Typography>
                </Paper>
            ) : (
                <Grid
                    container
                    spacing={{
                        xs: 2,
                        sm: 2.5,
                        md: 3,
                    }}
                >
                    {dashboard.students.map(
                        (student) => {
                            const courses =
                                student.courses || [];

                            return (
                                <Grid
                                    key={student.id}
                                    size={{
                                        xs: 12,
                                        sm: 6,
                                        md: 4,
                                    }}
                                >
                                    <Paper
                                        elevation={0}
                                        sx={{
                                            p: {
                                                xs: 2.5,
                                                sm: 3,
                                            },
                                            height: "100%",
                                            borderRadius: 3,
                                            border:
                                                "1px solid",
                                            borderColor:
                                                "divider",
                                            transition:
                                                "all 0.25s ease",
                                            "&:hover":
                                                {
                                                    transform:
                                                        "translateY(-3px)",
                                                    boxShadow:
                                                        "0 10px 25px rgba(0,0,0,0.08)",
                                                },
                                        }}
                                    >
                                        {/* STUDENT INFO */}

                                        <Box
                                            sx={{
                                                display:
                                                    "flex",
                                                alignItems:
                                                    "center",
                                                gap: 2,
                                            }}
                                        >
                                            <Avatar
                                                sx={{
                                                    width: 48,
                                                    height: 48,
                                                    bgcolor:
                                                        "primary.main",
                                                }}
                                            >
                                                {student.name
                                                    ?.charAt(
                                                        0
                                                    )
                                                    .toUpperCase()}
                                            </Avatar>

                                            <Box
                                                sx={{
                                                    minWidth: 0,
                                                }}
                                            >
                                                <Typography
                                                    fontWeight={
                                                        700
                                                    }
                                                    sx={{
                                                        overflow:
                                                            "hidden",
                                                        textOverflow:
                                                            "ellipsis",
                                                        whiteSpace:
                                                            "nowrap",
                                                    }}
                                                >
                                                    {
                                                        student.name
                                                    }
                                                </Typography>

                                                <Typography
                                                    variant="body2"
                                                    color="text.secondary"
                                                >
                                                    {
                                                        courses.length
                                                    }{" "}
                                                    Course
                                                    {courses.length !==
                                                    1
                                                        ? "s"
                                                        : ""}
                                                </Typography>
                                            </Box>
                                        </Box>

                                        <Divider
                                            sx={{
                                                my: 2,
                                            }}
                                        />

                                        {/* STUDENT COURSES */}

                                        {courses.map(
                                            (
                                                course
                                            ) => (
                                                <Box
                                                    key={
                                                        course.id
                                                    }
                                                    sx={{
                                                        display:
                                                            "flex",
                                                        alignItems:
                                                            "center",
                                                        gap: 1,
                                                        mb: 1,
                                                    }}
                                                >
                                                    <Person
                                                        fontSize="small"
                                                        color="primary"
                                                    />

                                                    <Typography
                                                        variant="body2"
                                                        sx={{
                                                            overflow:
                                                                "hidden",
                                                            textOverflow:
                                                                "ellipsis",
                                                            whiteSpace:
                                                                "nowrap",
                                                        }}
                                                    >
                                                        {
                                                            course.title
                                                        }
                                                    </Typography>
                                                </Box>
                                            )
                                        )}
                                    </Paper>
                                </Grid>
                            );
                        }
                    )}
                </Grid>
            )}
        </Container>
    );
};

export default TeacherDashboard;