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
  Typography,
  useMediaQuery,
  Badge,
  Menu,
} from "@mui/material";

import NotificationsIcon from "@mui/icons-material/Notifications";

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
  SmartToy,
  Delete as DeleteIcon,
  ExpandMore,
  ExpandLess,
} from "@mui/icons-material";

import { useSwipeable } from "react-swipeable";

import { useEffect, useState, useRef } from "react";

import {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  clearAllNotifications,
} from "../services/notificationService";

import { getProfile } from "../services/authService";

import {
  Link,
  NavLink,
  useNavigate,
  useLocation,
} from "react-router-dom";

import { useTheme } from "@mui/material/styles";

import logo from "../assets/LearnHub-removebg-preview.png";

// ============================================================
// NOTIFICATION ITEM
// ============================================================

const NotificationItem = ({
  item,
  darkMode,
  theme,
  textPrimary,
  textSecondary,
  borderColor,
  hoverBg,
  expandedNotification,
  setExpandedNotification,
  handleRead,
  handleDeleteNotification,
}) => {
  const [swipeX, setSwipeX] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const isExpanded =
    expandedNotification === item.id;

  // ==========================================================
  // SWIPE CONFIG
  // ==========================================================

  const SWIPE_THRESHOLD = 110;
  const MAX_SWIPE = 140;

  const swipeHandlers = useSwipeable({
    onSwiping: (data) => {
      if (data.deltaX < 0) {
        const distance = Math.max(
          data.deltaX,
          -MAX_SWIPE
        );

        setSwipeX(distance);
        setIsSwiping(true);
      }
    },

    onSwipedLeft: async (data) => {
      setIsSwiping(false);

      if (
        Math.abs(data.deltaX) >=
        SWIPE_THRESHOLD
      ) {
        setIsDeleting(true);

        setSwipeX(-window.innerWidth);

        setTimeout(() => {
          handleDeleteNotification(item.id);
        }, 180);
      } else {
        setSwipeX(0);
      }
    },

    onSwipedRight: () => {
      setIsSwiping(false);
      setSwipeX(0);
    },

    onTouchEndOrOnMouseUp: () => {
      setIsSwiping(false);
    },

    preventScrollOnSwipe: false,
    trackMouse: false,
    delta: 10,
    swipeDuration: 500,

    touchEventOptions: {
      passive: true,
    },
  });

  const deleteProgress = Math.min(
    Math.abs(swipeX) /
    SWIPE_THRESHOLD,
    1
  );

  return (
    <Box
      sx={{
        position: "relative",
        overflow: "hidden",
        borderBottom: `1px solid ${borderColor}`,

        backgroundColor: item.isRead
          ? "transparent"
          : darkMode
            ? "rgba(25,118,210,0.08)"
            : "rgba(25,118,210,0.05)",
      }}
    >
      {/* DELETE BACKGROUND */}

      <Box
        sx={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          pr: 2,

          backgroundColor:
            theme.palette.error.main,

          opacity: deleteProgress,

          transition: isSwiping
            ? "none"
            : "opacity 0.2s ease",
        }}
      >
        <DeleteIcon
          sx={{
            color: "#fff",
            fontSize: 23,

            transform: `scale(${0.8 +
              deleteProgress * 0.3
              })`,

            transition: isSwiping
              ? "none"
              : "transform 0.2s ease",
          }}
        />
      </Box>

      {/* SWIPEABLE CONTENT */}

      <Box
        {...swipeHandlers}
        sx={{
          position: "relative",

          transform: `translateX(${swipeX}px)`,

          transition: isSwiping
            ? "none"
            : "transform 0.22s ease",

          backgroundColor:
            theme.palette.background.paper,

          touchAction: "pan-y",

          opacity: isDeleting ? 0 : 1,

          "&:hover": {
            backgroundColor: item.isRead
              ? hoverBg
              : darkMode
                ? "rgba(25,118,210,0.12)"
                : "rgba(25,118,210,0.08)",
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "stretch",
            width: "100%",
          }}
        >
          {/* NOTIFICATION CONTENT */}

          <Box
            onClick={async () => {
              if (
                isSwiping ||
                isDeleting
              ) {
                return;
              }

              if (!item.isRead) {
                await handleRead(item.id);
              }

              setExpandedNotification(
                isExpanded
                  ? null
                  : item.id
              );
            }}
            sx={{
              flex: 1,
              minWidth: 0,
              cursor: "pointer",
              px: 1.5,
              py: 1.25,
              position: "relative",
            }}
          >
            {/* TITLE */}

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent:
                  "space-between",
                gap: 1,
                pl: 0.5,
              }}
            >
              <Typography
                sx={{
                  fontSize: "0.85rem",

                  fontWeight: item.isRead
                    ? 500
                    : 700,

                  color: textPrimary,

                  overflow: "hidden",
                  textOverflow:
                    "ellipsis",

                  whiteSpace: "nowrap",

                  flex: 1,
                  minWidth: 0,
                }}
              >
                {item.title}
              </Typography>

              {isExpanded ? (
                <ExpandLess
                  sx={{
                    fontSize: 20,
                    color:
                      textSecondary,
                    flexShrink: 0,
                  }}
                />
              ) : (
                <ExpandMore
                  sx={{
                    fontSize: 20,
                    color:
                      textSecondary,
                    flexShrink: 0,
                  }}
                />
              )}
            </Box>

            {/* MESSAGE */}

            <Typography
              sx={{
                mt: 0.4,
                ml: 0.5,

                fontSize: "0.75rem",

                color: textSecondary,

                display:
                  "-webkit-box",

                WebkitLineClamp:
                  isExpanded ? "unset" : 2,

                WebkitBoxOrient:
                  "vertical",

                overflow: "hidden",

                lineHeight: 1.5,
              }}
            >
              {item.message}
            </Typography>

            {/* EXPANDED MESSAGE */}

            {isExpanded && (
              <Box
                sx={{
                  mt: 1,
                  p: 1.2,
                  borderRadius: "9px",

                  backgroundColor:
                    hoverBg,
                }}
              >
                <Typography
                  sx={{
                    fontSize: "0.78rem",
                    lineHeight: 1.6,
                    color:
                      textSecondary,
                  }}
                >
                  {item.message}
                </Typography>

                {item.createdAt && (
                  <Typography
                    sx={{
                      mt: 0.8,
                      fontSize: "0.68rem",
                      color:
                        textSecondary,
                    }}
                  >
                    {new Date(
                      item.createdAt
                    ).toLocaleString()}
                  </Typography>
                )}
              </Box>
            )}

            {/* UNREAD DOT */}

            {!item.isRead && (
              <Box
                sx={{
                  width: 7,
                  height: 7,
                  borderRadius: "50%",

                  backgroundColor:
                    theme.palette.primary.main,

                  position: "absolute",

                  left: 5,
                  top: 17,
                }}
              />
            )}
          </Box>

          {/* DELETE BUTTON */}

          <Tooltip title="Delete notification">
            <IconButton
              size="small"
              onClick={(event) => {
                event.stopPropagation();

                handleDeleteNotification(
                  item.id
                );
              }}
              sx={{
                width: 38,
                minWidth: 38,

                borderRadius: 0,

                color:
                  theme.palette.error.main,

                opacity: {
                  xs: 1,
                  md: 0.45,
                },

                transition:
                  "all 0.2s ease",

                "&:hover": {
                  opacity: 1,

                  backgroundColor:
                    theme.palette.error
                      .main + "14",
                },
              }}
            >
              <DeleteIcon
                sx={{
                  fontSize: 19,
                }}
              />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
    </Box>
  );
};

