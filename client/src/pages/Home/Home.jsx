import {
  Box,
  Button,
  Container,
  Grid,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

import {
  School,
  PlayArrow,
  Code,
  WorkspacePremium,
  Groups,
  TrendingUp,
  CheckCircle,
} from "@mui/icons-material";

import { useNavigate } from "react-router-dom";


const Home = () => {

  const navigate = useNavigate();

  const features = [
    {
      icon: <Code />,
      title: "Practical Learning",
      description:
        "Learn by building real-world projects and applications.",
    },
    {
      icon: <WorkspacePremium />,
      title: "Career Focused",
      description:
        "Develop skills that help you become industry ready.",
    },
    {
      icon: <Groups />,
      title: "Expert Learning",
      description:
        "Learn from structured courses designed by experienced instructors.",
    },
    {
      icon: <TrendingUp />,
      title: "Grow Your Skills",
      description:
        "Track your learning journey and continuously improve.",
    },
  ];


  const steps = [
    {
      number: "01",
      title: "Choose a Course",
      description:
        "Explore courses and select the skills you want to learn.",
    },
    {
      number: "02",
      title: "Learn & Practice",
      description:
        "Follow lessons and practice concepts through projects.",
    },
    {
      number: "03",
      title: "Build Projects",
      description:
        "Apply your knowledge by creating real-world applications.",
    },
    {
      number: "04",
      title: "Grow Your Career",
      description:
        "Use your skills and projects to become job ready.",
    },
  ];


  return (
    <Box>

      {/* =========================
          HERO SECTION
      ========================= */}

      <Box
        sx={{
          background:
            "linear-gradient(135deg, #1976d2 0%, #7b1fa2 100%)",

          color: "white",

          py: {
            xs: 8,
            md: 12,
          },
        }}
      >

        <Container maxWidth="xl">

          <Grid
            container
            spacing={6}
            alignItems="center"
          >

            {/* HERO CONTENT */}

            <Grid
              size={{
                xs: 12,
                md: 7,
              }}
            >

              <Box
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 1,
                  px: 2,
                  py: 0.8,
                  mb: 3,
                  borderRadius: 10,
                  backgroundColor:
                    "rgba(255,255,255,0.12)",
                }}
              >

                <School fontSize="small" />

                <Typography
                  variant="body2"
                  fontWeight={600}
                >
                  Learn. Build. Grow.
                </Typography>

              </Box>


              <Typography
                variant="h1"
                fontWeight={800}
                sx={{
                  fontSize: {
                    xs: "2.5rem",
                    sm: "3.5rem",
                    md: "4.5rem",
                  },

                  lineHeight: 1.1,

                  letterSpacing: "-1px",
                }}
              >
                Learn Skills.
                <br />
                Build Your Future.
              </Typography>


              <Typography
                sx={{
                  mt: 3,
                  maxWidth: 650,
                  fontSize: {
                    xs: "1rem",
                    md: "1.2rem",
                  },
                  lineHeight: 1.8,
                  opacity: 0.9,
                }}
              >
                Learn practical skills, build real-world
                projects, and prepare yourself for a
                successful technology career with LearnHub.
              </Typography>


              <Stack
                direction={{
                  xs: "column",
                  sm: "row",
                }}
                spacing={2}
                sx={{
                  mt: 4,
                }}
              >

                <Button
                  variant="contained"
                  size="large"
                  endIcon={<PlayArrow />}
                  onClick={() =>
                    navigate("/courses")
                  }
                  sx={{
                    px: 4,
                    py: 1.5,
                    borderRadius: 2,
                    backgroundColor: "white",
                    color: "primary.main",

                    "&:hover": {
                      backgroundColor:
                        "grey.100",
                    },
                  }}
                >
                  Explore Courses
                </Button>


                <Button
                  variant="outlined"
                  size="large"
                  onClick={() =>
                    navigate("/register")
                  }
                  sx={{
                    px: 4,
                    py: 1.5,
                    borderRadius: 2,
                    color: "white",
                    borderColor:
                      "rgba(255,255,255,0.7)",
                  }}
                >
                  Get Started
                </Button>

              </Stack>

            </Grid>


            {/* HERO CARD */}

            <Grid
              size={{
                xs: 12,
                md: 5,
              }}
            >

              <Paper
                elevation={0}
                sx={{
                  p: {
                    xs: 3,
                    md: 4,
                  },

                  borderRadius: 5,

                  backgroundColor:
                    "rgba(255,255,255,0.12)",

                  color: "white",

                  border:
                    "1px solid rgba(255,255,255,0.2)",

                  backdropFilter:
                    "blur(10px)",
                }}
              >

                <Typography
                  variant="h5"
                  fontWeight={700}
                >
                  Start Learning Today 🚀
                </Typography>


                <Typography
                  sx={{
                    mt: 1,
                    opacity: 0.85,
                  }}
                >
                  Everything you need to grow your
                  technical skills.
                </Typography>


                <Stack
                  spacing={2}
                  sx={{
                    mt: 4,
                  }}
                >

                  {[
                    "Industry-focused courses",
                    "Practical project-based learning",
                    "Learn at your own pace",
                    "Career-ready skills",
                  ].map((item) => (

                    <Box
                      key={item}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5,
                      }}
                    >

                      <CheckCircle />

                      <Typography>
                        {item}
                      </Typography>

                    </Box>

                  ))}

                </Stack>

              </Paper>

            </Grid>

          </Grid>

        </Container>

      </Box>


      {/* =========================
          STATS
      ========================= */}

      <Container
        maxWidth="lg"
        sx={{
          mt: {
            xs: 4,
            md: 6,
          },
        }}
      >

        <Paper
          elevation={3}
          sx={{
            p: {
              xs: 3,
              md: 4,
            },

            borderRadius: 4,
          }}
        >

          <Grid
            container
            spacing={3}
            textAlign="center"
          >

            <Grid
              size={{
                xs: 6,
                md: 3,
              }}
            >
              <Typography
                variant="h4"
                fontWeight={800}
                color="primary"
              >
                100+
              </Typography>

              <Typography color="text.secondary">
                Courses
              </Typography>
            </Grid>


            <Grid
              size={{
                xs: 6,
                md: 3,
              }}
            >
              <Typography
                variant="h4"
                fontWeight={800}
                color="primary"
              >
                5K+
              </Typography>

              <Typography color="text.secondary">
                Students
              </Typography>
            </Grid>


            <Grid
              size={{
                xs: 6,
                md: 3,
              }}
            >
              <Typography
                variant="h4"
                fontWeight={800}
                color="primary"
              >
                50+
              </Typography>

              <Typography color="text.secondary">
                Projects
              </Typography>
            </Grid>


            <Grid
              size={{
                xs: 6,
                md: 3,
              }}
            >
              <Typography
                variant="h4"
                fontWeight={800}
                color="primary"
              >
                4.8
              </Typography>

              <Typography color="text.secondary">
                Average Rating
              </Typography>
            </Grid>

          </Grid>

        </Paper>

      </Container>


      {/* =========================
          FEATURES
      ========================= */}

      <Container
        maxWidth="xl"
        sx={{
          py: {
            xs: 8,
            md: 12,
          },
        }}
      >

        <Box
          textAlign="center"
          sx={{
            mb: 6,
          }}
        >

          <Typography
            variant="h3"
            fontWeight={800}
            sx={{
              fontSize: {
                xs: "2rem",
                md: "3rem",
              },
            }}
          >
            Why LearnHub?
          </Typography>


          <Typography
            color="text.secondary"
            sx={{
              mt: 2,
              maxWidth: 650,
              mx: "auto",
              lineHeight: 1.7,
            }}
          >
            A modern learning platform designed to help
            you learn faster, practice better, and build
            skills that matter.
          </Typography>

        </Box>


        <Grid
          container
          spacing={3}
        >

          {features.map((feature) => (

            <Grid
              key={feature.title}
              size={{
                xs: 12,
                sm: 6,
                md: 3,
              }}
            >

              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  height: "100%",
                  borderRadius: 4,
                  border: "1px solid",
                  borderColor: "divider",
                  transition: "0.3s",

                  "&:hover": {
                    transform:
                      "translateY(-6px)",
                    boxShadow: 6,
                  },
                }}
              >

                <Box
                  sx={{
                    width: 55,
                    height: 55,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 3,
                    backgroundColor:
                      "primary.main",
                    color: "white",
                    mb: 3,
                  }}
                >
                  {feature.icon}
                </Box>


                <Typography
                  variant="h6"
                  fontWeight={700}
                >
                  {feature.title}
                </Typography>


                <Typography
                  color="text.secondary"
                  sx={{
                    mt: 1.5,
                    lineHeight: 1.7,
                  }}
                >
                  {feature.description}
                </Typography>

              </Paper>

            </Grid>

          ))}

        </Grid>

      </Container>


      {/* =========================
          HOW IT WORKS
      ========================= */}

      <Box
        sx={{
          backgroundColor:
            "background.default",

          py: {
            xs: 8,
            md: 10,
          },
        }}
      >

        <Container maxWidth="xl">

          <Box
            textAlign="center"
            sx={{
              mb: 6,
            }}
          >

            <Typography
              variant="h3"
              fontWeight={800}
              sx={{
                fontSize: {
                  xs: "2rem",
                  md: "3rem",
                },
              }}
            >
              How LearnHub Works
            </Typography>

            <Typography
              color="text.secondary"
              sx={{
                mt: 2,
              }}
            >
              Start learning in just four simple steps.
            </Typography>

          </Box>


          <Grid
            container
            spacing={3}
          >

            {steps.map((step) => (

              <Grid
                key={step.number}
                size={{
                  xs: 12,
                  sm: 6,
                  md: 3,
                }}
              >

                <Box
                  sx={{
                    textAlign: {
                      xs: "center",
                      md: "left",
                    },
                  }}
                >

                  <Typography
                    variant="h2"
                    fontWeight={800}
                    color="primary"
                    sx={{
                      opacity: 0.2,
                    }}
                  >
                    {step.number}
                  </Typography>


                  <Typography
                    variant="h6"
                    fontWeight={700}
                    sx={{
                      mt: -1,
                    }}
                  >
                    {step.title}
                  </Typography>


                  <Typography
                    color="text.secondary"
                    sx={{
                      mt: 1,
                      lineHeight: 1.7,
                    }}
                  >
                    {step.description}
                  </Typography>

                </Box>

              </Grid>

            ))}

          </Grid>

        </Container>

      </Box>


      {/* =========================
          CTA
      ========================= */}

      <Container
        maxWidth="xl"
        sx={{
          py: {
            xs: 8,
            md: 10,
          },
        }}
      >

        <Paper
          sx={{
            p: {
              xs: 4,
              md: 7,
            },

            textAlign: "center",

            borderRadius: 5,

            background:
              "linear-gradient(135deg, #1976d2 0%, #7b1fa2 100%)",

            color: "white",
          }}
        >

          <Typography
            variant="h3"
            fontWeight={800}
            sx={{
              fontSize: {
                xs: "2rem",
                md: "3rem",
              },
            }}
          >
            Ready to Start Learning?
          </Typography>


          <Typography
            sx={{
              mt: 2,
              maxWidth: 650,
              mx: "auto",
              opacity: 0.9,
              lineHeight: 1.7,
            }}
          >
            Join LearnHub and start building the skills
            you need for your future.
          </Typography>


          <Button
            variant="contained"
            size="large"
            onClick={() =>
              navigate("/register")
            }
            sx={{
              mt: 4,
              px: 5,
              py: 1.5,
              borderRadius: 2,
              backgroundColor: "white",
              color: "primary.main",

              "&:hover": {
                backgroundColor: "grey.100",
              },
            }}
          >
            Create Free Account
          </Button>

        </Paper>

      </Container>

    </Box>
  );
};


export default Home;