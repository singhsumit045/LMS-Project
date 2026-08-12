import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { io } from "socket.io-client";
import api from "../../services/api";

import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  IconButton,
  Paper,
  Snackbar,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import VideocamIcon from "@mui/icons-material/Videocam";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";
import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";
import CallEndIcon from "@mui/icons-material/CallEnd";
import PeopleIcon from "@mui/icons-material/People";
import SchoolIcon from "@mui/icons-material/School";
import PersonIcon from "@mui/icons-material/Person";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";


// ============================================================
// CONFIG
// ============================================================

const SOCKET_URL =
  import.meta.env.VITE_SOCKET_URL ||
  "http://localhost:3000";


// ============================================================
// HELPERS
// ============================================================

const getToken = () => {
  return localStorage.getItem("access_token");
};
// ============================================================
// VIDEO COMPONENT
// ============================================================

const VideoTile = ({
  stream,
  muted = false,
  name = "Participant",
  role = "",
  isLocal = false,
  cameraOn = true,
}) => {
  const videoRef = useRef(null);
useEffect(() => {
  const video = videoRef.current;

  if (!video) {
    return;
  }

  if (!stream) {
    video.srcObject = null;
    return;
  }

  video.srcObject = stream;

  const playVideo = async () => {
    try {
      await video.play();
    } catch (error) {
      if (error?.name !== "AbortError") {
        console.warn("Video play error:", error);
      }
    }
  };

  playVideo();

  return () => {
    if (video) {
      video.pause();
      video.srcObject = null;
    }
  };
}, [stream]);

  return (
    <Paper
      elevation={0}
      sx={{
        position: "relative",
        overflow: "hidden",
        borderRadius: 3,
        backgroundColor: "#111",
        aspectRatio: "16 / 9",
        border: "1px solid",
        borderColor: "divider",
        minHeight: 220,
      }}
    >
      {stream && cameraOn ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted={muted}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
          }}
        />
      ) : (
        <Box
          sx={{
            width: "100%",
            height: "100%",
            minHeight: 220,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background:
              "linear-gradient(135deg, #1f2937, #111827)",
          }}
        >
          <Avatar
            sx={{
              width: 80,
              height: 80,
              fontSize: 30,
              bgcolor: "primary.main",
            }}
          >
            {name?.charAt(0)?.toUpperCase() || "P"}
          </Avatar>
        </Box>
      )}

      {/* Name */}
      <Box
        sx={{
          position: "absolute",
          left: 12,
          bottom: 12,
          px: 1.5,
          py: 0.7,
          borderRadius: 2,
          backgroundColor: "rgba(0,0,0,0.65)",
          backdropFilter: "blur(6px)",
        }}
      >
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
        >
          <Typography
            variant="body2"
            sx={{
              color: "#fff",
              fontWeight: 600,
            }}
          >
            {isLocal ? "You" : name}
          </Typography>

          {role && (
            <Chip
              size="small"
              label={role}
              sx={{
                height: 22,
                color: "#fff",
                backgroundColor:
                  role === "teacher"
                    ? "rgba(25,118,210,0.9)"
                    : "rgba(76,175,80,0.9)",
                textTransform: "capitalize",
                fontSize: 11,
              }}
            />
          )}
        </Stack>
      </Box>

      {/* Camera status */}
      {!cameraOn && (
        <Box
          sx={{
            position: "absolute",
            right: 12,
            bottom: 12,
            width: 34,
            height: 34,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: "rgba(211,47,47,0.9)",
            color: "#fff",
          }}
        >
          <VideocamOffIcon fontSize="small" />
        </Box>
      )}
    </Paper>
  );
};


// ============================================================
// MAIN COMPONENT
// ============================================================