// ============================================================
// NAVBAR
// ============================================================

const Navbar = ({
  darkMode,
  toggleTheme,
}) => {
  const [user, setUser] =
    useState(null);

  const [
    notifications,
    setNotifications,
  ] = useState([]);

  const notificationButtonRef =
    useRef(null);

  const [
    unreadCount,
    setUnreadCount,
  ] = useState(0);

  const [
    notificationAnchor,
    setNotificationAnchor,
  ] = useState(null);

  const [
    mobileMenuOpen,
    setMobileMenuOpen,
  ] = useState(false);

  const [
    expandedNotification,
    setExpandedNotification,
  ] = useState(null);

  const navigate = useNavigate();

  const location = useLocation();

  const theme = useTheme();

  const isMobile =
    useMediaQuery(
      theme.breakpoints.down("md")
    );

  // ==========================================================
  // COLORS
  // ==========================================================

  const navbarBg =
    theme.palette.background.paper;

  const textPrimary =
    theme.palette.text.primary;

  const textSecondary =
    theme.palette.text.secondary;

  const borderColor =
    theme.palette.divider;

  const hoverBg =
    theme.palette.action.hover;

  // ==========================================================
  // LOAD NOTIFICATIONS
  // ==========================================================

  const loadNotifications =
    async () => {
      try {
        const [
          listRes,
          countRes,
        ] = await Promise.all([
          getNotifications(),
          getUnreadCount(),
        ]);

        setNotifications(
          listRes?.data || []
        );

        setUnreadCount(
          Number(
            countRes?.data || 0
          )
        );
      } catch (error) {
        console.log(
          "Notification loading error:",
          error
        );
      }
    };

  // ==========================================================
  // OPEN NOTIFICATIONS
  // ==========================================================

  const openNotification = (
    event
  ) => {
    setNotificationAnchor(
      event.currentTarget
    );

    loadNotifications();
  };

  // ==========================================================
  // OPEN MOBILE NOTIFICATIONS
  // ==========================================================

  const openMobileNotifications =
    () => {
      setMobileMenuOpen(false);

      setTimeout(() => {
        const anchor =
          notificationButtonRef.current;

        if (anchor) {
          setNotificationAnchor(
            anchor
          );
        }

        loadNotifications();
      }, 200);
    };

  // ==========================================================
  // CLOSE NOTIFICATIONS
  // ==========================================================

  const closeNotification =
    () => {
      setNotificationAnchor(
        null
      );
    };

  // ==========================================================
  // MARK AS READ
  // ==========================================================

  const handleRead =
    async (id) => {
      try {
        const currentNotification =
          notifications.find(
            (item) =>
              item.id === id
          );

        if (
          !currentNotification ||
          currentNotification.isRead
        ) {
          return;
        }

        await markAsRead(id);

        setNotifications(
          (prev) =>
            prev.map((item) =>
              item.id === id
                ? {
                  ...item,
                  isRead: true,
                }
                : item
            )
        );

        setUnreadCount(
          (prev) =>
            Math.max(
              prev - 1,
              0
            )
        );
      } catch (error) {
        console.log(
          "Mark notification read error:",
          error
        );
      }
    };

  // ==========================================================
  // MARK ALL AS READ
  // ==========================================================

  const handleReadAll =
    async () => {
      try {
        await markAllAsRead();

        setNotifications(
          (prev) =>
            prev.map((item) => ({
              ...item,
              isRead: true,
            }))
        );

        setUnreadCount(0);
      } catch (error) {
        console.log(
          "Mark all notifications read error:",
          error
        );
      }
    };

  // ==========================================================
  // DELETE SINGLE NOTIFICATION
  // ==========================================================

  const handleDeleteNotification =
    async (id) => {
      try {
        const deletedNotification =
          notifications.find(
            (item) =>
              item.id === id
          );

        await deleteNotification(id);

        setNotifications(
          (prev) =>
            prev.filter(
              (item) =>
                item.id !== id
            )
        );

        if (
          deletedNotification &&
          !deletedNotification.isRead
        ) {
          setUnreadCount(
            (prev) =>
              Math.max(
                prev - 1,
                0
              )
          );
        }

        setExpandedNotification(
          (prev) =>
            prev === id
              ? null
              : prev
        );
      } catch (error) {
        console.log(
          "Delete notification error:",
          error?.response?.data ||
          error?.message
        );
      }
    };

  // ==========================================================
  // CLEAR ALL
  // ==========================================================

  const handleClearAll =
    async () => {
      try {
        await clearAllNotifications();

        setNotifications([]);

        setUnreadCount(0);

        setExpandedNotification(
          null
        );

        closeNotification();
      } catch (error) {
        console.log(
          "Clear notifications error:",
          error?.response?.data ||
          error?.message
        );
      }
    };

  // ==========================================================
  // LOAD STORED USER
  // ==========================================================

  useEffect(() => {
    const storedUser =
      localStorage.getItem("user");

    if (storedUser) {
      try {
        setUser(
          JSON.parse(storedUser)
        );
      } catch (error) {
        console.log(
          "Invalid stored user:",
          error
        );
      }
    }
  }, []);

  // ==========================================================
  // FETCH PROFILE
  // ==========================================================

  useEffect(() => {
    const fetchProfile =
      async () => {
        try {
          const response =
            await getProfile();

          const profileUser =
            response?.data;

          setUser(profileUser);

          localStorage.setItem(
            "user",
            JSON.stringify(
              profileUser
            )
          );
        } catch (error) {
          console.log(
            "Profile fetch error:",
            error?.response?.data ||
            error?.message
          );
        }
      };

    const accessToken =
      localStorage.getItem(
        "access_token"
      );

    if (accessToken) {
      fetchProfile();
    }
  }, []);

  // ==========================================================
  // INITIAL NOTIFICATIONS
  // ==========================================================

  useEffect(() => {
    const accessToken =
      localStorage.getItem(
        "access_token"
      );

    if (accessToken) {
      loadNotifications();
    }
  }, []);

  // ==========================================================
  // PROFILE UPDATE
  // ==========================================================

  useEffect(() => {
    const handleProfileUpdated =
      (event) => {
        const updatedUser =
          event.detail;

        if (updatedUser) {
          setUser(updatedUser);

          localStorage.setItem(
            "user",
            JSON.stringify(
              updatedUser
            )
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

  // ==========================================================
  // LOGOUT
  // ==========================================================

  const handleLogout =
    () => {
      setMobileMenuOpen(false);

      localStorage.removeItem(
        "access_token"
      );

      localStorage.removeItem(
        "refresh_token"
      );

      localStorage.removeItem(
        "user"
      );

      setUser(null);

      navigate("/login");
    };

  // ==========================================================
  // USER INITIAL
  // ==========================================================

  const getUserInitial =
    () => {
      if (!user?.name) {
        return "U";
      }

      return user.name
        .charAt(0)
        .toUpperCase();
    };

  // ==========================================================
  // MOBILE MENU
  // ==========================================================

  const closeMobileMenu =
    () => {
      setMobileMenuOpen(false);
    };

  // ==========================================================
  // PROFILE
  // ==========================================================

  const handleOpenProfile =
    () => {
      closeMobileMenu();

      navigate("/profile");
    };

  // ==========================================================
  // DESKTOP NAV BUTTON
  // ==========================================================

  const navButtonSx = (path) => ({
    color: isActiveRoute(path)
      ? theme.palette.primary.main
      : textPrimary,

    backgroundColor: isActiveRoute(path)
      ? darkMode
        ? "rgba(25, 118, 210, 0.18)"
        : "rgba(25, 118, 210, 0.10)"
      : "transparent",

    borderRadius: "10px",

    px: 1.5,
    minHeight: 40,
    textTransform: "none",

    fontWeight: isActiveRoute(path)
      ? 700
      : 600,

    transition:
      "background-color 0.2s ease, color 0.2s ease, transform 0.2s ease",

    "&:hover": {
      backgroundColor: darkMode
        ? "rgba(25, 118, 210, 0.16)"
        : "rgba(25, 118, 210, 0.08)",

      color: theme.palette.primary.main,
    },

    "& .MuiButton-startIcon": {
      marginRight: 0.7,
    },

    "& svg": {
      fontSize: 20,
    },

    // IMPORTANT: remove underline
    "&::after": {
      display: "none",
    },
  });

  // ==========================================================
  // MOBILE NAV BUTTON
  // ==========================================================

  const mobileNavButtonSx = (path) => ({
    borderRadius: "10px",
    mb: 0.4,

    color: isActiveRoute(path)
      ? theme.palette.primary.main
      : textPrimary,

    backgroundColor: isActiveRoute(path)
      ? darkMode
        ? "rgba(25, 118, 210, 0.18)"
        : "rgba(25, 118, 210, 0.10)"
      : "transparent",

    fontWeight: isActiveRoute(path)
      ? 700
      : 500,

    transition:
      "background-color 0.2s ease, color 0.2s ease",

    "&:hover": {
      backgroundColor: darkMode
        ? "rgba(25, 118, 210, 0.16)"
        : "rgba(25, 118, 210, 0.08)",

      color: theme.palette.primary.main,
    },

    "& .MuiListItemIcon-root": {
      color: isActiveRoute(path)
        ? theme.palette.primary.main
        : "inherit",
    },
  });

  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  // ==========================================================
  // ICON BUTTON
  // ==========================================================

  const iconButtonSx = {
    width: 42,
    height: 42,
    borderRadius: "11px",
    
    color: textPrimary,

    transition:
      "all 0.2s ease",

    "&:hover": {
      backgroundColor: hoverBg,

      color:
        theme.palette.primary.main,

      transform:
        "translateY(-1px)",
    },

    "& svg": {
      fontSize: 22,
    },
  };

  // ==========================================================
  // UI
  // ==========================================================

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backgroundColor: navbarBg,

        color: textPrimary,

        borderBottom:
          `1px solid ${borderColor}`,

        boxShadow: darkMode
          ? "0 4px 18px rgba(0,0,0,0.25)"
          : "0 4px 18px rgba(15,23,42,0.08)",

        borderRadius:
          "0 0 18px 18px",

        overflow: "hidden",

        transition:
          "background-color 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease",
      }}
    >
      {/* ======================================================
          TOOLBAR
      ====================================================== */}

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
        {/* LOGO */}

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
                xs: 72,
                sm: 76,
                md: 80,
              },

              objectFit: "contain",

              objectPosition:
                "left center",

              display: "block",

              transition:
                "transform 0.2s ease",

              "&:hover": {
                transform:
                  "scale(1.03)",
              },
            }}
          />
        </Box>

        {/* ====================================================
            DESKTOP NAVIGATION
        ==================================================== */}

        {!isMobile && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.5,
            }}
          >
            {/* DASHBOARD */}

            <Button
              color="inherit"
              component={Link}
              to="/dashboard"
              startIcon={<DashboardIcon />}
              sx={navButtonSx("/dashboard")}
            >
              Dashboard
            </Button>

            {/* COURSES */}

            <Button
              color="inherit"
              component={NavLink}
              to="/courses"
              startIcon={
                <SchoolIcon />
              }
              sx={navButtonSx("/courses")}
            >
              Courses
            </Button>

            {/* AI ASSISTANT */}

            <Button
              color="inherit"
              component={NavLink}
              to="/ai-assistant"
              startIcon={
                <SmartToy />
              }
              sx={navButtonSx("/ai-assistant")}
            >
              AI Assistant
            </Button>

            {/* MY COURSES */}

            {user?.role ===
              "student" && (
                <Button
                  color="inherit"
                  component={NavLink}
                  to="/my-courses"
                  startIcon={
                    <LibraryBooks />
                  }
                  sx={navButtonSx("/my-course")}
                >
                  My Courses
                </Button>
              )}

            {/* CREATE COURSE */}

            {(user?.role ===
              "teacher" ||
              user?.role ===
              "admin") && (
                <Button
                  color="inherit"
                  component={NavLink}
                  to="/courses/create"
                  startIcon={
                    <AddIcon />
                  }
                  sx={navButtonSx("/course/create")}
                >
                  Create Course
                </Button>
              )}

            {/* THEME */}

            <Tooltip
              title={
                darkMode
                  ? "Light Mode"
                  : "Dark Mode"
              }
            >
              <IconButton
                onClick={toggleTheme}
                aria-label="Toggle theme"
                sx={iconButtonSx}
              >
                {darkMode ? (
                  <LightMode />
                ) : (
                  <DarkMode />
                )}
              </IconButton>
            </Tooltip>

            {/* NOTIFICATIONS */}

            <Tooltip title="Notifications">
              <IconButton
                ref={
                  notificationButtonRef
                }
                onClick={
                  openNotification
                }
                aria-label="Notifications"
                sx={iconButtonSx}
              >
                <Badge
                  badgeContent={
                    unreadCount
                  }
                  color="error"
                  max={99}
                >
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </Tooltip>

            {/* PROFILE */}

            <Tooltip
              title={
                user?.name
                  ? `Open ${user.name}'s Profile`
                  : "Open Profile"
              }
            >
              <IconButton
                onClick={
                  handleOpenProfile
                }
                sx={{
                  ml: 0.5,
                  p: 0.4,
                  borderRadius: "50%",
                }}
              >
                <Avatar
                  src={
                    user?.profileImageUrl ||
                    undefined
                  }
                  alt={
                    user?.name ||
                    "Profile"
                  }
                  sx={{
                    width: 37,
                    height: 37,

                    bgcolor:
                      theme.palette
                        .primary.main,

                    color:
                      theme.palette
                        .primary
                        .contrastText,

                    fontWeight: 700,
                  }}
                >
                  {!user?.profileImageUrl &&
                    getUserInitial()}
                </Avatar>
              </IconButton>
            </Tooltip>
          </Box>
        )}

        {/* ====================================================
            MOBILE
        ==================================================== */}

        {isMobile && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.5,
            }}
          >

            <IconButton
              onClick={() => navigate("/ai-assistant")}
              aria-label="AI Assistant"
              sx={iconButtonSx}
            >
              <SmartToy />
            </IconButton>
            {/* MOBILE NOTIFICATION */}

            <Tooltip title="Notifications">
              <IconButton
                ref={
                  notificationButtonRef
                }
                onClick={
                  openNotification
                }
                aria-label="Notifications"
                sx={iconButtonSx}
              >
                <Badge
                  badgeContent={
                    unreadCount
                  }
                  color="error"
                  max={99}
                >
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </Tooltip>

            {/* MOBILE MENU */}

            <IconButton
              onClick={() =>
                setMobileMenuOpen(
                  true
                )
              }
              aria-label="Open navigation menu"
              sx={iconButtonSx}
            >
              <MenuIcon />
            </IconButton>
          </Box>
        )}
      </Toolbar>

      {/* ======================================================
          NOTIFICATION MENU
      ====================================================== */}

      <Menu
        anchorEl={
          notificationAnchor
        }
        open={Boolean(
          notificationAnchor
        )}
        onClose={
          closeNotification
        }
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        slotProps={{
          paper: {
            sx: {
              width: {
                xs: 280,
                sm: 280,
              },

              maxWidth:
                "calc(100vw - 24px)",

              mt: 1,


              borderRadius: "14px",

              bgcolor:
                theme.palette
                  .background.paper,

              color:
                theme.palette
                  .text.primary,

              border:
                `1px solid ${borderColor}`,

              boxShadow: darkMode
                ? "0 14px 35px rgba(0,0,0,0.35)"
                : "0 14px 35px rgba(15,23,42,0.12)",

              overflow: "hidden",
            },
          },
        }}
      >
        {/* HEADER */}

        <Box
          sx={{
            px: 1.8,
            py: 1,

            display: "flex",

            alignItems: "center",

            justifyContent:
              "space-between",

            borderBottom:
              `1px solid ${borderColor}`,
          }}
        >
          <Typography
            sx={{
              fontSize: "0.95rem",
              fontWeight: 700,
              color: textPrimary,
            }}
          >
            Notifications
          </Typography>

          {notifications.length >
            0 && (
              <Typography
                sx={{
                  fontSize: "0.72rem",
                  color:
                    textSecondary,
                }}
              >
                {notifications.length}{" "}
                {notifications.length ===
                  1
                  ? "notification"
                  : "notifications"}
              </Typography>
            )}
        </Box>

        {/* ACTIONS */}

        {notifications.length >
          0 && (
            <Box
              sx={{
                px: 1.5,
                // py: 0.8, 

                display: "flex",

                justifyContent:
                  "space-between",

                alignItems: "center",

                gap: 1,

                borderBottom:
                  `1px solid ${borderColor}`,
              }}
            >
              <Button
                size="small"
                onClick={
                  handleReadAll
                }
                disabled={
                  unreadCount === 0
                }
                sx={{
                  textTransform:
                    "none",

                  fontSize:
                    "0.78rem",

                  fontWeight: 600,

                  minWidth: "auto",

                  px: 1,
                }}
              >
                Mark All Read
              </Button>

              <Button
                size="small"
                color="error"
                startIcon={
                  <DeleteIcon />
                }
                onClick={
                  handleClearAll
                }
                sx={{
                  textTransform:
                    "none",

                  fontSize:
                    "0.78rem",

                  fontWeight: 600,

                  minWidth: "auto",

                  px: 1,
                }}
              >
                Clear All
              </Button>
            </Box>
          )}

        {/* EMPTY */}

        {notifications.length ===
          0 ? (
          <Box
            sx={{
              py: 4,
              px: 2,
              textAlign: "center",
            }}
          >
            <NotificationsIcon
              sx={{
                fontSize: 36,

                color:
                  textSecondary,

                opacity: 0.5,

                mb: 1,
              }}
            />

            <Typography
              sx={{
                fontSize:
                  "0.85rem",

                color:
                  textSecondary,
              }}
            >
              No Notifications
            </Typography>
          </Box>
        ) : (
          <Box
            sx={{
              height: {
                xs: "230px",
                sm: "240px",
                md: "250px",
              },

              maxHeight: {
                xs: "230px",
                sm: "220px",
                md: "250px",
              },

              overflowY: "auto",
              overflowX: "hidden",

              // Important for proper scrolling
              overscrollBehavior: "contain",
              WebkitOverflowScrolling: "touch",

              "&::-webkit-scrollbar": {
                width: "5px",
              },

              "&::-webkit-scrollbar-thumb": {
                backgroundColor: theme.palette.action.disabled,
                borderRadius: "10px",
              },

              "&::-webkit-scrollbar-track": {
                backgroundColor: "transparent",
              },

              scrollbarWidth: "thin",
              scrollbarColor: `${theme.palette.action.disabled} transparent`,
            }}
          >
            {notifications.map(
              (item) => (
                <NotificationItem
                  key={item.id}
                  item={item}
                  darkMode={
                    darkMode
                  }
                  theme={theme}
                  textPrimary={
                    textPrimary
                  }
                  textSecondary={
                    textSecondary
                  }
                  borderColor={
                    borderColor
                  }
                  hoverBg={hoverBg}
                  expandedNotification={
                    expandedNotification
                  }
                  setExpandedNotification={
                    setExpandedNotification
                  }
                  handleRead={
                    handleRead
                  }
                  handleDeleteNotification={
                    handleDeleteNotification
                  }
                />
              )
            )}
          </Box>
        )}

        {/* SWIPE HINT */}

        {notifications.length >
          0 &&
          isMobile && (
            <Box
              sx={{
                px: 1.5,
                py: 0.5,

                textAlign: "center",

                borderTop:
                  `1px solid ${borderColor}`,
              }}
            >
              <Typography
                sx={{
                  fontSize:
                    "0.65rem",

                  color:
                    textSecondary,

                  opacity: 0.75,
                }}
              >
                Swipe left to delete
              </Typography>
            </Box>
          )}
      </Menu>

      {/* ======================================================
          MOBILE DRAWER
      ====================================================== */}

      <Drawer
        anchor="right"
        open={mobileMenuOpen}
        onClose={
          closeMobileMenu
        }
        slotProps={{
          paper: {
            sx: {
              width: {
                xs: 290,
                sm: 320,
              },

              bgcolor:
                theme.palette
                  .background.paper,

              color:
                theme.palette
                  .text.primary,

              borderLeft:
                `1px solid ${borderColor}`,
            },
          },
        }}
      >
        <Box>
          {/* USER INFO */}

          <Box
            sx={{
              p: 2.5,

              display: "flex",

              alignItems: "center",

              gap: 1.5,

              background:
                darkMode
                  ? `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`
                  : `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,

              color:
                theme.palette
                  .primary
                  .contrastText,
            }}
          >
            <Avatar
              src={
                user?.profileImageUrl ||
                undefined
              }
              alt={
                user?.name ||
                "Profile"
              }
              sx={{
                bgcolor:
                  theme.palette
                    .background
                    .paper,

                color:
                  theme.palette
                    .primary.main,

                fontWeight: 700,
              }}
            >
              {!user?.profileImageUrl &&
                getUserInitial()}
            </Avatar>

            <Box
              sx={{
                minWidth: 0,
              }}
            >
              <Typography
                sx={{
                  fontWeight: 700,

                  fontSize:
                    "1rem",

                  whiteSpace:
                    "nowrap",

                  overflow:
                    "hidden",

                  textOverflow:
                    "ellipsis",
                }}
              >
                {user?.name ||
                  "User"}
              </Typography>

              <Typography
                sx={{
                  fontSize:
                    "0.75rem",

                  opacity: 0.85,

                  textTransform:
                    "capitalize",
                }}
              >
                {user?.role ||
                  "Student"}
              </Typography>
            </Box>
          </Box>

          {/* NAVIGATION */}

          <List sx={{ p: 1 }}>
            {/* DASHBOARD */}

            <ListItem disablePadding>
              <ListItemButton
                component={NavLink}
                to="/dashboard"
                onClick={
                  closeMobileMenu
                }
                sx={
                  mobileNavButtonSx("/dashboard")
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

            {/* COURSES */}

            <ListItem disablePadding>
              <ListItemButton
                component={NavLink}
                to="/courses"
                onClick={
                  closeMobileMenu
                }
                sx={
                  mobileNavButtonSx("/courses")
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

            {/* AI */}

            <ListItem disablePadding>
              <ListItemButton
                component={NavLink}
                to="/ai-assistant"
                onClick={
                  closeMobileMenu
                }
                sx={
                  mobileNavButtonSx("/ai-assistant")
                }
              >
                <ListItemIcon>
                  <SmartToy />
                </ListItemIcon>

                <ListItemText>
                  AI Assistant
                </ListItemText>
              </ListItemButton>
            </ListItem>

            {/* MY COURSES */}

            {user?.role ===
              "student" && (
                <ListItem disablePadding>
                  <ListItemButton
                    component={NavLink}
                    to="/my-courses"
                    onClick={
                      closeMobileMenu
                    }
                    sx={
                      mobileNavButtonSx
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
              )}

            {/* CREATE COURSE */}

            {(user?.role ===
              "teacher" ||
              user?.role ===
              "admin") && (
                <ListItem disablePadding>
                  <ListItemButton
                    component={NavLink}
                    to="/courses/create"
                    onClick={
                      closeMobileMenu
                    }
                    sx={
                      mobileNavButtonSx("/courses/create")
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

            {/* PROFILE */}

            <ListItem disablePadding>
              <ListItemButton
                component={NavLink}
                to="/profile"
                onClick={
                  closeMobileMenu
                }
                sx={
                  mobileNavButtonSx("/profile")
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

            <Divider sx={{ my: 1.5 }} />

            {/* NOTIFICATIONS */}

            <ListItem disablePadding>
              <ListItemButton
                onClick={
                  openMobileNotifications
                }
                sx={{
                  borderRadius:
                    "10px",
                  mb: 0.4,
                  color: textPrimary,

                  "&:hover": {
                    backgroundColor:
                      hoverBg,

                    color:
                      theme.palette
                        .primary
                        .main,
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 42,
                    color: "inherit",
                  }}
                >
                  <Badge
                    badgeContent={
                      unreadCount
                    }
                    color="error"
                  >
                    <NotificationsIcon />
                  </Badge>
                </ListItemIcon>

                <ListItemText>
                  Notifications
                </ListItemText>
              </ListItemButton>
            </ListItem>

            {/* THEME */}

            <ListItem disablePadding>
              <ListItemButton
                onClick={toggleTheme}
                sx={{
                  borderRadius:
                    "10px",
                  mb: 0.4,
                  color: textPrimary,

                  "&:hover": {
                    backgroundColor:
                      hoverBg,

                    color:
                      theme.palette
                        .primary
                        .main,
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 42,
                    color: "inherit",
                  }}
                >
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
                onClick={
                  handleLogout
                }
                sx={{
                  borderRadius:
                    "10px",

                  color:
                    theme.palette
                      .error.main,

                  "&:hover": {
                    backgroundColor:
                      theme.palette
                        .error.main +
                      "12",
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 42,

                    color: "inherit",
                  }}
                >
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