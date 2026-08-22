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
    CircularProgress,
    Alert,
} from "@mui/material";

import {
    School,
    SchoolOutlined,
    PlayCircle,
    CheckCircle,
    EmojiEvents,
    ArrowForward,
    AccessTime,
    VideoCameraFront,
    LiveTv,
    ExpandMore,
    ExpandLess,
} from "@mui/icons-material";

import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getMyCourses } from "../../services/enrollmentService";  

import { getStudentLiveClasses,} from "../../services/liveClassService";

// ======================================================
// HOW MANY LIVE CLASS CARDS TO SHOW BEFORE "SHOW ALL"
// ======================================================
const LIVE_CLASSES_VISIBLE_LIMIT = 6;  

const StudentDashboard = () => {
    const navigate = useNavigate();

    // =====================================================
    // USER
    // =====================================================

    const [user, setUser] = useState(null);

    // =====================================================
    // COURSES
    // =====================================================

    const [myCourses, setMyCourses] = useState([]);
    const [loadingCourses, setLoadingCourses] = useState(true);
    const [coursesError, setCoursesError] = useState("");

    // =====================================================
    // LIVE CLASSES
    // =====================================================

    const [liveClasses, setLiveClasses] = useState([]);
    const [loadingLiveClasses, setLoadingLiveClasses] = useState(true);
    const [liveClassError, setLiveClassError] = useState("");

    const [showAllLiveClasses, setShowAllLiveClasses] =
        useState(false);

    // =====================================================
    // GET USER
    // =====================================================

    useEffect(() => {
        const storedUser = localStorage.getItem("user");

        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (error) {
                console.error("User data error:", error);
            }
        }
    }, []);

    // =====================================================
    // FETCH MY COURSES
    // =====================================================

    useEffect(() => {
        fetchMyCourses();
    }, []);

    const fetchMyCourses = async () => {
        try {
            setLoadingCourses(true);
            setCoursesError("");

            const response = await getMyCourses();

            console.log("Student Courses:", response.data);

            const coursesData = Array.isArray(response.data)
                ? response.data
                : Array.isArray(response.data?.data)
                ? response.data.data
                : [];

            setMyCourses(coursesData);
        } catch (error) {
            console.error("Dashboard courses error:", error);

            setCoursesError(
                error.response?.data?.message ||
                    "Unable to load your courses."
            );
        } finally {
            setLoadingCourses(false);
        }
    };

    // =====================================================
    // FETCH LIVE CLASSES
    // =====================================================

    useEffect(() => {
        fetchLiveClasses();
    }, []);

    const fetchLiveClasses = async () => {
        try {
            setLoadingLiveClasses(true);
            setLiveClassError("");

            const response = await getStudentLiveClasses();

            console.log("Student Live Classes:", response.data);

            const data = Array.isArray(response.data)
                ? response.data
                : Array.isArray(response.data?.data)
                ? response.data.data
                : [];

            setLiveClasses(data);
        } catch (error) {
            console.error("Live classes error:", error);

            setLiveClassError(
                error.response?.data?.message ||
                    "Unable to load live classes."
            );
        } finally {
            setLoadingLiveClasses(false);
        }
    };

    // =====================================================
    // USER NAME
    // =====================================================

    const userName = user?.name || "Student";

    // =====================================================
    // STATS
    // =====================================================

    const enrolledCount = myCourses.length;

    const completedCount = myCourses.filter(
        (item) => item.completed === true
    ).length;

    const certificateCount = 0;

    // =====================================================
    // OVERALL PROGRESS
    // =====================================================

    const overallProgress =
        myCourses.length > 0
            ? Math.round(
                  myCourses.reduce(
                      (total, item) =>
                          total + Number(item.progress || 0),
                      0
                  ) / myCourses.length
              )
            : 0;

    // =====================================================
    // STATS DATA
    // =====================================================

    const stats = [
        {
            key: "enrolled",
            title: "Enrolled Courses",
            value: enrolledCount,
            icon: <PlayCircle />,
            color: "primary.main",
            bg: "action.hover",
        },
        {
            key: "completed",
            title: "Completed",
            value: completedCount,
            icon: <CheckCircle />,
            color: "success.main",
            bg: "action.hover",
        },
        {
            key: "certificates",
            title: "Certificates",
            value: certificateCount,
            icon: <EmojiEvents />,
            color: "warning.main",
            bg: "action.hover",
        },
    ];

    // =====================================================
    // VISIBLE LIVE CLASSES
    // =====================================================

    const visibleLiveClasses = useMemo(() => {
        return showAllLiveClasses
            ? liveClasses
            : liveClasses.slice(
                  0,
                  LIVE_CLASSES_VISIBLE_LIMIT
              );
    }, [liveClasses, showAllLiveClasses]);

    const hasMoreLiveClasses =
        liveClasses.length > LIVE_CLASSES_VISIBLE_LIMIT;

    useEffect(() => {
        if (!hasMoreLiveClasses && showAllLiveClasses) {
            setShowAllLiveClasses(false);
        }
    }, [hasMoreLiveClasses, showAllLiveClasses]);

    // =====================================================
    // RENDER
    // =====================================================

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
            {/* =================================================
                WELCOME SECTION
            ================================================= */}

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

                    bgcolor: "background.paper",
                    color: "text.primary",

                    border: "1px solid",
                    borderColor: "divider",

                    position: "relative",
                    overflow: "hidden",

                    background:
                        "linear-gradient(135deg, rgba(11,79,138,0.08), rgba(18,59,93,0.03))",
                }}
            >
                <Box
                    sx={{
                        position: "relative",
                        zIndex: 1,
                    }}
                >
                    <Chip
                        label="STUDENT"
                        variant="outlined"
                        sx={{
                            mb: 2,
                            color: "primary.main",
                            borderColor: "primary.main",
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
                            color: "text.primary",
                        }}
                    >
                        Welcome back, {userName} 👋
                    </Typography>

                    <Typography
                        variant="h6"
                        sx={{
                            mt: 1.5,
                            color: "text.secondary",
                            maxWidth: 650,
                            fontWeight: 400,
                            fontSize: {
                                xs: "1rem",
                                md: "1.25rem",
                            },
                        }}
                    >
                        Continue your learning journey and
                        build your skills with LearnHub.
                    </Typography>

                    <Button
                        variant="contained"
                        onClick={() => navigate("/courses")} 
                        endIcon={<ArrowForward />}  
                        sx={{
                            mt: 3,
                            borderRadius: 2,
                            textTransform: "none",
                            fontWeight: 700,
                        }}
                    >
                        Explore Courses
                    </Button>
                </Box>
            </Paper>

            {/* =================================================
                STATISTICS
            ================================================= */}

            <Typography
                variant="h5"
                fontWeight={700}
                sx={{
                    mb: 2.5,
                    color: "text.primary",
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
                        key={stat.key}
                        size={{
                            xs: 12,
                            sm: 6,
                            md: 4,
                        }}
                    >
                        <Paper
                            elevation={0}
                            sx={{
                                position: "relative",
                                p: 3,
                                height: "100%",
                                minHeight: 145,

                                bgcolor: "background.paper",

                                border: "1px solid",
                                borderColor: "divider",
                                borderRadius: 3,

                                overflow: "hidden",

                                transition:
                                    "transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease",

                                "&::before": {
                                    content: '""',
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                    width: "100%",
                                    height: "3px",
                                    bgcolor: stat.color,
                                },

                                "&:hover": {
                                    transform:
                                        "translateY(-3px)",
                                    borderColor: stat.color,
                                    boxShadow:
                                        "0 12px 30px rgba(0,0,0,0.10)",
                                },
                            }}
                        >
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent:
                                        "space-between",
                                    height: "100%",
                                }}
                            >
                                <Box>
                                    <Typography
                                        sx={{
                                            fontSize:
                                                "0.875rem",
                                            fontWeight: 600,
                                            color: "text.secondary",
                                            mb: 1,
                                        }}
                                    >
                                        {stat.title}
                                    </Typography>

                                    <Typography
                                        sx={{
                                            fontSize: "2rem",
                                            lineHeight: 1,
                                            fontWeight: 750,
                                            color: "text.primary",
                                            letterSpacing:
                                                "-0.03em",
                                        }}
                                    >
                                        {stat.value}
                                    </Typography>

                                    <Typography
                                        sx={{
                                            mt: 1.2,
                                            fontSize:
                                                "0.75rem",
                                            fontWeight: 500,
                                            color: "text.disabled",
                                        }}
                                    >
                                        {stat.key === "enrolled"
                                            ? "Currently enrolled"
                                            : stat.key ===
                                              "completed"
                                            ? "Courses completed"
                                            : "Certificates earned"}
                                    </Typography>
                                </Box>

                                <Avatar
                                    variant="rounded"
                                    sx={{
                                        width: 52,
                                        height: 52,
                                        borderRadius: 2,

                                        bgcolor:
                                            "action.hover",
                                        color: stat.color,

                                        "& svg": {
                                            fontSize: 26,
                                        },
                                    }}
                                >
                                    {stat.icon}
                                </Avatar>
                            </Box>
                        </Paper>
                    </Grid>
                ))}
            </Grid>

            {/* =================================================
                LIVE CLASSES
            ================================================= */}

            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 2.5,
                    gap: 2,
                    flexWrap: "wrap",
                }}
            >
                <Box>
                    <Typography
                        variant="h5"
                        fontWeight={700}
                    >
                        Live Classes
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 0.5 }}
                    >
                        Join your teacher's live classes
                    </Typography>
                </Box>

                {!loadingLiveClasses &&
                    liveClasses.length > 0 && (
                        <Chip
                            icon={<LiveTv />}
                            label={`${liveClasses.length} Available`}
                            color="error"
                            variant="outlined"
                        />
                    )}
            </Box>

            {/* LIVE CLASS LOADING */}

            {loadingLiveClasses && (
                <Paper
                    elevation={0}
                    sx={{
                        p: 5,
                        mb: 5,
                        borderRadius: 3,
                        border: "1px solid",
                        borderColor: "divider",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        bgcolor: "background.paper",
                    }}
                >
                    <CircularProgress />
                </Paper>
            )}

            {/* LIVE CLASS ERROR */}

            {!loadingLiveClasses && liveClassError && (
                <Alert
                    severity="error"
                    sx={{
                        mb: 5,
                        borderRadius: 2,
                    }}
                >
                    {liveClassError}
                </Alert>
            )}

            {/* NO LIVE CLASSES */}

            {!loadingLiveClasses &&
                !liveClassError &&
                liveClasses.length === 0 && (
                    <Paper
                        elevation={0}
                        sx={{
                            p: 4,
                            mb: 5,
                            borderRadius: 3,
                            border: "1px solid",
                            borderColor: "divider",
                            textAlign: "center",
                            bgcolor: "background.paper",
                        }}
                    >
                        <VideoCameraFront
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
                            No live classes available
                        </Typography>

                        <Typography
                            color="text.secondary"
                            sx={{ mt: 1 }}
                        >
                            Your teacher's live classes
                            will appear here.
                        </Typography>
                    </Paper>
                )}

            {/* LIVE CLASS CARDS */}

            {!loadingLiveClasses &&
                !liveClassError &&
                liveClasses.length > 0 && (
                    <>
                        <Grid
                            container
                            spacing={3}
                            sx={{
                                mb: hasMoreLiveClasses
                                    ? 2
                                    : 5,
                            }}
                        >
                            {visibleLiveClasses.map(
                                (liveClass, index) => (
                                    <Grid
                                        key={
                                            liveClass.id ??
                                            `live-class-${index}`
                                        }
                                        size={{
                                            xs: 12,
                                            md: 6,
                                        }}
                                    >
                                        <Paper
                                            elevation={0} 
                                            sx={{
                                                p: 3,
                                                height: "100%",
                                                borderRadius: 3,
                                                border:
                                                    "1px solid",
                                                borderColor:
                                                    liveClass.isLive
                                                        ? "error.main"
                                                        : "divider",

                                                bgcolor:
                                                    "background.paper",

                                                background:
                                                    "linear-gradient(135deg, rgba(25,118,210,0.06), rgba(123,31,162,0.05))",

                                                transition:
                                                    "transform 0.2s ease, box-shadow 0.2s ease",

                                                "&:hover": {
                                                    transform:
                                                        "translateY(-4px)",
                                                    boxShadow:
                                                        "0 10px 30px rgba(0,0,0,0.08)",
                                                },
                                            }}
                                        >
                                            {/* HEADER */}

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
                                                        display:
                                                            "flex",
                                                        gap: 2,
                                                        alignItems:
                                                            "center",
                                                        minWidth: 0,
                                                    }}
                                                >
                                                    <Avatar
                                                        sx={{
                                                            width: 56,
                                                            height: 56,
                                                            flexShrink: 0,
                                                            bgcolor:
                                                                liveClass.isLive
                                                                    ? "error.main"
                                                                    : "primary.main",
                                                        }}
                                                    >
                                                        <VideoCameraFront />
                                                    </Avatar>

                                                    <Box
                                                        sx={{
                                                            minWidth:
                                                                0,
                                                        }}
                                                    >
                                                        <Typography
                                                            variant="h6"
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
                                                                liveClass.title
                                                            }
                                                        </Typography>

                                                        <Typography
                                                            variant="body2"
                                                            color="text.secondary"
                                                        >
                                                            Course
                                                            ID:{" "}
                                                            {
                                                                liveClass.courseId
                                                            }
                                                        </Typography>

                                                        {liveClass.teacherName && (
                                                            <Typography
                                                                variant="body2"
                                                                color="text.secondary"
                                                            >
                                                                Teacher:{" "}
                                                                {
                                                                    liveClass.teacherName
                                                                }
                                                            </Typography>
                                                        )}
                                                    </Box>
                                                </Box>

                                                <Chip
                                                    icon={
                                                        <LiveTv />
                                                    }
                                                    label={
                                                        liveClass.isLive
                                                            ? "LIVE NOW"
                                                            : "UPCOMING"
                                                    }
                                                    color={
                                                        liveClass.isLive
                                                            ? "error"
                                                            : "warning"
                                                    }
                                                    size="small"
                                                    sx={{
                                                        flexShrink: 0,
                                                    }}
                                                />
                                            </Box>

                                            {/* DESCRIPTION */}

                                            {liveClass.description && (
                                                <Typography
                                                    variant="body2"
                                                    color="text.secondary"
                                                    sx={{
                                                        mt: 2,
                                                    }}
                                                >
                                                    {
                                                        liveClass.description
                                                    }
                                                </Typography>
                                            )}

                                            {/* SCHEDULE */}

                                            <Box
                                                sx={{
                                                    mt: 2,
                                                    p: 2,
                                                    borderRadius: 2,
                                                    bgcolor:
                                                        "background.default",
                                                    border:
                                                        "1px solid",
                                                    borderColor:
                                                        "divider",
                                                }}
                                            >
                                                <Typography
                                                    variant="body2"
                                                    color="text.secondary"
                                                >
                                                    <strong>
                                                        Scheduled:
                                                    </strong>{" "}
                                                    {liveClass.scheduledAt
                                                        ? new Date(
                                                              liveClass.scheduledAt
                                                          ).toLocaleString()
                                                        : "Not specified"}
                                                </Typography>
                                            </Box>

                                            {/* JOIN BUTTON */}

                                            <Button
                                                fullWidth
                                                variant="contained"
                                                color={
                                                    liveClass.isLive
                                                        ? "error"
                                                        : "primary"
                                                }
                                                startIcon={
                                                    <VideoCameraFront />
                                                }
                                                disabled={
                                                    !liveClass.isLive
                                                }
                                                onClick={() =>
                                                    navigate(
                                                        `/live-class/${liveClass.id}`
                                                    )
                                                }
                                                sx={{
                                                    mt: 2.5,
                                                    py: 1.25,
                                                    borderRadius: 2,
                                                    fontWeight: 700,
                                                    textTransform:
                                                        "none",
                                                }}
                                            >
                                                {liveClass.isLive
                                                    ? "Join Live Class"
                                                    : "Waiting for Teacher"}
                                            </Button>
                                        </Paper>
                                    </Grid>
                                )
                            )}
                        </Grid>

                        {/* SHOW ALL */}

                        {hasMoreLiveClasses && (
                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent:
                                        "center",
                                    mb: 5,
                                }}
                            >
                                <Button
                                    variant="outlined"
                                    onClick={() =>
                                        setShowAllLiveClasses(
                                            (prev) => !prev
                                        )
                                    }
                                    endIcon={
                                        showAllLiveClasses ? (
                                            <ExpandLess />
                                        ) : (
                                            <ExpandMore />
                                        )
                                    }
                                    sx={{
                                        borderRadius: 2,
                                        textTransform:
                                            "none",
                                        fontWeight: 700,
                                        px: 3,
                                    }}
                                >
                                    {showAllLiveClasses
                                        ? "Show Less"
                                        : `Show All (${liveClasses.length})`}
                                </Button>
                            </Box>
                        )}
                    </>
                )}

            {/* =================================================
                MY COURSES
            ================================================= */}

            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
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
                    onClick={() => navigate("/courses")}
                    sx={{
                        textTransform: "none",
                    }}
                >
                    View All
                </Button>
            </Box>

            {/* COURSE ERROR */}

            {coursesError && (
                <Alert
                    severity="error"
                    sx={{
                        mb: 3,
                        borderRadius: 2,
                    }}
                >
                    {coursesError}
                </Alert>
            )}

            {/* COURSE LOADING */}

            {loadingCourses && (
                <Paper
                    elevation={0}
                    sx={{
                        p: 5,
                        mb: 5,
                        borderRadius: 3,
                        border: "1px solid",
                        borderColor: "divider",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        bgcolor: "background.paper",
                    }}
                >
                    <CircularProgress />
                </Paper>
            )}

            {/* NO COURSES */}

            {!loadingCourses &&
                !coursesError &&
                myCourses.length === 0 && (
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
                            bgcolor: "background.paper",
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
                            You haven't enrolled in any
                            courses yet. Explore our courses
                            and start learning today.
                        </Typography>

                        <Button
                            variant="contained"
                            onClick={() =>
                                navigate("/courses")
                            }
                            sx={{
                                mt: 2.5,
                                textTransform: "none",
                            }}
                        >
                            Browse Courses
                        </Button>
                    </Paper>
                )}

            {/* =================================================
                COURSE CARDS
            ================================================= */}

            {!loadingCourses &&
                !coursesError &&
                myCourses.length > 0 && (
                    <Grid
                        container
                        columnSpacing={{
                            xs: 0,
                            sm: 2.5,
                            md: 3,
                        }}
                        rowSpacing={{
                            xs: 2.5,
                            sm: 3,
                            md: 3.5,
                        }}
                    >
                        {myCourses.map(
                            (enrollment, index) => {
                                const course =
                                    enrollment.course;

                                const progress = Math.min(
                                    100,
                                    Math.max(
                                        0,
                                        Number(
                                            enrollment.progress ||
                                                0
                                        )
                                    )
                                );

                                const completed =
                                    Boolean(
                                        enrollment.completed
                                    );

                                return (
                                    <Grid
                                        key={
                                            enrollment.id ??
                                            course?.id ??
                                            `enrollment-${index}`
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
                                                height: "100%",
                                                display:
                                                    "flex",
                                                flexDirection:
                                                    "column",

                                                bgcolor:
                                                    "background.paper",

                                                border:
                                                    "1px solid",
                                                borderColor:
                                                    "divider",

                                                borderRadius:
                                                    4,

                                                overflow:
                                                    "hidden",

                                                transition:
                                                    "transform 180ms ease, box-shadow 180ms ease, border-color 180ms ease",

                                                "&:hover": {
                                                    transform:
                                                        "translateY(-3px)",

                                                    borderColor:
                                                        "action.disabled",

                                                    boxShadow:
                                                        "0 12px 30px rgba(0,0,0,0.09)",

                                                    "& .course-image":
                                                        {
                                                            transform:
                                                                "scale(1.035)",
                                                        },

                                                    "& .course-arrow":
                                                        {
                                                            transform:
                                                                "translateX(3px)",
                                                        },
                                                },
                                            }}
                                        >
                                            {/* THUMBNAIL */}

                                            <Box
                                                sx={{
                                                    position:
                                                        "relative",
                                                    height: {
                                                        xs: 210,
                                                        sm: 240,
                                                        md: 260,
                                                    },
                                                    overflow:
                                                        "hidden",
                                                    bgcolor:
                                                        "action.hover",
                                                }}
                                            >
                                                {course?.thumbnail ? (
                                                    <Box
                                                        component="img"
                                                        className="course-image"
                                                        src={
                                                            course.thumbnail
                                                        }
                                                        alt={
                                                            course.title ||
                                                            "Course"
                                                        }
                                                        onError={(
                                                            event
                                                        ) => {
                                                            event.currentTarget.style.display =
                                                                "none";
                                                        }}
                                                        sx={{
                                                            width: "100%",
                                                            height: "100%",
                                                            display:
                                                                "block",
                                                            objectFit:
                                                                "cover",

                                                            transition:
                                                                "transform 400ms ease",
                                                        }}
                                                    />
                                                ) : (
                                                    <Box
                                                        sx={{
                                                            width: "100%",
                                                            height: "100%",
                                                            display:
                                                                "flex",
                                                            alignItems:
                                                                "center",
                                                            justifyContent:
                                                                "center",

                                                            background:
                                                                "linear-gradient(135deg, #0B4F8A 0%, #123B5D 100%)",
                                                        }}
                                                    >
                                                        <SchoolOutlined
                                                            sx={{
                                                                fontSize: 58,
                                                                color:
                                                                    "white",
                                                                opacity: 0.9,
                                                            }}
                                                        />
                                                    </Box>
                                                )}

                                                {/* OVERLAY */}

                                                <Box
                                                    sx={{
                                                        position:
                                                            "absolute",
                                                        inset: 0,

                                                        background:
                                                            "linear-gradient(to bottom, rgba(15,23,42,0.02) 35%, rgba(15,23,42,0.62) 100%)",

                                                        pointerEvents:
                                                            "none",
                                                    }}
                                                />

                                                {/* CATEGORY */}

                                                {course?.category && (
                                                    <Chip
                                                        label={
                                                            course.category
                                                        }
                                                        size="small"
                                                        sx={{
                                                            position:
                                                                "absolute",
                                                            top: 14,
                                                            left: 14,

                                                            height: 28,

                                                            bgcolor:
                                                                "background.paper",
                                                            color:
                                                                "text.primary",

                                                            fontSize:
                                                                "0.72rem",
                                                            fontWeight:
                                                                700,

                                                            borderRadius:
                                                                "7px",

                                                            backdropFilter:
                                                                "blur(8px)",

                                                            "& .MuiChip-label":
                                                                {
                                                                    px: 1.2,
                                                                },
                                                        }}
                                                    />
                                                )}

                                                {/* PROGRESS STRIP */}

                                                <Box
                                                    sx={{
                                                        position:
                                                            "absolute",
                                                        left: 0,
                                                        right: 0,
                                                        bottom: 0,
                                                        height: 4,

                                                        bgcolor:
                                                            "rgba(255,255,255,0.25)",
                                                    }}
                                                >
                                                    <Box
                                                        sx={{
                                                            width: `${progress}%`,
                                                            height: "100%",
                                                            bgcolor:
                                                                completed
                                                                    ? "success.main"
                                                                    : "warning.main",

                                                            transition:
                                                                "width 500ms ease",
                                                        }}
                                                    />
                                                </Box>
                                            </Box>

                                            {/* CONTENT */}

                                            <Box
                                                sx={{
                                                    p: 2.75,
                                                    display:
                                                        "flex",
                                                    flexDirection:
                                                        "column",
                                                    flexGrow: 1,
                                                }}
                                            >
                                                {/* TITLE */}

                                                <Typography
                                                    sx={{
                                                        color: "text.primary",
                                                        fontSize:
                                                            "1.05rem",
                                                        fontWeight:
                                                            700,
                                                        lineHeight:
                                                            1.4,

                                                        display:
                                                            "-webkit-box",
                                                        WebkitLineClamp:
                                                            2,
                                                        WebkitBoxOrient:
                                                            "vertical",
                                                        overflow:
                                                            "hidden",

                                                        minHeight: 47,
                                                    }}
                                                >
                                                    {course?.title ||
                                                        "Untitled Course"}
                                                </Typography>

                                                {/* DESCRIPTION */}

                                                <Typography
                                                    sx={{
                                                        mt: 1,

                                                        color: "text.secondary",
                                                        fontSize:
                                                            "0.82rem",
                                                        lineHeight:
                                                            1.55,

                                                        display:
                                                            "-webkit-box",
                                                        WebkitLineClamp:
                                                            2,
                                                        WebkitBoxOrient:
                                                            "vertical",
                                                        overflow:
                                                            "hidden",

                                                        minHeight: 41,
                                                    }}
                                                >
                                                    {course?.description ||
                                                        "Continue learning and improve your skills."}
                                                </Typography>

                                                {/* PROGRESS */}

                                                <Box
                                                    sx={{
                                                        mt: 2.5,
                                                    }}
                                                >
                                                    <Box
                                                        sx={{
                                                            display:
                                                                "flex",
                                                            alignItems:
                                                                "center",
                                                            justifyContent:
                                                                "space-between",
                                                            mb: 0.9,
                                                        }}
                                                    >
                                                        <Typography
                                                            sx={{
                                                                fontSize:
                                                                    "0.75rem",
                                                                fontWeight:
                                                                    600,
                                                                color:
                                                                    "text.secondary",
                                                            }}
                                                        >
                                                            Course
                                                            progress
                                                        </Typography>

                                                        <Typography
                                                            sx={{
                                                                fontSize:
                                                                    "0.78rem",
                                                                fontWeight:
                                                                    700,
                                                                color:
                                                                    completed
                                                                        ? "success.main"
                                                                        : "primary.main",
                                                            }}
                                                        >
                                                            {
                                                                progress
                                                            }
                                                            %
                                                        </Typography>
                                                    </Box>

                                                    <LinearProgress
                                                        variant="determinate"
                                                        value={
                                                            progress
                                                        }
                                                        sx={{
                                                            height: 6,
                                                            borderRadius: 10,

                                                            bgcolor:
                                                                "action.hover",

                                                            "& .MuiLinearProgress-bar":
                                                                {
                                                                    borderRadius:
                                                                        10,

                                                                    bgcolor:
                                                                        completed
                                                                            ? "success.main"
                                                                            : "primary.main",
                                                                },
                                                        }}
                                                    />
                                                </Box>

                                                {/* STATUS */}

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
                                                    <Box
                                                        sx={{
                                                            width: 7,
                                                            height: 7,
                                                            borderRadius:
                                                                "50%",

                                                            bgcolor:
                                                                completed
                                                                    ? "success.main"
                                                                    : "warning.main",
                                                        }}
                                                    />

                                                    <Typography
                                                        sx={{
                                                            fontSize:
                                                                "0.75rem",
                                                            fontWeight:
                                                                600,
                                                            color:
                                                                completed
                                                                    ? "success.main"
                                                                    : "text.secondary",
                                                        }}
                                                    >
                                                        {completed
                                                            ? "Course completed"
                                                            : progress >
                                                              0
                                                            ? "In progress"
                                                            : "Not started"}
                                                    </Typography>
                                                </Box>

                                                {/* CTA */}

                                                <Button
                                                    fullWidth
                                                    variant="contained"
                                                    disableElevation
                                                    endIcon={
                                                        <ArrowForward
                                                            className="course-arrow"
                                                            sx={{
                                                                fontSize: 18,
                                                                transition:
                                                                    "transform 180ms ease",
                                                            }}
                                                        />
                                                    }
                                                    onClick={() =>
                                                        navigate(
                                                            `/courses/${course?.id}`
                                                        )
                                                    }
                                                    sx={{
                                                        mt: 2.5,

                                                        minHeight: 44,

                                                        borderRadius:
                                                            2,

                                                        textTransform:
                                                            "none",

                                                        fontSize:
                                                            "0.84rem",

                                                        fontWeight:
                                                            700,
                                                    }}
                                                >
                                                    {completed
                                                        ? "Review Course"
                                                        : progress >
                                                          0
                                                        ? "Continue Learning"
                                                        : "Start Learning"}
                                                </Button>
                                            </Box>
                                        </Paper>
                                    </Grid>
                                );
                            }
                        )}
                    </Grid>
                )}

            {/* =================================================
                LEARNING PROGRESS
            ================================================= */}

            <Typography
                variant="h5"
                fontWeight={700}
                sx={{
                    mb: 2.5,

                    // COURSE CARDS KE BAAD SPACE
                    mt: {
                        xs: 4,
                        sm: 5,
                        md: 6,
                    },

                    color: "text.primary",
                }}
            >
                Learning Progress
            </Typography>

            <Paper
                elevation={0}
                sx={{
                    position: "relative",

                    p: {
                        xs: 2.5,
                        sm: 3,
                        md: 3.5,
                    },

                    bgcolor: "background.paper",

                    border: "1px solid",
                    borderColor: "divider",

                    borderRadius: 4,

                    overflow: "hidden",

                    transition:
                        "box-shadow 180ms ease, border-color 180ms ease",

                    "&:hover": {
                        borderColor:
                            "action.disabled",

                        boxShadow:
                            "0 8px 24px rgba(0,0,0,0.06)",
                    },
                }}
            >
                {/* HEADER */}

                <Box
                    sx={{
                        display: "flex",
                        alignItems: {
                            xs: "flex-start",
                            sm: "center",
                        },
                        justifyContent:
                            "space-between",
                        gap: 2,
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1.5,
                        }}
                    >
                        {/* ICON */}

                        <Box
                            sx={{
                                width: 42,
                                height: 42,
                                flexShrink: 0,

                                display: "flex",
                                alignItems: "center",
                                justifyContent:
                                    "center",

                                bgcolor:
                                    "action.hover",
                                color:
                                    "primary.main",

                                borderRadius: 2,

                                "& svg": {
                                    fontSize: 21,
                                },
                            }}
                        >
                            <AccessTime />
                        </Box>

                        <Box>
                            <Typography
                                sx={{
                                    fontSize:
                                        "0.95rem",
                                    fontWeight: 700,
                                    color:
                                        "text.primary",
                                    lineHeight: 1.3,
                                }}
                            >
                                Overall Progress
                            </Typography>

                            <Typography
                                sx={{
                                    mt: 0.35,
                                    fontSize:
                                        "0.75rem",
                                    color:
                                        "text.disabled",
                                    fontWeight: 500,
                                }}
                            >
                                Your learning journey
                            </Typography>
                        </Box>
                    </Box>

                    {/* PERCENTAGE */}

                    <Box
                        sx={{
                            display: "flex",
                            alignItems:
                                "center",
                            justifyContent:
                                "center",

                            minWidth: 62,
                            height: 34,
                            px: 1.5,

                            bgcolor:
                                "action.hover",
                            color:
                                "primary.main",

                            borderRadius: 2,
                        }}
                    >
                        <Typography
                            sx={{
                                fontSize:
                                    "0.9rem",
                                fontWeight: 800,
                            }}
                        >
                            {overallProgress}%
                        </Typography>
                    </Box>
                </Box>

                {/* PROGRESS */}

                <Box sx={{ mt: 3 }}>
                    <Box
                        sx={{
                            display: "flex",
                            alignItems:
                                "center",
                            justifyContent:
                                "space-between",
                            mb: 1,
                        }}
                    >
                        <Typography
                            sx={{
                                fontSize:
                                    "0.75rem",
                                fontWeight: 600,
                                color:
                                    "text.secondary",
                            }}
                        >
                            Course completion
                        </Typography>

                        <Typography
                            sx={{
                                fontSize:
                                    "0.72rem",
                                fontWeight: 600,
                                color:
                                    "text.disabled",
                            }}
                        >
                            {myCourses.length === 0
                                ? "No courses"
                                : `${myCourses.length} ${
                                      myCourses.length ===
                                      1
                                          ? "course"
                                          : "courses"
                                  }`}
                        </Typography>
                    </Box>

                    <LinearProgress
                        variant="determinate"
                        value={overallProgress}
                        sx={{
                            height: 8,
                            borderRadius: 10,

                            bgcolor:
                                "action.hover",

                            "& .MuiLinearProgress-bar":
                                {
                                    borderRadius: 10,

                                    bgcolor:
                                        overallProgress >=
                                        100
                                            ? "success.main"
                                            : "primary.main",

                                    transition:
                                        "transform 500ms ease",
                                },
                        }}
                    />
                </Box>

                {/* BOTTOM MESSAGE */}

                <Box
                    sx={{
                        mt: 2,

                        display: "flex",
                        alignItems:
                            "center",
                        gap: 1,
                    }}
                >
                    <Box
                        sx={{
                            width: 6,
                            height: 6,
                            flexShrink: 0,

                            borderRadius:
                                "50%",

                            bgcolor:
                                overallProgress >=
                                100
                                    ? "success.main"
                                    : "warning.main",
                        }}
                    />

                    <Typography
                        sx={{
                            fontSize:
                                "0.76rem",
                            lineHeight: 1.5,
                            color:
                                "text.secondary",
                            fontWeight: 500,
                        }}
                    >
                        {myCourses.length === 0
                            ? "Start a course to begin tracking your learning progress."
                            : overallProgress >=
                              100
                            ? "Excellent work! You have completed all your enrolled courses."
                            : `You have completed ${overallProgress}% of your enrolled learning.`}
                    </Typography>
                </Box>
            </Paper>
        </Container>
    );
};

export default StudentDashboard;