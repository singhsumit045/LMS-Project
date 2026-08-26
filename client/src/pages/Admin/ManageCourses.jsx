import { useEffect, useMemo, useState } from "react";

import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import PeopleIcon from "@mui/icons-material/People";
import CategoryIcon from "@mui/icons-material/Category";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import RefreshIcon from "@mui/icons-material/Refresh";

import api from "../../services/api";

const ManageCourses = () => {
  // =====================================================
  // STATE
  // =====================================================

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // =====================================================
  // VIEW DIALOG
  // =====================================================

  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);

  // =====================================================
  // EDIT DIALOG
  // =====================================================

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editCourse, setEditCourse] = useState(null);
  const [updating, setUpdating] = useState(false);

  // =====================================================
  // DELETE DIALOG
  // =====================================================

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // =====================================================
  // SNACKBAR
  // =====================================================

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");

  // =====================================================
  // FETCH COURSES
  // =====================================================

  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/courses/admin");

      setCourses(
        Array.isArray(response.data) ? response.data : []
      );
    } catch (error) {
      console.error("Failed to fetch admin courses:", error);

      setError(
        error?.response?.data?.message ||
        "Failed to load courses."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // =====================================================
  // CATEGORIES
  // =====================================================

  const categories = useMemo(() => {
    return [
      ...new Set(
        courses
          .map((course) => course.category)
          .filter(Boolean)
      ),
    ];
  }, [courses]);

  // =====================================================
  // FILTER COURSES
  // =====================================================

  const filteredCourses = useMemo(() => {
    const searchText = search.trim().toLowerCase();

    return courses.filter((course) => {
      const title = course.title?.toLowerCase() || "";
      const description =
        course.description?.toLowerCase() || "";
      const category =
        course.category?.toLowerCase() || "";

      const teacherName =
        course.teacher?.name?.toLowerCase() || "";

      const teacherEmail =
        course.teacher?.email?.toLowerCase() || "";

      const matchesSearch =
        !searchText ||
        title.includes(searchText) ||
        description.includes(searchText) ||
        category.includes(searchText) ||
        teacherName.includes(searchText) ||
        teacherEmail.includes(searchText);

      const matchesCategory =
        categoryFilter === "all" ||
        course.category === categoryFilter;

      return matchesSearch && matchesCategory;
    });
  }, [courses, search, categoryFilter]);

  // =====================================================
  // VIEW COURSE
  // =====================================================

  const handleViewCourse = (course) => {
    setSelectedCourse(course);
    setViewDialogOpen(true);
  };

  const handleCloseView = () => {
    setViewDialogOpen(false);
    setSelectedCourse(null);
  };

  // =====================================================
  // EDIT COURSE
  // =====================================================

  const handleEditCourse = (course) => {
    setEditCourse({
      id: course.id,
      title: course.title || "",
      description: course.description || "",
      category: course.category || "",
      price: course.price ?? 0,
      thumbnail: course.thumbnail || "",
    });

    setEditDialogOpen(true);
  };

  const handleCloseEdit = () => {
    if (updating) return;

    setEditDialogOpen(false);
    setEditCourse(null);
  };

  // =====================================================
  // UPDATE COURSE
  // =====================================================

  const handleUpdateCourse = async () => {
    if (!editCourse) return;

    if (!editCourse.title.trim()) {
      setMessage("Course title is required.");
      setMessageType("error");
      return;
    }

    try {
      setUpdating(true);

      const response = await api.patch(
        `/courses/${editCourse.id}`,
        {
          title: editCourse.title.trim(),
          description: editCourse.description.trim(),
          category: editCourse.category.trim(),
          price: Number(editCourse.price) || 0,
          thumbnail: editCourse.thumbnail.trim(),
        }
      );

      setCourses((previousCourses) =>
        previousCourses.map((course) =>
          course.id === editCourse.id
            ? {
              ...course,
              ...response.data,
              teacher: course.teacher,
              studentCount: course.studentCount,
            }
            : course
        )
      );

      setMessage("Course updated successfully.");
      setMessageType("success");

      setEditDialogOpen(false);
      setEditCourse(null);
    } catch (error) {
      console.error("Update course error:", error);

      setMessage(
        error?.response?.data?.message ||
        "Failed to update course."
      );

      setMessageType("error");
    } finally {
      setUpdating(false);
    }
  };

  // =====================================================
  // DELETE COURSE
  // =====================================================

  const handleDeleteClick = (course) => {
    setCourseToDelete(course);
    setDeleteDialogOpen(true);
  };

  const handleCloseDelete = () => {
    if (deleting) return;

    setDeleteDialogOpen(false);
    setCourseToDelete(null);
  };

  const handleDeleteCourse = async () => {
    if (!courseToDelete) return;

    try {
      setDeleting(true);

      await api.delete(
        `/courses/${courseToDelete.id}`
      );

      setCourses((previousCourses) =>
        previousCourses.filter(
          (course) => course.id !== courseToDelete.id
        )
      );

      setMessage("Course deleted successfully.");
      setMessageType("success");

      setDeleteDialogOpen(false);
      setCourseToDelete(null);
    } catch (error) {
      console.error("Delete course error:", error);

      setMessage(
        error?.response?.data?.message ||
        "Failed to delete course."
      );

      setMessageType("error");
    } finally {
      setDeleting(false);
    }
  };

  // =====================================================
  // HELPERS
  // =====================================================

  const getTeacherName = (course) => {
    return course?.teacher?.name || "N/A";
  };

  const getTeacherEmail = (course) => {
    return course?.teacher?.email || "—";
  };

  const getTeacherInitial = (course) => {
    return (
      course?.teacher?.name
        ?.charAt(0)
        ?.toUpperCase() || "T"
    );
  };

  const getTeacherImage = (course) => {
    return course?.teacher?.profileImageUrl || undefined;
  };

  const getPrice = (price) => {
    const numericPrice = Number(price);

    if (!numericPrice) {
      return "Free";
    }

    return `₹${numericPrice.toLocaleString("en-IN")}`;
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
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress />
      </Box>
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
          py: {
            xs: 3,
            sm: 4,
          },
        }}
      >
        <Alert
          severity="error"
          sx={{
            mb: 2,
            borderRadius: 2,
          }}
        >
          {error}
        </Alert>

        <Button
          variant="contained"
          startIcon={<RefreshIcon />}
          onClick={fetchCourses}
          sx={{
            textTransform: "none",
            borderRadius: 2,
          }}
        >
          Try Again
        </Button>
      </Container>
    );
  }

  // =====================================================
  // MAIN UI
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
        pb: {
      xs: 1,
      sm: 1.5,
      md: 1,
    },

        overflowX: "auto",
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
          mb: 3,
        }}
      >
        <Box>
          <Typography
            variant="h4"
            fontWeight={800}
            sx={{
              fontSize: {
                xs: "1.7rem",
                sm: "2rem",
                md: "2.3rem",
              },
            }}
          >
            Manage Courses
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mt: 0.5,
            }}
          >
            View, monitor and manage all courses
            created by teachers.
          </Typography>
        </Box>

        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={fetchCourses}
          sx={{
            borderRadius: 2,
            textTransform: "none",
            fontWeight: 600,
          }}
        >
          Refresh
        </Button>
      </Box>

      {/* =================================================
          STATISTICS
      ================================================= */}

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
        {/* TOTAL COURSES */}

      <Paper
  elevation={0}
  sx={{
    display: {
      xs: "none",
      md: "block",
    },
    p: 2.5,
    border: "1px solid",
    borderColor: "divider",
    borderRadius: 3,
    height: "100%",
    transition: "all 0.25s ease",

    "&:hover": {
      transform: "translateY(-4px)",
      boxShadow: "0 12px 30px rgba(0,0,0,0.08)",
    },
  }}
