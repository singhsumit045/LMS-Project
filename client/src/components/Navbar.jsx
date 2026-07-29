
import {
  AppBar,
  Toolbar,
  Button,
  Box,
  IconButton,
  Avatar,
  Tooltip,
  Divider,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Drawer,
  List,
  ListItem,
  ListItemButton,
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

// LearnHub Logo
import logo from "../assets/LearnHub.png";


const Navbar = ({ darkMode, toggleTheme }) => {

  const [user, setUser] = useState(null);

  const [mobileMenuOpen, setMobileMenuOpen] =
    useState(false);

  const [profileAnchor, setProfileAnchor] =
    useState(null);

  const navigate = useNavigate();

  const theme = useTheme();

  const isMobile = useMediaQuery(
    theme.breakpoints.down("md")
  );


  // =========================
  // FETCH USER PROFILE
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
  // LOGOUT
  // =========================

  const handleLogout = () => {

    setMobileMenuOpen(false);

    setProfileAnchor(null);

    localStorage.removeItem("access_token");

    localStorage.removeItem("refresh_token");

    localStorage.removeItem("user");

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
  // PROFILE MENU
  // =========================

  const handleProfileMenuOpen = (event) => {

    setProfileAnchor(event.currentTarget);

  };


  const handleProfileMenuClose = () => {

    setProfileAnchor(null);

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

              transition: "transform 0.2s ease",

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

            {/* Dashboard */}

            <Button
              color="inherit"
              component={Link}
              to="/dashboard"
              startIcon={<DashboardIcon />}
            >
              Dashboard
            </Button>


            {/* Courses */}

            <Button
              color="inherit"
              component={Link}
              to="/courses"
              startIcon={<SchoolIcon />}
            >
              Courses
            </Button>


            {/* My Courses */}

            <Button
              color="inherit"
              component={Link}
              to="/my-courses"
              startIcon={<LibraryBooks />}
            >
              My Courses
            </Button>


            {/* Create Course */}

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


            {/* Profile */}

            <Button
              color="inherit"
              component={Link}
              to="/profile"
              startIcon={<Person />}
            >
              Profile
            </Button>


            {/* Theme Toggle */}

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
              >

                {darkMode ? (
                  <LightMode />
                ) : (
                  <DarkMode />
                )}

              </IconButton>

            </Tooltip>


            {/* Profile Avatar */}

            <Tooltip title="Account">

              <IconButton
                onClick={
                  handleProfileMenuOpen
                }
                color="inherit"
              >

                <Avatar
                  sx={{
                    width: 36,
                    height: 36,
                    bgcolor:
                      "secondary.main",
                  }}
                >
                  {getUserInitial()}
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
          >

            <MenuIcon />

          </IconButton>

        )}

      </Toolbar>


      {/* =========================
          PROFILE MENU
      ========================= */}

      <Menu
        anchorEl={profileAnchor}
        open={Boolean(profileAnchor)}
        onClose={handleProfileMenuClose}
      >

        <MenuItem
          component={Link}
          to="/profile"
          onClick={
            handleProfileMenuClose
          }
        >

          <ListItemIcon>
            <Person fontSize="small" />
          </ListItemIcon>

          Profile

        </MenuItem>


        <Divider />


        <MenuItem
          onClick={handleLogout}
        >

          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>

          Logout

        </MenuItem>

      </Menu>


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

          {/* USER INFO */}

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
              sx={{
                bgcolor:
                  "secondary.main",

                fontWeight: 600,
              }}
            >
              {getUserInitial()}
            </Avatar>


            <Box>

              <Box
                sx={{
                  fontWeight: 600,
                  fontSize: "1rem",
                }}
              >
                {user?.name || "User"}
              </Box>


              <Box
                sx={{
                  fontSize: "0.75rem",
                  opacity: 0.8,
                  textTransform: "capitalize",
                }}
              >
                {user?.role || "Student"}
              </Box>

            </Box>

          </Box>


          {/* MOBILE NAVIGATION */}

          <List>

            {/* Dashboard */}

            <ListItem disablePadding>

              <ListItemButton
                component={Link}
                to="/dashboard"
                onClick={
                  closeMobileMenu
                }
              >

                <ListItemIcon>
                  <DashboardIcon />
                </ListItemIcon>

                <ListItemText>
                  Dashboard
                </ListItemText>

              </ListItemButton>

            </ListItem>


            {/* Courses */}

            <ListItem disablePadding>

              <ListItemButton
                component={Link}
                to="/courses"
                onClick={
                  closeMobileMenu
                }
              >

                <ListItemIcon>
                  <SchoolIcon />
                </ListItemIcon>

                <ListItemText>
                  Courses
                </ListItemText>

              </ListItemButton>

            </ListItem>


            {/* My Courses */}

            <ListItem disablePadding>

              <ListItemButton
                component={Link}
                to="/my-courses"
                onClick={
                  closeMobileMenu
                }
              >

                <ListItemIcon>
                  <LibraryBooks />
                </ListItemIcon>

                <ListItemText>
                  My Courses
                </ListItemText>

              </ListItemButton>

            </ListItem>


            {/* Create Course */}

            {(user?.role === "teacher" ||
              user?.role === "admin") && (

              <ListItem disablePadding>

                <ListItemButton
                  component={Link}
                  to="/courses/create"
                  onClick={
                    closeMobileMenu
                  }
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


            {/* Profile */}

            <ListItem disablePadding>

              <ListItemButton
                component={Link}
                to="/profile"
                onClick={
                  closeMobileMenu
                }
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


            {/* Theme */}

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


            {/* Logout */}

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

