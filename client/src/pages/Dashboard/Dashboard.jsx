import { Container, Paper, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {

    const navigate = useNavigate();

    const logout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };


    return (
        <Container sx={{ mt: 8 }}>

            <Paper
                elevation={5}
                sx={{
                    p: 4,
                    textAlign: "center",
                }}
            >

                <Typography variant="h4">
                    Welcome to LearnHub Dashboard 🚀
                </Typography>

                <Typography mt={2}>
                    You are logged in successfully.
                </Typography>


                <Button
                    variant="contained"
                    sx={{ mt: 3 }}
                    onClick={logout}
                >
                    Logout
                </Button>

            </Paper>

        </Container>
    );
};

export default Dashboard;