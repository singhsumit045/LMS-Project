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
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
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
      setLiveClass((current) => ({ ...current, ...updated, zoomMeetingUrl: meetingUrl.trim() }));
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
      <Box sx={{ minHeight: "70vh", display: "grid", placeItems: "center" }}>
        <Stack spacing={2} alignItems="center">
          <CircularProgress />
          <Typography color="text.secondary">Loading class details...</Typography>
        </Stack>
      </Box>
    );
  }

  if (!liveClass) {
    return (
      <Box sx={{ maxWidth: 720, mx: "auto", px: 2, py: 8 }}>
        <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)}>Back</Button>
      </Box>
    );
  }

  const status = isCompleted
    ? { label: "Completed", color: "#73817d", background: "#e8edeb" }
    : isLive
      ? { label: "Live now", color: "#b3261e", background: "#fce8e6" }
      : { label: "Scheduled", color: "#176b55", background: "#e4f3ed" };

  return (
    <Box sx={{ minHeight: "calc(100vh - 64px)", bgcolor: "#f4f7f5", py: { xs: 2.5, md: 4 } }}>
      <Box sx={{ width: "min(1180px, calc(100% - 32px))", mx: "auto" }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/live-classes")}
          sx={{ mb: 2, color: "text.secondary", textTransform: "none" }}
        >
          All live classes
        </Button>

        {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>{error}</Alert>}
        {notice && <Alert severity="success" sx={{ mb: 2 }} onClose={() => setNotice("")}>{notice}</Alert>}

        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "minmax(0, 1fr) 310px" }, gap: 2.5, alignItems: "start" }}>
          <Stack spacing={2.5}>
            <Paper elevation={0} sx={{ overflow: "hidden", border: "1px solid #dce5e0", borderRadius: 2 }}>
              <Box sx={{ p: { xs: 2.5, md: 4 }, bgcolor: "#142b25", color: "#fff" }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" gap={2} sx={{ mb: 3 }}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <VideoCallIcon sx={{ color: "#9ed8c2" }} />
                    <Typography variant="overline" sx={{ color: "#c4d8cf", lineHeight: 1 }}>ZOOM CLASSROOM</Typography>
                  </Stack>
                  <Box sx={{ px: 1.2, py: 0.55, borderRadius: 1, bgcolor: status.background, color: status.color, fontSize: 12, fontWeight: 700, whiteSpace: "nowrap" }}>
                    {status.label}
                  </Box>
                </Stack>

                <Typography variant="h4" component="h1" sx={{ fontSize: { xs: 26, md: 34 }, lineHeight: 1.15, fontWeight: 700, maxWidth: 760, overflowWrap: "anywhere" }}>
                  {liveClass.title}
                </Typography>
                <Typography sx={{ mt: 1, color: "#c4d8cf", fontSize: 14 }}>
                  {liveClass.courseName || `Course ${liveClass.courseId ? `#${liveClass.courseId}` : ""}`}
                </Typography>

                <Box sx={{ mt: { xs: 3, md: 4 }, p: { xs: 2, md: 2.5 }, bgcolor: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 1.5 }}>
                  <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems={{ sm: "center" }} justifyContent="space-between">
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <Avatar sx={{ width: 46, height: 46, bgcolor: "#2d8cff" }}><VideoCallIcon /></Avatar>
                      <Box>
                        <Typography sx={{ fontWeight: 700 }}>Meet in Zoom</Typography>
                        <Typography variant="body2" sx={{ color: "#c4d8cf" }}>
                          {isCompleted
                            ? "This class has ended."
                            : !hasZoomLink
                              ? isTeacher ? "Add the meeting link to open your classroom." : "The instructor has not added a meeting link yet."
                              : isLive ? "Your class is ready to join." : isTeacher ? "Start the class, then open your Zoom meeting." : "The instructor will open this room when class begins."}
                        </Typography>
                      </Box>
                    </Stack>

                    {isTeacher && !isCompleted && hasZoomLink && !isLive && (
                      <Button variant="contained" onClick={startAndJoin} disabled={starting} startIcon={starting ? <CircularProgress size={18} color="inherit" /> : <OpenInNewIcon />} sx={{ bgcolor: "#2d8cff", whiteSpace: "nowrap", minHeight: 44, "&:hover": { bgcolor: "#1877e8" } }}>
                        {starting ? "Starting..." : "Start class"}
                      </Button>
                    )}
                    {!isTeacher && isLive && hasZoomLink && (
                      <Button variant="contained" onClick={joinZoom} startIcon={<OpenInNewIcon />} sx={{ bgcolor: "#2d8cff", whiteSpace: "nowrap", minHeight: 44, "&:hover": { bgcolor: "#1877e8" } }}>
                        Join Zoom
                      </Button>
                    )}
                    {isTeacher && isLive && hasZoomLink && (
                      <Button variant="contained" onClick={joinZoom} startIcon={<OpenInNewIcon />} sx={{ bgcolor: "#2d8cff", whiteSpace: "nowrap", minHeight: 44, "&:hover": { bgcolor: "#1877e8" } }}>
                        Open Zoom
                      </Button>
                    )}
                  </Stack>
                </Box>
              </Box>

              <Box sx={{ p: { xs: 2.5, md: 3 }, bgcolor: "#fff" }}>
                <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1.25 }}>
                  <Avatar sx={{ width: 34, height: 34, bgcolor: "#e4f3ed", color: "#176b55" }}><SchoolIcon fontSize="small" /></Avatar>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>About this class</Typography>
                </Stack>
                <Typography variant="body2" sx={{ color: "text.secondary", whiteSpace: "pre-wrap", lineHeight: 1.7 }}>
                  {liveClass.description || "No class description has been added."}
                </Typography>
              </Box>
            </Paper>

            {isTeacher && !isCompleted && (!hasZoomLink || meetingUrl !== liveClass.zoomMeetingUrl) && (
              <Paper component="form" onSubmit={saveZoomLink} elevation={0} sx={{ p: { xs: 2.5, md: 3 }, border: "1px solid #dce5e0", borderRadius: 2 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 0.5 }}>Zoom meeting link</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>Paste the join link from your Zoom meeting invitation.</Typography>
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
                  />
                  <Button type="submit" variant="contained" disabled={savingLink || !meetingUrl.trim()} sx={{ minWidth: 130, minHeight: 40, bgcolor: "#176b55", "&:hover": { bgcolor: "#115442" } }}>
                    {savingLink ? <CircularProgress size={20} color="inherit" /> : "Save link"}
                  </Button>
                </Stack>
              </Paper>
            )}
          </Stack>

          <Paper elevation={0} sx={{ p: 2.5, border: "1px solid #dce5e0", borderRadius: 2 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>Class details</Typography>
            <Stack direction="row" spacing={1.5} alignItems="flex-start">
              <CalendarMonthIcon sx={{ color: "#176b55", mt: 0.2 }} />
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>Scheduled for</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.35 }}>{formatDate(liveClass.scheduledAt)}</Typography>
              </Box>
            </Stack>
            {liveClass.startedAt && (
              <Stack direction="row" spacing={1.5} alignItems="flex-start" sx={{ mt: 2 }}>
                <EventAvailableIcon sx={{ color: "#176b55", mt: 0.2 }} />
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>Started</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.35 }}>{formatDate(liveClass.startedAt)}</Typography>
                </Box>
              </Stack>
            )}
            <Divider sx={{ my: 2 }} />
            <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>Meeting platform</Typography>
            <Stack direction="row" spacing={1} alignItems="center">
              <Avatar sx={{ width: 28, height: 28, bgcolor: "#2d8cff" }}><VideoCallIcon sx={{ fontSize: 18 }} /></Avatar>
              <Typography variant="body2">Zoom</Typography>
            </Stack>
            {hasZoomLink && isTeacher && (
              <Box sx={{ mt: 2, p: 1.5, bgcolor: "#f4f7f5", borderRadius: 1.5 }}>
                <Typography variant="caption" color="text.secondary">Zoom link to share with students</Typography>
                <Typography variant="body2" sx={{ mt: 0.5, overflowWrap: "anywhere", color: "text.primary" }}>
                  {liveClass.zoomMeetingUrl}
                </Typography>
                <Button size="small" startIcon={<ContentCopyIcon />} onClick={copyLink} sx={{ mt: 1, textTransform: "none" }}>
                  Copy Zoom link
                </Button>
              </Box>
            )}
            {isTeacher && isLive && (
              <>
                <Divider sx={{ my: 2 }} />
                <Button fullWidth color="error" variant="outlined" onClick={() => setEndDialogOpen(true)} startIcon={<EventAvailableIcon />}>
                  End class
                </Button>
              </>
            )}
            {isCompleted && (
              <Alert severity="info" sx={{ mt: 2 }}>This class is complete. The Zoom meeting may still need to be ended separately.</Alert>
            )}
          </Paper>
        </Box>
      </Box>

      <Dialog open={endDialogOpen} onClose={() => !ending && setEndDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>End this class?</DialogTitle>
        <DialogContent>
          <Typography color="text.secondary">This updates the class status in LearnHub. You will also need to end the Zoom meeting separately.</Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={() => setEndDialogOpen(false)} disabled={ending}>Keep class open</Button>
          <Button color="error" variant="contained" onClick={finishClass} disabled={ending}>
            {ending ? <CircularProgress size={20} color="inherit" /> : "End class"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ZoomLiveClassRoom;