import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    Container,
    Box,
    Typography,
    Grid,
    Card,
    CardContent,
    CardActions,
    Button,
    TextField,
    MenuItem,
    InputAdornment,
    Chip,
    CircularProgress,
    Alert,
    Paper,
    Stack,
} from "@mui/material";

import {
    Search,
    School,
    ArrowForward,
    Add,
} from "@mui/icons-material";

import { getCourses } from "../../services/courseService";


const CourseList = () => {

    const [courses, setCourses] = useState([]);
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("all");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const navigate = useNavigate();


    // =========================
    // FETCH COURSES
    // =========================

    useEffect(() => {

        fetchCourses();

    }, []);


    const fetchCourses = async () => {

        try {

            setLoading(true);
            setError("");

            const response = await getCourses();

            setCourses(response.data || []);

        } catch (error) {

            console.log("Course fetch error:", error);

            setError(
                error.response?.data?.message ||
                "Unable to load courses."
            );

        } finally {

            setLoading(false);

        }

    };


    // =========================
    // CATEGORIES
    // =========================

    const categories = useMemo(() => {

        const uniqueCategories = [
            ...new Set(
                courses
                    .map((course) => course.category)
                    .filter(Boolean)
            ),
        ];

        return uniqueCategories;

    }, [courses]);


    // =========================
    // FILTER COURSES
    // =========================

    const filteredCourses = useMemo(() => {

        return courses.filter((course) => {

            const searchText = search
                .trim()
                .toLowerCase();

            const matchesSearch =
                course.title
                    ?.toLowerCase()
                    .includes(searchText) ||

                course.description
                    ?.toLowerCase()
                    .includes(searchText);


            const matchesCategory =
                category === "all" ||
                course.category === category;


            return matchesSearch && matchesCategory;

        });

    }, [courses, search, category]);


    // =========================
    // CLEAR FILTERS
    // =========================

    const clearFilters = () => {

        setSearch("");
        setCategory("all");

    };


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

            <Box
                sx={{
                    display: "flex",
                    flexDirection: {
                        xs: "column",
                        md: "row",
                    },
                    justifyContent: "space-between",
                    alignItems: {
                        xs: "flex-start",
                        md: "center",
                    },
                    gap: 2,
                    mb: 4,
                }}
            >

                <Box>

                    <Typography
                        variant="h4"
                        fontWeight={700}
                        sx={{
                            fontSize: {
                                xs: "2rem",
                                md: "2.5rem",
                            },
                        }}
                    >
                        Explore Courses
                    </Typography>


                    <Typography
                        color="text.secondary"
                        sx={{
                            mt: 0.8,
                        }}
                    >
                        Learn new skills and grow your career
                    </Typography>

                </Box>


                <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() =>
                        navigate("/courses/create")
                    }
                >
                    Create Course
                </Button>

            </Box>


            {/* =========================
                SEARCH + FILTER
            ========================= */}

            <Paper
                elevation={0}
                sx={{
                    p: {
                        xs: 2,
                        md: 2.5,
                    },

                    mb: 4,

                    borderRadius: 3,

                    border: "1px solid",

                    borderColor: "divider",
                }}
            >

                <Grid
                    container
                    spacing={2}
                >

                    <Grid
                        size={{
                            xs: 12,
                            md: 8,
                        }}
                    >

                        <TextField
                            fullWidth
                            label="Search courses"
                            placeholder="Search by title or description..."
                            value={search}
                            onChange={(e) =>
                                setSearch(e.target.value)
                            }

                            slotProps={{
                                input: {
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Search />
                                        </InputAdornment>
                                    ),
                                },
                            }}
                        />

                    </Grid>


                    <Grid
                        size={{
                            xs: 12,
                            md: 4,
                        }}
                    >

                        <TextField
                            fullWidth
                            select
                            label="Category"
                            value={category}
                            onChange={(e) =>
                                setCategory(e.target.value)
                            }
                        >

                            <MenuItem value="all">
                                All Categories
                            </MenuItem>


                            {categories.map((item) => (

                                <MenuItem
                                    key={item}
                                    value={item}
                                >
                                    {item}
                                </MenuItem>

                            ))}

                        </TextField>

                    </Grid>

                </Grid>

            </Paper>


            {/* =========================
                ERROR
            ========================= */}

            {error && (

                <Alert
                    severity="error"
                    sx={{
                        mb: 3,
                    }}
                >
                    {error}
                </Alert>

            )}


            {/* =========================
                LOADING
            ========================= */}

            {loading ? (

                <Box
                    sx={{
                        minHeight: 300,

                        display: "flex",

                        justifyContent: "center",

                        alignItems: "center",
                    }}
                >

                    <CircularProgress />

                </Box>

            ) : (

                <>

                    {/* =========================
                        COURSE COUNT
                    ========================= */}

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
                            variant="h6"
                            fontWeight={600}
                        >
                            {filteredCourses.length}{" "}
                            {filteredCourses.length === 1
                                ? "Course"
                                : "Courses"}
                        </Typography>


                        {(search ||
                            category !== "all") && (

                            <Button
                                size="small"
                                onClick={clearFilters}
                            >
                                Clear Filters
                            </Button>

                        )}

                    </Box>


                    {/* =========================
                        EMPTY STATE
                    ========================= */}

                    {filteredCourses.length === 0 ? (

                        <Paper
                            elevation={0}
                            sx={{
                                p: {
                                    xs: 4,
                                    md: 7,
                                },

                                textAlign: "center",

                                borderRadius: 3,

                                border: "1px solid",

                                borderColor: "divider",
                            }}
                        >

                            <School
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
                                No courses found
                            </Typography>


                            <Typography
                                color="text.secondary"
                                sx={{
                                    mt: 1,
                                }}
                            >
                                Try changing your search
                                or category filter.
                            </Typography>


                            <Button
                                variant="outlined"
                                sx={{
                                    mt: 2.5,
                                }}
                                onClick={clearFilters}
                            >
                                Clear Filters
                            </Button>

                        </Paper>

                    ) : (

                        /* =========================
                           COURSE GRID
                        ========================= */

                        <Grid
                            container
                            spacing={3}
                        >

                            {filteredCourses.map((course) => (

                                <Grid
                                    key={course.id}
                                    size={{
                                        xs: 12,
                                        sm: 6,
                                        md: 4,
                                        lg: 3,
                                    }}
                                >

                                    <Card
                                        elevation={0}
                                        sx={{
                                            height: "100%",

                                            display: "flex",

                                            flexDirection:
                                                "column",

                                            borderRadius: 3,

                                            border:
                                                "1px solid",

                                            borderColor:
                                                "divider",

                                            overflow: "hidden",

                                            transition:
                                                "transform 0.2s ease, box-shadow 0.2s ease",

                                            "&:hover": {
                                                transform:
                                                    "translateY(-5px)",

                                                boxShadow:
                                                    "0 10px 30px rgba(0,0,0,0.1)",
                                            },
                                        }}
                                    >

                                        {/* COURSE HEADER */}

                                        <Box
                                            sx={{
                                                height: 130,

                                                display: "flex",

                                                justifyContent:
                                                    "center",

                                                alignItems:
                                                    "center",

                                                background:
                                                    "linear-gradient(135deg, #1976d2, #7b1fa2)",

                                                color: "white",
                                            }}
                                        >

                                            <School
                                                sx={{
                                                    fontSize: 55,
                                                }}
                                            />

                                        </Box>


                                        {/* COURSE CONTENT */}

                                        <CardContent
                                            sx={{
                                                flexGrow: 1,

                                                p: 2.5,
                                            }}
                                        >

                                            <Stack
                                                direction="row"
                                                spacing={1}
                                                sx={{
                                                    mb: 1.5,
                                                }}
                                            >

                                                {course.category && (

                                                    <Chip
                                                        label={
                                                            course.category
                                                        }
                                                        size="small"
                                                        color="primary"
                                                        variant="outlined"
                                                    />

                                                )}

                                            </Stack>


                                            <Typography
                                                variant="h6"
                                                fontWeight={700}
                                                sx={{
                                                    display:
                                                        "-webkit-box",

                                                    WebkitLineClamp: 2,

                                                    WebkitBoxOrient:
                                                        "vertical",

                                                    overflow:
                                                        "hidden",

                                                    minHeight: 58,
                                                }}
                                            >
                                                {course.title}
                                            </Typography>


                                            <Typography
                                                variant="body2"
                                                color="text.secondary"
                                                sx={{
                                                    mt: 1.5,

                                                    display:
                                                        "-webkit-box",

                                                    WebkitLineClamp: 3,

                                                    WebkitBoxOrient:
                                                        "vertical",

                                                    overflow:
                                                        "hidden",

                                                    minHeight: 60,
                                                }}
                                            >
                                                {course.description ||
                                                    "No description available for this course."}
                                            </Typography>


                                            <Typography
                                                variant="h6"
                                                fontWeight={700}
                                                color="primary"
                                                sx={{
                                                    mt: 2,
                                                }}
                                            >
                                                ₹{course.price ?? 0}
                                            </Typography>

                                        </CardContent>


                                        {/* CARD ACTION */}

                                        <CardActions
                                            sx={{
                                                p: 2.5,

                                                pt: 0,
                                            }}
                                        >

                                            <Button
                                                fullWidth
                                                variant="contained"
                                                endIcon={
                                                    <ArrowForward />
                                                }

                                                onClick={() =>
                                                    navigate(
                                                        `/courses/${course.id}`
                                                    )
                                                }
                                            >
                                                View Details
                                            </Button>

                                        </CardActions>

                                    </Card>

                                </Grid>

                            ))}

                        </Grid>

                    )}
                </>
            )}

        </Container>

    );

};


export default CourseList;