import {
    Box,
    Container,
    Paper,
    Typography,
    Grid,
    Avatar,
    CircularProgress, 
    Alert,
    Button,
    Stack,
    Chip,
    LinearProgress,
} from "@mui/material";    

import {
    People,
    School,
    Person,
    MenuBook,
    Assignment,
    Refresh,
    Group,
    LibraryBooks,
    TrendingUp,
    Security,
    ArrowForward,
} from "@mui/icons-material";

import {
    BarChart,
    Bar,
    Cell,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
} from "recharts";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

import api from "../../services/api";

import {
    getMonthlyUsers,
    getCourseEnrollment,
    getTopCourses,
} from "../../services/analyticsService";   

/* =========================================================
   DASHBOARD CONFIG
========================================================= */

const STAT_CONFIG = [
    {
        key: "totalUsers",
        title: "Total Users",
        icon: People,
        color: "primary",
        growthKey: "usersGrowth",  
    }, 
    {
        key: "totalStudents",
        title: "Students",
        icon: School,
        color: "success",
        growthKey: "studentsGrowth", 
    },
    {
        key: "totalTeachers",
        title: "Teachers",
        icon: Person,
        color: "warning",
        growthKey: "teachersGrowth",
    },
    {
        key: "totalCourses",
        title: "Courses",
        icon: MenuBook,
        color: "secondary",
        growthKey: "coursesGrowth",
    },
    {
        key: "totalEnrollments",
        title: "Enrollments",
        icon: Assignment,
        color: "info",
        growthKey: "enrollmentsGrowth",
    },
    {
        key: "totalAdmins",
        title: "Admins",
        icon: Security,
        color: "warning",
        growthKey: "AdminsGrowth", 
    },
];

const ACTION_CONFIG = [
    {
        title: "Manage Users",
        description: "Students & Teachers",
        icon: Group,
        path: "/admin/users",
        color: "primary",
    },
    {
        title: "Manage Courses",
        description: "Review LMS Courses",
        icon: LibraryBooks,
        path: "/admin/courses",
        color: "secondary",
    },
    {
        title: "Enrollment Reports",
        description: "Track learning activity",
        icon: TrendingUp,
        path: "/admin/enrollments",
        color: "success",
    },

];

/* =========================================================
   HELPERS
========================================================= */

const getThemeColor = (theme, color) => {
    return theme.palette[color]?.main || theme.palette.primary.main;
};

const getThemeDarkColor = (theme, color) => {
    return theme.palette[color]?.dark || theme.palette.primary.dark;
};

const getTransparentColor = (theme, color, opacity = "18") => {
    const mainColor = getThemeColor(theme, color);

    /*
     * Converts hex color into rgba when possible.
     * MUI palette colors are normally hex values.
     */
    if (/^#[0-9A-F]{6}$/i.test(mainColor)) {
        const red = parseInt(mainColor.slice(1, 3), 16);
        const green = parseInt(mainColor.slice(3, 5), 16);
        const blue = parseInt(mainColor.slice(5, 7), 16);

        const alpha = parseInt(opacity, 16) / 255;

        return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
    }

    return mainColor;
};

/* =========================================================
   COMPONENT
========================================================= */

