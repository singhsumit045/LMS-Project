import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Alert,
  Avatar,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Fade,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import SchoolIcon from "@mui/icons-material/School";
import VideoCallIcon from "@mui/icons-material/VideoCall";
import api from "../../services/api";
import {
  endLiveClass,
  getLiveClass,
  isZoomMeetingUrl,
  setZoomMeetingUrl,
  startLiveClass,
} from "../../services/liveClassService";

const unwrap = (response) =>
  response?.data?.data || response?.data?.liveClass || response?.data;

const formatDate = (date) => {
  if (!date) return "Schedule not set";
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return "Schedule not set";
  return parsed.toLocaleString([], {
    weekday: "long",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};

const ZoomLiveClassRoom = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const { id } = useParams();
  const liveClassId = Number(id);

  const [liveClass, setLiveClass] = useState(null);
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(true);
  const [savingLink, setSavingLink] = useState(false);
  const [starting, setStarting] = useState(false);
  const [ending, setEnding] = useState(false);
  const [meetingUrl, setMeetingUrl] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [endDialogOpen, setEndDialogOpen] = useState(false);

  // =========================
  // THEME TOKENS (same as Login page)
  // =========================
  const c = {
    pageBg: isDark ? "#121212" : "#f5f6f8",
    cardBg: isDark ? "#1b1b1b" : "#ffffff",
    softBg: isDark ? "#252525" : "#fafbfc",
    border: isDark ? "#383838" : "#e5e7eb",
    title: isDark ? "#ffffff" : "#172033",
    text: isDark ? "#e0e0e0" : "#374151",
    muted: isDark ? "#bdbdbd" : "#6b7280",
    primary: "#1976d2",
    primarySoft: isDark ? "rgba(25,118,210,0.2)" : "#e3f2fd",
    heroGradient:
      "linear-gradient(145deg, #1976d2 0%, #1565c0 45%, #0d47a1 100%)",
  };

  const primaryBtnSx = {
    minHeight: 44,
    borderRadius: 2.2,
    textTransform: "none",
    fontSize: "0.92rem",
    fontWeight: 700,
    whiteSpace: "nowrap",
    color: "#fff",
    background: "linear-gradient(135deg, #1976d2 0%, #1565c0 100%)",
    boxShadow: "0 8px 22px rgba(25,118,210,0.25)",
    transition: "all 0.2s ease",
    "&:hover": {
      background: "linear-gradient(135deg, #1565c0 0%, #0d47a1 100%)",
      boxShadow: "0 11px 28px rgba(25,118,210,0.30)",
      transform: "translateY(-1px)",
    },
    "&:active": { transform: "translateY(0)" },
    "&.Mui-disabled": {
      background: "linear-gradient(135deg, #1976d2 0%, #1565c0 100%)",
      opacity: 0.7,
      color: "#fff",
    },
  };

  const fieldSx = {
    "& .MuiOutlinedInput-root": {
      minHeight: 44,
      borderRadius: 2.2,
      backgroundColor: isDark ? "#252525" : "#fafbfc",
      transition: "all 0.2s ease",
      "& input": {
        color: isDark ? "#ffffff" : "#1f2937",
        WebkitTextFillColor: isDark ? "#ffffff" : "#1f2937",
        caretColor: "#1976d2",
      },
      "& input::placeholder": {
        color: isDark ? "#a9a9a9" : "#6b7280",
        opacity: 1,
      },
      "& fieldset": { borderColor: isDark ? "#555555" : "#d1d5db" },
      "&:hover fieldset": { borderColor: "#1976d2" },
      "&.Mui-focused": {
        backgroundColor: isDark ? "#292929" : "#ffffff",
        boxShadow: isDark
          ? "0 0 0 4px rgba(25,118,210,0.25)"
          : "0 0 0 4px rgba(25,118,210,0.12)",
      },
      "&.Mui-focused fieldset": { borderColor: "#1976d2", borderWidth: 1.5 },
    },
    "& .MuiInputLabel-root": { color: isDark ? "#a9a9a9" : "#6b7280" },
    "& .MuiInputLabel-root.Mui-focused": { color: "#1976d2" },
  };

  const cardSx = {
    border: `1px solid ${c.border}`,
    borderRadius: 3,
    backgroundColor: c.cardBg,
    backgroundImage: "none",
  };

  const loadClass = useCallback(async () => {
    if (!Number.isInteger(liveClassId) || liveClassId <= 0) {
      setError("This live class link is invalid.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");
      const [profileResponse, classResponse] = await Promise.all([
        api.get("/auth/profile"),
        getLiveClass(liveClassId),
      ]);
      const profile = unwrap(profileResponse);
      const classData = unwrap(classResponse);
      setRole(String(profile?.role || profile?.userRole || "").toLowerCase());
      setLiveClass(classData);
      setMeetingUrl(classData?.zoomMeetingUrl || "");
    } catch (loadError) {
      setError(
        loadError?.response?.data?.message ||
          loadError?.message ||
          "Unable to load this live class.",
      );
    } finally {
      setLoading(false);
    }
  }, [liveClassId]);

  useEffect(() => {
    loadClass();
  }, [loadClass]);

  const isTeacher = role === "teacher";
  const isLive = Boolean(liveClass?.isLive);
  const isCompleted = Boolean(liveClass?.isCompleted);
  const hasZoomLink = isZoomMeetingUrl(liveClass?.zoomMeetingUrl);

  const joinZoom = () => {
    if (!hasZoomLink || !isLive) return;
    window.open(liveClass.zoomMeetingUrl, "_blank", "noopener,noreferrer");
  };

  const startAndJoin = async () => {
    if (!hasZoomLink || starting) return;
    const zoomWindow = window.open("about:blank", "_blank");
    if (zoomWindow) zoomWindow.opener = null;

    try {
      setStarting(true);
      setError("");
      const response = await startLiveClass(liveClassId);
      const updated = unwrap(response);
      setLiveClass((current) => ({
        ...current,
        ...updated,
        isLive: true,
        startedAt: updated?.startedAt || new Date().toISOString(),
      }));
      if (zoomWindow) {
        zoomWindow.location.replace(liveClass.zoomMeetingUrl);
      } else {
        window.open(liveClass.zoomMeetingUrl, "_blank", "noopener,noreferrer");
      }
    } catch (startError) {
      zoomWindow?.close();
      setError(
        startError?.response?.data?.message ||
          startError?.message ||
          "Unable to start this class.",
      );
    } finally {
      setStarting(false);
    }
  };

  const saveZoomLink = async (event) => {
    event.preventDefault();
    if (!isZoomMeetingUrl(meetingUrl)) {
      setError("Enter a valid HTTPS Zoom meeting link.");
      return;
    }

    try {
      setSavingLink(true);
      setError("");
      const response = await setZoomMeetingUrl(liveClassId, meetingUrl.trim());
      const updated = unwrap(response);
      setLiveClass((current) => ({
        ...current,
        ...updated,
        zoomMeetingUrl: meetingUrl.trim(),
      }));
      setMeetingUrl(meetingUrl.trim());
      setNotice("Zoom meeting link saved.");
    } catch (saveError) {
      setError(
        saveError?.response?.data?.message ||
          saveError?.message ||
          "Unable to save the Zoom meeting link.",
      );
    } finally {
      setSavingLink(false);
    }
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(liveClass.zoomMeetingUrl);
      setNotice("Zoom meeting link copied.");
    } catch {
      setError("Clipboard access is unavailable in this browser.");
    }
  };

  const finishClass = async () => {
    try {
      setEnding(true);
      setError("");
      const response = await endLiveClass(liveClassId);
      setLiveClass((current) => ({
        ...current,
        ...unwrap(response),
        isLive: false,
        isCompleted: true,
      }));
      setEndDialogOpen(false);
      setNotice("Class ended. Remember to end the Zoom meeting as well.");
    } catch (endError) {
      setError(
        endError?.response?.data?.message ||
          endError?.message ||
          "Unable to end this class.",
      );
    } finally {
      setEnding(false);
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "70vh",
          display: "grid",
          placeItems: "center",
          bgcolor: c.pageBg,
        }}
      >
        <Stack spacing={2} alignItems="center">
          <CircularProgress sx={{ color: c.primary }} />
          <Typography sx={{ color: c.muted }}>Loading class details...</Typography>
        </Stack>
      </Box>
    );
  }

  if (!liveClass) {
    return (
      <Box sx={{ minHeight: "70vh", bgcolor: c.pageBg, px: 2, py: 8 }}>
        <Box sx={{ maxWidth: 720, mx: "auto" }}>
          <Alert severity="error" sx={{ mb: 2, borderRadius: 2.2 }}>
            {error}
          </Alert>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(-1)}
            sx={{ textTransform: "none", color: c.primary, fontWeight: 600 }}
          >
            Back
          </Button>
        </Box>
      </Box>
    );
  }

  const status = isCompleted
    ? {
        label: "Completed",
        color: isDark ? "#b0b8b5" : "#6b7280",
        background: isDark ? "rgba(255,255,255,0.08)" : "#eef0f2",
      }
    : isLive
      ? {
          label: "Live now",
          color: isDark ? "#ff8a80" : "#b3261e",
          background: isDark ? "rgba(244,67,54,0.18)" : "#fce8e6",
        }
      : {
          label: "Scheduled",
          color: isDark ? "#90caf9" : "#1565c0",
          background: isDark ? "rgba(25,118,210,0.22)" : "#e3f2fd",
        };

  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 64px)",
        bgcolor: c.pageBg,
        py: { xs: 2.5, md: 4 },
      }}
    >
      <Fade in timeout={500}>
        <Box sx={{ width: "min(1180px, calc(100% - 32px))", mx: "auto" }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate("/live-classes")}
            sx={{
              mb: 2,
              color: c.muted,
              textTransform: "none",
              fontWeight: 600,
              "&:hover": { color: c.primary, bgcolor: "transparent" },
            }}
          >
            All live classes
          </Button>

          {error && (
            <Alert
              severity="error"
              sx={{ mb: 2, borderRadius: 2.2 }}
              onClose={() => setError("")}
            >
              {error}
            </Alert>
          )}
          {notice && (
            <Alert
              severity="success"
              sx={{ mb: 2, borderRadius: 2.2 }}
              onClose={() => setNotice("")}
            >
              {notice}
            </Alert>
          )}

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "minmax(0, 1fr) 310px" },
              gap: 2.5,
              alignItems: "start",
            }}
          >
            <Stack spacing={2.5}>
              <Paper elevation={0} sx={{ ...cardSx, overflow: "hidden" }}>
                {/* HERO */}
                <Box
                  sx={{
                    position: "relative",
                    overflow: "hidden",
                    p: { xs: 2.5, md: 4 },
                    background: c.heroGradient,
                    color: "#fff",
                  }}
                >
                  {/* Decorative circles (same as login) */}
                  <Box
                    sx={{
                      position: "absolute",
                      width: { xs: 160, md: 240 },
                      height: { xs: 160, md: 240 },
                      borderRadius: "50%",
                      background: "rgba(255,255,255,0.07)",
                      top: { xs: -70, md: -100 },
                      right: { xs: -60, md: -80 },
                    }}
                  />
                  <Box
                    sx={{
                      position: "absolute",
                      width: { xs: 120, md: 180 },
                      height: { xs: 120, md: 180 },
                      borderRadius: "50%",
                      background: "rgba(255,255,255,0.06)",
                      bottom: -70,
                      left: -60,
                    }}
                  />

                  <Box sx={{ position: "relative", zIndex: 2 }}>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                      gap={2}
                      sx={{ mb: 3 }}
                    >
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <VideoCallIcon sx={{ color: "#ffffff" }} />
                        <Typography
                          variant="overline"
                          sx={{
                            color: "rgba(255,255,255,0.85)",
                            lineHeight: 1,
                            fontWeight: 700,
                          }}
                        >
                          ZOOM CLASSROOM
                        </Typography>
                      </Stack>
                      <Box
                        sx={{
                          px: 1.4,
                          py: 0.55,
                          borderRadius: 5,
                          bgcolor: status.background,
                          color: status.color,
                          fontSize: 12,
                          fontWeight: 700,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {status.label}
                      </Box>
                    </Stack>

                    <Typography
                      variant="h4"
                      component="h1"
                      sx={{
                        fontSize: { xs: 24, md: 32 },
                        lineHeight: 1.2,
                        fontWeight: 800,
                        maxWidth: 760,
                        overflowWrap: "anywhere",
                      }}
                    >
                      {liveClass.title}
                    </Typography>
                    <Typography
                      sx={{ mt: 1, color: "rgba(255,255,255,0.82)", fontSize: 14 }}
                    >
                      {liveClass.courseName ||
                        `Course ${liveClass.courseId ? `#${liveClass.courseId}` : ""}`}
                    </Typography>

                    <Box
                      sx={{
                        mt: { xs: 3, md: 4 },
                        p: { xs: 2, md: 2.5 },
                        bgcolor: "rgba(255,255,255,0.12)",
                        border: "1px solid rgba(255,255,255,0.15)",
                        borderRadius: 2.5,
                        backdropFilter: "blur(4px)",
                      }}
                    >
                      <Stack
                        direction={{ xs: "column", sm: "row" }}
                        spacing={2}
                        alignItems={{ sm: "center" }}
                        justifyContent="space-between"
                      >
                        <Stack direction="row" spacing={1.5} alignItems="center">
                          <Avatar sx={{ width: 46, height: 46, bgcolor: "#2d8cff" }}>
                            <VideoCallIcon />
                          </Avatar>
                          <Box>
                            <Typography sx={{ fontWeight: 700 }}>
                              Meet in Zoom
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{ color: "rgba(255,255,255,0.82)" }}
                            >
                              {isCompleted
                                ? "This class has ended."
                                : !hasZoomLink
                                  ? isTeacher
                                    ? "Add the meeting link to open your classroom."
                                    : "The instructor has not added a meeting link yet."
                                  : isLive
                                    ? "Your class is ready to join."
                                    : isTeacher
                                      ? "Start the class, then open your Zoom meeting."
                                      : "The instructor will open this room when class begins."}
                            </Typography>
                          </Box>
                        </Stack>

                        {isTeacher && !isCompleted && hasZoomLink && !isLive && (
                          <Button
                            variant="contained"
                            onClick={startAndJoin}
                            disabled={starting}
                            startIcon={
                              starting ? (
                                <CircularProgress size={18} color="inherit" />
                              ) : (
                                <OpenInNewIcon />
                              )
                            }
                            sx={{
                              ...primaryBtnSx,
                              background: "#ffffff",
                              color: "#1565c0",
                              boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
                              "&:hover": {
                                background: "#f0f6ff",
                                transform: "translateY(-1px)",
                              },
                              "&.Mui-disabled": {
                                background: "#ffffff",
                                color: "#1565c0",
                                opacity: 0.7,
                              },
                            }}
                          >
                            {starting ? "Starting..." : "Start class"}
                          </Button>
                        )}
                        {isLive && hasZoomLink && (
                          <Button
                            variant="contained"
                            onClick={joinZoom}
                            startIcon={<OpenInNewIcon />}
                            sx={{
                              ...primaryBtnSx,
                              background: "#ffffff",
                              color: "#1565c0",
                              boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
                              "&:hover": {
                                background: "#f0f6ff",
                                transform: "translateY(-1px)",
                              },
                            }}
                          >
                            {isTeacher ? "Open Zoom" : "Join Zoom"}
                          </Button>
                        )}
                      </Stack>
                    </Box>
                  </Box>
                </Box>

                {/* ABOUT */}
                <Box sx={{ p: { xs: 2.5, md: 3 }, bgcolor: c.cardBg }}>
                  <Stack
                    direction="row"
                    spacing={1.5}
                    alignItems="center"
                    sx={{ mb: 1.25 }}
                  >
                    <Avatar
                      sx={{
                        width: 34,
                        height: 34,
                        bgcolor: c.primarySoft,
                        color: c.primary,
                      }}
                    >
                      <SchoolIcon fontSize="small" />
                    </Avatar>
                    <Typography
                      variant="subtitle1"
                      sx={{ fontWeight: 800, color: c.title }}
                    >
                      About this class
                    </Typography>
                  </Stack>
                  <Typography
                    variant="body2"
                    sx={{
                      color: c.muted,
                      whiteSpace: "pre-wrap",
                      lineHeight: 1.7,
                    }}
                  >
                    {liveClass.description || "No class description has been added."}
                  </Typography>
                </Box>
              </Paper>

              {/* ZOOM LINK FORM */}
              {isTeacher &&
                !isCompleted &&
                (!hasZoomLink || meetingUrl !== liveClass.zoomMeetingUrl) && (
                  <Paper
                    component="form"
                    onSubmit={saveZoomLink}
                    elevation={0}
                    sx={{ ...cardSx, p: { xs: 2.5, md: 3 } }}
                  >
                    <Typography
                      variant="subtitle1"
                      sx={{ fontWeight: 800, mb: 0.5, color: c.title }}
                    >
                      Zoom meeting link
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 2, color: c.muted }}>
                      Paste the join link from your Zoom meeting invitation.
                    </Typography>
                    <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
                      <TextField
                        fullWidth
                        size="small"
                        label="Zoom join URL"
                        type="url"
                        value={meetingUrl}
                        onChange={(event) => setMeetingUrl(event.target.value)}
                        placeholder="https://zoom.us/j/..."
                        disabled={savingLink}
                        sx={fieldSx}
                      />
                      <Button
                        type="submit"
                        variant="contained"
                        disabled={savingLink || !meetingUrl.trim()}
                        sx={{ ...primaryBtnSx, minWidth: 130 }}
                      >
                        {savingLink ? (
                          <CircularProgress size={20} color="inherit" />
                        ) : (
                          "Save link"
                        )}
                      </Button>
                    </Stack>
                  </Paper>
                )}
            </Stack>

            {/* SIDE: CLASS DETAILS */}
            <Paper elevation={0} sx={{ ...cardSx, p: 2.5 }}>
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: 800, mb: 2, color: c.title }}
              >
                Class details
              </Typography>

              <Stack direction="row" spacing={1.5} alignItems="flex-start">
                <CalendarMonthIcon sx={{ color: c.primary, mt: 0.2 }} />
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: c.text }}>
                    Scheduled for
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 0.35, color: c.muted }}>
                    {formatDate(liveClass.scheduledAt)}
                  </Typography>
                </Box>
              </Stack>

              {liveClass.startedAt && (
                <Stack
                  direction="row"
                  spacing={1.5}
                  alignItems="flex-start"
                  sx={{ mt: 2 }}
                >
                  <EventAvailableIcon sx={{ color: c.primary, mt: 0.2 }} />
                  <Box>
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 600, color: c.text }}
                    >
                      Started
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 0.35, color: c.muted }}>
                      {formatDate(liveClass.startedAt)}
                    </Typography>
                  </Box>
                </Stack>
              )}

              <Divider sx={{ my: 2, borderColor: c.border }} />

              <Typography
                variant="body2"
                sx={{ fontWeight: 600, mb: 1, color: c.text }}
              >
                Meeting platform
              </Typography>
              <Stack direction="row" spacing={1} alignItems="center">
                <Avatar sx={{ width: 28, height: 28, bgcolor: "#2d8cff" }}>
                  <VideoCallIcon sx={{ fontSize: 18 }} />
                </Avatar>
                <Typography variant="body2" sx={{ color: c.text }}>
                  Zoom
                </Typography>
              </Stack>

              {hasZoomLink && isTeacher && (
                <Box
                  sx={{
                    mt: 2,
                    p: 1.5,
                    bgcolor: c.softBg,
                    border: `1px solid ${c.border}`,
                    borderRadius: 2.2,
                  }}
                >
                  <Typography variant="caption" sx={{ color: c.muted }}>
                    Zoom link to share with students
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ mt: 0.5, overflowWrap: "anywhere", color: c.text }}
                  >
                    {liveClass.zoomMeetingUrl}
                  </Typography>
                  <Button
                    size="small"
                    startIcon={<ContentCopyIcon />}
                    onClick={copyLink}
                    sx={{
                      mt: 1,
                      textTransform: "none",
                      fontWeight: 600,
                      color: c.primary,
                    }}
                  >
                    Copy Zoom link
                  </Button>
                </Box>
              )}

              {isTeacher && isLive && (
                <>
                  <Divider sx={{ my: 2, borderColor: c.border }} />
                  <Button
                    fullWidth
                    color="error"
                    variant="outlined"
                    onClick={() => setEndDialogOpen(true)}
                    startIcon={<EventAvailableIcon />}
                    sx={{
                      minHeight: 44,
                      borderRadius: 2.2,
                      textTransform: "none",
                      fontWeight: 700,
                    }}
                  >
                    End class
                  </Button>
                </>
              )}

              {isCompleted && (
                <Alert severity="info" sx={{ mt: 2, borderRadius: 2.2 }}>
                  This class is complete. The Zoom meeting may still need to be
                  ended separately.
                </Alert>
              )}
            </Paper>
          </Box>
        </Box>
      </Fade>

      {/* END CLASS DIALOG */}
      <Dialog
        open={endDialogOpen}
        onClose={() => !ending && setEndDialogOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            backgroundColor: c.cardBg,
            backgroundImage: "none",
            border: `1px solid ${c.border}`,
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 800, color: c.title }}>
          End this class?
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ color: c.muted }}>
            This updates the class status in LearnHub. You will also need to end
            the Zoom meeting separately.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button
            onClick={() => setEndDialogOpen(false)}
            disabled={ending}
            sx={{ textTransform: "none", fontWeight: 600, color: c.muted }}
          >
            Keep class open
          </Button>
          <Button
            color="error"
            variant="contained"
            onClick={finishClass}
            disabled={ending}
            sx={{
              textTransform: "none",
              fontWeight: 700,
              borderRadius: 2.2,
              minWidth: 110,
            }}
          >
            {ending ? <CircularProgress size={20} color="inherit" /> : "End class"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ZoomLiveClassRoom;