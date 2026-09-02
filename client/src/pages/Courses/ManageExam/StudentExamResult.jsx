
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

import {
    getCertificateByCourse,
} from "../../../services/certificateService";

const StudentExamResult = () => {
    const { attemptId } = useParams();
    const navigate = useNavigate();

    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // =====================================================
    // CERTIFICATE STATE
    // =====================================================

    const [certificateId, setCertificateId] =
        useState(null);

    const [certificateLoading, setCertificateLoading] =
        useState(false);

    // =====================================================
    // FETCH RESULT
    // =====================================================

    useEffect(() => {
        if (attemptId) {
            fetchResult();
        }
    }, [attemptId]);

    const fetchResult = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get(
                `/exams/attempts/${attemptId}/result`
            );

            console.log(
                "Exam Result Response:",
                response.data
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
    // GET CERTIFICATE
    //
    // This handles:
    //
    // 1. Newly passed student
    // 2. Old student
    // 3. Student who already used 5 attempts
    //
    // Backend automatically finds old passed attempt.
    // =====================================================

    useEffect(() => {
        const fetchCertificate = async () => {
            if (!result) {
                return;
            }

            // Certificate only for passed exam
            if (result.passed !== true) {
                return;
            }

            // -------------------------------------------------
            // FIRST: CHECK CERTIFICATE FROM RESULT API
            // -------------------------------------------------

            const existingCertificateId =
                result.certificateId ||
                result.certificate?.id ||
                null;

            if (existingCertificateId) {
                setCertificateId(
                    existingCertificateId
                );

                return;
            }

            // -------------------------------------------------
            // GET COURSE ID
            // -------------------------------------------------

            const courseId =
                result.courseId ||
                result.exam?.courseId ||
                result.exam?.course?.id ||
                null;

            if (!courseId) {
                console.warn(
                    "Course ID not found. Cannot fetch certificate."
                );

                return;
            }

            // -------------------------------------------------
            // OLD STUDENT / CERTIFICATE NOT CREATED YET
            // -------------------------------------------------

            try {
                setCertificateLoading(true);

                console.log(
                    "Fetching certificate for course:",
                    courseId
                );

                const certificate =
                    await getCertificateByCourse(
                        courseId
                    );

                console.log(
                    "Certificate Response:",
                    certificate
                );

                if (certificate?.id) {
                    setCertificateId(
                        certificate.id
                    );
                }
            } catch (error) {
                console.error(
                    "Certificate fetch error:",
                    error
                );

                // Don't show main page error.
                // Certificate button will simply not appear.
            } finally {
                setCertificateLoading(false);
            }
        };

        fetchCertificate();
    }, [result]);

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
                    onClick={() =>
                        navigate("/my-courses")
                    }
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
    // EXAM DATA
    // =====================================================

    const exam = result.exam || {};

    const questions = Array.isArray(
        exam.questions
    )
        ? exam.questions
        : [];

    const answers = Array.isArray(
        result.answers
    )
        ? result.answers
        : [];

    // =====================================================
    // RESULT STATISTICS
    // =====================================================

    const totalQuestions =
        Number(result.totalQuestions) ||
        questions.length;

    const attemptedQuestions =
        Number(result.attemptedQuestions) ||
        answers.length;

    const correctAnswers =
        Number(result.correctAnswers) ||
        answers.filter(
            (answer) =>
                answer.isCorrect === true
        ).length;

    const wrongAnswers =
        Number(result.wrongAnswers) ||
        answers.filter(
            (answer) =>
                answer.isCorrect === false
        ).length;

    const unansweredQuestions = Math.max(
        totalQuestions -
            attemptedQuestions,
        0
    );

    // =====================================================
    // MARKS
    // =====================================================

    const totalMarks =
        Number(result.totalMarks) ||
        questions.reduce(
            (total, question) =>
                total +
                Number(
                    question.marks || 0
                ),
            0
        ) ||
        Number(exam.totalMarks) ||
        0;

    const obtainedMarks =
        Number(result.obtainedMarks) ||
        Number(result.score) ||
        0;

    // =====================================================
    // PERCENTAGE
    // =====================================================

    const percentage =
        Number(result.percentage) ||
        (totalMarks > 0
            ? Number(
                  (
                      (obtainedMarks /
                          totalMarks) *
                      100
                  ).toFixed(2)
              )
            : 0);

    // =====================================================
    // PASS / FAIL
    // =====================================================

    const passed =
        result.passed === true;

    // =====================================================
    // EXAM ID
    // =====================================================

    const examId =
        result.examId ||
        result.exam?.id;

    // =====================================================
    // OPEN CERTIFICATE
    // =====================================================

    const handleGetCertificate = () => {
        if (!certificateId) {
            return;
        }

        navigate(
            `/certificate/${certificateId}`
        );
    };

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
                        sx={{
                            fontWeight: 800,

                            fontSize: {
                                xs: "1.8rem",
                                sm: "2.3rem",
                            }
                        }}>
                        Exam Result
                    </Typography>

                    <Typography
                        variant="h6"
                        sx={{
                            mt: 1,
                            fontWeight: 600,
                        }}
                    >
                        {exam.title || "Exam"}
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
                SCORE + STATISTICS
            ================================================= */}

            <Grid
                container
                spacing={3}
                sx={{ mb: 4 }}
            >
                {/* SCORE */}

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
                                sx={{
                                    color: "text.secondary",
                                    fontWeight: 600
                                }}>
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
                                    sx={{
                                        color: "text.secondary",

                                        fontSize:
                                            "1.4rem",

                                        fontWeight: 500
                                    }}>
                                    {" "}
                                    / {totalMarks}
                                </Typography>
                            </Typography>

                            <Typography
                                variant="h6"
                                sx={{
                                    fontWeight: 700,
                                    mt: 2
                                }}>
                                {percentage}%
                            </Typography>

                            <LinearProgress
                                variant="determinate"
                                value={Math.min(
                                    Math.max(
                                        percentage,
                                        0
                                    ),
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
                        <Grid
                            size={{
                                xs: 6,
                                sm: 4,
                            }}
                        >
                            <StatCard
                                title="Total Questions"
                                value={
                                    totalQuestions
                                }
                                icon={<Quiz />}
                            />
                        </Grid>

                        <Grid
                            size={{
                                xs: 6,
                                sm: 4,
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

                        <Grid
                            size={{
                                xs: 6,
                                sm: 4,
                            }}
                        >
                            <StatCard
                                title="Unanswered"
                                value={
                                    unansweredQuestions
                                }
                                icon={<Quiz />}
                            />
                        </Grid>

                        <Grid
                            size={{
                                xs: 6,
                                sm: 6,
                            }}
                        >
                            <StatCard
                                title="Correct"
                                value={
                                    correctAnswers
                                }
                                icon={
                                    <CheckCircle />
                                }
                            />
                        </Grid>

                        <Grid
                            size={{
                                xs: 6,
                                sm: 6,
                            }}
                        >
                            <StatCard
                                title="Wrong"
                                value={
                                    wrongAnswers
                                }
                                icon={
                                    <Cancel />
                                }
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
                    sx={{
                        fontWeight: 700,
                        mb: 2
                    }}>
                    Result Summary
                </Typography>

                <Divider sx={{ mb: 2 }} />

                <Stack spacing={2}>
                    <SummaryRow
                        label="Exam"
                        value={
                            exam.title || "Exam"
                        }
                    />

                    <SummaryRow
                        label="Total Questions"
                        value={
                            totalQuestions
                        }
                    />

                    <SummaryRow
                        label="Attempted Questions"
                        value={
                            attemptedQuestions
                        }
                    />

                    <SummaryRow
                        label="Unanswered Questions"
                        value={
                            unansweredQuestions
                        }
                    />

                    <SummaryRow
                        label="Correct Answers"
                        value={
                            correctAnswers
                        }
                    />

                    <SummaryRow
                        label="Wrong Answers"
                        value={
                            wrongAnswers
                        }
                    />

                    <SummaryRow
                        label="Total Marks"
                        value={totalMarks}
                    />

                    <SummaryRow
                        label="Obtained Marks"
                        value={
                            obtainedMarks
                        }
                    />

                    <SummaryRow
                        label="Percentage"
                        value={`${percentage}%`}
                    />

                    <SummaryRow
                        label="Passing Percentage"
                        value={`${result.passingPercentage ?? exam.passingPercentage ?? 40}%`}
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
                {/* =============================================
                    GET CERTIFICATE
                ============================================= */}

                {passed && (
                    <>
                        {certificateLoading ? (
                            <Button
                                variant="contained"
                                color="success"
                                disabled
                                startIcon={
                                    <CircularProgress
                                        size={18}
                                        color="inherit"
                                    />
                                }
                                sx={{
                                    borderRadius: 2,
                                    textTransform:
                                        "none",
                                    fontWeight: 600,
                                    px: 3,
                                    py: 1.2,
                                    boxShadow: "none",
                                }}
                            >
                                Preparing Certificate...
                            </Button>
                        ) : (
                            certificateId && (
                                <Button
                                    variant="contained"
                                    color="success"
                                    startIcon={
                                        <EmojiEvents />
                                    }
                                    onClick={
                                        handleGetCertificate
                                    }
                                    sx={{
                                        borderRadius: 2,
                                        textTransform:
                                            "none",
                                        fontWeight: 600,
                                        px: 3,
                                        py: 1.2,
                                        boxShadow:
                                            "none",
                                    }}
                                >
                                    Get Certificate
                                </Button>
                            )
                        )}
                    </>
                )}

                {/* =============================================
                    TRY AGAIN
                ============================================= */}

                <Button
                    variant="outlined"
                    startIcon={<Refresh />}
                    onClick={() =>
                        navigate(
                            `/exams/${examId}/attempt`
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

                {/* =============================================
                    BACK TO COURSES
                ============================================= */}

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
                            sx={{
                                color: "text.secondary"
                            }}
                        >
                            {title}
                        </Typography>

                        <Typography
                            variant="h5"
                            sx={{
                                fontWeight: 800
                            }}
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
            <Typography sx={{
                color: "text.secondary"
            }}>
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
                    sx={{
                        fontWeight: 700,
                        textAlign: "right"
                    }}>
                    {value}
                </Typography>
            )}
        </Box>
    );
};

export default StudentExamResult;

