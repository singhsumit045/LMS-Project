import { useEffect, useMemo, useState } from "react";

import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  InputAdornment,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import SchoolIcon from "@mui/icons-material/School";
import PeopleIcon from "@mui/icons-material/People";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PendingIcon from "@mui/icons-material/Pending";
import DeleteIcon from "@mui/icons-material/Delete";

import api from "../../services/api";

const ManageEnrollments = () => {
  // =====================================================
  // STATE
  // =====================================================

  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedEnrollment, setSelectedEnrollment] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // =====================================================
  // FETCH ALL ENROLLMENTS
  // =====================================================

  const fetchEnrollments = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/enrollments/admin");

      setEnrollments(
        Array.isArray(response.data) ? response.data : []
      );
    } catch (error) {
      console.error("Failed to fetch enrollments:", error);

      setError(
        error?.response?.data?.message ||
          "Failed to load enrollments."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnrollments();
  }, []);

  // =====================================================
  // FILTER
  // =====================================================

  const filteredEnrollments = useMemo(() => {
    const searchText = search.trim().toLowerCase();

    return enrollments.filter((enrollment) => {
      const studentName =
        enrollment.student?.name?.toLowerCase() || "";

      const studentEmail =
        enrollment.student?.email?.toLowerCase() || "";

      const courseTitle =
        enrollment.course?.title?.toLowerCase() || "";

      const teacherName =
        enrollment.teacher?.name?.toLowerCase() || "";

      const matchesSearch =
        !searchText ||
        studentName.includes(searchText) ||
        studentEmail.includes(searchText) ||
        courseTitle.includes(searchText) ||
        teacherName.includes(searchText);

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "Completed" && enrollment.completed) ||
        (statusFilter === "In Progress" && !enrollment.completed);

      return matchesSearch && matchesStatus;
    });
  }, [enrollments, search, statusFilter]);

  // =====================================================
  // STATISTICS
  // =====================================================

  const totalEnrollments = enrollments.length;

  const completedEnrollments = enrollments.filter(
    (item) => item.completed
  ).length;

  const inProgressEnrollments = enrollments.filter(
    (item) => !item.completed
  ).length;

  // =====================================================
  // DATE FORMAT
  // =====================================================

  const formatDate = (date) => {
    if (!date) return "—";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "—";
    }

    return parsedDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // =====================================================
  // OPEN DELETE DIALOG
  // =====================================================

  const handleRemoveClick = (enrollment) => {
    setSelectedEnrollment(enrollment);
    setDeleteDialogOpen(true);
  };

  // =====================================================
  // CLOSE DELETE DIALOG
  // =====================================================

  const handleCloseDeleteDialog = () => {
    if (deleting) return;

    setDeleteDialogOpen(false);
    setSelectedEnrollment(null);
  };

  // =====================================================
  // CONFIRM DELETE
  // =====================================================

  const handleConfirmRemove = async () => {
    if (!selectedEnrollment?.enrollmentId) return;

    try {
      setDeleting(true);
      setError("");

      await api.delete(
        `/enrollments/admin/${selectedEnrollment.enrollmentId}`
      );

      setEnrollments((prev) =>
        prev.filter(
          (item) =>
            item.enrollmentId !==
            selectedEnrollment.enrollmentId
        )
      );

      setDeleteDialogOpen(false);
      setSelectedEnrollment(null);
    } catch (error) {
      console.error("Failed to remove enrollment:", error);

      setError(
        error?.response?.data?.message ||
          "Failed to remove enrollment."
      );
    } finally {
      setDeleting(false);
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
        <CircularProgress />
      </Box>
    );
  }

  // =====================================================
  // UI
  // =====================================================

  return (
    <Container
      maxWidth="xl"
      sx={{
        py: {
          xs: 2,
          sm: 3,
          md: 4,
        },
      }}
    >
      {/* HEADER */}

      <Box sx={{ mb: 3 }}>
        <Typography
          variant="h4"
          fontWeight={700}
          sx={{
            fontSize: {
              xs: "1.7rem",
              sm: "2rem",
              md: "2.2rem",
            },
          }}
        >
          Manage Enrollments
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mt: 0.5 }}
        >
          Monitor student enrollments, course progress and
          completion status.
        </Typography>
      </Box>

      {/* ERROR */}

      {error && (
        <Alert
          severity="error"
          sx={{ mb: 3 }}
          onClose={() => setError("")}
        >
          {error}
        </Alert>
      )}

      {/* STATISTICS */}

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(3, 1fr)",
          },
          gap: 2,
          mb: 3,
        }}
      >
        {/* TOTAL */}

        <Paper
          elevation={0}
          sx={{
            p: 2.5,
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 3,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
            }}
          >
            <SchoolIcon color="primary" />

            <Box>
              <Typography
                variant="body2"
                color="text.secondary"
              >
                Total Enrollments
              </Typography>

              <Typography variant="h5" fontWeight={700}>
                {totalEnrollments}
              </Typography>
            </Box>
          </Box>
        </Paper>

        {/* COMPLETED */}

        <Paper
          elevation={0}
          sx={{
            p: 2.5,
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 3,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
            }}
          >
            <CheckCircleIcon color="success" />

            <Box>
              <Typography
                variant="body2"
                color="text.secondary"
              >
                Completed
              </Typography>

              <Typography variant="h5" fontWeight={700}>
                {completedEnrollments}
              </Typography>
            </Box>
          </Box>
        </Paper>

        {/* IN PROGRESS */}

        <Paper
          elevation={0}
          sx={{
            p: 2.5,
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 3,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
            }}
          >
            <PendingIcon color="warning" />

            <Box>
              <Typography
                variant="body2"
                color="text.secondary"
              >
                In Progress
              </Typography>

              <Typography variant="h5" fontWeight={700}>
                {inProgressEnrollments}
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>

      {/* SEARCH + FILTER */}

      <Paper
        elevation={0}
        sx={{
          p: {
            xs: 1.5,
            sm: 2,
          },
          mb: 3,
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 3,
        }}
      >
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "1fr 220px",
            },
            gap: 2,
          }}
        >
          <TextField
            fullWidth
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search student, email, course or teacher..."
            size="small"
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              },
            }}
          />

          <Select
            fullWidth
            size="small"
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value)
            }
          >
            <MenuItem value="all">All Status</MenuItem>

            <MenuItem value="Completed">
              Completed
            </MenuItem>

            <MenuItem value="In Progress">
              In Progress
            </MenuItem>
          </Select>
        </Box>
      </Paper>

      {/* DESKTOP TABLE */}

      <Paper
        elevation={0}
        sx={{
          display: {
            xs: "none",
            md: "block",
          },
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 3,
          overflow: "hidden",
        }}
      >
        {/* TABLE HEADER */}

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns:
              "0.6fr 1.35fr 1.3fr 1.1fr 0.8fr 1fr 1fr 1.2fr",
            gap: 2,
            px: 2,
            py: 1.5,
            backgroundColor: "action.hover",
            fontWeight: 700,
          }}
        >
          <Typography variant="body2">ID</Typography>

          <Typography variant="body2">
            Student
          </Typography>

          <Typography variant="body2">
            Course
          </Typography>

          <Typography variant="body2">
            Teacher
          </Typography>

          <Typography variant="body2">
            Progress
          </Typography>

          <Typography variant="body2">
            Status
          </Typography>

          <Typography variant="body2">
            Enrolled
          </Typography>

          <Typography variant="body2">
            Actions
          </Typography>
        </Box>

        {/* TABLE DATA */}

        {filteredEnrollments.length === 0 ? (
          <Box
            sx={{
              py: 6,
              textAlign: "center",
            }}
          >
            <PeopleIcon
              sx={{
                fontSize: 45,
                color: "text.disabled",
                mb: 1,
              }}
            />

            <Typography color="text.secondary">
              No enrollments found.
            </Typography>
          </Box>
        ) : (
          filteredEnrollments.map((enrollment) => (
            <Box
              key={enrollment.enrollmentId}
              sx={{
                display: "grid",
                gridTemplateColumns:
                  "0.6fr 1.35fr 1.3fr 1.1fr 0.8fr 1fr 1fr 1.2fr",
                gap: 2,
                px: 2,
                py: 2,
                alignItems: "center",
                borderTop: "1px solid",
                borderColor: "divider",
              }}
            >
              <Typography variant="body2">
                #{enrollment.enrollmentId}
              </Typography>

              {/* STUDENT */}

              <Box sx={{ minWidth: 0 }}>
                <Typography
                  variant="body2"
                  fontWeight={600}
                  noWrap
                >
                  {enrollment.student?.name || "—"}
                </Typography>

                <Typography
                  variant="caption"
                  color="text.secondary"
                  noWrap
                >
                  {enrollment.student?.email || "—"}
                </Typography>
              </Box>

              {/* COURSE */}

              <Typography
                variant="body2"
                noWrap
                title={enrollment.course?.title || ""}
              >
                {enrollment.course?.title || "—"}
              </Typography>

              {/* TEACHER */}

              <Typography
                variant="body2"
                noWrap
              >
                {enrollment.teacher?.name || "—"}
              </Typography>

              {/* PROGRESS */}

              <Typography
                variant="body2"
                fontWeight={600}
              >
                {enrollment.progress ?? 0}%
              </Typography>

              {/* STATUS */}

              <Chip
                size="small"
                label={
                  enrollment.completed
                    ? "Completed"
                    : "In Progress"
                }
                color={
                  enrollment.completed
                    ? "success"
                    : "warning"
                }
              />

              {/* DATE */}

              <Typography
                variant="body2"
                color="text.secondary"
              >
                {formatDate(enrollment.enrolledAt)}
              </Typography>

              {/* ACTION */}

              <Button
                size="small"
                color="error"
                variant="outlined"
                startIcon={<DeleteIcon />}
                onClick={() =>
                  handleRemoveClick(enrollment)
                }
              >
                Remove
              </Button>
            </Box>
          ))
        )}
      </Paper>

      {/* MOBILE CARDS */}

      <Box
        sx={{
          display: {
            xs: "block",
            md: "none",
          },
        }}
      >
        {filteredEnrollments.length === 0 ? (
          <Paper
            elevation={0}
            sx={{
              p: 5,
              textAlign: "center",
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 3,
            }}
          >
            <Typography color="text.secondary">
              No enrollments found.
            </Typography>
          </Paper>
        ) : (
          filteredEnrollments.map((enrollment) => (
            <Paper
              key={enrollment.enrollmentId}
              elevation={0}
              sx={{
                p: 2,
                mb: 2,
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 3,
              }}
            >
              {/* STUDENT + STATUS */}

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  gap: 1,
                  mb: 2,
                }}
              >
                <Box sx={{ minWidth: 0 }}>
                  <Typography
                    variant="body1"
                    fontWeight={700}
                    noWrap
                  >
                    {enrollment.student?.name || "—"}
                  </Typography>

                  <Typography
                    variant="caption"
                    color="text.secondary"
                    noWrap
                  >
                    {enrollment.student?.email || "—"}
                  </Typography>
                </Box>

                <Chip
                  size="small"
                  label={
                    enrollment.completed
                      ? "Completed"
                      : "In Progress"
                  }
                  color={
                    enrollment.completed
                      ? "success"
                      : "warning"
                  }
                />
              </Box>

              {/* DETAILS */}

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 2,
                }}
              >
                <Box sx={{ minWidth: 0 }}>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    Course
                  </Typography>

                  <Typography
                    variant="body2"
                    fontWeight={600}
                    noWrap
                    title={enrollment.course?.title || ""}
                  >
                    {enrollment.course?.title || "—"}
                  </Typography>
                </Box>

                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    Teacher
                  </Typography>

                  <Typography variant="body2">
                    {enrollment.teacher?.name || "—"}
                  </Typography>
                </Box>

                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    Progress
                  </Typography>

                  <Typography
                    variant="body2"
                    fontWeight={600}
                  >
                    {enrollment.progress ?? 0}%
                  </Typography>
                </Box>

                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    Enrolled
                  </Typography>

                  <Typography variant="body2">
                    {formatDate(enrollment.enrolledAt)}
                  </Typography>
                </Box>
              </Box>

              {/* MOBILE REMOVE */}

              <Button
                fullWidth
                color="error"
                variant="outlined"
                startIcon={<DeleteIcon />}
                onClick={() =>
                  handleRemoveClick(enrollment)
                }
                sx={{ mt: 2 }}
              >
                Remove Enrollment
              </Button>
            </Paper>
          ))
        )}
      </Box>

      {/* DELETE CONFIRMATION DIALOG */}

      <Dialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          Remove Enrollment?
        </DialogTitle>

        <DialogContent>
          <DialogContentText>
            Are you sure you want to remove this
            enrollment?

            {selectedEnrollment?.student?.name && (
              <>
                {" "}
                <strong>
                  {selectedEnrollment.student.name}
                </strong>
              </>
            )}{" "}
            will no longer be enrolled in{" "}

            {selectedEnrollment?.course?.title && (
              <>
                <strong>
                  {selectedEnrollment.course.title}
                </strong>
              </>
            )}
            .
          </DialogContentText>
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={handleCloseDeleteDialog}
            disabled={deleting}
          >
            Cancel
          </Button>

          <Button
            color="error"
            variant="contained"
            onClick={handleConfirmRemove}
            disabled={deleting}
            startIcon={
              deleting ? (
                <CircularProgress size={18} />
              ) : (
                <DeleteIcon />
              )
            }
          >
            {deleting ? "Removing..." : "Remove"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ManageEnrollments;