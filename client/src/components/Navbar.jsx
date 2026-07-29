import {
    AppBar,
    Toolbar,
    Typography,
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
    Add as AddIcon,
    Person,
    Logout as LogoutIcon,
} from "@mui/icons-material";

import { useEffect, useState } from "react";

import { getProfile } from "../services/authService";

import { Link, useNavigate } from "react-router-dom";

import { useTheme } from "@mui/material/styles";


const Navbar = ({ darkMode, toggleTheme }) => {

    const [user, setUser] = useState(null);

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const [profileAnchor, setProfileAnchor] = useState(null);

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
                    error.response?.data || error.message
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

                <Typography
                    variant="h5"
                    component={Link}
                    to="/dashboard"
                    onClick={closeMobileMenu}
                    sx={{
                        flexGrow: 1,

                        fontWeight: 700,

                        color: "inherit",

                        textDecoration: "none",

                        letterSpacing: "-0.5px",

                        fontSize: {
                            xs: "1.35rem",
                            sm: "1.5rem",
                        },
                    }}
                >
                    LearnHub
                </Typography>


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


                        {/* =========================
                            THEME TOGGLE
                        ========================= */}

                        <Tooltip
                            title={
                                darkMode
                                    ? "Switch to light mode"
                                    : "Switch to dark mode"
                            }
                        >

                            <IconButton
                                color="inherit"
                                onClick={toggleTheme}
                                sx={{
                                    ml: 0.5,
                                }}
                            >

                                {darkMode ? (
                                    <LightMode />
                                ) : (
                                    <DarkMode />
                                )}

                            </IconButton>

                        </Tooltip>


                        <Divider
                            orientation="vertical"
                            flexItem
                            sx={{
                                mx: 1,

                                borderColor:
                                    "rgba(255,255,255,0.3)",
                            }}
                        />


                        {/* =========================
                            USER AVATAR
                        ========================= */}

                        <Tooltip
                            title={
                                user?.name
                                    ? `${user.name} (${user.role})`
                                    : "Profile"
                            }
                        >

                            <IconButton
                                onClick={handleProfileMenuOpen}
                                sx={{
                                    ml: 0.5,
                                }}
                            >

                                <Avatar
                                    sx={{
                                        width: 36,

                                        height: 36,

                                        bgcolor:
                                            "secondary.main",

                                        fontSize: 15,

                                        fontWeight: 600,
                                    }}
                                >
                                    {getUserInitial()}
                                </Avatar>

                            </IconButton>

                        </Tooltip>


                        {/* =========================
                            PROFILE DROPDOWN
                        ========================= */}

                        <Menu
                            anchorEl={profileAnchor}

                            open={Boolean(profileAnchor)}

                            onClose={handleProfileMenuClose}

                            anchorOrigin={{
                                vertical: "bottom",
                                horizontal: "right",
                            }}

                            transformOrigin={{
                                vertical: "top",
                                horizontal: "right",
                            }}
                        >

                            <MenuItem
                                onClick={() => {

                                    handleProfileMenuClose();

                                    navigate("/profile");

                                }}
                            >

                                <ListItemIcon>

                                    <Person fontSize="small" />

                                </ListItemIcon>

                                <ListItemText>
                                    Profile
                                </ListItemText>

                            </MenuItem>


                            <MenuItem
                                onClick={handleLogout}
                            >

                                <ListItemIcon>

                                    <LogoutIcon fontSize="small" />

                                </ListItemIcon>

                                <ListItemText>
                                    Logout
                                </ListItemText>

                            </MenuItem>

                        </Menu>

                    </Box>

                )}


                {/* =================================================
                    MOBILE MENU BUTTON
                ================================================= */}

                {isMobile && (

                    <IconButton
                        color="inherit"

                        onClick={() =>
                            setMobileMenuOpen(true)
                        }

                        aria-label="open navigation menu"
                    >

                        <MenuIcon />

                    </IconButton>

                )}

            </Toolbar>


            {/* =================================================
                MOBILE DRAWER
            ================================================= */}

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
                        MOBILE USER HEADER
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
                            sx={{
                                bgcolor:
                                    "secondary.main",

                                fontWeight: 600,
                            }}
                        >
                            {getUserInitial()}
                        </Avatar>


                        <Box>

                            <Typography
                                variant="subtitle1"
                                fontWeight={600}
                            >
                                {user?.name || "User"}
                            </Typography>

                            <Typography
                                variant="caption"
                                sx={{
                                    opacity: 0.8,

                                    textTransform:
                                        "capitalize",
                                }}
                            >
                                {user?.role || "Student"}
                            </Typography>

                        </Box>

                    </Box>


                    {/* =========================
                        MOBILE NAVIGATION
                    ========================= */}

                    <List>


                        {/* Dashboard */}

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


                        {/* Courses */}

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


                        {/* Create Course */}

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


                        {/* Profile */}

                        <ListItem disablePadding>

                            <ListItemButton
                                component={Link}

                                to="/profile"

                                onClick={closeMobileMenu}
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


                        {/* =========================
                            THEME
                        ========================= */}

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


                        {/* =========================
                            LOGOUT
                        ========================= */}

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