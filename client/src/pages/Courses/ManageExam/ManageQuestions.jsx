
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import {
  createQuestion,
  getQuestionsByExam,
  updateQuestion,
  deleteQuestion,
} from "../../../services/questionService";

import {
  createOption,
  updateOption,
  deleteOption,
} from "../../../services/optionService";

// =====================================================
// INITIAL FORM
// =====================================================

const initialForm = {
  questionText: "",
  marks: "",
  questionType: "single",

  optionA: "",
  optionB: "",
  optionC: "",
  optionD: "",

  correctAnswer: "A",
};

const ManageQuestions = () => {
  const { examId } = useParams();

  const [questions, setQuestions] = useState([]);

  const [formData, setFormData] =
    useState(initialForm);

  const [open, setOpen] = useState(false);

  const [editingId, setEditingId] =
    useState(null);

  const [editingOptions, setEditingOptions] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const [saving, setSaving] =
    useState(false);

  // =====================================================
  // FETCH QUESTIONS
  // =====================================================

  const fetchQuestions = async () => {
    if (!examId || Number(examId) <= 0) {
      return;
    }

    try {
      setLoading(true);

      const data =
        await getQuestionsByExam(
          Number(examId)
        );

      setQuestions(
        Array.isArray(data) ? data : []
      );
    } catch (error) {
      console.error(
        "Error fetching questions:",
        error
      );

      alert(
        error?.response?.data?.message ||
        "Unable to load questions"
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // LOAD QUESTIONS
  // =====================================================

  useEffect(() => {
    fetchQuestions();
  }, [examId]);

  // =====================================================
  // CREATE QUESTION
  // =====================================================

  const handleCreate = () => {
    setEditingId(null);
    setEditingOptions([]);

    setFormData({
      ...initialForm,
    });

    setOpen(true);
  };

  // =====================================================
  // EDIT QUESTION
  // =====================================================

  const handleEdit = (question) => {
    setEditingId(question.id);

    const options = Array.isArray(
      question.options
    )
      ? question.options
      : [];

    setEditingOptions(options);

    const optionA = options[0];
    const optionB = options[1];
    const optionC = options[2];
    const optionD = options[3];

    let correctAnswer = "A";

    const correctIndex = options.findIndex(
      (option) => option.isCorrect === true
    );

    if (correctIndex === 1) {
      correctAnswer = "B";
    } else if (correctIndex === 2) {
      correctAnswer = "C";
    } else if (correctIndex === 3) {
      correctAnswer = "D";
    }

    setFormData({
      questionText:
        question.questionText || "",

      marks:
        question.marks ?? "",

      questionType:
        question.questionType || "single",

      optionA:
        optionA?.optionText || "",

      optionB:
        optionB?.optionText || "",

      optionC:
        optionC?.optionText || "",

      optionD:
        optionD?.optionText || "",

      correctAnswer,
    });

    setOpen(true);
  };

  // =====================================================
  // CLOSE DIALOG
  // =====================================================

  const handleClose = () => {
    if (saving) return;

    setOpen(false);
    setEditingId(null);
    setEditingOptions([]);

    setFormData({
      ...initialForm,
    });
  };

  // =====================================================
  // INPUT CHANGE
  // =====================================================

  const handleChange = (event) => {
    const {
      name,
      value,
    } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // =====================================================
  // SUBMIT QUESTION
  // =====================================================

  const handleSubmit = async () => {
    // ===================================================
    // EXAM ID VALIDATION
    // ===================================================

    if (
      !examId ||
      Number(examId) <= 0
    ) {
      alert("Invalid exam ID");
      return;
    }

    // ===================================================
    // QUESTION VALIDATION
    // ===================================================

    if (
      !formData.questionText.trim()
    ) {
      alert("Please enter question");
      return;
    }

    // ===================================================
    // MARKS VALIDATION
    // ===================================================

    if (
      formData.marks === "" ||
      Number(formData.marks) <= 0
    ) {
      alert("Please enter valid marks");
      return;
    }

    // ===================================================
    // OPTIONS VALIDATION
    // ===================================================

    if (!formData.optionA.trim()) {
      alert("Please enter Option A");
      return;
    }

    if (!formData.optionB.trim()) {
      alert("Please enter Option B");
      return;
    }

    if (!formData.optionC.trim()) {
      alert("Please enter Option C");
      return;
    }

    if (!formData.optionD.trim()) {
      alert("Please enter Option D");
      return;
    }

    try {
      setSaving(true);

      // =================================================
      // QUESTION PAYLOAD
      // =================================================

      const questionPayload = {
        questionText:
          formData.questionText.trim(),

        marks:
          Number(formData.marks),

        questionType:
          formData.questionType,
      };

      // =================================================
      // CREATE QUESTION
      // =================================================

      if (!editingId) {
        const createdQuestion = await createQuestion(
          Number(examId),
          questionPayload
        );


        const questionId = createdQuestion?.id;


        if (!questionId || Number(questionId) <= 0) {
          throw new Error(
            "Question ID was not returned from createQuestion"
          );
        }

        // ===============================================
        // OPTIONS
        // ===============================================

        const options = [
          {
            optionText:
              formData.optionA.trim(),
            isCorrect:
              formData.correctAnswer === "A",
          },
          {
            optionText:
              formData.optionB.trim(),
            isCorrect:
              formData.correctAnswer === "B",
          },
          {
            optionText:
              formData.optionC.trim(),
            isCorrect:
              formData.correctAnswer === "C",
          },
          {
            optionText:
              formData.optionD.trim(),
            isCorrect:
              formData.correctAnswer === "D",
          },
        ];

        // ===============================================
        // CREATE ALL OPTIONS
        // ===============================================

        for (const option of options) {
          await createOption(
            questionId,
            option
          );
        }

        alert(
          "Question and options created successfully"
        );
      }

      // =================================================
      // UPDATE QUESTION
      // =================================================

      else {
        await updateQuestion(
          editingId,
          questionPayload
        );

        // ===============================================
        // UPDATED OPTIONS
        // ===============================================

        const options = [
          {
            letter: "A",
            optionText:
              formData.optionA.trim(),
            isCorrect:
              formData.correctAnswer === "A",
          },
          {
            letter: "B",
            optionText:
              formData.optionB.trim(),
            isCorrect:
              formData.correctAnswer === "B",
          },
          {
            letter: "C",
            optionText:
              formData.optionC.trim(),
            isCorrect:
              formData.correctAnswer === "C",
          },
          {
            letter: "D",
            optionText:
              formData.optionD.trim(),
            isCorrect:
              formData.correctAnswer === "D",
          },
        ];

        // ===============================================
        // UPDATE / CREATE OPTIONS
        // ===============================================

        for (
          let i = 0;
          i < options.length;
          i++
        ) {
          const option = options[i];

          const existingOption =
            editingOptions[i];

          if (existingOption?.id) {
            await updateOption(
              existingOption.id,
              {
                optionText:
                  option.optionText,
                isCorrect:
                  option.isCorrect,
              }
            );
          } else {
            await createOption(
              editingId,
              {
                optionText:
                  option.optionText,
                isCorrect:
                  option.isCorrect,
              }
            );
          }
        }

        alert(
          "Question and options updated successfully"
        );
      }

      // =================================================
      // RESET
      // =================================================

      setOpen(false);
      setEditingId(null);
      setEditingOptions([]);

      setFormData({
        ...initialForm,
      });

      await fetchQuestions();
    } catch (error) {
      console.error(
        "Error saving question:",
        error
      );

      alert(
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong while saving question"
      );
    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // DELETE QUESTION
  // =====================================================

  const handleDelete = async (id) => {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this question?"
      );

    if (!confirmed) return;

    try {
      await deleteQuestion(id);

      await fetchQuestions();

      alert(
        "Question deleted successfully"
      );
    } catch (error) {
      console.error(
        "Error deleting question:",
        error
      );

      alert(
        error?.response?.data?.message ||
        "Something went wrong while deleting question"
      );
    }
  };

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <Box
      sx={{
        p: {
          xs: 2,
          sm: 3,
          md: 4,
        },
      }}
    >
      {/* =================================================
          HEADER
      ================================================= */}

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: {
            xs: "flex-start",
            sm: "center",
          },
          flexDirection: {
            xs: "column",
            sm: "row",
          },
          gap: 2,
          mb: 4,
        }}
      >
        <Box>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700
            }}
          >
            Manage Questions
          </Typography>

          <Typography
            sx={{
              color: "text.secondary",
              mt: 0.5
            }}>
            Add questions and options for
            this exam
          </Typography>

          {examId && (
            <Typography
              variant="body2"
              sx={{
                color: "text.secondary",
                mt: 0.5
              }}>
              Exam ID: {examId}
            </Typography>
          )}
        </Box>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreate}
        >
          Add Question
        </Button>
      </Box>

      {/* =================================================
          QUESTION LIST
      ================================================= */}

      {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            py: 8,
          }}
        >
          <Typography sx={{
            color: "text.secondary"
          }}>
            Loading questions...
          </Typography>
        </Box>
      ) : questions.length === 0 ? (
        <Card>
          <CardContent
            sx={{
              textAlign: "center",
              py: 8,
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600
              }}
            >
              No questions found
            </Typography>

            <Typography
              sx={{
                color: "text.secondary",
                mt: 1
              }}>
              Add your first question to
              this exam.
            </Typography>

            <Button
              variant="contained"
              startIcon={<AddIcon />}
              sx={{
                mt: 3,
              }}
              onClick={handleCreate}
            >
              Add Question
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Grid
          container
          spacing={3}
        >
          {questions.map(
            (question, index) => (
              <Grid
                size={{
                  xs: 12,
                  md: 6,
                }}
                key={question.id}
              >
                <Card
                  sx={{
                    height: "100%",
                    borderRadius: 2,
                  }}
                >
                  <CardContent>
                    <Typography
                      variant="body2"
                      color="primary"
                      sx={{
                        fontWeight: 600
                      }}
                    >
                      Question {index + 1}
                    </Typography>

                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 600,
                        mt: 1,

                        wordBreak:
                          "break-word"
                      }}>
                      {question.questionText}
                    </Typography>

                    <Typography
                      variant="body2"
                      sx={{
                        color: "text.secondary",
                        mt: 1
                      }}>
                      Marks:{" "}
                      {question.marks ?? 0}
                    </Typography>

                    {/* OPTIONS */}

                    {Array.isArray(
                      question.options
                    ) &&
                      question.options.map(
                        (option, optionIndex) => (
                          <Box
                            key={option.id}
                            sx={{
                              mt: 1,
                              p: 1.2,
                              borderRadius: 1,
                              backgroundColor:
                                option.isCorrect
                                  ? "success.light"
                                  : "grey.100",
                            }}
                          >
                            <Typography
                              variant="body2"
                              sx={{
                                fontWeight: option.isCorrect
                                  ? 700
                                  : 400
                              }}
                            >
                              {String.fromCharCode(
                                65 +
                                optionIndex
                              )}
                              .{" "}
                              {
                                option.optionText
                              }

                              {option.isCorrect &&
                                " ✓ Correct"}
                            </Typography>
                          </Box>
                        )
                      )}

                    {/* ACTIONS */}

                    <Box
                      sx={{
                        display: "flex",
                        justifyContent:
                          "flex-end",
                        gap: 1,
                        mt: 2,
                      }}
                    >
                      <IconButton
                        color="primary"
                        title="Edit Question"
                        onClick={() =>
                          handleEdit(
                            question
                          )
                        }
                      >
                        <EditIcon />
                      </IconButton>

                      <IconButton
                        color="error"
                        title="Delete Question"
                        onClick={() =>
                          handleDelete(
                            question.id
                          )
                        }
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            )
          )}
        </Grid>
      )}

      {/* =================================================
          CREATE / EDIT DIALOG
      ================================================= */}

      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle
          sx={{
            fontWeight: 700,
          }}
        >
          {editingId
            ? "Edit Question"
            : "Add Question"}
        </DialogTitle>

        <DialogContent>
          {/* QUESTION */}

          <TextField
            fullWidth
            required
            label="Question"
            name="questionText"
            value={
              formData.questionText
            }
            onChange={handleChange}
            margin="normal"
            multiline
            rows={3}
            placeholder="Enter your question..."
          />

          {/* MARKS */}

          <TextField
            fullWidth
            required
            label="Marks"
            name="marks"
            type="number"
            value={formData.marks}
            onChange={handleChange}
            margin="normal"
            inputProps={{
              min: 1,
            }}
          />

          {/* QUESTION TYPE */}

          <TextField
            fullWidth
            select
            label="Question Type"
            name="questionType"
            value={
              formData.questionType
            }
            onChange={handleChange}
            margin="normal"
          >
            <MenuItem value="single">
              Single Correct Answer
            </MenuItem>

            <MenuItem value="multiple">
              Multiple Correct Answers
            </MenuItem>
          </TextField>

          {/* =================================================
              OPTIONS
          ================================================= */}

          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 700,
              mt: 3,
              mb: 1
            }}>
            Options
          </Typography>

          <Grid
            container
            spacing={2}
          >
            {/* OPTION A */}

            <Grid
              size={{
                xs: 12,
                sm: 6,
              }}
            >
              <TextField
                fullWidth
                required
                label="Option A"
                name="optionA"
                value={
                  formData.optionA
                }
                onChange={handleChange}
                placeholder="Enter option A"
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
                required
                label="Option B"
                name="optionB"
                value={
                  formData.optionB
                }
                onChange={handleChange}
                placeholder="Enter option B"
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
                required
                label="Option C"
                name="optionC"
                value={
                  formData.optionC
                }
                onChange={handleChange}
                placeholder="Enter option C"
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
                required
                label="Option D"
                name="optionD"
                value={
                  formData.optionD
                }
                onChange={handleChange}
                placeholder="Enter option D"
              />
            </Grid>
          </Grid>

          {/* =================================================
              CORRECT ANSWER
          ================================================= */}

          <TextField
            fullWidth
            select
            required
            label="Correct Answer"
            name="correctAnswer"
            value={
              formData.correctAnswer
            }
            onChange={handleChange}
            margin="normal"
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
        </DialogContent>

        {/* =================================================
            DIALOG ACTIONS
        ================================================= */}

        <DialogActions
          sx={{
            px: 3,
            pb: 2,
          }}
        >
          <Button
            onClick={handleClose}
            disabled={saving}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={saving}
          >
            {saving
              ? "Saving..."
              : editingId
                ? "Update Question"
                : "Add Question"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ManageQuestions;

