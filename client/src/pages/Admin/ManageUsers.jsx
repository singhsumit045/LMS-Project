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
    Pagination,
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
    // PAGINATION
    // =====================================================

    const [page, setPage] = useState(1);

    // Only 5 users per page
    const USERS_PER_PAGE = 5;

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
            setError("");

            await api.delete(
                `/admin/users/${userId}`
            );

            // Remove deleted user directly
            // instead of fetching everything again
            setUsers((prevUsers) =>
                prevUsers.filter(
                    (user) =>
                        Number(user.id) !==
                        Number(userId)
                )
            );

            // Pagination will be corrected
            // automatically below
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
    }, [
        users,
        search,
        roleFilter,
    ]);

    // =====================================================
    // PAGINATION CALCULATION
    // =====================================================

    const totalPages = Math.max(
        1,
        Math.ceil(
            filteredUsers.length /
                USERS_PER_PAGE
        )
    );

    // =====================================================
    // KEEP PAGE VALID
    // =====================================================

    useEffect(() => {
        if (page > totalPages) {
            setPage(totalPages);
        }
    }, [page, totalPages]);

    // =====================================================
    // PAGINATED USERS
    // =====================================================

    const paginatedUsers = useMemo(() => {
        const startIndex =
            (page - 1) *
            USERS_PER_PAGE;

        const endIndex =
            startIndex +
            USERS_PER_PAGE;

        return filteredUsers.slice(
            startIndex,
            endIndex
        );
    }, [
        filteredUsers,
        page,
    ]);

    // =====================================================
    // ROLE ICON
    // =====================================================

    const getRoleIcon = (role) => {
        if (role === "admin") {
            return (
                <AdminPanelSettings
                    sx={{
                        fontSize: 17,
                    }}
                />
            );
        }

        if (role === "teacher") {
            return (
                <Person
                    sx={{
                        fontSize: 17,
                    }}
                />
            );
        }

        return (
            <School
                sx={{
                    fontSize: 17,
                }}
            />
        );
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
                    width: 50,
                    height: 50,
                    flexShrink: 0,
                }}
            >
                <Avatar
                    src={
                        user.profileImageUrl ||
                        undefined
                    }
                    alt={
                        user.name || "User"
                    }
                    sx={{
                        width: 50,
                        height: 50,
                        bgcolor: "primary.main",
                        fontWeight: 700,
                        fontSize: "1rem",
                    }}
                >
                    {!user.profileImageUrl &&
                        getInitial(
                            user.name
                        )}
                </Avatar>

                {/* =================================================
                    ONLINE DOT
                ================================================= */}

                {user.isOnline && (
                    <Box
                        sx={{
                            position: "absolute",

                            width: 12,
                            height: 12,

                            borderRadius: "50%",

                            backgroundColor:
                                "#32CD32",

                            border:
                                "2px solid white",

                            right: -1,
                            bottom: -1,

                            zIndex: 2,

                            boxSizing:
                                "border-box",
                        }}
                    />
                )}
            </Box>
        );
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
                    xs: 2,
                    sm: 3,
                    md: 4,
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
                        xs: 2,
                        sm: 2.5,
                        md: 3,
                    },

                    mb: 2.5,

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
                    spacing={1.5}
                    alignItems={{
                        xs: "flex-start",
                        sm: "center",
                    }}
                >
                    <Avatar
                        sx={{
                            width: 48,
                            height: 48,
                            bgcolor:
                                "primary.main",
                        }}
                    >
                        <People />
                    </Avatar>

                    <Box
                        sx={{
                            flex: 1,
                        }}
                    >
                        <Typography
                            variant="h4"
                            fontWeight={800}
                            sx={{
                                fontSize: {
                                    xs: "1.5rem",
                                    sm: "1.8rem",
                                    md: "2rem",
                                },
                            }}
                        >
                            Manage Users
                        </Typography>

                        <Typography
                            color="text.secondary"
                            sx={{
                                mt: 0.3,
                                fontSize: {
                                    xs: "0.85rem",
                                    sm: "0.9rem",
                                },
                            }}
                        >
                            View and manage all
                            users registered on
                            LearnHub.
                        </Typography>
                    </Box>

                    <Button
                        variant="outlined"
                        size="small"
                        startIcon={<Refresh />}
                        onClick={fetchUsers}
                        sx={{
                            textTransform:
                                "none",
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
                    onClose={() =>
                        setError("")
                    }
                    sx={{
                        mb: 2.5,
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
                        xs: 1.5,
                        sm: 2,
                    },

                    mb: 2,

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
                    spacing={1.5}
                >
                    {/* SEARCH */}

                    <TextField
                        fullWidth
                        size="small"
                        value={search}
                        onChange={(event) => {
                            setSearch(
                                event.target.value
                            );

                            setPage(1);
                        }}
                        placeholder="Search by name or email..."
                        label="Search Users"
                        slotProps={{
                            input: {
                                startAdornment: (
                                    <Search
                                        sx={{
                                            mr: 1,
                                            fontSize: 20,
                                            color:
                                                "text.secondary",
                                        }}
                                    />
                                ),
                            },
                        }}
                    />

                    {/* ROLE FILTER */}

                    <TextField
                        select
                        size="small"
                        label="Role"
                        value={roleFilter}
                        onChange={(event) => {
                            setRoleFilter(
                                event.target.value
                            );

                            setPage(1);
                        }}
                        sx={{
                            minWidth: {
                                xs: "100%",
                                sm: 170,
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

            <Box
                sx={{
                    mb: 1.5,

                    display: "flex",

                    justifyContent:
                        "space-between",

                    alignItems: "center",

                    flexWrap: "wrap",

                    gap: 1,
                }}
            >
                <Typography
                    fontWeight={600}
                    color="text.secondary"
                    fontSize="0.85rem"
                >
                    {filteredUsers.length ===
                    0
                        ? "No users"
                        : `Showing ${
                              (page - 1) *
                                  USERS_PER_PAGE +
                              1
                          } - ${Math.min(
                              page *
                                  USERS_PER_PAGE,
                              filteredUsers.length
                          )} of ${
                              filteredUsers.length
                          } users`}
                </Typography>

                {filteredUsers.length > 0 && (
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        fontSize="0.8rem"
                    >
                        Page {page} of{" "}
                        {totalPages}
                    </Typography>
                )}
            </Box>

            {/* =================================================
                USERS
            ================================================= */}

            {filteredUsers.length === 0 ? (
                <Paper
                    elevation={0}
                    sx={{
                        p: 4,
                        textAlign: "center",
                        borderRadius: 3,
                        border: "1px solid",
                        borderColor: "divider",
                    }}
                >
                    <People
                        sx={{
                            fontSize: 45,
                            color:
                                "text.secondary",
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
                            fontSize: "0.9rem",
                        }}
                    >
                        Try changing your
                        search or role
                        filter.
                    </Typography>
                </Paper>
            ) : (
                <>
                    {/* =================================================
                        USER LIST
                    ================================================= */}

                    <Stack spacing={1.2}>
                        {paginatedUsers.map(
                            (user) => (
                                <Paper
                                    key={user.id}
                                    elevation={0}
                                    sx={{
                                        p: {
                                            xs: 1.5,
                                            sm: 1.7,
                                        },

                                        borderRadius: 2.5,

                                        border:
                                            "1px solid",

                                        borderColor:
                                            "divider",

                                        transition:
                                            "all 0.2s ease",

                                        "&:hover":
                                            {
                                                transform:
                                                    "translateY(-2px)",

                                                boxShadow:
                                                    "0 6px 18px rgba(0,0,0,0.06)",
                                            },
                                    }}
                                >
                                    <Stack
                                        direction={{
                                            xs: "column",
                                            sm: "row",
                                        }}
                                        spacing={{
                                            xs: 1.2,
                                            sm: 1.5,
                                        }}
                                        alignItems={{
                                            xs: "flex-start",
                                            sm: "center",
                                        }}
                                    >
                                        {/* =================================================
                                            PROFILE AVATAR
                                        ================================================= */}

                                        {renderAvatar(
                                            user
                                        )}

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
                                                fontWeight={
                                                    700
                                                }
                                                fontSize={{
                                                    xs: "0.95rem",
                                                    sm: "1rem",
                                                }}
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
                                                fontSize={{
                                                    xs: "0.78rem",
                                                    sm: "0.82rem",
                                                }}
                                                sx={{
                                                    wordBreak:
                                                        "break-word",
                                                }}
                                            >
                                                {
                                                    user.email
                                                }
                                            </Typography>

                                            {/* ONLINE TEXT */}

                                            {user.isOnline && (
                                                <Typography
                                                    variant="body2"
                                                    sx={{
                                                        mt: 0.2,
                                                        color:
                                                            "success.main",
                                                        fontWeight:
                                                            600,
                                                        fontSize:
                                                            "0.75rem",
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
                                            size="small"
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

                                                fontWeight:
                                                    600,

                                                fontSize:
                                                    "0.72rem",

                                                height: 28,

                                                "& .MuiChip-icon":
                                                    {
                                                        fontSize: 16,
                                                    },
                                            }}
                                        />

                                        {/* =================================================
                                            USER ID
                                        ================================================= */}

                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                            fontSize="0.78rem"
                                            sx={{
                                                display: {
                                                    xs: "none",
                                                    md: "block",
                                                },

                                                minWidth: 55,
                                            }}
                                        >
                                            ID:{" "}
                                            {
                                                user.id
                                            }
                                        </Typography>

                                        {/* =================================================
                                            DELETE
                                        ================================================= */}

                                        <Tooltip
                                            title="Delete User"
                                        >
                                            <IconButton
                                                color="error"
                                                size="small"
                                                onClick={() =>
                                                    handleDeleteUser(
                                                        user.id,
                                                        user.name
                                                    )
                                                }
                                                sx={{
                                                    ml: {
                                                        sm: 0.5,
                                                    },
                                                }}
                                            >
                                                <Delete
                                                    fontSize="small"
                                                />
                                            </IconButton>
                                        </Tooltip>
                                    </Stack>
                                </Paper>
                            )
                        )}
                    </Stack>

                    {/* =================================================
                        PAGINATION
                    ================================================= */}

                    {totalPages > 1 && (
                        <Box
                            sx={{
                                display: "flex",

                                justifyContent:
                                    "center",

                                alignItems:
                                    "center",

                                mt: 3,

                                mb: 1,
                            }}
                        >
                            <Pagination
                                count={
                                    totalPages
                                }
                                page={page}
                                onChange={(
                                    _event,
                                    value
                                ) => {
                                    setPage(
                                        value
                                    );

                                    window.scrollTo(
                                        {
                                            top: 0,
                                            behavior:
                                                "smooth",
                                        }
                                    );
                                }}
                                color="primary"
                                size="small"
                                showFirstButton
                                showLastButton
                            />
                        </Box>
                    )}
                </>
            )}
        </Container>
    );
};

export default ManageUsers;