import { useEffect, useRef, useState } from "react";
import Cropper from "react-easy-crop";
import { useNavigate } from "react-router-dom";

import {
  getProfile,
  updateProfile,
  changePassword,
  uploadProfilePicture,
  removeProfilePicture,
} from "../../services/authService";

import { uploadSignature } from "../../services/signatureService";

import {
  Box,
  Container,
  Paper,
  Typography,
  Avatar,
  Chip,
  Divider,
  CircularProgress,
  Alert,
  Grid,
  IconButton,
  TextField,
  Button,
  InputAdornment,
  Tooltip,
  Dialog,
  DialogContent,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";

import {
  Person,
  Email,
  Badge,
  AccountCircle,
  Edit,
  Check,
  Close,
  Lock,
  Visibility,
  VisibilityOff,
  Security,
  PhotoCamera,
  PhotoLibrary,
  CameraAlt,
  Delete,
  ZoomIn,
  ZoomOut,
  Logout as LogoutIcon,
} from "@mui/icons-material";

function Profile() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // =====================================================
  // PROFILE EDIT
  // =====================================================

  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);

  // =====================================================
  // PROFILE PICTURE
  // =====================================================

  const [uploadingImage, setUploadingImage] = useState(false);
  const [removingImage, setRemovingImage] = useState(false);

  const [profileImageFile, setProfileImageFile] = useState(null);
  const [profileImagePreview, setProfileImagePreview] =
    useState("");

  const [imagePreviewOpen, setImagePreviewOpen] =
    useState(false);

  // =====================================================
  // CROP
  // =====================================================

  const [cropOpen, setCropOpen] = useState(false);

  const [crop, setCrop] = useState({
    x: 0,
    y: 0,
  });

  const [zoom, setZoom] = useState(1);

  const [croppedAreaPixels, setCroppedAreaPixels] =
    useState(null);

  // =====================================================
  // CAMERA
  // =====================================================

  const [cameraOpen, setCameraOpen] = useState(false);
  const [cameraStream, setCameraStream] = useState(null);
  const [cameraReady, setCameraReady] = useState(false);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // =====================================================
  // AVATAR MENU
  // =====================================================

  const [avatarMenuAnchor, setAvatarMenuAnchor] =
    useState(null);

  const fileInputRef = useRef(null);

  // =====================================================
  // CHANGE PASSWORD
  // =====================================================

  const [showChangePassword, setShowChangePassword] =
    useState(false);

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [changingPassword, setChangingPassword] =
    useState(false);

  const [showCurrentPassword, setShowCurrentPassword] =
    useState(false);

  const [showNewPassword, setShowNewPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  // =====================================================
  // TEACHER SIGNATURE
  // =====================================================

  const [signatureFile, setSignatureFile] = useState(null);
  const [signaturePreview, setSignaturePreview] =
    useState("");

  const [uploadingSignature, setUploadingSignature] =
    useState(false);

  // =====================================================
  // LOAD PROFILE
  // =====================================================

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const response = await getProfile();

      const profileUser = response.data;

      setUser(profileUser);
      setName(profileUser.name || "");

      localStorage.setItem(
        "user",
        JSON.stringify(profileUser)
      );
    } catch (error) {
      console.log(error);

      setError("Unable to load profile.");
    } finally {
      setLoading(false);
    }
  };
  
  // =====================================================
  // OBJECT URL + CAMERA CLEANUP
  // =====================================================

  useEffect(() => {
    return () => {
      if (profileImagePreview) {
        URL.revokeObjectURL(profileImagePreview);
      }

      if (signaturePreview) {
        URL.revokeObjectURL(signaturePreview);
      }

      if (cameraStream) {
        cameraStream.getTracks().forEach((track) => {
          track.stop();
        });
      }
    };

    // Cleanup only when component unmounts
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // =====================================================
  // CAMERA STREAM
  // =====================================================

  useEffect(() => {
    if (!cameraOpen || !cameraStream) {
      return;
    }

    let cancelled = false;
    let animationFrame;

    const attachCamera = () => {
      if (cancelled) {
        return;
      }

      const video = videoRef.current;

      if (!video) {
        animationFrame =
          requestAnimationFrame(attachCamera);

        return;
      }

      video.srcObject = cameraStream;

      const markCameraReady = () => {
        if (!cancelled) {
          setCameraReady(true);
        }
      };

      const startVideo = async () => {
        try {
          await video.play();

          if (
            video.videoWidth > 0 &&
            video.videoHeight > 0
          ) {
            markCameraReady();
          }
        } catch (error) {
          console.error(
            "Video play error:",
            error
          );

          if (
            video.videoWidth > 0 &&
            video.videoHeight > 0
          ) {
            markCameraReady();
          }
        }
      };

      video.onloadedmetadata = startVideo;
      video.oncanplay = markCameraReady;
      video.onplaying = markCameraReady;

      if (
        video.readyState >= 2 &&
        video.videoWidth > 0 &&
        video.videoHeight > 0
      ) {
        startVideo();
      }
    };

    animationFrame =
      requestAnimationFrame(attachCamera);

    return () => {
      cancelled = true;

      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }

      const video = videoRef.current;

      if (video) {
        video.pause();

        video.onloadedmetadata = null;
        video.oncanplay = null;
        video.onplaying = null;

        video.srcObject = null;
      }

      setCameraReady(false);
    };
  }, [cameraOpen, cameraStream]);

  // =====================================================
  // AVATAR MENU
  // =====================================================

  const handleAvatarClick = () => {
    if (uploadingImage || removingImage) {
      return;
    }

    const avatarElement = document.querySelector(
      '[aria-label="Profile avatar"]'
    );

    if (avatarElement) {
      setAvatarMenuAnchor(avatarElement);
    }
  };

  const handleAvatarMenuClose = () => {
    setAvatarMenuAnchor(null);
  };

  // =====================================================
  // CURRENT AVATAR
  // =====================================================

  const currentAvatarSrc =
    profileImagePreview ||
    user?.profileImageUrl ||
    "";

  // =====================================================
  // VIEW PHOTO
  // =====================================================

  const handleViewPhoto = () => {
    handleAvatarMenuClose();

    if (!currentAvatarSrc) {
      return;
    }

    setImagePreviewOpen(true);
  };

  const handleClosePreview = () => {
    setImagePreviewOpen(false);
  };

  // =====================================================
  // UPLOAD PHOTO BUTTON
  // =====================================================

  const handleUploadPhotoClick = () => {
    handleAvatarMenuClose();

    if (uploadingImage || removingImage) {
      return;
    }

    fileInputRef.current?.click();
  };

  // =====================================================
  // TAKE PHOTO
  // =====================================================

  const handleTakePhotoClick = async () => {
    handleAvatarMenuClose();

    try {
      setError("");
      setSuccess("");

      if (!navigator.mediaDevices?.getUserMedia) {
        setError(
          "Camera is not supported by this browser. Please use a modern browser."
        );

        return;
      }

      const stream =
        await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "user",
            width: {
              ideal: 1280,
            },
            height: {
              ideal: 1280,
            },
          },
          audio: false,
        });

      setCameraReady(false);
      setCameraStream(stream);
      setCameraOpen(true);
    } catch (error) {
      console.error(
        "Camera error:",
        error
      );

      if (
        error.name === "NotAllowedError"
      ) {
        setError(
          "Camera permission denied. Please allow camera access and try again."
        );
      } else if (
        error.name === "NotFoundError"
      ) {
        setError(
          "No camera was found on this device."
        );
      } else if (
        error.name === "NotReadableError"
      ) {
        setError(
          "Camera is already being used by another application."
        );
      } else {
        setError(
          "Unable to access camera. Please try again."
        );
      }
    }
  };

  // =====================================================
  // CLOSE CAMERA
  // =====================================================

  const handleCloseCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => {
        track.stop();
      });
    }

    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.srcObject = null;
    }

    setCameraStream(null);
    setCameraOpen(false);
    setCameraReady(false);
  };

  // =====================================================
  // CAPTURE CAMERA PHOTO
  // =====================================================

  const handleCapturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas) {
      return;
    }

    if (
      !cameraReady ||
      !video.videoWidth ||
      !video.videoHeight
    ) {
      setError(
        "Camera is still starting. Please wait a moment and try again."
      );

      return;
    }

    const width = video.videoWidth;
    const height = video.videoHeight;

    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext("2d");

    if (!context) {
      setError("Unable to capture photo.");

      return;
    }

    /*
     * Camera preview is mirrored using scaleX(-1).
     * Mirror canvas again so saved image has
     * normal orientation.
     */

    context.save();

    context.translate(width, 0);
    context.scale(-1, 1);

    context.drawImage(
      video,
      0,
      0,
      width,
      height
    );

    context.restore();

    canvas.toBlob(
      (blob) => {
        if (!blob) {
          setError("Unable to capture photo.");

          return;
        }

        const file = new File(
          [blob],
          "camera-profile-picture.jpg",
          {
            type: "image/jpeg",
          }
        );

        // Stop camera immediately
        if (cameraStream) {
          cameraStream
            .getTracks()
            .forEach((track) => {
              track.stop();
            });
        }

        if (videoRef.current) {
          videoRef.current.pause();
          videoRef.current.srcObject = null;
        }

        setCameraStream(null);
        setCameraOpen(false);
        setCameraReady(false);

        // Create temporary preview
        const previewUrl =
          URL.createObjectURL(file);

        setProfileImageFile(file);
        setProfileImagePreview(previewUrl);

        // Reset crop
        setCrop({
          x: 0,
          y: 0,
        });

        setZoom(1);
        setCroppedAreaPixels(null);

        // Open crop dialog
        setCropOpen(true);
      },
      "image/jpeg",
      0.9
    );
  };

  // =====================================================
  // PROFILE IMAGE SELECT
  // =====================================================

  const handleProfilePictureChange = (
    event
  ) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      setError(
        "Please select a valid image file. JPG, PNG or WEBP only."
      );

      setSuccess("");

      event.target.value = "";

      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setError(
        "Image size must be less than 2 MB."
      );

      setSuccess("");

      event.target.value = "";

      return;
    }

    if (profileImagePreview) {
      URL.revokeObjectURL(
        profileImagePreview
      );
    }

    setError("");
    setSuccess("");

    const previewUrl =
      URL.createObjectURL(file);

    setProfileImageFile(file);
    setProfileImagePreview(previewUrl);

    // Reset crop
    setCrop({
      x: 0,
      y: 0,
    });

    setZoom(1);
    setCroppedAreaPixels(null);

    // Open crop dialog
    setCropOpen(true);

    // Allow selecting same file again
    event.target.value = "";
  };

  // =====================================================
  // CROP COMPLETE
  // =====================================================

  const handleCropComplete = (
    croppedArea,
    croppedAreaPixels
  ) => {
    setCroppedAreaPixels(
      croppedAreaPixels
    );
  };

  // =====================================================
  // CREATE CROPPED IMAGE
  // =====================================================

  const createCroppedImage = async () => {
    if (
      !profileImagePreview ||
      !croppedAreaPixels
    ) {
      return null;
    }

    const image = new Image();

    image.src = profileImagePreview;

    await new Promise(
      (resolve, reject) => {
        image.onload = resolve;
        image.onerror = reject;
      }
    );

    const canvas =
      document.createElement("canvas");

    const size = 400;

    canvas.width = size;
    canvas.height = size;

    const ctx = canvas.getContext("2d");

    if (!ctx) {
      return null;
    }

    ctx.drawImage(
      image,
      croppedAreaPixels.x,
      croppedAreaPixels.y,
      croppedAreaPixels.width,
      croppedAreaPixels.height,
      0,
      0,
      size,
      size
    );

    return new Promise((resolve) => {
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            resolve(null);

            return;
          }

          resolve(
            new File(
              [blob],
              "profile-picture.jpg",
              {
                type: "image/jpeg",
              }
            )
          );
        },
        "image/jpeg",
        0.9
      );
    });
  };

  // =====================================================
  // CROP + UPLOAD
  // =====================================================

  const handleCropAndUpload = async () => {
    if (uploadingImage) {
      return;
    }

    try {
      setUploadingImage(true);

      setError("");
      setSuccess("");

      const croppedFile =
        await createCroppedImage();

      if (!croppedFile) {
        setError(
          "Unable to crop image."
        );

        return;
      }

      const response =
        await uploadProfilePicture(
          croppedFile
        );

      const profileImageUrl =
        response.data.profileImageUrl;

      const profileImagePublicId =
        response.data.profileImagePublicId;

      setUser((previous) => {
        const updatedUser = {
          ...previous,
          profileImageUrl,
          ...(profileImagePublicId && {
            profileImagePublicId,
          }),
        };

        localStorage.setItem(
          "user",
          JSON.stringify(updatedUser)
        );

        window.dispatchEvent(
          new CustomEvent(
            "profileUpdated",
            {
              detail: updatedUser,
            }
          )
        );

        return updatedUser;
      });

      setSuccess(
        "Profile picture updated successfully."
      );

      // Close crop dialog
      setCropOpen(false);

      // Cleanup object URL
      if (profileImagePreview) {
        URL.revokeObjectURL(
          profileImagePreview
        );
      }

      // Reset temporary states
      setProfileImageFile(null);
      setProfileImagePreview("");

      setCroppedAreaPixels(null);

      setCrop({
        x: 0,
        y: 0,
      });

      setZoom(1);
    } catch (error) {
      console.log(error);

      const message =
        error.response?.data?.message;

      setError(
        Array.isArray(message)
          ? message.join(", ")
          : message ||
          "Unable to upload profile picture."
      );
    } finally {
      setUploadingImage(false);
    }
  };

  // =====================================================
  // CANCEL CROP
  // =====================================================

  const handleProfilePictureCancel = () => {
    if (uploadingImage) {
      return;
    }

    if (profileImagePreview) {
      URL.revokeObjectURL(
        profileImagePreview
      );
    }

    setCropOpen(false);

    setProfileImageFile(null);
    setProfileImagePreview("");

    setCroppedAreaPixels(null);

    setCrop({
      x: 0,
      y: 0,
    });

    setZoom(1);

    setError("");
  };

  // =====================================================
  // REMOVE PROFILE PHOTO
  // =====================================================

  const handleRemovePhoto = async () => {
    handleAvatarMenuClose();

    if (
      removingImage ||
      uploadingImage ||
      !user?.profileImageUrl
    ) {
      return;
    }

    try {
      setRemovingImage(true);

      setError("");
      setSuccess("");

      await removeProfilePicture();

      setUser((previous) => {
        const updatedUser = {
          ...previous,
          profileImageUrl: "",
          profileImagePublicId: "",
        };

        localStorage.setItem(
          "user",
          JSON.stringify(updatedUser)
        );

        window.dispatchEvent(
          new CustomEvent(
            "profileUpdated",
            {
              detail: updatedUser,
            }
          )
        );

        return updatedUser;
      });

      setSuccess(
        "Profile picture removed successfully."
      );
    } catch (error) {
      console.log(error);

      const message =
        error.response?.data?.message;

      setError(
        Array.isArray(message)
          ? message.join(", ")
          : message ||
          "Unable to remove profile picture."
      );
    } finally {
      setRemovingImage(false);
    }
  };

  // =====================================================
  // SIGNATURE FILE CHANGE
  // =====================================================

  const handleSignatureChange = (
    event
  ) => {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      setError(
        "Please select JPG, PNG or WEBP signature image."
      );

      setSuccess("");

      event.target.value = "";

      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setError(
        "Signature image must be less than 2 MB."
      );

      setSuccess("");

      event.target.value = "";

      return;
    }

    if (signaturePreview) {
      URL.revokeObjectURL(
        signaturePreview
      );
    }

    setSignatureFile(file);

    setSignaturePreview(
      URL.createObjectURL(file)
    );
  };

  // =====================================================
  // UPLOAD SIGNATURE
  // =====================================================

  const handleSignatureUpload = async () => {
    if (!signatureFile) {
      setError(
        "Please select signature image."
      );

      return;
    }

    try {
      setUploadingSignature(true);

      setError("");
      setSuccess("");

      const response =
        await uploadSignature(
          signatureFile
        );

      const updatedUser = {
        ...user,
        signatureUrl:
          response.signatureUrl,
        signaturePublicId:
          response.signaturePublicId,
      };

      setUser(updatedUser);

      localStorage.setItem(
        "user",
        JSON.stringify(updatedUser)
      );

      setSuccess(
        "Signature uploaded successfully."
      );
    } catch (error) {
      console.log(error);

      setError(
        error.response?.data?.message ||
        "Unable to upload signature."
      );
    } finally {
      setUploadingSignature(false);
    }
  };

  // =====================================================
  // START EDIT
  // =====================================================

  const handleEdit = () => {
    setName(user.name || "");

    setEditing(true);

    setSuccess("");
    setError("");
  };

  // =====================================================
  // CANCEL EDIT
  // =====================================================

  const handleCancel = () => {
    setName(user.name || "");

    setEditing(false);

    setError("");
  };

  // =====================================================
  // SAVE PROFILE
  // =====================================================

  const handleSave = async () => {
    const trimmedName =
      name.trim();

    if (!trimmedName) {
      setError(
        "Name cannot be empty."
      );

      return;
    }

    if (trimmedName.length < 2) {
      setError(
        "Name must contain at least 2 characters."
      );

      return;
    }

    try {
      setSaving(true);

      setError("");
      setSuccess("");

      const response =
        await updateProfile({
          name: trimmedName,
        });

      const updatedUser =
        response.data.user;

      setUser(updatedUser);

      setName(updatedUser.name);

      localStorage.setItem(
        "user",
        JSON.stringify(updatedUser)
      );

      window.dispatchEvent(
        new CustomEvent(
          "profileUpdated",
          {
            detail: updatedUser,
          }
        )
      );

      setEditing(false);

      setSuccess(
        "Profile updated successfully."
      );
    } catch (error) {
      console.log(error);

      const message =
        error.response?.data?.message;

      setError(
        Array.isArray(message)
          ? message.join(", ")
          : message ||
          "Unable to update profile."
      );
    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // OPEN CHANGE PASSWORD
  // =====================================================

  const handleOpenChangePassword = () => {
    setShowChangePassword(true);

    setError("");
    setSuccess("");
  };

  // =====================================================
  // CLOSE CHANGE PASSWORD
  // =====================================================

  const handleCancelChangePassword = () => {
    setShowChangePassword(false);

    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });

    setShowCurrentPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);

    setError("");
  };

  // =====================================================
  // PASSWORD INPUT CHANGE
  // =====================================================

  const handlePasswordChange = (
    event
  ) => {
    const {
      name,
      value,
    } = event.target;

    setPasswordData(
      (previous) => ({
        ...previous,
        [name]: value,
      })
    );

    setError("");
    setSuccess("");
  };

  // =====================================================
  // CHANGE PASSWORD
  // =====================================================

  const handleChangePassword =
    async () => {
      setError("");
      setSuccess("");

      const {
        currentPassword,
        newPassword,
        confirmPassword,
      } = passwordData;

      if (!currentPassword.trim()) {
        setError(
          "Please enter your current password."
        );

        return;
      }

      if (!newPassword.trim()) {
        setError(
          "Please enter a new password."
        );

        return;
      }

      if (newPassword.length < 6) {
        setError(
          "New password must contain at least 6 characters."
        );

        return;
      }

      if (!confirmPassword.trim()) {
        setError(
          "Please confirm your new password."
        );

        return;
      }

      if (
        newPassword !==
        confirmPassword
      ) {
        setError(
          "New password and confirm password do not match."
        );

        return;
      }

      if (
        currentPassword ===
        newPassword
      ) {
        setError(
          "New password must be different from your current password."
        );

        return;
      }

      try {
        setChangingPassword(true);

        await changePassword({
          currentPassword,
          newPassword,
        });

        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });

        setShowCurrentPassword(false);
        setShowNewPassword(false);
        setShowConfirmPassword(false);

        setSuccess(
          "Password changed successfully."
        );
      } catch (error) {
        console.log(error);

        const message =
          error.response?.data?.message;

        setError(
          Array.isArray(message)
            ? message.join(", ")
            : message ||
            "Unable to change password."
        );
      } finally {
        setChangingPassword(false);
      }
    };

  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout = () => {
    handleCloseCamera();

    localStorage.removeItem(
      "access_token"
    );

    localStorage.removeItem(
      "refresh_token"
    );

    localStorage.removeItem("user");

    setUser(null);

    navigate("/login");
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
          backgroundColor:
            "background.default",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // =====================================================
  // ERROR WITHOUT USER
  // =====================================================

  if (error && !user) {
    return (
      <Container
        maxWidth="md"
        sx={{
          mt: 5,
        }}
      >
        <Alert severity="error">
          {error}
        </Alert>
      </Container>
    );
  }

  // =====================================================
  // NO USER
  // =====================================================

  if (!user) {
    return (
      <Container
        maxWidth="md"
        sx={{
          mt: 5,
        }}
      >
        <Alert severity="warning">
          Profile information not available.
        </Alert>
      </Container>
    );
  }

  // =====================================================
  // USER INITIAL
  // =====================================================

  const firstLetter = user.name
    ? user.name
      .charAt(0)
      .toUpperCase()
    : "U";

  const avatarBusy =
    uploadingImage ||
    removingImage;

  return (
    <Box
      sx={{
        minHeight: "80vh",
        backgroundColor:
          "background.default",
        py: {
          xs: 4,
          md: 7,
        },
      }}
    >
      <Container maxWidth="md">

        {/* =====================================================
            PAGE TITLE
        ===================================================== */}

        <Box sx={{ mb: 3 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              color: "text.primary",
              fontSize: {
                xs: "1.8rem",
                sm: "2.125rem",
              },
            }}
          >
            My Profile
          </Typography>

          <Typography
            variant="body1"
            sx={{
              color: "text.secondary",
              mt: 0.5,
            }}
          >
            Manage your LearnHub account and security settings
          </Typography>
        </Box>

        {/* =====================================================
            SUCCESS
        ===================================================== */}

        {success && (
          <Alert
            severity="success"
            sx={{
              mb: 3,
              borderRadius: 2,
            }}
          >
            {success}
          </Alert>
        )}

        {/* =====================================================
            ERROR
        ===================================================== */}

        {error && user && (
          <Alert
            severity="error"
            sx={{
              mb: 3,
              borderRadius: 2,
            }}
          >
            {Array.isArray(error)
              ? error.join(", ")
              : error}
          </Alert>
        )}

        {/* =====================================================
            PROFILE HEADER
        ===================================================== */}

        <Paper
          elevation={0}
          sx={{
            borderRadius: 3,
            border: "1px solid",
            borderColor: "divider",
            overflow: "hidden",
            backgroundColor:
              "background.paper",
          }}
        >
          {/* COVER */}

          <Box
            sx={{
              height: {
                xs: 100,
                sm: 120,
              },
              background:
                "linear-gradient(135deg, #1976d2, #42a5f5)",
            }}
          />

          {/* PROFILE CONTENT */}

          <Box
            sx={{
              position: "relative",
              px: {
                xs: 3,
                sm: 4,
                md: 5,
              },
              pb: 4,
            }}
          >
            {/* EDIT BUTTON */}

            {!editing && (
              <IconButton
                onClick={handleEdit}
                aria-label="Edit profile"
                sx={{
                  position: "absolute",
                  top: 20,
                  right: {
                    xs: 16,
                    sm: 24,
                    md: 32,
                  },
                  backgroundColor:
                    "background.paper",
                  color: "text.primary",
                  border: "1px solid",
                  borderColor: "divider",
                  boxShadow: 1,
                  "&:hover": {
                    backgroundColor:
                      "action.hover",
                  },
                }}
              >
                <Edit fontSize="small" />
              </IconButton>
            )}

            {/* =====================================================
                PROFILE AVATAR
            ===================================================== */}

            <Box
              sx={{
                position: "relative",
                width: {
                  xs: 82,
                  sm: 100,
                },
                height: {
                  xs: 82,
                  sm: 100,
                },
                mt: {
                  xs: -5,
                  sm: -6,
                },
                mb: 2,
              }}
            >
              <Tooltip
                title={
                  currentAvatarSrc
                    ? "Photo options"
                    : "Add profile photo"
                }
              >
                <Avatar
                  src={
                    currentAvatarSrc ||
                    undefined
                  }
                  alt={
                    user.name ||
                    "Profile"
                  }
                  aria-label="Profile avatar"
                  onClick={
                    currentAvatarSrc
                      ? handleAvatarClick
                      : undefined
                  }
                  sx={{
                    width: "100%",
                    height: "100%",
                    border: "5px solid",
                    borderColor:
                      "background.paper",
                    backgroundColor:
                      "primary.main",
                    fontSize: {
                      xs: "2rem",
                      sm: "2.5rem",
                    },
                    fontWeight: 700,
                    cursor:
                      currentAvatarSrc &&
                        !avatarBusy
                        ? "pointer"
                        : "default",
                    opacity:
                      profileImagePreview
                        ? 0.85
                        : 1,
                    transition:
                      "opacity 0.15s ease",

                    "&:hover": {
                      opacity:
                        currentAvatarSrc &&
                          !avatarBusy
                          ? 0.75
                          : 1,
                    },
                  }}
                >
                  {!currentAvatarSrc &&
                    firstLetter}
                </Avatar>
              </Tooltip>

              {/* BUSY INDICATOR */}

              {avatarBusy && (
                <CircularProgress
                  size="100%"
                  thickness={2.5}
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    color:
                      "primary.main",
                    pointerEvents:
                      "none",

                    "& .MuiCircularProgress-circle":
                    {
                      strokeLinecap:
                        "round",
                    },
                  }}
                />
              )}

              {/* HIDDEN FILE INPUT */}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                hidden
                onChange={
                  handleProfilePictureChange
                }
              />

              {/* CAMERA / PHOTO OPTIONS BUTTON */}

              <Tooltip title="Photo options">
                <span>
                  <IconButton
                    onClick={
                      handleAvatarClick
                    }
                    disabled={avatarBusy}
                    aria-label="Change profile picture"
                    sx={{
                      position:
                        "absolute",
                      right: -4,
                      bottom: -4,
                      width: 34,
                      height: 34,
                      backgroundColor:
                        "primary.main",
                      color:
                        "primary.contrastText",
                      border:
                        "3px solid",
                      borderColor:
                        "background.paper",

                      "&:hover": {
                        backgroundColor:
                          "primary.dark",
                      },
                    }}
                  >
                    {avatarBusy ? (
                      <CircularProgress
                        size={17}
                        color="inherit"
                      />
                    ) : (
                      <PhotoCamera
                        sx={{
                          fontSize: 17,
                        }}
                      />
                    )}
                  </IconButton>
                </span>
              </Tooltip>
            </Box>

            {/* NAME */}

            {editing ? (
              <Box
                sx={{
                  maxWidth: 400,
                  mt: 1,
                }}
              >
                <TextField
                  fullWidth
                  label="Full Name"
                  value={name}
                  onChange={(event) =>
                    setName(
                      event.target.value
                    )
                  }
                  autoFocus
                  size="small"
                />

                <Box
                  sx={{
                    display: "flex",
                    gap: 1,
                    mt: 2,
                    flexWrap: "wrap",
                  }}
                >
                  <Button
                    variant="contained"
                    size="small"
                    startIcon={
                      <Check />
                    }
                    onClick={handleSave}
                    disabled={saving}
                  >
                    {saving
                      ? "Saving..."
                      : "Save"}
                  </Button>

                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={
                      <Close />
                    }
                    onClick={
                      handleCancel
                    }
                    disabled={saving}
                  >
                    Cancel
                  </Button>
                </Box>
              </Box>
            ) : (
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,
                  color: "text.primary",
                  fontSize: {
                    xs: "1.3rem",
                    sm: "1.5rem",
                  },
                  pr: {
                    xs: 5,
                    sm: 0,
                  },
                }}
              >
                {user.name}
              </Typography>
            )}

            {/* EMAIL */}

            <Typography
              sx={{
                color: "text.secondary",
                mt: 0.8,
                wordBreak: "break-word",
              }}
            >
              {user.email}
            </Typography>

            {/* ROLE */}

            <Chip
              label={
                user.role
                  ? user.role
                    .charAt(0)
                    .toUpperCase() +
                  user.role.slice(1)
                  : "User"
              }
              color="primary"
              size="small"
              sx={{
                mt: 2,
                fontWeight: 600,
              }}
            />
          </Box>
        </Paper>

        {/* =====================================================
            ACCOUNT INFORMATION
        ===================================================== */}

        <Paper
          elevation={0}
          sx={{
            mt: 3,
            borderRadius: 3,
            border: "1px solid",
            borderColor: "divider",
            backgroundColor:
              "background.paper",
            p: {
              xs: 3,
              sm: 4,
              md: 5,
            },
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              mb: 3,
            }}
          >
            <AccountCircle color="primary" />

            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                color: "text.primary",
              }}
            >
              Account Information
            </Typography>
          </Box>

          <Divider sx={{ mb: 3 }} />

          <Grid container spacing={3}>

            {/* NAME */}

            <Grid
              size={{
                xs: 12,
                sm: 6,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <Person color="primary" />

                <Box sx={{ minWidth: 0 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      color:
                        "text.secondary",
                    }}
                  >
                    Full Name
                  </Typography>

                  <Typography
                    sx={{
                      fontWeight: 600,
                      color:
                        "text.primary",
                      mt: 0.3,
                    }}
                  >
                    {user.name}
                  </Typography>
                </Box>
              </Box>
            </Grid>

            {/* EMAIL */}

            <Grid
              size={{
                xs: 12,
                sm: 6,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <Email color="primary" />

                <Box sx={{ minWidth: 0 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      color:
                        "text.secondary",
                    }}
                  >
                    Email Address
                  </Typography>

                  <Typography
                    sx={{
                      fontWeight: 600,
                      color:
                        "text.primary",
                      mt: 0.3,
                      wordBreak:
                        "break-word",
                    }}
                  >
                    {user.email}
                  </Typography>
                </Box>
              </Box>
            </Grid>

            {/* ROLE */}

            <Grid
              size={{
                xs: 12,
                sm: 6,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <Badge color="primary" />

                <Box>
                  <Typography
                    variant="body2"
                    sx={{
                      color:
                        "text.secondary",
                    }}
                  >
                    Account Role
                  </Typography>

                  <Typography
                    sx={{
                      fontWeight: 600,
                      color:
                        "text.primary",
                      mt: 0.3,
                      textTransform:
                        "capitalize",
                    }}
                  >
                    {user.role}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* =====================================================
            TEACHER SIGNATURE
        ===================================================== */}

        {user.role === "teacher" && (
          <Paper
            elevation={0}
            sx={{
              mt: 3,
              p: {
                xs: 3,
                sm: 4,
              },
              borderRadius: 3,
              border: "1px solid",
              borderColor: "divider",
              backgroundColor:
                "background.paper",
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
              }}
            >
              Teacher Signature
            </Typography>

            <Typography
              variant="body2"
              sx={{
                color:
                  "text.secondary",
                mt: 1,
              }}
            >
              Upload your signature for course certificates.
            </Typography>

            <Box sx={{ mt: 3 }}>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={
                  handleSignatureChange
                }
              />
            </Box>

            {signaturePreview && (
              <Box sx={{ mt: 3 }}>
                <Typography
                  variant="body2"
                  sx={{
                    color:
                      "text.secondary",
                  }}
                >
                  Preview
                </Typography>

                <Box
                  sx={{
                    mt: 1,
                    p: 2,
                    border: "1px dashed",
                    borderColor:
                      "divider",
                    width: "fit-content",
                    borderRadius: 2,
                  }}
                >
                  <img
                    src={signaturePreview}
                    alt="signature"
                    width="220"
                  />
                </Box>
              </Box>
            )}

            <Button
              variant="contained"
              onClick={
                handleSignatureUpload
              }
              disabled={
                uploadingSignature
              }
              sx={{
                mt: 3,
                textTransform:
                  "none",
                borderRadius: 2,
              }}
            >
              {uploadingSignature
                ? "Uploading..."
                : "Upload Signature"}
            </Button>
          </Paper>
        )}

        {/* =====================================================
            SECURITY
        ===================================================== */}

        <Paper
          elevation={0}
          sx={{
            mt: 3,
            borderRadius: 3,
            border: "1px solid",
            borderColor: "divider",
            backgroundColor:
              "background.paper",
            p: {
              xs: 3,
              sm: 4,
              md: 5,
            },
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              mb: 1,
            }}
          >
            <Security color="primary" />

            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                color: "text.primary",
              }}
            >
              Security
            </Typography>
          </Box>

          <Typography
            variant="body2"
            sx={{
              color:
                "text.secondary",
              mb: 3,
            }}
          >
            Keep your account secure by using a strong password.
          </Typography>

          <Divider sx={{ mb: 3 }} />

          {!showChangePassword && (
            <Box
              sx={{
                display: "flex",
                flexDirection: {
                  xs: "column",
                  sm: "row",
                },
                alignItems: {
                  xs: "stretch",
                  sm: "center",
                },
                justifyContent:
                  "space-between",
                gap: 2,
              }}
            >
              <Box>
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: 700,
                    color:
                      "text.primary",
                  }}
                >
                  Password
                </Typography>

                <Typography
                  variant="body2"
                  sx={{
                    color:
                      "text.secondary",
                  }}
                >
                  Update your password to keep your account secure.
                </Typography>
              </Box>

              <Button
                variant="contained"
                startIcon={<Lock />}
                onClick={
                  handleOpenChangePassword
                }
                sx={{
                  alignSelf: {
                    xs: "stretch",
                    sm: "auto",
                  },
                  minWidth: {
                    sm: 170,
                  },
                }}
              >
                Change Password
              </Button>
            </Box>
          )}

          {showChangePassword && (
            <Box>
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 700,
                  color:
                    "text.primary",
                  mb: 0.5,
                }}
              >
                Change Password
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  color:
                    "text.secondary",
                  mb: 3,
                }}
              >
                Enter your current password and choose a new password.
              </Typography>

              <Grid
                container
                spacing={2.5}
              >
                {/* CURRENT PASSWORD */}

                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    label="Current Password"
                    name="currentPassword"
                    type={
                      showCurrentPassword
                        ? "text"
                        : "password"
                    }
                    value={
                      passwordData.currentPassword
                    }
                    onChange={
                      handlePasswordChange
                    }
                    autoComplete="current-password"
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <Lock fontSize="small" />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() =>
                                setShowCurrentPassword(
                                  (previous) =>
                                    !previous
                                )
                              }
                              edge="end"
                              aria-label={
                                showCurrentPassword
                                  ? "Hide password"
                                  : "Show password"
                              }
                            >
                              {showCurrentPassword ? (
                                <VisibilityOff />
                              ) : (
                                <Visibility />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      },
                    }}
                  />
                </Grid>

                {/* NEW PASSWORD */}

                <Grid
                  size={{
                    xs: 12,
                    sm: 6,
                  }}
                >
                  <TextField
                    fullWidth
                    label="New Password"
                    name="newPassword"
                    type={
                      showNewPassword
                        ? "text"
                        : "password"
                    }
                    value={
                      passwordData.newPassword
                    }
                    onChange={
                      handlePasswordChange
                    }
                    autoComplete="new-password"
                    helperText="Minimum 6 characters"
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <Lock fontSize="small" />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() =>
                                setShowNewPassword(
                                  (previous) =>
                                    !previous
                                )
                              }
                              edge="end"
                              aria-label={
                                showNewPassword
                                  ? "Hide password"
                                  : "Show password"
                              }
                            >
                              {showNewPassword ? (
                                <VisibilityOff />
                              ) : (
                                <Visibility />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      },
                    }}
                  />
                </Grid>

                {/* CONFIRM PASSWORD */}

                <Grid
                  size={{
                    xs: 12,
                    sm: 6,
                  }}
                >
                  <TextField
                    fullWidth
                    label="Confirm New Password"
                    name="confirmPassword"
                    type={
                      showConfirmPassword
                        ? "text"
                        : "password"
                    }
                    value={
                      passwordData.confirmPassword
                    }
                    onChange={
                      handlePasswordChange
                    }
                    autoComplete="new-password"
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <Lock fontSize="small" />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() =>
                                setShowConfirmPassword(
                                  (previous) =>
                                    !previous
                                )
                              }
                              edge="end"
                              aria-label={
                                showConfirmPassword
                                  ? "Hide password"
                                  : "Show password"
                              }
                            >
                              {showConfirmPassword ? (
                                <VisibilityOff />
                              ) : (
                                <Visibility />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      },
                    }}
                  />
                </Grid>
              </Grid>

              {/* BUTTONS */}

              <Box
                sx={{
                  display: "flex",
                  justifyContent: {
                    xs: "stretch",
                    sm: "flex-end",
                  },
                  flexDirection: {
                    xs: "column-reverse",
                    sm: "row",
                  },
                  gap: 1.5,
                  mt: 3,
                }}
              >
                <Button
                  variant="outlined"
                  startIcon={<Close />}
                  onClick={
                    handleCancelChangePassword
                  }
                  disabled={
                    changingPassword
                  }
                  sx={{
                    width: {
                      xs: "100%",
                      sm: "auto",
                    },
                  }}
                >
                  Cancel
                </Button>

                <Button
                  variant="contained"
                  startIcon={<Lock />}
                  onClick={
                    handleChangePassword
                  }
                  disabled={
                    changingPassword
                  }
                  sx={{
                    width: {
                      xs: "100%",
                      sm: "auto",
                    },
                  }}
                >
                  {changingPassword
                    ? "Changing Password..."
                    : "Change Password"}
                </Button>
              </Box>
            </Box>
          )}
        </Paper>

        {/* =====================================================
            ACCOUNT ACTIONS
        ===================================================== */}

        <Paper
          elevation={0}
          sx={{
            mt: 3,
            borderRadius: 3,
            border: "1px solid",
            borderColor: "divider",
            backgroundColor:
              "background.paper",
            p: {
              xs: 3,
              sm: 4,
              md: 5,
            },
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              mb: 1,
            }}
          >
            <LogoutIcon color="error" />

            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                color:
                  "text.primary",
              }}
            >
              Account Actions
            </Typography>
          </Box>

          <Typography
            variant="body2"
            sx={{
              color:
                "text.secondary",
              mb: 3,
            }}
          >
            Manage your account session.
          </Typography>

          <Divider sx={{ mb: 3 }} />

          <Box
            sx={{
              display: "flex",
              flexDirection: {
                xs: "column",
                sm: "row",
              },
              alignItems: {
                xs: "stretch",
                sm: "center",
              },
              justifyContent:
                "space-between",
              gap: 2,
            }}
          >
            <Box>
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 700,
                  color:
                    "text.primary",
                }}
              >
                Logout
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  color:
                    "text.secondary",
                }}
              >
                Sign out of your LearnHub account on this device.
              </Typography>
            </Box>

            <Button
              variant="outlined"
              color="error"
              startIcon={
                <LogoutIcon />
              }
              onClick={handleLogout}
              sx={{
                alignSelf: {
                  xs: "stretch",
                  sm: "auto",
                },
                minWidth: {
                  sm: 150,
                },
                textTransform:
                  "none",
                fontWeight: 600,
              }}
            >
              Logout
            </Button>
          </Box>
        </Paper>
      </Container>

      {/* =====================================================
          AVATAR PHOTO OPTIONS MENU
          WHATSAPP-STYLE COMPACT MENU
      ===================================================== */}

      <Menu
        anchorEl={avatarMenuAnchor}
        open={Boolean(
          avatarMenuAnchor
        )}
        onClose={
          handleAvatarMenuClose
        }
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        PaperProps={{
          sx: {
            mt: 1,
            minWidth: 210,
            p: 0.5,
            borderRadius: 3,
            border: "1px solid",
            borderColor: "divider",
            boxShadow:
              "0 8px 30px rgba(0,0,0,0.14)",
          },
        }}
      >
        {/* =====================================================
            VIEW PHOTO
        ===================================================== */}

        <MenuItem
          onClick={handleViewPhoto}
          disabled={!currentAvatarSrc}
          sx={{
            borderRadius: 2,
            px: 1.5,
            py: 1,
            minHeight: 44,
          }}
        >
          <ListItemIcon
            sx={{
              minWidth: 38,
            }}
          >
            <Visibility
              fontSize="small"
            />
          </ListItemIcon>

          <ListItemText
            primary="View photo"
            primaryTypographyProps={{
              fontSize: "0.95rem",
              fontWeight: 500,
            }}
          />
        </MenuItem>

        {/* =====================================================
            TAKE PHOTO
        ===================================================== */}

        <MenuItem
          onClick={
            handleTakePhotoClick
          }
          disabled={avatarBusy}
          sx={{
            borderRadius: 2,
            px: 1.5,
            py: 1,
            minHeight: 44,
          }}
        >
          <ListItemIcon
            sx={{
              minWidth: 38,
            }}
          >
            <CameraAlt
              fontSize="small"
            />
          </ListItemIcon>

          <ListItemText
            primary="Take photo"
            primaryTypographyProps={{
              fontSize: "0.95rem",
              fontWeight: 500,
            }}
          />
        </MenuItem>

        {/* =====================================================
            UPLOAD PHOTO
        ===================================================== */}

        <MenuItem
          onClick={
            handleUploadPhotoClick
          }
          disabled={avatarBusy}
          sx={{
            borderRadius: 2,
            px: 1.5,
            py: 1,
            minHeight: 44,
          }}
        >
          <ListItemIcon
            sx={{
              minWidth: 38,
            }}
          >
            <PhotoLibrary
              fontSize="small"
            />
          </ListItemIcon>

          <ListItemText
            primary="Upload photo"
            primaryTypographyProps={{
              fontSize: "0.95rem",
              fontWeight: 500,
            }}
          />
        </MenuItem>

        <Divider
          sx={{
            my: 0.5,
          }}
        />

        {/* =====================================================
            REMOVE PHOTO
        ===================================================== */}

        <MenuItem
          onClick={
            handleRemovePhoto
          }
          disabled={
            !user?.profileImageUrl ||
            removingImage ||
            uploadingImage
          }
          sx={{
            borderRadius: 2,
            px: 1.5,
            py: 1,
            minHeight: 44,
            color: "text.primary",

            "&:hover": {
              color: "error.main",

              backgroundColor:
                (theme) =>
                  theme.palette
                    .mode === "dark"
                    ? "rgba(244,67,54,0.15)"
                    : "rgba(244,67,54,0.08)",
            },
          }}
        >
          <ListItemIcon
            sx={{
              minWidth: 38,
            }}
          >
            {removingImage ? (
              <CircularProgress
                size={17}
                sx={{
                  color: "inherit",
                }}
              />
            ) : (
              <Delete
                fontSize="small"
                sx={{
                  color: "inherit",
                }}
              />
            )}
          </ListItemIcon>

          <ListItemText
            primary={
              removingImage
                ? "Removing..."
                : "Remove photo"
            }
            primaryTypographyProps={{
              fontSize: "0.95rem",
              fontWeight: 500,
            }}
          />
        </MenuItem>
      </Menu>

      {/* =====================================================
          WHATSAPP-STYLE CAMERA DIALOG
      ===================================================== */}

      <Dialog
        open={cameraOpen}
        onClose={handleCloseCamera}
        maxWidth="sm"
        fullWidth
        aria-labelledby="camera-dialog-title"
        PaperProps={{
          sx: {
            width: {
              xs: "92vw",
              sm: 430,
            },
            maxWidth: 430,
            m: 2,
            borderRadius: {
              xs: 3,
              sm: 4,
            },
            overflow: "hidden",
            bgcolor: "#000",
            boxShadow:
              "0 24px 80px rgba(0,0,0,0.55)",
          },
        }}
        slotProps={{
          backdrop: {
            sx: {
              backgroundColor:
                "rgba(0,0,0,0.72)",
              backdropFilter:
                "blur(5px)",
            },
          },
        }}
      >
        {/* CAMERA HEADER */}

        <Box
          sx={{
            height: 58,
            px: 1.5,
            display: "flex",
            alignItems: "center",
            justifyContent:
              "space-between",
            bgcolor: "#111",
            color: "#fff",
            borderBottom:
              "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <IconButton
            onClick={
              handleCloseCamera
            }
            aria-label="Close camera"
            sx={{
              width: 42,
              height: 42,
              color: "#fff",

              "&:hover": {
                bgcolor:
                  "rgba(255,255,255,0.1)",
              },
            }}
          >
            <Close />
          </IconButton>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <CameraAlt
              sx={{
                fontSize: 21,
                color: "#fff",
              }}
            />

            <Typography
              id="camera-dialog-title"
              sx={{
                fontSize: "1rem",
                fontWeight: 600,
                color: "#fff",
              }}
            >
              Take Photo
            </Typography>
          </Box>

          <Box
            sx={{
              width: 42,
              height: 42,
            }}
          />
        </Box>

        {/* CAMERA PREVIEW */}

        <Box
          sx={{
            position: "relative",
            width: "100%",
            aspectRatio: "1 / 1",
            bgcolor: "#000",
            overflow: "hidden",
          }}
        >
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transform: "scaleX(-1)",
              display: "block",
            }}
          />

          {/* TOP GRADIENT */}

          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "30%",
              pointerEvents: "none",
              background:
                "linear-gradient(to bottom, rgba(0,0,0,0.45), transparent)",
            }}
          />

          {/* BOTTOM GRADIENT */}

          <Box
            sx={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 0,
              height: "38%",
              pointerEvents: "none",
              background:
                "linear-gradient(to top, rgba(0,0,0,0.65), transparent)",
            }}
          />

          {/* FACE GUIDE */}

          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform:
                "translate(-50%, -50%)",
              width: {
                xs: 245,
                sm: 280,
              },
              height: {
                xs: 245,
                sm: 280,
              },
              borderRadius: "50%",
              border:
                "2px solid rgba(255,255,255,0.9)",
              boxShadow:
                "0 0 0 9999px rgba(0,0,0,0.32)",
              pointerEvents: "none",
            }}
          />

          {/* INSTRUCTION */}

          <Box
            sx={{
              position: "absolute",
              top: 18,
              left: "50%",
              transform:
                "translateX(-50%)",
              px: 2,
              py: 0.7,
              borderRadius: 5,
              bgcolor:
                "rgba(0,0,0,0.45)",
              backdropFilter:
                "blur(6px)",
              whiteSpace: "nowrap",
              pointerEvents: "none",
              maxWidth: "90%",
            }}
          >
            <Typography
              sx={{
                color: "#fff",
                fontSize: "0.75rem",
                fontWeight: 500,
                textAlign: "center",
              }}
            >
              Position your face inside the circle
            </Typography>
          </Box>

          {/* CAMERA LOADING */}

          {!cameraReady && (
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent:
                  "center",
                flexDirection:
                  "column",
                gap: 1.5,
                bgcolor:
                  "rgba(0,0,0,0.25)",
                pointerEvents: "none",
              }}
            >
              <CircularProgress
                size={32}
                thickness={3}
                sx={{
                  color: "#fff",
                }}
              />

              <Typography
                sx={{
                  color:
                    "rgba(255,255,255,0.9)",
                  fontSize: "0.8rem",
                  fontWeight: 500,
                }}
              >
                Starting camera...
              </Typography>
            </Box>
          )}

          {/* CAPTURE BUTTON */}

          <Box
            sx={{
              position: "absolute",
              left: "50%",
              bottom: 18,
              transform:
                "translateX(-50%)",
              display: "flex",
              alignItems: "center",
              justifyContent:
                "center",
            }}
          >
            <IconButton
              onClick={
                handleCapturePhoto
              }
              disabled={!cameraReady}
              aria-label="Capture photo"
              sx={{
                width: 72,
                height: 72,
                p: 0,
                bgcolor: "#fff",
                border:
                  "4px solid rgba(255,255,255,0.55)",
                boxShadow:
                  "0 5px 24px rgba(0,0,0,0.5)",

                transition:
                  "transform 0.15s ease, background-color 0.15s ease",

                "&:hover": {
                  bgcolor: "#fff",
                  transform:
                    "scale(1.04)",
                },

                "&:active": {
                  transform:
                    "scale(0.92)",
                },

                "&.Mui-disabled": {
                  bgcolor:
                    "rgba(255,255,255,0.45)",
                  borderColor:
                    "rgba(255,255,255,0.25)",
                },
              }}
            >
              <Box
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: "50%",
                  border:
                    "3px solid #222",
                  bgcolor: "#fff",
                }}
              />
            </IconButton>
          </Box>

          {/* HIDDEN CANVAS */}

          <canvas
            ref={canvasRef}
            style={{
              display: "none",
            }}
          />
        </Box>

        {/* CAMERA FOOTER */}

        <Box
          sx={{
            minHeight: 50,
            px: 2,
            py: 1.2,
            bgcolor: "#111",
            display: "flex",
            alignItems: "center",
            justifyContent:
              "center",
            borderTop:
              "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <Typography
            variant="caption"
            sx={{
              color:
                "rgba(255,255,255,0.65)",
              textAlign: "center",
            }}
          >
            Make sure your face and hair are clearly visible
          </Typography>
        </Box>
      </Dialog>

      {/* =====================================================
          WHATSAPP-STYLE CROP DIALOG
      ===================================================== */}

      <Dialog
        open={cropOpen}
        onClose={() => {
          if (!uploadingImage) {
            handleProfilePictureCancel();
          }
        }}
        maxWidth={false}
        fullWidth={false}
        aria-labelledby="crop-dialog-title"
        PaperProps={{
          sx: {
            width: {
              xs: "calc(100vw - 24px)",
              sm: "720px", 
            },
            maxWidth: {
              xs: "calc(100vw - 24px)", 
              sm: "720px", 
            },
            minWidth: 0,
            m: {
              xs: 1,
              sm: 2,
            },
            borderRadius: {
              xs: 2,
              sm: 3,
            },
            overflow: "hidden",
            bgcolor: "#fff",
            boxShadow: "0 20px 60px rgba(0,0,0,0.35)",
          },
        }}
        slotProps={{
          backdrop: {
            sx: {
              backgroundColor: "rgba(0,0,0,0.45)",
            },
          },
        }}
      >  
        {/* =====================================================
            CROP HEADER
        ===================================================== */}

        <Box
          sx={{
            height: 54,
            px: 1,
            display: "flex",
            alignItems: "center",
            justifyContent:
              "space-between",
            bgcolor: "#fff",
            borderBottom: "1px solid",
            borderColor: "#eeeeee",
          }}
        >
          {/* CLOSE */}

          <IconButton
            onClick={
              handleProfilePictureCancel
            }
            disabled={uploadingImage}
            aria-label="Close crop dialog"
            sx={{
              width: 42,
              height: 42,
              color: "#444",

              "&:hover": {
                bgcolor: "#f5f5f5",
              },
            }}
          >
            <Close />
          </IconButton>

          {/* TITLE */}

          <Typography
            sx={{
              flex: 1,
              px: 1,
              fontSize: {
                xs: "0.95rem",
                sm: "1rem",
              },
              fontWeight: 500,
              color: "#222",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            Drag the image to adjust
          </Typography>

          {/* UPLOAD */}

          <Button
            onClick={
              handleCropAndUpload
            }
            disabled={
              uploadingImage ||
              !croppedAreaPixels
            }
            sx={{
              minWidth: "auto",
              px: 1.5,
              height: 42,
              color: "#222",
              fontSize: {
                xs: "0.9rem",
                sm: "0.95rem",
              },
              fontWeight: 500,
              textTransform: "none",

              "&:hover": {
                bgcolor: "#f5f5f5",
              },
            }}
          >
            {uploadingImage
              ? "Uploading..."
              : "Upload"}
          </Button>
        </Box>

        {/* =====================================================
            CROP AREA
        ===================================================== */}

        <Box
          sx={{
            position: "relative",
            width: "100%",
            height: {
              xs: "calc(100vw - 24px)",
              sm: "380px",
            },
            // maxHeight: {
            //   xs: "calc(100vw - 24px)",
            //   sm: "380px",
            // },
            bgcolor: "#858585",
            overflow: "hidden",
          }}
        >
          {/* CROP IMAGE */}

          {profileImagePreview && (
            <Cropper
              image={
                profileImagePreview
              }
              crop={crop}
              zoom={zoom}
              aspect={1}
              cropShape="round"
              showGrid={false}
              restrictPosition
              minZoom={1}
              maxZoom={3}
              onCropChange={
                setCrop
              }
              onZoomChange={
                setZoom
              }
              onCropComplete={
                handleCropComplete
              }
              style={{
                containerStyle: {
                  width: "100%",
                  height: "100%",
                  backgroundColor:
                    "#858585",
                },

                // mediaStyle: {
                //   maxWidth: "none",
                // },

                cropAreaStyle: {
                  border:
                    "2px solid rgba(255,255,255,0.95)",
                  boxShadow:
                    "0 0 0 9999px rgba(0,0,0,0.28)",
                },
              }}
            />
          )}

          {/* =====================================================
              ZOOM CONTROLS
          ===================================================== */}

          <Box
            sx={{
              position: "absolute",
              right: {   xs: 12, sm: 16,  },
              top: "50%",
              transform:
                "translateY(-50%)",
              display: "flex",
              flexDirection:
                "column",
              bgcolor: "#fff",
              borderRadius: 2,
              overflow: "hidden",
              boxShadow:
                "0 3px 12px rgba(0,0,0,0.25)",
              zIndex: 10,
            }}
          >
            {/* ZOOM IN */}

            <IconButton
              onClick={() =>
                setZoom(
                  (previous) =>
                    Math.min(
                      3,
                      Number(
                        (
                          previous +
                          0.1
                        ).toFixed(1)
                      )
                    )
                )
              }
              disabled={
                uploadingImage ||
                zoom >= 3
              }
              aria-label="Zoom in"
              sx={{
                width: 42,
                height: 42,
                borderRadius: 0,
                color: "#555",

                "&:hover": {
                  bgcolor:
                    "#f5f5f5",
                },
              }}
            >
              <ZoomIn />
            </IconButton>

            <Divider />

            {/* ZOOM OUT */}

            <IconButton
              onClick={() =>
                setZoom(
                  (previous) =>
                    Math.max(
                      1,
                      Number(
                        (
                          previous -
                          0.1
                        ).toFixed(1)
                      )
                    )
                )
              }
              disabled={
                uploadingImage ||
                zoom <= 1
              }
              aria-label="Zoom out"
              sx={{
                width: 42,
                height: 42,
                borderRadius: 0,
                color: "#555",

                "&:hover": {
                  bgcolor:
                    "#f5f5f5",
                },
              }}
            >
              <ZoomOut />
            </IconButton>
          </Box>

          {/* =====================================================
              GREEN CHECK BUTTON
          ===================================================== */}

          <Box
            sx={{
              position: "absolute",
              right: {
                xs: 14,
                sm: 18,
              },
              bottom: {
                xs: 14,
                sm: 18,
              },
              zIndex: 20,
            }}
          >
            <IconButton
              onClick={
                handleCropAndUpload
              }
              disabled={
                uploadingImage ||
                !croppedAreaPixels
              }
              aria-label="Upload cropped photo"
              sx={{
                width: {
                  xs: 58,
                  sm: 68,
                },
                height: {
                  xs: 58,
                  sm: 68,
                },
                bgcolor: "#20b968",
                color: "#fff",
                boxShadow:
                  "0 4px 15px rgba(0,0,0,0.3)",

                "&:hover": {
                  bgcolor: "#18a85d",
                },

                "&:active": {
                  transform:
                    "scale(0.94)",
                },

                "&.Mui-disabled": {
                  bgcolor:
                    "#9e9e9e",
                  color: "#fff",
                },

                transition:
                  "transform 0.15s ease, background-color 0.15s ease",
              }}
            >
              {uploadingImage ? (
                <CircularProgress
                  size={28}
                  thickness={3}
                  sx={{
                    color: "#fff",
                  }}
                />
              ) : (
                <Check
                  sx={{
                    fontSize: {
                      xs: 30,
                      sm: 34,
                    },
                    fontWeight: 700,
                  }}
                />
              )}
            </IconButton>
          </Box>
        </Box>
      </Dialog>

      {/* =====================================================
          FULL-SIZE PHOTO PREVIEW
      ===================================================== */}

      <Dialog
        open={imagePreviewOpen}
        onClose={
          handleClosePreview
        }
        maxWidth="xs"
        fullWidth
      >
        <DialogContent
          sx={{
            display: "flex",
            justifyContent:
              "center",
            alignItems: "center",
            position: "relative",
            p: 0,
            backgroundColor:
              "#000",
          }}
        >
          <IconButton
            onClick={
              handleClosePreview
            }
            aria-label="Close preview"
            sx={{
              position:
                "absolute",
              top: 8,
              right: 8,
              zIndex: 2,
              backgroundColor:
                "rgba(0,0,0,0.5)",
              color: "#fff",

              "&:hover": {
                backgroundColor:
                  "rgba(0,0,0,0.7)",
              },
            }}
          >
            <Close />
          </IconButton>

          {currentAvatarSrc && (
            <Box
              component="img"
              src={currentAvatarSrc}
              alt={
                user.name ||
                "Profile"
              }
              sx={{
                width: "100%",
                maxHeight: "80vh",
                objectFit:
                  "contain",
                display: "block",
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
}

export default Profile;