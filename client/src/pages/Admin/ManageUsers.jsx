import {
    Container,
    Paper,
    Typography,
    Box,
    CircularProgress,
    Alert,
    Button,
    TextField,
    MenuItem,
    Chip,
    Avatar,
    IconButton,
    Tooltip,
    Stack,
    Badge,
} from "@mui/material";

import {
    People,
    Search,
    Refresh,
    Delete,
    Person,
    School,
    AdminPanelSettings,
} from "@mui/icons-material";

import { useEffect, useMemo, useState } from "react";

import api from "../../services/api";
import socket from "../../services/socket";

const ManageUsers = () => {
    // =====================================================
    // STATE
    // =====================================================

    const [users, setUsers] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [search, setSearch] = useState("");

    const [roleFilter, setRoleFilter] = useState("all");

    // =====================================================
    // FETCH USERS
    // =====================================================

    const fetchUsers = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/admin/users");

            setUsers(
                Array.isArray(response.data)
                    ? response.data
                    : []
            );
        } catch (error) {
            console.error(
                "Fetch users error:",
                error
            );

            setError(
                error.response?.data?.message ||
                    "Unable to load users."
            );
        } finally {
            setLoading(false);
        }
    };

    // =====================================================
    // INITIAL LOAD
    // =====================================================

    useEffect(() => {
        fetchUsers();
    }, []);

    // =====================================================
    // SOCKET ONLINE / OFFLINE
    // =====================================================

    useEffect(() => {
        const handleUserOnline = ({ userId }) => {
            setUsers((prevUsers) =>
                prevUsers.map((user) =>
                    Number(user.id) === Number(userId)
                        ? {
                              ...user,
                              isOnline: true,
                          }
                        : user
                )
            );
        };

        const handleUserOffline = ({ userId }) => {
            setUsers((prevUsers) =>
                prevUsers.map((user) =>
                    Number(user.id) === Number(userId)
                        ? {
                              ...user,
                              isOnline: false,
                          }
                        : user
                )
            );
        };

        socket.on(
            "user-online",
            handleUserOnline
        );

        socket.on(
            "user-offline",
            handleUserOffline
        );

        return () => {
            socket.off(
                "user-online",
                handleUserOnline
            );

            socket.off(
                "user-offline",
                handleUserOffline
            );
        };
    }, []);

    // =====================================================
    // DELETE USER
    // =====================================================

    const handleDeleteUser = async (
        userId,
        userName
    ) => {
        const confirmed = window.confirm(
            `Are you sure you want to delete ${userName}?`
        );

        if (!confirmed) {
            return;
        }

        try {
            await api.delete(
                `/admin/users/${userId}`
            );

            await fetchUsers();
        } catch (error) {
            console.error(
                "Delete user error:",
                error
            );

            setError(
                error.response?.data?.message ||
                    "Unable to delete user."
            );
        }
    };

    // =====================================================
    // FILTER USERS
    // =====================================================

    const filteredUsers = useMemo(() => {
        return users.filter((user) => {
            const searchValue =
                search.toLowerCase().trim();

            const matchesSearch =
                !searchValue ||
                user.name
                    ?.toLowerCase()
                    .includes(searchValue) ||
                user.email
                    ?.toLowerCase()
                    .includes(searchValue);

            const matchesRole =
                roleFilter === "all" ||
                user.role === roleFilter;

            return (
                matchesSearch &&
                matchesRole
            );
        });
    }, [users, search, roleFilter]);

    // =====================================================
    // ROLE ICON
    // =====================================================

    const getRoleIcon = (role) => {
        if (role === "admin") {
            return <AdminPanelSettings />;
        }

        if (role === "teacher") {
            return <Person />;
        }

        return <School />;
    };

    // =====================================================
    // ROLE COLOR
    // =====================================================

    const getRoleColor = (role) => {
        if (role === "admin") {
            return "error";
        }

        if (role === "teacher") {
            return "warning";
        }

        return "success";
    };

    // =====================================================
    // USER INITIAL
    // =====================================================

    const getInitial = (name) => {
        if (!name) {
            return "U";
        }

        return name
            .charAt(0)
            .toUpperCase();
    };

    // =====================================================
    // AVATAR
    // =====================================================

   const renderAvatar = (user) => {
    return (
        <Box
            sx={{
                position: "relative",
                width: 70,
                height: 70,
                flexShrink: 0,
            }}
        >
            <Avatar
                src={user.profileImageUrl || undefined}
                alt={user.name || "User"}
                sx={{
                    width: 70,
                    height: 70,
                    bgcolor: "primary.main",
                    fontWeight: 700,
                }}
            >
                {!user.profileImageUrl &&
                    getInitial(user.name)}
            </Avatar>

            {/* Instagram-style online dot */}
            {user.isOnline && (
                <Box
                    sx={{
                        position: "absolute",
                        width: 16,
                        height: 16,
                        borderRadius: "50%",
                        backgroundColor: "#32CD32",

                        // White border like Instagram
                        border: "2px solid white",

                        // Bottom-right of profile picture
                        right: 0,
                        bottom: 0,

                        zIndex: 2,
                        boxSizing: "border-box",
                    }}
                />
            )}
        </Box>
    );


        // =================================================
        // ONLINE DOT
        // ONLY SHOW ON PROFILE PICTURE
        // =================================================

        if (user.isOnline) {
            return (
                <Badge
                    overlap="circular"
                    anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "right",
                    }}
                    sx={{
                        "& .MuiBadge-badge": {
                            right: 3,
                            bottom: 3,
                            padding: 0,
                            minWidth: "auto",
                            height: "auto",
                            backgroundColor:
                                "transparent",
                        },
                    }}
                    badgeContent={
                        <Box
                            sx={{
                                width: 13,
                                height: 13,
                                borderRadius: "50%",
                                bgcolor:
                                    "success.main",
                                border: "2px solid",
                                borderColor:
                                    "background.paper",
                                boxSizing: "border-box",
                            }}
                        />
                    }
                >
                    {avatar}
                </Badge>
            );
        }

        // OFFLINE = NO DOT
        return avatar;
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
                }}
            >
                <CircularProgress />
            </Box>
        );
    }

    // =====================================================
    // PAGE
    // =====================================================

    return (
        <Container
            maxWidth="xl"
            sx={{
                py: {
                    xs: 2.5,
                    sm: 3.5,
                    md: 5,
                },
            }}
        >
            {/* =================================================
                HEADER
            ================================================= */}

            <Paper
                elevation={0}
                sx={{
                    p: {
                        xs: 2.5,
                        sm: 3,
                        md: 4,
                    },
                    mb: 3,
                    borderRadius: 3,
                    border: "1px solid",
                    borderColor: "divider",
                }}
            >
                <Stack
                    direction={{
                        xs: "column",
                        sm: "row",
                    }}
                    spacing={2}
                    alignItems={{
                        xs: "flex-start",
                        sm: "center",
                    }}
                >
                    <Avatar
                        sx={{
                            width: 55,
                            height: 55,
                            bgcolor: "primary.main",
                        }}
                    >
                        <People />
                    </Avatar>

                    <Box sx={{ flex: 1 }}>
                        <Typography
                            variant="h4"
                            fontWeight={800}
                            sx={{
                                fontSize: {
                                    xs: "1.7rem",
                                    sm: "2rem",
                                    md: "2.3rem",
                                },
                            }}
                        >
                            Manage Users
                        </Typography>

                        <Typography
                            color="text.secondary"
                            sx={{
                                mt: 0.5,
                            }}
                        >
                            View and manage all users
                            registered on LearnHub.
                        </Typography>
                    </Box>

                    <Button
                        variant="outlined"
                        startIcon={<Refresh />}
                        onClick={fetchUsers}
                        sx={{
                            textTransform: "none",
                            borderRadius: 2,
                            fontWeight: 600,
                        }}
                    >
                        Refresh
                    </Button>
                </Stack>
            </Paper>

            {/* =================================================
                ERROR
            ================================================= */}

            {error && (
                <Alert
                    severity="error"
                    sx={{
                        mb: 3,
                        borderRadius: 2,
                    }}
                >
                    {error}
                </Alert>
            )}

            {/* =================================================
                FILTERS
            ================================================= */}

            <Paper
                elevation={0}
                sx={{
                    p: {
                        xs: 2,
                        sm: 2.5,
                    },
                    mb: 3,
                    borderRadius: 3,
                    border: "1px solid",
                    borderColor: "divider",
                }}
            >
                <Stack
                    direction={{
                        xs: "column",
                        sm: "row",
                    }}
                    spacing={2}
                >
                    {/* SEARCH */}

                    <TextField
                        fullWidth
                        value={search}
                        onChange={(event) =>
                            setSearch(
                                event.target.value
                            )
                        }
                        placeholder="Search by name or email..."
                        label="Search Users"
                        InputProps={{
                            startAdornment: (
                                <Search
                                    sx={{
                                        mr: 1,
                                        color:
                                            "text.secondary",
                                    }}
                                />
                            ),
                        }}
                    />

                    {/* ROLE FILTER */}

                    <TextField
                        select
                        label="Role"
                        value={roleFilter}
                        onChange={(event) =>
                            setRoleFilter(
                                event.target.value
                            )
                        }
                        sx={{
                            minWidth: {
                                xs: "100%",
                                sm: 180,
                            },
                        }}
                    >
                        <MenuItem value="all">
                            All Roles
                        </MenuItem>

                        <MenuItem value="student">
                            Students
                        </MenuItem>

                        <MenuItem value="teacher">
                            Teachers
                        </MenuItem>

                        <MenuItem value="admin">
                            Admins
                        </MenuItem>
                    </TextField>
                </Stack>
            </Paper>

            {/* =================================================
                USER COUNT
            ================================================= */}

            <Box sx={{ mb: 2 }}>
                <Typography
                    fontWeight={700}
                    color="text.secondary"
                >
                    Showing {filteredUsers.length} of{" "}
                    {users.length} users
                </Typography>
            </Box>

            {/* =================================================
                USERS
            ================================================= */}

            {filteredUsers.length === 0 ? (
                <Paper
                    elevation={0}
                    sx={{
                        p: 5,
                        textAlign: "center",
                        borderRadius: 3,
                        border: "1px solid",
                        borderColor: "divider",
                    }}
                >
                    <People
                        sx={{
                            fontSize: 55,
                            color: "text.secondary",
                            mb: 1,
                        }}
                    />

                    <Typography
                        variant="h6"
                        fontWeight={700}
                    >
                        No users found
                    </Typography>

                    <Typography
                        color="text.secondary"
                        sx={{
                            mt: 0.5,
                        }}
                    >
                        Try changing your search
                        or role filter.
                    </Typography>
                </Paper>
            ) : (
                <Stack spacing={2}>
                    {filteredUsers.map((user) => (
                        <Paper
                            key={user.id}
                            elevation={0}
                            sx={{
                                p: {
                                    xs: 2,
                                    sm: 2.5,
                                },
                                borderRadius: 3,
                                border: "1px solid",
                                borderColor: "divider",
                                transition:
                                    "all 0.2s ease",

                                "&:hover": {
                                    transform:
                                        "translateY(-2px)",
                                    boxShadow:
                                        "0 8px 24px rgba(0,0,0,0.07)",
                                },
                            }}
                        >
                            <Stack
                                direction={{
                                    xs: "column",
                                    sm: "row",
                                }}
                                spacing={2}
                                alignItems={{
                                    xs: "flex-start",
                                    sm: "center",
                                }}
                            >
                                {/* =================================================
                                    PROFILE AVATAR
                                ================================================= */}

                                {renderAvatar(user)}

                                {/* =================================================
                                    USER INFO
                                ================================================= */}

                                <Box
                                    sx={{
                                        flex: 1,
                                        minWidth: 0,
                                    }}
                                >
                                    <Typography
                                        fontWeight={700}
                                        sx={{
                                            wordBreak:
                                                "break-word",
                                        }}
                                    >
                                        {user.name ||
                                            "Unknown User"}
                                    </Typography>

                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                        sx={{
                                            wordBreak:
                                                "break-word",
                                        }}
                                    >
                                        {user.email}
                                    </Typography>

                                    {/* ONLINE TEXT */}

                                    {user.isOnline && (
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                mt: 0.5,
                                                color:
                                                    "success.main",
                                                fontWeight: 700,
                                            }}
                                        >
                                            Online
                                        </Typography>
                                    )}
                                </Box>

                                {/* =================================================
                                    ROLE
                                ================================================= */}

                                <Chip
                                    icon={getRoleIcon(
                                        user.role
                                    )}
                                    label={
                                        user.role ||
                                        "student"
                                    }
                                    color={getRoleColor(
                                        user.role
                                    )}
                                    variant="outlined"
                                    sx={{
                                        textTransform:
                                            "capitalize",
                                        fontWeight: 600,
                                    }}
                                />

                                {/* =================================================
                                    USER ID
                                ================================================= */}

                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{
                                        display: {
                                            xs: "none",
                                            md: "block",
                                        },
                                        minWidth: 70,
                                    }}
                                >
                                    ID: {user.id}
                                </Typography>

                                {/* =================================================
                                    DELETE
                                ================================================= */}

                                <Tooltip title="Delete User">
                                    <IconButton
                                        color="error"
                                        onClick={() =>
                                            handleDeleteUser(
                                                user.id,
                                                user.name
                                            )
                                        }
                                    >
                                        <Delete />
                                    </IconButton>
                                </Tooltip>
                            </Stack>
                        </Paper>
                    ))}
                </Stack>
            )}
        </Container>
    );
};

export default ManageUsers;