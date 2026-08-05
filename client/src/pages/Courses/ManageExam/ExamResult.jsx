
import {
    Container,
    Box,
    Paper,
    Typography,
    CircularProgress,
    Alert,
    Chip,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    TextField,
    MenuItem,
    InputAdornment,
    Avatar,
    Grid,
    Divider,
} from "@mui/material";

import {
    ArrowBack,
    Assessment,
    Person,
    School,
    Search,
    CheckCircle,
    Cancel,
    TrendingUp,
    FilterList,
    Clear,
} from "@mui/icons-material";

import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getTeacherExamResults } from "../../../services/examService";

const ExamResult = () => {
    const navigate = useNavigate();

    // =====================================================
    // STATES
    // =====================================================

    const [results, setResults] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [searchTerm, setSearchTerm] = useState("");

    const [selectedExam, setSelectedExam] = useState("all");

    // =====================================================
    // FETCH RESULTS
    // =====================================================

    useEffect(() => {
        fetchResults();
    }, []);

    const fetchResults = async () => {
        try {
            setLoading(true);
            setError("");

            const data = await getTeacherExamResults();

            console.log(
                "Teacher exam results:",
                data
            );

            if (Array.isArray(data)) {
                setResults(data);
            } else if (
                Array.isArray(data?.results)
            ) {
                setResults(data.results);
            } else {
                setResults([]);
            }
        } catch (error) {
            console.error(
                "Teacher exam results error:",
                error
            );

            setError(
                error.response?.data?.message ||
                    "Unable to load exam results."
            );
        } finally {
            setLoading(false);
        }
    };

    // =====================================================
    // DATA HELPERS
    // =====================================================

    const getStudentName = (result) => {
        return (
            result.studentName ||
            result.student?.name ||
            result.user?.name ||
            result.attempt?.student?.name ||
            "N/A"
        );
    };

    const getExamTitle = (result) => {
        return (
            result.examTitle ||
            result.exam?.title ||
            result.attempt?.exam?.title ||
            "N/A"
        );
    };

    const getScore = (result) => {
        return Number(
            result.score ??
                result.obtainedMarks ??
                result.marksObtained ??
                result.totalScore ??
                0
        );
    };

    const getTotalMarks = (result) => {
        return Number(
            result.totalMarks ??
                result.exam?.totalMarks ??
                result.total ??
                0
        );
    };

    const getPercentage = (result) => {
        if (
            result.percentage !== undefined &&
            result.percentage !== null
        ) {
            return Number(result.percentage);
        }

        const score = getScore(result);
        const total = getTotalMarks(result);

        if (!total) {
            return 0;
        }

        return (score / total) * 100;
    };

    const getStatus = (result) => {
        if (
            result.passed !== undefined &&
            result.passed !== null
        ) {
            return result.passed
                ? "Passed"
                : "Failed";
        }

        return getPercentage(result) >= 40
            ? "Passed"
            : "Failed";
    };

    // =====================================================
    // UNIQUE EXAMS
    // =====================================================

    const examOptions = useMemo(() => {
        const exams = results.map((result) =>
            getExamTitle(result)
        );

        return [...new Set(exams)].filter(
            (exam) => exam !== "N/A"
        );
    }, [results]);

    // =====================================================
    // FILTER RESULTS
    // =====================================================

    const filteredResults = useMemo(() => {
        return results.filter((result) => {
            const studentName =
                getStudentName(result).toLowerCase();

            const examTitle =
                getExamTitle(result).toLowerCase();

            const search =
                searchTerm.toLowerCase().trim();

            const matchesSearch =
                !search ||
                studentName.includes(search) ||
                examTitle.includes(search);

            const matchesExam =
                selectedExam === "all" ||
                getExamTitle(result) ===
                    selectedExam;

            return (
                matchesSearch &&
                matchesExam
            );
        });
    }, [
        results,
        searchTerm,
        selectedExam,
    ]);

    // =====================================================
    // STATISTICS
    // =====================================================

    const statistics = useMemo(() => {
        const totalAttempts =
            filteredResults.length;

        const passedCount =
            filteredResults.filter(
                (result) =>
                    getStatus(result) === "Passed"
            ).length;

        const failedCount =
            filteredResults.filter(
                (result) =>
                    getStatus(result) === "Failed"
            ).length;

        const totalPercentage =
            filteredResults.reduce(
                (total, result) =>
                    total +
                    getPercentage(result),
                0
            );

        const averageScore =
            totalAttempts > 0
                ? totalPercentage /
                  totalAttempts
                : 0;

        return {
            totalAttempts,
            passedCount,
            failedCount,
            averageScore,
        };
    }, [filteredResults]);

    // =====================================================
    // CLEAR FILTERS
    // =====================================================

    const clearFilters = () => {
        setSearchTerm("");
        setSelectedExam("all");
    };

    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {
        return (
            <Container
                maxWidth="xl"
                sx={{
                    minHeight: "70vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <CircularProgress />
            </Container>
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
                        mb: 3,
                        borderRadius: 2,
                    }}
                >
                    {error}
                </Alert>

                <Button
                    variant="outlined"
                    startIcon={<ArrowBack />}
                    onClick={() =>
                        navigate(
                            "/dashboard"
                        )
                    }
                    sx={{
                        textTransform:
                            "none",
                        borderRadius: 2,
                    }}
                >
                    Back to Dashboard
                </Button>
            </Container>
        );
    }

    // =====================================================
    // PAGE
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
                HEADER
            ================================================= */}

            <Box
                sx={{
                    display: "flex",
                    flexDirection: {
                        xs: "column",
                        sm: "row",
                    },
                    justifyContent:
                        "space-between",
                    alignItems: {
                        xs: "flex-start",
                        sm: "center",
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
                                xs: "1.7rem",
                                sm: "2rem",
                                md: "2.3rem",
                            },
                        }}
                    >
                        Exam Results
                    </Typography>

                    <Typography
                        color="text.secondary"
                        sx={{
                            mt: 0.7,
                        }}
                    >
                        Monitor student performance
                        and exam results
                    </Typography>
                </Box>

                <Button
                    variant="outlined"
                    startIcon={<ArrowBack />}
                    onClick={() =>
                        navigate(
                            "/dashboard"
                        )
                    }
                    sx={{
                        textTransform:
                            "none",
                        borderRadius: 2,
                    }}
                >
                    Back to Dashboard
                </Button>
            </Box>

            {/* =================================================
                STATISTICS CARDS
            ================================================= */}

            <Grid
                container
                spacing={{
                    xs: 2,
                    sm: 2.5,
                    md: 3,
                }}
                sx={{
                    mb: 4,
                }}
            >
                {/* TOTAL ATTEMPTS */}

                <Grid
                    size={{
                        xs: 12,
                        sm: 6,
                        md: 3,
                    }}
                >
                    <Paper
                        elevation={0}
                        sx={{
                            p: 2.5,
                            borderRadius: 3,
                            border: "1px solid",
                            borderColor:
                                "divider",
                            height: "100%",
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
                                gap: 2,
                            }}
                        >
                            <Box>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    Total Attempts
                                </Typography>

                                <Typography
                                    variant="h4"
                                    fontWeight={700}
                                    sx={{
                                        mt: 0.5,
                                    }}
                                >
                                    {
                                        statistics.totalAttempts
                                    }
                                </Typography>
                            </Box>

                            <Avatar
                                sx={{
                                    bgcolor:
                                        "primary.main",
                                }}
                            >
                                <Assessment />
                            </Avatar>
                        </Box>
                    </Paper>
                </Grid>

                {/* AVERAGE SCORE */}

                <Grid
                    size={{
                        xs: 12,
                        sm: 6,
                        md: 3,
                    }}
                >
                    <Paper
                        elevation={0}
                        sx={{
                            p: 2.5,
                            borderRadius: 3,
                            border: "1px solid",
                            borderColor:
                                "divider",
                            height: "100%",
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
                                gap: 2,
                            }}
                        >
                            <Box>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    Average Score
                                </Typography>

                                <Typography
                                    variant="h4"
                                    fontWeight={700}
                                    sx={{
                                        mt: 0.5,
                                    }}
                                >
                                    {statistics.averageScore.toFixed(
                                        1
                                    )}
                                    %
                                </Typography>
                            </Box>

                            <Avatar
                                sx={{
                                    bgcolor:
                                        "info.main",
                                }}
                            >
                                <TrendingUp />
                            </Avatar>
                        </Box>
                    </Paper>
                </Grid>

                {/* PASSED */}

                <Grid
                    size={{
                        xs: 12,
                        sm: 6,
                        md: 3,
                    }}
                >
                    <Paper
                        elevation={0}
                        sx={{
                            p: 2.5,
                            borderRadius: 3,
                            border: "1px solid",
                            borderColor:
                                "divider",
                            height: "100%",
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
                                gap: 2,
                            }}
                        >
                            <Box>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    Passed
                                </Typography>

                                <Typography
                                    variant="h4"
                                    fontWeight={700}
                                    sx={{
                                        mt: 0.5,
                                    }}
                                >
                                    {
                                        statistics.passedCount
                                    }
                                </Typography>
                            </Box>

                            <Avatar
                                sx={{
                                    bgcolor:
                                        "success.main",
                                }}
                            >
                                <CheckCircle />
                            </Avatar>
                        </Box>
                    </Paper>
                </Grid>

                {/* FAILED */}

                <Grid
                    size={{
                        xs: 12,
                        sm: 6,
                        md: 3,
                    }}
                >
                    <Paper
                        elevation={0}
                        sx={{
                            p: 2.5,
                            borderRadius: 3,
                            border: "1px solid",
                            borderColor:
                                "divider",
                            height: "100%",
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
                                gap: 2,
                            }}
                        >
                            <Box>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    Failed
                                </Typography>

                                <Typography
                                    variant="h4"
                                    fontWeight={700}
                                    sx={{
                                        mt: 0.5,
                                    }}
                                >
                                    {
                                        statistics.failedCount
                                    }
                                </Typography>
                            </Box>

                            <Avatar
                                sx={{
                                    bgcolor:
                                        "error.main",
                                }}
                            >
                                <Cancel />
                            </Avatar>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>

            {/* =================================================
                FILTER SECTION
            ================================================= */}

            <Paper
                elevation={0}
                sx={{
                    p: {
                        xs: 2,
                        sm: 2.5,
                        md: 3,
                    },
                    mb: 3,
                    borderRadius: 3,
                    border: "1px solid",
                    borderColor:
                        "divider",
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        alignItems:
                            "center",
                        gap: 1,
                        mb: 2,
                    }}
                >
                    <FilterList
                        color="primary"
                    />

                    <Typography
                        fontWeight={700}
                    >
                        Filter Results
                    </Typography>
                </Box>

                <Divider
                    sx={{
                        mb: 2.5,
                    }}
                />

                <Grid
                    container
                    spacing={2}
                    alignItems="center"
                >
                    {/* SEARCH */}

                    <Grid
                        size={{
                            xs: 12,
                            md: 6,
                        }}
                    >
                        <TextField
                            fullWidth
                            label="Search student or exam"
                            placeholder="Search by name or exam..."
                            value={
                                searchTerm
                            }
                            onChange={(event) =>
                                setSearchTerm(
                                    event
                                        .target
                                        .value
                                )
                            }
                            size="small"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Search />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Grid>

                    {/* EXAM FILTER */}

                    <Grid
                        size={{
                            xs: 12,
                            sm: 8,
                            md: 4,
                        }}
                    >
                        <TextField
                            select
                            fullWidth
                            label="Filter by exam"
                            value={
                                selectedExam
                            }
                            onChange={(event) =>
                                setSelectedExam(
                                    event
                                        .target
                                        .value
                                )
                            }
                            size="small"
                        >
                            <MenuItem value="all">
                                All Exams
                            </MenuItem>

                            {examOptions.map(
                                (exam) => (
                                    <MenuItem
                                        key={
                                            exam
                                        }
                                        value={
                                            exam
                                        }
                                    >
                                        {exam}
                                    </MenuItem>
                                )
                            )}
                        </TextField>
                    </Grid>

                    {/* CLEAR */}

                    <Grid
                        size={{
                            xs: 12,
                            sm: 4,
                            md: 2,
                        }}
                    >
                        <Button
                            fullWidth
                            variant="outlined"
                            startIcon={
                                <Clear />
                            }
                            onClick={
                                clearFilters
                            }
                            sx={{
                                height: 40,
                                borderRadius: 2,
                                textTransform:
                                    "none",
                            }}
                        >
                            Clear
                        </Button>
                    </Grid>
                </Grid>
            </Paper>

            {/* =================================================
                RESULTS HEADER
            ================================================= */}

            <Box
                sx={{
                    display: "flex",
                    flexDirection: {
                        xs: "column",
                        sm: "row",
                    },
                    alignItems: {
                        xs: "flex-start",
                        sm: "center",
                    },
                    justifyContent:
                        "space-between",
                    gap: 1,
                    mb: 2,
                }}
            >
                <Box>
                    <Typography
                        variant="h6"
                        fontWeight={700}
                    >
                        Student Results
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                            mt: 0.4,
                        }}
                    >
                        Showing{" "}
                        {
                            filteredResults.length
                        }{" "}
                        of {results.length}{" "}
                        results
                    </Typography>
                </Box>

                {selectedExam !==
                    "all" && (
                    <Chip
                        icon={<School />}
                        label={
                            selectedExam
                        }
                        color="primary"
                        variant="outlined"
                    />
                )}
            </Box>

            {/* =================================================
                NO FILTERED RESULTS
            ================================================= */}

            {filteredResults.length ===
            0 ? (
                <Paper
                    elevation={0}
                    sx={{
                        p: {
                            xs: 4,
                            sm: 6,
                        },
                        textAlign:
                            "center",
                        borderRadius: 3,
                        border: "1px solid",
                        borderColor:
                            "divider",
                    }}
                >
                    <Search
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
                        No results found
                    </Typography>

                    <Typography
                        color="text.secondary"
                        sx={{
                            mt: 1,
                        }}
                    >
                        Try changing your
                        search or filters.
                    </Typography>

                    <Button
                        variant="outlined"
                        startIcon={
                            <Clear />
                        }
                        onClick={
                            clearFilters
                        }
                        sx={{
                            mt: 2,
                            textTransform:
                                "none",
                            borderRadius: 2,
                        }}
                    >
                        Clear Filters
                    </Button>
                </Paper>
            ) : (
                /* =================================================
                   RESULTS TABLE
                ================================================= */

                <TableContainer
                    component={Paper}
                    elevation={0}
                    sx={{
                        borderRadius: 3,
                        border: "1px solid",
                        borderColor:
                            "divider",
                        overflowX: "auto",
                    }}
                >
                    <Table
                        sx={{
                            minWidth: 800,
                        }}
                    >
                        <TableHead>
                            <TableRow
                                sx={{
                                    bgcolor:
                                        "action.hover",
                                }}
                            >
                                <TableCell>
                                    <strong>
                                        #
                                    </strong>
                                </TableCell>

                                <TableCell>
                                    <strong>
                                        Student
                                    </strong>
                                </TableCell>

                                <TableCell>
                                    <strong>
                                        Exam
                                    </strong>
                                </TableCell>

                                <TableCell>
                                    <strong>
                                        Score
                                    </strong>
                                </TableCell>

                                <TableCell>
                                    <strong>
                                        Percentage
                                    </strong>
                                </TableCell>

                                <TableCell>
                                    <strong>
                                        Status
                                    </strong>
                                </TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {filteredResults.map(
                                (
                                    result,
                                    index
                                ) => {
                                    const score =
                                        getScore(
                                            result
                                        );

                                    const totalMarks =
                                        getTotalMarks(
                                            result
                                        );

                                    const percentage =
                                        getPercentage(
                                            result
                                        );

                                    const status =
                                        getStatus(
                                            result
                                        );

                                    return (
                                        <TableRow
                                            key={
                                                result.id ||
                                                index
                                            }
                                            hover
                                        >
                                            {/* INDEX */}

                                            <TableCell>
                                                <Typography
                                                    variant="body2"
                                                    fontWeight={
                                                        600
                                                    }
                                                    color="text.secondary"
                                                >
                                                    {index +
                                                        1}
                                                </Typography>
                                            </TableCell>

                                            {/* STUDENT */}

                                            <TableCell>
                                                <Box
                                                    sx={{
                                                        display:
                                                            "flex",
                                                        alignItems:
                                                            "center",
                                                        gap: 1.5,
                                                    }}
                                                >
                                                    <Avatar
                                                        sx={{
                                                            width: 38,
                                                            height: 38,
                                                            bgcolor:
                                                                "primary.main",
                                                        }}
                                                    >
                                                        {getStudentName(
                                                            result
                                                        )
                                                            .charAt(
                                                                0
                                                            )
                                                            .toUpperCase()}
                                                    </Avatar>

                                                    <Box>
                                                        <Typography
                                                            fontWeight={
                                                                600
                                                            }
                                                        >
                                                            {getStudentName(
                                                                result
                                                            )}
                                                        </Typography>

                                                        <Typography
                                                            variant="caption"
                                                            color="text.secondary"
                                                        >
                                                            Student
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            </TableCell>

                                            {/* EXAM */}

                                            <TableCell>
                                                <Box
                                                    sx={{
                                                        display:
                                                            "flex",
                                                        alignItems:
                                                            "center",
                                                        gap: 1,
                                                    }}
                                                >
                                                    <School
                                                        fontSize="small"
                                                        color="primary"
                                                    />

                                                    <Typography
                                                        fontWeight={
                                                            500
                                                        }
                                                    >
                                                        {getExamTitle(
                                                            result
                                                        )}
                                                    </Typography>
                                                </Box>
                                            </TableCell>

                                            {/* SCORE */}

                                            <TableCell>
                                                <Typography
                                                    fontWeight={
                                                        700
                                                    }
                                                >
                                                    {score}

                                                    {totalMarks
                                                        ? ` / ${totalMarks}`
                                                        : ""}
                                                </Typography>
                                            </TableCell>

                                            {/* PERCENTAGE */}

                                            <TableCell>
                                                <Typography
                                                    fontWeight={
                                                        700
                                                    }
                                                >
                                                    {percentage.toFixed(
                                                        1
                                                    )}
                                                    %
                                                </Typography>
                                            </TableCell>

                                            {/* STATUS */}

                                            <TableCell>
                                                <Chip
                                                    icon={
                                                        status ===
                                                        "Passed" ? (
                                                            <CheckCircle />
                                                        ) : (
                                                            <Cancel />
                                                        )
                                                    }
                                                    label={
                                                        status
                                                    }
                                                    size="small"
                                                    color={
                                                        status ===
                                                        "Passed"
                                                            ? "success"
                                                            : "error"
                                                    }
                                                    variant="outlined"
                                                />
                                            </TableCell>
                                        </TableRow>
                                    );
                                }
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Container>
    );
};

export default ExamResult;

