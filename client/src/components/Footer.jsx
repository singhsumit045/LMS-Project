import {
    Box,
    Container,
    Typography,
    Stack,
    Link,
    Divider,
} from "@mui/material";

import {
    School,
    GitHub,
    LinkedIn,
} from "@mui/icons-material";

import { Link as RouterLink } from "react-router-dom";


const Footer = () => {

    return (
        <Box
            component="footer"
            sx={{
                mt: 8,
                backgroundColor: "primary.main",
                color: "primary.contrastText",
            }}
        >

            <Container
                maxWidth="xl"
                sx={{
                    py: {
                        xs: 5,
                        md: 7,
                    },
                }}
            >

                <Stack
                    direction={{
                        xs: "column",
                        md: "row",
                    }}
                    spacing={{
                        xs: 4,
                        md: 8,
                    }}
                    justifyContent="space-between"
                >

                    {/* BRAND */}

                    <Box
                        sx={{
                            maxWidth: 360,
                        }}
                    >

                        <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center"
                        >

                            <School />

                            <Typography
                                variant="h5"
                                fontWeight={700}
                            >
                                LearnHub
                            </Typography>

                        </Stack>


                        <Typography
                            sx={{
                                mt: 2,
                                opacity: 0.85,
                                lineHeight: 1.7,
                            }}
                        >
                            Learn practical skills, build real-world
                            projects, and grow your career with LearnHub.
                        </Typography>

                    </Box>


                    {/* QUICK LINKS */}

                    <Box>

                        <Typography
                            variant="h6"
                            fontWeight={700}
                            gutterBottom
                        >
                            Quick Links
                        </Typography>


                        <Stack spacing={1}>

                            <Link
                                component={RouterLink}
                                to="/dashboard"
                                color="inherit"
                                underline="hover"
                            >
                                Dashboard
                            </Link>


                            <Link
                                component={RouterLink}
                                to="/courses"
                                color="inherit"
                                underline="hover"
                            >
                                Courses
                            </Link>


                            <Link
                                component={RouterLink}
                                to="/profile"
                                color="inherit"
                                underline="hover"
                            >
                                Profile
                            </Link>

                        </Stack>

                    </Box>


                    {/* SUPPORT */}

                    <Box>

                        <Typography
                            variant="h6"
                            fontWeight={700}
                            gutterBottom
                        >
                            Support
                        </Typography>


                        <Stack spacing={1}>

                            <Link
                                href="#"
                                color="inherit"
                                underline="hover"
                            >
                                Help Center
                            </Link>


                            <Link
                                href="#"
                                color="inherit"
                                underline="hover"
                            >
                                Contact Us
                            </Link>


                            <Link
                                href="#"
                                color="inherit"
                                underline="hover"
                            >
                                Privacy Policy
                            </Link>

                        </Stack>

                    </Box>


                    {/* SOCIAL */}

                    <Box>

                        <Typography
                            variant="h6"
                            fontWeight={700}
                            gutterBottom
                        >
                            Follow Us
                        </Typography>


                        <Stack
                            direction="row"
                            spacing={1}
                        >

                            <Link
                                href="#"
                                color="inherit"
                                aria-label="GitHub"
                            >
                                <GitHub />
                            </Link>


                            <Link
                                href="#"
                                color="inherit"
                                aria-label="LinkedIn"
                            >
                                <LinkedIn />
                            </Link>

                        </Stack>

                    </Box>

                </Stack>

            </Container>


            <Divider
                sx={{
                    borderColor:
                        "rgba(255,255,255,0.2)",
                }}
            />


            {/* COPYRIGHT */}

            <Container
                maxWidth="xl"
                sx={{
                    py: 2.5,
                }}
            >

                <Typography
                    variant="body2"
                    align="center"
                    sx={{
                        opacity: 0.8,
                    }}
                >
                    © {new Date().getFullYear()} LearnHub.
                    All rights reserved.
                </Typography>

            </Container>

        </Box>
    );
};


export default Footer;