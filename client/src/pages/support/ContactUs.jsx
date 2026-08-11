
import { useState } from "react";

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import SendIcon from "@mui/icons-material/Send";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";

const ContactUs = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // Backend API can be connected here later.
    console.log("Contact form:", form);

    setSubmitted(true);

    setForm({
      name: "",
      email: "",
      subject: "",
      message: "",
    });
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "background.default",
        py: { xs: 4, md: 7 },
      }}
    >
      <Container maxWidth="lg">
        {/* HEADER */}
        <Stack
          alignItems="center"
          textAlign="center"
          spacing={2}
          sx={{ mb: 6 }}
        >
          <Box
            sx={{
              width: 64,
              height: 64,
              borderRadius: 3,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: "primary.main",
              color: "primary.contrastText",
            }}
          >
            <SupportAgentIcon fontSize="large" />
          </Box>

          <Typography
            variant="h2"
            fontWeight={900}
            sx={{
              fontSize: {
                xs: "2.2rem",
                md: "3.4rem",
              },
            }}
          >
            Contact Us
          </Typography>

          <Typography
            color="text.secondary"
            variant="h6"
            sx={{
              maxWidth: 700,
              fontWeight: 400,
            }}
          >
            Have a question or facing an issue?
            Send us a message and our team will
            get back to you.
          </Typography>
        </Stack>

        {submitted && (
          <Alert
            severity="success"
            sx={{ mb: 3 }}
            onClose={() => setSubmitted(false)}
          >
            Your message has been submitted successfully.
            We will get back to you soon.
          </Alert>
        )}

        <Grid container spacing={4}>
          {/* CONTACT INFORMATION */}
          <Grid
            size={{
              xs: 12,
              md: 5,
            }}
          >
            <Stack spacing={2.5}>
              <Card
                elevation={0}
                sx={{
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 3,
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Typography
                    variant="h5"
                    fontWeight={800}
                    sx={{ mb: 1 }}
                  >
                    Get in touch
                  </Typography>

                  <Typography
                    color="text.secondary"
                    sx={{
                      mb: 3,
                      lineHeight: 1.8,
                    }}
                  >
                    We are here to help with your
                    learning experience and technical
                    questions.
                  </Typography>

                  <Stack spacing={3}>
                    <Stack
                      direction="row"
                      spacing={2}
                    >
                      <EmailOutlinedIcon
                        color="primary"
                      />

                      <Box>
                        <Typography fontWeight={700}>
                          Email
                        </Typography>

                        <Typography
                          color="text.secondary"
                        >
                          learnhub.lms@gmail.com
                        </Typography>
                      </Box>
                    </Stack>

                    <Stack
                      direction="row"
                      spacing={2}
                    >
                      <PhoneOutlinedIcon
                        color="primary"
                      />

                      <Box>
                        <Typography fontWeight={700}>
                          Phone
                        </Typography>

                        <Typography
                          color="text.secondary"
                        >
                          +91 7004854366
                        </Typography>
                      </Box>
                    </Stack>

                    <Stack
                      direction="row"
                      spacing={2}
                    >
                      <LocationOnOutlinedIcon
                        color="primary"
                      />

                      <Box>
                        <Typography fontWeight={700}>
                          Location
                        </Typography>

                        <Typography
                          color="text.secondary"
                        >
                          India, jaipur
                        </Typography>
                      </Box>
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>

              <Paper
                sx={{
                  p: 3,
                  borderRadius: 3,
                  bgcolor: "primary.main",
                  color: "primary.contrastText",
                }}
              >
                <Typography
                  variant="h6"
                  fontWeight={800}
                  sx={{ mb: 1 }}
                >
                  Support hours
                </Typography>

                <Typography
                  sx={{
                    opacity: 0.9,
                    lineHeight: 1.8,
                  }}
                >
                  Monday – Saturday
                  <br />
                  9:00 AM – 6:00 PM IST
                </Typography>
              </Paper>
            </Stack>
          </Grid>

          {/* FORM */}
          <Grid
            size={{
              xs: 12,
              md: 7,
            }}
          >
            <Card
              elevation={2}
              sx={{
                borderRadius: 3,
              }}
            >
              <CardContent
                sx={{
                  p: {
                    xs: 2.5,
                    md: 4,
                  },
                }}
              >
                <Typography
                  variant="h5"
                  fontWeight={800}
                  sx={{ mb: 1 }}
                >
                  Send us a message
                </Typography>

                <Typography
                  color="text.secondary"
                  sx={{ mb: 3 }}
                >
                  Fill out the form below and provide
                  as much detail as possible.
                </Typography>

                <Box
                  component="form"
                  onSubmit={handleSubmit}
                >
                  <Stack spacing={2.5}>
                    <Grid container spacing={2}>
                      <Grid
                        size={{
                          xs: 12,
                          sm: 6,
                        }}
                      >
                        <TextField
                          fullWidth
                          required
                          label="Full Name"
                          name="name"
                          value={form.name}
                          onChange={handleChange}
                        />
                      </Grid>

                      <Grid
                        size={{
                          xs: 12,
                          sm: 6,
                        }}
                      >
                        <TextField
                          fullWidth
                          required
                          type="email"
                          label="Email Address"
                          name="email"
                          value={form.email}
                          onChange={handleChange}
                        />
                      </Grid>
                    </Grid>

                    <TextField
                      fullWidth
                      required
                      label="Subject"
                      name="subject"
                      value={form.subject}
                      onChange={handleChange}
                    />

                    <TextField
                      fullWidth
                      required
                      multiline
                      minRows={6}
                      label="Message"
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                    />

                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      startIcon={<SendIcon />}
                      sx={{
                        alignSelf: {
                          xs: "stretch",
                          sm: "flex-start",
                        },
                        minWidth: 180,
                        borderRadius: 2,
                        fontWeight: 700,
                      }}
                    >
                      Send Message
                    </Button>
                  </Stack>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default ContactUs;

