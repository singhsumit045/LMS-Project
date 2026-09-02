import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
  Paper,
  Snackbar,
  Stack,
  TextField,
  Tooltip,
  Typography,
  Chip,
} from "@mui/material";

import {
  Add,
  Delete,
  Description,
  Download,
  Edit,
  PictureAsPdf,
  Search,
  UploadFile,
  Visibility,
  Close,
  CalendarMonth,
  Storage,
} from "@mui/icons-material";

import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";

import api from "../../../services/api";

const ManageNotes = () => {
  // =====================================================
  // GET COURSE ID
  // Supports both :courseId and :id routes
  // =====================================================

  const params = useParams();

  const courseId = params.courseId || params.id;

  // =====================================================
  // STATES
  // =====================================================

  const [notes, setNotes] = useState([]);

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [savingId, setSavingId] = useState(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // =====================================================
  // UPLOAD FORM
  // =====================================================

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  const fileInputRef = useRef(null);

  // =====================================================
  // SEARCH
  // =====================================================

  const [search, setSearch] = useState("");

  // =====================================================
  // EDIT
  // =====================================================

  const [editOpen, setEditOpen] = useState(false);
  const [editingNote, setEditingNote] = useState(null);

  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");

  // =====================================================
  // FETCH NOTES
  // =====================================================

  const fetchNotes = async () => {
    if (!courseId) {
      console.error("ManageNotes: courseId is missing.");
      setError("Course ID is missing.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      console.log(
        "ManageNotes: fetching notes for course:",
        courseId
      );

      const response = await api.get(
        `/notes/course/${courseId}`
      );

      console.log(
        "ManageNotes: Notes API response:",
        response.data
      );

      const data = response?.data;

      setNotes(
        Array.isArray(data)
          ? data
          : Array.isArray(data?.data)
          ? data.data
          : Array.isArray(data?.notes)
          ? data.notes
          : []
      );
    } catch (error) {
      console.error(
        "Fetch notes error:",
        error
      );

      const message =
        error?.response?.data?.message ||
        "Unable to load notes.";

      setError(
        Array.isArray(message)
          ? message.join(", ")
          : message
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    if (courseId) {
      fetchNotes();
    }
  }, [courseId]);

  // =====================================================
  // FILE SELECT
  // =====================================================

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (
      file.type !== "application/pdf" &&
      !file.name.toLowerCase().endsWith(".pdf")
    ) {
      setError("Only PDF files are allowed.");

      event.target.value = "";
      setSelectedFile(null);

      return;
    }

    setSelectedFile(file);
    setError("");
  };

  // =====================================================
  // UPLOAD
  // =====================================================

  const handleUpload = async (event) => {
    event.preventDefault();

    if (!courseId) {
      setError("Course ID is missing.");
      return;
    }

    if (!title.trim()) {
      setError("Please enter note title.");
      return;
    }

    if (!selectedFile) {
      setError("Please select a PDF file.");
      return;
    }

    try {
      setUploading(true);
      setError("");

      const formData = new FormData();

      formData.append(
        "file",
        selectedFile
      );

      formData.append(
        "title",
        title.trim()
      );

      formData.append(
        "content",
        content.trim()
      );

      formData.append(
        "courseId",
        String(courseId)
      );

      await api.post(
        "/notes/upload",
        formData,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      );

      setTitle("");
      setContent("");
      setSelectedFile(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      setSuccess(
        "Note uploaded successfully."
      );

      await fetchNotes();
    } catch (error) {
      console.error(
        "Upload note error:",
        error
      );

      const message =
        error?.response?.data?.message ||
        "Unable to upload note.";

      setError(
        Array.isArray(message)
          ? message.join(", ")
          : message
      );
    } finally {
      setUploading(false);
    }
  };

  // =====================================================
  // VIEW PDF
  // =====================================================

  const handleView = (url) => {
    if (!url) {
      setError(
        "PDF URL is not available."
      );
      return;
    }

    window.open(
      url,
      "_blank",
      "noopener,noreferrer"
    );
  };

  // =====================================================
  // DOWNLOAD PDF
  // =====================================================

  const handleDownload = (
    url,
    noteTitle
  ) => {
    if (!url) {
      setError(
        "PDF URL is not available."
      );
      return;
    }

    const link =
      document.createElement("a");

    link.href = url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.download = `${
      noteTitle || "note"
    }.pdf`;

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);
  };

  // =====================================================
  // DELETE
  // =====================================================

  const handleDelete = async (note) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${note.title}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(note.id);
      setError("");

      await api.delete(
        `/notes/${note.id}`
      );

      setNotes((prev) =>
        prev.filter(
          (item) =>
            item.id !== note.id
        )
      );

      setSuccess(
        "Note deleted successfully."
      );
    } catch (error) {
      console.error(
        "Delete note error:",
        error
      );

      const message =
        error?.response?.data?.message ||
        "Unable to delete note.";

      setError(
        Array.isArray(message)
          ? message.join(", ")
          : message
      );
    } finally {
      setDeletingId(null);
    }
  };

  // =====================================================
  // OPEN EDIT
  // =====================================================

  const handleOpenEdit = (note) => {
    setEditingNote(note);

    setEditTitle(
      note.title || ""
    );

    setEditContent(
      note.content || ""
    );

    setEditOpen(true);
  };

  // =====================================================
  // CLOSE EDIT
  // =====================================================

  const handleCloseEdit = () => {
    if (savingId) {
      return;
    }

    setEditOpen(false);
    setEditingNote(null);

    setEditTitle("");
    setEditContent("");
  };

  // =====================================================
  // SAVE EDIT
  // =====================================================

  const handleSaveEdit = async () => {
    if (!editingNote) {
      return;
    }

    if (!editTitle.trim()) {
      setError(
        "Note title is required."
      );
      return;
    }

    try {
      setSavingId(editingNote.id);
      setError("");

      const response =
        await api.put(
          `/notes/${editingNote.id}`,
          {
            title:
              editTitle.trim(),
            content:
              editContent.trim(),
          }
        );

      const updatedNote =
        response?.data;

      setNotes((prev) =>
        prev.map((note) =>
          note.id ===
          editingNote.id
            ? {
                ...note,
                ...(updatedNote || {}),
                title:
                  updatedNote?.title ??
                  editTitle.trim(),
                content:
                  updatedNote?.content ??
                  editContent.trim(),
              }
            : note
        )
      );

      setSuccess(
        "Note updated successfully."
      );

      setEditOpen(false);
      setEditingNote(null);
      setEditTitle("");
      setEditContent("");
    } catch (error) {
      console.error(
        "Update note error:",
        error
      );

      const message =
        error?.response?.data?.message ||
        "Unable to update note.";

      setError(
        Array.isArray(message)
          ? message.join(", ")
          : message
      );
    } finally {
      setSavingId(null);
    }
  };

  // =====================================================
  // FILE SIZE
  // =====================================================

  const formatFileSize = (bytes) => {
    if (!bytes) {
      return "PDF";
    }

    const units = [
      "Bytes",
      "KB",
      "MB",
      "GB",
    ];

    const index = Math.floor(
      Math.log(bytes) /
        Math.log(1024)
    );

    const safeIndex = Math.min(
      index,
      units.length - 1
    );

    const size =
      bytes /
      Math.pow(
        1024,
        safeIndex
      );

    return `${size.toFixed(
      safeIndex === 0
        ? 0
        : 1
    )} ${
      units[safeIndex]
    }`;
  };

  // =====================================================
  // DATE
  // =====================================================

  const formatDate = (date) => {
    if (!date) {
      return "Unknown date";
    }

    try {
      return new Date(
        date
      ).toLocaleDateString(
        "en-IN",
        {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }
      );
    } catch {
      return "Unknown date";
    }
  };

  // =====================================================
  // SEARCH
  // =====================================================

  const filteredNotes =
    useMemo(() => {
      const keyword =
        search
          .trim()
          .toLowerCase();

      if (!keyword) {
        return notes;
      }

      return notes.filter(
        (note) => {
          const noteTitle =
            note.title?.toLowerCase() ||
            "";

          const noteContent =
            note.content?.toLowerCase() ||
            "";

          return (
            noteTitle.includes(
              keyword
            ) ||
            noteContent.includes(
              keyword
            )
          );
        }
      );
    }, [notes, search]);

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "60vh",
          display: "flex",
          alignItems: "center",
          justifyContent:
            "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <Container
      maxWidth="lg"
      sx={{
        py: {
          xs: 2,
          sm: 3,
          md: 4,
        },
      }}
    >
      {/* =====================================================
          HEADER
      ===================================================== */}

      <Paper
        elevation={0}
        sx={{
          p: {
            xs: 2,
            sm: 2.5,
          },
          mb: 2.5,
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <Stack
          direction={{
            xs: "column",
            sm: "row",
          }}
          spacing={2}
          sx={{
            alignItems: {
              xs: "flex-start",
              sm: "center",
            },
            justifyContent:
              "space-between",
          }}
        >
          <Stack
            direction="row"
            spacing={1.5}
            sx={{
              alignItems:
                "center",
            }}
          >
            <Box
              sx={{
                width: 46,
                height: 46,
                borderRadius: 2,
                display: "flex",
                alignItems:
                  "center",
                justifyContent:
                  "center",
                bgcolor:
                  "primary.main",
                color: "white",
              }}
            >
              <Description />
            </Box>

            <Box>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 800
                }}
              >
                Manage Notes
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  color: "text.secondary"
                }}
              >
                Manage course PDF
                materials
              </Typography>
            </Box>
          </Stack>

          <Chip
            icon={
              <Description />
            }
            label={`${notes.length} ${
              notes.length === 1
                ? "Note"
                : "Notes"
            }`}
            color="primary"
            variant="outlined"
            size="small"
          />
        </Stack>
      </Paper>

      {/* =====================================================
          ERROR
      ===================================================== */}

      {error && (
        <Alert
          severity="error"
          onClose={() =>
            setError("")
          }
          sx={{
            mb: 2.5,
            borderRadius: 2,
          }}
        >
          {error}
        </Alert>
      )}

      {/* =====================================================
          UPLOAD
      ===================================================== */}

      <Paper
        elevation={0}
        component="form"
        onSubmit={handleUpload}
        sx={{
          p: {
            xs: 2,
            sm: 2.5,
          },
          mb: 2.5,
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <Stack
          direction="row"
          spacing={1}
          sx={{
            alignItems:
              "center",
            mb: 2,
          }}
        >
          <Add color="primary" />

          <Typography
            variant="h6"
            sx={{
              fontWeight: 800
            }}
          >
            Upload New Note
          </Typography>
        </Stack>

        <Stack spacing={1.8}>
          {/* TITLE */}

          <TextField
            size="small"
            fullWidth
            label="Note Title"
            placeholder="e.g. Java OOP Notes"
            value={title}
            onChange={(event) =>
              setTitle(
                event.target.value
              )
            }
          />

          {/* DESCRIPTION */}

          <TextField
            size="small"
            fullWidth
            multiline
            minRows={2}
            label="Description"
            placeholder="Short description..."
            value={content}
            onChange={(event) =>
              setContent(
                event.target.value
              )
            }
          />

          {/* FILE */}

          <Box
            sx={{
              p: 1.5,
              border: "1px dashed",
              borderColor:
                selectedFile
                  ? "success.main"
                  : "divider",
              borderRadius: 2,
              bgcolor:
                "action.hover",
            }}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="application/pdf,.pdf"
              onChange={
                handleFileChange
              }
              style={{
                display: "none",
              }}
              id="note-pdf-upload"
            />

            <Stack
              direction={{
                xs: "column",
                sm: "row",
              }}
              spacing={1.5}
              sx={{
                alignItems: {
                  xs: "stretch",
                  sm: "center",
                },
                justifyContent:
                  "space-between",
              }}
            >
              <Box
                sx={{
                  minWidth: 0,
                }}
              >
                {selectedFile ? (
                  <Stack
                    direction="row"
                    spacing={1}
                    sx={{
                      alignItems:
                        "center",
                    }}
                  >
                    <PictureAsPdf
                      color="error"
                    />

                    <Box
                      sx={{
                        minWidth: 0,
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 700,

                          overflow:
                            "hidden",

                          textOverflow:
                            "ellipsis",

                          whiteSpace:
                            "nowrap",

                          maxWidth: {
                            xs: 230,
                            sm: 400,
                          }
                        }}>
                        {
                          selectedFile.name
                        }
                      </Typography>

                      <Typography
                        variant="caption"
                        sx={{
                          color: "text.secondary"
                        }}
                      >
                        {formatFileSize(
                          selectedFile.size
                        )}
                      </Typography>
                    </Box>
                  </Stack>
                ) : (
                  <Typography
                    variant="body2"
                    sx={{
                      color: "text.secondary"
                    }}
                  >
                    Select a PDF
                    file
                  </Typography>
                )}
              </Box>

              <label htmlFor="note-pdf-upload">
                <Button
                  component="span"
                  size="small"
                  variant="outlined"
                  startIcon={
                    <UploadFile />
                  }
                  sx={{
                    textTransform:
                      "none",
                    borderRadius: 2,
                  }}
                >
                  Select PDF
                </Button>
              </label>
            </Stack>
          </Box>

          {/* UPLOAD BUTTON */}

          <Button
            type="submit"
            variant="contained"
            size="small"
            disabled={uploading}
            startIcon={
              uploading ? (
                <CircularProgress
                  size={16}
                  color="inherit"
                />
              ) : (
                <UploadFile />
              )
            }
            sx={{
              alignSelf: {
                xs: "stretch",
                sm: "flex-start",
              },
              textTransform:
                "none",
              borderRadius: 2,
              fontWeight: 700,
            }}
          >
            {uploading
              ? "Uploading..."
              : "Upload Note"}
          </Button>
        </Stack>
      </Paper>

      {/* =====================================================
          NOTES HEADER
      ===================================================== */}

      <Paper
        elevation={0}
        sx={{
          p: 1.8,
          mb: 2,
          borderRadius: 2.5,
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <Stack
          direction={{
            xs: "column",
            sm: "row",
          }}
          spacing={1.5}
          sx={{
            alignItems: {
              xs: "stretch",
              sm: "center",
            },
            justifyContent:
              "space-between",
          }}
        >  
          <Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 800
              }}
            >
              Course Notes
            </Typography>

            <Typography
              variant="caption"
              sx={{
                color: "text.secondary"
              }}
            >
              {filteredNotes.length}{" "}
              of {notes.length}{" "}
              displayed
            </Typography>
          </Box>

          <TextField
            size="small"
            placeholder="Search notes..."
            value={search}
            onChange={(event) =>
              setSearch(
                event.target.value
              )
            } 
            sx={{
              width: {
                xs: "100%",
                sm: 280,
              },
            }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Search fontSize="small" />
                  </InputAdornment>
                ),
                endAdornment:
                  search ? (
                    <InputAdornment position="end">
                      <IconButton
                        size="small"
                        onClick={() =>
                          setSearch(
                            ""
                          )
                        }
                      >
                        <Close fontSize="small" />
                      </IconButton>
                    </InputAdornment>
                  ) : null,
              },
            }}
          />
        </Stack>
      </Paper>

      {/* =====================================================
          EMPTY STATE
      ===================================================== */}

      {filteredNotes.length ===
        0 && (
        <Paper
          elevation={0}
          sx={{
            p: 5,
            textAlign: "center",
            borderRadius: 3,
            border: "1px solid",
            borderColor:
              "divider",
          }}
        >
          <Description
            sx={{
              fontSize: 50,
              color:
                "text.disabled",
              mb: 1,
            }}
          />

          <Typography
            variant="h6"
            sx={{
              fontWeight: 800
            }}
          >
            {search
              ? "No notes found"
              : "No notes available"}
          </Typography>

          <Typography
            variant="body2"
            sx={{
              color: "text.secondary",
              mt: 0.5
            }}>
            {search
              ? "Try another search."
              : "Upload your first PDF note."}
          </Typography>
        </Paper>
      )}

      {/* =====================================================
          NOTES LIST
      ===================================================== */}

      {filteredNotes.length >
        0 && (
        <Stack spacing={1.5}>
          {filteredNotes.map(
            (note, index) => (
              <Paper
                key={note.id}
                elevation={0}
                sx={{
                  p: {
                    xs: 1.5,
                    sm: 2,
                  },
                  borderRadius: 2.5,
                  border:
                    "1px solid",
                  borderColor:
                    "divider",
                  transition:
                    "0.2s",
                  "&:hover": {
                    borderColor:
                      "primary.main",
                    boxShadow:
                      "0 5px 18px rgba(0,0,0,0.07)",
                  },
                }}
              >
                <Stack
                  direction={{
                    xs: "column",
                    sm: "row",
                  }}
                  spacing={1.5}
                  sx={{
                    alignItems: {
                      xs: "stretch",
                      sm: "center",
                    },
                  }}
                >
                  {/* PDF ICON */}

                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: 2,
                      flexShrink: 0,
                      display:
                        "flex",
                      alignItems:
                        "center",
                      justifyContent:
                        "center",
                      bgcolor:
                        "rgba(211,47,47,0.08)",
                    }}
                  >
                    <PictureAsPdf
                      color="error"
                      sx={{
                        fontSize: 27,
                      }}
                    />
                  </Box>

                  {/* INFO */}

                  <Box
                    sx={{
                      flex: 1,
                      minWidth: 0,
                    }}
                  >
                    <Stack
                      direction="row"
                      spacing={0.8}
                      sx={{
                        alignItems:
                          "center",
                        flexWrap:
                          "wrap",
                      }}
                    >
                      <Typography
                        variant="subtitle1"
                        sx={{
                          fontWeight: 800,

                          wordBreak:
                            "break-word"
                        }}>
                        {index + 1}.{" "}
                        {note.title ||
                          "Untitled Note"}
                      </Typography>

                      <Chip
                        label="PDF"
                        size="small"
                        color="error"
                        variant="outlined"
                        sx={{
                          height: 22,
                          fontSize: 11,
                          fontWeight: 700,
                        }}
                      />
                    </Stack>

                    {note.content && (
                      <Typography
                        variant="body2"
                        sx={{
                          color: "text.secondary",
                          mt: 0.3,
                          lineHeight: 1.4,

                          display:
                            "-webkit-box",

                          WebkitLineClamp: 1,

                          WebkitBoxOrient:
                            "vertical",

                          overflow:
                            "hidden"
                        }}>
                        {note.content}
                      </Typography>
                    )}

                    <Stack
                      direction="row"
                      spacing={1.5}
                      sx={{
                        mt: 0.7,
                        flexWrap:
                          "wrap",
                      }}
                    >
                      <Stack
                        direction="row"
                        spacing={0.4}
                        sx={{
                          alignItems:
                            "center",
                        }}
                      >
                        <CalendarMonth
                          sx={{
                            fontSize: 14,
                          }}
                          color="disabled"
                        />

                        <Typography
                          variant="caption"
                          sx={{
                            color: "text.secondary"
                          }}
                        >
                          {formatDate(
                            note.createdAt
                          )}
                        </Typography>
                      </Stack>

                      <Stack
                        direction="row"
                        spacing={0.4}
                        sx={{
                          alignItems:
                            "center",
                        }}
                      >
                        <Storage
                          sx={{
                            fontSize: 14,
                          }}
                          color="disabled"
                        />

                        <Typography
                          variant="caption"
                          sx={{
                            color: "text.secondary"
                          }}
                        >
                          PDF Document
                        </Typography>
                      </Stack>
                    </Stack>
                  </Box>

                  {/* ACTIONS */}

                  <Stack
                    direction="row"
                    spacing={0.5}
                    sx={{
                      alignSelf: {
                        xs: "flex-end",
                        sm: "center",
                      },
                    }}
                  >
                    {/* VIEW */}

                    <Tooltip title="View PDF">
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() =>
                          handleView(
                            note.noteUrl
                          )
                        }
                        sx={{
                          border:
                            "1px solid",
                          borderColor:
                            "divider",
                        }}
                      >
                        <Visibility fontSize="small" />
                      </IconButton>
                    </Tooltip>

                    {/* DOWNLOAD */}

                    <Tooltip title="Download PDF">
                      <IconButton
                        size="small"
                        color="success"
                        onClick={() =>
                          handleDownload(
                            note.noteUrl,
                            note.title
                          )
                        }
                        sx={{
                          border:
                            "1px solid",
                          borderColor:
                            "divider",
                        }}
                      >
                        <Download fontSize="small" />
                      </IconButton>
                    </Tooltip>

                    {/* EDIT */}

                    <Tooltip title="Edit Note">
                      <IconButton
                        size="small"
                        color="warning"
                        onClick={() =>
                          handleOpenEdit(
                            note
                          )
                        }
                        disabled={
                          savingId ===
                          note.id
                        }
                        sx={{
                          border:
                            "1px solid",
                          borderColor:
                            "divider",
                        }}
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                    </Tooltip>

                    {/* DELETE */}

                    <Tooltip title="Delete Note">
                      <span>
                        <IconButton
                          size="small"
                          color="error"
                          disabled={
                            deletingId ===
                            note.id
                          }
                          onClick={() =>
                            handleDelete(
                              note
                            )
                          }
                          sx={{
                            border:
                              "1px solid",
                            borderColor:
                              "divider",
                          }}
                        >
                          {deletingId ===
                          note.id ? (
                            <CircularProgress
                              size={18}
                            />
                          ) : (
                            <Delete fontSize="small" />
                          )}
                        </IconButton>
                      </span>
                    </Tooltip>
                  </Stack>
                </Stack>
              </Paper>
            )
          )}
        </Stack>
      )}

      {/* =====================================================
          EDIT DIALOG
      ===================================================== */}

      <Dialog
        open={editOpen}
        onClose={handleCloseEdit}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle
          sx={{
            fontWeight: 800,
          }}
        >
          Edit Note
        </DialogTitle>

        <DialogContent>
          <Stack
            spacing={2}
            sx={{
              pt: 1,
            }}
          >
            <TextField
              size="small"
              fullWidth
              label="Note Title"
              value={editTitle}
              onChange={(event) =>
                setEditTitle(
                  event.target.value
                )
              }
            />

            <TextField
              size="small"
              fullWidth
              multiline
              minRows={3}
              label="Description"
              value={editContent}
              onChange={(event) =>
                setEditContent(
                  event.target.value
                )
              }
            />

            <Alert
              severity="info"
              sx={{
                borderRadius: 2,
              }}
            >
              Editing the title and
              description does not
              change the PDF file.
            </Alert>
          </Stack>
        </DialogContent>

        <DialogActions
          sx={{
            px: 3,
            pb: 2,
          }}
        >
          <Button
            onClick={handleCloseEdit}
            disabled={Boolean(
              savingId
            )}
            sx={{
              textTransform:
                "none",
            }}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={
              handleSaveEdit
            }
            disabled={
              !editTitle.trim() ||
              Boolean(savingId)
            }
            startIcon={
              savingId ? (
                <CircularProgress
                  size={16}
                  color="inherit"
                />
              ) : (
                <Edit />
              )
            }
            sx={{
              textTransform:
                "none",
              fontWeight: 700,
              borderRadius: 2,
            }}
          >
            {savingId
              ? "Saving..."
              : "Save Changes"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* =====================================================
          SUCCESS
      ===================================================== */}

      <Snackbar
        open={Boolean(success)}
        autoHideDuration={3000}
        onClose={() =>
          setSuccess("")
        }
        message={success}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
      />
    </Container>
  );
};

export default ManageNotes;