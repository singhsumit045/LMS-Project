import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import {
  Container,
  Paper,
  TextField,
  Button,
  Typography
} from "@mui/material";

import {
  getCourseById,
  updateCourse
} from "../../services/courseService";


const EditCourse = () => {

  const { id } = useParams();
  const navigate = useNavigate();


  const [course,setCourse] = useState({
    title:"",
    description:"",
    category:"",
    price:""
  });

  useEffect(()=>{
    fetchCourse();
  },[]);

  const fetchCourse = async()=>{

    const response = await getCourseById(id);

    setCourse(response.data);

  };
  const handleChange=(e)=>{

    setCourse({
      ...course,
      [e.target.name]: e.target.value
    });

  };

  const handleSubmit=async(e)=>{

    e.preventDefault();

    await updateCourse(id,course);

    navigate(`/courses/${id}`);

  };

  return (

    <Container maxWidth="md" sx={{mt:5}}>

      <Paper
        sx={{
          p:4,
          borderRadius:4
        }}
      >

        <Typography
          variant="h4"
          fontWeight="bold"
          mb={3}
        >
          Edit Course
        </Typography>


        <form onSubmit={handleSubmit}>


          <TextField
            fullWidth
            label="Course Title"
            name="title"
            value={course.title}
            onChange={handleChange}
            sx={{mb:2}}
          />


          <TextField
            fullWidth
            multiline
            rows={4}
            label="Description"
            name="description"
            value={course.description}
            onChange={handleChange}
            sx={{mb:2}}
          />


          <TextField
            fullWidth
            label="Category"
            name="category"
            value={course.category}
            onChange={handleChange}
            sx={{mb:2}}
          />


          <TextField
            fullWidth
            label="Price"
            name="price"
            value={course.price}
            onChange={handleChange}
            sx={{mb:3}}
          />


          <Button
            type="submit"
            variant="contained"
            size="large"
          >
            Update Course
          </Button>
        </form>
      </Paper>

    </Container>

  );
};


export default EditCourse;