
import {
  Box,
  Container,
  Divider,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

import PrivacyTipOutlinedIcon from "@mui/icons-material/PrivacyTipOutlined";

const PrivacyPolicy = () => {
  const sections = [
    {
      title: "1. Information We Collect",
      content:
        "When you create and use an account on LearnHub, we may collect information such as your name, email address, profile information and information required to provide learning services.",
    },
    {
      title: "2. How We Use Your Information",
      content:
        "The information we collect may be used to create and manage your account, provide courses and learning services, process enrollments, manage examinations, provide certificates, communicate important platform updates and improve the overall learning experience.",
    },
    {
      title: "3. Course and Learning Data",
      content:
        "Information related to your course enrollment, learning progress, completed videos and learning activities may be stored to provide progress tracking and related LMS functionality.",
    },
    {
      title: "4. Examination Data",
      content:
        "When you participate in an examination, information such as your exam attempts, answers, scores, percentages and pass/fail status may be stored to calculate and display your results.",
    },
    {
      title: "5. Certificates",
      content:
        "When you successfully complete an eligible examination or learning requirement, certificate information may be generated and stored. Certificate records may include certificate number, course, examination, score, percentage and issue date.",
    },
    {
      title: "6. Account Security",
      content:
        "You are responsible for keeping your account credentials confidential. You should immediately contact the platform support team if you believe your account has been accessed without authorization.",
    },
    {
      title: "7. Cookies and Local Storage",
      content:
        "The application may use browser storage and similar technologies to maintain authentication sessions, remember application state and provide essential platform functionality.",
    },
    {
      title: "8. Third-Party Services",
      content:
        "Certain platform functionality may rely on third-party services. Information shared with such services is handled according to the applicable service provider's policies and the functionality being used.",
    },
    {
      title: "9. Data Retention",
      content:
        "Information may be retained for as long as reasonably necessary to provide the platform services, maintain academic and examination records, meet operational requirements or comply with applicable obligations.",
    },
    {
      title: "10. Your Rights",
      content:
        "Depending on applicable law, you may have rights regarding access, correction or deletion of certain personal information. Requests can be directed to the support team.",
    },
    {
      title: "11. Changes to This Policy",
      content:
        "This Privacy Policy may be updated from time to time as the platform, services or applicable requirements change. Updated versions will be made available through the platform.",
    },
    {
      title: "12. Contact",
      content:
        "If you have questions about this Privacy Policy or how your information is handled, please contact the LearnHub support team through the Contact Us page.",
    },
  ];

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "background.default",
        py: { xs: 4, md: 7 },
      }}
    >
      <Container maxWidth="md">
        <Paper
          elevation={2}
          sx={{
            borderRadius: 4,
            overflow: "hidden",
          }}
        >
          {/* HEADER */}
          <Box
            sx={{
              p: {
                xs: 3,
                md: 5,
              },
              bgcolor: "primary.main",
              color: "primary.contrastText",
            }}
          >
            <Stack spacing={2}>
              <Box
                sx={{
                  width: 58,
                  height: 58,
                  borderRadius: 2.5,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  bgcolor: "rgba(255,255,255,.15)",
                }}
              >
                <PrivacyTipOutlinedIcon fontSize="large" />
              </Box>

              <Typography
                variant="h2"
                sx={{
                  fontWeight: 900,

                  fontSize: {
                    xs: "2.2rem",
                    md: "3.2rem",
                  }
                }}>
                Privacy Policy
              </Typography>

              <Typography
                sx={{
                  opacity: 0.9,
                  maxWidth: 650,
                  lineHeight: 1.8,
                }}
              >
                Your privacy matters to us. This page
                explains how information may be collected,
                used and protected while using LearnHub.
              </Typography>

              <Typography
                variant="body2"
                sx={{ opacity: 0.75 }}
              >
                Last updated: August 11, 2026
              </Typography>
            </Stack>
          </Box>

          {/* CONTENT */}
          <Box
            sx={{
              p: {
                xs: 3,
                md: 5,
              },
            }}
          >
            <Stack spacing={4}>
              <Typography
                sx={{
                  color: "text.secondary",
                  lineHeight: 1.9
                }}>
                LearnHub is committed to protecting user
                information and providing a safe learning
                environment. By using the platform, you
                acknowledge that information may be
                processed as necessary to provide the
                services described below.
              </Typography>

              <Divider />

              {sections.map((section, index) => (
                <Box key={section.title}>
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 800,
                      mb: 1.5
                    }}>
                    {section.title}
                  </Typography>

                  <Typography
                    sx={{
                      color: "text.secondary",
                      lineHeight: 1.9
                    }}>
                    {section.content}
                  </Typography>

                  {index <
                    sections.length - 1 && (
                    <Divider sx={{ mt: 4 }} />
                  )}
                </Box>
              ))}

              <Paper
                variant="outlined"
                sx={{
                  p: 3,
                  borderRadius: 3,
                  bgcolor: "action.hover",
                }}
              >
                <Typography
                  sx={{
                    fontWeight: 800,
                    mb: 1
                  }}>
                  Questions about privacy?
                </Typography>

                <Typography
                  sx={{
                    color: "text.secondary",
                    lineHeight: 1.8
                  }}>
                  Please visit the Contact Us page if you
                  have questions or concerns regarding this
                  Privacy Policy.
                </Typography>
              </Paper>
            </Stack>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default PrivacyPolicy;

