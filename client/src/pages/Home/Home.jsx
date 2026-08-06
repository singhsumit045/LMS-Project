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
} from "@mui/material";

import {
  School,
  PlayArrow,
  Code,
  WorkspacePremium,
  Groups,
  TrendingUp,
  CheckCircle,
  RocketLaunch,
  MenuBook,
  Quiz,
  WorkspacePremiumOutlined,
  AutoGraph,
} from "@mui/icons-material";

import { useNavigate } from "react-router-dom";


const Home = () => {

  const navigate = useNavigate();


  const features = [
    {
      icon: <MenuBook />,
      title: "Learn From Structured Courses",
      description:
        "Access well-designed courses with video lessons, notes and practical examples.",
    },
    {
      icon: <Code />,
      title: "Build Real Projects",
      description:
        "Convert your knowledge into real-world applications and industry projects.",
    },
    {
      icon: <Quiz />,
      title: "Test Your Knowledge",
      description:
        "Improve your skills with assessments and performance tracking.",
    },
    {
      icon: <WorkspacePremiumOutlined />,
      title: "Earn Certificates",
      description:
        "Complete courses and showcase your achievements professionally.",
    },
  ];


  const journey = [
    {
      title:"Explore Courses",
      desc:"Choose skills according to your career goal."
    },
    {
      title:"Watch & Practice",
      desc:"Learn through videos and practical examples."
    },
    {
      title:"Take Assessments",
      desc:"Check your understanding with exams."
    },
    {
      title:"Get Certified",
      desc:"Receive certificates and grow your career."
    }
  ];


  return (

    <Box
      sx={{
        overflow:"hidden"
      }}
    >


      {/* ================= HERO ================= */}


      <Box
        sx={{
          minHeight:"92vh",
          display:"flex",
          alignItems:"center",
          background:
          "linear-gradient(135deg,#020617,#1e40af,#7c3aed)",
          color:"white",
          py:10
        }}
      >

        <Container maxWidth="xl">

          <Grid
            container
            spacing={7}
            alignItems="center"
          >


            {/* LEFT CONTENT */}


            <Grid
              size={{
                xs:12,
                md:7
              }}
            >


              <Chip
                icon={<School/>}
                label="Modern Learning Management System"
                sx={{
                  mb:3,
                  color:"white",
                  background:
                  "rgba(255,255,255,.15)",
                  backdropFilter:"blur(10px)",
                  px:1
                }}
              />



              <Typography
                variant="h1"
                fontWeight={900}
                sx={{
                  fontSize:{
                    xs:"2.8rem",
                    md:"5rem"
                  },
                  lineHeight:1.05,
                  letterSpacing:"-2px"
                }}
              >

                Learn Skills.
                <br/>

                Build Projects.
                <br/>

                Get Career Ready.

              </Typography>



              <Typography
                sx={{
                  mt:3,
                  maxWidth:650,
                  fontSize:"1.2rem",
                  opacity:.85,
                  lineHeight:1.8
                }}
              >

                LearnHub helps students learn technology,
                practice with projects, track progress,
                clear assessments and earn certificates.

              </Typography>



              <Stack
                direction={{
                  xs:"column",
                  sm:"row"
                }}
                spacing={2}
                mt={5}
              >


                <Button
                  size="large"
                  endIcon={<PlayArrow/>}
                  onClick={()=>
                    navigate("/courses")
                  }
                  sx={{
                    px:5,
                    py:1.5,
                    borderRadius:3,
                    background:"white",
                    color:"#2563eb",
                    fontWeight:800,

                    "&:hover":{
                      background:"#f8fafc"
                    }
                  }}
                >

                  Explore Courses

                </Button>



                <Button
                  size="large"
                  variant="outlined"
                  onClick={()=>
                    navigate("/register")
                  }
                  sx={{
                    px:5,
                    py:1.5,
                    borderRadius:3,
                    color:"white",
                    borderColor:"rgba(255,255,255,.7)"
                  }}
                >

                  Join LearnHub

                </Button>


              </Stack>


            </Grid>





            {/* LMS PREVIEW CARD */}



            <Grid
              size={{
                xs:12,
                md:5
              }}
            >


              <Paper
                elevation={0}
                sx={{
                  p:3,
                  borderRadius:5,
                  background:
                  "rgba(255,255,255,.12)",
                  backdropFilter:"blur(20px)",
                  border:
                  "1px solid rgba(255,255,255,.2)",
                  color:"white"
                }}
              >


                <Typography
                  variant="h6"
                  fontWeight={800}
                >
                  Student Dashboard
                </Typography>



                <Typography
                  sx={{
                    opacity:.8,
                    mb:3
                  }}
                >
                  Your learning progress
                </Typography>




                <Paper
                  sx={{
                    p:2,
                    borderRadius:3,
                    background:"white",
                    color:"#111827"
                  }}
                >

                  <Stack
                    direction="row"
                    spacing={2}
                    alignItems="center"
                  >

                    <Avatar>
                      S
                    </Avatar>


                    <Box>

                      <Typography fontWeight={700}>
                        Web Development
                      </Typography>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                      >
                        React + Backend
                      </Typography>

                    </Box>


                  </Stack>



                  <Typography
                    mt={3}
                    fontWeight={700}
                  >
                    Course Progress 75%
                  </Typography>


                  <LinearProgress
                    variant="determinate"
                    value={75}
                    sx={{
                      mt:1,
                      height:8,
                      borderRadius:5
                    }}
                  />


                </Paper>


                <Stack
                  spacing={2}
                  mt={3}
                >

                  {
                    [
                      "Video Learning",
                      "Online Exams",
                      "Certificates"
                    ].map(item=>(

                      <Box
                        key={item}
                        display="flex"
                        gap={1}
                        alignItems="center"
                      >

                        <CheckCircle/>

                        <Typography>
                          {item}
                        </Typography>

                      </Box>

                    ))
                  }


                </Stack>


              </Paper>


            </Grid>


          </Grid>


        </Container>


      </Box>

            {/* ================= STATS ================= */}

      <Container
        maxWidth="lg"
        sx={{
          mt:-6,
          position:"relative"
        }}
      >

        <Paper
          sx={{
            p:4,
            borderRadius:5,
            boxShadow:10
          }}
        >

          <Grid
            container
            spacing={3}
            textAlign="center"
          >

            {
              [
                {
                  number:"100+",
                  label:"Professional Courses"
                },
                {
                  number:"5000+",
                  label:"Active Learners"
                },
                {
                  number:"50+",
                  label:"Real Projects"
                },
                {
                  number:"4.8⭐",
                  label:"Student Rating"
                }
              ].map(item=>(

                <Grid
                  key={item.label}
                  size={{
                    xs:6,
                    md:3
                  }}
                >

                  <Typography
                    variant="h3"
                    fontWeight={900}
                    color="primary"
                  >
                    {item.number}
                  </Typography>


                  <Typography
                    color="text.secondary"
                  >
                    {item.label}
                  </Typography>


                </Grid>


              ))
            }


          </Grid>


        </Paper>


      </Container>





      {/* ================= FEATURES ================= */}



      <Container
        maxWidth="xl"
        sx={{
          py:12
        }}
      >


        <Box
          textAlign="center"
          mb={7}
        >

          <Typography
            variant="h3"
            fontWeight={900}
          >
            Everything You Need To Learn
          </Typography>


          <Typography
            mt={2}
            color="text.secondary"
            maxWidth={650}
            mx="auto"
          >
            One platform where students can learn,
            practice, test skills and build their career.
          </Typography>


        </Box>



        <Grid
          container
          spacing={4}
        >


          {
            features.map(feature=>(


              <Grid
                key={feature.title}
                size={{
                  xs:12,
                  sm:6,
                  md:3
                }}
              >


                <Paper
                  sx={{
                    p:4,
                    height:"100%",
                    borderRadius:5,
                    border:
                    "1px solid",
                    borderColor:"divider",
                    transition:"0.3s",

                    "&:hover":{
                      transform:
                      "translateY(-12px)",
                      boxShadow:8
                    }
                  }}
                >


                  <Box
                    sx={{
                      width:65,
                      height:65,
                      display:"flex",
                      justifyContent:"center",
                      alignItems:"center",
                      borderRadius:3,
                      background:
                      "linear-gradient(135deg,#2563eb,#7c3aed)",
                      color:"white",
                      mb:3
                    }}
                  >

                    {feature.icon}

                  </Box>



                  <Typography
                    variant="h6"
                    fontWeight={800}
                  >
                    {feature.title}
                  </Typography>



                  <Typography
                    mt={2}
                    color="text.secondary"
                    lineHeight={1.7}
                  >
                    {feature.description}
                  </Typography>



                </Paper>


              </Grid>


            ))
          }


        </Grid>



      </Container>





      {/* ================= LEARNING JOURNEY ================= */}



      <Box
        sx={{
          background:
          "linear-gradient(180deg,#f8fafc,#eef2ff)",
          py:12
        }}
      >


        <Container
          maxWidth="xl"
        >


          <Box
            textAlign="center"
            mb={7}
          >

            <Typography
              variant="h3"
              fontWeight={900}
            >
              Your Learning Journey
            </Typography>


            <Typography
              mt={2}
              color="text.secondary"
            >
              From beginner to professional developer.
            </Typography>


          </Box>





          <Grid
            container
            spacing={4}
          >


            {
              journey.map((item,index)=>(


                <Grid
                  key={item.title}
                  size={{
                    xs:12,
                    sm:6,
                    md:3
                  }}
                >


                  <Paper
                    sx={{
                      p:4,
                      borderRadius:5,
                      height:"100%",
                      position:"relative"
                    }}
                  >


                    <Avatar
                      sx={{
                        width:55,
                        height:55,
                        bgcolor:"primary.main",
                        mb:3,
                        fontWeight:900
                      }}
                    >

                      {index+1}

                    </Avatar>



                    <Typography
                      variant="h6"
                      fontWeight={800}
                    >

                      {item.title}

                    </Typography>



                    <Typography
                      mt={2}
                      color="text.secondary"
                    >

                      {item.desc}

                    </Typography>



                  </Paper>


                </Grid>


              ))
            }


          </Grid>


        </Container>


      </Box>

            {/* ================= LMS ECOSYSTEM ================= */}


      <Container
        maxWidth="xl"
        sx={{
          py:12
        }}
      >


        <Grid
          container
          spacing={6}
          alignItems="center"
        >


          <Grid
            size={{
              xs:12,
              md:6
            }}
          >

            <Typography
              variant="h3"
              fontWeight={900}
            >
              Built For Students &
              <br/>
              Teachers
            </Typography>



            <Typography
              mt={3}
              color="text.secondary"
              lineHeight={1.8}
            >

              LearnHub creates a complete learning
              ecosystem where teachers can create
              courses and students can learn,
              practice and track their progress.

            </Typography>



            <Stack
              spacing={2}
              mt={4}
            >

              {
                [
                  "Teacher course management",
                  "Video based learning",
                  "Student progress tracking",
                  "Online examinations",
                  "Digital certificates"
                ].map(item=>(

                  <Box
                    key={item}
                    display="flex"
                    alignItems="center"
                    gap={2}
                  >

                    <CheckCircle
                      color="primary"
                    />

                    <Typography>
                      {item}
                    </Typography>


                  </Box>

                ))
              }


            </Stack>


          </Grid>





          <Grid
            size={{
              xs:12,
              md:6
            }}
          >


            <Paper
              sx={{
                p:4,
                borderRadius:6,
                background:
                "linear-gradient(135deg,#1d4ed8,#7c3aed)",
                color:"white"
              }}
            >


              <Stack
                direction="row"
                spacing={2}
                alignItems="center"
              >

                <Avatar
                  sx={{
                    bgcolor:"white",
                    color:"primary.main"
                  }}
                >

                  <AutoGraph/>

                </Avatar>


                <Box>

                  <Typography
                    fontWeight={800}
                  >
                    Learning Analytics
                  </Typography>


                  <Typography
                    variant="body2"
                    sx={{
                      opacity:.8
                    }}
                  >
                    Track performance easily
                  </Typography>


                </Box>


              </Stack>




              <Grid
                container
                spacing={2}
                mt={3}
              >

                {
                  [
                    ["75%","Course Progress"],
                    ["92%","Exam Score"],
                    ["15","Videos Completed"],
                    ["1","Certificate"]
                  ].map(card=>(


                    <Grid
                      key={card[1]}
                      size={{
                        xs:6
                      }}
                    >


                      <Paper
                        sx={{
                          p:2,
                          borderRadius:3,
                          background:
                          "rgba(255,255,255,.15)",
                          color:"white"
                        }}
                      >

                        <Typography
                          variant="h5"
                          fontWeight={900}
                        >
                          {card[0]}
                        </Typography>


                        <Typography
                          variant="body2"
                        >
                          {card[1]}
                        </Typography>


                      </Paper>


                    </Grid>


                  ))
                }


              </Grid>


            </Paper>


          </Grid>


        </Grid>


      </Container>





      {/* ================= CTA ================= */}



      <Container
        maxWidth="xl"
        sx={{
          pb:12
        }}
      >


        <Paper
          sx={{
            p:{
              xs:5,
              md:9
            },
            borderRadius:7,
            textAlign:"center",
            color:"white",
            background:
            "linear-gradient(135deg,#020617,#2563eb,#7c3aed)"
          }}
        >


          <RocketLaunch
            sx={{
              fontSize:65
            }}
          />


          <Typography
            variant="h3"
            fontWeight={900}
            mt={2}
          >

            Start Building Your Future Today

          </Typography>



          <Typography
            mt={3}
            sx={{
              maxWidth:650,
              mx:"auto",
              opacity:.85,
              lineHeight:1.8
            }}
          >

            Join LearnHub and transform your
            learning into real skills, projects
            and career opportunities.

          </Typography>




          <Button
            size="large"
            onClick={()=>
              navigate("/register")
            }
            sx={{
              mt:5,
              px:6,
              py:1.7,
              borderRadius:3,
              background:"white",
              color:"primary.main",
              fontWeight:900,

              "&:hover":{
                background:"#f1f5f9"
              }
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