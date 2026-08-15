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

const AdminDashboard = () => {
    const navigate = useNavigate();
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";

    // Breakpoint helpers used to adapt things that plain sx breakpoints
    // can't reach (Recharts props, avatar sizes, etc.)
    const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // < 600px
    const isTablet = useMediaQuery(theme.breakpoints.down("md")); // < 900px

    const [dashboard, setDashboard] = useState({
        totalUsers: 0,
        totalStudents: 0,
        totalTeachers: 0,
        totalCourses: 0,
        totalEnrollments: 0,
    });

    const [monthlyUsers, setMonthlyUsers] = useState([]);
    const [courseEnrollment, setCourseEnrollment] = useState([]);
    const [topCourses, setTopCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadDashboard = async () => {
        try {
            setLoading(true);
            setError("");

            const dashboardRes = await api.get("/admin/dashboard");
            const usersRes = await getMonthlyUsers();
            const enrollmentRes = await getCourseEnrollment();
            const coursesRes = await getTopCourses();

            setDashboard(dashboardRes.data);
            setMonthlyUsers(usersRes.data);
            setCourseEnrollment(enrollmentRes.data);
            console.log('COURSE DATA:', enrollmentRes.data);
            setTopCourses(coursesRes.data);
            console.log('TOP COURSES DATA:', coursesRes.data);
        } catch (error) {
            console.log(error);
            setError("Unable to load admin dashboard");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadDashboard();
    }, []);

    if (loading) {
        return (
            <Box
                sx={{
                    height: "80vh",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 2,
                    px: 2,
                    textAlign: "center",
                }}
            >
                <CircularProgress size={50} thickness={4} />
                <Typography color="text.secondary" sx={{ fontWeight: 600 }}>
                    Loading your dashboard…
                </Typography>
            </Box>
        );
    }

    if (error) {
        return (
            <Container sx={{ mt: 5, px: { xs: 2, sm: 3 } }}>
                <Alert severity="error" sx={{ borderRadius: 3 }}>
                    {error}
                </Alert>

                <Button
                    fullWidth={isMobile}
                    sx={{ mt: 2, borderRadius: 3, textTransform: "none", fontWeight: 700 }}
                    variant="contained"
                    startIcon={<Refresh />}
                    onClick={loadDashboard}
                >
                    Retry
                </Button>
            </Container>
        );
    }

    const stats = [
        {
            title: "Total Users",
            value: dashboard.totalUsers,
            icon: <People />,
            growth: "+12%",
            color: "#2563eb",
        },
        {
            title: "Students",
            value: dashboard.totalStudents,
            icon: <School />,
            growth: "+18%",
            color: "#16a34a",
        },
        {
            title: "Teachers",
            value: dashboard.totalTeachers,
            icon: <Person />,
            growth: "+5%",
            color: "#f97316",
        },
        {
            title: "Courses",
            value: dashboard.totalCourses,
            icon: <MenuBook />,
            growth: "+9%",
            color: "#9333ea",
        },
        {
            title: "Enrollments",
            value: dashboard.totalEnrollments,
            icon: <Assignment />,
            growth: "+20%",
            color: "#0891b2",
        },
    ];

    const actions = [
        {
            title: "Manage Users",
            desc: "Students & Teachers",
            icon: <Group />,
            path: "/admin/users",
            color: "#2563eb",
        },
        {
            title: "Manage Courses",
            desc: "Review LMS Courses",
            icon: <LibraryBooks />,
            path: "/admin/courses",
            color: "#9333ea",
        },
        {
            title: "Enrollment Reports",
            desc: "Track learning activity",
            icon: <TrendingUp />,
            path: "/admin/enrollments",
            color: "#16a34a",
        },
    ];

    const barColors = ["#2563eb", "#16a34a", "#f97316", "#9333ea", "#0891b2", "#e11d48", "#ca8a04"];

    // Recharts doesn't understand MUI's sx breakpoints, so these are
    // computed from useMediaQuery above and passed as plain props.
    const chartHeight = isMobile ? 260 : 320;
    const chartPaperHeight = isMobile ? 340 : 420;
    const xAxisTickProps = isMobile
        ? { fontSize: 10, angle: -35, textAnchor: "end", height: 50, interval: 0 }
        : { fontSize: 12 };

    return (
        <Container maxWidth="xl" sx={{ py: { xs: 2, sm: 3, md: 4 }, px: { xs: 2, sm: 3 } }}>
            {/* HEADER */}
            <Paper
                elevation={0}
                sx={{
                    p: { xs: 2.5, sm: 3, md: 5 },
                    mb: 4,
                    borderRadius: { xs: 4, md: 6 },
                    color: "#fff",
                    position: "relative",
                    overflow: "hidden",
                    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                    boxShadow: `0 20px 50px -12px ${theme.palette.primary.main}55`,
                }}
            >
                {/* decorative blobs */}
                <Box
                    sx={{
                        position: "absolute",
                        top: -60,
                        right: -60,
                        width: 220,
                        height: 220,
                        borderRadius: "50%",
                        background: "rgba(255,255,255,0.08)",
                        display: { xs: "none", sm: "block" },
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
                        display: { xs: "none", sm: "block" },
                    }}
                />

                <Stack
                    sx={{
                        flexDirection: { xs: "column", md: "row" },
                        gap: { xs: 2.5, md: 3 },
                        justifyContent: "space-between",
                        alignItems: { xs: "flex-start", md: "center" },
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
                                fontSize: { xs: 22, sm: 28, md: 34 },
                                lineHeight: 1.2,
                            }}
                        >
                            Admin Control Center 🚀
                        </Typography>

                        <Typography sx={{ mt: 1, opacity: 0.9, maxWidth: 480, fontSize: { xs: 14, sm: 15 } }}>
                            Manage users, courses and analytics from one
                            powerful dashboard
                        </Typography>

                        <Chip
                            icon={<Security sx={{ color: "#fff !important" }} />}
                            label="Administrator Access"
                            sx={{
                                mt: { xs: 2, md: 3 },
                                color: "#fff",
                                fontWeight: 700,
                                backdropFilter: "blur(6px)",
                                background: "rgba(255,255,255,0.18)",
                                border: "1px solid rgba(255,255,255,0.25)",
                            }}
                        />
                    </Box>

                    <Avatar
                        sx={{
                            width: { xs: 56, sm: 70, md: 90 },
                            height: { xs: 56, sm: 70, md: 90 },
                            background: "rgba(255,255,255,0.20)",
                            border: "2px solid rgba(255,255,255,0.3)",
                            backdropFilter: "blur(6px)",
                            alignSelf: { xs: "flex-end", md: "center" },
                            flexShrink: 0,
                        }}
                    >
                        <Security fontSize="large" />
                    </Avatar>
                </Stack>
            </Paper>

           {/* STAT CARDS */}
            <Grid container spacing={{ xs: 2, sm: 3 }}>
                {stats.map((item) => (
                    <Grid
                        key={item.title}
                        size={{ xs: 12, sm: 6, md: 4, lg: 2.4 }}
                    >
                        <Paper
                            elevation={0}
                            sx={{
                                p: { xs: 2.5, sm: 3 },
                                minHeight: { xs: "auto", sm: 175 },
                                borderRadius: 5,
                                position: "relative",
                                overflow: "hidden",
                                cursor: "default",

                                background: isDark
                                    ? "rgba(255,255,255,0.03)"
                                    : `linear-gradient(160deg, ${item.color}12 0%, #ffffff 60%)`,

                                border: `1px solid ${
                                    isDark ? "rgba(255,255,255,0.08)" : `${item.color}25`
                                }`,

                                boxShadow: isDark
                                    ? "none"
                                    : "0 1px 3px rgba(15,23,42,0.05)",

                                transition: "all 0.25s ease",

                                "&:hover": {
                                    transform: "translateY(-6px)",
                                    boxShadow: `0 16px 32px -12px ${item.color}55`,
                                    borderColor: `${item.color}55`,
                                },

                                "&:before": {
                                    content: '""',
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                    width: 4,
                                    height: "100%",
                                    background: item.color,
                                },
                            }}
                        >
                            <Stack
                                sx={{
                                    flexDirection: "column",
                                    justifyContent: "space-between",
                                    height: "100%",
                                    gap: 2,
                                    position: "relative",
                                    zIndex: 1,
                                }}
                            >
                                <Stack
                                    sx={{
                                        flexDirection: "row",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        gap: 1,
                                    }}
                                >
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                        sx={{
                                            fontWeight: 700,
                                            lineHeight: 1.4,
                                        }}
                                    >
                                        {item.title}
                                    </Typography>

                                    <Avatar
                                        sx={{
                                            width: { xs: 38, sm: 44 },
                                            height: { xs: 38, sm: 44 },

                                            background: `${item.color}18`,
                                            color: item.color,

                                            flexShrink: 0,

                                            "& svg": {
                                                fontSize: { xs: 20, sm: 23 },
                                            },
                                        }}
                                    >
                                        {item.icon}
                                    </Avatar>
                                </Stack>

                                <Box>
                                    <Typography sx={{ fontSize: { xs: 28, sm: 36 }, fontWeight: 900, lineHeight: 1.1 }}>
                                        {item.value}
                                    </Typography>

                                    <Chip
                                        size="small"
                                        label={`${item.growth} this month`}
                                        sx={{
                                            mt: 1,
                                            fontSize: 11,
                                            background: `${item.color}18`,
                                            color: item.color,
                                            fontWeight: 800,
                                        }}
                                    />
                                </Box>
                            </Stack>
                        </Paper>
                    </Grid>
                ))}
            </Grid>

            {/* ANALYTICS TITLE */}
            <Typography variant="h5" sx={{ fontWeight: 900, mt: 6, mb: 3, fontSize: { xs: 20, sm: 24 } }}>
                Analytics Overview
            </Typography>

            <Grid container spacing={{ xs: 2, sm: 3 }}>
                {/* USER CHART */}
                <Grid size={{ xs: 12, lg: 6 }}>
                    <Paper
                        elevation={0}
                        sx={{
                            p: { xs: 2, sm: 3 },
                            height: chartPaperHeight,
                            borderRadius: 5,
                            border: `1px solid ${
                                isDark ? "rgba(255,255,255,0.08)" : theme.palette.divider
                            }`,
                            background: isDark ? "rgba(255,255,255,0.03)" : "#fff",
                            boxShadow: isDark ? "none" : "0 1px 3px rgba(15,23,42,0.06)",
                        }}
                    >
                        <Stack
                            sx={{
                                flexDirection: "row",
                                justifyContent: "space-between",
                                alignItems: "center",
                                mb: 3,
                                flexWrap: "wrap",
                                gap: 1,
                            }}
                        >
                            <Typography sx={{ fontWeight: 900 }}>User Growth</Typography>
                            <Chip
                                size="small"
                                label="Last 6 months"
                                sx={{ fontWeight: 700, fontSize: 11 }}
                            />
                        </Stack>

                        <ResponsiveContainer width="100%" height={chartHeight}>
                            <BarChart
                                data={monthlyUsers}
                                margin={isMobile ? { top: 0, right: 0, left: -20, bottom: 0 } : undefined}
                            >
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    vertical={false}
                                    stroke={isDark ? "rgba(255,255,255,0.08)" : "#eef0f4"}
                                />
                                <XAxis
                                    dataKey="month"
                                    tickLine={false}
                                    axisLine={false}
                                    {...xAxisTickProps}
                                />
                                <YAxis tickLine={false} axisLine={false} fontSize={isMobile ? 10 : 12} width={isMobile ? 28 : 36} />
                                <Tooltip
                                    cursor={{ fill: `${theme.palette.primary.main}0d` }}
                                    contentStyle={{
                                        borderRadius: 12,
                                        border: "none",
                                        boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                                    }}
                                />
                                <Bar
                                    dataKey="users"
                                    fill={theme.palette.primary.main}
                                    radius={[10, 10, 0, 0]}
                                    maxBarSize={isMobile ? 28 : 42}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>

                {/* COURSE CHART */}
                <Grid size={{ xs: 12, lg: 6 }}>
                    <Paper
                        elevation={0}
                        sx={{
                            p: { xs: 2, sm: 3 },
                            height: chartPaperHeight,
                            borderRadius: 5,
                            border: `1px solid ${
                                isDark ? "rgba(255,255,255,0.08)" : theme.palette.divider
                            }`,
                            background: isDark ? "rgba(255,255,255,0.03)" : "#fff",
                            boxShadow: isDark ? "none" : "0 1px 3px rgba(15,23,42,0.06)",
                        }}
                    >
                        <Stack
                            sx={{
                                flexDirection: "row",
                                justifyContent: "space-between",
                                alignItems: "center",
                                mb: 3,
                                flexWrap: "wrap",
                                gap: 1,
                            }}
                        >
                            <Typography sx={{ fontWeight: 900 }}>Course Enrollment</Typography>
                            <Chip
                                size="small"
                                label="By course"
                                sx={{ fontWeight: 700, fontSize: 11 }}
                            />
                        </Stack>

                        <ResponsiveContainer width="100%" height={chartHeight}>
                            <BarChart
                                data={courseEnrollment}
                                margin={isMobile ? { top: 0, right: 0, left: -20, bottom: 0 } : undefined}
                            >
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    vertical={false}
                                    stroke={isDark ? "rgba(255,255,255,0.08)" : "#eef0f4"}
                                />
                                <XAxis
                                    dataKey="course"
                                    tickLine={false}
                                    axisLine={false}
                                    {...xAxisTickProps}
                                />
                                <YAxis tickLine={false} axisLine={false} fontSize={isMobile ? 10 : 12} width={isMobile ? 28 : 36} />
                                <Tooltip
                                    cursor={{ fill: "rgba(0,0,0,0.03)" }}
                                    contentStyle={{
                                        borderRadius: 12,
                                        border: "none",
                                        boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                                    }}
                                />
                                <Bar dataKey="students" radius={[10, 10, 0, 0]} maxBarSize={isMobile ? 28 : 42}>
                                    {courseEnrollment.map((_, index) => (
                                        <Cell key={`cell-${index}`} fill={barColors[index % barColors.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>
            </Grid>

            {/* TOP COURSES */}
            <Typography variant="h5" sx={{ fontWeight: 900, mt: 6, mb: 3, fontSize: { xs: 20, sm: 24 } }}>
                🔥 Top Performing Courses
            </Typography>

            <Paper
                elevation={0}
                sx={{
                    borderRadius: 5,
                    overflow: "hidden",
                    border: `1px solid ${
                        isDark ? "rgba(255,255,255,0.08)" : theme.palette.divider
                    }`,
                    background: isDark ? "rgba(255,255,255,0.03)" : "#fff",
                }}
            >
                {topCourses.length === 0 ? (
                    <Box p={5} textAlign="center">
                        <Typography color="text.secondary">
                            No course analytics available
                        </Typography>
                    </Box>
                ) : (
                    topCourses.map((course, index) => (
                        <Box
                            key={course.id ?? course.courseId ?? `course-${index}`}
                            sx={{
                                p: { xs: 2, sm: 3 },
                                borderBottom: `1px solid ${
                                    isDark ? "rgba(255,255,255,0.06)" : theme.palette.divider
                                }`,
                                borderLeft: `4px solid ${barColors[index % barColors.length]}`,
                                transition: "background 0.2s ease",
                                "&:hover": {
                                    background: isDark
                                        ? "rgba(255,255,255,0.03)"
                                        : "rgba(37,99,235,0.03)",
                                },
                                "&:last-of-type": { borderBottom: "none" },
                            }}
                        >
                            <Stack
                                sx={{
                                    flexDirection: { xs: "column", sm: "row" },
                                    gap: 2,
                                    justifyContent: "space-between",
                                    alignItems: { xs: "flex-start", sm: "center" },
                                }}
                            >
                                <Stack
                                    sx={{
                                        flexDirection: "row",
                                        gap: 2,
                                        alignItems: "center",
                                        flex: 1,
                                        minWidth: 0,
                                        width: { xs: "100%", sm: "auto" },
                                    }}
                                >
                                    <Avatar
                                        sx={{
                                            width: { xs: 36, sm: 40 },
                                            height: { xs: 36, sm: 40 },
                                            fontWeight: 800,
                                            flexShrink: 0,
                                            bgcolor:
                                                index === 0
                                                    ? theme.palette.warning.main
                                                    : barColors[index % barColors.length],
                                        }}
                                    >
                                        {index + 1}
                                    </Avatar>

                                    <Box sx={{ minWidth: 0 }}>
                                        <Typography sx={{ fontWeight: 800 }} noWrap>
                                            {course.course  || "Course"}
                                        </Typography>

                                        <Typography variant="body2" color="text.secondary">
                                            {course.students  || 0} students enrolled
                                        </Typography>
                                    </Box>
                                </Stack>

                                <Box width={{ xs: "100%", sm: 250 }}>
                                    <LinearProgress
                                        variant="determinate"
                                        value={Math.min((course.students  || 0) * 5, 100)}
                                        sx={{
                                            height: 8,
                                            borderRadius: 4,
                                            backgroundColor: isDark
                                                ? "rgba(255,255,255,0.08)"
                                                : "rgba(37,99,235,0.1)",
                                            "& .MuiLinearProgress-bar": {
                                                borderRadius: 4,
                                                backgroundColor: barColors[index % barColors.length],
                                            },
                                        }}
                                    />
                                </Box>
                            </Stack>
                        </Box>
                    ))
                )}
            </Paper>

            {/* ADMIN ACTIONS */}
            <Typography variant="h5" sx={{ fontWeight: 900, mt: 6, mb: 3, fontSize: { xs: 20, sm: 24 } }}>
                Administration
            </Typography>

            <Grid container spacing={{ xs: 2, sm: 3 }}>
                {actions.map((item) => (
                    <Grid key={item.title} size={{ xs: 12, md: 4 }}>
                        <Paper
                            elevation={0}
                            onClick={() => navigate(item.path)}
                            sx={{
                                p: { xs: 2.5, sm: 3 },
                                borderRadius: 5,
                                cursor: "pointer",
                                position: "relative",
                                overflow: "hidden",
                                border: `1px solid ${
                                    isDark ? "rgba(255,255,255,0.08)" : theme.palette.divider
                                }`,
                                background: isDark ? "rgba(255,255,255,0.03)" : "#fff",
                                boxShadow: isDark ? "none" : "0 1px 3px rgba(15,23,42,0.06)",
                                transition: "all 0.25s ease",

                                "&:before": {
                                    content: '""',
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    height: 4,
                                    background: `linear-gradient(90deg, ${item.color}, ${item.color}88)`,
                                },

                                "&:hover": {
                                    transform: "translateY(-6px)",
                                    boxShadow: `0 20px 40px -10px ${item.color}45`,
                                    borderColor: `${item.color}55`,
                                },
                            }}
                        >
                            <Stack sx={{ flexDirection: "row", gap: 2, alignItems: "center" }}>
                                <Avatar
                                    sx={{
                                        width: { xs: 48, sm: 60 },
                                        height: { xs: 48, sm: 60 },
                                        background: `linear-gradient(135deg, ${item.color}, ${item.color}cc)`,
                                        boxShadow: `0 10px 25px ${item.color}55`,
                                        flexShrink: 0,
                                    }}
                                >
                                    {item.icon}
                                </Avatar>

                                <Box sx={{ flex: 1, minWidth: 0 }}>
                                    <Typography sx={{ fontWeight: 900 }} noWrap>{item.title}</Typography>

                                    <Typography variant="body2" color="text.secondary" noWrap>
                                        {item.desc}
                                    </Typography>

                                    <Button
                                        size="small"
                                        sx={{
                                            mt: 1,
                                            px: 0,
                                            fontWeight: 700,
                                            textTransform: "none",
                                            color: item.color,
                                            "&:hover": { background: "transparent", opacity: 0.8 },
                                        }}
                                        endIcon={<ArrowForward fontSize="small" />}
                                    >
                                        Open
                                    </Button>
                                </Box>
                            </Stack>
                        </Paper>
                    </Grid>
                ))}
            </Grid>

            {/* SYSTEM STATUS */}
            <Paper
                elevation={0}
                sx={{
                    mt: 6,
                    p: { xs: 3, sm: 4 },
                    borderRadius: 5,
                    position: "relative",
                    overflow: "hidden",
                    border: `1px solid ${
                        isDark ? "rgba(255,255,255,0.08)" : "transparent"
                    }`,
                    background: isDark
                        ? "rgba(255,255,255,0.03)"
                        : `linear-gradient(135deg, ${theme.palette.success.main}12, ${theme.palette.primary.main}0d)`,
                    boxShadow: isDark ? "none" : `0 1px 3px rgba(15,23,42,0.06)`,
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
                        background: `${theme.palette.success.main}10`,
                        display: { xs: "none", sm: "block" },
                    }}
                />

                <Stack
                    sx={{
                        flexDirection: { xs: "column", md: "row" },
                        gap: { xs: 2, md: 3 },
                        alignItems: { xs: "flex-start", md: "center" },
                        position: "relative",
                        zIndex: 1,
                    }}
                >
                    <Avatar
                        sx={{
                            width: { xs: 52, sm: 65 },
                            height: { xs: 52, sm: 65 },
                            background: `linear-gradient(135deg, ${theme.palette.success.main}, ${theme.palette.success.dark})`,
                            boxShadow: `0 10px 25px ${theme.palette.success.main}55`,
                            flexShrink: 0,
                        }}
                    >
                        <Security />
                    </Avatar>

                    <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography sx={{ fontWeight: 900, fontSize: { xs: 17, sm: 20 } }}>
                            System Status
                        </Typography>

                        <Typography color="text.secondary" sx={{ fontSize: { xs: 13.5, sm: 14 } }}>
                            All LMS services are running normally.
                            Admin panel is secure and active.
                        </Typography>
                    </Box>

                    <Chip
                        label="ONLINE"
                        sx={{
                            fontWeight: 800,
                            px: 1,
                            color: "#fff",
                            alignSelf: { xs: "flex-start", md: "center" },
                            background: `linear-gradient(135deg, ${theme.palette.success.main}, ${theme.palette.success.dark})`,
                            boxShadow: `0 6px 16px ${theme.palette.success.main}55`,
                            "& .MuiChip-label": { px: 1.5 },
                        }}
                    />
                </Stack>
            </Paper>
        </Container>
    );
};

export default AdminDashboard;
