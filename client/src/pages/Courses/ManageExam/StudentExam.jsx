
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  Alert,
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
  Stack,
  Typography,
} from "@mui/material";

import {
  ArrowBack,
  History,
  PlayArrow,
} from "@mui/icons-material";

import api from "../../../services/api";

import {
  startExam,
  submitExam,
  getExamResult,
  getLastResult,
} from "../../../services/examAttemptService";

const MAX_ATTEMPTS = 3;

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

  const [loadingLastResult, setLoadingLastResult] = useState(false);

  const [lastResult, setLastResult] = useState(null);

  const [showLastResult, setShowLastResult] = useState(false);

  const [error, setError] = useState("");

  const [attemptCount, setAttemptCount] = useState(0);

  // =====================================================
  // LOAD EXAM
  // =====================================================

  useEffect(() => {
    const loadExam = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(`/exams/${examId}`);

        const examData = response?.data;

        console.log("Exam Data:", examData);

        if (!examData) {
          setError("Exam not found.");
          return;
        }

        setExam(examData);

        if (!examData.isPublished) {
          setError("This exam is not published yet.");
          return;
        }

        /*
         * Try to load previous result/attempt information.
         *
         * This is important because otherwise attemptCount
         * starts from 0 whenever the page is refreshed.
         */
        try {
          const previousResult = await getLastResult(examId);

          console.log(
            "Previous Exam Result:",
            previousResult
          );

          if (previousResult) {
            setLastResult(previousResult);

            /*
             * Support different possible backend response shapes.
             */

            if (Array.isArray(previousResult)) {
              setAttemptCount(previousResult.length);
            } else if (
              previousResult.attemptCount !== undefined
            ) {
              setAttemptCount(
                Number(previousResult.attemptCount)
              );
            } else if (
              previousResult.totalAttempts !== undefined
            ) {
              setAttemptCount(
                Number(previousResult.totalAttempts)
              );
            } else if (
              previousResult.attempts &&
              Array.isArray(previousResult.attempts)
            ) {
              setAttemptCount(
                previousResult.attempts.length
              );
            } else {
              /*
               * If backend returns one latest submitted attempt
               * but does not return count, don't blindly assume
               * 3 attempts.
               */
              setAttemptCount(1);
            }
          }
        } catch (resultError) {
          /*
           * No previous result is not a fatal error.
           * Student can still start the exam.
           */
          console.log(
            "No previous exam result found:",
            resultError
          );
        }
      } catch (err) {
        console.error(
          "Failed to load exam:",
          err
        );

        setError(
          err?.response?.data?.message ||
            err?.message ||
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
  // GET LAST RESULT
  // =====================================================

  const handleGetLastResult = async () => {
    try {
      setLoadingLastResult(true);
      setError("");

      console.log(
        "Getting last result for exam:",
        examId
      );

      const result = await getLastResult(examId);

      console.log(
        "Last Result:",
        result
      );

      if (!result) {
        setError(
          "No submitted result found for this exam."
        );
        return;
      }

      setLastResult(result);
      setShowLastResult(true);

      /*
       * Determine attempt count.
       */

      if (Array.isArray(result)) {
        setAttemptCount(result.length);
      } else if (
        result?.attemptCount !== undefined
      ) {
        setAttemptCount(
          Number(result.attemptCount)
        );
      } else if (
        result?.totalAttempts !== undefined
      ) {
        setAttemptCount(
          Number(result.totalAttempts)
        );
      } else if (
        result?.attempts &&
        Array.isArray(result.attempts)
      ) {
        setAttemptCount(
          result.attempts.length
        );
      } else {
        setAttemptCount((previous) =>
          Math.max(previous, 1)
        );
      }
    } catch (err) {
      console.error(
        "Failed to get last result:",
        err
      );

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to load last result."
      );
    } finally {
      setLoadingLastResult(false);
    }
  };

  // =====================================================
  // VIEW LAST RESULT
  // =====================================================

  const handleViewLastResult = () => {
    if (!lastResult) {
      return;
    }

    /*
     * If API returns an array, use the latest attempt.
     */
    let resultData = lastResult;

    if (Array.isArray(lastResult)) {
      if (lastResult.length === 0) {
        setError(
          "No submitted result found."
        );
        return;
      }

      resultData =
        lastResult[lastResult.length - 1];
    }

    const resultAttemptId =
      resultData?.id ??
      resultData?.attemptId ??
      resultData?.attempt?.id;

    if (!resultAttemptId) {
      setError(
        "Last result attempt ID was not found."
      );
      return;
    }

    navigate(
      `/exams/attempts/${resultAttemptId}/result`
    );
  };

  // =====================================================
  // START EXAM
  // =====================================================

  const handleStartExam = async () => {
    try {
      setStarting(true);
      setError("");
      setShowLastResult(false);

      // -------------------------------------------------
      // FRONTEND ATTEMPT CHECK
      // -------------------------------------------------

      if (attemptCount >= MAX_ATTEMPTS) {
        setError(
          `You have already used all ${MAX_ATTEMPTS} attempts for this exam.`
        );

        await handleGetLastResult();

        return;
      }

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
        attempt?.attemptId ??
        attempt?.data?.id ??
        attempt?.data?.attemptId;

      if (!newAttemptId) {
        throw new Error(
          "Exam attempt ID was not returned by server."
        );
      }

      setAttemptId(newAttemptId);

      setExamStarted(true);

      setAnswers({});

      console.log(
        "Exam Started. Attempt ID:",
        newAttemptId
      );
    } catch (err) {
      console.error(
        "Failed to start exam:",
        err
      );

      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Unable to start exam.";

      const lowerMessage =
        String(message).toLowerCase();

      // -------------------------------------------------
      // MAXIMUM ATTEMPT ERROR
      // -------------------------------------------------

      const isAttemptLimitError =
        lowerMessage.includes("attempt") &&
        (
          lowerMessage.includes("3") ||
          lowerMessage.includes("limit") ||
          lowerMessage.includes("maximum") ||
          lowerMessage.includes("allowed") ||
          lowerMessage.includes("exceeded")
        );

      // -------------------------------------------------
      // ALREADY SUBMITTED
      // -------------------------------------------------

      const isAlreadySubmitted =
        lowerMessage.includes(
          "already submitted"
        );

      if (
        isAttemptLimitError ||
        isAlreadySubmitted
      ) {
        setError(
          `You have reached the maximum ${MAX_ATTEMPTS} attempts for this exam.`
        );

        try {
          await handleGetLastResult();
        } catch (resultError) {
          console.error(
            "Failed to fetch last result:",
            resultError
          );
        }
      } else {
        setError(message);
      }
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

    if (submitting) {
      return;
    }

    /*
     * Confirm before submitting.
     */

    const confirmed = window.confirm(
      "Are you sure you want to submit this exam?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      // -------------------------------------------------
      // CONVERT ANSWERS OBJECT INTO ARRAY
      // -------------------------------------------------

      /*
       * IMPORTANT:
       *
       * Your existing backend expects:
       *
       * {
       *   questionId,
       *   selectedOptionId
       * }
       *
       * So DON'T change selectedOptionId to optionId.
       */

      const formattedAnswers =
        Object.entries(answers).map(
          ([
            questionId,
            selectedOptionId,
          ]) => ({
            questionId:
              Number(questionId),

            selectedOptionId:
              Number(selectedOptionId),
          })
        );

      console.log(
        "Submitting Answers:",
        formattedAnswers
      );

      // -------------------------------------------------
      // SUBMIT
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
      // UPDATE ATTEMPT COUNT
      // -------------------------------------------------

      setAttemptCount((previous) =>
        Math.min(
          previous + 1,
          MAX_ATTEMPTS
        )
      );

      // -------------------------------------------------
      // STOP EXAM UI
      // -------------------------------------------------

      setExamStarted(false);

      // -------------------------------------------------
      // REDIRECT TO RESULT
      // -------------------------------------------------

      navigate(
        `/exams/attempts/${attemptId}/result`,
        {
          replace: true,
          state: {
            result: resultResponse,
          },
        }
      );
    } catch (err) {
      console.error(
        "Failed to submit exam:",
        err
      );

      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to submit exam.";

      setError(message);
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
      >
        <Stack
          alignItems="center"
          spacing={2}
        >
          <CircularProgress />

          <Typography
            color="text.secondary"
          >
            Loading exam...
          </Typography>
        </Stack>
      </Box>
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
      >
        <Alert severity="warning">
          {error || "Exam not found."}
        </Alert>

        <Button
          variant="outlined"
          startIcon={<ArrowBack />}
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
      >
        <Alert severity="warning">
          This exam is not published yet.
        </Alert>

        <Button
          variant="outlined"
          startIcon={<ArrowBack />}
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
  // QUESTIONS
  // =====================================================

  const questions = Array.isArray(
    exam.questions
  )
    ? exam.questions
    : [];

  // =====================================================
  // ANSWERED COUNT
  // =====================================================

  const answeredCount =
    Object.keys(answers).length;

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
          borderRadius: 3,
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

          {/* EXAM INFORMATION */}

          <Box
            sx={{
              display: "flex",
              gap: 3,
              flexWrap: "wrap",
              mb: 3,
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

            <Typography>
              <strong>
                Attempts:
              </strong>{" "}
              {attemptCount}/{MAX_ATTEMPTS}
            </Typography>
          </Box>

          {/* ERROR */}

          {error && (
            <Alert
              severity="warning"
              sx={{
                mt: 2,
                mb: 2,
              }}
              onClose={() =>
                setError("")
              }
            >
              {error}
            </Alert>
          )}

          {/* =================================================
              START EXAM
          ================================================= */}

          {!examStarted && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                flexDirection: "column",
                alignItems: "center",
                gap: 2,
                mt: 3,
              }}
            >
              {/* START BUTTON */}

              {attemptCount <
                MAX_ATTEMPTS && (
                <Button
                  variant="contained"
                  size="large"
                  startIcon={
                    starting ? (
                      <CircularProgress
                        size={20}
                        color="inherit"
                      />
                    ) : (
                      <PlayArrow />
                    )
                  }
                  onClick={
                    handleStartExam
                  }
                  disabled={
                    starting ||
                    loadingLastResult
                  }
                  sx={{
                    minWidth: 220,
                  }}
                >
                  {starting
                    ? "Starting..."
                    : `Start Exam (${attemptCount + 1}/${MAX_ATTEMPTS})`}
                </Button>
              )}

              {/* MAX ATTEMPTS */}

              {attemptCount >=
                MAX_ATTEMPTS && (
                <Alert
                  severity="info"
                  sx={{
                    width: "100%",
                    maxWidth: 500,
                  }}
                >
                  You have used all{" "}
                  {MAX_ATTEMPTS} attempts
                  for this exam.
                </Alert>
              )}

              {/* VIEW LAST RESULT */}

              {attemptCount >=
                MAX_ATTEMPTS && (
                <Button
                  variant="outlined"
                  size="large"
                  startIcon={
                    loadingLastResult ? (
                      <CircularProgress
                        size={18}
                      />
                    ) : (
                      <History />
                    )
                  }
                  onClick={
                    handleGetLastResult
                  }
                  disabled={
                    loadingLastResult
                  }
                  sx={{
                    minWidth: 220,
                  }}
                >
                  {loadingLastResult
                    ? "Loading..."
                    : "View Last Result"}
                </Button>
              )}

              {/* LAST RESULT LOADED */}

              {showLastResult &&
                lastResult && (
                  <>
                    <Divider
                      sx={{
                        width: "100%",
                        maxWidth: 500,
                      }}
                    />

                    <Button
                      variant="outlined"
                      size="large"
                      startIcon={
                        <History />
                      }
                      onClick={
                        handleViewLastResult
                      }
                      sx={{
                        minWidth: 220,
                      }}
                    >
                      Open Last Result
                    </Button>
                  </>
                )}
            </Box>
          )}
        </CardContent>
      </Card>

      {/* =================================================
          ACTIVE EXAM
      ================================================= */}

      {examStarted && (
        <>
          {/* EXAM STATUS */}

          <Card
            sx={{
              mb: 3,
              borderRadius: 3,
            }}
          >
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  justifyContent:
                    "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: 1,
                }}
              >
                <Typography
                  fontWeight={600}
                >
                  Exam in progress
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  Answered:{" "}
                  {answeredCount}/
                  {questions.length}
                </Typography>
              </Box>
            </CardContent>
          </Card>

          {/* QUESTIONS */}

          {questions.length > 0 ? (
            questions.map(
              (question, index) => (
                <Card
                  key={question.id}
                  sx={{
                    mb: 3,
                    borderRadius: 3,
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
                      {
                        question.questionText
                      }
                    </Typography>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        mb: 2,
                      }}
                    >
                      Marks:{" "}
                      {question.marks ?? 1}
                    </Typography>

                    <FormControl
                      fullWidth
                    >
                      <RadioGroup
                        value={
                          answers[
                            question.id
                          ] !== undefined
                            ? String(
                                answers[
                                  question.id
                                ]
                              )
                            : ""
                        }
                        onChange={(event) =>
                          handleAnswerChange(
                            question.id,
                            event.target.value
                          )
                        }
                      >
                        {Array.isArray(
                          question.options
                        ) &&
                        question.options
                          .length > 0 ? (
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
                                sx={{
                                  mb: 1,
                                  border:
                                    "1px solid",
                                  borderColor:
                                    "divider",
                                  borderRadius: 2,
                                  px: 1,
                                  py: 0.5,
                                  transition:
                                    "0.2s",

                                  "&:hover":
                                    {
                                      borderColor:
                                        "primary.main",
                                      bgcolor:
                                        "action.hover",
                                    },
                                }}
                              />
                            )
                          )
                        ) : (
                          <Alert severity="warning">
                            No options
                            available for
                            this question.
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

          {/* =================================================
              SUBMIT EXAM
          ================================================= */}

          {questions.length > 0 && (
            <Box
              sx={{
                display: "flex",
                justifyContent:
                  "center",
                pb: 5,
              }}
            >
              <Button
                variant="contained"
                color="success"
                size="large"
                onClick={
                  handleSubmit
                }
                disabled={
                  submitting ||
                  !attemptId
                }
                sx={{
                  minWidth: 220,
                }}
              >
                {submitting ? (
                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                  >
                    <CircularProgress
                      size={22}
                      color="inherit"
                    />

                    <span>
                      Submitting...
                    </span>
                  </Stack>
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

