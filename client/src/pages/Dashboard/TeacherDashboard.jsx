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
} from "@mui/icons-material";

import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";

import {
    useCallback,
    useEffect,
    useState,
} from "react";

import { useNavigate } from "react-router-dom";

import {
    alpha,
    useTheme,
} from "@mui/material/styles";

import api from "../../services/api";

const TeacherDashboard = () => {
    const navigate = useNavigate();
    const theme = useTheme();

    // =========================================================
    // THEME
    // =========================================================

    const primary = theme.palette.primary.main;
    const success = theme.palette.success.main;
    const warning = theme.palette.warning.main;

    const paperBg = theme.palette.background.paper;
    const defaultBg = theme.palette.background.default;

    const cardShadow =
        theme.shadows[2];

    const cardHoverShadow =
        theme.shadows[8];

    // =========================================================
    // STATE
    // =========================================================

    const [dashboard, setDashboard] = useState({
        totalCourses: 0,
        totalStudents: 0,
        students: [],
        courses: [],
    });

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    // =========================================================
    // FETCH TEACHER DASHBOARD
    // =========================================================

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
            } catch (err) {
                console.error(
                    "Teacher dashboard error:",
                    err
                );

                setError(
                    err?.response?.data?.message ||
                    "Unable to load teacher dashboard."
                );
            } finally {
                setLoading(false);
            }
        },
        []
    );

    // =========================================================
    // INITIAL LOAD
    // =========================================================

    useEffect(() => {
        fetchTeacherDashboard();
    }, [
        fetchTeacherDashboard,
    ]);

    // =========================================================
    // TOTAL ENROLLMENTS
    // =========================================================

    const totalEnrollments =
        dashboard.courses.reduce(
            (total, course) =>
                total +
                (course.students?.length || 0),
            0
        );

    // =========================================================
    // COMMON CARD
    // =========================================================

    const commonCardSx = {
        bgcolor: "background.paper",
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 3,
        boxShadow: cardShadow,
        transition:
            "transform .2s ease, box-shadow .2s ease, border-color .2s ease",

        "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: cardHoverShadow,
            borderColor: alpha(
                primary,
                0.35
            ),
        },
    };

    // =========================================================
    // STAT CARDS
    // =========================================================

    const statCards = [
        {
            key: "courses",
            label: "My Courses",
            value: dashboard.totalCourses,
            subtitle: "Courses you teach",
            icon: <MenuBook />,
            color: primary,
        },
        {
            key: "students",
            label: "Total Students",
            value: dashboard.totalStudents,
            subtitle: "Currently enrolled",
            icon: <People />,
            color: success,
        },
        {
            key: "enrollments",
            label: "Enrollments",
            value: totalEnrollments,
            subtitle: "Total course enrollments",
            icon: <School />,
            color: warning,
        },
        {
            key: "results",
            label: "Exam Results",
            value: null,
            subtitle: "View student performance",
            icon: <Assessment />,
            color: primary,
            onClick: () =>
                navigate(
                    "/teacher/exam-results"
                ),
        },
    ];

    // =========================================================
    // MAIN UI
    // =========================================================

    return (
        <Box
            sx={{
                minHeight: "100%",
                bgcolor: defaultBg,
            }}
        >
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
                    HERO
                ===================================================== */}

                <Paper
                    elevation={0}
                    sx={{
                        position: "relative",
                        overflow: "hidden",
                        p: {
                            xs: 2.5,
                            sm: 3.5,
                            md: 4,
                        },
                        mb: {
                            xs: 3,
                            md: 4,
                        },
                        borderRadius: 4,
                        bgcolor: alpha(primary, 0.12),
                        border: "1px solid",
                        borderColor: "divider",
                        boxShadow: cardShadow,

                        "&::after": {
                            content: '""',
                            position: "absolute",
                            width: 180,
                            height: 180,
                            borderRadius: "50%",
                            right: -80,
                            top: -80,
                            bgcolor: alpha(
                                primary,
                                0.07
                            ),
                            pointerEvents: "none",
                        },
                    }}
                >
                    <Box
                        sx={{
                            position: "relative",
                            zIndex: 1,
                            display: "flex",
                            alignItems: {
                                xs: "flex-start",
                                md: "center",
                            },
                            justifyContent:
                                "space-between",
                            gap: 3,
                            flexDirection: {
                                xs: "column",
                                md: "row",
                            },
                        }}
                    >
                        <Box
                            sx={{
                                width: "100%",
                                position: "relative",
                            }}
                        >
                            {/* HEADER */}
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    gap: 2,
                                    pr: { xs: 1, sm: 2, md: 3 },
                                }}
                            >
                                {/* TEXT */}
                                <Box sx={{ minWidth: 0 }}>
                                    <Typography
                                        variant="overline"
                                        sx={{
                                            fontWeight: 800,
                                            color: theme.palette.primary.main,
                                            letterSpacing: 1.2,

                                            fontSize: {
                                                xs: "0.65rem",
                                                sm: "0.75rem",
                                            },

                                            lineHeight: 1.2
                                        }}>
                                        TEACHER PORTAL
                                    </Typography>

                                    <Typography
                                        variant="h4"
                                        sx={{
                                            fontWeight: 800,
                                            mt: 0.4,
                                            color: theme.palette.text.primary,

                                            fontSize: {
                                                xs: "1.35rem",
                                                sm: "2rem",
                                                md: "2.45rem",
                                            },

                                            lineHeight: 1.2,

                                            // Mobile par ek hi line
                                            whiteSpace: "nowrap",

                                            // Agar screen bahut chhoti ho
                                            overflow: "hidden",

                                            textOverflow: "ellipsis"
                                        }}>
                                        Teacher Dashboard
                                    </Typography>
                                </Box>

                                {/* ICON - RIGHT SIDE */}
                                <Box
                                    sx={{
                                        width: {
                                            xs: 48,
                                            sm: 56,
                                            md: 64,
                                        },
                                        height: {
                                            xs: 48,
                                            sm: 56,
                                            md: 64,
                                        },
                                        minWidth: {
                                            xs: 48,
                                            sm: 56,
                                            md: 64,
                                        },

                                        borderRadius: {
                                            xs: "14px",
                                            sm: "16px",
                                        },

                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",

                                        backgroundColor:
                                            `${theme.palette.primary.main}14`,

                                        color:
                                            theme.palette.primary.main,

                                        border:
                                            `1px solid ${theme.palette.primary.main}25`,
                                    }}
                                >
                                    <School
                                        sx={{
                                            fontSize: {
                                                xs: 25,
                                                sm: 30,
                                                md: 34,
                                            },
                                        }}
                                    />
                                </Box>
                            </Box>

                            {/* DESCRIPTION */}
                            <Typography
                                sx={{
                                    mt: 1,

                                    maxWidth: 650,

                                    lineHeight: 1,

                                    color:
                                        theme.palette.text.secondary,

                                    fontSize: {
                                        xs: "0.82rem",
                                        sm: "0.95rem",
                                    },
                                }}
                            >
                                Manage your courses, students and exams
                                from one place.
                            </Typography>
                        </Box>


                    </Box>
                </Paper>

                {loading ? (
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            py: 10,
                        }}
                    >
                        <CircularProgress />
                    </Box>
                ) : error ? (
                    <Alert
                        severity="error"
                        sx={{
                            borderRadius: 2,
                        }}
                    >
                        {error}
                    </Alert>
                ) : (
                <>

                {/* =====================================================
                    OVERVIEW
                ===================================================== */}

                <Box sx={{ mb: 5 }}>
                    <Box sx={{ mb: 2.5 }}>
                        <Typography
                            variant="h5"
                            sx={{
                                fontWeight: 800
                            }}
                        >
                            Overview
                        </Typography>

                        <Typography
                            variant="body2"
                            sx={{
                                color: "text.secondary",
                                mt: 0.5
                            }}>
                            A quick snapshot of your
                            teaching activity.
                        </Typography>
                    </Box>

                    <Grid
                        container
                        spacing={{
                            xs: 2,
                            sm: 2.5,
                            md: 3,
                        }}
                    >
                        {statCards.map(
                            (card) => (
                                <Grid
                                    key={card.key}
                                    size={{
                                        xs: 12,
                                        sm: 6,
                                        lg: 3,
                                    }}
                                >
                                    <Paper
                                        elevation={0}
                                        onClick={
                                            card.onClick
                                        }
                                        sx={{
                                            position:
                                                "relative",
                                            p: {
                                                xs: 2.5,
                                                sm: 3,
                                            },
                                            minHeight: 160,
                                            height: "100%",
                                            overflow:
                                                "hidden",
                                            bgcolor:
                                                "background.paper",
                                            border: "1px solid",

                                            borderColor: "divider",

                                            borderRadius: 3,
                                            cursor: "pointer",

                                            transition:
                                                "transform .2s ease, box-shadow .2s ease, border-color .2s ease",

                                            "&::before":
                                            {
                                                content:
                                                    '""',
                                                position:
                                                    "absolute",
                                                top: 0,
                                                left: 0,
                                                right: 0,
                                                height: 3,
                                                bgcolor:
                                                    card.color,
                                            },

                                            "&:hover":

                                            {
                                                transform:
                                                    "translateY(-4px)",
                                                boxShadow:
                                                    cardHoverShadow,
                                                borderColor:
                                                    alpha(
                                                        card.color,
                                                        0.45
                                                    ),
                                            }

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
                                                gap: 2,
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    minWidth: 0,
                                                }}
                                            >
                                                <Typography
                                                    variant="body2"
                                                    sx={{
                                                        color: "text.secondary",
                                                        fontWeight: 700
                                                    }}>
                                                    {
                                                        card.label
                                                    }
                                                </Typography>

                                                {card.value !==
                                                    null ? (
                                                    <Typography
                                                        variant="h4"
                                                        sx={{
                                                            fontWeight: 800,
                                                            mt: 0.7
                                                        }}>
                                                        {
                                                            card.value
                                                        }
                                                    </Typography>
                                                ) : (
                                                    <Typography
                                                        variant="body2"
                                                        sx={{
                                                            color: "text.secondary",
                                                            mt: 1,

                                                            lineHeight:
                                                                1.5
                                                        }}>
                                                        {
                                                            card.subtitle
                                                        }
                                                    </Typography>
                                                )}

                                                {card.value !==
                                                    null && (
                                                        <Typography
                                                            variant="caption"
                                                            sx={{
                                                                color: "text.secondary"
                                                            }}
                                                        >
                                                            {
                                                                card.subtitle
                                                            }
                                                        </Typography>
                                                    )}
                                            </Box>

                                            <Avatar
                                                sx={{
                                                    width: 52,
                                                    height: 52,
                                                    flexShrink: 0,
                                                    bgcolor:
                                                        alpha(
                                                            card.color,
                                                            0.12
                                                        ),
                                                    color:
                                                        card.color,
                                                }}
                                            >
                                                {
                                                    card.icon
                                                }
                                            </Avatar>
                                        </Box>

                                        {card.onClick && (
                                            <Button
                                                size="small"
                                                endIcon={
                                                    <ArrowForward />
                                                }
                                                sx={{
                                                    mt: 1.5,
                                                    p: 0,
                                                    textTransform:
                                                        "none",
                                                    fontWeight: 700,
                                                    color:
                                                        card.color,
                                                    "&:hover":
                                                    {
                                                        bgcolor: "transparent",

                                                    },
                                                }}
                                            >
                                                View Results
                                            </Button>
                                        )}
                                    </Paper>
                                </Grid>
                            )
                        )}
                    </Grid>
                </Box>

                {/* =====================================================
                    AI TOOLS
                ===================================================== */}

                <Box sx={{ mb: 5 }}>
                    <Box sx={{ mb: 2.5 }}>
                        <Box
                            sx={{
                                display: "flex",
                                alignItems:
                                    "center",
                                gap: 1,
                            }}
                        >
                            <Avatar
                                sx={{
                                    width: 38,
                                    height: 38,
                                    bgcolor: alpha(
                                        primary,
                                        0.12
                                    ),
                                    color: primary,
                                }}
                            >
                                <AutoAwesomeIcon
                                    fontSize="small"
                                />
                            </Avatar>

                            <Box>
                                <Typography
                                    variant="h5"
                                    sx={{
                                        fontWeight: 800
                                    }}
                                >
                                    AI Teaching Tools
                                </Typography>

                                <Typography
                                    variant="body2"
                                    sx={{
                                        color: "text.secondary"
                                    }}
                                >
                                    Create learning
                                    material faster
                                    with AI.
                                </Typography>
                            </Box>
                        </Box>
                    </Box>

                    <Grid container spacing={3}>
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
                                    ...commonCardSx,
                                    p: 3,
                                    height: "100%",
                                }}
                            >
                                <Avatar
                                    sx={{
                                        width: 54,
                                        height: 54,
                                        bgcolor:
                                            alpha(
                                                primary,
                                                0.12
                                            ),
                                        color: primary,
                                        mb: 2,
                                    }}
                                >
                                    <AutoAwesomeIcon />
                                </Avatar>

                                <Typography
                                    variant="h6"
                                    sx={{
                                        fontWeight: 800
                                    }}
                                >
                                    AI Quiz Generator
                                </Typography>

                                <Typography
                                    variant="body2"
                                    sx={{
                                        color: "text.secondary",
                                        mt: 1,
                                        mb: 2.5,
                                        lineHeight: 1.7
                                    }}>
                                    Generate
                                    multiple-choice
                                    quizzes
                                    automatically
                                    using AI. Choose
                                    topic, difficulty
                                    and number of
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
                                        boxShadow: "none",
                                    }}
                                >
                                    Generate Quiz
                                </Button>
                            </Paper>
                        </Grid>
                    </Grid>
                </Box>

                {/* =====================================================
                    MY COURSES
                ===================================================== */}

                <Box sx={{ mb: 5 }}>
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent:
                                "space-between",
                            alignItems: {
                                xs: "flex-start",
                                sm: "center",
                            },
                            flexDirection: {
                                xs: "column",
                                sm: "row",
                            },
                            gap: 2,
                            mb: 2.5,
                        }}
                    >
                        <Box>
                            <Typography
                                variant="h5"
                                sx={{
                                    fontWeight: 800
                                }}
                            >
                                My Courses
                            </Typography>

                            <Typography
                                variant="body2"
                                sx={{
                                    color: "text.secondary",
                                    mt: 0.5
                                }}>
                                Manage and monitor
                                your courses.
                            </Typography>
                        </Box>

                        <Chip
                            icon={<MenuBook />}
                            label={`${dashboard.totalCourses} Courses`}
                            color="primary"
                            variant="outlined"
                            sx={{
                                fontWeight: 700,
                            }}
                        />
                    </Box>

                    {dashboard.courses.length ===
                        0 ? (
                        <Paper
                            elevation={0}
                            sx={{
                                ...commonCardSx,
                                p: {
                                    xs: 3,
                                    sm: 5,
                                },
                                textAlign: "center",
                            }}
                        >
                            <Avatar
                                sx={{
                                    width: 70,
                                    height: 70,
                                    mx: "auto",
                                    mb: 2,
                                    bgcolor:
                                        alpha(
                                            primary,
                                            0.1
                                        ),
                                    color: primary,
                                }}
                            >
                                <MenuBook />
                            </Avatar>

                            <Typography
                                variant="h6"
                                sx={{
                                    fontWeight: 800
                                }}
                            >
                                No courses created
                                yet
                            </Typography>

                            <Typography
                                sx={{
                                    color: "text.secondary",
                                    mt: 1
                                }}>
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
                                                elevation={
                                                    0
                                                }
                                                sx={{
                                                    ...commonCardSx,
                                                    height: "100%",
                                                    overflow:
                                                        "hidden",
                                                    display:
                                                        "flex",
                                                    flexDirection:
                                                        "column",
                                                }}
                                            >
                                                {/* COURSE IMAGE */}

                                                <Box
                                                    sx={{
                                                        height: {
                                                            xs: 170,
                                                            sm: 190,
                                                        },
                                                        position:
                                                            "relative",
                                                        overflow:
                                                            "hidden",
                                                        bgcolor:
                                                            alpha(
                                                                primary,
                                                                0.08
                                                            ),
                                                    }}
                                                >
                                                    {course.thumbnail ? (
                                                        <Box
                                                            component="img"
                                                            src={
                                                                course.thumbnail
                                                            }
                                                            alt={
                                                                course.title ||
                                                                "Course"
                                                            }
                                                            sx={{
                                                                width: "100%",
                                                                height: "100%",
                                                                objectFit:
                                                                    "cover",
                                                                transition:
                                                                    "transform .3s ease",
                                                                "&:hover":
                                                                {
                                                                    transform:
                                                                        "scale(1.04)",
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
                                                                fontSize: 65,
                                                                color: primary,
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
                                                                bgcolor:
                                                                    alpha(
                                                                        paperBg,
                                                                        0.9
                                                                    ),
                                                                backdropFilter:
                                                                    "blur(8px)",
                                                                fontWeight:
                                                                    700,
                                                            }}
                                                        />
                                                    )}
                                                </Box>

                                                {/* COURSE CONTENT */}

                                                <Box
                                                    sx={{
                                                        p: 2,
                                                        display:
                                                            "flex",
                                                        flexDirection:
                                                            "column",
                                                        flexGrow: 1,
                                                    }}
                                                >
                                                    <Typography
                                                        variant="h6"
                                                        sx={{
                                                            fontWeight: 800,

                                                            display:
                                                                "-webkit-box",

                                                            WebkitLineClamp: 2,

                                                            WebkitBoxOrient:
                                                                "vertical",

                                                            overflow:
                                                                "hidden",

                                                            minHeight: 7
                                                        }}>
                                                        {
                                                            course.title
                                                        }
                                                    </Typography>

                                                    <Typography
                                                        variant="body2"
                                                        sx={{
                                                            color: "text.secondary",
                                                            mt: 1,
                                                            lineHeight: 1.6,

                                                            display:
                                                                "-webkit-box",

                                                            WebkitLineClamp: 2,

                                                            WebkitBoxOrient:
                                                                "vertical",

                                                            overflow:
                                                                "hidden",

                                                            minHeight: 32
                                                        }}>
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
                                                            mt: 1,
                                                        }}
                                                    >
                                                        <Avatar
                                                            sx={{
                                                                width: 36,
                                                                height: 36,
                                                                bgcolor:
                                                                    alpha(
                                                                        success,
                                                                        0.1
                                                                    ),
                                                                color: success,
                                                            }}
                                                        >
                                                            <People
                                                                sx={{
                                                                    fontSize: 19,
                                                                }}
                                                            />
                                                        </Avatar>

                                                        <Box>
                                                            <Typography
                                                                variant="body2"
                                                                sx={{
                                                                    fontWeight: 800
                                                                }}
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
                                                                sx={{
                                                                    color: "text.secondary"
                                                                }}
                                                            >
                                                                Enrolled
                                                                learners
                                                            </Typography>
                                                        </Box>
                                                    </Box>

                                                    <Divider
                                                        sx={{
                                                            my: 1,
                                                        }}
                                                    />

                                                    <Box
                                                        sx={{
                                                            display:
                                                                "grid",
                                                            gridTemplateColumns:
                                                            {
                                                                xs: "1fr",
                                                                sm: "1fr 1fr",
                                                            },
                                                            gap: 1,
                                                            mt: "auto",
                                                        }}
                                                    >
                                                        <Button
                                                            variant="outlined"
                                                            size="small"
                                                            startIcon={
                                                                <Visibility />
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
                                                                fontWeight: 700,
                                                            }}
                                                        >
                                                            View
                                                        </Button>

                                                        <Button
                                                            variant="contained"
                                                            size="small"
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
                                                                fontWeight: 700,
                                                                boxShadow:
                                                                    "none",
                                                            }}
                                                        >
                                                            Manage
                                                        </Button>

                                                        <Button
                                                            variant="text"
                                                            size="small"
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
                                                                fontWeight: 700,
                                                                gridColumn:
                                                                {
                                                                    xs: "auto",
                                                                    sm: "1 / -1",
                                                                },
                                                            }}
                                                        >
                                                            Edit
                                                            Course
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

                <Box sx={{ mb: 3 }}>
                    <Box sx={{ mb: 2.5 }}>
                        <Typography
                            variant="h5"
                            sx={{
                                fontWeight: 800
                            }}
                        >
                            My Students
                        </Typography>

                        <Typography
                            variant="body2"
                            sx={{
                                color: "text.secondary",
                                mt: 0.5
                            }}>
                            View your enrolled
                            students and their
                            courses.
                        </Typography>
                    </Box>

                    {dashboard.students.length ===
                        0 ? (
                        <Paper
                            elevation={0}
                            sx={{
                                ...commonCardSx,
                                p: {
                                    xs: 3,
                                    sm: 5,
                                },
                                textAlign: "center",
                            }}
                        >
                            <Avatar
                                sx={{
                                    width: 70,
                                    height: 70,
                                    mx: "auto",
                                    mb: 2,
                                    bgcolor:
                                        alpha(
                                            primary,
                                            0.1
                                        ),
                                    color: primary,
                                }}
                            >
                                <People />
                            </Avatar>

                            <Typography
                                variant="h6"
                                sx={{
                                    fontWeight: 800
                                }}
                            >
                                No students enrolled
                                yet
                            </Typography>

                            <Typography
                                variant="body2"
                                sx={{
                                    color: "text.secondary",
                                    mt: 1
                                }}>
                                Students will appear
                                here when they enroll
                                in your courses.
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

                                    const studentName =
                                        student.name ||
                                        "Student";

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
                                                elevation={
                                                    0
                                                }
                                                sx={{
                                                    ...commonCardSx,
                                                    p: 2.5,
                                                    height: "100%",
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
                                                            width: 52,
                                                            height: 52,
                                                            bgcolor:
                                                                alpha(
                                                                    primary,
                                                                    0.12
                                                                ),
                                                            color: primary,
                                                            fontWeight: 800,
                                                        }}
                                                    >
                                                        {studentName
                                                            .charAt(
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
                                                            noWrap
                                                            sx={{
                                                                fontWeight: 800
                                                            }}
                                                        >
                                                            {
                                                                studentName
                                                            }
                                                        </Typography>

                                                        <Typography
                                                            variant="body2"
                                                            sx={{
                                                                color: "text.secondary"
                                                            }}
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

                                                {courses.length ===
                                                    0 ? (
                                                    <Typography
                                                        variant="body2"
                                                        sx={{
                                                            color: "text.secondary"
                                                        }}
                                                    >
                                                        No
                                                        courses
                                                        assigned.
                                                    </Typography>
                                                ) : (
                                                    <Stack
                                                        spacing={
                                                            1
                                                        }
                                                    >
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
                                                                        minWidth: 0,
                                                                        p: 1,
                                                                        borderRadius: 1.5,
                                                                        bgcolor:
                                                                            alpha(
                                                                                primary,
                                                                                0.04
                                                                            ),
                                                                    }}
                                                                >
                                                                    <Person
                                                                        fontSize="small"
                                                                        sx={{
                                                                            color: primary,
                                                                            flexShrink: 0,
                                                                        }}
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
                                                                            fontWeight:
                                                                                600,
                                                                        }}
                                                                    >
                                                                        {
                                                                            course.title
                                                                        }
                                                                    </Typography>
                                                                </Box>
                                                            )
                                                        )}
                                                    </Stack>
                                                )}
                                            </Paper>
                                        </Grid>
                                    );
                                }
                            )}
                        </Grid>
                    )}
                </Box>

                </>
                )}
            </Container>
        </Box>
    );
};

export default TeacherDashboard;
