import {
    Alert,
    Avatar,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    CircularProgress,
    Container,
    Divider,
    Grid,
    LinearProgress,
    Paper,
    Stack,
    Typography,
} from "@mui/material";

import {
    CheckCircle,
    Cancel,
    EmojiEvents,
    Home,
    Quiz,
    Refresh,
    ArrowBack,
} from "@mui/icons-material";

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import api from "../../../services/api";

const StudentExamResult = () => {
    const { attemptId } = useParams();
    const navigate = useNavigate();

    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // =====================================================
    // FETCH RESULT
    // =====================================================

    useEffect(() => {
        fetchResult();
    }, [attemptId]);

    const fetchResult = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get(
                `/exams/attempts/${attemptId}/result`
            );

            setResult(response.data);
        } catch (error) {
            console.error(
                "Student exam result error:",
                error
            );

            setError(
                error.response?.data?.message ||
                    "Unable to load exam result."
            );
        } finally {
            setLoading(false);
        }
    };

    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {
        return (
            <Box
                sx={{
                    minHeight: "70vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <CircularProgress size={45} />
            </Box>
        );
    }

    // =====================================================
    // ERROR
    // =====================================================

    if (error) {
        return (
            <Container
                maxWidth="md"
                sx={{ py: 5 }}
            >
                <Alert
                    severity="error"
                    sx={{ mb: 3 }}
                >
                    {error}
                </Alert>

                <Button
                    variant="contained"
                    startIcon={<ArrowBack />}
                    onClick={() => navigate("/my-courses")}
                >
                    Back to My Courses
                </Button>
            </Container>
        );
    }

    if (!result) {
        return null;
    }

    // =====================================================
    // RESULT DATA
    // =====================================================

    const totalMarks =
        Number(result.totalMarks) || 0;

    const obtainedMarks =
        Number(result.obtainedMarks) ||
        Number(result.score) ||
        0;

    const percentage =
        totalMarks > 0
            ? Math.round(
                  (obtainedMarks / totalMarks) * 100
              )
            : Number(result.percentage) || 0;

    const correctAnswers =
        Number(result.correctAnswers) || 0;

    const wrongAnswers =
        Number(result.wrongAnswers) || 0;

    const attemptedQuestions =
        Number(result.attemptedQuestions) ||
        correctAnswers + wrongAnswers;

    const totalQuestions =
        Number(result.totalQuestions) ||
        attemptedQuestions;

    const passed =
        result.passed !== undefined
            ? result.passed
            : percentage >= 40;

    // =====================================================
    // UI
    // =====================================================

    return (
        <Container
            maxWidth="lg"
            sx={{
                py: {
                    xs: 3,
                    sm: 4,
                    md: 5,
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
                        xs: 3,
                        sm: 4,
                        md: 5,
                    },
                    mb: 4,
                    borderRadius: 4,
                    color: "white",
                    background: passed
                        ? "linear-gradient(135deg, #2e7d32 0%, #66bb6a 100%)"
                        : "linear-gradient(135deg, #c62828 0%, #ef5350 100%)",
                    position: "relative",
                    overflow: "hidden",
                }}
            >
                <Box
                    sx={{
                        position: "absolute",
                        width: 220,
                        height: 220,
                        borderRadius: "50%",
                        background:
                            "rgba(255,255,255,0.08)",
                        right: -80,
                        top: -100,
                    }}
                />

                <Box
                    sx={{
                        position: "relative",
                        zIndex: 1,
                    }}
                >
                    <Avatar
                        sx={{
                            width: 65,
                            height: 65,
                            mb: 2,
                            bgcolor:
                                "rgba(255,255,255,0.18)",
                        }}
                    >
                        {passed ? (
                            <EmojiEvents fontSize="large" />
                        ) : (
                            <Quiz fontSize="large" />
                        )}
                    </Avatar>

                    <Typography
                        variant="h4"
                        fontWeight={800}
                        sx={{
                            fontSize: {
                                xs: "1.8rem",
                                sm: "2.3rem",
                            },
                        }}
                    >
                        Exam Result
                    </Typography>

                    <Typography
                        sx={{
                            mt: 1,
                            opacity: 0.9,
                        }}
                    >
                        {passed
                            ? "Congratulations! You passed the exam."
                            : "You did not pass this exam. Keep practicing!"}
                    </Typography>

                    <Chip
                        label={
                            passed
                                ? "PASSED"
                                : "FAILED"
                        }
                        icon={
                            passed ? (
                                <CheckCircle />
                            ) : (
                                <Cancel />
                            )
                        }
                        sx={{
                            mt: 2,
                            color: "white",
                            fontWeight: 700,
                            backgroundColor:
                                "rgba(255,255,255,0.18)",
                            "& .MuiChip-icon": {
                                color: "white",
                            },
                        }}
                    />
                </Box>
            </Paper>

            {/* =================================================
                SCORE
            ================================================= */}

            <Grid
                container
                spacing={3}
                sx={{ mb: 4 }}
            >
                {/* SCORE CARD */}

                <Grid
                    size={{
                        xs: 12,
                        md: 5,
                    }}
                >
                    <Card
                        elevation={0}
                        sx={{
                            height: "100%",
                            borderRadius: 3,
                            border: "1px solid",
                            borderColor: "divider",
                        }}
                    >
                        <CardContent
                            sx={{
                                p: {
                                    xs: 3,
                                    sm: 4,
                                },
                                textAlign: "center",
                            }}
                        >
                            <Typography
                                color="text.secondary"
                                fontWeight={600}
                            >
                                Your Score
                            </Typography>

                            <Typography
                                sx={{
                                    mt: 2,
                                    fontSize: {
                                        xs: "3rem",
                                        sm: "4rem",
                                    },
                                    fontWeight: 800,
                                    lineHeight: 1,
                                }}
                            >
                                {obtainedMarks}
                                <Typography
                                    component="span"
                                    color="text.secondary"
                                    sx={{
                                        fontSize: "1.4rem",
                                        fontWeight: 500,
                                    }}
                                >
                                    {" "}
                                    / {totalMarks}
                                </Typography>
                            </Typography>

                            <Typography
                                variant="h6"
                                fontWeight={700}
                                sx={{ mt: 2 }}
                            >
                                {percentage}%
                            </Typography>

                            <LinearProgress
                                variant="determinate"
                                value={Math.min(
                                    percentage,
                                    100
                                )}
                                sx={{
                                    mt: 2,
                                    height: 10,
                                    borderRadius: 5,
                                }}
                            />
                        </CardContent>
                    </Card>
                </Grid>

                {/* STATISTICS */}

                <Grid
                    size={{
                        xs: 12,
                        md: 7,
                    }}
                >
                    <Grid
                        container
                        spacing={2}
                    >
                        {/* TOTAL QUESTIONS */}

                        <Grid
                            size={{
                                xs: 6,
                                sm: 6,
                            }}
                        >
                            <StatCard
                                title="Total Questions"
                                value={totalQuestions}
                                icon={<Quiz />}
                            />
                        </Grid>

                        {/* ATTEMPTED */}

                        <Grid
                            size={{
                                xs: 6,
                                sm: 6,
                            }}
                        >
                            <StatCard
                                title="Attempted"
                                value={
                                    attemptedQuestions
                                }
                                icon={<Quiz />}
                            />
                        </Grid>

                        {/* CORRECT */}

                        <Grid
                            size={{
                                xs: 6,
                                sm: 6,
                            }}
                        >
                            <StatCard
                                title="Correct"
                                value={correctAnswers}
                                icon={<CheckCircle />}
                            />
                        </Grid>

                        {/* WRONG */}

                        <Grid
                            size={{
                                xs: 6,
                                sm: 6,
                            }}
                        >
                            <StatCard
                                title="Wrong"
                                value={wrongAnswers}
                                icon={<Cancel />}
                            />
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>

            {/* =================================================
                RESULT SUMMARY
            ================================================= */}

            <Paper
                elevation={0}
                sx={{
                    borderRadius: 3,
                    border: "1px solid",
                    borderColor: "divider",
                    p: {
                        xs: 2.5,
                        sm: 3.5,
                    },
                    mb: 4,
                }}
            >
                <Typography
                    variant="h6"
                    fontWeight={700}
                    sx={{ mb: 2 }}
                >
                    Result Summary
                </Typography>

                <Divider sx={{ mb: 2 }} />

                <Stack spacing={2}>
                    <SummaryRow
                        label="Total Marks"
                        value={totalMarks}
                    />

                    <SummaryRow
                        label="Obtained Marks"
                        value={obtainedMarks}
                    />

                    <SummaryRow
                        label="Percentage"
                        value={`${percentage}%`}
                    />

                    <SummaryRow
                        label="Correct Answers"
                        value={correctAnswers}
                    />

                    <SummaryRow
                        label="Wrong Answers"
                        value={wrongAnswers}
                    />

                    <SummaryRow
                        label="Status"
                        value={
                            passed
                                ? "Passed"
                                : "Failed"
                        }
                        status={passed}
                    />
                </Stack>
            </Paper>

            {/* =================================================
                ACTIONS
            ================================================= */}

            <Box
                sx={{
                    display: "flex",
                    flexDirection: {
                        xs: "column",
                        sm: "row",
                    },
                    justifyContent: "center",
                    gap: 2,
                }}
            >
                <Button
                    variant="outlined"
                    startIcon={<Refresh />}
                    onClick={() =>
                        navigate(
                            `/exams/${result.examId || result.exam?.id}/attempt`
                        )
                    }
                    sx={{
                        borderRadius: 2,
                        textTransform: "none",
                        fontWeight: 600,
                        px: 3,
                        py: 1.2,
                    }}
                >
                    Try Again
                </Button>

                <Button
                    variant="contained"
                    startIcon={<Home />}
                    onClick={() =>
                        navigate("/my-courses")
                    }
                    sx={{
                        borderRadius: 2,
                        textTransform: "none",
                        fontWeight: 600,
                        px: 3,
                        py: 1.2,
                        boxShadow: "none",
                    }}
                >
                    Back to My Courses
                </Button>
            </Box>
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
}) => {
    return (
        <Card
            elevation={0}
            sx={{
                height: "100%",
                borderRadius: 3,
                border: "1px solid",
                borderColor: "divider",
            }}
        >
            <CardContent
                sx={{
                    p: {
                        xs: 2,
                        sm: 2.5,
                    },
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5,
                    }}
                >
                    <Avatar
                        sx={{
                            bgcolor:
                                "primary.main",
                            width: 42,
                            height: 42,
                        }}
                    >
                        {icon}
                    </Avatar>

                    <Box>
                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            {title}
                        </Typography>

                        <Typography
                            variant="h5"
                            fontWeight={800}
                        >
                            {value}
                        </Typography>
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
};

// =====================================================
// SUMMARY ROW
// =====================================================

const SummaryRow = ({
    label,
    value,
    status,
}) => {
    return (
        <Box
            sx={{
                display: "flex",
                justifyContent:
                    "space-between",
                alignItems: "center",
                gap: 2,
            }}
        >
            <Typography color="text.secondary">
                {label}
            </Typography>

            {status !== undefined ? (
                <Chip
                    label={value}
                    color={
                        status
                            ? "success"
                            : "error"
                    }
                    size="small"
                    icon={
                        status ? (
                            <CheckCircle />
                        ) : (
                            <Cancel />
                        )
                    }
                />
            ) : (
                <Typography
                    fontWeight={700}
                >
                    {value}
                </Typography>
            )}
        </Box>
    );
};

export default StudentExamResult;