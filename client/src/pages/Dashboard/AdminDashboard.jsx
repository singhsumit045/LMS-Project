import {
    Container,
    Box,
    Paper,
    Typography,
    Grid,
    Avatar,
    CircularProgress,
    Alert,
    Button,
    Stack,
    Chip,
} from "@mui/material";

import {
    People,
    School,
    MenuBook,
    Person,
    AdminPanelSettings,
    Refresh,
    ArrowForward,
    Group,
    LibraryBooks,
    HowToReg,
    Security,
} from "@mui/icons-material";

import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import api from "../../services/api";


const AdminDashboard = () => {

    const navigate = useNavigate();


    // =====================================================
    // DASHBOARD STATE
    // =====================================================

    const [dashboard, setDashboard] = useState({
        totalUsers: 0,
        totalStudents: 0,
        totalTeachers: 0,
        totalCourses: 0,
        totalEnrollments: 0,
    });

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");


    // =====================================================
    // FETCH ADMIN DASHBOARD
    // =====================================================

    const fetchAdminDashboard = async () => {

        try {

            setLoading(true);

            setError("");

            const response = await api.get(
                "/admin/dashboard"
            );

            setDashboard(response.data);

        } catch (error) {

            console.error(
                "Admin dashboard error:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Unable to load admin dashboard."
            );

        } finally {

            setLoading(false);

        }
    };


    // =====================================================
    // INITIAL LOAD
    // =====================================================

    useEffect(() => {

        fetchAdminDashboard();

    }, []);


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (
            <Box
                sx={{
                    minHeight: "75vh",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <CircularProgress />
            </Box>
        );

    }


    // =====================================================
    // ERROR
    // =====================================================

    if (error) {

        return (
            <Container
                maxWidth="xl"
                sx={{
                    py: 5,
                }}
            >

                <Alert
                    severity="error"
                    sx={{
                        mb: 2,
                        borderRadius: 2,
                    }}
                >
                    {error}
                </Alert>

                <Button
                    variant="contained"
                    startIcon={<Refresh />}
                    onClick={fetchAdminDashboard}
                    sx={{
                        textTransform: "none",
                        borderRadius: 2,
                    }}
                >
                    Try Again
                </Button>

            </Container>
        );

    }


    // =====================================================
    // STAT CARDS
    // =====================================================

    const stats = [

        {
            title: "Total Users",
            value: dashboard.totalUsers,
            icon: <People />,
            color: "primary.main",
            bg: "primary.50",
        },

        {
            title: "Students",
            value: dashboard.totalStudents,
            icon: <School />,
            color: "success.main",
            bg: "success.50",
        },

        {
            title: "Teachers",
            value: dashboard.totalTeachers,
            icon: <Person />,
            color: "warning.main",
            bg: "warning.50",
        },

        {
            title: "Courses",
            value: dashboard.totalCourses,
            icon: <MenuBook />,
            color: "secondary.main",
            bg: "secondary.50",
        },

        {
            title: "Enrollments",
            value: dashboard.totalEnrollments,
            icon: <HowToReg />,
            color: "info.main",
            bg: "info.50",
        },

    ];


    // =====================================================
    // ADMIN ACTIONS
    // =====================================================

    const adminActions = [

        {
            title: "Manage Users",
            description:
                "View, monitor and manage all registered students, teachers and admins.",
            icon: <Group />,
            color: "primary.main",
            action: () => navigate("/admin/users"),
        },

        {
            title: "Manage Courses",
            description:
                "View and manage all courses created by teachers on the platform.",
            icon: <LibraryBooks />,
            color: "secondary.main",
            action: () => navigate("/courses"),
        },

        {
            title: "Manage Enrollments",
            description:
                "Monitor student enrollments and course participation.",
            icon: <HowToReg />,
            color: "info.main",
            action: () => navigate("/admin/enrollments"),
        },

    ];


    // =====================================================
    // DASHBOARD
    // =====================================================

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

            {/* =================================================
                HERO SECTION
            ================================================= */}

            <Paper
                elevation={0}
                sx={{
                    position: "relative",
                    overflow: "hidden",

                    p: {
                        xs: 2.5,
                        sm: 4,
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
                        "linear-gradient(135deg, #1565c0 0%, #4527a0 100%)",
                }}
            >

                {/* Decorative Circle */}

                <Box
                    sx={{
                        position: "absolute",

                        width: {
                            xs: 160,
                            md: 320,
                        },

                        height: {
                            xs: 160,
                            md: 320,
                        },

                        borderRadius: "50%",

                        background:
                            "rgba(255,255,255,0.08)",

                        right: {
                            xs: -80,
                            md: -120,
                        },

                        top: {
                            xs: -80,
                            md: -150,
                        },
                    }}
                />


                {/* Second Decorative Circle */}

                <Box
                    sx={{
                        position: "absolute",

                        width: 120,
                        height: 120,

                        borderRadius: "50%",

                        background:
                            "rgba(255,255,255,0.05)",

                        right: {
                            xs: 70,
                            md: 180,
                        },

                        bottom: -70,
                    }}
                />


                <Box
                    sx={{
                        position: "relative",
                        zIndex: 1,
                    }}
                >

                    {/* Header */}

                    <Stack
                        direction={{
                            xs: "column",
                            sm: "row",
                        }}
                        spacing={2}
                        alignItems={{
                            xs: "flex-start",
                            sm: "center",
                        }}
                    >

                        <Avatar
                            sx={{
                                width: {
                                    xs: 55,
                                    sm: 65,
                                },

                                height: {
                                    xs: 55,
                                    sm: 65,
                                },

                                bgcolor:
                                    "rgba(255,255,255,0.18)",

                                backdropFilter:
                                    "blur(5px)",
                            }}
                        >
                            <AdminPanelSettings
                                sx={{
                                    fontSize: {
                                        xs: 32,
                                        sm: 40,
                                    },
                                }}
                            />
                        </Avatar>


                        <Box>

                            <Typography
                                sx={{
                                    fontSize: {
                                        xs: "1.65rem",
                                        sm: "2.2rem",
                                        md: "2.8rem",
                                    },

                                    fontWeight: 800,

                                    lineHeight: 1.2,
                                }}
                            >
                                Admin Dashboard
                            </Typography>


                            <Typography
                                sx={{
                                    mt: 0.8,

                                    opacity: 0.9,

                                    fontSize: {
                                        xs: "0.9rem",
                                        sm: "1rem",
                                    },

                                    maxWidth: 700,
                                }}
                            >
                                Manage your LMS platform,
                                users, courses and
                                enrollments from one place.
                            </Typography>

                        </Box>

                    </Stack>


                    {/* Status */}

                    <Stack
                        direction="row"
                        spacing={1}
                        sx={{
                            mt: 3,
                        }}
                    >

                        <Chip
                            icon={<Security />}
                            label="Administrator Access"
                            sx={{
                                color: "white",

                                backgroundColor:
                                    "rgba(255,255,255,0.15)",

                                border:
                                    "1px solid rgba(255,255,255,0.25)",

                                fontWeight: 600,
                            }}
                        />

                    </Stack>

                </Box>

            </Paper>


            {/* =================================================
                OVERVIEW HEADER
            ================================================= */}

            <Box
                sx={{
                    display: "flex",

                    alignItems: {
                        xs: "flex-start",
                        sm: "center",
                    },

                    justifyContent: "space-between",

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
                        fontWeight={800}
                        sx={{
                            fontSize: {
                                xs: "1.35rem",
                                sm: "1.55rem",
                            },
                        }}
                    >
                        Platform Overview
                    </Typography>


                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                            mt: 0.5,
                        }}
                    >
                        Monitor your LMS statistics at a glance.
                    </Typography>

                </Box>


                <Button
                    variant="outlined"
                    startIcon={<Refresh />}
                    onClick={fetchAdminDashboard}
                    sx={{
                        borderRadius: 2,
                        textTransform: "none",
                        fontWeight: 600,
                    }}
                >
                    Refresh
                </Button>

            </Box>


            {/* =================================================
                STAT CARDS
            ================================================= */}

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

                {stats.map((stat) => (

                    <Grid
                        key={stat.title}
                        size={{
                            xs: 12,
                            sm: 6,
                            md: 4,
                            lg: 2.4,
                        }}
                    >

                        <StatCard
                            title={stat.title}
                            value={stat.value}
                            icon={stat.icon}
                            color={stat.color}
                        />

                    </Grid>

                ))}

            </Grid>


            {/* =================================================
                ADMINISTRATION
            ================================================= */}

            <Box
                sx={{
                    mb: 2.5,
                }}
            >

                <Typography
                    variant="h5"
                    fontWeight={800}
                    sx={{
                        fontSize: {
                            xs: "1.35rem",
                            sm: "1.55rem",
                        },
                    }}
                >
                    Administration
                </Typography>


                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                        mt: 0.5,
                    }}
                >
                    Manage important parts of your LMS.
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

                {adminActions.map((item) => (

                    <Grid
                        key={item.title}
                        size={{
                            xs: 12,
                            md: 4,
                        }}
                    >

                        <AdminActionCard
                            title={item.title}
                            description={item.description}
                            icon={item.icon}
                            color={item.color}
                            onClick={item.action}
                        />

                    </Grid>

                ))}

            </Grid>


            {/* =================================================
                QUICK SUMMARY
            ================================================= */}

            <Paper
                elevation={0}
                sx={{
                    mt: {
                        xs: 3,
                        md: 4,
                    },

                    p: {
                        xs: 2.5,
                        sm: 3,
                    },

                    borderRadius: 3,

                    border: "1px solid",

                    borderColor: "divider",
                }}
            >

                <Stack
                    direction={{
                        xs: "column",
                        sm: "row",
                    }}
                    spacing={2}
                    alignItems={{
                        xs: "flex-start",
                        sm: "center",
                    }}
                >

                    <Avatar
                        sx={{
                            bgcolor: "primary.main",
                        }}
                    >
                        <AdminPanelSettings />
                    </Avatar>


                    <Box sx={{ flex: 1 }}>

                        <Typography
                            fontWeight={700}
                        >
                            Admin Control Center
                        </Typography>


                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                                mt: 0.3,
                            }}
                        >
                            You have full administrative
                            access to the LMS platform.
                        </Typography>

                    </Box>


                    <Chip
                        label="System Active"
                        color="success"
                        variant="outlined"
                        sx={{
                            fontWeight: 600,
                        }}
                    />

                </Stack>

            </Paper>

        </Container>
    );
};


