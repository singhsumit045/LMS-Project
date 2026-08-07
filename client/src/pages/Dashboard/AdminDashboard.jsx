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
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
} from "recharts";


import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import { useTheme } from "@mui/material/styles";


import api from "../../services/api";


import {
    getMonthlyUsers,
    getCourseEnrollment,
    getTopCourses,
} from "../../services/analyticsService";





const AdminDashboard = () => {


    const navigate = useNavigate();

    const theme = useTheme();





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



            const dashboardRes =
                await api.get("/admin/dashboard");



            const usersRes =
                await getMonthlyUsers();



            const enrollmentRes =
                await getCourseEnrollment();



            const coursesRes =
                await getTopCourses();




            setDashboard(
                dashboardRes.data
            );



            setMonthlyUsers(
                usersRes.data
            );



            setCourseEnrollment(
                enrollmentRes.data
            );



            setTopCourses(
                coursesRes.data
            );



        }

        catch (error) {


            console.log(error);


            setError(
                "Unable to load admin dashboard"
            );


        }


        finally {


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

                    alignItems: "center",

                    justifyContent: "center"

                }}

            >


                <CircularProgress size={55} />


            </Box>

        );


    }







    if (error) {


        return (

            <Container sx={{ mt: 5 }}>


                <Alert severity="error">

                    {error}

                </Alert>



                <Button

                    sx={{ mt: 2 }}

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

            color: "#2563eb"

        },



        {

            title: "Students",

            value: dashboard.totalStudents,

            icon: <School />,

            growth: "+18%",

            color: "#16a34a"

        },



        {

            title: "Teachers",

            value: dashboard.totalTeachers,

            icon: <Person />,

            growth: "+5%",

            color: "#f97316"

        },



        {

            title: "Courses",

            value: dashboard.totalCourses,

            icon: <MenuBook />,

            growth: "+9%",

            color: "#9333ea"

        },



        {

            title: "Enrollments",

            value: dashboard.totalEnrollments,

            icon: <Assignment />,

            growth: "+20%",

            color: "#0891b2"

        }



    ];







    const actions = [


        {

            title: "Manage Users",

            desc: "Students & Teachers",

            icon: <Group />,

            path: "/admin/users"

        },



        {

            title: "Manage Courses",

            desc: "Review LMS Courses",

            icon: <LibraryBooks />,

            path: "/admin/courses"

        },



        {

            title: "Enrollment Reports",

            desc: "Track learning activity",

            icon: <TrendingUp />,

            path: "/admin/enrollments"

        }



    ];







    return (

        <Container

            maxWidth="xl"

            sx={{

                py: 4

            }}

        >

            {/* HEADER */}


            <Paper

                sx={{

                    p: {
                        xs: 3,
                        md: 5
                    },

                    mb: 4,

                    borderRadius: 5,


                    color: "#fff",


                    background:

                        `linear-gradient(
135deg,
${theme.palette.primary.main},
${theme.palette.secondary.main}
)`

                }}

            >



                <Stack

                    direction={{

                        xs: "column",

                        md: "row"

                    }}

                    justifyContent="space-between"

                    alignItems="center"

                    spacing={3}

                >



                    <Box>


                        <Typography

                            variant="h4"

                            fontWeight={900}

                        >

                            Admin Control Center 🚀

                        </Typography>




                        <Typography

                            sx={{

                                mt: 1,

                                opacity: .85

                            }}

                        >

                            Manage users, courses and analytics from one powerful dashboard

                        </Typography>





                        <Chip

                            icon={<Security />}

                            label="Administrator Access"

                            sx={{

                                mt: 3,

                                color: "#fff",

                                background:

                                    "rgba(255,255,255,0.18)"

                            }}

                        />



                    </Box>

                    <Avatar

                        sx={{

                            width: 90,

                            height: 90,

                            background:

                                "rgba(255,255,255,0.20)"

                        }}

                    >


                        <Security

                            fontSize="large"

                        />


                    </Avatar>

                </Stack>

            </Paper>

            {/* STAT CARDS */}
            <Grid
                container
                spacing={3}
            >
                {
                    stats.map((item) => (
                        <Grid
                            key={item.title}

                            size={{

                                xs: 12,

                                sm: 6,

                                md: 4,

                                lg: 2.4

                            }}

                        >
                            <Paper

                                sx={{

                                    p: 3,

                                    height: 170,

                                    borderRadius: 5,

                                    position: "relative",

                                    overflow: "hidden",
                                    background:

                                        theme.palette.mode === "dark"

                                            ?

                                            `linear-gradient(
  135deg,
${item.color}35,
rgba(255,255,255,0.04)
)`

                                            :

                                            `linear-gradient(
135deg,
${item.color}20,
#ffffff
)`,




                                    border:

                                        `1px solid ${item.color}45`,



                                    transition: "0.3s",



                                    "&:hover": {


                                        transform: "translateY(-8px)",


                                        boxShadow:

                                            `0 15px 35px ${item.color}40`



                                    },



                                    "&:before": {


                                        content: '""',

                                        position: "absolute",

                                        top: -40,

                                        right: -40,

                                        width: 120,

                                        height: 120,

                                        borderRadius: "50%",

                                        background:

                                            `${item.color}25`

                                    }



                                }}

                            >




                                <Stack

                                    direction="row"

                                    justifyContent="space-between"

                                    alignItems="center"

                                    height="100%"

                                >



                                    <Box zIndex={2}>


                                        <Typography

                                            variant="body2"

                                            fontWeight={700}

                                            color="text.secondary"

                                        >

                                            {item.title}

                                        </Typography>





                                        <Typography

                                            fontSize={38}

                                            fontWeight={900}

                                            mt={1}

                                        >

                                            {item.value}

                                        </Typography>





                                        <Chip

                                            size="small"

                                            label={item.growth}

                                            sx={{

                                                mt: 1,


                                                background:

                                                    `${item.color}25`,


                                                color: item.color,


                                                fontWeight: 800

                                            }}

                                        />



                                    </Box>







                                    <Avatar

                                        sx={{

                                            width: 65,

                                            height: 65,
                                            left:40,


                                            background:

                                                item.color,


                                            boxShadow:

                                                `0 10px 25px ${item.color}70`

                                        }}

                                    >


                                        {item.icon}



                                    </Avatar>





                                </Stack>



                            </Paper>




                        </Grid>


                    ))


                }



            </Grid>









            {/* ANALYTICS TITLE */}



            <Typography

                variant="h5"

                fontWeight={900}

                sx={{

                    mt: 6,

                    mb: 3

                }}

            >

                Analytics Overview

            </Typography>









            <Grid

                container

                spacing={3}

            >







                {/* USER CHART */}



                <Grid

                    size={{

                        xs: 12,

                        lg: 6

                    }}

                >


                    <Paper

                        sx={{

                            p: 3,

                            height: 420,


                            borderRadius: 5,


                            border:

                                `1px solid ${theme.palette.divider}`

                        }}

                    >


                        <Typography

                            fontWeight={900}

                            mb={3}

                        >

                            User Growth

                        </Typography>





                        <ResponsiveContainer

                            width="100%"

                            height={320}

                        >


                            <BarChart

                                data={monthlyUsers}

                            >



                                <CartesianGrid

                                    strokeDasharray="3 3"

                                />



                                <XAxis

                                    dataKey="month"

                                />



                                <YAxis />



                                <Tooltip />



                                <Bar

                                    dataKey="users"

                                    fill={theme.palette.primary.main}

                                    radius={[8, 8, 0, 0]}

                                />



                            </BarChart>


                        </ResponsiveContainer>



                    </Paper>



                </Grid>









                {/* COURSE CHART */}



                <Grid

                    size={{

                        xs: 12,

                        lg: 6

                    }}

                >



                    <Paper

                        sx={{

                            p: 3,

                            height: 420,


                            borderRadius: 5,


                            border:

                                `1px solid ${theme.palette.divider}`

                        }}

                    >
                        <Typography

                            fontWeight={900}

                            mb={3}

                        >

                            Course Enrollment

                        </Typography>

                        <ResponsiveContainer

                            width="100%"

                            height={320}

                        >


                            <BarChart

                                data={courseEnrollment}

                            >



                                <CartesianGrid

                                    strokeDasharray="3 3"

                                />



                                <XAxis

                                    dataKey="course"

                                />


                                <YAxis />


                                <Tooltip />

                                <Bar

                                    dataKey="enrollments"

                                    fill={theme.palette.success.main}

                                    radius={[8, 8, 0, 0]}

                                />

                            </BarChart>
                        </ResponsiveContainer>
                    </Paper>

                </Grid>

            </Grid>

            {/* TOP COURSES */}

            <Typography
                variant="h5"
                fontWeight={900}
                sx={{ mt: 6, mb: 3 }}
            >
                🔥 Top Performing Courses
            </Typography>

            <Paper
                sx={{
                    borderRadius: 5,
                    overflow: "hidden",
                    border: `1px solid ${theme.palette.divider}`
                }}
            >

                {
                    topCourses.length === 0 ?

                        <Box p={5} textAlign="center">
                            <Typography color="text.secondary">
                                No course analytics available
                            </Typography>
                        </Box>

                        :

                        topCourses.map((course, index) => (

                            <Box
                                key={index}
                                sx={{
                                    p: 3,
                                    borderBottom: `1px solid ${theme.palette.divider}`
                                }}
                            >

                                <Stack
                                    direction={{ xs: "column", sm: "row" }}
                                    justifyContent="space-between"
                                    alignItems="center"
                                    spacing={2}
                                >

                                    <Stack
                                        direction="row"
                                        spacing={2}
                                        alignItems="center"
                                    >

                                        <Avatar
                                            sx={{
                                                bgcolor: index === 0
                                                    ? theme.palette.warning.main
                                                    : theme.palette.primary.main
                                            }}
                                        >
                                            {index + 1}
                                        </Avatar>

                                        <Box>
                                            <Typography fontWeight={900}>
                                                {course.title || "Course"}
                                            </Typography>

                                            <Typography
                                                variant="body2"
                                                color="text.secondary"
                                            >
                                                {course.enrollments || 0} students enrolled
                                            </Typography>

                                        </Box>

                                    </Stack>


                                    <Box width={{ xs: "100%", sm: 250 }}>
                                        <LinearProgress
                                            variant="determinate"
                                            value={Math.min((course.enrollments || 0) * 5, 100)}
                                        />
                                    </Box>


                                </Stack>

                            </Box>

                        ))

                }

            </Paper>





            {/* ADMIN ACTIONS */}

            <Typography
                variant="h5"
                fontWeight={900}
                sx={{ mt: 6, mb: 3 }}
            >
                Administration
            </Typography>


            <Grid container spacing={3}>

                {
                    actions.map((item) => (

                        <Grid
                            key={item.title}
                            size={{ xs: 12, md: 4 }}
                        >

                            <Paper
                                onClick={() => navigate(item.path)}
                                sx={{
                                    p: 3,
                                    borderRadius: 5,
                                    cursor: "pointer",
                                    border: `1px solid ${theme.palette.divider}`,
                                    transition: "0.3s",
                                    "&:hover": {
                                        transform: "translateY(-6px)",
                                        boxShadow: 8
                                    }
                                }}
                            >

                                <Stack
                                    direction="row"
                                    spacing={2}
                                    alignItems="center"
                                >

                                    <Avatar
                                        sx={{
                                            width: 60,
                                            height: 60,
                                            background:
                                                `linear-gradient(
135deg,
${theme.palette.primary.main},
${theme.palette.secondary.main}
)`
                                        }}
                                    >
                                        {item.icon}
                                    </Avatar>


                                    <Box>
                                        <Typography fontWeight={900}>
                                            {item.title}
                                        </Typography>

                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                        >
                                            {item.desc}
                                        </Typography>

                                        <Button
                                            size="small"
                                            sx={{ mt: 1 }}
                                            endIcon={<ArrowForward />}
                                        >
                                            Open
                                        </Button>

                                    </Box>

                                </Stack>

                            </Paper>

                        </Grid>

                    ))

                }

            </Grid>





            {/* SYSTEM STATUS */}

            <Paper
                sx={{
                    mt: 6,
                    p: 4,
                    borderRadius: 5,
                    border: `1px solid ${theme.palette.divider}`,
                    background:
                        theme.palette.mode === "dark"
                            ? "rgba(255,255,255,0.05)"
                            : "linear-gradient(135deg,#f8fafc,#eef2ff)"
                }}
            >

                <Stack
                    direction={{ xs: "column", md: "row" }}
                    spacing={3}
                    alignItems="center"
                >

                    <Avatar
                        sx={{
                            width: 65,
                            height: 65,
                            bgcolor: theme.palette.primary.main
                        }}
                    >
                        <Security />
                    </Avatar>


                    <Box flex={1}>
                        <Typography
                            fontWeight={900}
                            fontSize={20}
                        >
                            System Status
                        </Typography>

                        <Typography color="text.secondary">
                            All LMS services are running normally.
                            Admin panel is secure and active.
                        </Typography>

                    </Box>


                    <Chip
                        label="ONLINE"
                        color="success"
                        sx={{ fontWeight: 800 }}
                    />

                </Stack>

            </Paper>


        </Container>
    );
};

export default AdminDashboard;