>
          <Stack
            direction="row"
            spacing={2}
            sx={{
              alignItems: "center",
            }}
          >
            <Avatar
              sx={{
                width: 52,
                height: 52,
                bgcolor: "primary.main",
                color: "white",
              }}
            >
              <LibraryBooksIcon />
            </Avatar>

            <Box>
              <Typography
                variant="body2"
                color="text.secondary"
                fontWeight={500}
              >
                Total Courses
              </Typography>

              <Typography
                variant="h5"
                fontWeight={800}
                sx={{
                  mt: 0.3,
                }}
              >
                {courses.length}
              </Typography>
            </Box>
          </Stack>
        </Paper>

        {/* CATEGORIES */}

        <Paper
          elevation={0}
          sx={{
            p: 2.5,
            borderRadius: 3,
            border: "1px solid",
            borderColor: "divider",
            height: "100%",
            transition: "all 0.25s ease",

            "&:hover": {
              transform: "translateY(-4px)",
              boxShadow:
                "0 12px 30px rgba(0,0,0,0.08)",
            },
          }}
        >
          <Stack
            direction="row"
            spacing={2}
            sx={{
              alignItems: "center",
            }}
          >
            <Avatar
              sx={{
                width: 52,
                height: 52,
                bgcolor: "secondary.main",
                color: "white",
              }}
            >
              <CategoryIcon />
            </Avatar>

            <Box>
              <Typography
                variant="body2"
                color="text.secondary"
                fontWeight={500}
              >
                Categories
              </Typography>

              <Typography
                variant="h5"
                fontWeight={800}
                sx={{
                  mt: 0.3,
                }}
              >
                {categories.length}
              </Typography>
            </Box>
          </Stack>
        </Paper>

        {/* TOTAL ENROLLMENTS */}

        <Paper
          elevation={0}
          sx={{
            p: 2.5,
            borderRadius: 3,
            border: "1px solid",
            borderColor: "divider",
            height: "100%",
            transition: "all 0.25s ease",

            "&:hover": {
              transform: "translateY(-4px)",
              boxShadow:
                "0 12px 30px rgba(0,0,0,0.08)",
            },
          }}
        >
          <Stack
            direction="row"
            spacing={2}
            sx={{
              alignItems: "center",
            }}
          >
            <Avatar
              sx={{
                width: 52,
                height: 52,
                bgcolor: "success.main",
                color: "white",
              }}
            >
              <PeopleIcon />
            </Avatar>

            <Box>
              <Typography
                variant="body2"
                color="text.secondary"
                fontWeight={500}
              >
                Total Enrollments
              </Typography>

              <Typography
                variant="h5"
                fontWeight={800}
                sx={{
                  mt: 0.3,
                }}
              >
                {courses.reduce(
                  (total, course) =>
                    total +
                    Number(course.studentCount || 0),
                  0
                )}
              </Typography>
            </Box>
          </Stack>
        </Paper>
      </Box>

      {/* =================================================
          SEARCH + FILTER
      ================================================= */}

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
              md: "1fr 240px",
            },
            gap: 2,
          }}
        >
          <TextField
            fullWidth
            size="small"
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search course, teacher, email or category..."
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
              },
            }}
          />

          <Select
            fullWidth
            size="small"
            value={categoryFilter}
            onChange={(event) =>
              setCategoryFilter(event.target.value)
            }
          >
            <MenuItem value="all">
              All Categories
            </MenuItem>

            {categories.map((category) => (
              <MenuItem
                key={category}
                value={category}
              >
                {category}
              </MenuItem>
            ))}
          </Select>
        </Box>
      </Paper>

      {/* =================================================
          RESULT INFO
      ================================================= */}

      <Box
        sx={{
          mb: 1,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography
          variant="body2"
          color="text.secondary"
        >
          Showing{" "}
          <strong>{filteredCourses.length}</strong>{" "}
          course
          {filteredCourses.length !== 1 ? "s" : ""}
        </Typography>
      </Box>

      {/* =================================================
          DESKTOP TABLE
      ================================================= */}
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

    overflowX: "auto",
    overflowY: "auto",

    // maxHeight: "calc(100vh - 430px)",
    maxHeight: "400px",

    "&::-webkit-scrollbar": {
      width: "8px",
      height: "8px",
    },

    "&::-webkit-scrollbar-thumb": {
      backgroundColor: "text.disabled",
      borderRadius: "10px",
    },

    "&::-webkit-scrollbar-track": {
      backgroundColor: "transparent",
    },
  }}
