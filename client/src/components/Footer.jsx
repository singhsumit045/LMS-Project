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
  GitHub, LinkedIn, Email,
} from "@mui/icons-material";

import { Link as RouterLink } from "react-router-dom";

import { useTheme } from "@mui/material/styles";

import logo from "../assets/LearnHub-removebg-preview.webp";

const Footer = () => {
  const theme = useTheme();

  const linkStyles = {
    opacity: 0.82,
    transition: "all 0.2s ease",
    display: "inline-block",

    "&:hover": {
      opacity: 1,
      transform: "translateX(4px)",
    },
  };

  const socialButtonStyles = {
    color: theme.palette.primary.contrastText,

    backgroundColor:
      theme.palette.mode === "dark"
        ? "rgba(255,255,255,0.08)"
        : "rgba(255,255,255,0.14)",

    border:
      theme.palette.mode === "dark"
        ? "1px solid rgba(255,255,255,0.10)"
        : "1px solid rgba(255,255,255,0.16)",

    transition: "all 0.2s ease",

    "&:hover": {
      backgroundColor:
        theme.palette.mode === "dark"
          ? "rgba(255,255,255,0.16)"
          : "rgba(255,255,255,0.24)",

      transform: "translateY(-3px)",
    },
  };

  return (
    <Box
      component="footer"
      sx={{
        mt: 8,

        /*
         * Theme based footer.
         * Same primary/secondary colors used
         * by the application theme.
         */
        background:
          "linear-gradient(135deg, #0B4F8A 0%, #1769AA 50%, #3B82C4 100%)",
        color: theme.palette.primary.contrastText,

        borderRadius: "24px 24px 0 0",

        overflow: "hidden",

        transition: "background 0.3s ease",
      }}
    > 
      {/* =====================================================
          MAIN FOOTER
      ===================================================== */}

      <Container
        maxWidth="xl"
        sx={{
          py: {
            xs: 5,
            sm: 6,
            md: 7,
          },

          px: {
            xs: 2.5,
            sm: 3,
            md: 4,
          },
        }}
      >
        <Stack
          direction={{
            xs: "column", md: "row",
          }}
          spacing={{
            xs: 5,
            md: 6,
            lg: 8,
          }}
          sx={{
            justifyContent: "space-between", 
          }}
        >
          {/* =================================================
              BRAND
          ================================================= */}

          <Box
            sx={{
              maxWidth: 380,
            }}
          >
            {/* LOGO */}

            <Box
              component={RouterLink}
              to="/"
              aria-label="LearnHub - Go to homepage"
              sx={{
                display: "inline-flex",
                alignItems: "center",

                textDecoration: "none",

                mb: 2,

                transition: "transform 0.2s ease",

                "&:hover": {
                  transform: "translateY(-2px)",
                },
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
                    md: 150,
                  },

                  height: {
                    xs: 65,
                    sm: 70,
                    md: 75,
                  },

                  objectFit: "contain",

                  objectPosition: "left center",

                  display: "block",
                }}
              />
            </Box>

            {/* DESCRIPTION */}

            <Typography
              sx={{
                opacity: 0.82,

                lineHeight: 1.8,

                maxWidth: 360,

                fontSize: {
                  xs: "0.9rem",
                  sm: "0.95rem",
                },
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

              <Typography
                variant="body2"
                sx={{
                  wordBreak: "break-word",
                }}
              >
                learnhub.lms@gmail.com
              </Typography>
            </Stack>
          </Box>

          {/* =================================================
              QUICK LINKS
          ================================================= */}

          <Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                mb: 2,
                fontSize: "1rem"
              }}>
              Quick Links
            </Typography>

            <Stack spacing={1.3}>
              <Link
                component={RouterLink}
                to="/dashboard"
                color="inherit"
                underline="none"
                sx={linkStyles}
              >
                Dashboard
              </Link>

              <Link
                component={RouterLink}
                to="/courses"
                color="inherit"
                underline="none"
                sx={linkStyles}
              >
                Courses
              </Link>

              <Link
                component={RouterLink}
                to="/my-courses"
                color="inherit"
                underline="none"
                sx={linkStyles}
              >
                My Courses
              </Link>

              <Link
                component={RouterLink}
                to="/profile"
                color="inherit"
                underline="none"
                sx={linkStyles}
              >
                Profile
              </Link>
            </Stack>
          </Box>

          {/* =================================================
              SUPPORT
          ================================================= */}

          <Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                mb: 2,
                fontSize: "1rem"
              }}>
              Support
            </Typography>

            <Stack spacing={1.3}>
              <Link
                component={RouterLink}
                to="/help"
                color="inherit"
                underline="none"
                sx={linkStyles}
              >
                Help Center
              </Link>

              <Link
                component={RouterLink}
                to="/contact"
                color="inherit"
                underline="none"
                sx={linkStyles}
              >
                Contact Us
              </Link>

              <Link
                component={RouterLink}
                to="/privacy"
                color="inherit"
                underline="none"
                sx={linkStyles}
              >
                Privacy Policy
              </Link>
            </Stack>
          </Box>

          {/* =================================================
              SOCIAL
          ================================================= */}

          <Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                mb: 2,
                fontSize: "1rem"
              }}>
              Follow Us
            </Typography>

            <Stack
              direction="row"
              spacing={1}
            >
              {/* GITHUB */}

              <IconButton
                component="a"
                href="https://github.com/singhsumit045"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub Profile"
                sx={socialButtonStyles}
              >
                <GitHub />
              </IconButton>

              {/* LINKEDIN */}

              <IconButton
                component="a"
                href="https://www.linkedin.com/in/sumit-kumar-b9305738b/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn Profile"
                sx={socialButtonStyles}
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

                lineHeight: 1.6,
              }}
            >
              Stay connected with LearnHub and keep
              learning.
            </Typography>
          </Box>
        </Stack>
      </Container>

      {/* =====================================================
          DIVIDER
      ===================================================== */}

      <Divider
        sx={{
          borderColor:
            "rgba(255,255,255,0.18)",
        }}
      />

      {/* =====================================================
          COPYRIGHT
      ===================================================== */}

      <Container
        maxWidth="xl"
        sx={{
          py: 2.5,

          px: {
            xs: 2.5,
            sm: 3,
            md: 4,
          },
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

              textAlign: {
                xs: "center",
                sm: "left",
              },
            }}
          >
            © {new Date().getFullYear()} LearnHub.
            All rights reserved.
          </Typography>
        </Stack>
      </Container>
    </Box>
  );
};

export default Footer;