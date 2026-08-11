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
    Stack,
    IconButton,
    Tooltip,
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
    Assessment,
    VideoCall,
    PlayCircle,
    StopCircle,
    CalendarMonth,
    AccessTime,
    Add,
    OpenInNew,
    EventAvailable,
} from "@mui/icons-material";

import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

import {
    startLiveClass,
    endLiveClass,
} from "../../services/liveClassService";

const TeacherDashboard = () => {
    const navigate = useNavigate();

    // ======================================================
    // DASHBOARD STATE
    // ======================================================

    const [dashboard, setDashboard] = useState({
        totalCourses: 0,
        totalStudents: 0,
        students: [],
        courses: [],
    });

    const [liveClasses, setLiveClasses] = useState([]);

    const [loading, setLoading] = useState(true);
    const [liveClassesLoading, setLiveClassesLoading] =
        useState(true);

    const [error, setError] = useState("");
    const [liveClassError, setLiveClassError] =
        useState("");

    const [actionLoading, setActionLoading] =
        useState(null);

    // ======================================================
    // FETCH TEACHER DASHBOARD
    // ======================================================

    const fetchTeacherDashboard = useCallback(
        async () => {
            try {
                setLoading(true);
                setError("");

                const response = await api.get(
                    "/enrollments/teacher/dashboard"
                );

                const data = response.data || {};

                setDashboard({
                    totalCourses:
                        data.totalCourses || 0,

                    totalStudents:
                        data.totalStudents || 0,

                    students:
                        Array.isArray(data.students)
                            ? data.students
                            : [],

                    courses:
                        Array.isArray(data.courses)
                            ? data.courses
                            : [],
                });
            } catch (error) {
                console.error(
                    "Teacher dashboard error:",
                    error
                );

                setError(
                    error?.response?.data?.message ||
                    "Unable to load teacher dashboard."
                );
            } finally {
                setLoading(false);
            }
        },
        []
    );

    // ======================================================
    // FETCH TEACHER LIVE CLASSES
    // ======================================================

    const fetchLiveClasses = useCallback(
        async () => {
            try {
                setLiveClassesLoading(true);
                setLiveClassError("");

                const response = await api.get(
                    "/live-classes/teacher/my-classes"
                );

                const data = response.data;

                const classes = Array.isArray(data)
                    ? data
                    : Array.isArray(data?.liveClasses)
                        ? data.liveClasses
                        : [];

                setLiveClasses(classes);
            } catch (error) {
                console.error(
                    "Live classes error:",
                    error
                );

                setLiveClassError(
                    error?.response?.data?.message ||
                    "Unable to load live classes."
                );

                setLiveClasses([]);
            } finally {
                setLiveClassesLoading(false);
            }
        },
        []
    );

    // ======================================================
    // INITIAL LOAD
    // ======================================================

    useEffect(() => {
        fetchTeacherDashboard();
        fetchLiveClasses();
    }, [
        fetchTeacherDashboard,
        fetchLiveClasses,
    ]);

    // ======================================================
    // START LIVE CLASS
    // ======================================================

    const handleStartLiveClass = async (
        liveClassId
    ) => {
        try {
            setActionLoading(
                `start-${liveClassId}`
            );

            await startLiveClass(liveClassId);

            await fetchLiveClasses();

            navigate(
                `/live-class/${liveClassId}`
            );
        } catch (error) {
            console.error(
                "Start live class error:",
                error
            );

            alert(
                error?.response?.data?.message ||
                error?.message ||
                "Unable to start live class."
            );
        } finally {
            setActionLoading(null);
        }
    };

    // ======================================================
    // END LIVE CLASS
    // ======================================================

    const handleEndLiveClass = async (
        liveClassId
    ) => {
        const confirmed = window.confirm(
            "Are you sure you want to end this live class?"
        );

        if (!confirmed) {
            return;
        }

        try {
            setActionLoading(
                `end-${liveClassId}`
            );

            await endLiveClass(liveClassId);

            await fetchLiveClasses();
        } catch (error) {
            console.error(
                "End live class error:",
                error
            );

            alert(
                error?.response?.data?.message ||
                error?.message ||
                "Unable to end live class."
            );
        } finally {
            setActionLoading(null);
        }
    };

    // ======================================================
    // OPEN LIVE CLASSROOM
    // ======================================================

    const handleOpenLiveClass = (
        liveClassId
    ) => {
        navigate(
            `/live-class/${liveClassId}`
        );
    };

    // ======================================================
    // DATE FORMATTER
    // ======================================================

    const formatDateTime = (date) => {
        if (!date) {
            return "Not scheduled";
        }

        const parsedDate = new Date(date);

        if (
            Number.isNaN(
                parsedDate.getTime()
            )
        ) {
            return "Invalid date";
        }

        return parsedDate.toLocaleString(
            "en-IN",
            {
                dateStyle: "medium",
                timeStyle: "short",
            }
        );
    };

    // ======================================================
    // LIVE CLASS STATUS
    // ======================================================

    const getLiveClassStatus = (
        liveClass
    ) => {
        if (liveClass.isCompleted) {
            return {
                label: "Completed",
                color: "default",
            };
        }

        if (liveClass.isCancelled) {
            return {
                label: "Cancelled",
                color: "error",
            };
        }

        if (liveClass.isLive) {
            return {
                label: "LIVE NOW",
                color: "success",
            };
        }

        return {
            label: "Scheduled",
            color: "warning",
        };
    };

    // ======================================================
    // SORT LIVE CLASSES
    // ======================================================

    const sortedLiveClasses = useMemo(() => {
        return [...liveClasses].sort(
            (a, b) => {
                if (
                    a.isLive &&
                    !b.isLive
                ) {
                    return -1;
                }

                if (
                    !a.isLive &&
                    b.isLive
                ) {
                    return 1;
                }

                return (
                    new Date(
                        a.scheduledAt || 0
                    ).getTime() -
                    new Date(
                        b.scheduledAt || 0
                    ).getTime()
                );
            }
        );
    }, [liveClasses]);

    // ======================================================
    // TOTAL ENROLLMENTS
    // ======================================================

    const totalEnrollments =
        dashboard.courses.reduce(
            (total, course) =>
                total +
                (course.students?.length ||
                    0),
            0
        );

    // ======================================================
    // LOADING
    // ======================================================

    if (loading) {
        return (
            <Box
                sx={{
                    minHeight: "70vh",
                    display: "flex",
                    justifyContent:
                        "center",
                    alignItems: "center",
                }}
            >
                <CircularProgress />
            </Box>
        );
    }

    // ======================================================
    // ERROR
    // ======================================================

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
                        Manage your courses,
                        students, exams and
                        live classes from one
                        place.
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
                            borderColor:
                                "divider",
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
                                alignItems:
                                    "center",
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
                            borderColor:
                                "divider",
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
                                alignItems:
                                    "center",
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

                {/* ENROLLMENTS */}

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
                            borderColor:
                                "divider",
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
                                alignItems:
                                    "center",
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
                                    {
                                        totalEnrollments
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
                                        "warning.main",
                                }}
                            >
                                <School />
                            </Avatar>
                        </Box>
                    </Paper>
                </Grid>

                {/* EXAM RESULTS */}

                <Grid
                    size={{
                        xs: 12,
                        sm: 6,
                        md: 4,
                    }}
                >
                    <Paper
                        elevation={0}
                        onClick={() =>
                            navigate(
                                "/teacher/exam-results"
                            )
                        }
                        sx={{
                            p: {
                                xs: 2.2,
                                sm: 2.5,
                                md: 3,
                            },
                            borderRadius: 3,
                            border: "1px solid",
                            borderColor:
                                "divider",
                            height: "100%",
                            cursor: "pointer",
                            transition:
                                "all 0.25s ease",
                            "&:hover": {
                                transform:
                                    "translateY(-3px)",
                                boxShadow:
                                    "0 10px 25px rgba(0,0,0,0.08)",
                                borderColor:
                                    "primary.main",
                            },
                        }}
                    >
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent:
                                    "space-between",
                                alignItems:
                                    "center",
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
                                    Exam Results
                                </Typography>

                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{
                                        mt: 0.5,
                                    }}
                                >
                                    View student
                                    performance
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
                                        "info.main",
                                }}
                            >
                                <Assessment />
                            </Avatar>
                        </Box>

                        <Button
                            variant="text"
                            size="small"
                            endIcon={
                                <ArrowForward />
                            }
                            sx={{
                                mt: 1.5,
                                textTransform:
                                    "none",
                                fontWeight: 600,
                                p: 0,
                            }}
                        >
                            View Results
                        </Button>
                    </Paper>
                </Grid>
            </Grid>

            {/* =====================================================
                AI QUIZ GENERATOR
            ===================================================== */}

            <Box
                sx={{
                    mb: {
                        xs: 4,
                        md: 5,
                    },
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        alignItems: {
                            xs: "flex-start",
                            md: "center",
                        },
                        justifyContent:
                            "space-between",
                        flexDirection: {
                            xs: "column",
                            md: "row",
                        },
                        gap: 2,
                        mb: 2.5,
                    }}
                >
                    <Box>
                        <Box
                            sx={{
                                display: "flex",
                                alignItems:
                                    "center",
                                gap: 1,
                            }}
                        >
                            <AutoAwesomeIcon
                                color="primary"
                            />

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
                                AI Teaching Tools
                            </Typography>
                        </Box>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                                mt: 0.5,
                            }}
                        >
                            Create quizzes and
                            learning material
                            quickly with AI.
                        </Typography>
                    </Box>
                </Box>

                <Grid
                    container
                    spacing={{
                        xs: 2,
                        sm: 2.5,
                        md: 3,
                    }}
                >
                    <Grid
                        size={{
                            xs: 12,
                            md: 6,
                            lg: 4,
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
                                border: "1px solid",
                                borderColor:
                                    "divider",
                                position:
                                    "relative",
                                overflow:
                                    "hidden",
                                transition:
                                    "all 0.25s ease",
                                "&:hover": {
                                    transform:
                                        "translateY(-4px)",
                                    boxShadow:
                                        "0 12px 30px rgba(0,0,0,0.10)",
                                    borderColor:
                                        "primary.main",
                                },
                            }}
                        >
                            <Box
                                sx={{
                                    position:
                                        "absolute",
                                    width: 100,
                                    height: 100,
                                    borderRadius:
                                        "50%",
                                    bgcolor:
                                        "primary.main",
                                    opacity: 0.08,
                                    right: -35,
                                    top: -35,
                                }}
                            />

                            <Avatar
                                sx={{
                                    width: 52,
                                    height: 52,
                                    bgcolor:
                                        "primary.main",
                                    mb: 2,
                                }}
                            >
                                <AutoAwesomeIcon />
                            </Avatar>

                            <Typography
                                variant="h6"
                                fontWeight={700}
                            >
                                AI Quiz Generator
                            </Typography>

                            <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{
                                    mt: 1,
                                    mb: 2.5,
                                    lineHeight: 1.6,
                                }}
                            >
                                Generate
                                multiple-choice
                                quizzes
                                automatically
                                using AI. Choose
                                the topic,
                                difficulty and
                                number of
                                questions.
                            </Typography>

                            <Button
                                variant="contained"
                                startIcon={
                                    <AutoAwesomeIcon />
                                }
                                onClick={() =>
                                    navigate(
                                        "/teacher/ai-quiz-generator"
                                    )
                                }
                                sx={{
                                    borderRadius: 2,
                                    textTransform:
                                        "none",
                                    fontWeight: 700,
                                    boxShadow:
                                        "none",
                                    "&:hover": {
                                        boxShadow:
                                            "none",
                                    },
                                }}
                            >
                                Generate Quiz
                            </Button>
                        </Paper>
                    </Grid>
                </Grid>
            </Box>

            {/* =====================================================
                LIVE CLASSES
            ===================================================== */}

            <Box
                sx={{
                    mb: {
                        xs: 4,
                        md: 5,
                    },
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        alignItems: {
                            xs: "flex-start",
                            md: "center",
                        },
                        justifyContent:
                            "space-between",
                        flexDirection: {
                            xs: "column",
                            md: "row",
                        },
                        gap: 2,
                        mb: 2.5,
                    }}
                >
                    <Box>
                        <Box
                            sx={{
                                display: "flex",
                                alignItems:
                                    "center",
                                gap: 1,
                            }}
                        >
                            <VideoCall
                                color="primary"
                            />

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
                                Live Classes
                            </Typography>
                        </Box>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                                mt: 0.5,
                            }}
                        >
                            Schedule, start and
                            manage your online
                            classes.
                        </Typography>
                    </Box>

                    <Button
                        variant="contained"
                        startIcon={<Add />}
                        onClick={() =>
                            navigate(
                                "/live-class/create"
                            )
                        }
                        sx={{
                            borderRadius: 2,
                            textTransform:
                                "none",
                            fontWeight: 700,
                            px: 2.5,
                            boxShadow: "none",
                            "&:hover": {
                                boxShadow:
                                    "none",
                            },
                        }}
                    >
                        Schedule Live Class
                    </Button>
                </Box>

                {liveClassError && (
                    <Alert
                        severity="warning"
                        sx={{
                            mb: 2,
                            borderRadius: 2,
                        }}
                    >
                        {liveClassError}
                    </Alert>
                )}

                {liveClassesLoading ? (
                    <Paper
                        elevation={0}
                        sx={{
                            minHeight: 220,
                            borderRadius: 3,
                            border: "1px solid",
                            borderColor:
                                "divider",
                            display: "flex",
                            justifyContent:
                                "center",
                            alignItems:
                                "center",
                        }}
                    >
                        <CircularProgress />
                    </Paper>
                ) : sortedLiveClasses.length ===
                    0 ? (
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
                            borderColor:
                                "divider",
                        }}
                    >
                        <Avatar
                            sx={{
                                width: 64,
                                height: 64,
                                mx: "auto",
                                mb: 2,
                                bgcolor:
                                    "primary.main",
                            }}
                        >
                            <VideoCall
                                sx={{
                                    fontSize: 32,
                                }}
                            />
                        </Avatar>

                        <Typography
                            variant="h6"
                            fontWeight={700}
                        >
                            No live classes yet
                        </Typography>

                        <Typography
                            color="text.secondary"
                            sx={{
                                mt: 0.8,
                                mb: 2.5,
                            }}
                        >
                            Schedule your first
                            live class and
                            start teaching
                            online.
                        </Typography>

                        <Button
                            variant="contained"
                            startIcon={<Add />}
                            onClick={() =>
                                navigate(
                                    "/live-class/create"
                                )
                            }
                            sx={{
                                textTransform:
                                    "none",
                                borderRadius: 2,
                                fontWeight: 600,
                            }}
                        >
                            Schedule Your First
                            Class
                        </Button>
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
                        {sortedLiveClasses.map(
                            (liveClass) => {
                                const status =
                                    getLiveClassStatus(
                                        liveClass
                                    );

                                const isStarting =
                                    actionLoading ===
                                    `start-${liveClass.id}`;

                                const isEnding =
                                    actionLoading ===
                                    `end-${liveClass.id}`;

                                return (
                                    <Grid
                                        key={
                                            liveClass.id
                                        }
                                        size={{
                                            xs: 12,
                                            md: 6,
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
                                                borderRadius: 3,
                                                overflow:
                                                    "hidden",
                                                border:
                                                    "1px solid",
                                                borderColor:
                                                    liveClass.isLive
                                                        ? "success.main"
                                                        : "divider",
                                                transition:
                                                    "all 0.25s ease",
                                                "&:hover":
                                                    {
                                                        transform:
                                                            "translateY(-4px)",
                                                        boxShadow:
                                                            "0 12px 30px rgba(0,0,0,0.10)",
                                                    },
                                            }}
                                        >
                                            {/* CARD HEADER */}

                                            <Box
                                                sx={{
                                                    p: 2.2,
                                                    background:
                                                        liveClass.isLive
                                                            ? "linear-gradient(135deg, rgba(46,125,50,0.12), rgba(76,175,80,0.04))"
                                                            : "linear-gradient(135deg, rgba(25,118,210,0.10), rgba(123,31,162,0.04))",
                                                }}
                                            >
                                                <Box
                                                    sx={{
                                                        display:
                                                            "flex",
                                                        justifyContent:
                                                            "space-between",
                                                        alignItems:
                                                            "flex-start",
                                                        gap: 1,
                                                    }}
                                                >
                                                    <Avatar
                                                        sx={{
                                                            width: 46,
                                                            height: 46,
                                                            bgcolor:
                                                                liveClass.isLive
                                                                    ? "success.main"
                                                                    : "primary.main",
                                                        }}
                                                    >
                                                        {liveClass.isLive ? (
                                                            <PlayCircle />
                                                        ) : (
                                                            <VideoCall />
                                                        )}
                                                    </Avatar>

                                                    <Chip
                                                        label={
                                                            status.label
                                                        }
                                                        color={
                                                            status.color
                                                        }
                                                        size="small"
                                                        sx={{
                                                            fontWeight: 700,
                                                        }}
                                                    />
                                                </Box>
                                            </Box>

                                            {/* CARD CONTENT */}

                                            <Box
                                                sx={{
                                                    p: 2.5,
                                                    display:
                                                        "flex",
                                                    flexDirection:
                                                        "column",
                                                    flexGrow: 1,
                                                }}
                                            >
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
                                                        liveClass.title
                                                    }
                                                </Typography>

                                                {liveClass.description && (
                                                    <Typography
                                                        variant="body2"
                                                        color="text.secondary"
                                                        sx={{
                                                            mt: 1,
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
                                                            liveClass.description
                                                        }
                                                    </Typography>
                                                )}

                                                <Divider
                                                    sx={{
                                                        my: 2,
                                                    }}
                                                />

                                                {/* COURSE */}

                                                <Box
                                                    sx={{
                                                        display:
                                                            "flex",
                                                        alignItems:
                                                            "center",
                                                        gap: 1.2,
                                                        mb: 1.3,
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
                                                        <MenuBook
                                                            sx={{
                                                                fontSize: 17,
                                                            }}
                                                        />
                                                    </Avatar>

                                                    <Box
                                                        sx={{
                                                            minWidth: 0,
                                                        }}
                                                    >
                                                        <Typography
                                                            variant="caption"
                                                            color="text.secondary"
                                                        >
                                                            Course
                                                        </Typography>

                                                        <Typography
                                                            variant="body2"
                                                            fontWeight={
                                                                600
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
                                                            {liveClass.course
                                                                ?.title ||
                                                                liveClass.courseTitle ||
                                                                `Course #${liveClass.courseId}`}
                                                        </Typography>
                                                    </Box>
                                                </Box>

                                                {/* DATE */}

                                                <Box
                                                    sx={{
                                                        display:
                                                            "flex",
                                                        alignItems:
                                                            "center",
                                                        gap: 1.2,
                                                        mb: 1.3,
                                                    }}
                                                >
                                                    <Avatar
                                                        sx={{
                                                            width: 32,
                                                            height: 32,
                                                            bgcolor:
                                                                "warning.main",
                                                        }}
                                                    >
                                                        <CalendarMonth
                                                            sx={{
                                                                fontSize: 17,
                                                            }}
                                                        />
                                                    </Avatar>

                                                    <Box>
                                                        <Typography
                                                            variant="caption"
                                                            color="text.secondary"
                                                        >
                                                            Scheduled
                                                        </Typography>

                                                        <Typography
                                                            variant="body2"
                                                            fontWeight={
                                                                600
                                                            }
                                                        >
                                                            {formatDateTime(
                                                                liveClass.scheduledAt
                                                            )}
                                                        </Typography>
                                                    </Box>
                                                </Box>

                                                {/* ACTIONS */}

                                                <Stack
                                                    direction={{
                                                        xs: "column",
                                                        sm: "row",
                                                    }}
                                                    spacing={1}
                                                    sx={{
                                                        mt: "auto",
                                                        pt: 1,
                                                    }}
                                                >
                                                    {liveClass.isLive && (
                                                        <>
                                                            <Button
                                                                variant="contained"
                                                                color="success"
                                                                fullWidth
                                                                startIcon={
                                                                    <OpenInNew />
                                                                }
                                                                onClick={() =>
                                                                    handleOpenLiveClass(
                                                                        liveClass.id
                                                                    )
                                                                }
                                                                sx={{
                                                                    borderRadius: 2,
                                                                    textTransform:
                                                                        "none",
                                                                    fontWeight:
                                                                        700,
                                                                    boxShadow:
                                                                        "none",
                                                                    "&:hover":
                                                                        {
                                                                            boxShadow:
                                                                                "none",
                                                                        },
                                                                }}
                                                            >
                                                                Open Classroom
                                                            </Button>

                                                            <Tooltip title="End live class">
                                                                <IconButton
                                                                    color="error"
                                                                    onClick={() =>
                                                                        handleEndLiveClass(
                                                                            liveClass.id
                                                                        )
                                                                    }
                                                                    disabled={
                                                                        isEnding
                                                                    }
                                                                    sx={{
                                                                        border:
                                                                            "1px solid",
                                                                        borderColor:
                                                                            "error.main",
                                                                        borderRadius: 2,
                                                                    }}
                                                                >
                                                                    {isEnding ? (
                                                                        <CircularProgress
                                                                            size={
                                                                                22
                                                                            }
                                                                            color="inherit"
                                                                        />
                                                                    ) : (
                                                                        <StopCircle />
                                                                    )}
                                                                </IconButton>
                                                            </Tooltip>
                                                        </>
                                                    )}

                                                    {!liveClass.isLive &&
                                                        !liveClass.isCompleted &&
                                                        !liveClass.isCancelled && (
                                                            <Button
                                                                variant="contained"
                                                                fullWidth
                                                                startIcon={
                                                                    isStarting ? (
                                                                        <CircularProgress
                                                                            size={
                                                                                18
                                                                            }
                                                                            color="inherit"
                                                                        />
                                                                    ) : (
                                                                        <PlayCircle />
                                                                    )
                                                                }
                                                                disabled={
                                                                    isStarting
                                                                }
                                                                onClick={() =>
                                                                    handleStartLiveClass(
                                                                        liveClass.id
                                                                    )
                                                                }
                                                                sx={{
                                                                    borderRadius: 2,
                                                                    textTransform:
                                                                        "none",
                                                                    fontWeight:
                                                                        700,
                                                                    boxShadow:
                                                                        "none",
                                                                    "&:hover":
                                                                        {
                                                                            boxShadow:
                                                                                "none",
                                                                        },
                                                                }}
                                                            >
                                                                {isStarting
                                                                    ? "Starting..."
                                                                    : "Start Class"}
                                                            </Button>
                                                        )}

                                                    {liveClass.isCompleted && (
                                                        <Button
                                                            variant="outlined"
                                                            fullWidth
                                                            startIcon={
                                                                <EventAvailable />
                                                            }
                                                            disabled
                                                            sx={{
                                                                borderRadius: 2,
                                                                textTransform:
                                                                    "none",
                                                                fontWeight:
                                                                    600,
                                                            }}
                                                        >
                                                            Class Completed
                                                        </Button>
                                                    )}

                                                    {liveClass.isCancelled && (
                                                        <Button
                                                            variant="outlined"
                                                            color="error"
                                                            fullWidth
                                                            disabled
                                                            sx={{
                                                                borderRadius: 2,
                                                                textTransform:
                                                                    "none",
                                                                fontWeight:
                                                                    600,
                                                            }}
                                                        >
                                                            Class Cancelled
                                                        </Button>
                                                    )}
                                                </Stack>
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
                            Manage and monitor
                            your courses
                        </Typography>
                    </Box>

                    <Chip
                        icon={<MenuBook />}
                        label={`${dashboard.totalCourses} Courses`}
                        color="primary"
                        variant="outlined"
                    />
                </Box>

                {dashboard.courses.length ===
                0 ? (
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
                            borderColor:
                                "divider",
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
                            Create a course to
                            see it here.
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
                                    course
                                        .students
                                        ?.length ||
                                    0;

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

                                                <Box
                                                    sx={{
                                                        display:
                                                            "flex",
                                                        flexDirection:
                                                            {
                                                                xs: "column",
                                                                sm: "row",
                                                            },
                                                        gap: 1,
                                                        mt: "auto",
                                                    }}
                                                >
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

            {dashboard.students.length ===
            0 ? (
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
                        borderColor:
                            "divider",
                    }}
                >
                    <People
                        sx={{
                            fontSize: 55,
                            color:
                                "text.secondary",
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
                                student.courses ||
                                [];

                            return (
                                <Grid
                                    key={
                                        student.id
                                    }
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