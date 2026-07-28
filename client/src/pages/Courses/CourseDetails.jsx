import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Chip,
  CircularProgress,
  Button,
  Divider,
  Avatar,
} from "@mui/material";

import {
  AccessTime,
  Star,
  School,
  PlayCircle,
} from "@mui/icons-material";

import { getCourseById } from "../../services/courseService";


const CourseDetails = () => {

  const { id } = useParams();
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    fetchCourse();
  }, [id]);


  const fetchCourse = async () => {
    try {

      const response = await getCourseById(id);
      setCourse(response.data);

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);

    }
  };


  if (loading) {
    return (
      <Box
        sx={{
          display:"flex",
          justifyContent:"center",
          mt:10
        }}
      >
        <CircularProgress />
      </Box>
    );
  }


  if (!course) {
    return (
      <Typography align="center" mt={5}>
        Course not found
      </Typography>
    );
  }



  return (

    <Container
      maxWidth="lg"
      sx={{
        mt:5,
        mb:5
      }}
    >

      <Grid
        container
        spacing={4}
      >


        {/* LEFT SIDE */}

        <Grid
          size={{
            xs:12,
            md:8
          }}
        >

          <Paper
            elevation={4}
            sx={{
              p:4,
              borderRadius:4
            }}
          >

            <Typography
              variant="h3"
              fontWeight="bold"
              gutterBottom
            >
              {course.title}
            </Typography>


            <Typography
              color="text.secondary"
              fontSize={18}
              mb={3}
            >
              {course.description}
            </Typography>



            <Box
              sx={{
                display:"flex",
                gap:1,
                flexWrap:"wrap"
              }}
            >

              <Chip
                label={course.category}
                color="primary"
              />


              <Chip
                icon={<School />}
                label={course.level || "Beginner"}
              />


              <Chip
                icon={<AccessTime />}
                label={course.duration || "10 Hours"}
              />


              <Chip
                icon={<Star />}
                label={course.rating || "4.8"}
                color="warning"
              />

            </Box>



            <Divider sx={{my:4}} />


            <Typography
              variant="h5"
              fontWeight="bold"
              mb={2}
            >
              What you'll learn
            </Typography>


            <Typography>
              ✓ Build real-world applications
            </Typography>

            <Typography>
              ✓ Learn industry best practices
            </Typography>

            <Typography>
              ✓ Work with modern technologies
            </Typography>

            <Typography>
              ✓ Create practical projects
            </Typography>



            <Divider sx={{my:4}} />



            <Typography
              variant="h5"
              fontWeight="bold"
            >
              Instructor
            </Typography>


            <Box
              sx={{
                display:"flex",
                alignItems:"center",
                gap:2,
                mt:2
              }}
            >

              <Avatar>
                S
              </Avatar>


              <Box>

                <Typography fontWeight="bold">
                  Sumit Singh
                </Typography>

                <Typography color="text.secondary">
                  Full Stack Developer
                </Typography>

              </Box>

            </Box>


          </Paper>

        </Grid>


        {/* RIGHT SIDE */}


        <Grid
          size={{
            xs:12,
            md:4
          }}
        >

          <Paper
            elevation={5}
            sx={{
              p:3,
              borderRadius:4,
              position:"sticky",
              top:20
            }}
          >

            <Box
              sx={{
                height:180,
                bgcolor:"grey.200",
                borderRadius:3,
                display:"flex",
                alignItems:"center",
                justifyContent:"center"
              }}
            >
              <PlayCircle
                sx={{
                  fontSize:60,
                  color:"primary.main"
                }}
              />
            </Box>

            <Typography
              variant="h4"
              fontWeight="bold"
              mt={3}
              color="success.main"
            >
              ₹{course.price}
            </Typography>

            <Button
              fullWidth
              variant="contained"
              size="large"
              sx={{
                mt:3,
                borderRadius:3
              }}
            >
              Enroll Now
            </Button>

            {/* ADMIN + TEACHER */}

            {(user?.role === "admin" ||
              user?.role === "teacher") && (

              <Button
                fullWidth
                variant="outlined"
                size="large"
                sx={{
                  mt:2,
                  borderRadius:3
                }}

                onClick={() =>
                  navigate(`/courses/edit/${course.id}`)
                }
              >
                Edit Course
              </Button>

            )}
            <Divider sx={{my:3}} />

            <Typography>
              ✔ Lifetime Access
            </Typography>

            <Typography>
              ✔ Certificate Included
            </Typography>

            <Typography>
              ✔ Project Based Learning
            </Typography>
          </Paper>
        </Grid>

      </Grid>


    </Container>

  );

};


export default CourseDetails;