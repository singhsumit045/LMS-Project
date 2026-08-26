import {
    Alert,
    Avatar,
    Box,
    Button,
    Chip,
    CircularProgress,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    IconButton,
    Menu,
    MenuItem,
    Pagination,
    Paper,
    Stack,
    TextField,
    Tooltip,
    Typography,
} from "@mui/material";

import {
    AdminPanelSettings,
    Delete,
    People,
    Person,
    Refresh,
    School,
    Search,
} from "@mui/icons-material";

import {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";

import api from "../../services/api";
import socket from "../../services/socket";

const USERS_PER_PAGE = 5;

const ManageUsers = () => {
    // =====================================================
    // STATE
    // =====================================================

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [roleFilter, setRoleFilter] = useState("all");
    const [page, setPage] = useState(1);

    // ROLE CHANGE STATE

    const [updatingRoleId, setUpdatingRoleId] = useState(null);
    const [menuAnchor, setMenuAnchor] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const [confirmDialog, setConfirmDialog] = useState({
        open: false,
        userId: null,
        userName: "",
        newRole: "",
    });

    // =====================================================
    // FETCH USERS
    // =====================================================

    const fetchUsers = useCallback(async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/admin/users");

            const data = response?.data;

            setUsers(
                Array.isArray(data)
                    ? data
                    : []
            );
        } catch (err) {
            console.error(
                "Fetch users error:",
                err
            );

            setError(
                err?.response?.data?.message ||
                "Unable to load users."
            );
        } finally {
            setLoading(false);
        }
    }, []);

    // =====================================================
    // INITIAL LOAD
    // =====================================================

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    // =====================================================
    // SOCKET ONLINE / OFFLINE
    // =====================================================

    useEffect(() => {
        const handleUserOnline = ({
            userId,
        }) => {
            setUsers((prevUsers) =>
                prevUsers.map((user) =>
                    Number(user.id) ===
                        Number(userId)
                        ? {
                            ...user,
                            isOnline: true,
                        }
                        : user
                )
            );
        };

        const handleUserOffline = ({
            userId,
        }) => {
            setUsers((prevUsers) =>
                prevUsers.map((user) =>
                    Number(user.id) ===
                        Number(userId)
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

    const handleDeleteUser = useCallback(
        async (userId, userName) => {
            const confirmed =
                window.confirm(
                    `Are you sure you want to delete ${userName ||
                    "this user"
                    }?`
                );

            if (!confirmed) {
                return;
            }

            try {
                setError("");

                await api.delete(
                    `/admin/users/${userId}`
                );

                setUsers((prevUsers) =>
                    prevUsers.filter(
                        (user) =>
                            Number(user.id) !==
                            Number(userId)
                    )
                );
            } catch (err) {
                console.error(
                    "Delete user error:",
                    err
                );

                setError(
                    err?.response?.data
                        ?.message ||
                    "Unable to delete user."
                );
            }
        },
        []
    );

    // =====================================================
    // ROLE MENU OPEN/CLOSE
    // =====================================================

    const handleRoleMenuOpen = (event, user) => {
        setMenuAnchor(event.currentTarget);
        setSelectedUser(user);
    };

    const handleRoleMenuClose = () => {
        setMenuAnchor(null);
        setSelectedUser(null);
    };

    // =====================================================
    // ROLE SELECT FROM MENU -> OPEN CONFIRMATION
    // =====================================================

    const handleRoleSelect = (newRole) => {
        if (!selectedUser || newRole === selectedUser.role) {
            handleRoleMenuClose();
            return;
        }

        setConfirmDialog({
            open: true,
            userId: selectedUser.id,
            userName: selectedUser.name,
            newRole,
        });

        handleRoleMenuClose();
    };

    // =====================================================
    // CONFIRM ROLE UPDATE
    // =====================================================

    const handleConfirmRoleUpdate = useCallback(async () => {
        const { userId, newRole } = confirmDialog;

        try {
            setUpdatingRoleId(userId);
            setError("");

            await api.patch(`/admin/users/${userId}/role`, {
                role: newRole,
            });

            setUsers((prevUsers) =>
                prevUsers.map((user) =>
                    Number(user.id) === Number(userId)
                        ? { ...user, role: newRole }
                        : user
                )
            );
        } catch (err) {
            console.error("Update role error:", err);

            setError(
                err?.response?.data?.message ||
                "Unable to update role."
            );
        } finally {
            setUpdatingRoleId(null);
            setConfirmDialog({
                open: false,
                userId: null,
                userName: "",
                newRole: "",
            });
        }
    }, [confirmDialog]);

    const handleCancelRoleUpdate = () => {
        setConfirmDialog({
            open: false,
            userId: null,
            userName: "",
            newRole: "",
        });
    };

    // =====================================================
    // FILTER USERS
    // =====================================================

    const filteredUsers = useMemo(() => {
        const searchValue = search
            .toLowerCase()
            .trim();

        return users.filter((user) => {
            const name = String(
                user?.name || ""
            ).toLowerCase();

            const email = String(
                user?.email || ""
            ).toLowerCase();

            const role = String(
                user?.role || "student"
            ).toLowerCase();

            const matchesSearch =
                !searchValue ||
                name.includes(
                    searchValue
                ) ||
                email.includes(
                    searchValue
                );

            const matchesRole =
                roleFilter === "all" ||
                role === roleFilter;

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
    // PAGINATION
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
        setPage((currentPage) =>
            currentPage > totalPages
                ? totalPages
                : currentPage
        );
    }, [totalPages]);

    // =====================================================
    // PAGINATED USERS
    // =====================================================

    const paginatedUsers = useMemo(() => {
        const startIndex =
            (page - 1) *
            USERS_PER_PAGE;

        return filteredUsers.slice(
            startIndex,
            startIndex +
            USERS_PER_PAGE
        );
    }, [
        filteredUsers,
        page,
    ]);

    // =====================================================
    // ROLE ICON
    // =====================================================

    const getRoleIcon = (role) => {
        switch (role) {
            case "admin":
                return (
                    <AdminPanelSettings
                        sx={{
                            fontSize: 17,
                        }}
                    />
                );

            case "teacher":
                return (
                    <Person
                        sx={{
                            fontSize: 17,
                        }}
                    />
                );

            default:
                return (
                    <School
                        sx={{
                            fontSize: 17,
                        }}
                    />
                );
        }
    };

    // =====================================================
    // ROLE COLOR
    // =====================================================

    const getRoleColor = (role) => {
        switch (role) {
            case "admin":
                return "error";

            case "teacher":
                return "warning";

            default:
                return "success";
        }
    };

    // =====================================================
    // INITIAL
    // =====================================================

    const getInitial = (name) => {
        const safeName = String(
            name || ""
        ).trim();

        if (!safeName) {
            return "U";
        }

        return safeName
            .charAt(0)
            .toUpperCase();
    };

    // =====================================================
    // AVATAR
    // =====================================================

    const renderAvatar = (user) => {
        const image =
            user?.profileImageUrl ||
            "";

        return (
            <Box
                sx={{
                    position:
                        "relative",
                    width: 50,
                    height: 50,
                    flexShrink: 0,
                }}
            >
                <Avatar
                    src={
                        image || undefined
                    }
                    alt={
                        user?.name ||
                        "User"
                    }
                    sx={{
                        width: 50,
                        height: 50,
                        bgcolor:
                            "primary.main",
                        fontWeight: 700,
                        fontSize:
                            "1rem",
                    }}
                >
                    {!image &&
                        getInitial(
                            user?.name
                        )}
                </Avatar>

                {user?.isOnline && (
                    <Box
                        aria-label="Online"
                        sx={{
                            position:
                                "absolute",
                            width: 12,
                            height: 12,
                            borderRadius:
                                "50%",
                            bgcolor:
                                "success.main",
                            border:
                                "2px solid",
                            borderColor:
                                "background.paper",
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
    // SEARCH
    // =====================================================

    const handleSearchChange = (
        event
    ) => {
        setSearch(
            event.target.value
        );
        setPage(1);
    };

    // =====================================================
    // ROLE FILTER
    // =====================================================

    const handleRoleChange = (
        event
    ) => {
        setRoleFilter(
            event.target.value
        );
        setPage(1);
    };

    // =====================================================
    // PAGE CHANGE
    // =====================================================

    const handlePageChange = (
        _event,
        value
    ) => {
        setPage(value);

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
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
                    justifyContent:
                        "center",
                    alignItems:
                        "center",
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
                    borderColor:
                        "divider",
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: {
                            xs: "column",
                            sm: "row",
                        },
                        gap: 1.5,
                        alignItems: {
                            xs: "flex-start",
                            sm: "center",
                        },
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
                            minWidth: 0,
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
                            View and manage
                            all users
                            registered on
                            LearnHub.
                        </Typography>
                    </Box>

                    <Button
                        variant="outlined"
                        size="small"
                        startIcon={
                            <Refresh />
                        }
                        onClick={
                            fetchUsers
                        }
                        sx={{
                            textTransform:
                                "none",
                            borderRadius: 2,
                            fontWeight: 600,
                        }}
                    >
                        Refresh
                    </Button>
                </Box>
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
                    borderColor:
                        "divider",
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: {
                            xs: "column",
                            sm: "row",
                        },
                        gap: 1.5,
                    }}
                >
                    {/* SEARCH */}

                    <TextField
                        fullWidth
                        size="small"
                        value={search}
                        onChange={
                            handleSearchChange
                        }
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

                    {/* ROLE */}

                    <TextField
                        select
                        size="small"
                        label="Role"
                        value={
                            roleFilter
                        }
                        onChange={
                            handleRoleChange
                        }
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
                </Box>
            </Paper>

            {/* =================================================
                COUNT
            ================================================= */}

            <Box
                sx={{
                    mb: 1.5,
                    display: "flex",
                    justifyContent:
                        "space-between",
                    alignItems: "center",
                    flexWrap:
                        "wrap",
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
                        : `Showing ${(page - 1) *
                        USERS_PER_PAGE +
                        1
                        } - ${Math.min(
                            page *
                            USERS_PER_PAGE,
                            filteredUsers.length
                        )} of ${filteredUsers.length
                        } users`}
                </Typography>

                {filteredUsers.length >
                    0 && (
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
                NO USERS
            ================================================= */}

            {filteredUsers.length ===
                0 ? (
                <Paper
                    elevation={0}
                    sx={{
                        p: 4,
                        textAlign:
                            "center",
                        borderRadius: 3,
                        border: "1px solid",
                        borderColor:
                            "divider",
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
                            fontSize:
                                "0.9rem",
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

                    <Box
                        sx={{
                            height: {
                                xs: "55vh",
                                sm: "60vh",
                                md: "65vh",
                            },

                            overflowY: "scroll",

                            display: "flex",
                            flexDirection: "column",
                            gap: 1.2,

                            pr: 1,

                            scrollbarWidth: "thin",

                            "&::-webkit-scrollbar": {
                                width: "8px",
                            },

                            "&::-webkit-scrollbar-thumb": {
                                backgroundColor: "rgba(120,120,120,0.45)",
                                borderRadius: "10px",
                            },

                            "&::-webkit-scrollbar-thumb:hover": {
                                backgroundColor: "rgba(120,120,120,0.7)",
                            },

                            "&::-webkit-scrollbar-track": {
                                backgroundColor: "transparent",
                            },
                        }}
                    >
                        {filteredUsers.map(
                            (user) => {
                                const role =
                                    String(
                                        user?.role ||
                                        "student"
                                    ).toLowerCase();

                                return (
                                    <Paper
                                        key={
                                            user.id
                                        }
                                        elevation={
                                            0
                                        }
                                        sx={{
                                            p: {
                                                xs: 1.5,
                                                sm: 1.7,
                                            },
                                            borderRadius: 2.5,
                                            border: "1px solid",
                                            borderColor:
                                                "divider",
                                            transition:
                                                "transform 0.2s ease, box-shadow 0.2s ease",
                                            "&:hover":
                                            {
                                                transform:
                                                    "translateY(-2px)",
                                                boxShadow:
                                                    "0 6px 18px rgba(0,0,0,0.06)",
                                            },
                                        }}
                                    >
                                        {/* USER ROW */}

                                        <Box
                                            sx={{
                                                display:
                                                    "flex",
                                                flexDirection:
                                                {
                                                    xs: "column",
                                                    sm: "row",
                                                },
                                                gap: {
                                                    xs: 1.2,
                                                    sm: 1.5,
                                                },
                                                alignItems:
                                                {
                                                    xs: "flex-start",
                                                    sm: "center",
                                                },
                                            }}
                                        >
                                            {/* AVATAR */}

                                            {renderAvatar(
                                                user
                                            )}

                                            {/* USER INFO */}

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
                                                    {user?.name ||
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
                                                    {user?.email ||
                                                        "No email"}
                                                </Typography>

                                                {user?.isOnline && (
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

                                            {/* ROLE - click to change */}

                                            <Tooltip title="Click to change role">
                                                <Chip
                                                    size="small"
                                                    icon={
                                                        updatingRoleId === user.id ? (
                                                            <CircularProgress
                                                                size={12}
                                                                color="inherit"
                                                            />
                                                        ) : (
                                                            getRoleIcon(role)
                                                        )
                                                    }
                                                    label={
                                                        role
                                                    }
                                                    color={getRoleColor(
                                                        role
                                                    )}
                                                    variant="outlined"
                                                    onClick={(e) =>
                                                        handleRoleMenuOpen(e, user)
                                                    }
                                                    disabled={
                                                        updatingRoleId === user.id
                                                    }
                                                    sx={{
                                                        textTransform:
                                                            "capitalize",
                                                        fontWeight:
                                                            600,
                                                        fontSize:
                                                            "0.72rem",
                                                        height: 28,
                                                        cursor: "pointer",
                                                        "& .MuiChip-icon":
                                                        {
                                                            fontSize: 16,
                                                        },
                                                        "&:hover": {
                                                            opacity: 0.85,
                                                        },
                                                    }}
                                                />
                                            </Tooltip>

                                            {/* USER ID */}

                                            <Typography
                                                variant="body2"
                                                color="text.secondary"
                                                fontSize="0.78rem"
                                                sx={{
                                                    display:
                                                    {
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

                                            {/* DELETE */}

                                            <Tooltip title="Delete User">
                                                <IconButton
                                                    color="error"
                                                    size="small"
                                                    aria-label={`Delete ${user?.name ||
                                                        "user"
                                                        }`}
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
                                                    <Delete fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                        </Box>
                                    </Paper>
                                );
                            }
                        )}
                    </Box>

                    {/* =================================================
                        PAGINATION
                    ================================================= */}

                    {totalPages > 1 && (
                        <Box
                            sx={{
                                display:
                                    "flex",
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
                                onChange={
                                    handlePageChange
                                }
                                color="primary"
                                size="small"
                                showFirstButton
                                showLastButton
                            />
                        </Box>
                    )}
                </>
            )}

            {/* =================================================
                ROLE CHANGE MENU
            ================================================= */}

            <Menu
                anchorEl={menuAnchor}
                open={Boolean(menuAnchor)}
                onClose={handleRoleMenuClose}
            >
                <MenuItem onClick={() => handleRoleSelect("student")}>
                    <School sx={{ fontSize: 18, mr: 1 }} /> Student
                </MenuItem>
                <MenuItem onClick={() => handleRoleSelect("teacher")}>
                    <Person sx={{ fontSize: 18, mr: 1 }} /> Teacher
                </MenuItem>
                <MenuItem onClick={() => handleRoleSelect("admin")}>
                    <AdminPanelSettings sx={{ fontSize: 18, mr: 1 }} /> Admin
                </MenuItem>
            </Menu>

            {/* =================================================
                ROLE CHANGE CONFIRMATION DIALOG
            ================================================= */}

            <Dialog
                open={confirmDialog.open}
                onClose={handleCancelRoleUpdate}
            >
                <DialogTitle fontWeight={700}>
                    Change User Role
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to change{" "}
                        <strong>{confirmDialog.userName}</strong>'s role to{" "}
                        <strong style={{ textTransform: "capitalize" }}>
                            {confirmDialog.newRole}
                        </strong>
                        ? This will immediately change their access
                        permissions.
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={handleCancelRoleUpdate} color="inherit">
                        Cancel
                    </Button>
                    <Button
                        onClick={handleConfirmRoleUpdate}
                        variant="contained"
                        color="primary"
                    >
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default ManageUsers;
