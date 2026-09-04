import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  getMyLiveClasses,
  getStudentLiveClasses,
  startLiveClass,
} from "../../services/liveClassService";

import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Stack,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";

import VideocamIcon from "@mui/icons-material/Videocam";
import AddIcon from "@mui/icons-material/Add";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import EventIcon from "@mui/icons-material/Event";

// ============================================================
// STATUS CONFIG
// ============================================================

const STATUS_CONFIG = {
  live: { label: "Live now", color: "error" },
  upcoming: { label: "Upcoming", color: "success" },
  completed: { label: "Completed", color: "default" },
};

const getClassStatus = (liveClass) => {
  if (liveClass?.isLive) return "live";
  if (liveClass?.isCompleted) return "completed";
  return "upcoming";
};

// ============================================================
// GET CURRENT USER ROLE
// ============================================================
// Same pattern used in Navbar.jsx: user object is cached in
// localStorage after login / profile fetch.

const getCurrentUserRole = () => {
  try {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      return null;
    }

    const user = JSON.parse(storedUser);

    return String(user?.role || "").toLowerCase();
  } catch (error) {
    console.log("Invalid stored user:", error);
    return null;
  }
};

// ============================================================
// CLASS CARD
// ============================================================

const LiveClassCard = ({ liveClass, role, onJoin, onStart }) => {
  const status = getClassStatus(liveClass);
  const config = STATUS_CONFIG[status];

  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 3,
        border: "1px solid",
        borderColor: "divider",
        height: "100%",
      }}
    >
      <CardContent>
        <Stack direction="row" sx={{ justifyContent: "space-between", mb: 1.5 }}>
          <Avatar sx={{ bgcolor: "action.hover", color: "primary.main", width: 36, height: 36 }}>
            <VideocamIcon fontSize="small" />
          </Avatar>

          <Chip size="small" label={config.label} color={config.color} variant={status === "completed" ? "outlined" : "filled"} />
        </Stack>

        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
          {liveClass.title}
        </Typography>

        <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.5, mb: 1.5 }}>
          {status === "live" && liveClass.startedAt
            ? `Started ${new Date(liveClass.startedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
            : liveClass.scheduledAt
              ? new Date(liveClass.scheduledAt).toLocaleString([], {
                  weekday: "short",
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : liveClass.description || ""}
        </Typography>

        <Stack
          direction="row"
          spacing={0.5}
          sx={{ alignItems: "center", color: "text.secondary", pt: 1, borderTop: "1px solid", borderColor: "divider", mb: 1.5 }}
        >
          <MenuBookIcon sx={{ fontSize: 16 }} />
          <Typography variant="caption">{liveClass.courseName || `Course #${liveClass.courseId}`}</Typography>
        </Stack>

        {status === "live" && (
          <Button fullWidth variant="contained" startIcon={<PlayCircleIcon />} onClick={() => onJoin(liveClass)}>
            Join
          </Button>
        )}

        {status === "upcoming" && role === "teacher" && (
          <Button fullWidth variant="contained" startIcon={<PlayCircleIcon />} onClick={() => onStart(liveClass)}>
            Start class
          </Button>
        )}

        {status === "upcoming" && role !== "teacher" && (
          <Button fullWidth variant="outlined" startIcon={<EventIcon />} disabled>
            Not started yet
          </Button>
        )}

      </CardContent>
    </Card>
  );
};

// ============================================================
// MAIN PAGE
// ============================================================

