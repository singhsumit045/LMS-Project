
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  getProfile,
  updateProfile,
  changePassword,
  uploadProfilePicture,
} from "../../services/authService";

import {
  uploadSignature,
} from "../../services/signatureService";
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
  Logout as LogoutIcon,
} from "@mui/icons-material";

function Profile() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // =========================
  // PROFILE EDIT
  // =========================

  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);

  // =========================
  // PROFILE PICTURE
  // =========================

  const [uploadingImage, setUploadingImage] =
    useState(false);

  const fileInputRef = useRef(null);

  // =========================
  // CHANGE PASSWORD
  // =========================

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

  // =========================
  // TEACHER SIGNATURE
  // =========================

  const [signatureFile, setSignatureFile] =
    useState(null);

  const [signaturePreview, setSignaturePreview] =
    useState("");

  const [uploadingSignature, setUploadingSignature] =
    useState(false);
  // =========================
  // LOAD PROFILE
  // =========================

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

  // =========================
  // PROFILE PICTURE CLICK
  // =========================

  const handleProfilePictureClick = () => {
    fileInputRef.current?.click();
  };

  // =========================
  // PROFILE PICTURE CHANGE
  // =========================

  const handleProfilePictureChange = async (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

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

    // Maximum 2 MB
    if (file.size > 2 * 1024 * 1024) {
      setError(
        "Image size must be less than 2 MB."
      );

      setSuccess("");

      event.target.value = "";

      return;
    }

    try {
      setUploadingImage(true);

      setError("");
      setSuccess("");

      const response =
        await uploadProfilePicture(file);

      const profileImageUrl =
        response.data.profileImageUrl;

      setUser((previous) => {
        const updatedUser = {
          ...previous,
          profileImageUrl,
        };

        localStorage.setItem(
          "user",
          JSON.stringify(updatedUser)
        );

        window.dispatchEvent(
          new CustomEvent("profileUpdated", {
            detail: updatedUser,
          })
        );

        return updatedUser;
      });

      setSuccess(
        "Profile picture updated successfully."
      );
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

      // Allow selecting same image again
      event.target.value = "";
    }
  };


  // =========================
  // SIGNATURE FILE CHANGE
  // =========================

  const handleSignatureChange = (event) => {

    const file =
      event.target.files?.[0];

    if (!file) return;


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


    setSignatureFile(file);


    setSignaturePreview(
      URL.createObjectURL(file)
    );


  };





  // =========================
  // UPLOAD SIGNATURE
  // =========================

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

  // =========================
  // START EDIT
  // =========================

  const handleEdit = () => {
    setName(user.name || "");

    setEditing(true);

    setSuccess("");
    setError("");
  };

  // =========================
  // CANCEL EDIT
  // =========================

  const handleCancel = () => {
    setName(user.name || "");

    setEditing(false);

    setError("");
  };

  // =========================
  // SAVE PROFILE
  // =========================

  const handleSave = async () => {
    const trimmedName = name.trim();

    if (!trimmedName) {
      setError("Name cannot be empty.");

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

      const response = await updateProfile({
        name: trimmedName,
      });

      const updatedUser = response.data.user;

      setUser(updatedUser);

      setName(updatedUser.name);

      localStorage.setItem(
        "user",
        JSON.stringify(updatedUser)
      );

      window.dispatchEvent(
        new CustomEvent("profileUpdated", {
          detail: updatedUser,
        })
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

  // =========================
  // OPEN CHANGE PASSWORD
  // =========================

  const handleOpenChangePassword = () => {
    setShowChangePassword(true);

    setError("");
    setSuccess("");
  };

  // =========================
  // CLOSE CHANGE PASSWORD
  // =========================

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

  // =========================
  // PASSWORD INPUT CHANGE
  // =========================

  const handlePasswordChange = (event) => {
    const { name, value } = event.target;

    setPasswordData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  // =========================
  // CHANGE PASSWORD
  // =========================

  const handleChangePassword = async () => {
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

    if (newPassword !== confirmPassword) {
      setError(
        "New password and confirm password do not match."
      );

      return;
    }

    if (currentPassword === newPassword) {
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

  // =========================
  // LOGOUT
  // =========================

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");

    setUser(null);

    navigate("/login");
  };

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "70vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "background.default",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // =========================
  // ERROR WITHOUT USER
  // =========================

  if (error && !user) {
    return (
      <Container
        maxWidth="md"
        sx={{ mt: 5 }}
      >
        <Alert severity="error">
          {error}
        </Alert>
      </Container>
    );
  }

  // =========================
  // NO USER
  // =========================

  if (!user) {
    return (
      <Container
        maxWidth="md"
        sx={{ mt: 5 }}
      >
        <Alert severity="warning">
          Profile information not available.
        </Alert>
      </Container>
    );
  }

  // =========================
  // USER INITIAL
  // =========================

  const firstLetter = user.name
    ? user.name.charAt(0).toUpperCase()
    : "U";

  return (
    <Box
      sx={{
        minHeight: "80vh",
        backgroundColor: "background.default",

        py: {
          xs: 4,
          md: 7,
        },
      }}
    >
      <Container maxWidth="md">

        {/* =========================
            PAGE TITLE
        ========================= */}

        <Box sx={{ mb: 3 }}>
          <Typography
            variant="h4"
            fontWeight={700}
            color="text.primary"
            sx={{
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
            color="text.secondary"
            sx={{ mt: 0.5 }}
          >
            Manage your LearnHub account and security settings
          </Typography>
        </Box>

        {/* =========================
            SUCCESS MESSAGE
        ========================= */}

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

        {/* =========================
            ERROR MESSAGE
        ========================= */}

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

        {/* =========================
            PROFILE HEADER
        ========================= */}

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

            {/* =========================
                PROFILE AVATAR
            ========================= */}

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
              <Avatar
                src={
                  user.profileImageUrl ||
                  undefined
                }
                alt={
                  user.name || "Profile"
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
                }}
              >
                {!user.profileImageUrl &&
                  firstLetter}
              </Avatar>

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

              {/* CAMERA BUTTON */}

              <Tooltip title="Change profile picture">
                <span>
                  <IconButton
                    onClick={
                      handleProfilePictureClick
                    }
                    disabled={
                      uploadingImage
                    }
                    aria-label="Change profile picture"
                    sx={{
                      position: "absolute",

                      right: -4,
                      bottom: -4,

                      width: 34,
                      height: 34,

                      backgroundColor:
                        "primary.main",

                      color:
                        "primary.contrastText",

                      border: "3px solid",
                      borderColor:
                        "background.paper",

                      "&:hover": {
                        backgroundColor:
                          "primary.dark",
                      },
                    }}
                  >
                    {uploadingImage ? (
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

            {/* CHANGE PHOTO BUTTON */}

            <Button
              variant="outlined"
              size="small"
              startIcon={<PhotoCamera />}
              onClick={
                handleProfilePictureClick
              }
              disabled={uploadingImage}
              sx={{
                mb: 2,
                textTransform: "none",
                borderRadius: 2,
              }}
            >
              {uploadingImage
                ? "Uploading..."
                : "Change Photo"}
            </Button>

            {/* =========================
                NAME
            ========================= */}

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
                    startIcon={<Check />}
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
                    startIcon={<Close />}
                    onClick={handleCancel}
                    disabled={saving}
                  >
                    Cancel
                  </Button>
                </Box>
              </Box>
            ) : (
              <Typography
                variant="h5"
                fontWeight={700}
                color="text.primary"
                sx={{
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
              color="text.secondary"
              sx={{
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

        {/* =========================
            ACCOUNT INFORMATION
        ========================= */}

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
              fontWeight={700}
              color="text.primary"
            >
              Account Information
            </Typography>
          </Box>

          <Divider sx={{ mb: 3 }} />

          <Grid container spacing={3}>

            {/* NAME */}

            <Grid size={{ xs: 12, sm: 6 }}>
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
                    color="text.secondary"
                  >
                    Full Name
                  </Typography>

                  <Typography
                    fontWeight={600}
                    color="text.primary"
                    sx={{ mt: 0.3 }}
                  >
                    {user.name}
                  </Typography>
                </Box>
              </Box>
            </Grid>

            {/* EMAIL */}

            <Grid size={{ xs: 12, sm: 6 }}>
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
                    color="text.secondary"
                  >
                    Email Address
                  </Typography>

                  <Typography
                    fontWeight={600}
                    color="text.primary"
                    sx={{
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

            <Grid size={{ xs: 12, sm: 6 }}>
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
                    color="text.secondary"
                  >
                    Account Role
                  </Typography>

                  <Typography
                    fontWeight={600}
                    color="text.primary"
                    sx={{
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


        {/* =========================
    TEACHER SIGNATURE
========================= */}

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
              backgroundColor: "background.paper",
            }}
          >


            <Typography
              variant="h6"
              fontWeight={700}
            >
              Teacher Signature
            </Typography>


            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mt: 1,
              }}
            >
              Upload your signature for course certificates.
            </Typography>



            <Box mt={3}>

              <input

                type="file"

                accept="image/jpeg,image/png,image/webp"

                onChange={handleSignatureChange}

              />

            </Box>





            {signaturePreview && (

              <Box
                mt={3}
              >

                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  Preview
                </Typography>


                <Box
                  mt={1}
                  sx={{
                    p: 2,
                    border: "1px dashed",
                    borderColor: "divider",
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

                textTransform: "none",

                borderRadius: 2,
              }}
            >
              {
                uploadingSignature

                  ?
                  "Uploading..."

                  :
                  "Upload Signature"
              }
            </Button>
          </Paper>
        )}
        {/* =========================
            SECURITY
        ========================= */}

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

          {/* SECURITY HEADER */}

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
              fontWeight={700}
              color="text.primary"
            >
              Security
            </Typography>
          </Box>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 3 }}
          >
            Keep your account secure by using a
            strong password.
          </Typography>

          <Divider sx={{ mb: 3 }} />

          {/* =========================
              CHANGE PASSWORD BUTTON
          ========================= */}

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
                  fontWeight={700}
                  color="text.primary"
                >
                  Password
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  Update your password to keep
                  your account secure.
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

          {/* =========================
              CHANGE PASSWORD FORM
          ========================= */}

          {showChangePassword && (
            <Box>
              <Typography
                variant="subtitle1"
                fontWeight={700}
                color="text.primary"
                sx={{ mb: 0.5 }}
              >
                Change Password
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mb: 3 }}
              >
                Enter your current password and
                choose a new password.
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

        {/* =========================
            ACCOUNT ACTIONS
        ========================= */}

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
          {/* HEADER */}

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
              fontWeight={700}
              color="text.primary"
            >
              Account Actions
            </Typography>
          </Box>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 3 }}
          >
            Manage your account session.
          </Typography>

          <Divider sx={{ mb: 3 }} />

          {/* LOGOUT */}

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
                fontWeight={700}
                color="text.primary"
              >
                Logout
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
              >
                Sign out of your LearnHub account
                on this device.
              </Typography>
            </Box>

            <Button
              variant="outlined"
              color="error"
              startIcon={<LogoutIcon />}
              onClick={handleLogout}
              sx={{
                alignSelf: {
                  xs: "stretch",
                  sm: "auto",
                },

                minWidth: {
                  sm: 150,
                },

                textTransform: "none",
                fontWeight: 600,
              }}
            >
              Logout
            </Button>
          </Box>
        </Paper>

      </Container>
    </Box>
  );
}

export default Profile;

