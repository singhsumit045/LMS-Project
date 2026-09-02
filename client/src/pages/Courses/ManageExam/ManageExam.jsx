import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

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
  Switch,
  TextField,
  Typography,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import {
  createExam,
  getTeacherExams,
  updateExam,
  deleteExam,
} from "../../../services/examService";

const initialForm = {
  title: "",
  description: "",
  duration: "",
  totalMarks: "",
  passingPercentage: "",
  isPublished: false,
};

const ManageExams = () => {
  const { id: courseId } = useParams();
  const navigate = useNavigate();

  const [exams, setExams] = useState([]);
  const [formData, setFormData] = useState(initialForm);

  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // =====================================================
  // FETCH EXAMS
  // =====================================================

  const fetchExams = async () => {
    try {
      setLoading(true);

      const data = await getTeacherExams();

      setExams(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching exams:", error);

      alert(
        error?.response?.data?.message ||
          "Unable to load exams"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExams();
  }, []);

  // =====================================================
  // CREATE EXAM
  // =====================================================

  const handleCreate = () => {
    setEditingId(null);
    setFormData(initialForm);
    setOpen(true);
  };

  // =====================================================
  // EDIT EXAM
  // =====================================================

  const handleEdit = (exam) => {
    setEditingId(exam.id);

    setFormData({
      title: exam.title || "",
      description: exam.description || "",
      duration: exam.duration ?? "",
      totalMarks: exam.totalMarks ?? "",
      passingPercentage: exam.passingPercentage ?? "",
      isPublished: exam.isPublished ?? false,
    });

    setOpen(true);
  };

  // =====================================================
  // MANAGE QUESTIONS
  // =====================================================

  const handleManageQuestions = (examId) => {
    navigate(`/exams/${examId}/questions`);
  };

  // =====================================================
  // CLOSE DIALOG
  // =====================================================

  const handleClose = () => {
    if (saving) return;

    setOpen(false);
    setEditingId(null);
    setFormData(initialForm);
  };

  // =====================================================
  // INPUT CHANGE
  // =====================================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // =====================================================
  // PUBLISHED CHANGE
  // =====================================================

  const handlePublishedChange = (event) => {
    setFormData((previous) => ({
      ...previous,
      isPublished: event.target.checked,
    }));
  };

  // =====================================================
  // SUBMIT EXAM
  // =====================================================

  const handleSubmit = async () => {
    // ---------------------------------------------------
    // Course ID validation
    // ---------------------------------------------------

    if (!courseId || Number(courseId) <= 0) {
      alert("Invalid course ID");
      return;
    }

    // ---------------------------------------------------
    // Title validation
    // ---------------------------------------------------

    if (!formData.title.trim()) {
      alert("Please enter exam title");
      return;
    }

    // ---------------------------------------------------
    // Description validation
    // ---------------------------------------------------

    if (!formData.description.trim()) {
      alert("Please enter exam description");
      return;
    }

    // ---------------------------------------------------
    // Duration validation
    // ---------------------------------------------------

    if (
      formData.duration === "" ||
      Number(formData.duration) <= 0
    ) {
      alert("Please enter a valid duration");
      return;
    }

    // ---------------------------------------------------
    // Total marks validation
    // ---------------------------------------------------

    if (
      formData.totalMarks === "" ||
      Number(formData.totalMarks) < 0
    ) {
      alert("Please enter valid total marks");
      return;
    }

    // ---------------------------------------------------
    // Passing percentage validation
    // ---------------------------------------------------

    if (
      formData.passingPercentage === "" ||
      Number(formData.passingPercentage) < 0
    ) {
      alert("Please enter valid passing percentage");
      return;
    }

    // ---------------------------------------------------
    // Passing percentage validation
    // ---------------------------------------------------

    if (Number(formData.passingPercentage) > 100) {
      alert("Passing percentage cannot be greater than 100");
      return;
    }

    try {
      setSaving(true);

      // =================================================
      // CREATE / UPDATE PAYLOAD
      // =================================================

      const payload = {
        title: formData.title.trim(),

        description:
          formData.description.trim(),

        duration:
          Number(formData.duration),

        totalMarks:
          Number(formData.totalMarks),

        passingPercentage:
          Number(formData.passingPercentage),

        isPublished:
          Boolean(formData.isPublished),

        // IMPORTANT:
        // courseId comes from URL
        courseId:
          Number(courseId),
      };

      console.log("Exam payload:", payload);

      // =================================================
      // UPDATE
      // =================================================

      if (editingId) {
        await updateExam(
          editingId,
          payload
        );
      }

      // =================================================
      // CREATE
      // =================================================

      else {
        await createExam(payload);
      }

      // =================================================
      // RESET
      // =================================================

      setOpen(false);
      setEditingId(null);
      setFormData(initialForm);

      await fetchExams();

      alert(
        editingId
          ? "Exam updated successfully"
          : "Exam created successfully"
      );
    } catch (error) {
      console.error(
        "Error saving exam:",
        error
      );

      alert(
        error?.response?.data?.message ||
          "Something went wrong while saving the exam"
      );
    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // DELETE EXAM
  // =====================================================

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this exam?"
    );

    if (!confirmed) return;

    try {
      await deleteExam(id);

      await fetchExams();

      alert("Exam deleted successfully");
    } catch (error) {
      console.error(
        "Error deleting exam:",
        error
      );

      alert(
        error?.response?.data?.message ||
          "Something went wrong while deleting the exam"
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
            Manage Exams
          </Typography>

          <Typography
            sx={{
              color: "text.secondary",
              mt: 0.5
            }}>
            Create and manage exams for this
            course
          </Typography>

          {courseId && (
            <Typography
              variant="body2"
              sx={{
                color: "text.secondary",
                mt: 0.5
              }}>
              Course ID: {courseId}
            </Typography>
          )}
        </Box>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreate}
        >
          Create Exam
        </Button>
      </Box>

      {/* =================================================
          EXAM LIST
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
            Loading exams...
          </Typography>
        </Box>
      ) : exams.length === 0 ? (
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
              No exams found
            </Typography>

            <Typography
              sx={{
                color: "text.secondary",
                mt: 1
              }}>
              Create your first exam for this
              course.
            </Typography>

            <Button
              variant="contained"
              startIcon={<AddIcon />}
              sx={{
                mt: 3,
              }}
              onClick={handleCreate}
            >
              Create Exam
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Grid
          container
          spacing={3}
        >
          {exams.map((exam) => {
            const published =
              exam.published ??
              exam.isPublished ??
              false;

            const passingPercentage = exam.passingPercentage ?? 0;

            return (
              <Grid
                size={{
                  xs: 12,
                  sm: 6,
                  lg: 4,
                }}
                key={exam.id}
              >
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    borderRadius: 2,
                  }}
                >
                  <CardContent
                    sx={{
                      flexGrow: 1,
                    }}
                  >
                    {/* =================================================
                        TITLE + STATUS
                    ================================================= */}

                    <Box
                      sx={{
                        display: "flex",
                        justifyContent:
                          "space-between",
                        alignItems:
                          "flex-start",
                        gap: 1,
                      }}
                    >
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 700
                        }}
                      >
                        {exam.title}
                      </Typography>

                      <Box
                        component="span"
                        sx={{
                          px: 1,
                          py: 0.5,
                          borderRadius: 1,
                          fontSize:
                            "0.75rem",
                          fontWeight: 600,
                          whiteSpace:
                            "nowrap",
                          backgroundColor:
                            published
                              ? "success.light"
                              : "grey.200",
                          color: published
                            ? "success.dark"
                            : "text.secondary",
                        }}
                      >
                        {published
                          ? "Published"
                          : "Draft"}
                      </Box>
                    </Box>

                    {/* =================================================
                        DESCRIPTION
                    ================================================= */}

                    <Typography
                      sx={{
                        color: "text.secondary",
                        mt: 1.5,
                        minHeight: 48,

                        display:
                          "-webkit-box",

                        WebkitLineClamp: 2,

                        WebkitBoxOrient:
                          "vertical",

                        overflow: "hidden"
                      }}>
                      {exam.description}
                    </Typography>

                    {/* =================================================
                        EXAM INFORMATION
                    ================================================= */}

                    <Box
                      sx={{
                        mt: 2.5,
                      }}
                    >
                      <Typography variant="body2">
                        <strong>
                          Duration:
                        </strong>{" "}
                        {exam.duration}{" "}
                        minutes
                      </Typography>

                      <Typography variant="body2">
                        <strong>
                          Total Marks:
                        </strong>{" "}
                        {exam.totalMarks}
                      </Typography>

                      <Typography variant="body2">
                        <strong>
                          Passing:
                        </strong>{" "}
                        {passingPercentage}%
                      </Typography>
                    </Box>
                  </CardContent>

                  {/* =================================================
                      ACTIONS
                  ================================================= */}

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent:
                        "flex-end",
                      alignItems: "center",
                      gap: 1,
                      px: 2,
                      pb: 2,
                      flexWrap: "wrap",
                    }}
                  >
                    {/* MANAGE QUESTIONS */}

                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() =>
                        handleManageQuestions(
                          exam.id
                        )
                      }
                    >
                      Manage Questions
                    </Button>

                    {/* EDIT */}

                    <IconButton
                      color="primary"
                      onClick={() =>
                        handleEdit(exam)
                      }
                      title="Edit Exam"
                    >
                      <EditIcon />
                    </IconButton>

                    {/* DELETE */}

                    <IconButton
                      color="error"
                      onClick={() =>
                        handleDelete(
                          exam.id
                        )
                      }
                      title="Delete Exam"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}

      {/* =================================================
          CREATE / EDIT DIALOG
      ================================================= */}

      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle
          sx={{
            fontWeight: 700,
          }}
        >
          {editingId
            ? "Edit Exam"
            : "Create Exam"}
        </DialogTitle>

        <DialogContent>
          {/* =================================================
              TITLE
          ================================================= */}

          <TextField
            fullWidth
            required
            label="Exam Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            margin="normal"
          />

          {/* =================================================
              DESCRIPTION
          ================================================= */}

          <TextField
            fullWidth
            required
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            margin="normal"
            multiline
            rows={4}
          />

          {/* =================================================
              DURATION
          ================================================= */}

          <TextField
            fullWidth
            required
            label="Duration (minutes)"
            name="duration"
            type="number"
            value={formData.duration}
            onChange={handleChange}
            margin="normal"
            slotProps={{
              min: 1,
            }}
          />

          {/* =================================================
              TOTAL MARKS
          ================================================= */}

          <TextField
            fullWidth
            required
            label="Total Marks"
            name="totalMarks"
            type="number"
            value={formData.totalMarks}
            onChange={handleChange}
            margin="normal"
            slotProps={{
              min: 0,
            }}
          />

          {/* =================================================
              PASSING PERCENTAGE
          ================================================= */}

          <TextField
            fullWidth
            required
            label="Passing Percentage (%)"
            name="passingPercentage"
            type="number"
            value={formData.passingPercentage}
            onChange={handleChange}
            margin="normal"
            slotProps={{
              min: 0,
              max: 100,
            }}
          />

          {/* =================================================
              PUBLISHED
          ================================================= */}

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              mt: 2,
            }}
          >
            <Switch
              checked={formData.isPublished}
              onChange={
                handlePublishedChange
              }
            />

            <Typography>
              Publish Exam
            </Typography>
          </Box>
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
                ? "Update Exam"
                : "Create Exam"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ManageExams;