const LiveClasses = () => {
  const navigate = useNavigate();

  const role = getCurrentUserRole();
  const isTeacher = role === "teacher";

  const [liveClasses, setLiveClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tab, setTab] = useState("all");

  // ==========================================================
  // FETCH
  // ==========================================================

  const loadLiveClasses = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = isTeacher
        ? await getMyLiveClasses()
        : await getStudentLiveClasses();

      const result = response?.data;
      const list = result?.data || result?.liveClasses || result || [];

      setLiveClasses(Array.isArray(list) ? list : []);
    } catch (err) {
      console.error("Load live classes error:", err);
      setError(err?.message || "Unable to load live classes.");
    } finally {
      setLoading(false);
    }
  }, [isTeacher]);

  useEffect(() => {
    loadLiveClasses();
  }, [loadLiveClasses]);

  // ==========================================================
  // FILTER
  // ==========================================================

  const counts = {
    all: liveClasses.length,
    live: liveClasses.filter((c) => getClassStatus(c) === "live").length,
    upcoming: liveClasses.filter((c) => getClassStatus(c) === "upcoming").length,
    completed: liveClasses.filter((c) => getClassStatus(c) === "completed").length,
  };

  const filteredClasses =
    tab === "all" ? liveClasses : liveClasses.filter((c) => getClassStatus(c) === tab);

  // ==========================================================
  // ACTIONS
  // ==========================================================

  const handleJoin = (liveClass) => {
    navigate(`/live-classes/${liveClass.id}`);
  };

  const handleStart = async (liveClass) => {
    try {
      await startLiveClass(liveClass.id);
      navigate(`/live-classes/${liveClass.id}`);
    } catch (err) {
      console.error("Start live class error:", err);
      setError(err?.message || "Unable to start live class.");
    }
  };

  // ==========================================================
  // UI
  // ==========================================================

  return (
    <Box sx={{ maxWidth: 1400, mx: "auto", px: { xs: 2, md: 4 }, py: 3 }}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        sx={{ justifyContent: "space-between", alignItems: { sm: "center" }, mb: 2 }}
      >
        <Box>
          <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
            <VideocamIcon color="primary" />
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              Live classes
            </Typography>
            <Chip size="small" label={counts.all} variant="outlined" color="primary" />
          </Stack>

          <Typography variant="body2" sx={{ color: "text.secondary", ml: 4 }}>
            {isTeacher
              ? "Schedule, start and manage your online classes."
              : "Join live classes from your enrolled courses."}
          </Typography>
        </Box>

        {isTeacher && (
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate("/live-class/create")}>
            Schedule live class
          </Button>
        )}
      </Stack>

   <Tabs
  value={tab}
  onChange={(_, value) => setTab(value)}
  variant="scrollable"
  scrollButtons="auto"
  allowScrollButtonsMobile
  sx={{
    mb: 3,
    minHeight: 0,
    "& .MuiTabs-flexContainer": { gap: 1 },
    "& .MuiTabs-indicator": {
      display: "none",
    },
  }}
>
  <Tab
    value="all"
    label={`All (${counts.all})`}
    sx={{
      minHeight: 0,
      borderRadius: 2,
      whiteSpace: "nowrap",
      "&.Mui-selected": {
        bgcolor: "primary.main",
        color: "#fff",
      },
    }}
  />

  <Tab
    value="live"
    label={`Live now (${counts.live})`}
    sx={{
      minHeight: 0,
      borderRadius: 2,
      whiteSpace: "nowrap",
      border: "1px solid",
      borderColor: "divider",
    }}
  />

  <Tab
    value="upcoming"
    label={`Upcoming (${counts.upcoming})`}
    sx={{
      minHeight: 0,
      borderRadius: 2,
      whiteSpace: "nowrap",
      border: "1px solid",
      borderColor: "divider",
    }}
  />

  <Tab
    value="completed"
    label={`Completed (${counts.completed})`}
    sx={{
      minHeight: 0,
      borderRadius: 2,
      whiteSpace: "nowrap",
      border: "1px solid",
      borderColor: "divider",
    }}
  />
</Tabs>

      {loading && (
        <Stack sx={{ alignItems: "center", py: 6 }}>
          <CircularProgress />
        </Stack>
      )}

      {!loading && error && (
        <Typography color="error" sx={{ textAlign: "center", py: 4 }}>
          {error}
        </Typography>
      )}

      {!loading && !error && filteredClasses.length === 0 && (
        <Typography sx={{ color: "text.secondary", textAlign: "center", py: 6 }}>
          No live classes in this category.
        </Typography>
      )}

      {!loading && !error && filteredClasses.length > 0 && (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "1fr 1fr 1fr" },
            gap: 2,
          }}
        >
          {filteredClasses.map((liveClass) => (
            <LiveClassCard
              key={liveClass.id}
              liveClass={liveClass}
              role={role}
              onJoin={handleJoin}
              onStart={handleStart}
            />
          ))}
        </Box>
      )}
    </Box>
  );
};

export default LiveClasses;