>
        {/* TABLE HEADER */}

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns:
              "1.5fr 1.2fr 0.9fr 0.7fr 0.7fr 1.1fr",
            gap: 2,
            px: 2,
            py: 1.5,
            backgroundColor: "action.hover",
            alignItems: "center",
          }}
        >
          <Typography
            variant="body2"
            fontWeight={800}
          >
            Course
          </Typography>

          <Typography
            variant="body2"
            fontWeight={800}
          >
            Teacher
          </Typography>

          <Typography
            variant="body2"
            fontWeight={800}
          >
            Category
          </Typography>

          <Typography
            variant="body2"
            fontWeight={800}
          >
            Price
          </Typography>

          <Typography
            variant="body2"
            fontWeight={800}
          >
            Students
          </Typography>

          <Typography
            variant="body2"
            fontWeight={800}
          >
            Actions
          </Typography>
        </Box>

        {/* TABLE DATA */}

        {filteredCourses.length === 0 ? (
          <Box
            sx={{
              py: 7,
              textAlign: "center",
            }}
          >
            <LibraryBooksIcon
              sx={{
                fontSize: 50,
                color: "text.disabled",
                mb: 1,
              }}
            />

            <Typography color="text.secondary">
              No courses found.
            </Typography>
          </Box>
        ) : (
          filteredCourses.map((course) => (
            <Box
              key={course.id}
              sx={{
                display: "grid",
                gridTemplateColumns:
                  "1.5fr 1.2fr 0.9fr 0.7fr 0.7fr 1.1fr",
                gap: 2,
                px: 2,
                py: 2,
                alignItems: "center",
                borderTop: "1px solid",
                borderColor: "divider",
                transition:
                  "background-color 0.2s ease",

                "&:hover": {
                  backgroundColor: "action.hover",
                },
              }}
            >
              {/* COURSE */}

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  minWidth: 0,
                }}
              >
                <Avatar
                  variant="rounded"
                  src={course.thumbnail || undefined}
                  sx={{
                    width: 58,
                    height: 45,
                    flexShrink: 0,
                    bgcolor: "primary.main",
                    color: "white",
                  }}
                >
                  <LibraryBooksIcon />
                </Avatar>

                <Box sx={{ minWidth: 0 }}>
                  <Typography
                    fontWeight={700}
                    noWrap
                  >
                    {course.title ||
                      "Untitled Course"}
                  </Typography>

                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{
                      display: "block",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {course.description ||
                      "No description"}
                  </Typography>
                </Box>
              </Box>

              {/* TEACHER */}

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  minWidth: 0,
                }}
              >
                <Avatar
                  src={getTeacherImage(course)}
                  sx={{
                    width: 38,
                    height: 38,
                    flexShrink: 0,
                    bgcolor: "info.main",
                    color: "white",
                    fontSize: "0.85rem",
                  }}
                >
                  {getTeacherInitial(course)}
                </Avatar>

                <Box sx={{ minWidth: 0 }}>
                  <Typography
                    variant="body2"
                    fontWeight={600}
                    noWrap
                  >
                    {getTeacherName(course)}
                  </Typography>

                  <Typography
                    variant="caption"
                    color="text.secondary"
                    noWrap
                    sx={{
                      display: "block",
                    }}
                  >
                    {getTeacherEmail(course)}
                  </Typography>
                </Box>
              </Box>

              {/* CATEGORY */}

              <Chip
                size="small"
                label={course.category || "General"}
                icon={<CategoryIcon />}
                sx={{
                  maxWidth: "100%",
                }}
              />

              {/* PRICE */}

              <Typography
                variant="body2"
                fontWeight={700}
              >
                {getPrice(course.price)}
              </Typography>

              {/* STUDENTS */}

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.6,
                }}
              >
                <PeopleIcon
                  sx={{
                    fontSize: 19,
                    color: "success.main",
                  }}
                />

                <Typography
                  variant="body2"
                  fontWeight={700}
                >
                  {course.studentCount ?? 0}
                </Typography>
              </Box>

              {/* ACTIONS */}

              <Stack
                direction="row"
                spacing={0.5}
              >
                <IconButton
                  size="small"
                  title="View Course"
                  onClick={() =>
                    handleViewCourse(course)
                  }
                  sx={{
                    color: "info.main",

                    "&:hover": {
                      backgroundColor:
                        "rgba(2, 136, 209, 0.10)",
                    },
                  }}
                >
                  <VisibilityIcon fontSize="small" />
                </IconButton>

                <IconButton
                  size="small"
                  title="Edit Course"
                  onClick={() =>
                    handleEditCourse(course)
                  }
                  sx={{
                    color: "warning.main",

                    "&:hover": {
                      backgroundColor:
                        "rgba(237, 108, 2, 0.10)",
                    },
                  }}
                >
                  <EditIcon fontSize="small" />
                </IconButton>

                <IconButton
                  size="small"
                  title="Delete Course"
                  onClick={() =>
                    handleDeleteClick(course)
                  }
                  sx={{
                    color: "error.main",

                    "&:hover": {
                      backgroundColor:
                        "rgba(211, 47, 47, 0.10)",
                    },
                  }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Stack>
            </Box>
          ))
        )}
      </Paper>

      {/* =================================================
          MOBILE CARDS
      ================================================= */}

      <Box
        sx={{
          display: {
            xs: "block",
            md: "none",
          },
        }}
      >
        {filteredCourses.length === 0 ? (
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
            <LibraryBooksIcon
              sx={{
                fontSize: 45,
                color: "text.disabled",
                mb: 1,
              }}
            />

            <Typography color="text.secondary">
              No courses found.
            </Typography>
          </Paper>
        ) : (
          filteredCourses.map((course) => (
            <Paper
              key={course.id}
              elevation={0}
              sx={{
                p: 2,
                mb: 2,
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 3,
              }}
            >
              {/* COURSE HEADER */}

              <Box
                sx={{
                  display: "flex",
                  gap: 1.5,
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Avatar
                  variant="rounded"
                  src={course.thumbnail || undefined}
                  sx={{
                    width: 65,
                    height: 50,
                    bgcolor: "primary.main",
                    color: "white",
                  }}
                >
                  <LibraryBooksIcon />
                </Avatar>

                <Box
                  sx={{
                    minWidth: 0,
                    flex: 1,
                  }}
                >
                  <Typography
                    fontWeight={800}
                    noWrap
                  >
                    {course.title ||
                      "Untitled Course"}
                  </Typography>

                  <Typography
                    variant="caption"
                    color="text.secondary"
                    noWrap
                  >
                    {course.category || "General"}
                  </Typography>
                </Box>
              </Box>

              {/* TEACHER */}

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.2,
                  mb: 2,
                  p: 1.3,
                  borderRadius: 2,
                  backgroundColor: "action.hover",
                }}
              >
                <Avatar
                  src={getTeacherImage(course)}
                  sx={{
                    width: 40,
                    height: 40,
                    bgcolor: "info.main",
                    color: "white",
                  }}
                >
                  {getTeacherInitial(course)}
                </Avatar>

                <Box sx={{ minWidth: 0 }}>
                  <Typography
                    variant="body2"
                    fontWeight={700}
                    noWrap
                  >
                    {getTeacherName(course)}
                  </Typography>

                  <Typography
                    variant="caption"
                    color="text.secondary"
                    noWrap
                  >
                    {getTeacherEmail(course)}
                  </Typography>
                </Box>
              </Box>

              {/* DETAILS */}

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 2,
                  mb: 2,
                }}
              >
                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    Category
                  </Typography>

                  <Typography
                    variant="body2"
                    fontWeight={600}
                  >
                    {course.category || "General"}
                  </Typography>
                </Box>

                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    Price
                  </Typography>

                  <Typography
                    variant="body2"
                    fontWeight={700}
                  >
                    {getPrice(course.price)}
                  </Typography>
                </Box>

                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    Students
                  </Typography>

                  <Typography
                    variant="body2"
                    fontWeight={700}
                  >
                    {course.studentCount ?? 0}
                  </Typography>
                </Box>

                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    Course ID
                  </Typography>

                  <Typography
                    variant="body2"
                    fontWeight={600}
                  >
                    #{course.id}
                  </Typography>
                </Box>
              </Box>

              {/* ACTIONS */}

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(3, minmax(0, 1fr))",
                  gap: 1,
                }}
              >
                <Button
                  fullWidth
                  size="small"
                  variant="outlined"
                  startIcon={<VisibilityIcon />}
                  onClick={() =>
                    handleViewCourse(course)
                  }
                  sx={{
                    color: "info.main",
                    borderColor: "info.main",
                    textTransform: "none",
                  }}
                >
                  View
                </Button>

                <Button
                  fullWidth
                  size="small"
                  variant="outlined"
                  startIcon={<EditIcon />}
                  onClick={() =>
                    handleEditCourse(course)
                  }
                  sx={{
                    color: "warning.main",
                    borderColor: "warning.main",
                    textTransform: "none",
                  }}
                >
                  Edit
                </Button>

                <Button
                  fullWidth
                  size="small"
                  variant="outlined"
                  startIcon={<DeleteIcon />}
                  onClick={() =>
                    handleDeleteClick(course)
                  }
                  sx={{
                    color: "error.main",
                    borderColor: "error.main",
                    textTransform: "none",
                  }}
                >
                  Delete
                </Button>
              </Box>
            </Paper>
          ))
        )}
      </Box>

      {/* =================================================
          VIEW COURSE DIALOG
      ================================================= */}

      <Dialog
        open={viewDialogOpen}
        onClose={handleCloseView}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography
            component="span"
            fontWeight={800}
          >
            Course Details
          </Typography>

          <IconButton onClick={handleCloseView}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent>
          {selectedCourse && (
            <Box sx={{ pt: 1 }}>
              {/* THUMBNAIL */}

              {selectedCourse.thumbnail && (
                <Box
                  component="img"
                  src={selectedCourse.thumbnail}
                  alt={selectedCourse.title || "Course"}
                  sx={{
                    width: "100%",
                    height: {
                      xs: 180,
                      sm: 240,
                    },
                    objectFit: "cover",
                    borderRadius: 2,
                    mb: 2,
                  }}
                />
              )}

              <Typography
                variant="h5"
                fontWeight={800}
              >
                {selectedCourse.title ||
                  "Untitled Course"}
              </Typography>

              <Typography
                color="text.secondary"
                sx={{
                  mt: 1,
                  lineHeight: 1.7,
                }}
              >
                {selectedCourse.description ||
                  "No description available."}
              </Typography>

              {/* TEACHER */}

              <Box
                sx={{
                  mt: 2.5,
                  p: 2,
                  borderRadius: 2,
                  backgroundColor: "action.hover",
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                }}
              >
                <Avatar
                  src={getTeacherImage(selectedCourse)}
                  sx={{
                    width: 45,
                    height: 45,
                    bgcolor: "info.main",
                    color: "white",
                  }}
                >
                  {getTeacherInitial(selectedCourse)}
                </Avatar>

                <Box sx={{ minWidth: 0 }}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    Teacher
                  </Typography>

                  <Typography fontWeight={700}>
                    {getTeacherName(selectedCourse)}
                  </Typography>

                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    {getTeacherEmail(selectedCourse)}
                  </Typography>
                </Box>
              </Box>

              {/* DETAILS */}

              <Box
                sx={{
                  mt: 2,
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "1fr",
                    sm: "1fr 1fr",
                  },
                  gap: 2,
                }}
              >
                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    Category
                  </Typography>

                  <Typography fontWeight={600}>
                    {selectedCourse.category ||
                      "General"}
                  </Typography>
                </Box>

                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    Price
                  </Typography>

                  <Typography fontWeight={700}>
                    {getPrice(selectedCourse.price)}
                  </Typography>
                </Box>

                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    Students
                  </Typography>

                  <Typography fontWeight={700}>
                    {selectedCourse.studentCount ?? 0}
                  </Typography>
                </Box>

                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    Course ID
                  </Typography>

                  <Typography fontWeight={600}>
                    #{selectedCourse.id}
                  </Typography>
                </Box>
              </Box>
            </Box>
          )}
        </DialogContent>

        <DialogActions>
          <Button
            onClick={handleCloseView}
            sx={{
              textTransform: "none",
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* =================================================
          EDIT COURSE DIALOG
      ================================================= */}

      <Dialog
        open={editDialogOpen}
        onClose={handleCloseEdit}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography
            component="span"
            fontWeight={800}
          >
            Edit Course
          </Typography>

          <IconButton
            onClick={handleCloseEdit}
            disabled={updating}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent>
          {editCourse && (
            <Stack spacing={2} sx={{ pt: 1 }}>
              <TextField
                fullWidth
                label="Course Title"
                value={editCourse.title}
                onChange={(event) =>
                  setEditCourse({
                    ...editCourse,
                    title: event.target.value,
                  })
                }
              />

              <TextField
                fullWidth
                multiline
                minRows={4}
                label="Description"
                value={editCourse.description}
                onChange={(event) =>
                  setEditCourse({
                    ...editCourse,
                    description:
                      event.target.value,
                  })
                }
              />

              <TextField
                fullWidth
                label="Category"
                value={editCourse.category}
                onChange={(event) =>
                  setEditCourse({
                    ...editCourse,
                    category: event.target.value,
                  })
                }
              />

              <TextField
                fullWidth
                type="number"
                label="Price"
                value={editCourse.price}
                onChange={(event) =>
                  setEditCourse({
                    ...editCourse,
                    price: event.target.value,
                  })
                }
                slotProps={{
                  htmlInput: {
                    min: 0,
                  },
                }}
              />

              <TextField
                fullWidth
                label="Thumbnail URL"
                value={editCourse.thumbnail}
                onChange={(event) =>
                  setEditCourse({
                    ...editCourse,
                    thumbnail:
                      event.target.value,
                  })
                }
              />
            </Stack>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={handleCloseEdit}
            disabled={updating}
            sx={{
              textTransform: "none",
            }}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={handleUpdateCourse}
            disabled={updating}
            startIcon={
              updating ? (
                <CircularProgress
                  size={18}
                  color="inherit"
                />
              ) : null
            }
            sx={{
              textTransform: "none",
            }}
          >
            {updating
              ? "Saving..."
              : "Save Changes"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* =================================================
          DELETE DIALOG
      ================================================= */}

      <Dialog
        open={deleteDialogOpen}
        onClose={handleCloseDelete}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>
          Delete Course?
        </DialogTitle>

        <DialogContent>
          <Typography>
            Are you sure you want to delete{" "}
            <strong>
              {courseToDelete?.title}
            </strong>
            ?
          </Typography>

          <Typography
            variant="body2"
            color="error"
            sx={{
              mt: 1,
            }}
          >
            This action cannot be undone.
          </Typography>
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={handleCloseDelete}
            disabled={deleting}
            sx={{
              textTransform: "none",
            }}
          >
            Cancel
          </Button>

          <Button
            color="error"
            variant="contained"
            onClick={handleDeleteCourse}
            disabled={deleting}
            startIcon={
              deleting ? (
                <CircularProgress
                  size={18}
                  color="inherit"
                />
              ) : (
                <DeleteIcon />
              )
            }
            sx={{
              textTransform: "none",
            }}
          >
            {deleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* =================================================
          SNACKBAR
      ================================================= */}

      <Snackbar
        open={Boolean(message)}
        autoHideDuration={3500}
        onClose={() => setMessage("")}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
      >
        <Alert
          severity={messageType}
          variant="filled"
          onClose={() => setMessage("")}
        >
          {message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ManageCourses;