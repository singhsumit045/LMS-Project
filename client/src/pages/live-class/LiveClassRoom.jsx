
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { io } from "socket.io-client";

import {
  Box,
  Button,
  Chip,
  Divider,
  IconButton,
  Paper,
  Stack,
  TextField,
  Typography,
  Alert,
  CircularProgress,
} from "@mui/material";

import {
  Videocam,
  VideocamOff,
  Mic,
  MicOff,
  ScreenShare,
  StopScreenShare,
  CallEnd,
  Send,
  Chat,
  People,
  ArrowBack,
} from "@mui/icons-material";

import {
  getLiveClass,
  startLiveClass,
  endLiveClass,
} from "../../services/liveClassService";


// =====================================================
// CONFIG
// =====================================================

const SOCKET_URL = (
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:3000"
).replace(/\/+$/, "");


// =====================================================
// LIVE CLASS ROOM
// =====================================================

const LiveClassRoom = () => {
  const navigate = useNavigate();

  const { liveClassId } = useParams();

  // ===================================================
  // ID VALIDATION
  // ===================================================

  const numericLiveClassId = Number(liveClassId);

  const isValidLiveClassId =
    liveClassId &&
    liveClassId !== "create" &&
    Number.isInteger(numericLiveClassId) &&
    numericLiveClassId > 0;

  // ===================================================
  // REFS
  // ===================================================

  const socketRef = useRef(null);

  const localVideoRef = useRef(null);

  const remoteVideoRef = useRef(null);

  const localStreamRef = useRef(null);

  const screenStreamRef = useRef(null);

  const peerConnectionRef = useRef(null);

  const chatEndRef = useRef(null);

  // ===================================================
  // STATE
  // ===================================================

  const [liveClass, setLiveClass] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [socketConnected, setSocketConnected] =
    useState(false);

  const [isTeacher, setIsTeacher] = useState(false);

  const [isLive, setIsLive] = useState(false);

  const [isCameraOn, setIsCameraOn] =
    useState(false);

  const [isMicOn, setIsMicOn] =
    useState(false);

  const [isScreenSharing, setIsScreenSharing] =
    useState(false);

  const [participants, setParticipants] =
    useState([]);

  const [messages, setMessages] =
    useState([]);

  const [message, setMessage] =
    useState("");

  const [starting, setStarting] =
    useState(false);

  const [ending, setEnding] =
    useState(false);


  // ===================================================
  // CURRENT USER
  // ===================================================

  const getCurrentUser = () => {
    try {
      const user =
        JSON.parse(
          localStorage.getItem("user")
        );

      return user || null;
    } catch {
      return null;
    }
  };


  // ===================================================
  // INITIALIZE USER ROLE
  // ===================================================

  useEffect(() => {
    const user = getCurrentUser();

    if (!user) {
      return;
    }

    const role =
      String(user.role || "").toLowerCase();

    setIsTeacher(
      role === "teacher" ||
      role === "admin"
    );
  }, []);


  // ===================================================
  // INVALID ID PROTECTION
  // ===================================================

  useEffect(() => {
    if (!isValidLiveClassId) {
      console.error(
        "========================================"
      );

      console.error(
        "❌ INVALID LIVE CLASS ID"
      );

      console.error(
        "URL ID:",
        liveClassId
      );

      console.error(
        "Numeric ID:",
        numericLiveClassId
      );

      console.error(
        "========================================"
      );

      setLoading(false);

      setError(
        "Invalid live class ID. Please open the live class from the correct link."
      );

      return;
    }
  }, [
    liveClassId,
    numericLiveClassId,
    isValidLiveClassId,
  ]);


  // =====================================================
  // LOAD LIVE CLASS
  // =====================================================

  useEffect(() => {
    if (!isValidLiveClassId) {
      return;
    }

    let cancelled = false;

    const loadLiveClass = async () => {
      try {
        setLoading(true);

        setError("");

        console.log(
          "========================================"
        );

        console.log(
          "📡 Loading Live Class"
        );

        console.log(
          "Live Class ID:",
          numericLiveClassId
        );

        console.log(
          "========================================"
        );

        const response =
          await getLiveClass(
            numericLiveClassId
          );

        if (cancelled) {
          return;
        }

        const data =
          response?.data?.data ||
          response?.data;

        console.log(
          "📥 Live Class:",
          data
        );

        if (!data) {
          throw new Error(
            "Live class not found"
          );
        }

        setLiveClass(data);

        setIsLive(
          Boolean(data.isLive)
        );

        // =============================================
        // DETERMINE TEACHER
        // =============================================

        const user =
          getCurrentUser();

        const currentUserId =
          Number(user?.id);

        const teacherId =
          Number(data.teacherId);

        if (
          Number.isInteger(currentUserId) &&
          Number.isInteger(teacherId)
        ) {
          setIsTeacher(
            currentUserId === teacherId
          );
        }

      } catch (err) {
        console.error(
          "❌ Failed to load live class:",
          err
        );

        if (!cancelled) {
          setError(
            err?.response?.data?.message ||
            err?.message ||
            "Failed to load live class"
          );
        }

      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadLiveClass();

    return () => {
      cancelled = true;
    };

  }, [
    numericLiveClassId,
    isValidLiveClassId,
  ]);


  // =====================================================
  // CREATE PEER CONNECTION
  // =====================================================

  const peerConnectionsRef = useRef(
    new Map()
  );

  const getActivePeerConnection = () => {
    if (peerConnectionRef.current) {
      return peerConnectionRef.current;
    }

    return (
      peerConnectionsRef.current.values()
        .next().value || null
    );
  };

  const closePeerConnection = (
    targetSocketId
  ) => {
    if (!targetSocketId) {
      return;
    }

    const peerConnection =
      peerConnectionsRef.current.get(
        targetSocketId
      );

    if (!peerConnection) {
      return;
    }

    peerConnection.ontrack = null;
    peerConnection.onicecandidate = null;
    peerConnection.onconnectionstatechange = null;
    peerConnection.close();

    peerConnectionsRef.current.delete(
      targetSocketId
    );

    if (
      peerConnectionRef.current ===
      peerConnection
    ) {
      peerConnectionRef.current = null;
    }
  };

  const createPeerConnection = (
    targetSocketId = null
  ) => {
    const connectionKey =
      targetSocketId || "default";

    const existingConnection =
      targetSocketId
        ? peerConnectionsRef.current.get(
            targetSocketId
          )
        : peerConnectionRef.current;

    if (existingConnection) {
      return existingConnection;
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

    peerConnection.ontrack = (event) => {
      console.log(
        "📺 Remote track received",
        event.streams?.[0]
      );

      if (
        remoteVideoRef.current &&
        event.streams?.[0]
      ) {
        remoteVideoRef.current.srcObject =
          event.streams[0];
      }
    };

    peerConnection.onicecandidate =
      (event) => {
        if (
          event.candidate &&
          socketRef.current &&
          socketRef.current.connected &&
          targetSocketId
        ) {
          socketRef.current.emit(
            "webrtc-ice-candidate",
            {
              liveClassId:
                numericLiveClassId,
              targetSocketId,
              candidate:
                event.candidate,
            }
          );
        }
      };

    peerConnection.onconnectionstatechange =
      () => {
        console.log(
          "🔗 Peer connection:",
          peerConnection.connectionState,
          connectionKey
        );
      };

    if (targetSocketId) {
      peerConnectionsRef.current.set(
        targetSocketId,
        peerConnection
      );
    } else {
      peerConnectionRef.current =
        peerConnection;
    }

    return peerConnection;
  };

  const createAndSendOffer = async (
    targetSocketId
  ) => {
    if (
      !targetSocketId ||
      !socketRef.current ||
      !socketRef.current.connected ||
      !localStreamRef.current
    ) {
      return;
    }

    const peerConnection =
      createPeerConnection(
        targetSocketId
      );

    if (!peerConnection) {
      return;
    }

    try {
      const offer =
        await peerConnection.createOffer();

      await peerConnection.setLocalDescription(
        offer
      );

      socketRef.current.emit(
        "webrtc-offer",
        {
          liveClassId:
            numericLiveClassId,
          targetSocketId,
          offer,
        }
      );
    } catch (err) {
      console.error(
        "❌ Offer creation error:",
        err
      );
    }
  };


  // =====================================================
  // GET CAMERA + MICROPHONE
  // =====================================================

const startCameraAndMicrophone = async () => {
  try {
    if (localStreamRef.current) {
      return localStreamRef.current;
    }

    // Browser support check
    if (!navigator.mediaDevices) {
      throw new Error(
        "Camera/Microphone API is not available. HTTPS may be required."
      );
    }

    console.log("🌐 Current URL:", window.location.href);
    console.log(
      "🔐 Secure Context:",
      window.isSecureContext
    );

    const stream =
      await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

    localStreamRef.current = stream;

    if (localVideoRef.current) {
      localVideoRef.current.srcObject = stream;
    }

    setIsCameraOn(true);
    setIsMicOn(true);

    console.log("🎥 Camera + microphone started");

    return stream;

  } catch (err) {
    console.error(
      "❌ Camera/Microphone error:",
      err
    );

    console.error(
      "Error name:",
      err?.name
    );

    console.error(
      "Error message:",
      err?.message
    );

    if (err?.name === "NotAllowedError") {
      setError(
        "Camera or microphone permission was denied. Please allow camera and microphone access in Chrome."
      );
    } else if (err?.name === "NotFoundError") {
      setError(
        "No camera or microphone was found on this device."
      );
    } else if (err?.name === "NotReadableError") {
      setError(
        "Camera or microphone is already being used by another application."
      );
    } else if (err?.name === "SecurityError") {
      setError(
        "Camera/microphone access is blocked because this page is not using a secure connection."
      );
    } else {
      setError(
        `Camera/Microphone error: ${
          err?.name || "Unknown error"
        }`
      );
    }

    return null;
  }
};
  // =====================================================
  // SOCKET CONNECTION
  // =====================================================

  useEffect(() => {
    if (!isValidLiveClassId) {
      console.warn(
        "⚠️ Socket setup stopped. Invalid ID:",
        liveClassId
      );

      return;
    }

    const token =
      localStorage.getItem("token");

    if (!token) {
      console.error(
        "❌ No access token found"
      );
      return;
    }

    console.log(
      "========================================"
    );

    console.log(
      "🔌 Setting up Live Class Socket"
    );

    console.log(
      "Live Class ID:",
      numericLiveClassId
    );

    console.log(
      "Socket URL:",
      SOCKET_URL
    );

    console.log(
      "========================================"
    );


    const socket =
      io(SOCKET_URL, {
        transports: [
          "websocket",
          "polling",
        ],

        auth: {
          token,
        },

        query: {
          liveClassId:
            String(numericLiveClassId),
        },

        autoConnect: true,
      });


    socketRef.current =
      socket;


    // =================================================
    // CONNECT
    // =================================================

    socket.on(
      "connect",
      () => {
        console.log(
          "🟢 Live Class Socket connected:",
          socket.id
        );

        setSocketConnected(true);

        socket.emit(
          "join-live-class",
          {
            liveClassId:
              numericLiveClassId,
          }
        );
      }
    );


    // =================================================
    // CONNECT ERROR
    // =================================================

    socket.on(
      "connect_error",
      (err) => {
        console.error(
          "❌ Live Class Socket error:",
          err
        );

        setSocketConnected(false);
      }
    );


    // =================================================
    // DISCONNECT
    // =================================================

    socket.on(
      "disconnect",
      (reason) => {
        console.log(
          "🔴 Live Class Socket disconnected:",
          reason
        );

        setSocketConnected(false);
      }
    );


    // =================================================
    // PARTICIPANTS
    // =================================================

    socket.on(
      "joined-live-class",
      (data) => {
        console.log(
          "✅ Joined live class:",
          data
        );

        const existingParticipants =
          Array.isArray(
            data?.participants
          )
            ? data.participants
            : [];

        if (existingParticipants.length) {
          setParticipants(
            existingParticipants
          );

          existingParticipants.forEach(
            (participant) => {
              const remoteSocketId =
                participant?.socketId ||
                participant?.id;

              if (
                remoteSocketId &&
                remoteSocketId !==
                  socket.id &&
                localStreamRef.current
              ) {
                createAndSendOffer(
                  remoteSocketId
                );
              }
            }
          );
        }
      }
    );

    socket.on(
      "participants",
      (data) => {
        console.log(
          "👥 Participants:",
          data
        );

        if (Array.isArray(data)) {
          setParticipants(data);
        } else if (
          Array.isArray(data?.participants)
        ) {
          setParticipants(
            data.participants
          );
        }
      }
    );


    socket.on(
      "participant-joined",
      (participant) => {
        console.log(
          "👤 Participant joined:",
          participant
        );

        setParticipants(
          (prev) => {
            const exists =
              prev.some(
                (item) =>
                  item?.id ===
                    participant?.id ||
                  item?.socketId ===
                    participant?.socketId
              );

            if (exists) {
              return prev;
            }

            return [
              ...prev,
              participant,
            ];
          }
        );

        const remoteSocketId =
          participant?.socketId ||
          participant?.id;

        if (
          remoteSocketId &&
          remoteSocketId !== socket.id &&
          localStreamRef.current
        ) {
          createAndSendOffer(
            remoteSocketId
          );
        }
      }
    );


    socket.on(
      "participant-left",
      (participant) => {
        console.log(
          "👋 Participant left:",
          participant
        );

        const remoteSocketId =
          participant?.socketId ||
          participant?.id;

        if (remoteSocketId) {
          closePeerConnection(
            remoteSocketId
          );
        }

        setParticipants(
          (prev) =>
            prev.filter(
              (item) =>
                item?.id !==
                  participant?.id &&
                item?.socketId !==
                  remoteSocketId
            )
        );
      }
    );


    // =================================================
    // CLASS STARTED
    // =================================================

    socket.on(
      "live-class-started",
      (data) => {
        console.log(
          "🔴 Live class started:",
          data
        );

        setIsLive(true);
      }
    );


    // =================================================
    // CLASS ENDED
    // =================================================

    socket.on(
      "live-class-ended",
      (data) => {
        console.log(
          "⏹ Live class ended:",
          data
        );

        setIsLive(false);
      }
    );


    // =================================================
    // CHAT
    // =================================================

    socket.on(
      "chat-message",
      (data) => {
        console.log(
          "💬 Chat:",
          data
        );

        setMessages(
          (prev) => [
            ...prev,
            data,
          ]
        );
      }
    );


    // =================================================
    // WEBRTC OFFER
    // =================================================

    socket.on(
      "webrtc-offer",
      async (data) => {
        try {
          console.log(
            "📨 WebRTC offer received",
            data
          );

          if (!data?.offer) {
            return;
          }

          const peerConnection =
            createPeerConnection(
              data.senderSocketId
            );

          await peerConnection.setRemoteDescription(
            new RTCSessionDescription(
              data.offer
            )
          );

          const answer =
            await peerConnection.createAnswer();

          await peerConnection.setLocalDescription(
            answer
          );

          socket.emit(
            "webrtc-answer",
            {
              liveClassId:
                numericLiveClassId,
              targetSocketId:
                data.senderSocketId,
              answer,
            }
          );
        } catch (err) {
          console.error(
            "❌ Offer handling error:",
            err
          );
        }
      }
    );


    // =================================================
    // WEBRTC ANSWER
    // =================================================

    socket.on(
      "webrtc-answer",
      async (data) => {
        try {
          console.log(
            "📨 WebRTC answer received",
            data
          );

          if (
            data?.senderSocketId &&
            data?.answer
          ) {
            const peerConnection =
              createPeerConnection(
                data.senderSocketId
              );

            if (peerConnection) {
              await peerConnection.setRemoteDescription(
                new RTCSessionDescription(
                  data.answer
                )
              );
            }
          }
        } catch (err) {
          console.error(
            "❌ Answer handling error:",
            err
          );
        }
      }
    );


    // =================================================
    // ICE CANDIDATE
    // =================================================

    socket.on(
      "webrtc-ice-candidate",
      async (data) => {
        try {
          const peerConnection =
            data?.senderSocketId
              ? createPeerConnection(
                  data.senderSocketId
                )
              : peerConnectionRef.current;

          if (
            peerConnection &&
            data?.candidate
          ) {
            await peerConnection.addIceCandidate(
              new RTCIceCandidate(
                data.candidate
              )
            );
          }
        } catch (err) {
          console.error(
            "❌ ICE candidate error:",
            err
          );
        }
      }
    );


    // =================================================
    // CLEANUP
    // =================================================

    return () => {
      console.log(
        "🧹 Cleaning Live Class Socket"
      );

      socket.emit(
        "leave-live-class",
        {
          liveClassId:
            numericLiveClassId,
        }
      );

      socket.disconnect();

      if (
        socketRef.current === socket
      ) {
        socketRef.current = null;
      }
    };

  }, [
    liveClassId,
    numericLiveClassId,
    isValidLiveClassId,
  ]);


  // =====================================================
  // SCROLL CHAT
  // =====================================================

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);


  // =====================================================
  // START CLASS
  // =====================================================

  const handleStartClass = async () => {
    if (!isValidLiveClassId) {
      return;
    }

    try {
      setStarting(true);

      await startCameraAndMicrophone();

      await startLiveClass(
        numericLiveClassId
      );

      setIsLive(true);

      socketRef.current?.emit(
        "live-class-started",
        {
          liveClassId:
            numericLiveClassId,
        }
      );

    } catch (err) {
      console.error(
        "❌ Start Live Class Error:",
        err
      );

      setError(
        err?.response?.data?.message ||
        err?.message ||
        "Unable to start live class"
      );

    } finally {
      setStarting(false);
    }
  };


  // =====================================================
  // END CLASS
  // =====================================================

  const handleEndClass = async () => {
    if (!isValidLiveClassId) {
      return;
    }

    try {
      setEnding(true);

      await endLiveClass(
        numericLiveClassId
      );

      setIsLive(false);

      socketRef.current?.emit(
        "live-class-ended",
        {
          liveClassId:
            numericLiveClassId,
        }
      );

    } catch (err) {
      console.error(
        "❌ End Live Class Error:",
        err
      );

      setError(
        err?.response?.data?.message ||
        err?.message ||
        "Unable to end live class"
      );

    } finally {
      setEnding(false);
    }
  };


  // =====================================================
  // CAMERA TOGGLE
  // =====================================================

  const toggleCamera = async () => {
    if (!localStreamRef.current) {
      await startCameraAndMicrophone();
      return;
    }

    const videoTracks =
      localStreamRef.current.getVideoTracks();

    if (!videoTracks.length) {
      return;
    }

    const enabled =
      !videoTracks[0].enabled;

    videoTracks.forEach(
      (track) => {
        track.enabled =
          enabled;
      }
    );

    setIsCameraOn(enabled);
  };


  // =====================================================
  // MICROPHONE TOGGLE
  // =====================================================

  const toggleMicrophone = async () => {
    if (!localStreamRef.current) {
      await startCameraAndMicrophone();
      return;
    }

    const audioTracks =
      localStreamRef.current.getAudioTracks();

    if (!audioTracks.length) {
      return;
    }

    const enabled =
      !audioTracks[0].enabled;

    audioTracks.forEach(
      (track) => {
        track.enabled =
          enabled;
      }
    );

    setIsMicOn(enabled);
  };


  // =====================================================
  // SCREEN SHARE
  // =====================================================

  const toggleScreenShare =
    async () => {
      try {
        if (
          isScreenSharing
        ) {
          stopScreenShare();
          return;
        }

        const screenStream =
          await navigator.mediaDevices.getDisplayMedia(
            {
              video: true,
            }
          );

        screenStreamRef.current =
          screenStream;

        const screenTrack =
          screenStream.getVideoTracks()[0];

        if (
          localVideoRef.current
        ) {
          localVideoRef.current.srcObject =
            screenStream;
        }

        const activePeerConnection =
          getActivePeerConnection();

        if (activePeerConnection) {
          const sender =
            activePeerConnection
              .getSenders()
              .find(
                (item) =>
                  item.track?.kind ===
                  "video"
              );

          if (sender) {
            await sender.replaceTrack(
              screenTrack
            );
          }
        }

        screenTrack.onended = () => {
          stopScreenShare();
        };

        setIsScreenSharing(true);

      } catch (err) {
        console.error(
          "❌ Screen share error:",
          err
        );
      }
    };


  // =====================================================
  // STOP SCREEN SHARE
  // =====================================================

  const stopScreenShare =
    async () => {
      try {
        screenStreamRef.current
          ?.getTracks()
          .forEach(
            (track) =>
              track.stop()
          );

        screenStreamRef.current =
          null;

        const cameraTrack =
          localStreamRef.current
            ?.getVideoTracks()
            ?. [0];

        const activePeerConnection =
          getActivePeerConnection();

        if (
          cameraTrack &&
          activePeerConnection
        ) {
          const sender =
            activePeerConnection
              .getSenders()
              .find(
                (item) =>
                  item.track?.kind ===
                  "video"
              );

          if (sender) {
            await sender.replaceTrack(
              cameraTrack
            );
          }
        }

        if (
          localVideoRef.current &&
          localStreamRef.current
        ) {
          localVideoRef.current.srcObject =
            localStreamRef.current;
        }

        setIsScreenSharing(false);

      } catch (err) {
        console.error(
          "❌ Stop screen share error:",
          err
        );
      }
    };


  // =====================================================
  // SEND CHAT
  // =====================================================

  const sendMessage = (e) => {
    e?.preventDefault();

    const trimmed =
      message.trim();

    if (!trimmed) {
      return;
    }

    if (
      !socketRef.current ||
      !socketRef.current.connected
    ) {
      console.warn(
        "⚠️ Socket not connected"
      );

      return;
    }

    const user =
      getCurrentUser();

    const chatData = {
      liveClassId:
        numericLiveClassId,

      message: trimmed,

      senderId:
        user?.id || null,

      senderName:
        user?.name ||
        user?.fullName ||
        "User",

      createdAt:
        new Date().toISOString(),
    };

    socketRef.current.emit(
      "chat-message",
      chatData
    );

    setMessage("");
  };


  // =====================================================
  // CLEANUP MEDIA
  // =====================================================

  useEffect(() => {
    return () => {
      console.log(
        "🧹 Cleaning media resources"
      );

      localStreamRef.current
        ?.getTracks()
        .forEach(
          (track) =>
            track.stop()
        );

      screenStreamRef.current
        ?.getTracks()
        .forEach(
          (track) =>
            track.stop()
        );

      peerConnectionRef.current
        ?.close();

      localStreamRef.current =
        null;

      screenStreamRef.current =
        null;

      peerConnectionRef.current =
        null;
    };
  }, []);


  // =====================================================
  // LOADING
  // =====================================================

  if (
    loading &&
    isValidLiveClassId
  ) {
    return (
      <Box
        sx={{
          minHeight:
            "calc(100vh - 80px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Stack
          spacing={2}
          alignItems="center"
        >
          <CircularProgress />

          <Typography
            color="text.secondary"
          >
            Loading live class...
          </Typography>
        </Stack>
      </Box>
    );
  }


  // =====================================================
  // INVALID ID
  // =====================================================

  if (!isValidLiveClassId) {
    return (
      <Box
        sx={{
          p: 4,
        }}
      >
        <Alert
          severity="error"
          sx={{
            mb: 2,
          }}
        >
          Invalid Live Class ID:{" "}
          {liveClassId || "missing"}
        </Alert>

        <Button
          variant="contained"
          startIcon={<ArrowBack />}
          onClick={() =>
            navigate("/dashboard")
          }
        >
          Back to Dashboard
        </Button>
      </Box>
    );
  }


  // =====================================================
  // ERROR
  // =====================================================

  if (
    error &&
    !liveClass
  ) {
    return (
      <Box
        sx={{
          p: 4,
        }}
      >
        <Alert
          severity="error"
          sx={{
            mb: 2,
          }}
        >
          {error}
        </Alert>

        <Button
          variant="contained"
          startIcon={<ArrowBack />}
          onClick={() =>
            navigate(-1)
          }
        >
          Go Back
        </Button>
      </Box>
    );
  }


  // =====================================================
  // MAIN UI
  // =====================================================

  return (
    <Box
      sx={{
        minHeight:
          "calc(100vh - 80px)",
        p: {
          xs: 1.5,
          md: 3,
        },
      }}
    >

      {/* =================================================
          HEADER
      ================================================= */}

      <Paper
        elevation={0}
        sx={{
          p: 2,
          mb: 2,
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <Stack
          direction={{
            xs: "column",
            md: "row",
          }}
          justifyContent="space-between"
          alignItems={{
            xs: "flex-start",
            md: "center",
          }}
          spacing={2}
        >

          <Box>
            <Typography
              variant="h5"
              fontWeight={800}
            >
              {liveClass?.title ||
                "Live Class"}
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mt: 0.5,
              }}
            >
              {liveClass?.description ||
                "Live classroom"}
            </Typography>
          </Box>

          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
          >

            <Chip
              label={
                isLive
                  ? "LIVE"
                  : "Not Live"
              }
              color={
                isLive
                  ? "error"
                  : "default"
              }
              variant={
                isLive
                  ? "filled"
                  : "outlined"
              }
            />

            <Chip
              icon={<People />}
              label={`${participants.length} Participants`}
              variant="outlined"
            />

            <Chip
              label={
                socketConnected
                  ? "Connected"
                  : "Offline"
              }
              color={
                socketConnected
                  ? "success"
                  : "default"
              }
              variant="outlined"
            />

          </Stack>

        </Stack>
      </Paper>


      {error && (
        <Alert
          severity="warning"
          sx={{
            mb: 2,
          }}
        >
          {error}
        </Alert>
      )}


      {/* =================================================
          MAIN CONTENT
      ================================================= */}

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            lg: "minmax(0, 1fr) 340px",
          },
          gap: 2,
        }}
      >

        {/* =================================================
            VIDEO AREA
        ================================================= */}

        <Paper
          elevation={0}
          sx={{
            p: 2,
            borderRadius: 3,
            border: "1px solid",
            borderColor: "divider",
          }}
        >

          <Box
            sx={{
              position: "relative",
              backgroundColor: "black",
              borderRadius: 3,
              overflow: "hidden",
              aspectRatio: "16 / 9",
              width: "100%",
            }}
          >

            {/* REMOTE VIDEO */}

            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                background: "#000",
              }}
            />

            {/* LOCAL VIDEO */}

            <Box
              sx={{
                position: "absolute",
                right: 16,
                bottom: 16,
                width: {
                  xs: 120,
                  sm: 180,
                  md: 220,
                },
                aspectRatio:
                  "16 / 9",
                borderRadius: 2,
                overflow: "hidden",
                backgroundColor:
                  "#111",
                border:
                  "2px solid rgba(255,255,255,0.4)",
                boxShadow:
                  "0 8px 30px rgba(0,0,0,0.5)",
              }}
            >

              <video
                ref={localVideoRef}
                autoPlay
                muted
                playsInline
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />

            </Box>


            {/* NO VIDEO MESSAGE */}

            {!isLive && (
              <Box
                sx={{
                  position:
                    "absolute",
                  inset: 0,
                  display: "flex",
                  alignItems:
                    "center",
                  justifyContent:
                    "center",
                  flexDirection:
                    "column",
                  color: "white",
                  background:
                    "rgba(0,0,0,0.45)",
                  textAlign: "center",
                  p: 3,
                }}
              >
                <Videocam
                  sx={{
                    fontSize: 52,
                    mb: 1,
                  }}
                />

                <Typography
                  variant="h6"
                  fontWeight={700}
                >
                  Live class hasn't started
                </Typography>

                <Typography
                  variant="body2"
                  sx={{
                    mt: 0.5,
                    opacity: 0.8,
                  }}
                >
                  Waiting for the teacher...
                </Typography>
              </Box>
            )}

          </Box>


          {/* =================================================
              CONTROLS
          ================================================= */}

          <Stack
            direction="row"
            justifyContent="center"
            spacing={1}
            sx={{
              mt: 2,
              flexWrap: "wrap",
              gap: 1,
            }}
          >

            {/* CAMERA */}

            <IconButton
              onClick={toggleCamera}
              color={
                isCameraOn
                  ? "primary"
                  : "error"
              }
              sx={{
                border: "1px solid",
                borderColor:
                  "divider",
              }}
            >
              {isCameraOn ? (
                <Videocam />
              ) : (
                <VideocamOff />
              )}
            </IconButton>


            {/* MICROPHONE */}

            <IconButton
              onClick={toggleMicrophone}
              color={
                isMicOn
                  ? "primary"
                  : "error"
              }
              sx={{
                border: "1px solid",
                borderColor:
                  "divider",
              }}
            >
              {isMicOn ? (
                <Mic />
              ) : (
                <MicOff />
              )}
            </IconButton>


            {/* SCREEN SHARE */}

            <IconButton
              onClick={
                toggleScreenShare
              }
              color={
                isScreenSharing
                  ? "success"
                  : "default"
              }
              sx={{
                border: "1px solid",
                borderColor:
                  "divider",
              }}
            >
              {isScreenSharing ? (
                <StopScreenShare />
              ) : (
                <ScreenShare />
              )}
            </IconButton>


            {/* TEACHER START */}

            {isTeacher &&
              !isLive && (
                <Button
                  variant="contained"
                  color="success"
                  disabled={starting}
                  onClick={
                    handleStartClass
                  }
                  sx={{
                    borderRadius: 2,
                    textTransform:
                      "none",
                    fontWeight: 700,
                  }}
                >
                  {starting
                    ? "Starting..."
                    : "Start Class"}
                </Button>
              )}


            {/* TEACHER END */}

            {isTeacher &&
              isLive && (
                <Button
                  variant="contained"
                  color="error"
                  disabled={ending}
                  startIcon={
                    <CallEnd />
                  }
                  onClick={
                    handleEndClass
                  }
                  sx={{
                    borderRadius: 2,
                    textTransform:
                      "none",
                    fontWeight: 700,
                  }}
                >
                  {ending
                    ? "Ending..."
                    : "End Class"}
                </Button>
              )}

          </Stack>

        </Paper>


        {/* =================================================
            CHAT
        ================================================= */}

        <Paper
          elevation={0}
          sx={{
            borderRadius: 3,
            border: "1px solid",
            borderColor: "divider",
            display: "flex",
            flexDirection: "column",
            minHeight: {
              xs: 450,
              lg: 620,
            },
            maxHeight: {
              lg: 700,
            },
          }}
        >

          {/* CHAT HEADER */}

          <Box
            sx={{
              p: 2,
            }}
          >
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
            >
              <Chat />

              <Typography
                variant="h6"
                fontWeight={700}
              >
                Live Chat
              </Typography>
            </Stack>
          </Box>

          <Divider />


          {/* MESSAGES */}

          <Box
            sx={{
              flex: 1,
              overflowY: "auto",
              p: 2,
            }}
          >

            {messages.length === 0 ? (
              <Box
                sx={{
                  height: "100%",
                  display: "flex",
                  alignItems:
                    "center",
                  justifyContent:
                    "center",
                  textAlign: "center",
                }}
              >
                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  No messages yet.
                  <br />
                  Start the conversation.
                </Typography>
              </Box>
            ) : (
              <Stack spacing={1.5}>

                {messages.map(
                  (item, index) => (
                    <Box
                      key={
                        item?.id ||
                        `${index}-${item?.createdAt || ""}`
                      }
                      sx={{
                        p: 1.5,
                        borderRadius: 2,
                        backgroundColor:
                          "action.hover",
                      }}
                    >

                      <Typography
                        variant="caption"
                        fontWeight={700}
                      >
                        {item?.senderName ||
                          "User"}
                      </Typography>

                      <Typography
                        variant="body2"
                        sx={{
                          mt: 0.3,
                          wordBreak:
                            "break-word",
                        }}
                      >
                        {item?.message ||
                          ""}
                      </Typography>

                    </Box>
                  )
                )}

                <div
                  ref={chatEndRef}
                />

              </Stack>
            )}

          </Box>

          {/* CHAT INPUT */}

          <Divider />

          <Box
            component="form"
            onSubmit={sendMessage}
            sx={{
              p: 1.5,
            }}
          >
            <Stack
              direction="row"
              spacing={1}
            >

              <TextField
                fullWidth
                size="small"
                value={message}
                onChange={(e) =>
                  setMessage(
                    e.target.value
                  )
                }
                placeholder="Type a message..."
              />

              <IconButton
                type="submit"
                color="primary"
                disabled={
                  !message.trim() ||
                  !socketConnected
                }
              >
                <Send />
              </IconButton>

            </Stack>
          </Box>

        </Paper>

      </Box>

    </Box>
  );
};

export default LiveClassRoom;

