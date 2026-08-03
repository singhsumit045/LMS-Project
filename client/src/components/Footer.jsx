
import {
  Box,
  Container,
  Typography,
  Stack,
  Link,
  Divider,
  IconButton,
} from "@mui/material";

import {
  GitHub,
  LinkedIn,
  Email,
  ArrowForward,
} from "@mui/icons-material";

import { Link as RouterLink } from "react-router-dom";

import logo from "../assets/LearnHub.png";

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
            xs: 5,
            md: 8,
          }}
          sx={{
            justifyContent: "space-between",
          }}
        >
          {/* =========================
              BRAND
          ========================= */}

          <Box
            sx={{
              maxWidth: 380,
            }}
          >
            {/* LOGO */}

            <Box
              component={RouterLink}
              to="/"
              sx={{
                display: "inline-flex",
                alignItems: "center",
                textDecoration: "none",
                mb: 2,
              }}
            >

              <Box
                component="img"
                src={logo}
                alt="LearnHub"
                sx={{
                  width: 150,
                  height: "auto",
                  maxHeight: 55,
                  objectFit: "contain",
                  display: "block",
                  borderRadius: 1,
                }}
              />
            </Box>

            <Typography
              sx={{
                opacity: 0.82,
                lineHeight: 1.8,
              }}
            >
              Learn practical skills, build real-world
              projects, and grow your career with LearnHub.
            </Typography>

            {/* EMAIL */}

            <Stack
              direction="row"
              spacing={1}
              sx={{
                mt: 2,
                opacity: 0.9,
                alignItems: "center",
              }}
            >
              <Email fontSize="small" />

              <Typography variant="body2">
                support@learnhub.com
              </Typography>
            </Stack>
          </Box>

          {/* =========================
              QUICK LINKS
          ========================= */}

          <Box>
            <Typography
              variant="h6"
              fontWeight={700}
              sx={{ mb: 2 }}
            >
              Quick Links
            </Typography>

            <Stack spacing={1.3}>
              <Link
                component={RouterLink}
                to="/dashboard"
                color="inherit"
                underline="none"
                sx={{
                  opacity: 0.82,
                  transition: "0.2s",
                  "&:hover": {
                    opacity: 1,
                    transform: "translateX(4px)",
                  },
                }}
              >
                Dashboard
              </Link>

              <Link
                component={RouterLink}
                to="/courses"
                color="inherit"
                underline="none"
                sx={{
                  opacity: 0.82,
                  transition: "0.2s",
                  "&:hover": {
                    opacity: 1,
                    transform: "translateX(4px)",
                  },
                }}
              >
                Courses
              </Link>

              <Link
                component={RouterLink}
                to="/my-courses"
                color="inherit"
                underline="none"
                sx={{
                  opacity: 0.82,
                  transition: "0.2s",
                  "&:hover": {
                    opacity: 1,
                    transform: "translateX(4px)",
                  },
                }}
              >
                My Courses
              </Link>

              <Link
                component={RouterLink}
                to="/profile"
                color="inherit"
                underline="none"
                sx={{
                  opacity: 0.82,
                  transition: "0.2s",
                  "&:hover": {
                    opacity: 1,
                    transform: "translateX(4px)",
                  },
                }}
              >
                Profile
              </Link>
            </Stack>
          </Box>

          {/* =========================
              SUPPORT
          ========================= */}

          <Box>
            <Typography
              variant="h6"
              fontWeight={700}
              sx={{ mb: 2 }}
            >
              Support
            </Typography>

            <Stack spacing={1.3}>
              <Link
                component={RouterLink}
                to="/help"
                color="inherit"
                underline="none"
                sx={{
                  opacity: 0.82,
                  transition: "0.2s",
                  "&:hover": {
                    opacity: 1,
                    transform: "translateX(4px)",
                  },
                }}
              >
                Help Center
              </Link>

              <Link
                component={RouterLink}
                to="/contact"
                color="inherit"
                underline="none"
                sx={{
                  opacity: 0.82,
                  transition: "0.2s",
                  "&:hover": {
                    opacity: 1,
                    transform: "translateX(4px)",
                  },
                }}
              >
                Contact Us
              </Link>

              <Link
                component={RouterLink}
                to="/privacy"
                color="inherit"
                underline="none"
                sx={{
                  opacity: 0.82,
                  transition: "0.2s",
                  "&:hover": {
                    opacity: 1,
                    transform: "translateX(4px)",
                  },
                }}
              >
                Privacy Policy
              </Link>
            </Stack>
          </Box>

          {/* =========================
              SOCIAL
          ========================= */}

          <Box>
            <Typography
              variant="h6"
              fontWeight={700}
              sx={{ mb: 2 }}
            >
              Follow Us
            </Typography>

            <Stack
              direction="row"
              spacing={1}
            >
              {/* =========================
                  GITHUB
              ========================= */}

              <IconButton
                component="a"
                href="https://github.com/singhsumit045"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub Profile"
                sx={{
                  color: "inherit",
                  backgroundColor:
                    "rgba(255,255,255,0.1)",
                  transition: "0.2s",

                  "&:hover": {
                    backgroundColor:
                      "rgba(255,255,255,0.2)",
                    transform: "translateY(-3px)",
                  },
                }}
              >
                <GitHub />
              </IconButton>

              {/* =========================
                  LINKEDIN
              ========================= */}

              <IconButton
                component="a"
                href="https://www.linkedin.com/in/sumit-kumar-b9305738b/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn Profile"
                sx={{
                  color: "inherit",
                  backgroundColor:
                    "rgba(255,255,255,0.1)",
                  transition: "0.2s",

                  "&:hover": {
                    backgroundColor:
                      "rgba(255,255,255,0.2)",
                    transform: "translateY(-3px)",
                  },
                }}
              >
                <LinkedIn />
              </IconButton>
            </Stack>

            <Typography
              variant="body2"
              sx={{
                mt: 2,
                opacity: 0.75,
                maxWidth: 220,
              }}
            >
              Stay connected with LearnHub and
              keep learning.
            </Typography>
          </Box>
        </Stack>
      </Container>

      {/* =========================
          DIVIDER
      ========================= */}

      <Divider
        sx={{
          borderColor:
            "rgba(255,255,255,0.18)",
        }}
      />

      {/* =========================
          COPYRIGHT
      ========================= */}

      <Container
        maxWidth="xl"
        sx={{
          py: 2.5,
        }}
      >
        <Stack
          direction={{
            xs: "column",
            sm: "row",
          }}
          spacing={1}
          sx={{
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography
            variant="body2"
            sx={{
              opacity: 0.75,
            }}
          >
            © {new Date().getFullYear()} LearnHub.
            All rights reserved.
          </Typography>

          <Stack
            direction="row"
            spacing={0.5}
            sx={{
              alignItems: "center",
            }}
          >
            <Typography
              variant="body2"
              sx={{
                opacity: 0.75,
              }}
            >
              Keep learning
            </Typography>

            <ArrowForward
              sx={{
                fontSize: 17,
                opacity: 0.75,
              }}
            />
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
};

export default Footer;

