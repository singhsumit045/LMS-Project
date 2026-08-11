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
    PlayCircle,
    CheckCircle,
    EmojiEvents,
    ArrowForward,
    AccessTime,
    VideoCameraFront,
    LiveTv,
} from "@mui/icons-material";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getMyCourses } from "../../services/enrollmentService";

import {
    getStudentLiveClasses,
} from "../../services/liveClassService";

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
    const [loadingCourses, setLoadingCourses] =
        useState(true);
    const [coursesError, setCoursesError] =
        useState("");

    // =====================================================
    // LIVE CLASSES
    // =====================================================

    const [liveClasses, setLiveClasses] = useState([]);
    const [loadingLiveClasses, setLoadingLiveClasses] =
        useState(true);
    const [liveClassError, setLiveClassError] =
        useState("");

    // =====================================================
    // GET USER
    // =====================================================

    useEffect(() => {
        const storedUser =
            localStorage.getItem("user");

        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (error) {
                console.error(
                    "User data error:",
                    error
                );
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

            const response =
                await getMyCourses();

            console.log(
                "Student Courses:",
                response.data
            );

            const coursesData =
                Array.isArray(response.data)
                    ? response.data
                    : Array.isArray(
                          response.data?.data
                      )
                    ? response.data.data
                    : [];

            setMyCourses(coursesData);
        } catch (error) {
            console.error(
                "Dashboard courses error:",
                error
            );

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

            const response =
                await getStudentLiveClasses();

            console.log(
                "Student Live Classes:",
                response.data
            );

            const data =
                Array.isArray(response.data)
                    ? response.data
                    : Array.isArray(
                          response.data?.data
                      )
                    ? response.data.data
                    : [];

            setLiveClasses(data);
        } catch (error) {
            console.error(
                "Live classes error:",
                error
            );

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

    const userName =
        user?.name || "Student";

    // =====================================================
    // STATS
    // =====================================================

    const enrolledCount =
        myCourses.length;

    const completedCount =
        myCourses.filter(
            (item) =>
                item.completed === true
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
                          total +
                          Number(
                              item.progress || 0
                          ),
                      0
                  ) /
                      myCourses.length
              )
            : 0;

    // =====================================================
    // STATS DATA
    // =====================================================

    const stats = [
        {
            title: "Enrolled Courses",
            value: enrolledCount,
            icon: <PlayCircle />,
        },
        {
            title: "Completed",
            value: completedCount,
            icon: <CheckCircle />,
        },
        {
            title: "Certificates",
            value: certificateCount,
            icon: <EmojiEvents />,
        },
    ];

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
                        label="STUDENT"
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
                        Welcome back,{" "}
                        {userName} 👋
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
                        Continue your learning
                        journey and build your
                        skills with LearnHub.
                    </Typography>

                    <Button
                        variant="contained"
                        onClick={() =>
                            navigate("/courses")
                        }
                        endIcon={
                            <ArrowForward />
                        }
                        sx={{
                            mt: 3,
                            backgroundColor:
                                "white",
                            color: "primary.main",
                            "&:hover": {
                                backgroundColor:
                                    "#f5f5f5",
                            },
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
                sx={{ mb: 2.5 }}
            >
                Your Learning Overview
            </Typography>

            <Grid
                container
                spacing={2.5}
                sx={{ mb: 5 }}
            >
                {stats.map((stat) => (
                    <Grid
                        key={stat.title}
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
                                height: "100%",
                                border: "1px solid",
                                borderColor:
                                    "divider",
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
                                    alignItems:
                                        "center",
                                }}
                            >
                                <Box>
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                    >
                                        {
                                            stat.title
                                        }
                                    </Typography>

                                    <Typography
                                        variant="h4"
                                        fontWeight={700}
                                        sx={{
                                            mt: 1,
                                        }}
                                    >
                                        {
                                            stat.value
                                        }
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
                                    {
                                        stat.icon
                                    }
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
                    justifyContent:
                        "space-between",
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
                        Join your teacher's
                        live classes
                    </Typography>
                </Box>

                {!loadingLiveClasses &&
                    liveClasses.length >
                        0 && (
                        <Chip
                            icon={
                                <LiveTv />
                            }
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
            )}

            {/* LIVE CLASS ERROR */}

            {!loadingLiveClasses &&
                liveClassError && (
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
                liveClasses.length ===
                    0 && (
                    <Paper
                        elevation={0}
                        sx={{
                            p: 4,
                            mb: 5,
                            borderRadius: 3,
                            border: "1px solid",
                            borderColor:
                                "divider",
                            textAlign:
                                "center",
                        }}
                    >
                        <VideoCameraFront
                            sx={{
                                fontSize: 55,
                                color:
                                    "text.secondary",
                                mb: 1,
                            }}
                        />

                        <Typography
                            variant="h6"
                            fontWeight={600}
                        >
                            No live classes
                            available
                        </Typography>

                        <Typography
                            color="text.secondary"
                            sx={{ mt: 1 }}
                        >
                            Your teacher's
                            live classes will
                            appear here.
                        </Typography>
                    </Paper>
                )}

            {/* LIVE CLASS CARDS */}

            {!loadingLiveClasses &&
                !liveClassError &&
                liveClasses.length >
                    0 && (
                    <Grid
                        container
                        spacing={3}
                        sx={{ mb: 5 }}
                    >
                        {liveClasses.map(
                            (liveClass) => (
                                <Grid
                                    key={
                                        liveClass.id
                                    }
                                    size={{
                                        xs: 12,
                                        md: 6,
                                    }}
                                >
                                    <Paper
                                        elevation={
                                            0
                                        }
                                        sx={{
                                            p: 3,
                                            borderRadius: 3,
                                            border:
                                                "1px solid",
                                            borderColor:
                                                liveClass.isLive
                                                    ? "error.main"
                                                    : "divider",
                                            background:
                                                "linear-gradient(135deg, rgba(25,118,210,0.08), rgba(123,31,162,0.08))",
                                            transition:
                                                "transform 0.2s ease, box-shadow 0.2s ease",
                                            "&:hover":
                                                {
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
                                                backgroundColor:
                                                    "background.paper",
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
                )}

            {/* =================================================
                MY COURSES
            ================================================= */}

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
                    endIcon={
                        <ArrowForward />
                    }
                    onClick={() =>
                        navigate(
                            "/courses"
                        )
                    }
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
            )}

            {/* NO COURSES */}

            {!loadingCourses &&
                !coursesError &&
                myCourses.length ===
                    0 && (
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
                            borderColor:
                                "divider",
                            textAlign:
                                "center",
                        }}
                    >
                        <School
                            sx={{
                                fontSize: 55,
                                color:
                                    "text.secondary",
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
                            You haven't
                            enrolled in any
                            courses yet.
                            Explore our
                            courses and
                            start learning
                            today.
                        </Typography>

                        <Button
                            variant="contained"
                            onClick={() =>
                                navigate(
                                    "/courses"
                                )
                            }
                            sx={{
                                mt: 2.5,
                            }}
                        >
                            Browse Courses
                        </Button>
                    </Paper>
                )}

            {/* COURSE CARDS */}

            {!loadingCourses &&
                !coursesError &&
                myCourses.length >
                    0 && (
                    <Grid
                        container
                        spacing={3}
                        sx={{ mb: 5 }}
                    >
                        {myCourses.map(
                            (enrollment) => {
                                const course =
                                    enrollment.course;

                                const progress =
                                    Number(
                                        enrollment.progress ||
                                            0
                                    );

                                return (
                                    <Grid
                                        key={
                                            enrollment.id
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
                                                height: "100%",
                                                border: "1px solid",
                                                borderColor:
                                                    "divider",
                                                borderRadius: 3,
                                                overflow:
                                                    "hidden",
                                                transition:
                                                    "transform 0.2s ease, box-shadow 0.2s ease",
                                                "&:hover":
                                                    {
                                                        transform:
                                                            "translateY(-4px)",
                                                        boxShadow:
                                                            "0 8px 25px rgba(0,0,0,0.08)",
                                                    },
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
                                                {course?.thumbnail ? (
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
                                                        }}
                                                        onError={(
                                                            event
                                                        ) => {
                                                            event.currentTarget.style.display =
                                                                "none";
                                                        }}
                                                    />
                                                ) : (
                                                    <PlayCircle
                                                        sx={{
                                                            fontSize: 70,
                                                            color: "white",
                                                        }}
                                                    />
                                                )}
                                            </Box>

                                            {/* COURSE CONTENT */}

                                            <Box
                                                sx={{
                                                    p: 3,
                                                }}
                                            >
                                                {course?.category && (
                                                    <Chip
                                                        label={
                                                            course.category
                                                        }
                                                        size="small"
                                                        color="primary"
                                                        variant="outlined"
                                                        sx={{
                                                            mb: 1.5,
                                                        }}
                                                    />
                                                )}

                                                <Typography
                                                    variant="h6"
                                                    fontWeight={
                                                        700
                                                    }
                                                    sx={{
                                                        mb: 1,
                                                    }}
                                                >
                                                    {course?.title ||
                                                        "Course"}
                                                </Typography>

                                                <Typography
                                                    color="text.secondary"
                                                    sx={{
                                                        mb: 2,
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
                                                    {course?.description ||
                                                        "Continue learning and improve your skills."}
                                                </Typography>

                                                {/* PROGRESS */}

                                                <Box
                                                    sx={{
                                                        mb: 1,
                                                    }}
                                                >
                                                    <Box
                                                        sx={{
                                                            display:
                                                                "flex",
                                                            justifyContent:
                                                                "space-between",
                                                            mb: 0.7,
                                                        }}
                                                    >
                                                        <Typography
                                                            variant="body2"
                                                            color="text.secondary"
                                                        >
                                                            Progress
                                                        </Typography>

                                                        <Typography
                                                            variant="body2"
                                                            fontWeight={
                                                                700
                                                            }
                                                            color="primary"
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
                                                            height: 7,
                                                            borderRadius: 5,
                                                        }}
                                                    />
                                                </Box>

                                                {/* STATUS */}

                                                {enrollment.completed ? (
                                                    <Chip
                                                        icon={
                                                            <CheckCircle />
                                                        }
                                                        label="Completed"
                                                        color="success"
                                                        size="small"
                                                        sx={{
                                                            mt: 1.5,
                                                        }}
                                                    />
                                                ) : (
                                                    <Chip
                                                        icon={
                                                            <AccessTime />
                                                        }
                                                        label="In Progress"
                                                        color="primary"
                                                        variant="outlined"
                                                        size="small"
                                                        sx={{
                                                            mt: 1.5,
                                                        }}
                                                    />
                                                )}

                                                {/* CONTINUE */}

                                                <Button
                                                    fullWidth
                                                    variant="contained"
                                                    endIcon={
                                                        <ArrowForward />
                                                    }
                                                    onClick={() =>
                                                        navigate(
                                                            `/courses/${course?.id}`
                                                        )
                                                    }
                                                    sx={{
                                                        mt: 2.5,
                                                        borderRadius: 2,
                                                    }}
                                                >
                                                    {progress >
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
                sx={{ mb: 2.5 }}
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
                    borderColor:
                        "divider",
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
                            alignItems:
                                "center",
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
                        {overallProgress}%
                    </Typography>
                </Box>

                <LinearProgress
                    variant="determinate"
                    value={
                        overallProgress
                    }
                    sx={{
                        height: 8,
                        borderRadius: 5,
                    }}
                />

                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 1.5 }}
                >
                    {myCourses.length ===
                    0
                        ? "Start a course to track your learning progress."
                        : `You are currently ${overallProgress}% through your enrolled courses.`}
                </Typography>
            </Paper>
        </Container>
    );
};

export default StudentDashboard;