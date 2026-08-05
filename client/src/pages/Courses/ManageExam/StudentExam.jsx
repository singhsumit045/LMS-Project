    import { useEffect, useState } from "react";
    import { useNavigate, useParams } from "react-router-dom";

    import {
    Box,
    Button,
    Card,
    CardContent,
    CircularProgress,
    Divider,
    FormControl,
    FormControlLabel,
    Radio,
    RadioGroup,
    Typography,
    Alert,
    } from "@mui/material";

    import api from "../../../services/api";

    import {
    startExam,
    submitExam,
    getExamResult,
    } from "../../../services/examAttemptService";

    const StudentExam = () => {
    const { examId } = useParams();
    const navigate = useNavigate();

    // =====================================================
    // STATE
    // =====================================================

    const [exam, setExam] = useState(null);

    const [attemptId, setAttemptId] = useState(null);

    const [answers, setAnswers] = useState({});

    const [examStarted, setExamStarted] = useState(false);

    const [loading, setLoading] = useState(true);

    const [starting, setStarting] = useState(false);

    const [submitting, setSubmitting] = useState(false);

    const [error, setError] = useState("");

    // =====================================================
    // LOAD EXAM
    // =====================================================

    useEffect(() => {
    const loadExam = async () => {
    try {
    setLoading(true);
    setError("");


        const response = await api.get(
        `/exams/${examId}`
        );

        const examData = response.data;

        console.log("Exam Data:", examData);

        if (!examData) {
        setError("Exam not found.");
        return;
        }

        if (!examData.isPublished) {
        setExam(examData);

        setError(
            "This exam is not published yet."
        );

        return;
        }

        setExam(examData);
    } catch (err) {
        console.error(
        "Failed to load exam:",
        err
        );

        setError(
        err.response?.data?.message ||
            err.message ||
            "Unable to load exam."
        );
    } finally {
        setLoading(false);
    }
    };

    if (examId) {
    loadExam();
    }


    }, [examId]);

    // =====================================================
    // START EXAM
    // =====================================================

    const handleStartExam = async () => {
    try {
    setStarting(true);
    setError("");


    console.log(
        "Starting Exam:",
        examId
    );

    const attempt = await startExam(examId);

    console.log(
        "Exam Attempt:",
        attempt
    );

    const newAttemptId =
        attempt?.id ??
        attempt?.attemptId;

    if (!newAttemptId) {
        throw new Error(
        "Exam attempt ID was not returned by server."
        );
    }

    setAttemptId(newAttemptId);

    setExamStarted(true);

    console.log(
        "Exam Started. Attempt ID:",
        newAttemptId
    );
    } catch (err) {
    console.error(
        "Failed to start exam:",
        err
    );

    setError(
        err.response?.data?.message ||
        err.message ||
        "Unable to start exam."
    );
    } finally {
    setStarting(false);
    }


    };

    // =====================================================
    // SELECT ANSWER
    // =====================================================

    const handleAnswerChange = (
    questionId,
    selectedOptionId
    ) => {
    setAnswers((previous) => ({
    ...previous,


    [questionId]: Number(
        selectedOptionId
    ),
    }));


    };

    // =====================================================
    // SUBMIT EXAM
    // =====================================================

    const handleSubmit = async () => {
    if (!attemptId) {
    setError(
    "Exam attempt not found."
    );

    return;
    }

    try {
    setSubmitting(true);
    setError("");

    // -------------------------------------------------
    // CONVERT ANSWERS OBJECT INTO ARRAY
    // -------------------------------------------------

    const formattedAnswers =
        Object.entries(answers).map(
        ([questionId, selectedOptionId]) => ({
            questionId: Number(questionId),

            selectedOptionId:
            Number(selectedOptionId),
        })
        );

    console.log(
        "Submitting Answers:",
        formattedAnswers
    );

    // -------------------------------------------------
    // SUBMIT ANSWERS
    // -------------------------------------------------

    await submitExam(
        attemptId,
        formattedAnswers
    );

    console.log(
        "Answers submitted successfully."
    );

    // -------------------------------------------------
    // VERIFY RESULT
    // -------------------------------------------------

    const resultResponse =
        await getExamResult(attemptId);

    console.log(
        "Exam Result:",
        resultResponse
    );

    // -------------------------------------------------
    // REDIRECT TO RESULT PAGE
    // -------------------------------------------------

navigate(`/exams/attempts/${attemptId}/result`);
    } catch (err) {
    console.error(
        "Failed to submit exam:",
        err
    );

    setError(
        err.response?.data?.message ||
        err.message ||
        "Failed to submit exam."
    );
    } finally {
    setSubmitting(false);
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
    > <CircularProgress /> </Box>
    );
    }

    // =====================================================
    // EXAM NOT FOUND
    // =====================================================

    if (!exam) {
    return (
    <Box
    sx={{
    maxWidth: 900,
    mx: "auto",
    p: 3,
    }}
    > <Alert severity="warning">
    Exam not found. </Alert>


        <Button
        variant="outlined"
        sx={{
            mt: 2,
        }}
        onClick={() =>
            navigate("/my-courses")
        }
        >
        Back to My Courses
        </Button>
    </Box>
    );


    }

    // =====================================================
    // NOT PUBLISHED
    // =====================================================

    if (!exam.isPublished) {
    return (
    <Box
    sx={{
    maxWidth: 900,
    mx: "auto",
    p: 3,
    }}
    > <Alert severity="warning">
    This exam is not published yet. </Alert>


        <Button
        variant="outlined"
        sx={{
            mt: 2,
        }}
        onClick={() =>
            navigate("/my-courses")
        }
        >
        Back to My Courses
        </Button>
    </Box>
    );


    }

    // =====================================================
    // MAIN UI
    // =====================================================

    return (
    <Box
    sx={{
    maxWidth: 1000,
    mx: "auto",
    p: {
    xs: 2,
    sm: 3,
    },
    }}
    >
    {/* =================================================
    EXAM HEADER
    ================================================= */}


    <Card
        sx={{
        mb: 3,
        }}
    >
        <CardContent>
        <Typography
            variant="h4"
            fontWeight={700}
            gutterBottom
        >
            {exam.title}
        </Typography>

        {exam.description && (
            <Typography
            variant="body1"
            color="text.secondary"
            sx={{
                mb: 2,
            }}
            >
            {exam.description}
            </Typography>
        )}

        <Box
            sx={{
            display: "flex",
            gap: 3,
            flexWrap: "wrap",
            mb: examStarted ? 0 : 3,
            }}
        >
            <Typography>
            <strong>
                Duration:
            </strong>{" "}
            {exam.duration} minutes
            </Typography>

            <Typography>
            <strong>
                Total Marks:
            </strong>{" "}
            {exam.totalMarks}
            </Typography>

            <Typography>
            <strong>
                Passing:
            </strong>{" "}
            {exam.passingPercentage}%
            </Typography>
        </Box>

        {/* =============================================
            START EXAM BUTTON
        ============================================= */}

        {!examStarted && (
            <Box
            sx={{
                display: "flex",
                justifyContent: "center",
                mt: 3,
            }}
            >
            <Button
                variant="contained"
                size="large"
                onClick={handleStartExam}
                disabled={starting}
                sx={{
                minWidth: 200,
                }}
            >
                {starting ? (
                <CircularProgress
                    size={24}
                    color="inherit"
                />
                ) : (
                "Start Exam"
                )}
            </Button>
            </Box>
        )}
        </CardContent>
    </Card>

    {/* =================================================
        ERROR
    ================================================= */}

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

    {/* =================================================
        QUESTIONS
    ================================================= */}

    {examStarted && (
        <>
        {exam.questions &&
        exam.questions.length > 0 ? (
            exam.questions.map(
            (question, index) => (
                <Card
                key={question.id}
                sx={{
                    mb: 3,
                }}
                >
                <CardContent>
                    <Typography
                    variant="h6"
                    fontWeight={600}
                    sx={{
                        mb: 2,
                    }}
                    >
                    {index + 1}.{" "}
                    {question.questionText}
                    </Typography>

                    <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                        mb: 2,
                    }}
                    >
                    Marks:{" "}
                    {question.marks}
                    </Typography>

                    <FormControl fullWidth>
                    <RadioGroup
                        value={
                        answers[
                            question.id
                        ] ?? ""
                        }
                        onChange={(event) =>
                        handleAnswerChange(
                            question.id,
                            event.target.value
                        )
                        }
                    >
                        {question.options &&
                        question.options.length >
                        0 ? (
                        question.options.map(
                            (option) => (
                            <FormControlLabel
                                key={
                                option.id
                                }
                                value={String(
                                option.id
                                )}
                                control={
                                <Radio />
                                }
                                label={
                                option.optionText
                                }
                            />
                            )
                        )
                        ) : (
                        <Alert severity="warning">
                            No options available
                            for this question.
                        </Alert>
                        )}
                    </RadioGroup>
                    </FormControl>
                </CardContent>
                </Card>
            )
            )
        ) : (
            <Alert
            severity="info"
            sx={{
                mb: 3,
            }}
            >
            No questions available
            for this exam yet.
            </Alert>
        )}

        {/* =============================================
            SUBMIT EXAM
        ============================================= */}

        {exam.questions?.length > 0 && (
            <Box
            sx={{
                display: "flex",
                justifyContent: "center",
                pb: 5,
            }}
            >
            <Button
                variant="contained"
                size="large"
                onClick={handleSubmit}
                disabled={
                submitting ||
                !attemptId
                }
                sx={{
                minWidth: 200,
                }}
            >
                {submitting ? (
                <CircularProgress
                    size={24}
                    color="inherit"
                />
                ) : (
                "Submit Exam"
                )}
            </Button>
            </Box>
        )}
        </>
    )}
    </Box>


    );
    };

    export default StudentExam;
