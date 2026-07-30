
import {
  AppBar,
  Toolbar,
  Button,
  Box,
  IconButton,
  Avatar,
  Tooltip,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
} from "@mui/material";

import {
  DarkMode,
  LightMode,
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  School as SchoolIcon,
  LibraryBooks,
  Add as AddIcon,
  Person,
  Logout as LogoutIcon,
} from "@mui/icons-material";

import { useEffect, useState } from "react";

import { getProfile } from "../services/authService";

import { Link, useNavigate } from "react-router-dom";

import { useTheme } from "@mui/material/styles";

import logo from "../assets/LearnHub.png";

const Navbar = ({ darkMode, toggleTheme }) => {
  const [user, setUser] = useState(null);

  const [mobileMenuOpen, setMobileMenuOpen] =
    useState(false);

  const navigate = useNavigate();

  const theme = useTheme();

  const isMobile = useMediaQuery(
    theme.breakpoints.down("md")
  );

  // =========================
  // LOAD USER FROM LOCALSTORAGE
  // =========================

  useEffect(() => {
    const storedUser =
      localStorage.getItem("user");

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.log(
          "Invalid stored user:",
          error
        );
      }
    }
  }, []);

  // =========================
  // FETCH LATEST PROFILE
  // =========================

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getProfile();

        setUser(response.data);

        localStorage.setItem(
          "user",
          JSON.stringify(response.data)
        );
      } catch (error) {
        console.log(
          "Profile fetch error:",
          error.response?.data ||
            error.message
        );
      }
    };

    const accessToken =
      localStorage.getItem("access_token");

    if (accessToken) {
      fetchProfile();
    }
  }, []);

  // =========================
  // SYNC PROFILE CHANGES
  // =========================

  useEffect(() => {
    const handleProfileUpdated = (event) => {
      const updatedUser = event.detail;

      if (updatedUser) {
        setUser(updatedUser);

        localStorage.setItem(
          "user",
          JSON.stringify(updatedUser)
        );
      }
    };

    window.addEventListener(
      "profileUpdated",
      handleProfileUpdated
    );

    return () => {
      window.removeEventListener(
        "profileUpdated",
        handleProfileUpdated
      );
    };
  }, []);

  // =========================
  // LOGOUT
  // =========================

  const handleLogout = () => {
    setMobileMenuOpen(false);

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

  // =========================
  // USER INITIAL
  // =========================

  const getUserInitial = () => {
    if (!user?.name) {
      return "U";
    }

    return user.name
      .charAt(0)
      .toUpperCase();
  };

  // =========================
  // CLOSE MOBILE MENU
  // =========================

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  // =========================
  // OPEN PROFILE
  // =========================

  const handleOpenProfile = () => {
    closeMobileMenu();
    navigate("/profile");
  };

  return (
    <AppBar
      position="static"
      color="primary"
      elevation={0}
    >
      <Toolbar
        sx={{
          minHeight: {
            xs: "64px",
            md: "70px",
          },

          px: {
            xs: 2,
            sm: 3,
            md: 4,
          },
        }}
      >
        {/* =========================
            LOGO
        ========================= */}

        <Box
          component={Link}
          to="/dashboard"
          onClick={closeMobileMenu}
          sx={{
            flexGrow: 1,
            display: "flex",
            alignItems: "center",
            textDecoration: "none",
            width: "fit-content",
            minWidth: 0,
          }}
        >
          <Box
            component="img"
            src={logo}
            alt="LearnHub"
            sx={{
              width: {
                xs: 120,
                sm: 140,
                md: 155,
              },

              height: {
                xs: 42,
                sm: 46,
                md: 50,
              },

              objectFit: "contain",
              objectPosition: "left center",
              display: "block",
              borderRadius: 1,

              transition:
                "transform 0.2s ease",

              "&:hover": {
                transform: "scale(1.03)",
              },
            }}
          />
        </Box>

        {/* =================================================
            DESKTOP NAVIGATION
        ================================================= */}

        {!isMobile && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.5,
            }}
          >
            {/* =========================
                DASHBOARD
            ========================= */}

            <Button
              color="inherit"
              component={Link}
              to="/dashboard"
              startIcon={<DashboardIcon />}
            >
              Dashboard
            </Button>

            {/* =========================
                COURSES
            ========================= */}

            <Button
              color="inherit"
              component={Link}
              to="/courses"
              startIcon={<SchoolIcon />}
            >
              Courses
            </Button>

            {/* =========================
                MY COURSES
            ========================= */}

            <Button
              color="inherit"
              component={Link}
              to="/my-courses"
              startIcon={<LibraryBooks />}
            >
              My Courses
            </Button>

            {/* =========================
                CREATE COURSE
            ========================= */}

            {(user?.role === "teacher" ||
              user?.role === "admin") && (
              <Button
                color="inherit"
                component={Link}
                to="/courses/create"
                startIcon={<AddIcon />}
              >
                Create Course
              </Button>
            )}

            {/* =========================
                THEME TOGGLE
            ========================= */}

            <Tooltip
              title={
                darkMode
                  ? "Light Mode"
                  : "Dark Mode"
              }
            >
              <IconButton
                color="inherit"
                onClick={toggleTheme}
                aria-label={
                  darkMode
                    ? "Switch to light mode"
                    : "Switch to dark mode"
                }
              >
                {darkMode ? (
                  <LightMode />
                ) : (
                  <DarkMode />
                )}
              </IconButton>
            </Tooltip>

            {/* =========================
                PROFILE AVATAR
                DIRECT PROFILE
            ========================= */}

            <Tooltip
              title={
                user?.name
                  ? `Open ${user.name}'s Profile`
                  : "Open Profile"
              }
            >
              <IconButton
                onClick={handleOpenProfile}
                color="inherit"
                aria-label="Open profile"
                sx={{
                  ml: 0.5,
                  p: 0.5,
                  borderRadius: "50%",
                }}
              >
                <Avatar
                  src={
                    user?.profileImageUrl ||
                    undefined
                  }
                  alt={
                    user?.name || "Profile"
                  }
                  sx={{
                    width: 36,
                    height: 36,
                    bgcolor:
                      "secondary.main",
                    fontWeight: 600,
                    border: "2px solid",
                    borderColor:
                      "rgba(255,255,255,0.7)",

                    transition:
                      "transform 0.2s ease",

                    "&:hover": {
                      transform:
                        "scale(1.06)",
                    },
                  }}
                >
                  {!user?.profileImageUrl &&
                    getUserInitial()}
                </Avatar>
              </IconButton>
            </Tooltip>
          </Box>
        )}

        {/* =========================
            MOBILE MENU BUTTON
        ========================= */}

        {isMobile && (
          <IconButton
            color="inherit"
            onClick={() =>
              setMobileMenuOpen(true)
            }
            aria-label="Open navigation menu"
          >
            <MenuIcon />
          </IconButton>
        )}
      </Toolbar>

      {/* =========================
          MOBILE DRAWER
      ========================= */}

      <Drawer
        anchor="right"
        open={mobileMenuOpen}
        onClose={closeMobileMenu}
      >
        <Box
          sx={{
            width: 280,
          }}
          role="presentation"
        >
          {/* =========================
              USER INFO
          ========================= */}

          <Box
            sx={{
              p: 2.5,
              display: "flex",
              alignItems: "center",
              gap: 1.5,

              backgroundColor:
                "primary.main",

              color:
                "primary.contrastText",
            }}
          >
            <Avatar
              src={
                user?.profileImageUrl ||
                undefined
              }
              alt={
                user?.name || "Profile"
              }
              sx={{
                bgcolor:
                  "secondary.main",
                fontWeight: 600,
              }}
            >
              {!user?.profileImageUrl &&
                getUserInitial()}
            </Avatar>

            <Box sx={{ minWidth: 0 }}>
              <Box
                sx={{
                  fontWeight: 600,
                  fontSize: "1rem",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow:
                    "ellipsis",
                  maxWidth: 190,
                }}
              >
                {user?.name || "User"}
              </Box>

              <Box
                sx={{
                  fontSize: "0.75rem",
                  opacity: 0.8,
                  textTransform:
                    "capitalize",
                }}
              >
                {user?.role || "Student"}
              </Box>
            </Box>
          </Box>

          {/* =========================
              MOBILE NAVIGATION
          ========================= */}

          <List>

            {/* DASHBOARD */}

            <ListItem disablePadding>
              <ListItemButton
                component={Link}
                to="/dashboard"
                onClick={closeMobileMenu}
              >
                <ListItemIcon>
                  <DashboardIcon />
                </ListItemIcon>

                <ListItemText>
                  Dashboard
                </ListItemText>
              </ListItemButton>
            </ListItem>

            {/* COURSES */}

            <ListItem disablePadding>
              <ListItemButton
                component={Link}
                to="/courses"
                onClick={closeMobileMenu}
              >
                <ListItemIcon>
                  <SchoolIcon />
                </ListItemIcon>

                <ListItemText>
                  Courses
                </ListItemText>
              </ListItemButton>
            </ListItem>

            {/* MY COURSES */}

            <ListItem disablePadding>
              <ListItemButton
                component={Link}
                to="/my-courses"
                onClick={closeMobileMenu}
              >
                <ListItemIcon>
                  <LibraryBooks />
                </ListItemIcon>

                <ListItemText>
                  My Courses
                </ListItemText>
              </ListItemButton>
            </ListItem>

            {/* CREATE COURSE */}

            {(user?.role === "teacher" ||
              user?.role === "admin") && (
              <ListItem disablePadding>
                <ListItemButton
                  component={Link}
                  to="/courses/create"
                  onClick={closeMobileMenu}
                >
                  <ListItemIcon>
                    <AddIcon />
                  </ListItemIcon>

                  <ListItemText>
                    Create Course
                  </ListItemText>
                </ListItemButton>
              </ListItem>
            )}

            {/* PROFILE */}

            <ListItem disablePadding>
              <ListItemButton
                onClick={handleOpenProfile}
              >
                <ListItemIcon>
                  <Person />
                </ListItemIcon>

                <ListItemText>
                  Profile
                </ListItemText>
              </ListItemButton>
            </ListItem>

            <Divider
              sx={{
                my: 1,
              }}
            />

            {/* THEME */}

            <ListItem disablePadding>
              <ListItemButton
                onClick={toggleTheme}
              >
                <ListItemIcon>
                  {darkMode ? (
                    <LightMode />
                  ) : (
                    <DarkMode />
                  )}
                </ListItemIcon>

                <ListItemText>
                  {darkMode
                    ? "Light Mode"
                    : "Dark Mode"}
                </ListItemText>
              </ListItemButton>
            </ListItem>

            {/* LOGOUT */}

            <ListItem disablePadding>
              <ListItemButton
                onClick={handleLogout}
              >
                <ListItemIcon>
                  <LogoutIcon />
                </ListItemIcon>

                <ListItemText>
                  Logout
                </ListItemText>
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </AppBar>
  );
};

export default Navbar;