// =====================================================
// STAT CARD
// =====================================================

const StatCard = ({
    title,
    value,
    icon,
    color,
}) => {

    return (

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
                        "translateY(-5px)",

                    boxShadow:
                        "0 12px 30px rgba(0,0,0,0.08)",
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
                            xs: "0.82rem",
                            sm: "0.88rem",
                        }}
                        fontWeight={500}
                    >
                        {title}
                    </Typography>


                    <Typography
                        fontWeight={800}
                        sx={{
                            mt: 0.5,

                            fontSize: {
                                xs: "1.75rem",
                                sm: "2rem",
                                md: "2.15rem",
                            },
                        }}
                    >
                        {value}
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

                        bgcolor: color,
                    }}
                >
                    {icon}
                </Avatar>

            </Box>

        </Paper>

    );
};


// =====================================================
// ADMIN ACTION CARD
// =====================================================

const AdminActionCard = ({
    title,
    description,
    icon,
    color,
    onClick,
}) => {

    return (

        <Paper
            elevation={0}
            sx={{
                p: {
                    xs: 2.5,
                    sm: 3,
                },

                borderRadius: 3,

                border: "1px solid",

                borderColor: "divider",

                height: "100%",

                cursor: "pointer",

                transition:
                    "all 0.25s ease",

                "&:hover": {
                    transform:
                        "translateY(-5px)",

                    boxShadow:
                        "0 12px 30px rgba(0,0,0,0.08)",

                    borderColor: color,
                },
            }}

            onClick={onClick}
        >

            <Stack
                direction="row"
                spacing={2}
                alignItems="flex-start"
            >

                <Avatar
                    sx={{
                        width: 52,
                        height: 52,
                        bgcolor: color,
                        flexShrink: 0,
                    }}
                >
                    {icon}
                </Avatar>


                <Box sx={{ flex: 1 }}>

                    <Typography
                        variant="h6"
                        fontWeight={750}
                    >
                        {title}
                    </Typography>


                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                            mt: 0.7,
                            lineHeight: 1.6,
                        }}
                    >
                        {description}
                    </Typography>


                    <Button
                        size="small"
                        endIcon={<ArrowForward />}
                        sx={{
                            mt: 1.5,

                            px: 0,

                            textTransform: "none",

                            fontWeight: 700,

                            "&:hover": {
                                backgroundColor:
                                    "transparent",
                            },
                        }}
                    >
                        Open
                    </Button>

                </Box>

            </Stack>

        </Paper>

    );
};


export default AdminDashboard;