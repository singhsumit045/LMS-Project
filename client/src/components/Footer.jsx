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
} from "@mui/icons-material";

import { Link as RouterLink } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import logo from "../assets/LearnHub-removebg-preview.webp";

const Footer = () => {
  const theme = useTheme();

  const linkStyles = {
    opacity: 0.82,
    transition: "all 0.2s ease",
    display: "block",
    "&:hover": {
      opacity: 1,
      transform: "translateX(4px)",
    },
  };

  const socialButtonStyles = {
    color: "white",
    border: "1px solid rgba(255,255,255,0.25)",
    "&:hover": {
      backgroundColor:
        theme.palette.mode === "dark"
          ? "rgba(255,255,255,0.12)"
          : "rgba(255,255,255,0.15)",
    },
  };

  // Reusable footer link
  const FooterLink = ({ to, children }) => (
    <Link
      component={RouterLink}
      to={to}
      color="inherit"
      underline="none"
      sx={linkStyles}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 0.8,
        }}
      >
        <Box
          component="span"
          sx={{
            fontSize: "18px",
            lineHeight: 1,
          }}
        >
          ›
        </Box>

        <Box
          component="span"
          sx={{
            lineHeight: 1.5,
          }}
        >   
          {children}
        </Box>
      </Box>
    </Link>
  );  
  return (
    <Box
      component="footer"
      sx={{
        mt: "auto",
        background:
          "linear-gradient(135deg, #0B4F8A 0%, #1769AA 50%, #3B82C4 100%)",
        color: "white",
      }}
    >
      <Container
        maxWidth="lg"
        sx={{
          py: { xs: 5, md: 7 },
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
          {/* Brand Section */}
          <Box
            sx={{
              maxWidth: 360,
            }}
          >
            <Box
              component="img"
              src={logo}
              alt="LearnHub"
              sx={{
                width: 150,
                height: "auto",
                mb: 2,
                objectFit: "contain",
              }}
            />

            <Typography
              variant="body2"
              sx={{
                opacity: 0.8,
                lineHeight: 1.8,
                mb: 2,
              }}
            >
              LearnHub is a modern learning platform designed to help
              students learn, practice, and grow their skills.
            </Typography>

            {/* Email */}
            <Stack
              direction="row"

              spacing={1}
              sx={{
                opacity: 0.9,
                alignItems: "center",
              }}
            >
              <Email fontSize="small" />

              <Typography variant="body2">
                learnhub.lms@gmail.com
              </Typography>
            </Stack>
          </Box>

          {/* Quick Links */}
          <Box>
            <Typography
              variant="h6"
              fontWeight={700}
              sx={{
                mb: 2.5,
                whiteSpace: "nowrap",
              }}
            >
              Quick Links
            </Typography>

            <Stack spacing={1.3}>
              <FooterLink to="/dashboard">
                Dashboard
              </FooterLink>

              <FooterLink to="/courses">
                Courses
              </FooterLink>

              <FooterLink to="/my-courses">
                My Courses
              </FooterLink>

              <FooterLink to="/profile">
                Profile
              </FooterLink>
            </Stack>
          </Box>

          {/* Support */}
          <Box>
            <Typography
              variant="h6"
              fontWeight={700}
              sx={{
                mb: 2.5,
              }}
            >
              Support
            </Typography>

            <Stack spacing={1.3}>
              <FooterLink to="/help">

                Help Center
              </FooterLink>

              <FooterLink to="/contact">
                Contact Us
              </FooterLink>

              <FooterLink to="/privacy">
                Privacy Policy
              </FooterLink>
            </Stack>
          </Box>

          {/* Social */}
          <Box>
            <Typography
              variant="h6"
              fontWeight={700}
              sx={{
                mb: 2.5,
                whiteSpace: "nowrap",
              }}
            >
              Follow Us
            </Typography>

            <Stack direction="row" spacing={1}>
              <IconButton
                component="a"
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                sx={socialButtonStyles}
              >  
                <GitHub />
              </IconButton>

              <IconButton
                component="a"
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                sx={socialButtonStyles}
              >
                <LinkedIn />
              </IconButton>

            </Stack>
            <Typography
              variant="body2"
              sx={{
                opacity: 1,
                fontWeight: 500,
                mt: 1.5,
              }}
            >
              Stay connected with LearnHub and keep learning.
            </Typography>
          </Box>
        </Stack>

        {/* Divider */}
        <Divider
          sx={{
            my: 2,
            borderColor: "rgba(255,255,255,0.2)",
          }}
        />

        {/* Copyright */}
        <Typography
          variant="body2"

          sx={{
            opacity: 0.7,
            textAlign: "center",
          }}
        >
          © {new Date().getFullYear()} LearnHub. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;