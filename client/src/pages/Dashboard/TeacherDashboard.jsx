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
} from "@mui/material";

import {
    School,
    People,
    MenuBook,
    Person,
} from "@mui/icons-material";

import { useEffect, useState } from "react";

import api from "../../services/api";

const TeacherDashboard = () => {
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

            setDashboard(response.data);
        } catch (error) {
            console.log(
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
                sx={{ py: 5 }}
            >
                <Alert severity="error">
                    {error}
                </Alert>
            </Container>
        );
    }

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
            {/* =========================
                HEADER
            ========================= */}

            <Paper
                elevation={0}
                sx={{
                    p: {
                        xs: 3,
                        md: 5,
                    },
                    mb: 4,
                    borderRadius: 4,
                    color: "white",
                    background:
                        "linear-gradient(135deg, #1976d2 0%, #7b1fa2 100%)",
                }}
            >
                <Typography
                    variant="h3"
                    fontWeight={700}
                    sx={{
                        fontSize: {
                            xs: "2rem",
                            md: "3rem",
                        },
                    }}
                >
                    Teacher Dashboard 👨‍🏫
                </Typography>

                <Typography
                    sx={{
                        mt: 1,
                        opacity: 0.9,
                        fontSize: "1.1rem",
                    }}
                >
                    Manage your courses and monitor
                    your students.
                </Typography>
            </Paper>

            {/* =========================
                STATISTICS
            ========================= */}

            <Typography
                variant="h5"
                fontWeight={700}
                sx={{ mb: 2.5 }}
            >
                Overview
            </Typography>

            <Grid
                container
                spacing={3}
                sx={{ mb: 5 }}
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
                            p: 3,
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
                            }}
                        >
                            <Box>
                                <Typography
                                    color="text.secondary"
                                >
                                    My Courses
                                </Typography>

                                <Typography
                                    variant="h4"
                                    fontWeight={700}
                                    sx={{ mt: 1 }}
                                >
                                    {
                                        dashboard.totalCourses
                                    }
                                </Typography>
                            </Box>

                            <Avatar
                                sx={{
                                    width: 52,
                                    height: 52,
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
                            p: 3,
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
                            }}
                        >
                            <Box>
                                <Typography
                                    color="text.secondary"
                                >
                                    Total Students
                                </Typography>

                                <Typography
                                    variant="h4"
                                    fontWeight={700}
                                    sx={{ mt: 1 }}
                                >
                                    {
                                        dashboard.totalStudents
                                    }
                                </Typography>
                            </Box>

                            <Avatar
                                sx={{
                                    width: 52,
                                    height: 52,
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
                            p: 3,
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
                            }}
                        >
                            <Box>
                                <Typography
                                    color="text.secondary"
                                >
                                    Enrollments
                                </Typography>

                                <Typography
                                    variant="h4"
                                    fontWeight={700}
                                    sx={{ mt: 1 }}
                                >
                                    {dashboard.courses.reduce(
                                        (total, course) =>
                                            total +
                                            course.students
                                                .length,
                                        0
                                    )}
                                </Typography>
                            </Box>

                            <Avatar
                                sx={{
                                    width: 52,
                                    height: 52,
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

            {/* =========================
                MY COURSES
            ========================= */}

            <Typography
                variant="h5"
                fontWeight={700}
                sx={{ mb: 2.5 }}
            >
                My Courses
            </Typography>

            {dashboard.courses.length === 0 ? (
                <Paper
                    elevation={0}
                    sx={{
                        p: 5,
                        mb: 5,
                        textAlign: "center",
                        borderRadius: 3,
                        border: "1px solid",
                        borderColor: "divider",
                    }}
                >
                    <MenuBook
                        sx={{
                            fontSize: 60,
                            color: "text.secondary",
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
                        sx={{ mt: 1 }}
                    >
                        Create a course to see it here.
                    </Typography>
                </Paper>
            ) : (
                <Grid
                    container
                    spacing={3}
                    sx={{ mb: 5 }}
                >
                    {dashboard.courses.map(
                        (course) => (
                            <Grid
                                key={course.id}
                                size={{
                                    xs: 12,
                                    sm: 6,
                                    md: 4,
                                }}
                            >
                                <Paper
                                    elevation={0}
                                    sx={{
                                        height: "100%",
                                        borderRadius: 3,
                                        overflow: "hidden",
                                        border: "1px solid",
                                        borderColor:
                                            "divider",
                                    }}
                                >
                                    {/* THUMBNAIL */}

                                    <Box
                                        sx={{
                                            height: 180,
                                            background:
                                                "linear-gradient(135deg, #1976d2, #7b1fa2)",
                                            display:
                                                "flex",
                                            alignItems:
                                                "center",
                                            justifyContent:
                                                "center",
                                            overflow:
                                                "hidden",
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
                                                    width:
                                                        "100%",
                                                    height:
                                                        "100%",
                                                    objectFit:
                                                        "cover",
                                                }}
                                                onError={(
                                                    event
                                                ) => {
                                                    event.currentTarget.style.display =
                                                        "none";
                                                }}
                                            />
                                        ) : (
                                            <MenuBook
                                                sx={{
                                                    fontSize: 70,
                                                    color:
                                                        "white",
                                                }}
                                            />
                                        )}
                                    </Box>

                                    {/* COURSE INFO */}

                                    <Box sx={{ p: 3 }}>
                                        <Typography
                                            variant="h6"
                                            fontWeight={700}
                                        >
                                            {
                                                course.title
                                            }
                                        </Typography>

                                        <Typography
                                            color="text.secondary"
                                            sx={{
                                                mt: 1,
                                                mb: 2,
                                                display:
                                                    "-webkit-box",
                                                WebkitLineClamp: 2,
                                                WebkitBoxOrient:
                                                    "vertical",
                                                overflow:
                                                    "hidden",
                                            }}
                                        >
                                            {
                                                course.description
                                            }
                                        </Typography>

                                        <Chip
                                            label={
                                                course.category
                                            }
                                            size="small"
                                            color="primary"
                                            variant="outlined"
                                        />

                                        <Divider
                                            sx={{
                                                my: 2,
                                            }}
                                        />

                                        <Box
                                            sx={{
                                                display:
                                                    "flex",
                                                alignItems:
                                                    "center",
                                                gap: 1,
                                            }}
                                        >
                                            <People
                                                color="primary"
                                            />

                                            <Typography
                                                fontWeight={
                                                    600
                                                }
                                            >
                                                {
                                                    course
                                                        .students
                                                        .length
                                                }{" "}
                                                Student
                                                {course
                                                    .students
                                                    .length !==
                                                1
                                                    ? "s"
                                                    : ""}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Paper>
                            </Grid>
                        )
                    )}
                </Grid>
            )}

            {/* =========================
                STUDENTS
            ========================= */}

            <Typography
                variant="h5"
                fontWeight={700}
                sx={{ mb: 2.5 }}
            >
                My Students
            </Typography>

            {dashboard.students.length === 0 ? (
                <Paper
                    elevation={0}
                    sx={{
                        p: 5,
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
                        sx={{ mt: 1 }}
                    >
                        No students enrolled yet
                    </Typography>
                </Paper>
            ) : (
                <Grid
                    container
                    spacing={3}
                >
                    {dashboard.students.map(
                        (student) => (
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
                                        p: 3,
                                        borderRadius: 3,
                                        border: "1px solid",
                                        borderColor:
                                            "divider",
                                    }}
                                >
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

                                        <Box>
                                            <Typography
                                                fontWeight={
                                                    700
                                                }
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
                                                    student
                                                        .courses
                                                        .length
                                                }{" "}
                                                Course
                                                {student
                                                    .courses
                                                    .length !==
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

                                    {student.courses.map(
                                        (course) => (
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
                        )
                    )}
                </Grid>
            )}
        </Container>
    );
};

export default TeacherDashboard;