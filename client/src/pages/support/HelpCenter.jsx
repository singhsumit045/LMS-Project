import { useMemo, useState } from "react";

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  Grid,
  InputAdornment,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SearchIcon from "@mui/icons-material/Search";
import SchoolIcon from "@mui/icons-material/School";
import QuizIcon from "@mui/icons-material/Quiz";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LiveTvIcon from "@mui/icons-material/LiveTv";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

import { useNavigate } from "react-router-dom";

const HelpCenter = () => {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");

  const categories = [
    {
      title: "Courses & Learning",
      description:
        "Learn how to browse courses, enroll and track your progress.",
      icon: <SchoolIcon />,
      color: "primary",
    },
    {
      title: "Exams & Assessments",
      description:
        "Get help with exams, attempts, results and certificates.",
      icon: <QuizIcon />,
      color: "secondary",
    },
    {
      title: "Certificates",
      description:
        "Understand certificate generation and download options.",
      icon: <WorkspacePremiumIcon />,
      color: "success",
    },
    {
      title: "Account & Profile",
      description:
        "Manage your profile, password and account information.",
      icon: <AccountCircleIcon />,
      color: "warning",
    },
    {
      title: "Live Classes",
      description:
        "Get assistance with joining live classes and video sessions.",
      icon: <LiveTvIcon />,
      color: "info",
    },
    {
      title: "Technical Support",
      description:
        "Troubleshoot common technical issues with the platform.",
      icon: <SupportAgentIcon />,
      color: "error",
    },
  ];

  const faqs = [
    {
      question: "How do I create an account?",
      answer:
        "Open the Register page from the navigation bar, enter your name, email and password, then submit the registration form. After successful registration, you can log in to your account.",
    },
    {
      question: "How can I enroll in a course?",
      answer:
        "Open the course you want to study and use the enrollment option available on the course details page. Once enrolled, you can access the available learning material.",
    },
    {
      question: "How can I track my course progress?",
      answer:
        "Your course progress is updated as you complete the available course videos and learning activities. The course details page displays your current progress.",
    },
    {
      question: "How do I start an exam?",
      answer:
        "Open an available published exam and select the Start Exam option. An exam attempt will be created for you and you can submit your answers when you finish.",
    },
    {
      question: "What happens after submitting an exam?",
      answer:
        "After submission, your answers are evaluated and your result shows your score, percentage, correct answers and passing status.",
    },
    {
      question: "When is a certificate generated?",
      answer:
        "A certificate can be generated when you successfully pass an eligible exam. The certificate information becomes available with your exam result.",
    },
    {
      question: "I cannot access a live class. What should I do?",
      answer:
        "Check your internet connection, browser permissions and microphone/camera permissions. If the issue continues, contact support with details about the problem.",
    },
    {
      question: "How can I reset my password?",
      answer:
        "Use the Forgot Password option on the login page and follow the password reset process associated with your registered email address.",
    },
  ];

  const filteredFaqs = useMemo(() => {
    const value = search.trim().toLowerCase();

    if (!value) {
      return faqs;
    }

    return faqs.filter(
      (faq) =>
        faq.question.toLowerCase().includes(value) ||
        faq.answer.toLowerCase().includes(value)
    );
  }, [search]);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "background.default",
        py: { xs: 4, md: 7 },
      }}
    >
      <Container maxWidth="lg">
        {/* HERO */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, md: 6 },
            mb: 5,
            borderRadius: 4,
            color: "primary.contrastText",
            bgcolor: "primary.main",
            backgroundImage:
              "linear-gradient(135deg, rgba(0,0,0,.08), rgba(255,255,255,.08))",
          }}
        >
          <Stack
            spacing={3}
            sx={{
              alignItems: "center",
              textAlign: "center"
            }}>
            <Chip
              label="LEARNHUB SUPPORT"
              sx={{
                color: "primary.contrastText",
                bgcolor: "rgba(255,255,255,.15)",
                fontWeight: 700,
              }}
            />

            <Typography
              variant="h2"
              sx={{
                fontWeight: 900,

                fontSize: {
                  xs: "2.2rem",
                  md: "3.5rem",
                }
              }}>
              How can we help you?
            </Typography>

            <Typography
              variant="h6"
              sx={{
                maxWidth: 700,
                opacity: 0.9,
                fontWeight: 400,
              }}
            >
              Find answers to common questions about
              courses, exams, certificates, live classes
              and your account.
            </Typography>

            <TextField
              fullWidth
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search your question..."
              sx={{
                maxWidth: 680,
                bgcolor: "background.paper",
                borderRadius: 2,
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                },
              }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                },
              }}
            />
          </Stack>
        </Paper>

        {/* CATEGORIES */}
        <Box sx={{ mb: 6 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 800,
              mb: 1
            }}>
            Browse Help Topics
          </Typography>

          <Typography
            sx={{
              color: "text.secondary",
              mb: 3
            }}>
            Choose a category to find relevant help.
          </Typography>

          <Grid container spacing={2.5}>
            {categories.map((category) => (
              <Grid
                key={category.title}
                size={{
                  xs: 12,
                  sm: 6,
                  md: 4,
                }}
              >
                <Card
                  sx={{
                    height: "100%",
                    borderRadius: 3,
                    transition:
                      "transform .2s ease, box-shadow .2s ease",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: 5,
                    },
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Stack spacing={2}>
                      <Box
                        sx={{
                          width: 48,
                          height: 48,
                          borderRadius: 2,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: `${category.color}.main`,
                          bgcolor: `${category.color}.lighter`,
                        }}
                      >
                        {category.icon}
                      </Box>

                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 800
                        }}
                      >
                        {category.title}
                      </Typography>

                      <Typography
                        sx={{
                          color: "text.secondary",
                          minHeight: 48
                        }}>
                        {category.description}
                      </Typography>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* FAQ */}
        <Box sx={{ mb: 6 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 800,
              mb: 1
            }}>
            Frequently Asked Questions
          </Typography>

          <Typography
            sx={{
              color: "text.secondary",
              mb: 3
            }}>
            Quick answers to the most common questions.
          </Typography>

          {filteredFaqs.length === 0 ? (
            <Alert severity="info">
              No matching questions found. Try another
              search or contact our support team.
            </Alert>
          ) : (
            <Stack spacing={1.5}>
              {filteredFaqs.map((faq) => (
                <Accordion
                  key={faq.question}
                  elevation={0}
                  sx={{
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: "12px !important",
                    "&:before": {
                      display: "none",
                    },
                  }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                  >
                    <Typography sx={{
                      fontWeight: 700
                    }}>
                      {faq.question}
                    </Typography>
                  </AccordionSummary>

                  <AccordionDetails>
                    <Typography
                      sx={{
                        color: "text.secondary",
                        lineHeight: 1.8
                      }}>
                      {faq.answer}
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Stack>
          )}
        </Box>

        {/* CONTACT CTA */}
        <Paper
          variant="outlined"
          sx={{
            p: { xs: 3, md: 4 },
            borderRadius: 3,
          }}
        >
          <Stack
            direction={{
              xs: "column",
              md: "row",
            }}
            spacing={3}
            sx={{
              alignItems: {
                xs: "flex-start",
                md: "center",
              },

              justifyContent: "space-between"
            }}>
            <Box>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 800,
                  mb: 1
                }}>
                Still need help?
              </Typography>

              <Typography sx={{
                color: "text.secondary"
              }}>
                Our support team is ready to help you
                with your issue.
              </Typography>
            </Box>

            <Button
              variant="contained"
              size="large"
              endIcon={<ArrowForwardIcon />}
              onClick={() => navigate("/contact")}
              sx={{
                borderRadius: 2,
                fontWeight: 700,
                minWidth: 170,
              }}
            >
              Contact Support
            </Button>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
};

export default HelpCenter;

