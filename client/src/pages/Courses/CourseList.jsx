import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActionArea,
} from "@mui/material";

import { getCourses } from "../../services/courseService";

const CourseList = () => {
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await getCourses();
      setCourses(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 5, mb: 5 }}>
      <Typography
        variant="h4"
        fontWeight="bold"
        align="center"
        sx={{ mb: 5 }}
      >
        All Courses
      </Typography>

      <Grid container spacing={4} justifyContent="center">
        {courses.map((course) => (
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            key={course.id}
            sx={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Card
              elevation={5}
              sx={{
                width: 330,
                height: 260,
                borderRadius: 4,
                overflow: "hidden",
                transition: "0.3s",
                cursor: "pointer",

                "&:hover": {
                  transform: "translateY(-8px)",
                  boxShadow: 10,
                },
              }}
            >
              <CardActionArea
                onClick={() => navigate(`/courses/${course.id}`)}
                sx={{
                  width: "100%",
                  height: "100%",
                }}
              >
                <CardContent
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Typography
                    variant="h6"
                    fontWeight="bold"
                    gutterBottom
                    noWrap
                  >
                    {course.title}
                  </Typography>

                  <Typography
                    color="primary"
                    fontWeight="600"
                  >
                    {course.category}
                  </Typography>

                  <Typography
                    sx={{
                      mt: 1,
                      fontWeight: "bold",
                      fontSize: "1.1rem",
                    }}
                  >
                    ₹{course.price}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      mt: 2,
                      overflow: "hidden",
                      display: "-webkit-box",
                      WebkitLineClamp: 4,
                      WebkitBoxOrient: "vertical",
                    }}
                  >
                    {course.description}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default CourseList;