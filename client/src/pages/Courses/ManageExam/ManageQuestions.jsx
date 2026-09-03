
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useTheme } from "@mui/material/styles";

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";

import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Quiz as QuizIcon,
  CheckCircle as CheckCircleIcon,
} from "@mui/icons-material";

import {
  createQuestion,
  getQuestionsByExam,
  updateQuestion,
  deleteQuestion,
} from "../../../services/questionService";

import {
  createOption,
  updateOption,
} from "../../../services/optionService";


const initialForm = {
  questionText: "",
  marks: 1,
  questionType: "single",

  optionA: "",
  optionB: "",
  optionC: "",
  optionD: "",

  correctAnswer: "A",
};


const ManageQuestions = () => {
  const { examId } = useParams();
  const theme = useTheme();

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const [openDialog, setOpenDialog] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);

  const [formData, setFormData] = useState(initialForm);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");


  // --------------------------------------------------
  // Fetch Questions
  // --------------------------------------------------

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getQuestionsByExam(examId);

      setQuestions(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching questions:", err);

      setError(
        err?.response?.data?.message ||
          "Failed to load questions."
      );
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    if (examId) {
      fetchQuestions();
    }
  }, [examId]);


  // --------------------------------------------------
  // Input Change
  // --------------------------------------------------

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };


  // --------------------------------------------------
  // Open Create Dialog
  // --------------------------------------------------

  const handleAddQuestion = () => {
    setEditingQuestion(null);
    setFormData(initialForm);
    setError("");
    setSuccess("");
    setOpenDialog(true);
  };


  // --------------------------------------------------
  // Open Edit Dialog
  // --------------------------------------------------

  const handleEditQuestion = (question) => {
    setEditingQuestion(question);

    const options = question.options || [];

    setFormData({
      questionText: question.questionText || "",
      marks: question.marks || 1,
      questionType: question.questionType || "single",

      optionA: options[0]?.optionText || "",
      optionB: options[1]?.optionText || "",
      optionC: options[2]?.optionText || "",
      optionD: options[3]?.optionText || "",

      correctAnswer:
        options.find((option) => option.isCorrect)?.optionText
          ? String.fromCharCode(
              65 +
                options.findIndex(
                  (option) => option.isCorrect
                )
            )
          : "A",
    });

    setError("");
    setSuccess("");
    setOpenDialog(true);
  };


  // --------------------------------------------------
  // Close Dialog
  // --------------------------------------------------

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingQuestion(null);
    setFormData(initialForm);
  };


  // --------------------------------------------------
  // Save Question
  // --------------------------------------------------

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const questionData = {
        questionText: formData.questionText,
        marks: Number(formData.marks),
        questionType: formData.questionType,
      };


      // ----------------------------------------------
      // CREATE QUESTION
      // ----------------------------------------------

      if (!editingQuestion) {
        const createdQuestion = await createQuestion(
          examId,
          questionData
        );

        const questionId = createdQuestion?.id;

        if (!questionId) {
          throw new Error(
            "Question created but question ID was not returned."
          );
        }


        const options = [
          {
            optionText: formData.optionA,
            isCorrect: formData.correctAnswer === "A",
          },
          {
            optionText: formData.optionB,
            isCorrect: formData.correctAnswer === "B",
          },
          {
            optionText: formData.optionC,
            isCorrect: formData.correctAnswer === "C",
          },
          {
            optionText: formData.optionD,
            isCorrect: formData.correctAnswer === "D",
          },
        ];


        for (const option of options) {
          await createOption(questionId, option);
        }

        setSuccess("Question created successfully.");
      }


      // ----------------------------------------------
      // UPDATE QUESTION
      // ----------------------------------------------

      else {
        const questionId = editingQuestion.id;

        await updateQuestion(questionId, questionData);


        const existingOptions =
          editingQuestion.options || [];


        const options = [
          {
            optionText: formData.optionA,
            isCorrect: formData.correctAnswer === "A",
          },
          {
            optionText: formData.optionB,
            isCorrect: formData.correctAnswer === "B",
          },
          {
            optionText: formData.optionC,
            isCorrect: formData.correctAnswer === "C",
          },
          {
            optionText: formData.optionD,
            isCorrect: formData.correctAnswer === "D",
          },
        ];


        for (let i = 0; i < options.length; i++) {
          if (existingOptions[i]?.id) {
            await updateOption(
              existingOptions[i].id,
              options[i]
            );
          } else {
            await createOption(questionId, options[i]);
          }
        }

        setSuccess("Question updated successfully.");
      }


      handleCloseDialog();
      await fetchQuestions();

    } catch (err) {
      console.error("Error saving question:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to save question."
      );
    } finally {
      setLoading(false);
    }
  };


  // --------------------------------------------------
  // Delete Question
  // --------------------------------------------------

  const handleDeleteQuestion = async (questionId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this question?"
    );

    if (!confirmed) return;

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      await deleteQuestion(questionId);

      setSuccess("Question deleted successfully.");

      await fetchQuestions();

    } catch (err) {
      console.error("Error deleting question:", err);

      setError(
        err?.response?.data?.message ||
          "Failed to delete question."
      );
    } finally {
      setLoading(false);
    }
  };


  // --------------------------------------------------
  // Option Color
  // --------------------------------------------------

  const getOptionStyles = (isCorrect) => ({
    display: "flex",
    alignItems: "center",
    gap: 1,
    p: 1.5,
    borderRadius: 2,

    border: `1px solid ${
      isCorrect
        ? theme.palette.success.main
        : theme.palette.divider
    }`,

    backgroundColor: isCorrect
      ? theme.palette.action.selected
      : theme.palette.background.default,

    color: theme.palette.text.primary,

    transition: "all 0.2s ease",

    "&:hover": {
      backgroundColor: theme.palette.action.hover,
    },
  });


  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100%",
        backgroundColor: theme.palette.background.default,
        color: theme.palette.text.primary,
        p: { xs: 1.5, sm: 2, md: 3 },
      }}
    >

      {/* ------------------------------------------- */}
      {/* HEADER */}
      {/* ------------------------------------------- */}

      <Box
        sx={{
          display: "flex",
          alignItems: { xs: "flex-start", sm: "center" },
          justifyContent: "space-between",
          gap: 2,
          mb: 3,
          flexDirection: { xs: "column", sm: "row" },
        }}
      >

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
          }}
        >
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",

              backgroundColor:
                theme.palette.primary.main,

              color:
                theme.palette.primary.contrastText,
            }}
          >
            <QuizIcon />
          </Box>

          <Box>
            <Typography
              variant="h5"
              fontWeight={700}
              color="text.primary"
            >
              Manage Questions
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
            >
              Create and manage exam questions
            </Typography>
          </Box>
        </Box>


        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddQuestion}
          sx={{
            borderRadius: 2,
            textTransform: "none",
            fontWeight: 600,
            px: 2.5,
          }}
        >
          Add Question
        </Button>

      </Box>


      {/* ------------------------------------------- */}
      {/* ALERTS */}
      {/* ------------------------------------------- */}

      {error && (
        <Alert
          severity="error"
          onClose={() => setError("")}
          sx={{
            mb: 2,
            borderRadius: 2,
          }}
        >
          {Array.isArray(error)
            ? error.join(", ")
            : error}
        </Alert>
      )}


      {success && (
        <Alert
          severity="success"
          onClose={() => setSuccess("")}
          sx={{
            mb: 2,
            borderRadius: 2,
          }}
        >
          {success}
        </Alert>
      )}


      {/* ------------------------------------------- */}
      {/* QUESTIONS */}
      {/* ------------------------------------------- */}

      {questions.length === 0 && !loading ? (
        <Card
          elevation={0}
          sx={{
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 3,
            backgroundColor:
              theme.palette.background.paper,
          }}
        >
          <CardContent
            sx={{
              minHeight: 220,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              gap: 1,
            }}
          >
            <QuizIcon
              sx={{
                fontSize: 48,
                color: theme.palette.text.secondary,
              }}
            />

            <Typography
              variant="h6"
              fontWeight={600}
              color="text.primary"
            >
              No questions found
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
            >
              Add your first question to this exam.
            </Typography>

            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={handleAddQuestion}
              sx={{
                mt: 1,
                borderRadius: 2,
                textTransform: "none",
              }}
            >
              Add Question
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Grid
          container
          spacing={2}
        >
          {questions.map((question, index) => (
            <Grid
              key={question.id}
              size={{
                xs: 12,
                md: 6,
              }}
            >
              <Card
                elevation={0}
                sx={{
                  height: "100%",
                  border: `1px solid ${
                    theme.palette.divider
                  }`,
                  borderRadius: 3,

                  backgroundColor:
                    theme.palette.background.paper,

                  transition: "all 0.2s ease",

                  "&:hover": {
                    borderColor:
                      theme.palette.primary.main,

                    boxShadow:
                      theme.shadows[3],
                  },
                }}
              >

                <CardContent>

                  {/* QUESTION HEADER */}

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "flex-start",
                      justifyContent: "space-between",
                      gap: 1,
                    }}
                  >

                    <Box
                      sx={{
                        display: "flex",
                        gap: 1.5,
                        flex: 1,
                      }}
                    >

                      <Box
                        sx={{
                          minWidth: 34,
                          height: 34,
                          borderRadius: 1.5,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",

                          backgroundColor:
                            theme.palette.action.hover,

                          color:
                            theme.palette.primary.main,

                          fontWeight: 700,
                        }}
                      >
                        {index + 1}
                      </Box>

                      <Box>
                        <Typography
                          variant="subtitle1"
                          fontWeight={600}
                          color="text.primary"
                          sx={{
                            wordBreak: "break-word",
                          }}
                        >
                          {question.questionText}
                        </Typography>

                        <Box
                          sx={{
                            display: "flex",
                            gap: 1.5,
                            mt: 0.5,
                            flexWrap: "wrap",
                          }}
                        >
                          <Typography
                            variant="caption"
                            color="text.secondary"
                          >
                            Marks: {question.marks}
                          </Typography>

                          <Typography
                            variant="caption"
                            color="text.secondary"
                          >
                            Type: {question.questionType}
                          </Typography>
                        </Box>
                      </Box>

                    </Box>


                    {/* ACTIONS */}

                    <Box
                      sx={{
                        display: "flex",
                        gap: 0.5,
                      }}
                    >

                      <IconButton
                        size="small"
                        onClick={() =>
                          handleEditQuestion(question)
                        }
                        sx={{
                          color:
                            theme.palette.primary.main,

                          "&:hover": {
                            backgroundColor:
                              theme.palette.action.hover,
                          },
                        }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>


                      <IconButton
                        size="small"
                        onClick={() =>
                          handleDeleteQuestion(question.id)
                        }
                        sx={{
                          color:
                            theme.palette.error.main,

                          "&:hover": {
                            backgroundColor:
                              theme.palette.action.hover,
                          },
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>

                    </Box>

                  </Box>


                  <Divider
                    sx={{
                      my: 2,
                    }}
                  />


                  {/* OPTIONS */}

                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 1,
                    }}
                  >

                    {(question.options || []).map(
                      (option, optionIndex) => {
                        const optionLabel =
                          String.fromCharCode(
                            65 + optionIndex
                          );

                        return (
                          <Box
                            key={option.id || optionIndex}
                            sx={getOptionStyles(
                              option.isCorrect
                            )}
                          >

                            <Typography
                              variant="body2"
                              fontWeight={700}
                              sx={{
                                minWidth: 22,
                              }}
                            >
                              {optionLabel}.
                            </Typography>

                            <Typography
                              variant="body2"
                              sx={{
                                flex: 1,
                                wordBreak: "break-word",
                              }}
                            >
                              {option.optionText}
                            </Typography>

                            {option.isCorrect && (
                              <CheckCircleIcon
                                fontSize="small"
                                sx={{
                                  color:
                                    theme.palette
                                      .success.main,
                                }}
                              />
                            )}

                          </Box>
                        );
                      }
                    )}

                  </Box>

                </CardContent>

              </Card>
            </Grid>
          ))}
        </Grid>
      )}


      {/* ------------------------------------------- */}
      {/* CREATE / EDIT DIALOG */}
      {/* ------------------------------------------- */}

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="md"
        PaperProps={{
          sx: {
            borderRadius: 3,
            backgroundColor:
              theme.palette.background.paper,
            backgroundImage: "none",
          },
        }}
      >

        <DialogTitle
          sx={{
            fontWeight: 700,
            color: theme.palette.text.primary,
          }}
        >
          {editingQuestion
            ? "Edit Question"
            : "Add Question"}
        </DialogTitle>


        <DialogContent dividers>

          <Grid
            container
            spacing={2}
            sx={{
              pt: 1,
            }}
          >

            {/* QUESTION */}

            <Grid
              size={{
                xs: 12,
              }}
            >
              <TextField
                fullWidth
                multiline
                minRows={3}
                label="Question"
                name="questionText"
                value={formData.questionText}
                onChange={handleChange}
              />
            </Grid>


            {/* MARKS */}

            <Grid
              size={{
                xs: 12,
                sm: 6,
              }}
            >
              <TextField
                fullWidth
                type="number"
                label="Marks"
                name="marks"
                value={formData.marks}
                onChange={handleChange}
                inputProps={{
                  min: 1,
                }}
              />
            </Grid>


            {/* QUESTION TYPE */}

            <Grid
              size={{
                xs: 12,
                sm: 6,
              }}
            >
              <TextField
                fullWidth
                select
                label="Question Type"
                name="questionType"
                value={formData.questionType}
                onChange={handleChange}
              >
                <MenuItem value="single">
                  Single Choice
                </MenuItem>

                <MenuItem value="multiple">
                  Multiple Choice
                </MenuItem>
              </TextField>
            </Grid>


            {/* OPTION A */}

            <Grid
              size={{
                xs: 12,
                sm: 6,
              }}
            >
              <TextField
                fullWidth
                label="Option A"
                name="optionA"
                value={formData.optionA}
                onChange={handleChange}
              />
            </Grid>


            {/* OPTION B */}

            <Grid
              size={{
                xs: 12,
                sm: 6,
              }}
            >
              <TextField
                fullWidth
                label="Option B"
                name="optionB"
                value={formData.optionB}
                onChange={handleChange}
              />
            </Grid>


            {/* OPTION C */}

            <Grid
              size={{
                xs: 12,
                sm: 6,
              }}
            >
              <TextField
                fullWidth
                label="Option C"
                name="optionC"
                value={formData.optionC}
                onChange={handleChange}
              />
            </Grid>


            {/* OPTION D */}

            <Grid
              size={{
                xs: 12,
                sm: 6,
              }}
            >
              <TextField
                fullWidth
                label="Option D"
                name="optionD"
                value={formData.optionD}
                onChange={handleChange}
              />
            </Grid>


            {/* CORRECT ANSWER */}

            <Grid
              size={{
                xs: 12,
              }}
            >
              <TextField
                fullWidth
                select
                label="Correct Answer"
                name="correctAnswer"
                value={formData.correctAnswer}
                onChange={handleChange}
              >
                <MenuItem value="A">
                  Option A
                </MenuItem>

                <MenuItem value="B">
                  Option B
                </MenuItem>

                <MenuItem value="C">
                  Option C
                </MenuItem>

                <MenuItem value="D">
                  Option D
                </MenuItem>
              </TextField>
            </Grid>

          </Grid>

        </DialogContent>


        <DialogActions
          sx={{
            px: 3,
            py: 2,
            gap: 1,
          }}
        >

          <Button
            onClick={handleCloseDialog}
            variant="outlined"
            sx={{
              borderRadius: 2,
              textTransform: "none",
            }}
          >
            Cancel
          </Button>


          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={
              loading ||
              !formData.questionText.trim() ||
              !formData.optionA.trim() ||
              !formData.optionB.trim() ||
              !formData.optionC.trim() ||
              !formData.optionD.trim()
            }
            sx={{
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 600,
            }}
          >
            {editingQuestion
              ? "Update Question"
              : "Create Question"}
          </Button>

        </DialogActions>

      </Dialog>

    </Box>
  );
};

export default ManageQuestions;