const AdminDashboard = () => {
    const navigate = useNavigate();
    const theme = useTheme();

    const isDark = theme.palette.mode === "dark";

    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    const [dashboard, setDashboard] = useState({
        totalUsers: 0,  
        totalStudents: 0,
        totalTeachers: 0, 
        totalCourses: 0, 
        totalEnrollments: 0,  
        totalAdmins: 0, 

        /*
         * These values should ideally come from backend.
         * If backend doesn't provide them, 0 is used.
         */
        usersGrowth: 0,
        studentsGrowth: 0,
        teachersGrowth: 0,
        coursesGrowth: 0,
        enrollmentsGrowth: 0,
    });

    const [monthlyUsers, setMonthlyUsers] = useState([]);
    const [courseEnrollment, setCourseEnrollment] = useState([]);
    const [topCourses, setTopCourses] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    /* =====================================================
       LOAD DASHBOARD
    ===================================================== */

    const loadDashboard = async () => {
        try {
            setLoading(true);
            setError("");

            const [
                dashboardRes,
                usersRes,
                enrollmentRes,
                coursesRes,
            ] = await Promise.all([
                api.get("/admin/dashboard"),
                getMonthlyUsers(),
                getCourseEnrollment(),
                getTopCourses(),
            ]);

            setDashboard((previous) => ({
                ...previous,
                ...dashboardRes.data,
            }));

            setMonthlyUsers(usersRes.data || []);
            setCourseEnrollment(enrollmentRes.data || []);
            setTopCourses(coursesRes.data || []);
        } catch (error) {
            console.error("Admin dashboard error:", error);

            setError("Unable to load admin dashboard");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadDashboard();
    }, []);

    /* =====================================================
       LOADING
    ===================================================== */

    if (loading) {
        return (
            <Box
                sx={{
                    minHeight: "80vh",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 2,
                    px: 2,
                    textAlign: "center",
                }}
            >
                <CircularProgress
                    size={50}
                    thickness={4}
                />

                <Typography
                    sx={{
                        color: "text.secondary",
                        fontWeight: 600,
                    }}
                >
                    Loading your dashboard…
                </Typography>
            </Box>
        );
    }

    /* =====================================================
       ERROR
    ===================================================== */

    if (error) {
        return (
            <Container
                sx={{
                    mt: 5,
                    px: {
                        xs: 2,
                        sm: 3,
                    },
                }}
            >
                <Alert
                    severity="error"
                    sx={{
                        borderRadius: 3,
                    }}
                >
                    {error}
                </Alert> 

                <Button
                    fullWidth={isMobile}
                    sx={{
                        mt: 2,
                        borderRadius: 3,
                        textTransform: "none",
                        fontWeight: 700,
                    }}
                    variant="contained"
                    startIcon={<Refresh />}
                    onClick={loadDashboard}
                >
                    Retry
                </Button>
            </Container>
        );
    }

    /* =====================================================
       STATS
    ===================================================== */

    const stats = STAT_CONFIG.map((item) => {
        const Icon = item.icon;

        return {
            ...item,
            value: dashboard[item.key] ?? 0,
            growth: dashboard[item.growthKey] ?? 0,
            Icon,
            colorValue: getThemeColor(theme, item.color),
        };
    });

    /* =====================================================
       CHART CONFIG
    ===================================================== */

    const chartHeight = isMobile ? 260 : 320;
    const chartPaperHeight = isMobile ? 340 : 420;

    const xAxisTickProps = isMobile
        ? {
              fontSize: 10,
              angle: -35,
              textAnchor: "end",
              height: 50,
              interval: 0,
          }
        : {
              fontSize: 12,
          };

    /* =====================================================
       COURSE COLORS
    ===================================================== */

    const courseColors = [
        theme.palette.primary.main,
        theme.palette.success.main,
        theme.palette.warning.main,
        theme.palette.secondary.main,
        theme.palette.info.main,
        theme.palette.error.main,
    ];

    /* =====================================================
       RENDER
    ===================================================== */

    return (
        <Container
            maxWidth="xl"
            sx={{
                py: {
                    xs: 2,
                    sm: 3,
                    md: 4,
                },
                px: {
                    xs: 2,
                    sm: 3,
                },
            }}
        >
            {/* =================================================
                HEADER
            ================================================= */}

            <Paper
                elevation={0}
                sx={{
                    p: {
                        xs: 2.5,
                        sm: 3,
                        md: 5,
                    },

                    mb: 4,

                    borderRadius: {
                        xs: 4,
                        md: 6,
                    },

                    color: theme.palette.common.white,

                    position: "relative",
                    overflow: "hidden",

                    background: `linear-gradient(
                        135deg,
                        ${theme.palette.primary.main} 0%,
                        ${theme.palette.secondary.main} 100%
                    )`,

                    boxShadow: `0 20px 50px -12px ${getTransparentColor(
                        theme,
                        "primary",
                        "55"
                    )}`,
                }}
            >
                {/* Decorative blob */}

                <Box
                    sx={{
                        position: "absolute",
                        top: -60,
                        right: -60,
                        width: 220,
                        height: 220,
                        borderRadius: "50%",
                        background: "rgba(255,255,255,0.08)",
                        display: {
                            xs: "none",
                            sm: "block",
                        },
                    }}
                />

                <Box
                    sx={{
                        position: "absolute",
                        bottom: -80,
                        right: 120,
                        width: 160,
                        height: 160,
                        borderRadius: "50%",
                        background: "rgba(255,255,255,0.06)",
                        display: {
                            xs: "none",
                            sm: "block",
                        },
                    }}
                />

                <Stack
                    sx={{
                        flexDirection: {
                            xs: "column",
                            md: "row",
                        },

                        gap: {
                            xs: 2.5,
                            md: 3,
                        },

                        justifyContent: "space-between",

                        alignItems: {
                            xs: "flex-start",
                            md: "center",
                        },

                        position: "relative",
                        zIndex: 1,
                    }}
                >
                    <Box sx={{ minWidth: 0 }}>
                        <Typography
                            variant="h4"
                            sx={{
                                fontWeight: 900,
                                letterSpacing: -0.5,

                                fontSize: {
                                    xs: 22,
                                    sm: 28,
                                    md: 34,
                                },

                                lineHeight: 1.2,
                            }}
                        >
                            Admin Control Center
                        </Typography>

                        <Typography
                            sx={{
                                mt: 1,
                                opacity: 0.9,
                                maxWidth: 480,

                                fontSize: {
                                    xs: 14,
                                    sm: 15,
                                },
                            }}
                        >
                            Manage users, courses and analytics from one
                            powerful dashboard
                        </Typography>

                        <Chip
                            icon={
                                <Security
                                    sx={{
                                        color: `${theme.palette.common.white} !important`,
                                    }}
                                />
                            }
                            label="Administrator Access"
                            sx={{
                                mt: {
                                    xs: 2,
                                    md: 3,
                                },

                                color: theme.palette.common.white,
                                fontWeight: 700,

                                backdropFilter: "blur(6px)",

                                background:
                                    "rgba(255,255,255,0.18)",

                                border:
                                    "1px solid rgba(255,255,255,0.25)",
                            }}
                        />
                    </Box>

                    <Avatar
                        sx={{
                            width: {
                                xs: 56,
                                sm: 70,
                                md: 90,
                            },

                            height: {
                                xs: 56,
                                sm: 70,
                                md: 90,
                            },

                            background:
                                "rgba(255,255,255,0.20)",

                            border:
                                "2px solid rgba(255,255,255,0.3)",

                            backdropFilter: "blur(6px)",

                            alignSelf: {
                                xs: "flex-end",
                                md: "center",
                            },

                            flexShrink: 0,
                        }}
                    >
                        <Security fontSize="large" />
                    </Avatar>
                </Stack>
            </Paper>

            {/* =================================================
                STAT CARDS
            ================================================= */}

            <Grid
                container
                spacing={{
                    xs: 2,
                    sm: 3,
                }}
            >
                {stats.map((item) => {
                    const Icon = item.Icon;

                    return (
                        <Grid
                            key={item.key}
                            size={{
                                xs: 12,
                                sm: 6,
                                md: 3,
                                lg: 2.4,
                            }}
                        >
                            <Paper
                                elevation={0}
                                sx={{
                                    p: {
                                        xs: 2.5,
                                        sm: 3,
                                    },

                                    minHeight: {
                                        xs: "auto",
                                        sm: 175,
                                    },

                                    borderRadius: 5,

                                    position: "relative",
                                    overflow: "hidden",

                                    background: isDark
                                        ? "rgba(255,255,255,0.03)"
                                        : `linear-gradient(
                                            160deg,
                                            ${getTransparentColor(
                                                theme,
                                                item.color
                                            )}
                                            0%,
                                            ${theme.palette.background.paper}
                                            60%
                                        )`,

                                    border: `1px solid ${
                                        isDark
                                            ? "rgba(255,255,255,0.08)"
                                            : getTransparentColor(
                                                  theme,
                                                  item.color,
                                                  "25"
                                              )
                                    }`,

                                    boxShadow: isDark
                                        ? "none"
                                        : "0 1px 3px rgba(15,23,42,0.05)",

                                    transition:
                                        "all 0.25s ease",

                                    "&:hover": {
                                        transform:
                                            "translateY(-6px)",

                                        boxShadow: `0 16px 32px -12px ${getTransparentColor(
                                            theme,
                                            item.color,
                                            "55"
                                        )}`,

                                        borderColor:
                                            getTransparentColor(
                                                theme,
                                                item.color,
                                                "55"
                                            ),
                                    },

                                    "&:before": {
                                        content: '""',

                                        position: "absolute",
                                        top: 0,
                                        left: 0,

                                        width: 4,
                                        height: "100%",

                                        background:
                                            item.colorValue,
                                    },
                                }}
                            >
                                <Stack
                                    sx={{
                                        flexDirection:
                                            "column",

                                        justifyContent:
                                            "space-between",

                                        height: "100%",

                                        gap: 2,

                                        position: "relative",
                                        zIndex: 1,
                                    }}
                                >
                                    <Stack
                                        sx={{
                                            flexDirection:
                                                "row",

                                            justifyContent:
                                                "space-between",

                                            alignItems:
                                                "center",

                                            gap: 1,
                                        }}
                                    >
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                color:
                                                    "text.secondary",

                                                fontWeight: 700,

                                                lineHeight: 1.4,
                                            }}
                                        >
                                            {item.title}
                                        </Typography>

                                        <Avatar
                                            sx={{
                                                width: {
                                                    xs: 38,
                                                    sm: 44,
                                                },

                                                height: {
                                                    xs: 38,
                                                    sm: 44,
                                                },

                                                background:
                                                    getTransparentColor(
                                                        theme,
                                                        item.color
                                                    ),

                                                color:
                                                    item.colorValue,

                                                flexShrink: 0,

                                                "& svg": {
                                                    fontSize: {
                                                        xs: 20,
                                                        sm: 23,
                                                    },
                                                },
                                            }}
                                        >
                                            <Icon />
                                        </Avatar>
                                    </Stack>

                                    <Box>
                                        <Typography
                                            sx={{
                                                fontSize: {
                                                    xs: 28,
                                                    sm: 36,
                                                },

                                                fontWeight: 900,

                                                lineHeight: 1.1,
                                            }}
                                        >
                                            {item.value}
                                        </Typography>

                                        <Chip
                                            size="small"
                                            label={`${item.growth >= 0 ? "+" : ""}${item.growth}% this month`}
                                            sx={{
                                                mt: 1,

                                                fontSize: 11,

                                                background:
                                                    getTransparentColor(
                                                        theme,
                                                        item.color
                                                    ),

                                                color:
                                                    item.colorValue,

                                                fontWeight: 800,
                                            }}
                                        />
                                    </Box>
                                </Stack>
                            </Paper>
                        </Grid>
                    );
                })}
            </Grid>

            {/* =================================================
                ANALYTICS
            ================================================= */}

            <Typography
                variant="h5"
                sx={{
                    fontWeight: 900,

                    mt: 6,
                    mb: 3,

                    fontSize: {
                        xs: 20,
                        sm: 24,
                    },
                }}
            >
                Analytics Overview
            </Typography>

            <Grid
                container
                spacing={{
                    xs: 2,
                    sm: 2,
                }}
            >
                {/* USER GROWTH */}

                <Grid
                    size={{
                        xs: 12,
                        md: 6,
                    }}
                >
                    <Paper
                        elevation={0}
                        sx={{
                            p: {
                                xs: 2,
                                sm: 3,
                            },

                            height: chartPaperHeight,

                            borderRadius: 5,

                            border: `1px solid ${
                                isDark
                                    ? "rgba(255,255,255,0.08)"
                                    : theme.palette.divider
                            }`,

                            background: isDark
                                ? "rgba(255,255,255,0.03)"
                                : theme.palette.background.paper,

                            boxShadow: isDark
                                ? "none"
                                : "0 1px 3px rgba(15,23,42,0.06)",
                        }}
                    >
                        <Stack
                            sx={{
                                flexDirection: "row",

                                justifyContent:
                                    "space-between",

                                alignItems: "center",

                                mb: 3,

                                flexWrap: "wrap",

                                gap: 1,
                            }}
                        >
                            <Typography
                                sx={{
                                    fontWeight: 900,
                                }}
                            >
                                User Growth
                            </Typography>

                            <Chip
                                size="small"
                                label="Last 6 months"
                                sx={{
                                    fontWeight: 700,
                                    fontSize: 11,
                                }}
                            />
                        </Stack>

                        <ResponsiveContainer
                            width="100%"
                            height={chartHeight}
                        >
                            <BarChart
                                data={monthlyUsers}
                                margin={
                                    isMobile
                                        ? {
                                              top: 0,
                                              right: 0,
                                              left: -20,
                                              bottom: 0,
                                          }
                                        : undefined
                                }
                            >
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    vertical={false}
                                    stroke={
                                        isDark
                                            ? "rgba(255,255,255,0.08)"
                                            : theme.palette.divider
                                    }
                                />

                                <XAxis
                                    dataKey="month"
                                    tickLine={false}
                                    axisLine={false}
                                    {...xAxisTickProps}
                                />

                                <YAxis
                                    tickLine={false}
                                    axisLine={false}
                                    fontSize={
                                        isMobile ? 10 : 12
                                    }
                                    width={
                                        isMobile ? 28 : 36
                                    }
                                />

                                <Tooltip
                                    cursor={{
                                        fill: getTransparentColor(
                                            theme,
                                            "primary",
                                            "0d"
                                        ),
                                    }}
                                    contentStyle={{
                                        borderRadius: 12,
                                        border: "none",
                                        boxShadow:
                                            "0 8px 24px rgba(0,0,0,0.12)",
                                    }}
                                />

                                <Bar
                                    dataKey="users"
                                    fill={
                                        theme.palette.primary.main
                                    }
                                    radius={[
                                        10,
                                        10,
                                        0,
                                        0,
                                    ]}
                                    maxBarSize={
                                        isMobile ? 28 : 42
                                    }
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>

                {/* COURSE ENROLLMENT */}

                <Grid
                    size={{
                        xs: 12,
                        md: 6,
                    }}
                >
                    <Paper
                        elevation={0}
                        sx={{
                            p: {
                                xs: 2,
                                sm: 3,
                            },

                            height: chartPaperHeight,

                            borderRadius: 5,

                            border: `1px solid ${
                                isDark
                                    ? "rgba(255,255,255,0.08)"
                                    : theme.palette.divider
                            }`,

                            background: isDark
                                ? "rgba(255,255,255,0.03)"
                                : theme.palette.background.paper,

                            boxShadow: isDark
                                ? "none"
                                : "0 1px 3px rgba(15,23,42,0.06)",
                        }}
                    >
                        <Stack
                            sx={{
                                flexDirection: "row",

                                justifyContent:
                                    "space-between",

                                alignItems: "center",

                                mb: 3,

                                flexWrap: "wrap",

                                gap: 1,
                            }}
                        >
                            <Typography
                                sx={{
                                    fontWeight: 900,
                                }}
                            >
                                Course Enrollment
                            </Typography>

                            <Chip
                                size="small"
                                label="By course"
                                sx={{
                                    fontWeight: 700,
                                    fontSize: 11,
                                }}
                            />
                        </Stack>

                        <ResponsiveContainer
                            width="100%"
                            height={chartHeight}
                        >
                            <BarChart
                                data={courseEnrollment}
                                margin={
                                    isMobile
                                        ? {
                                              top: 0,
                                              right: 0,
                                              left: -20,
                                              bottom: 0,
                                          }
                                        : undefined
                                }
                            >
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    vertical={false}
                                    stroke={
                                        isDark
                                            ? "rgba(255,255,255,0.08)"
                                            : theme.palette.divider
                                    }
                                />

                                <XAxis
                                    dataKey="course"
                                    tickLine={false}
                                    axisLine={false}
                                    {...xAxisTickProps}
                                />

                                <YAxis
                                    tickLine={false}
                                    axisLine={false}
                                    fontSize={
                                        isMobile ? 10 : 12
                                    }
                                    width={
                                        isMobile ? 28 : 36
                                    }
                                />

                                <Tooltip
                                    cursor={{
                                        fill: getTransparentColor(
                                            theme,
                                            "primary",
                                            "0d"
                                        ),
                                    }}
                                    contentStyle={{
                                        borderRadius: 12,
                                        border: "none",
                                        boxShadow:
                                            "0 8px 24px rgba(0,0,0,0.12)",
                                    }}
                                />

                                <Bar
                                    dataKey="students"
                                    radius={[
                                        10,
                                        10,
                                        0,
                                        0,
                                    ]}
                                    maxBarSize={
                                        isMobile ? 28 : 42
                                    }
                                >
                                    {courseEnrollment.map(
                                        (_, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={
                                                    courseColors[
                                                        index %
                                                            courseColors.length
                                                    ]
                                                }
                                            />
                                        )
                                    )}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>
            </Grid>

            {/* =================================================
                TOP COURSES
            ================================================= */}

            <Typography
                variant="h5"
                sx={{
                    fontWeight: 900,

                    mt: 6,
                    mb: 3,

                    fontSize: {
                        xs: 20,
                        sm: 24,
                    },
                }}
            >
                Top Performing Courses
            </Typography>

            <Paper
                elevation={0}
                sx={{
                    borderRadius: 5,

                    overflow: "hidden",

                    border: `1px solid ${
                        isDark
                            ? "rgba(255,255,255,0.08)"
                            : theme.palette.divider
                    }`,

                    background: isDark
                        ? "rgba(255,255,255,0.03)"
                        : theme.palette.background.paper,
                }}
            >
                {topCourses.length === 0 ? (
                    <Box
                        sx={{
                            p: 5,
                            textAlign: "center",
                        }}
                    >
                        <Typography
                            sx={{
                                color: "text.secondary",
                            }}
                        >
                            No course analytics available
                        </Typography>
                    </Box>
                ) : (
                    topCourses.map((course, index) => {
                        const courseColor =
                            courseColors[
                                index % courseColors.length
                            ];

                        const students =
                            Number(course.students) || 0;

                        return (
                            <Box
                                key={
                                    course.id ??
                                    course.courseId ??
                                    `course-${index}`
                                }
                                sx={{
                                    p: {
                                        xs: 2,
                                        sm: 3,
                                    },

                                    borderBottom: `1px solid ${
                                        isDark
                                            ? "rgba(255,255,255,0.06)"
                                            : theme.palette.divider
                                    }`,

                                    borderLeft: `4px solid ${courseColor}`,

                                    transition:
                                        "background 0.2s ease",

                                    "&:hover": {
                                        background: isDark
                                            ? "rgba(255,255,255,0.03)"
                                            : getTransparentColor(
                                                  theme,
                                                  "primary",
                                                  "08"
                                              ),
                                    },

                                    "&:last-of-type": {
                                        borderBottom: "none",
                                    },
                                }}
                            >
                                <Stack
                                    sx={{
                                        flexDirection: {
                                            xs: "column",
                                            sm: "row",
                                        },

                                        gap: 2,

                                        justifyContent:
                                            "space-between",

                                        alignItems: {
                                            xs: "flex-start",
                                            sm: "center",
                                        },
                                    }}
                                >
                                    <Stack
                                        sx={{
                                            flexDirection:
                                                "row",

                                            gap: 2,

                                            alignItems:
                                                "center",

                                            flex: 1,

                                            minWidth: 0,

                                            width: {
                                                xs: "100%",
                                                sm: "auto",
                                            },
                                        }}
                                    >
                                        <Avatar
                                            sx={{
                                                width: {
                                                    xs: 36,
                                                    sm: 40,
                                                },

                                                height: {
                                                    xs: 36,
                                                    sm: 40,
                                                },

                                                fontWeight: 800,

                                                flexShrink: 0,

                                                bgcolor:
                                                    index === 0
                                                        ? theme
                                                              .palette
                                                              .warning
                                                              .main
                                                        : courseColor,
                                            }}
                                        >
                                            {index + 1}
                                        </Avatar>

                                        <Box
                                            sx={{
                                                minWidth: 0,
                                            }}
                                        >
                                            <Typography
                                                sx={{
                                                    fontWeight: 800,
                                                }}
                                                noWrap
                                            >
                                                {course.course ||
                                                    "Course"}
                                            </Typography>

                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    color:
                                                        "text.secondary",
                                                }}
                                            >
                                                {students}{" "}
                                                students
                                                enrolled
                                            </Typography>
                                        </Box>
                                    </Stack>

                                    <Box
                                        sx={{
                                            width: {
                                                xs: "100%",
                                                sm: 250,
                                            },
                                        }}
                                    >
                                        <LinearProgress
                                            variant="determinate"
                                            value={Math.min(
                                                students * 5,
                                                100
                                            )}
                                            sx={{
                                                height: 8,

                                                borderRadius: 4,

                                                backgroundColor:
                                                    isDark
                                                        ? "rgba(255,255,255,0.08)"
                                                        : getTransparentColor(
                                                              theme,
                                                              "primary",
                                                              "10"
                                                          ),

                                                "& .MuiLinearProgress-bar":
                                                    {
                                                        borderRadius: 4,

                                                        backgroundColor:
                                                            courseColor,
                                                    },
                                            }}
                                        />
                                    </Box>
                                </Stack>
                            </Box>
                        );
                    })
                )}
            </Paper>

            {/* =================================================
                ADMINISTRATION
            ================================================= */}

            <Typography
                variant="h5"
                sx={{
                    fontWeight: 900,

                    mt: 6,
                    mb: 3,

                    fontSize: {
                        xs: 20,
                        sm: 24,
                    },
                }}
            >
                Administration
            </Typography>

            <Grid
                container
                spacing={{
                    xs: 2,
                    sm: 3,
                }}
            >
                {ACTION_CONFIG.map((item) => {
                    const Icon = item.icon;

                    const color = getThemeColor(
                        theme,
                        item.color
                    );

                    const darkColor =
                        getThemeDarkColor(
                            theme,
                            item.color
                        );

                    return (
                        <Grid
                            key={item.title}
                            size={{
                                xs: 12,
                                md: 4,
                            }}
                        >
                            <Paper
                                elevation={0}
                                onClick={() =>
                                    navigate(item.path)
                                }
                                sx={{
                                    p: {
                                        xs: 2.5,
                                        sm: 3,
                                    },

                                    borderRadius: 5,

                                    cursor: "pointer",

                                    position: "relative",
                                    overflow: "hidden",

                                    border: `1px solid ${
                                        isDark
                                            ? "rgba(255,255,255,0.08)"
                                            : theme.palette.divider
                                    }`,

                                    background: isDark
                                        ? "rgba(255,255,255,0.03)"
                                        : theme.palette
                                              .background
                                              .paper,

                                    boxShadow: isDark
                                        ? "none"
                                        : "0 1px 3px rgba(15,23,42,0.06)",

                                    transition:
                                        "all 0.25s ease",

                                    "&:before": {
                                        content: '""',

                                        position: "absolute",

                                        top: 0,
                                        left: 0,
                                        right: 0,

                                        height: 4,

                                        background: `linear-gradient(
                                            90deg,
                                            ${color},
                                            ${getTransparentColor(
                                                theme,
                                                item.color,
                                                "88"
                                            )}
                                        )`,
                                    },

                                    "&:hover": {
                                        transform:
                                            "translateY(-6px)",

                                        boxShadow: `0 20px 40px -10px ${getTransparentColor(
                                            theme,
                                            item.color,
                                            "45"
                                        )}`,

                                        borderColor:
                                            getTransparentColor(
                                                theme,
                                                item.color,
                                                "55"
                                            ),
                                    },
                                }}
                            >
                                <Stack
                                    sx={{
                                        flexDirection:
                                            "row",

                                        gap: 2,

                                        alignItems:
                                            "center",
                                    }}
                                >
                                    <Avatar
                                        sx={{
                                            width: {
                                                xs: 48,
                                                sm: 60,
                                            },

                                            height: {
                                                xs: 48,
                                                sm: 60,
                                            },

                                            background: `linear-gradient(
                                                135deg,
                                                ${color},
                                                ${darkColor}
                                            )`,

                                            boxShadow: `0 10px 25px ${getTransparentColor(
                                                theme,
                                                item.color,
                                                "55"
                                            )}`,

                                            flexShrink: 0,
                                        }}
                                    >
                                        <Icon />
                                    </Avatar>

                                    <Box
                                        sx={{
                                            flex: 1,
                                            minWidth: 0,
                                        }}
                                    >
                                        <Typography
                                            sx={{
                                                fontWeight: 900,
                                            }}
                                            noWrap
                                        >
                                            {item.title}
                                        </Typography>

                                        <Typography
                                            variant="body2"
                                            noWrap
                                            sx={{
                                                color:
                                                    "text.secondary",
                                            }}
                                        >
                                            {item.description}
                                        </Typography>

                                        <Button
                                            size="small"
                                            sx={{
                                                mt: 1,

                                                px: 0,

                                                fontWeight: 700,

                                                textTransform:
                                                    "none",

                                                color,

                                                "&:hover": {
                                                    background:
                                                        "transparent",

                                                    opacity: 0.8,
                                                },
                                            }}
                                            endIcon={
                                                <ArrowForward fontSize="small" />
                                            }
                                        >
                                            Open
                                        </Button>
                                    </Box>
                                </Stack>
                            </Paper>
                        </Grid>
                    );
                })}
            </Grid>

            {/* =================================================
                SYSTEM STATUS
            ================================================= */}

            <Paper
                elevation={0}
                sx={{
                    mt: 6,

                    p: {
                        xs: 3,
                        sm: 4,
                    },

                    borderRadius: 5,

                    position: "relative",
                    overflow: "hidden",

                    border: `1px solid ${
                        isDark
                            ? "rgba(255,255,255,0.08)"
                            : "transparent"
                    }`,

                    background: isDark
                        ? "rgba(255,255,255,0.03)"
                        : `linear-gradient(
                            135deg,
                            ${getTransparentColor(
                                theme,
                                "success",
                                "12"
                            )},
                            ${getTransparentColor(
                                theme,
                                "primary",
                                "0d"
                            )}
                        )`,

                    boxShadow: isDark
                        ? "none"
                        : "0 1px 3px rgba(15,23,42,0.06)",
                }}
            >
                <Box
                    sx={{
                        position: "absolute",

                        top: -40,
                        right: -40,

                        width: 160,
                        height: 160,

                        borderRadius: "50%",

                        background:
                            getTransparentColor(
                                theme,
                                "success",
                                "10"
                            ),

                        display: {
                            xs: "none",
                            sm: "block",
                        },
                    }}
                />

                <Stack
                    sx={{
                        flexDirection: {
                            xs: "column",
                            md: "row",
                        },

                        gap: {
                            xs: 2,
                            md: 3,
                        },

                        alignItems: {
                            xs: "flex-start",
                            md: "center",
                        },

                        position: "relative",

                        zIndex: 1,
                    }}
                >
                    <Avatar
                        sx={{
                            width: {
                                xs: 52,
                                sm: 65,
                            },

                            height: {
                                xs: 52,
                                sm: 65,
                            },

                            background: `linear-gradient(
                                135deg,
                                ${theme.palette.success.main},
                                ${theme.palette.success.dark}
                            )`,

                            boxShadow: `0 10px 25px ${getTransparentColor(
                                theme,
                                "success",
                                "55"
                            )}`,

                            flexShrink: 0,
                        }}
                    >
                        <Security />
                    </Avatar>

                    <Box
                        sx={{
                            flex: 1,
                            minWidth: 0,
                        }}
                    >
                        <Typography
                            sx={{
                                fontWeight: 900,

                                fontSize: {
                                    xs: 17,
                                    sm: 20,
                                },
                            }}
                        >
                            System Status
                        </Typography>

                        <Typography
                            sx={{
                                color: "text.secondary",

                                fontSize: {
                                    xs: 13.5,
                                    sm: 14,
                                },
                            }}
                        >
                            All LMS services are running normally.
                            Admin panel is secure and active.
                        </Typography>
                    </Box>

                    <Chip
                        label="ONLINE"
                        sx={{
                            fontWeight: 800,

                            px: 1,

                            color:
                                theme.palette.common.white,

                            alignSelf: {
                                xs: "flex-start",
                                md: "center",
                            },

                            background: `linear-gradient(
                                135deg,
                                ${theme.palette.success.main},
                                ${theme.palette.success.dark}
                            )`,

                            boxShadow: `0 6px 16px ${getTransparentColor(
                                theme,
                                "success",
                                "55"
                            )}`,

                            "& .MuiChip-label": {
                                px: 1.5,
                            },
                        }}
                    />
                </Stack>
            </Paper>
        </Container>
    );
};

export default AdminDashboard;