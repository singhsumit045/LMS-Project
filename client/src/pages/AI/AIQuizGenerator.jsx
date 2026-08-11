
import { useEffect, useState } from "react";

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
  Snackbar,
} from "@mui/material";

import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import QuizIcon from "@mui/icons-material/Quiz";
import RefreshIcon from "@mui/icons-material/Refresh";
import SaveIcon from "@mui/icons-material/Save";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

import api from "../../services/api";
import aiService from "../../services/aiService";

const AIQuizGenerator = () => {
  // =====================================================
  // GENERATOR STATE
  // =====================================================

  const [topic, setTopic] = useState("");

  const [numberOfQuestions, setNumberOfQuestions] =
    useState(5);

  const [difficulty, setDifficulty] =
    useState("medium");

  const [quiz, setQuiz] = useState(null);

  // =====================================================
  // COURSE STATE
  // =====================================================

  const [courses, setCourses] = useState([]);

  const [courseId, setCourseId] = useState("");

  const [coursesLoading, setCoursesLoading] =
    useState(true);

  // =====================================================
  // LOADING / ERROR
  // =====================================================

  const [loading, setLoading] = useState(false);

  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  const [successMessage, setSuccessMessage] =
    useState("");

  // =====================================================
  // FETCH TEACHER COURSES
  // =====================================================

  useEffect(() => {
    const fetchTeacherCourses = async () => {
      try {
        setCoursesLoading(true);
        setError("");

        const response = await api.get(
          "/enrollments/teacher/dashboard"
        );

        const data = response.data || {};

        const teacherCourses =
          Array.isArray(data.courses)
            ? data.courses
            : [];

        setCourses(teacherCourses);

        // Automatically select first course
        if (teacherCourses.length > 0) {
          setCourseId(
            String(teacherCourses[0].id)
          );
        }
      } catch (error) {
        console.error(
          "Teacher courses error:",
          error
        );

        setError(
          error?.response?.data?.message ||
            "Unable to load your courses."
        );
      } finally {
        setCoursesLoading(false);
      }
    };

    fetchTeacherCourses();
  }, []);

  // =====================================================
  // GENERATE QUIZ
  // =====================================================

  const handleGenerateQuiz = async () => {
    const cleanTopic = topic.trim();

    if (!cleanTopic) {
      setError("Please enter a topic.");
      return;
    }

    if (loading) {
      return;
    }

    setError("");
    setSuccessMessage("");
    setQuiz(null);
    setLoading(true);

    try {
      const response =
        await aiService.generateQuiz({
          topic: cleanTopic,
          numberOfQuestions,
          difficulty,
        });

      if (!response?.success) {
        throw new Error(
          "Quiz generation failed."
        );
      }

      setQuiz(response.data);
    } catch (error) {
      console.error(
        "AI Quiz Generator Error:",
        error
      );

      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Unable to generate quiz. Please try again.";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // SAVE AI QUIZ TO EXAM
  // =====================================================

  const handleSaveToExam = async () => {
    if (saving) {
      return;
    }

    if (!quiz?.questions?.length) {
      setError(
        "Please generate a quiz before saving."
      );
      return;
    }

    if (!courseId) {
      setError(
        "Please select a course first."
      );
      return;
    }

    setSaving(true);
    setError("");
    setSuccessMessage("");

    try {
      // -------------------------------------------------
      // Convert AI response into backend format
      // -------------------------------------------------

      const questions =
        quiz.questions.map((question) => ({
          questionText:
            question.questionText,

          marks:
            Number(question.marks) || 1,

          questionType:
            question.questionType ||
            "single",

          options:
            Array.isArray(question.options)
              ? question.options.map(
                  (option) => ({
                    optionText:
                      option.optionText,

                    isCorrect:
                      Boolean(
                        option.isCorrect
                      ),
                  })
                )
              : [],
        }));

      // -------------------------------------------------
      // Payload for POST /exams/ai-save
      // -------------------------------------------------

      const payload = {
        title:
          quiz.title ||
          `${topic.trim()} - AI Quiz`,

        description:
          quiz.description ||
          `AI generated quiz on ${topic.trim()}`,

        duration:
          Number(quiz.duration) || 30,

        courseId:
          Number(courseId),

        questions,
      };

      console.log(
        "Saving AI Exam:",
        payload
      );

      // -------------------------------------------------
      // SAVE EXAM
      // -------------------------------------------------

      const response = await api.post(
        "/exams/ai-save",
        payload
      );

      console.log(
        "AI Exam saved:",
        response.data
      );

      if (!response?.data?.success) {
        throw new Error(
          response?.data?.message ||
            "Unable to save exam."
        );
      }

      setSuccessMessage(
        `Exam saved successfully! Exam ID: ${response.data.examId}`
      );
    } catch (error) {
      console.error(
        "Save AI Exam Error:",
        error
      );

      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Unable to save exam. Please try again.";

      setError(message);
    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // RESET
  // =====================================================

  const handleReset = () => {
    setTopic("");
    setNumberOfQuestions(5);
    setDifficulty("medium");
    setQuiz(null);
    setError("");
    setSuccessMessage("");

    if (courses.length > 0) {
      setCourseId(
        String(courses[0].id)
      );
    } else {
      setCourseId("");
    }
  };

  // =====================================================
  // CLOSE SUCCESS
  // =====================================================

  const handleCloseSuccess = () => {
    setSuccessMessage("");
  };

  return (
    <Container
      maxWidth="lg"
      sx={{
        py: {
          xs: 3,
          md: 5,
        },
      }}
    >
      {/* =================================================
          HEADER
      ================================================= */}

      <Box sx={{ mb: 4 }}>
        <Stack
          direction="row"
          spacing={2}
          alignItems="center"
        >
          <Box
            sx={{
              width: 52,
              height: 52,
              borderRadius: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: "primary.main",
              color: "primary.contrastText",
            }}
          >
            <AutoAwesomeIcon />
          </Box>

          <Box>
            <Typography
              variant="h4"
              fontWeight={800}
            >
              AI Quiz Generator
            </Typography>

            <Typography
              variant="body1"
              color="text.secondary"
            >
              Generate multiple-choice questions
              using AI and save them directly
              as an exam.
            </Typography>
          </Box>
        </Stack>
      </Box>

      {/* =================================================
          GENERATOR FORM
      ================================================= */}

      <Card
        elevation={3}
        sx={{
          borderRadius: 3,
          mb: 4,
        }}
      >
        <CardContent
          sx={{
            p: {
              xs: 2,
              md: 3,
            },
          }}
        >
          <Stack spacing={3}>

            {/* =================================================
                COURSE
            ================================================= */}

            <FormControl fullWidth>
              <InputLabel>
                Select Course
              </InputLabel>

              <Select
                value={courseId}
                label="Select Course"
                onChange={(event) =>
                  setCourseId(
                    event.target.value
                  )
                }
                disabled={
                  coursesLoading ||
                  loading ||
                  saving
                }
              >
                {coursesLoading ? (
                  <MenuItem disabled>
                    Loading courses...
                  </MenuItem>
                ) : courses.length === 0 ? (
                  <MenuItem disabled>
                    No courses found
                  </MenuItem>
                ) : (
                  courses.map((course) => (
                    <MenuItem
                      key={course.id}
                      value={String(
                        course.id
                      )}
                    >
                      {course.title}
                    </MenuItem>
                  ))
                )}
              </Select>
            </FormControl>

            {/* =================================================
                TOPIC / QUESTIONS / DIFFICULTY
            ================================================= */}

            <Stack
              direction={{
                xs: "column",
                md: "row",
              }}
              spacing={2}
            >
              {/* TOPIC */}

              <TextField
                fullWidth
                label="Quiz Topic"
                placeholder="e.g. React Hooks"
                value={topic}
                onChange={(event) =>
                  setTopic(
                    event.target.value
                  )
                }
                disabled={
                  loading || saving
                }
              />

              {/* NUMBER OF QUESTIONS */}

              <TextField
                label="Questions"
                type="number"
                value={numberOfQuestions}
                onChange={(event) =>
                  setNumberOfQuestions(
                    Math.min(
                      20,
                      Math.max(
                        1,
                        Number(
                          event.target.value
                        )
                      )
                    )
                  )
                }
                disabled={
                  loading || saving
                }
                inputProps={{
                  min: 1,
                  max: 20,
                }}
                sx={{
                  width: {
                    xs: "100%",
                    md: 160,
                  },
                }}
              />

              {/* DIFFICULTY */}

              <FormControl
                sx={{
                  width: {
                    xs: "100%",
                    md: 180,
                  },
                }}
              >
                <InputLabel>
                  Difficulty
                </InputLabel>

                <Select
                  value={difficulty}
                  label="Difficulty"
                  onChange={(event) =>
                    setDifficulty(
                      event.target.value
                    )
                  }
                  disabled={
                    loading || saving
                  }
                >
                  <MenuItem value="easy">
                    Easy
                  </MenuItem>

                  <MenuItem value="medium">
                    Medium
                  </MenuItem>

                  <MenuItem value="hard">
                    Hard
                  </MenuItem>
                </Select>
              </FormControl>
            </Stack>

            {/* =================================================
                ACTIONS
            ================================================= */}

            <Stack
              direction={{
                xs: "column",
                sm: "row",
              }}
              spacing={2}
            >
              <Button
                variant="contained"
                size="large"
                startIcon={
                  loading ? (
                    <CircularProgress
                      size={20}
                      color="inherit"
                    />
                  ) : (
                    <AutoAwesomeIcon />
                  )
                }
                onClick={
                  handleGenerateQuiz
                }
                disabled={
                  loading ||
                  saving ||
                  !topic.trim() ||
                  !courseId
                }
                sx={{
                  minWidth: 180,
                  borderRadius: 2,
                  fontWeight: 700,
                }}
              >
                {loading
                  ? "Generating..."
                  : "Generate Quiz"}
              </Button>

              <Button
                variant="outlined"
                size="large"
                startIcon={
                  <RefreshIcon />
                }
                onClick={handleReset}
                disabled={
                  loading || saving
                }
                sx={{
                  borderRadius: 2,
                }}
              >
                Reset
              </Button>
            </Stack>

            {/* =================================================
                ERROR
            ================================================= */}

            {error && (
              <Alert
                severity="error"
                onClose={() =>
                  setError("")
                }
              >
                {error}
              </Alert>
            )}
          </Stack>
        </CardContent>
      </Card>

      {/* =================================================
          QUIZ PREVIEW
      ================================================= */}

      {quiz?.questions?.length > 0 && (
        <Box>
          <Stack
            direction={{
              xs: "column",
              sm: "row",
            }}
            justifyContent="space-between"
            alignItems={{
              xs: "flex-start",
              sm: "center",
            }}
            spacing={1}
            sx={{ mb: 2 }}
          >
            <Box>
              <Typography
                variant="h5"
                fontWeight={800}
              >
                Generated Quiz
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
              >
                Review the questions before
                saving them to an exam.
              </Typography>
            </Box>

            <Chip
              icon={<QuizIcon />}
              label={`${quiz.questions.length} Questions`}
              color="primary"
              variant="outlined"
            />
          </Stack>

          {/* =================================================
              QUESTIONS
          ================================================= */}

          <Stack spacing={2.5}>
            {quiz.questions.map(
              (question, index) => (
                <Card
                  key={index}
                  elevation={2}
                  sx={{
                    borderRadius: 3,
                  }}
                >
                  <CardContent
                    sx={{
                      p: {
                        xs: 2,
                        md: 3,
                      },
                    }}
                  >
                    {/* QUESTION HEADER */}

                    <Stack
                      direction="row"
                      spacing={1}
                      alignItems="flex-start"
                      sx={{ mb: 2 }}
                    >
                      <Chip
                        label={`Q${
                          index + 1
                        }`}
                        color="primary"
                        size="small"
                        sx={{
                          fontWeight: 700,
                        }}
                      />

                      <Typography
                        variant="h6"
                        fontWeight={700}
                        sx={{
                          flex: 1,
                        }}
                      >
                        {
                          question.questionText
                        }
                      </Typography>

                      <Chip
                        label={`${question.marks || 1} Mark`}
                        size="small"
                        variant="outlined"
                      />
                    </Stack>

                    <Divider
                      sx={{ mb: 2 }}
                    />

                    {/* OPTIONS */}

                    <Stack spacing={1.2}>
                      {question.options?.map(
                        (
                          option,
                          optionIndex
                        ) => {
                          const optionLetter =
                            String.fromCharCode(
                              65 +
                                optionIndex
                            );

                          return (
                            <Paper
                              key={
                                optionIndex
                              }
                              variant="outlined"
                              sx={{
                                p: 1.5,
                                borderRadius: 2,

                                borderColor:
                                  option.isCorrect
                                    ? "success.main"
                                    : "divider",

                                bgcolor:
                                  option.isCorrect
                                    ? "success.50"
                                    : "background.paper",
                              }}
                            >
                              <Stack
                                direction="row"
                                spacing={1.5}
                                alignItems="center"
                              >
                                <Typography
                                  fontWeight={700}
                                  sx={{
                                    minWidth: 24,
                                  }}
                                >
                                  {
                                    optionLetter
                                  }
                                  .
                                </Typography>

                                <Typography
                                  sx={{
                                    flex: 1,
                                  }}
                                >
                                  {
                                    option.optionText
                                  }
                                </Typography>

                                {option.isCorrect && (
                                  <Chip
                                    label="Correct"
                                    color="success"
                                    size="small"
                                  />
                                )}
                              </Stack>
                            </Paper>
                          );
                        }
                      )}
                    </Stack>
                  </CardContent>
                </Card>
              )
            )}
          </Stack>

          {/* =================================================
              SAVE BUTTON
          ================================================= */}

          <Box
            sx={{
              mt: 4,
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Button
              variant="contained"
              size="large"
              color="success"
              startIcon={
                saving ? (
                  <CircularProgress
                    size={20}
                    color="inherit"
                  />
                ) : (
                  <SaveIcon />
                )
              }
              onClick={
                handleSaveToExam
              }
              disabled={
                saving ||
                loading ||
                !courseId ||
                !quiz?.questions?.length
              }
              sx={{
                minWidth: 220,
                borderRadius: 2,
                fontWeight: 700,
                py: 1.4,
              }}
            >
              {saving
                ? "Saving Exam..."
                : "Save to Exam"}
            </Button>
          </Box>

          <Alert
            severity="info"
            sx={{ mt: 2 }}
          >
            Selected course:
            {" "}
            <strong>
              {courses.find(
                (course) =>
                  String(course.id) ===
                  String(courseId)
              )?.title ||
                "No course selected"}
            </strong>
          </Alert>
        </Box>
      )}

      {/* =================================================
          SUCCESS MESSAGE
      ================================================= */}

      <Snackbar
        open={Boolean(
          successMessage
        )}
        autoHideDuration={6000}
        onClose={
          handleCloseSuccess
        }
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
      >
        <Alert
          severity="success"
          variant="filled"
          icon={<CheckCircleIcon />}
          onClose={
            handleCloseSuccess
          }
          sx={{
            width: "100%",
          }}
        >
          {successMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default AIQuizGenerator;

