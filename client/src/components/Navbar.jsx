import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Box
} from "@mui/material";

import { Link, useNavigate } from "react-router-dom";
const Navbar = () => {

    const navigate = useNavigate();
    const handleLogout = () => {

        localStorage.removeItem("token");

        navigate("/login");
    };


    return (
        <AppBar position="static">
            <Toolbar>
                <Typography
                    variant="h6"
                    sx={{
                        flexGrow: 1
                    }}
                >
                    LearnHub
                </Typography>
                <Box>
                    <Button
                        color="inherit"
                        component={Link}
                        to="/dashboard"
                    >
                        Dashboard
                    </Button>

                    <Button
                        color="inherit"
                        component={Link}
                        to="/profile"
                    >
                        Profile
                    </Button>

                    <Button
                        color="inherit"
                        onClick={handleLogout}
                    >
                        Logout
                    </Button>

                </Box>

            </Toolbar>

        </AppBar>
    );
};


export default Navbar;