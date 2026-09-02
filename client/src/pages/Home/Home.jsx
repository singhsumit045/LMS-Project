import {
  Box,
  Button,
  Container,
  Grid,
  Paper,
  Stack,
  Typography,
  Chip,
  Avatar,
  LinearProgress,
  useTheme,
  alpha,
  useMediaQuery,
} from "@mui/material";

import { lazy, Suspense } from "react";

import {
  School,
  // PlayArrow,
  Code,
  WorkspacePremiumOutlined,
  CheckCircle,
  RocketLaunch,
  MenuBook,
  Quiz,
  AutoGraph,
  ArrowForward,
  Groups,
  TrendingUp,
  VideoLibrary,
  Assignment,
} from "@mui/icons-material";

import { useNavigate } from "react-router-dom";

// import Hero3DBackground from "./Hero3DBackground";
const Hero3DBackground = lazy(() => import("./Hero3DBackground"));
import Tilt3DCard from "./Tilt3dcard";
import Reveal from "./Reveal";
import CountUp from "./Countup";


const Home = () => {
  const navigate = useNavigate();
  const theme = useTheme();
   const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const isDark = theme.palette.mode === "dark";
  const primary = theme.palette.primary.main;
  const secondary = theme.palette.secondary.main;

  const features = [
    {
      icon: <MenuBook />,
      title: "Structured Courses",
      description:
        "Learn through carefully designed courses with videos, notes, practical examples and organized learning paths.",
    },
    {
      icon: <Code />,
      title: "Real World Projects",
      description:
        "Turn your knowledge into practical projects and develop skills that actually matter in the industry.",
    },
    {
      icon: <Quiz />,
      title: "Online Assessments",
      description:
        "Test your understanding with online exams and track your performance throughout your learning journey.",
    },
    {
      icon: <WorkspacePremiumOutlined />,
      title: "Earn Certificates",
      description:
        "Complete your learning goals and earn professional certificates that showcase your achievements.",
    },
  ];

  const journey = [
    {
      number: "01",
      icon: <MenuBook />,
      title: "Explore Courses",
      desc: "Choose courses according to your career goals and interests.",
    },
    {
      number: "02",
      icon: <VideoLibrary />,
      title: "Learn & Practice",
      desc: "Watch lessons, read notes and practice what you learn.",
    },
    {
      number: "03",
      icon: <Assignment />,
      title: "Take Assessments",
      desc: "Test your knowledge through exams and track your performance.",
    },
    {
      number: "04",
      icon: <WorkspacePremiumOutlined />,
      title: "Get Certified",
      desc: "Complete your learning journey and earn certificates.",
    },
  ];

  const stats = [
    {
      value: "100+",
      label: "Professional Courses",
      icon: <MenuBook />,
    },
    {
      value: "5K+",
      label: "Active Learners",
      icon: <Groups />,
    },
    {
      value: "50+",
      label: "Real Projects",
      icon: <Code />,
    },
    {
      value: "4.8",
      label: "Student Rating",
      icon: <TrendingUp />,
    },
  ];

  return (
    <Box
      sx={{
        overflow: "hidden",
        bgcolor: "background.default",
        color: "text.primary",
      }}
    >
      {/* =====================================================
          HERO SECTION
      ===================================================== */}

      <Box
        sx={{
          position: "relative",
          minHeight: {
            xs: "auto",
            md: "90vh",
          },
          display: "flex",
          alignItems: "center",
          py: {
            xs: 8,
            md: 12,
          },
          overflow: "hidden",

          background: isDark
            ? `linear-gradient(
                135deg,
                ${theme.palette.background.default} 0%,
                ${alpha(primary, 0.28)} 50%,
                ${alpha(secondary, 0.22)} 100%
              )`
            : `linear-gradient(
                135deg,
                #f8fbff 0%,
                ${alpha(primary, 0.10)} 50%,
                ${alpha(secondary, 0.08)} 100%
              )`,
        }}
      >
        {!isMobile && (
    <Suspense fallback={null}>
      <Hero3DBackground primary={primary} secondary={secondary} isDark={isDark} />
    </Suspense>
  )}

      
        {/* Background glow */}

        <Box
          sx={{
            position: "absolute",
            width: 450,
            height: 450,
            borderRadius: "50%",
            background: alpha(primary, isDark ? 0.18 : 0.08),
            filter: "blur(80px)",
            top: -150,
            right: -100,
          }}
        />

        <Box
          sx={{
            position: "absolute",
            width: 350,
            height: 350,
            borderRadius: "50%",
            background: alpha(secondary, isDark ? 0.16 : 0.07),
            filter: "blur(80px)",
            bottom: -120,
            left: -100,
          }}
        />

        <Container maxWidth="xl" sx={{ position: "relative", zIndex: 2 }}>
          <Grid container spacing={{ xs: 6, md: 8 }} sx={{
            alignItems: "center"
          }}>
            {/* LEFT */}

            <Grid size={{ xs: 12, md: 7 }}>
              <Chip
                icon={<School />}
                label="Modern Learning Management System"
                sx={{
                  mb: 3,
                  px: 1,
                  py: 2.5,
                  borderRadius: 3,
                  fontWeight: 700,
                  color: primary,
                  bgcolor: alpha(primary, 0.10),
                  border: `1px solid ${alpha(primary, 0.18)}`,

                  "& .MuiChip-icon": {
                    color: primary,
                  },
                }}
              />

              <Typography
                component="h1"
                sx={{
                  fontWeight: 900,

                  fontSize: {
                    xs: "2.7rem",
                    sm: "3.6rem",
                    md: "5.1rem",
                  },

                  lineHeight: 1.03,
                  letterSpacing: "-3px",
                  maxWidth: 800
                }}>
                Learn Skills.
                <br />

                <Box
                  component="span"
                  sx={{
                    background: `linear-gradient(
                      90deg,
                      ${primary},
                      ${secondary}
                    )`,
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  Build Projects.
                </Box>

                <br />

                Get Career Ready.
              </Typography>

              <Typography
                sx={{
                  mt: 3,
                  maxWidth: 680,
                  fontSize: {
                    xs: "1rem",
                    md: "1.18rem",
                  },
                  color: "text.secondary",
                  lineHeight: 1.8,
                }}
              >
                LearnHub gives students everything they need to learn
                technology, practice real-world skills, take assessments,
                track progress and earn professional certificates.
              </Typography>

              <Stack
                direction={{
                  xs: "column",
                  sm: "row",
                }}
                spacing={2}
                sx={{
                  mt: 5
                }}
              >
                <Button
                  size="large"
                  endIcon={<ArrowForward />}
                  onClick={() => navigate("/courses")}
                  variant="contained"
                  sx={{
                    px: 4,
                    py: 1.6,
                    borderRadius: 3,
                    fontWeight: 800,
                    textTransform: "none",
                    fontSize: "1rem",
                    boxShadow: `0 12px 30px ${alpha(primary, 0.28)}`,

                    background: `linear-gradient(
                      135deg,
                      ${primary},
                      ${secondary}
                    )`,

                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow: `0 16px 35px ${alpha(primary, 0.35)}`,
                    },

                    transition: "0.25s",
                  }}
                >
                  Explore Courses
                </Button>

                <Button
                  size="large"
                  variant="outlined"
                  onClick={() => navigate("/register")}
                  sx={{
                    px: 4,
                    py: 1.6,
                    borderRadius: 3,
                    fontWeight: 800,
                    textTransform: "none",
                    fontSize: "1rem",
                    borderColor: alpha(primary, 0.4),
                    color: "text.primary",

                    "&:hover": {
                      borderColor: primary,
                      bgcolor: alpha(primary, 0.06),
                    },
                  }}
                >
                  Join LearnHub
                </Button>
              </Stack>

              {/* Trust points */}

              <Stack
                direction={{
                  xs: "column",
                  sm: "row",
                }}
                spacing={3}
                sx={{
                  mt: 5
                }}
              >
                {[
                  "Learn at your own pace",
                  "Track your progress",
                  "Earn certificates",
                ].map((item) => (
                  <Stack
                    key={item}
                    direction="row"
                    spacing={1}
                    sx={{
                      alignItems: "center"
                    }}
                  >
                    <CheckCircle
                      sx={{
                        fontSize: 20,
                        color: primary,
                      }}
                    />

                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 600,
                        color: "text.secondary"
                      }}>
                      {item}
                    </Typography>
                  </Stack>
                ))}
              </Stack>
            </Grid>

            {/* RIGHT DASHBOARD PREVIEW — now with 3D tilt */}

            <Grid size={{ xs: 12, md: 5 }}>
              <Tilt3DCard maxTilt={6} scale={1.015}>
                <Paper
                  elevation={0}
                  sx={{
                    p: {
                      xs: 2,
                      md: 3,
                    },
                    borderRadius: 5,
                    bgcolor: alpha(
                      theme.palette.background.paper,
                      isDark ? 0.72 : 0.82
                    ),
                    backdropFilter: "blur(20px)",
                    border: `1px solid ${alpha(
                      theme.palette.divider,
                      0.7
                    )}`,
                    boxShadow: isDark
                      ? `0 30px 80px ${alpha("#000", 0.4)}`
                      : `0 30px 80px ${alpha(primary, 0.12)}`,
                  }}
                >
                  {/* Header */}

                  <Stack
                    direction="row"
                    sx={{
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 3
                    }}>
                    <Box>
                      <Typography sx={{
                        fontWeight: 800
                      }}>
                        Student Dashboard
                      </Typography>

                      <Typography
                        variant="body2"
                        sx={{
                          color: "text.secondary"
                        }}
                      >
                        Your learning overview
                      </Typography>
                    </Box>

                    <Avatar
                      sx={{
                        bgcolor: alpha(primary, 0.12),
                        color: primary,
                      }}
                    >
                      S
                    </Avatar>
                  </Stack>

                  {/* Course Card */}

                  <Paper
                    elevation={0}
                    sx={{
                      p: 2.5,
                      borderRadius: 4,
                      bgcolor: isDark
                        ? alpha("#fff", 0.05)
                        : alpha(primary, 0.035),
                      border: `1px solid ${alpha(
                        theme.palette.divider,
                        0.7
                      )}`,
                    }}
                  >
                    <Stack direction="row" spacing={2} sx={{
                      alignItems: "center"
                    }}>
                      <Avatar
                        variant="rounded"
                        sx={{
                          width: 50,
                          height: 50,
                          bgcolor: alpha(primary, 0.12),
                          color: primary,
                        }}
                      >
                        <Code />
                      </Avatar>

                      <Box sx={{
                        flex: 1
                      }}>
                        <Typography sx={{
                          fontWeight: 800
                        }}>
                          Web Development
                        </Typography>

                        <Typography
                          variant="body2"
                          sx={{
                            color: "text.secondary"
                          }}
                        >
                          React + NestJS
                        </Typography>
                      </Box>
                    </Stack>

                    <Stack
                      direction="row"
                      sx={{
                        justifyContent: "space-between",
                        mt: 3,
                        mb: 1
                      }}>
                      <Typography variant="body2" sx={{
                        fontWeight: 700
                      }}>
                        Course Progress
                      </Typography>

                      <Typography
                        variant="body2"
                        color="primary"
                        sx={{
                          fontWeight: 800
                        }}
                      >
                        75%
                      </Typography>
                    </Stack>

                    <LinearProgress
                      variant="determinate"
                      value={75}
                      sx={{
                        height: 8,
                        borderRadius: 10,
                        bgcolor: alpha(primary, 0.10),

                        "& .MuiLinearProgress-bar": {
                          borderRadius: 10,
                          background: `linear-gradient(
                            90deg,
                            ${primary},
                            ${secondary}
                          )`,
                        },
                      }}
                    />
                  </Paper>

                  {/* Dashboard stats */}

                  <Grid container spacing={2} sx={{
                    mt: 1
                  }}>
                    {[
                      ["15", "Videos Completed"],
                      ["92%", "Exam Score"],
                      ["01", "Certificate"],
                      ["08", "Learning Hours"],
                    ].map(([value, label]) => (
                      <Grid key={label} size={{ xs: 6 }}>
                        <Paper
                          elevation={0}
                          sx={{
                            p: 2,
                            borderRadius: 3,
                            bgcolor: isDark
                              ? alpha("#fff", 0.04)
                              : alpha(primary, 0.035),
                            border: `1px solid ${alpha(
                              theme.palette.divider,
                              0.6
                            )}`,
                          }}
                        >
                          <Typography
                            variant="h5"
                            color="primary"
                            sx={{
                              fontWeight: 900
                            }}
                          >
                            {value}
                          </Typography>

                          <Typography
                            variant="caption"
                            sx={{
                              color: "text.secondary"
                            }}
                          >
                            {label}
                          </Typography>
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>

                  <Button
                    fullWidth
                    endIcon={<ArrowForward />}
                    sx={{
                      mt: 3,
                      borderRadius: 3,
                      textTransform: "none",
                      fontWeight: 800,
                    }}
                  >
                    View Learning Dashboard
                  </Button>
                </Paper>
              </Tilt3DCard>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* =====================================================
          STATS — now with animated count-up
      ===================================================== */}

      <Container
        maxWidth="lg"
        sx={{
          mt: {
            xs: 3,
            md: -7,
          },
          position: "relative",
          zIndex: 5,
        }}
      >
        <Reveal>
          <Paper
            elevation={0}
            sx={{
              p: {
                xs: 2,
                md: 4,
              },
              borderRadius: 5,
              border: `1px solid ${theme.palette.divider}`,
              bgcolor: "background.paper",
              boxShadow: isDark
                ? `0 20px 60px ${alpha("#000", 0.25)}`
                : `0 20px 60px ${alpha(primary, 0.10)}`,
            }}
          >
            <Grid container spacing={2}>
              {stats.map((item) => (
                <Grid
                  key={item.label}
                  size={{
                    xs: 6,
                    md: 3,
                  }}
                >
                  <Stack
                    spacing={1}
                    sx={{
                      alignItems: "center",
                      py: 1
                    }}>
                    <Avatar
                      sx={{
                        bgcolor: alpha(primary, 0.10),
                        color: primary,
                      }}
                    >
                      {item.icon}
                    </Avatar>

                    <CountUp
                      value={item.value}
                      variant="h4"
                      fontWeight={900}
                      color="primary"
                    />

                    <Typography
                      variant="body2"
                      sx={{
                        color: "text.secondary",
                        textAlign: "center"
                      }}>
                      {item.label}
                    </Typography>
                  </Stack>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Reveal>
      </Container>

      {/* =====================================================
          FEATURES — now with scroll reveal + 3D tilt cards
      ===================================================== */}

      <Container
        maxWidth="xl"
        sx={{
          py: {
            xs: 9,
            md: 13,
          },
        }}
      >
        <Reveal>
          <Box
            sx={{
              textAlign: "center",
              mb: 7
            }}>
            <Chip
              label="LEARNHUB FEATURES"
              sx={{
                mb: 2,
                fontWeight: 800,
                color: primary,
                bgcolor: alpha(primary, 0.09),
              }}
            />

            <Typography
              variant="h3"
              sx={{
                fontWeight: 900,

                fontSize: {
                  xs: "2rem",
                  md: "3rem",
                }
              }}>
              Everything You Need To Learn
            </Typography>

            <Typography
              sx={{
                mt: 2,
                color: "text.secondary",
                maxWidth: 650,
                mx: "auto",
                lineHeight: 1.8
              }}>
              A complete learning platform designed to help students learn
              technology, practice skills, measure progress and achieve their
              career goals.
            </Typography>
          </Box>
        </Reveal>

        <Grid container spacing={3}>
          {features.map((feature, i) => (
            <Grid
              key={feature.title}
              size={{
                xs: 12,
                sm: 6,
                md: 3,
              }}
            >
              <Reveal delay={i * 0.08}>
                <Tilt3DCard maxTilt={12} scale={1.03}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 4,
                      height: "100%",
                      borderRadius: 5,
                      border: `1px solid ${theme.palette.divider}`,
                      bgcolor: "background.paper",
                      transition: "all .3s ease",

                      "&:hover": {
                        borderColor: alpha(primary, 0.35),
                        boxShadow: `0 20px 45px ${alpha(primary, 0.12)}`,

                        "& .feature-icon": {
                          transform: "scale(1.08) rotate(-4deg)",
                        },
                      },
                    }}
                  >
                    <Box
                      className="feature-icon"
                      sx={{
                        width: 64,
                        height: 64,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: 3,
                        color: "#fff",
                        background: `linear-gradient(
                          135deg,
                          ${primary},
                          ${secondary}
                        )`,
                        mb: 3,
                        transition: "0.3s",
                        boxShadow: `0 10px 25px ${alpha(primary, 0.25)}`,
                      }}
                    >
                      {feature.icon}
                    </Box>

                    <Typography variant="h6" sx={{
                      fontWeight: 800
                    }}>
                      {feature.title}
                    </Typography>

                    <Typography
                      sx={{
                        mt: 2,
                        color: "text.secondary",
                        lineHeight: 1.75
                      }}>
                      {feature.description}
                    </Typography>

                    <Button
                      endIcon={<ArrowForward />}
                      sx={{
                        mt: 2,
                        px: 0,
                        textTransform: "none",
                        fontWeight: 800,
                      }}
                    >
                      Learn More
                    </Button>
                  </Paper>
                </Tilt3DCard>
              </Reveal>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* =====================================================
          LEARNING JOURNEY — scroll reveal + tilt
      ===================================================== */}

      <Box
        sx={{
          py: {
            xs: 9,
            md: 13,
          },
          bgcolor: isDark
            ? alpha(primary, 0.035)
            : alpha(primary, 0.025),
          borderTop: `1px solid ${theme.palette.divider}`,
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Container maxWidth="xl">
          <Reveal>
            <Box
              sx={{
                textAlign: "center",
                mb: 8
              }}>
              <Chip
                label="HOW IT WORKS"
                sx={{
                  mb: 2,
                  fontWeight: 800,
                  color: primary,
                  bgcolor: alpha(primary, 0.09),
                }}
              />

              <Typography
                variant="h3"
                sx={{
                  fontWeight: 900,

                  fontSize: {
                    xs: "2rem",
                    md: "3rem",
                  }
                }}>
                Your Learning Journey
              </Typography>

              <Typography
                sx={{
                  mt: 2,
                  color: "text.secondary"
                }}>
                From beginner to confident professional.
              </Typography>
            </Box>
          </Reveal>

          <Grid container spacing={3}>
            {journey.map((item, index) => (
              <Grid
                key={item.title}
                size={{
                  xs: 12,
                  sm: 6,
                  md: 3,
                }}
              >
                <Reveal delay={index * 0.08}>
                  <Tilt3DCard maxTilt={10} scale={1.02}>
                    <Paper
                      elevation={0}
                      sx={{
                        position: "relative",
                        p: 4,
                        height: "100%",
                        borderRadius: 5,
                        border: `1px solid ${theme.palette.divider}`,
                        bgcolor: "background.paper",
                        overflow: "hidden",

                        "&:hover": {
                          borderColor: alpha(primary, 0.35),
                        },
                      }}
                    >
                      <Typography
                        sx={{
                          position: "absolute",
                          top: 15,
                          right: 20,
                          fontSize: "3rem",
                          fontWeight: 900,
                          color: alpha(primary, 0.07),
                        }}
                      >
                        {item.number}
                      </Typography>

                      <Avatar
                        sx={{
                          width: 58,
                          height: 58,
                          mb: 3,
                          bgcolor: alpha(primary, 0.10),
                          color: primary,
                        }}
                      >
                        {item.icon}
                      </Avatar>

                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 800
                        }}
                      >
                        {item.title}
                      </Typography>

                      <Typography
                        sx={{
                          mt: 2,
                          color: "text.secondary",
                          lineHeight: 1.7
                        }}>
                        {item.desc}
                      </Typography>

                      {index < journey.length - 1 && (
                        <ArrowForward
                          sx={{
                            position: "absolute",
                            right: 18,
                            bottom: 18,
                            color: alpha(primary, 0.35),
                            display: {
                              xs: "none",
                              md: "block",
                            },
                          }}
                        />
                      )}
                    </Paper>
                  </Tilt3DCard>
                </Reveal>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* =====================================================
          STUDENT + TEACHER ECOSYSTEM — tilt on the gradient card
      ===================================================== */}

      <Container
        maxWidth="xl"
        sx={{
          py: {
            xs: 9,
            md: 13,
          },
        }}
      >
        <Grid
          container
          spacing={{
            xs: 5,
            md: 8,
          }}
          sx={{
            alignItems: "center"
          }}
        >
          {/* LEFT */}

          <Grid size={{ xs: 12, md: 6 }}>
            <Reveal>
              <Chip
                label="COMPLETE LMS ECOSYSTEM"
                sx={{
                  mb: 2,
                  fontWeight: 800,
                  color: primary,
                  bgcolor: alpha(primary, 0.09),
                }}
              />

              <Typography
                variant="h3"
                sx={{
                  fontWeight: 900,

                  fontSize: {
                    xs: "2rem",
                    md: "3rem",
                  }
                }}>
                Built For Students
                <br />
                & Teachers
              </Typography>

              <Typography
                sx={{
                  mt: 3,
                  color: "text.secondary",
                  lineHeight: 1.8,
                  maxWidth: 600
                }}>
                LearnHub brings students and teachers together in one complete
                learning ecosystem. Teachers can manage courses and students can
                learn, practice, take exams and track their progress.
              </Typography>

              <Stack spacing={2.2} sx={{
                mt: 4
              }}>
                {[
                  "Teacher course management",
                  "Video based learning",
                  "Student progress tracking",
                  "Online examinations",
                  "Digital certificates",
                ].map((item) => (
                  <Stack
                    key={item}
                    direction="row"
                    spacing={1.5}
                    sx={{
                      alignItems: "center"
                    }}
                  >
                    <CheckCircle
                      sx={{
                        color: primary,
                        fontSize: 22,
                      }}
                    />

                    <Typography sx={{
                      fontWeight: 600
                    }}>
                      {item}
                    </Typography>
                  </Stack>
                ))}
              </Stack>
            </Reveal>
          </Grid>

          {/* RIGHT */}

          <Grid size={{ xs: 12, md: 6 }}>
            <Reveal delay={0.15}>
              <Tilt3DCard maxTilt={8} scale={1.02}>
                <Paper
                  elevation={0}
                  sx={{
                    p: {
                      xs: 3,
                      md: 5,
                    },
                    borderRadius: 6,
                    color: "#fff",
                    position: "relative",
                    overflow: "hidden",

                    background: `linear-gradient(
                      135deg,
                      ${primary},
                      ${secondary}
                    )`,

                    boxShadow: `0 25px 60px ${alpha(primary, 0.25)}`,
                  }}
                >
                  <Box
                    sx={{
                      position: "absolute",
                      width: 250,
                      height: 250,
                      borderRadius: "50%",
                      bgcolor: alpha("#fff", 0.08),
                      right: -100,
                      top: -100,
                    }}
                  />

                  <Stack
                    direction="row"
                    spacing={2}
                    sx={{
                      alignItems: "center",
                      position: "relative"
                    }}>
                    <Avatar
                      sx={{
                        bgcolor: "#fff",
                        color: primary,
                        width: 58,
                        height: 58,
                      }}
                    >
                      <AutoGraph />
                    </Avatar>

                    <Box>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 900
                        }}
                      >
                        Learning Analytics
                      </Typography>

                      <Typography
                        variant="body2"
                        sx={{
                          opacity: 0.8,
                        }}
                      >
                        Understand your learning performance
                      </Typography>
                    </Box>
                  </Stack>

                  <Grid
                    container
                    spacing={2}
                    sx={{
                      mt: 3,
                      position: "relative"
                    }}>
                    {[
                      ["75%", "Course Progress"],
                      ["92%", "Exam Score"],
                      ["15", "Videos Completed"],
                      ["01", "Certificate"],
                    ].map(([value, label]) => (
                      <Grid
                        key={label}
                        size={{
                          xs: 6,
                        }}
                      >
                        <Paper
                          elevation={0}
                          sx={{
                            p: 2.5,
                            borderRadius: 3,
                            bgcolor: alpha("#fff", 0.13),
                            color: "#fff",
                            border: `1px solid ${alpha("#fff", 0.12)}`,
                          }}
                        >
                          <Typography
                            variant="h5"
                            sx={{
                              fontWeight: 900
                            }}
                          >
                            {value}
                          </Typography>

                          <Typography
                            variant="body2"
                            sx={{
                              opacity: 0.8,
                              mt: 0.5,
                            }}
                          >
                            {label}
                          </Typography>
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
                </Paper>
              </Tilt3DCard>
            </Reveal>
          </Grid>
        </Grid>
      </Container>

      {/* =====================================================
          FINAL CTA — reveal + subtle tilt
      ===================================================== */}

      <Container
        maxWidth="xl"
        sx={{
          pb: {
            xs: 8,
            md: 12,
          },
        }}
      >
        <Reveal>
          <Tilt3DCard maxTilt={4} scale={1.008} glare={false}>
            <Paper
              elevation={0}
              sx={{
                position: "relative",
                overflow: "hidden",
                p: {
                  xs: 5,
                  md: 9,
                },
                borderRadius: 7,
                textAlign: "center",
                color: "#fff",

                background: `linear-gradient(
                  135deg,
                  ${theme.palette.primary.dark},
                  ${primary},
                  ${secondary}
                )`,
              }}
            >
              {/* Decorative circles */}

              <Box
                sx={{
                  position: "absolute",
                  width: 300,
                  height: 300,
                  borderRadius: "50%",
                  bgcolor: alpha("#fff", 0.06),
                  top: -180,
                  left: -100,
                }}
              />

              <Box
                sx={{
                  position: "absolute",
                  width: 300,
                  height: 300,
                  borderRadius: "50%",
                  bgcolor: alpha("#fff", 0.06),
                  bottom: -180,
                  right: -100,
                }}
              />

              <Box sx={{
                position: "relative"
              }}>
                <Avatar
                  sx={{
                    width: 70,
                    height: 70,
                    mx: "auto",
                    bgcolor: alpha("#fff", 0.14),
                    color: "#fff",
                  }}
                >
                  <RocketLaunch sx={{ fontSize: 34 }} />
                </Avatar>

                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 900,
                    mt: 3,

                    fontSize: {
                      xs: "2rem",
                      md: "3rem",
                    }
                  }}>
                  Start Building Your Future Today
                </Typography>

                <Typography
                  sx={{
                    mt: 3,
                    maxWidth: 650,
                    mx: "auto",
                    opacity: 0.85,
                    lineHeight: 1.8
                  }}>
                  Join LearnHub and transform your learning into real skills,
                  projects and career opportunities.
                </Typography>

                <Button
                  size="large"
                  onClick={() => navigate("/register")}
                  sx={{
                    mt: 5,
                    px: 5,
                    py: 1.6,
                    borderRadius: 3,
                    bgcolor: "#fff",
                    color: primary,
                    fontWeight: 900,
                    textTransform: "none",
                    fontSize: "1rem",

                    "&:hover": {
                      bgcolor: "#f8fafc",
                      transform: "translateY(-2px)",
                    },

                    transition: "0.25s",
                  }}
                >
                  Create Free Account
                </Button>
              </Box>
            </Paper>
          </Tilt3DCard>
        </Reveal>
      </Container>
    </Box>
  );
};

export default Home;