const LiveClassRoom = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const liveClassId = Number(id);

  // ==========================================================
  // REFS
  // ==========================================================

  const socketRef = useRef(null);

  const localStreamRef = useRef(null);

  const peerConnectionsRef = useRef(new Map());

  const remoteStreamsRef = useRef(new Map());

  const participantsRef = useRef(new Map());

  const mountedRef = useRef(true);

  // ==========================================================
  // STATES
  // ==========================================================

  const [liveClass, setLiveClass] = useState(null);

  const [loading, setLoading] = useState(true);

  const [connecting, setConnecting] = useState(false);

  const [joined, setJoined] = useState(false);

  const [socketConnected, setSocketConnected] =
    useState(false);

  const [localStream, setLocalStream] =
    useState(null);

  const [remoteParticipants, setRemoteParticipants] =
    useState([]);

  const [cameraOn, setCameraOn] = useState(true);

  const [micOn, setMicOn] = useState(true);

  const [role, setRole] = useState("");

  const [userId, setUserId] = useState(null);

  const [error, setError] = useState("");

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const [endingClass, setEndingClass] = useState(false);


  // ==========================================================
  // GET CURRENT USER
  // ==========================================================

  const getCurrentUser = useCallback(async () => {
    const token = getToken();

    if (!token) {
      throw new Error(
        "Authentication token not found. Please login again."
      );
    }

    // Shared api instance automatically adds the access token and
    // refreshes it when the server returns 401.
    const response = await api.get("/auth/profile");
    const result = response?.data;

    const user =
      result?.data ||
      result?.user ||
      result;

    if (!user?.id && !user?.userId) {
      throw new Error("Unable to load user profile.");
    }

    return user;
  }, []);


  // ==========================================================
  // GET LIVE CLASS
  // ==========================================================

  const loadLiveClass = useCallback(async () => {
    const token = getToken();

    if (!token) {
      throw new Error(
        "Authentication token not found. Please login again."
      );
    }

    if (
      !Number.isInteger(liveClassId) ||
      liveClassId <= 0
    ) {
      throw new Error(
        `Invalid live class ID: ${id || "missing"}`
      );
    }

    const response = await api.get(
      `/live-classes/${liveClassId}`
    );

    const result = response?.data;

    return (
      result?.data ||
      result?.liveClass ||
      result
    );
  }, [liveClassId, id]);


  // ==========================================================
  // SHOW MESSAGE
  // ==========================================================

  const showMessage = useCallback(
    (message, severity = "info") => {
      if (!mountedRef.current) {
        return;
      }

      setSnackbar({
        open: true,
        message,
        severity,
      });
    },
    []
  );


  // ==========================================================
  // UPDATE REMOTE PARTICIPANTS
  // ==========================================================

  const updateRemoteParticipants = useCallback(
    () => {
      const participants = Array.from(
        participantsRef.current.values()
      );

      setRemoteParticipants(
        participants
      );
    },
    []
  );


  // ==========================================================
  // CREATE PEER CONNECTION
  // ==========================================================

  const createPeerConnection = useCallback(
    (targetSocketId, targetUserId, targetRole) => {
      if (!socketRef.current) {
        return null;
      }

      // Existing connection
      const existing =
        peerConnectionsRef.current.get(
          targetSocketId
        );

      if (existing) {
        return existing;
      }

      const peerConnection =
        new RTCPeerConnection({
          iceServers: [
            {
              urls: "stun:stun.l.google.com:19302",
            },
            {
              urls: "stun:stun1.l.google.com:19302",
            },
          ],
        });

      // ------------------------------------------------------
      // Add local tracks
      // ------------------------------------------------------

      if (localStreamRef.current) {
        localStreamRef.current
          .getTracks()
          .forEach((track) => {
            peerConnection.addTrack(
              track,
              localStreamRef.current
            );
          });
      }

      // ------------------------------------------------------
      // ICE candidate
      // ------------------------------------------------------

      peerConnection.onicecandidate = (
        event
      ) => {
        if (!event.candidate) {
          return;
        }

        socketRef.current?.emit(
          "webrtc-ice-candidate",
          {
            liveClassId,
            targetSocketId,
            candidate: event.candidate,
          }
        );
      };

      // ------------------------------------------------------
      // Remote track
      // ------------------------------------------------------

      peerConnection.ontrack = (event) => {
        const [stream] =
          event.streams;

        if (!stream) {
          return;
        }

        remoteStreamsRef.current.set(
          targetSocketId,
          stream
        );

        participantsRef.current.set(
          targetSocketId,
          {
            socketId: targetSocketId,
            userId: targetUserId,
            role: targetRole,
            stream,
            cameraOn: true,
          }
        );

        updateRemoteParticipants();
      };

      // ------------------------------------------------------
      // Connection state
      // ------------------------------------------------------

      peerConnection.onconnectionstatechange =
        () => {
          const state =
            peerConnection.connectionState;

          console.log(
            `Peer ${targetSocketId} state:`,
            state
          );

          if (
            state === "failed" ||
            state === "closed" ||
            state === "disconnected"
          ) {
            participantsRef.current.delete(
              targetSocketId
            );

            remoteStreamsRef.current.delete(
              targetSocketId
            );

            updateRemoteParticipants();
          }
        };

      peerConnectionsRef.current.set(
        targetSocketId,
        peerConnection
      );

      return peerConnection;
    },
    [
      liveClassId,
      updateRemoteParticipants,
    ]
  );


  // ==========================================================
  // CREATE OFFER
  // ==========================================================

  const createOffer = useCallback(
    async (
      targetSocketId,
      targetUserId,
      targetRole
    ) => {
      try {
        const peerConnection =
          createPeerConnection(
            targetSocketId,
            targetUserId,
            targetRole
          );

        if (!peerConnection) {
          return;
        }

        const offer =
          await peerConnection.createOffer();

        await peerConnection.setLocalDescription(
          offer
        );

        socketRef.current?.emit(
          "webrtc-offer",
          {
            liveClassId,
            targetSocketId,
            offer,
          }
        );
      } catch (error) {
        console.error(
          "Create offer error:",
          error
        );
      }
    },
    [
      createPeerConnection,
      liveClassId,
    ]
  );


  // ==========================================================
  // HANDLE OFFER
  // ==========================================================

  const handleOffer = useCallback(
    async (data) => {
      try {
        const {
          senderSocketId,
          senderUserId,
          senderRole,
          offer,
        } = data;

        if (!senderSocketId || !offer) {
          return;
        }

        const peerConnection =
          createPeerConnection(
            senderSocketId,
            senderUserId,
            senderRole
          );

        if (!peerConnection) {
          return;
        }

        await peerConnection.setRemoteDescription(
          new RTCSessionDescription(
            offer
          )
        );

        const answer =
          await peerConnection.createAnswer();

        await peerConnection.setLocalDescription(
          answer
        );

        socketRef.current?.emit(
          "webrtc-answer",
          {
            liveClassId,
            targetSocketId:
              senderSocketId,
            answer,
          }
        );
      } catch (error) {
        console.error(
          "Handle offer error:",
          error
        );
      }
    },
    [
      createPeerConnection,
      liveClassId,
    ]
  );


  // ==========================================================
  // HANDLE ANSWER
  // ==========================================================

  const handleAnswer = useCallback(
    async (data) => {
      try {
        const {
          senderSocketId,
          answer,
        } = data;

        const peerConnection =
          peerConnectionsRef.current.get(
            senderSocketId
          );

        if (!peerConnection) {
          return;
        }

        await peerConnection.setRemoteDescription(
          new RTCSessionDescription(
            answer
          )
        );
      } catch (error) {
        console.error(
          "Handle answer error:",
          error
        );
      }
    },
    []
  );


  // ==========================================================
  // HANDLE ICE
  // ==========================================================

  const handleIceCandidate = useCallback(
    async (data) => {
      try {
        const {
          senderSocketId,
          candidate,
        } = data;

        if (!candidate) {
          return;
        }

        const peerConnection =
          peerConnectionsRef.current.get(
            senderSocketId
          );

        if (!peerConnection) {
          return;
        }

        await peerConnection.addIceCandidate(
          new RTCIceCandidate(candidate)
        );
      } catch (error) {
        console.error(
          "Add ICE candidate error:",
          error
        );
      }
    },
    []
  );


  // ==========================================================
  // REMOVE PARTICIPANT
  // ==========================================================

  const removeParticipant = useCallback(
    (socketId) => {
      const peerConnection =
        peerConnectionsRef.current.get(
          socketId
        );

      if (peerConnection) {
        peerConnection.close();
      }

      peerConnectionsRef.current.delete(
        socketId
      );

      remoteStreamsRef.current.delete(
        socketId
      );

      participantsRef.current.delete(
        socketId
      );

      updateRemoteParticipants();
    },
    [updateRemoteParticipants]
  );


  // ==========================================================
  // GET MEDIA
  // ==========================================================

  const getUserMedia = useCallback(
    async () => {
      try {
        if (
          !navigator.mediaDevices ||
          !navigator.mediaDevices.getUserMedia
        ) {
          throw new Error(
            "Camera and microphone are not supported by this browser."
          );
        }

        const stream =
          await navigator.mediaDevices.getUserMedia(
            {
              video: {
                width: {
                  ideal: 1280,
                },
                height: {
                  ideal: 720,
                },
                facingMode: "user",
              },
              audio: true,
            }
          );

        localStreamRef.current =
          stream;

        setLocalStream(stream);

        setCameraOn(true);
        setMicOn(true);

        return stream;
      } catch (error) {
        console.error(
          "getUserMedia error:",
          error
        );

        if (
          error?.name ===
          "NotAllowedError"
        ) {
          throw new Error(
            "Camera/Microphone permission denied. Please allow permission in browser settings."
          );
        }

        if (
          error?.name ===
          "NotFoundError"
        ) {
          throw new Error(
            "Camera or microphone not found."
          );
        }

        if (
          error?.name ===
          "NotReadableError"
        ) {
          throw new Error(
            "Camera or microphone is already being used by another application."
          );
        }

        throw error;
      }
    },
    []
  );


  // ==========================================================
  // TOGGLE CAMERA
  // ==========================================================

  const toggleCamera = () => {
    const stream =
      localStreamRef.current;

    if (!stream) {
      return;
    }

    const videoTracks =
      stream.getVideoTracks();

    if (!videoTracks.length) {
      return;
    }

    const newState =
      !cameraOn;

    videoTracks.forEach(
      (track) => {
        track.enabled = newState;
      }
    );

    setCameraOn(newState);
  };


  // ==========================================================
  // TOGGLE MIC
  // ==========================================================

  const toggleMic = () => {
    const stream =
      localStreamRef.current;

    if (!stream) {
      return;
    }

    const audioTracks =
      stream.getAudioTracks();

    if (!audioTracks.length) {
      return;
    }

    const newState =
      !micOn;

    audioTracks.forEach(
      (track) => {
        track.enabled = newState;
      }
    );

    setMicOn(newState);
  };


  // ==========================================================
  // JOIN CLASS
  // ==========================================================

  const joinLiveClass = useCallback(
    async () => {
      if (!socketRef.current) {
        return;
      }

      if (!liveClassId) {
        return;
      }

      try {
        setConnecting(true);

        // Get camera
        if (!localStreamRef.current) {
          await getUserMedia();
        }

        socketRef.current.emit(
          "join-live-class",
          {
            liveClassId,
          }
        );
      } catch (error) {
        console.error(
          "Join live class error:",
          error
        );

        setError(
          error?.message ||
            "Unable to join live class."
        );

        setConnecting(false);
      }
    },
    [
      getUserMedia,
      liveClassId,
    ]
  );


  // ==========================================================
  // CONNECT SOCKET
  // ==========================================================

  const connectSocket = useCallback(
    async () => {
      const token = getToken();

      if (!token) {
        setError(
          "You are not authenticated. Please login again."
        );

        return;
      }

      try {
        setConnecting(true);

        const socket = io(
          SOCKET_URL,
          {
            transports: ["websocket"],
            auth: {
              access_token: token,
              token,
            },
            reconnection: true,
            reconnectionAttempts: 5,
          }
        );

        socketRef.current =
          socket;

        // ----------------------------------------------------
        // CONNECT
        // ----------------------------------------------------

        socket.on(
          "connect",
          () => {
            console.log(
              "Socket connected:",
              socket.id
            );

            setSocketConnected(true);
          }
        );

        // ----------------------------------------------------
        // AUTH SUCCESS
        // ----------------------------------------------------

        socket.on(
          "socket-authenticated",
          (data) => {
            console.log(
              "Socket authenticated:",
              data
            );

            // If role not loaded from profile
            if (data?.role) {
              setRole(
                data.role
              );
            }

            if (data?.userId) {
              setUserId(
                Number(data.userId)
              );
            }

            // Join after socket auth
            joinLiveClass();
          }
        );

        // ----------------------------------------------------
        // AUTH ERROR
        // ----------------------------------------------------

        socket.on(
          "socket-auth-error",
          (data) => {
            console.error(
              "Socket auth error:",
              data
            );

            setError(
              data?.message ||
                "Socket authentication failed."
            );

            setConnecting(false);
          }
        );

        // ----------------------------------------------------
        // JOINED
        // ----------------------------------------------------

        socket.on(
          "joined-live-class",
          (data) => {
            console.log(
              "Joined live class:",
              data
            );

            setJoined(true);
            setConnecting(false);

            // Existing participants
            const participants =
              data?.participants ||
              [];

            participants.forEach(
              (participant) => {
                participantsRef.current.set(
                  participant.socketId,
                  {
                    socketId:
                      participant.socketId,
                    userId:
                      participant.userId,
                    role:
                      participant.role,
                    stream:
                      null,
                    cameraOn:
                      true,
                  }
                );
              }
            );

            updateRemoteParticipants();

            // ------------------------------------------------
            // IMPORTANT:
            // Existing participant creates offer.
            // This avoids both sides creating offer.
            // ------------------------------------------------

            participants.forEach(
              (participant) => {
                createOffer(
                  participant.socketId,
                  participant.userId,
                  participant.role
                );
              }
            );
          }
        );

        // ----------------------------------------------------
        // PARTICIPANT JOINED
        // ----------------------------------------------------

        socket.on(
          "participant-joined",
          (data) => {
            console.log(
              "Participant joined:",
              data
            );

            const {
              socketId,
              userId,
              role,
            } = data;

            if (!socketId) {
              return;
            }

            participantsRef.current.set(
              socketId,
              {
                socketId,
                userId,
                role,
                stream: null,
                cameraOn: true,
              }
            );

            updateRemoteParticipants();

            // Do NOT create offer here.
            // Existing participant already
            // receives this event and creates offer.
          }
        );

        // ----------------------------------------------------
        // PARTICIPANT LEFT
        // ----------------------------------------------------

        socket.on(
          "participant-left",
          (data) => {
            console.log(
              "Participant left:",
              data
            );

            if (
              data?.socketId
            ) {
              removeParticipant(
                data.socketId
              );
            }
          }
        );

        // ----------------------------------------------------
        // OFFER
        // ----------------------------------------------------

        socket.on(
          "webrtc-offer",
          handleOffer
        );

        // ----------------------------------------------------
        // ANSWER
        // ----------------------------------------------------

        socket.on(
          "webrtc-answer",
          handleAnswer
        );

        // ----------------------------------------------------
        // ICE
        // ----------------------------------------------------

        socket.on(
          "webrtc-ice-candidate",
          handleIceCandidate
        );

        // ----------------------------------------------------
        // LIVE CLASS ERROR
        // ----------------------------------------------------

        socket.on(
          "live-class-error",
          (data) => {
            console.error(
              "Live class error:",
              data
            );

            showMessage(
              data?.message ||
                "Live class error.",
              "error"
            );
          }
        );

        // ----------------------------------------------------
        // DISCONNECT
        // ----------------------------------------------------

        socket.on(
          "disconnect",
          (reason) => {
            console.log(
              "Socket disconnected:",
              reason
            );

            setSocketConnected(
              false
            );
            setJoined(false);
          }
        );

        // ----------------------------------------------------
        // CONNECT ERROR
        // ----------------------------------------------------

        socket.on(
          "connect_error",
          (error) => {
            console.error(
              "Socket connection error:",
              error
            );

            setConnecting(false);

            setError(
              "Unable to connect to live class server."
            );
          }
        );
      } catch (error) {
        console.error(
          "Socket setup error:",
          error
        );

        setConnecting(false);

        setError(
          error?.message ||
            "Unable to connect."
        );
      }
    },
    [
      createOffer,
      handleAnswer,
      handleIceCandidate,
      handleOffer,
      joinLiveClass,
      removeParticipant,
      showMessage,
      updateRemoteParticipants,
    ]
  );


  // ==========================================================
  // END LIVE CLASS API
  // ==========================================================

  const endLiveClass = async () => {
    if (role !== "teacher") {
      return;
    }

    if (!liveClassId) {
      return;
    }

    try {
      setEndingClass(true);

      const token = getToken();

      if (!token) {
        throw new Error(
          "Authentication token not found. Please login again."
        );
      }

      await api.post(
        `/live-classes/${liveClassId}/end`
      );

      showMessage(
        "Live class ended successfully.",
        "success"
      );

      setLiveClass(
        (previous) => ({
          ...previous,
          isLive: false,
          isCompleted: true,
        })
      );

      // Leave socket room
      socketRef.current?.emit(
        "leave-live-class",
        {
          liveClassId,
        }
      );

      // Cleanup
      cleanupConnections();

      setTimeout(() => {
        navigate(
          "/dashboard"
        );
      }, 800);
    } catch (error) {
      console.error(
        "End live class error:",
        error
      );

      showMessage(
        error?.message ||
          "Unable to end live class.",
        "error"
      );
    } finally {
      setEndingClass(false);
    }
  };


  // ==========================================================
  // CLEANUP CONNECTIONS
  // ==========================================================

  const cleanupConnections = useCallback(
    () => {
      console.log(
        "Cleaning WebRTC connections..."
      );

      // ------------------------------------------------------
      // Stop local media
      // ------------------------------------------------------

      if (
        localStreamRef.current
      ) {
        localStreamRef.current
          .getTracks()
          .forEach((track) => {
            track.stop();
          });

        localStreamRef.current =
          null;
      }

      setLocalStream(null);

      // ------------------------------------------------------
      // Close peer connections
      // ------------------------------------------------------

      peerConnectionsRef.current.forEach(
        (peerConnection) => {
          try {
            peerConnection.close();
          } catch (error) {
            console.warn(
              "Peer close error:",
              error
            );
          }
        }
      );

      peerConnectionsRef.current.clear();

      // ------------------------------------------------------
      // Clear remote
      // ------------------------------------------------------

      remoteStreamsRef.current.clear();

      participantsRef.current.clear();

      setRemoteParticipants([]);

      // ------------------------------------------------------
      // Disconnect socket
      // ------------------------------------------------------

      if (socketRef.current) {
        socketRef.current.removeAllListeners();

        socketRef.current.disconnect();

        socketRef.current =
          null;
      }

      setSocketConnected(false);
      setJoined(false);
    },
    []
  );


  // ==========================================================
  // INITIAL LOAD
  // ==========================================================

  useEffect(() => {
    mountedRef.current = true;

    const initialize = async () => {
      try {
        setLoading(true);
        setError("");

        // ----------------------------------------------------
        // Validate ID
        // ----------------------------------------------------
        console.log("🔎 LiveClassRoom route id:", id);
        console.log("🔎 Parsed liveClassId:", liveClassId);

        if (
          !Number.isInteger(
            liveClassId
          ) ||
          liveClassId <= 0
        ) {
          throw new Error(
            "Invalid live class ID."
          );
        }

        // ----------------------------------------------------
        // Load user
        // ----------------------------------------------------

        const user =
          await getCurrentUser();

        const currentRole =
          String(
            user?.role ||
              user?.userRole ||
              ""
          ).toLowerCase();

        const currentUserId =
          Number(
            user?.id ||
              user?.userId
          );

        setRole(
          currentRole
        );

        setUserId(
          currentUserId
        );

        // ----------------------------------------------------
        // Load live class
        // ----------------------------------------------------

        const classData =
          await loadLiveClass();

        setLiveClass(
          classData
        );

        // ----------------------------------------------------
        // Validate status
        // ----------------------------------------------------

        if (
          classData?.isCancelled
        ) {
          throw new Error(
            "This live class has been cancelled."
          );
        }

        if (
          classData?.isCompleted
        ) {
          throw new Error(
            "This live class has already ended."
          );
        }

        // ----------------------------------------------------
        // Connect socket
        // ----------------------------------------------------

        await connectSocket();
      } catch (error) {
        console.error(
          "Initialize LiveClassRoom error:",
          error
        );

        if (
          mountedRef.current
        ) {
          setError(
            error?.message ||
              "Unable to load live class."
          );
        }
      } finally {
        if (
          mountedRef.current
        ) {
          setLoading(false);
        }
      }
    };

    initialize();

    return () => {
      mountedRef.current = false;

      cleanupConnections();
    };
  }, [
    cleanupConnections,
    connectSocket,
    getCurrentUser,
    liveClassId,
    loadLiveClass,
  ]);


  // ==========================================================
  // LEAVE ROOM
  // ==========================================================

  const handleLeave = () => {
    if (socketRef.current) {
      socketRef.current.emit(
        "leave-live-class",
        {
          liveClassId,
        }
      );
    }

    cleanupConnections();

    navigate(-1);
  };


  // ==========================================================
  // LOADING
  // ==========================================================

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor:
            "background.default",
        }}
      >
        <Stack
          spacing={2}
          alignItems="center"
        >
          <CircularProgress />

          <Typography>
            Loading live class...
          </Typography>
        </Stack>
      </Box>
    );
  }


  // ==========================================================
  // ERROR
  // ==========================================================

  if (error && !liveClass) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          px: 2,
          bgcolor:
            "background.default",
        }}
      >
        <Card
          sx={{
            maxWidth: 500,
            width: "100%",
            borderRadius: 4,
          }}
        >
          <CardContent>
            <Stack
              spacing={3}
              alignItems="center"
            >
              <WarningAmberIcon
                color="error"
                sx={{
                  fontSize: 60,
                }}
              />

              <Typography
                variant="h6"
                fontWeight={700}
                sx={{ textAlign: "center" }}
              >
                Unable to Open Live Class
              </Typography>

              <Alert
                severity="error"
                sx={{
                  width: "100%",
                }}
              >
                {error}
              </Alert>

              <Button
                variant="contained"
                startIcon={
                  <ArrowBackIcon />
                }
                onClick={() =>
                  navigate(-1)
                }
              >
                Go Back
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </Box>
    );
  }


  // ==========================================================
  // MAIN UI
  // ==========================================================

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor:
          "background.default",
        pb: 5,
      }}
    >
      {/* ====================================================
          HEADER
      ==================================================== */}

      <Box
        sx={{
          px: {
            xs: 2,
            md: 4,
          },
          py: 2,
          borderBottom: "1px solid",
          borderColor:
            "divider",
          bgcolor:
            "background.paper",
          position: "sticky",
          top: 0,
          zIndex: 20,
        }}
      >
        <Stack
          direction={{
            xs: "column",
            sm: "row",
          }}
          spacing={2}
          justifyContent="space-between"
          alignItems={{
            xs: "flex-start",
            sm: "center",
          }}
        >
          <Stack
            direction="row"
            spacing={2}
            alignItems="center"
          >
            <IconButton
              onClick={handleLeave}
            >
              <ArrowBackIcon />
            </IconButton>

            <Box>
              <Typography
                variant="h6"
                fontWeight={700}
              >
                {liveClass?.title ||
                  "Live Class"}
              </Typography>

              <Stack
                direction="row"
                spacing={1}
                mt={0.5}
              >
                <Chip
                  size="small"
                  icon={
                    <PeopleIcon />
                  }
                  label={`${remoteParticipants.length + 1} participant${
                    remoteParticipants.length !==
                    0
                      ? "s"
                      : ""
                  }`}
                />

                <Chip
                  size="small"
                  color={
                    socketConnected
                      ? "success"
                      : "default"
                  }
                  label={
                    socketConnected
                      ? "Connected"
                      : "Connecting..."
                  }
                />
              </Stack>
            </Box>
          </Stack>

          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
          >
            {role && (
              <Chip
                icon={
                  role ===
                  "teacher" ? (
                    <SchoolIcon />
                  ) : (
                    <PersonIcon />
                  )
                }
                label={
                  role === "teacher"
                    ? "Teacher"
                    : "Student"
                }
                color="primary"
              />
            )}

            {liveClass?.isLive ? (
              <Chip
                label="LIVE"
                color="error"
                sx={{
                  fontWeight: 700,
                }}
              />
            ) : (
              <Chip
                label="Not Started"
                color="warning"
              />
            )}
          </Stack>
        </Stack>
      </Box>


      {/* ====================================================
          CONTENT
      ==================================================== */}

      <Box
        sx={{
          maxWidth: 1500,
          mx: "auto",
          px: {
            xs: 2,
            md: 4,
          },
          pt: 3,
        }}
      >
        {/* Error */}
        {error && (
          <Alert
            severity="error"
            sx={{
              mb: 3,
            }}
            onClose={() =>
              setError("")
            }
          >
            {error}
          </Alert>
        )}


        {/* ==================================================
            CLASS INFO
        ================================================== */}

        <Card
          elevation={0}
          sx={{
            mb: 3,
            borderRadius: 3,
            border: "1px solid",
            borderColor:
              "divider",
          }}
        >
          <CardContent>
            <Stack
              direction={{
                xs: "column",
                md: "row",
              }}
              spacing={2}
              justifyContent="space-between"
            >
              <Box>
                <Typography
                  variant="h5"
                  fontWeight={700}
                >
                  {liveClass?.title}
                </Typography>

                {liveClass?.description && (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      mt: 1,
                    }}
                  >
                    {
                      liveClass.description
                    }
                  </Typography>
                )}
              </Box>

              <Typography
                variant="body2"
                color="text.secondary"
              >
                Scheduled:{" "}
                {liveClass?.scheduledAt
                  ? new Date(
                      liveClass.scheduledAt
                    ).toLocaleString()
                  : "N/A"}
              </Typography>
            </Stack>
          </CardContent>
        </Card>


        {/* ==================================================
            VIDEO GRID
        ================================================== */}

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm:
                remoteParticipants.length ===
                0
                  ? "1fr"
                  : "repeat(2, 1fr)",
              lg:
                remoteParticipants.length <=
                1
                  ? "repeat(2, 1fr)"
                  : "repeat(3, 1fr)",
            },
            gap: 2,
          }}
        >
          {/* LOCAL VIDEO */}

          <VideoTile
            stream={localStream}
            muted
            name="You"
            role={role}
            isLocal
            cameraOn={cameraOn}
          />


          {/* REMOTE VIDEOS */}

          {remoteParticipants.map(
            (participant) => (
              <VideoTile
                key={
                  participant.socketId
                }
                stream={
                  participant.stream
                }
                name={`User ${participant.userId}`}
                role={
                  participant.role
                }
                cameraOn={
                  participant.cameraOn !==
                  false
                }
              />
            )
          )}
        </Box>


        {/* ==================================================
            WAITING MESSAGE
        ================================================== */}

        {remoteParticipants.length ===
          0 && (
          <Card
            elevation={0}
            sx={{
              mt: 3,
              borderRadius: 3,
              border: "1px solid",
              borderColor:
                "divider",
            }}
          >
            <CardContent>
              <Stack
                alignItems="center"
                spacing={1}
                py={2}
              >
                <PeopleIcon
                  color="disabled"
                  sx={{
                    fontSize: 40,
                  }}
                />

                <Typography
                  fontWeight={600}
                >
                  Waiting for participants
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ textAlign: "center" }}
                >
                  Other participants will
                  appear here when they join
                  the live class.
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        )}


        {/* ==================================================
            CONTROLS
        ================================================== */}

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mt: 4,
          }}
        >
          <Paper
            elevation={4}
            sx={{
              borderRadius: 5,
              px: 2,
              py: 1.5,
            }}
          >
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
            >
              {/* MIC */}

              <Tooltip
                title={
                  micOn
                    ? "Mute microphone"
                    : "Unmute microphone"
                }
              >
                <IconButton
                  onClick={
                    toggleMic
                  }
                  sx={{
                    width: 52,
                    height: 52,
                    bgcolor:
                      micOn
                        ? "action.hover"
                        : "error.main",
                    color:
                      micOn
                        ? "text.primary"
                        : "#fff",
                    "&:hover": {
                      bgcolor:
                        micOn
                          ? "action.selected"
                          : "error.dark",
                    },
                  }}
                >
                  {micOn ? (
                    <MicIcon />
                  ) : (
                    <MicOffIcon />
                  )}
                </IconButton>
              </Tooltip>


              {/* CAMERA */}

              <Tooltip
                title={
                  cameraOn
                    ? "Turn camera off"
                    : "Turn camera on"
                }
              >
                <IconButton
                  onClick={
                    toggleCamera
                  }
                  sx={{
                    width: 52,
                    height: 52,
                    bgcolor:
                      cameraOn
                        ? "action.hover"
                        : "error.main",
                    color:
                      cameraOn
                        ? "text.primary"
                        : "#fff",
                    "&:hover": {
                      bgcolor:
                        cameraOn
                          ? "action.selected"
                          : "error.dark",
                    },
                  }}
                >
                  {cameraOn ? (
                    <VideocamIcon />
                  ) : (
                    <VideocamOffIcon />
                  )}
                </IconButton>
              </Tooltip>


              {/* LEAVE / END */}

              {role ===
              "teacher" ? (
                <Tooltip title="End live class">
                  <IconButton
                    onClick={
                      endLiveClass
                    }
                    disabled={
                      endingClass
                    }
                    sx={{
                      width: 58,
                      height: 52,
                      ml: 1,
                      bgcolor:
                        "error.main",
                      color: "#fff",
                      "&:hover": {
                        bgcolor:
                          "error.dark",
                      },
                    }}
                  >
                    {endingClass ? (
                      <CircularProgress
                        size={22}
                        color="inherit"
                      />
                    ) : (
                      <CallEndIcon />
                    )}
                  </IconButton>
                </Tooltip>
              ) : (
                <Tooltip title="Leave live class">
                  <IconButton
                    onClick={
                      handleLeave
                    }
                    sx={{
                      width: 58,
                      height: 52,
                      ml: 1,
                      bgcolor:
                        "error.main",
                      color: "#fff",
                      "&:hover": {
                        bgcolor:
                          "error.dark",
                      },
                    }}
                  >
                    <CallEndIcon />
                  </IconButton>
                </Tooltip>
              )}
            </Stack>
          </Paper>
        </Box>


        {/* ==================================================
            CONNECTING
        ================================================== */}

        {connecting && (
          <Stack
            direction="row"
            spacing={1}
            justifyContent="center"
            alignItems="center"
            sx={{
              mt: 2,
            }}
          >
            <CircularProgress
              size={18}
            />

            <Typography
              variant="body2"
              color="text.secondary"
            >
              Connecting to live class...
            </Typography>
          </Stack>
        )}


        {/* ==================================================
            STATUS
        ================================================== */}

        <Box
          sx={{
            mt: 3,
            textAlign: "center",
          }}
        >
          <Typography
            variant="caption"
            color="text.secondary"
          >
            {joined
              ? "You are connected to the live class."
              : "Connecting..."}
          </Typography>
        </Box>
      </Box>


      {/* ====================================================
          SNACKBAR
      ==================================================== */}

      <Snackbar
        open={
          snackbar.open
        }
        autoHideDuration={3500}
        onClose={() =>
          setSnackbar(
            (prev) => ({
              ...prev,
              open: false,
            })
          )
        }
      >
        <Alert
          severity={
            snackbar.severity
          }
          variant="filled"
          onClose={() =>
            setSnackbar(
              (prev) => ({
                ...prev,
                open: false,
              })
            )
          }
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default LiveClassRoom;