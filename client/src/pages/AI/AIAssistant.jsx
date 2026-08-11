
import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Avatar,
  Box,
  Button,
  CircularProgress,
  Container,
  Divider,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import SmartToyIcon from "@mui/icons-material/SmartToy";
import SendIcon from "@mui/icons-material/Send";
import PersonIcon from "@mui/icons-material/Person";

import aiService from "../../services/aiService";

const AIAssistant = () => {
  const [message, setMessage] = useState("");

  const [messages, setMessages] = useState([
    {
      role: "ai",
      content:
        "Hello! 👋 I'm your AI Study Assistant. Ask me anything about React, JavaScript, Java, NestJS, databases, or other technical topics.",
    },
  ]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Used to automatically scroll to the latest message
  const messagesEndRef = useRef(null);

  // =========================
  // AUTO SCROLL
  // =========================

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);

  // =========================
  // ASK AI
  // =========================

  const askAI = async () => {
    const question = message.trim();

    if (!question || loading) {
      return;
    }

    setError("");

    // Add user message immediately
    setMessages((previousMessages) => [
      ...previousMessages,
      {
        role: "user",
        content: question,
      },
    ]);

    // Clear input
    setMessage("");

    // Start loading
    setLoading(true);

    try {
      const response = await aiService.chat(question);

      console.log("AI RESPONSE:", response);

      /*
       * Backend can return either:
       *
       * 1. {
       *      success: true,
       *      message: "React is..."
       *    }
       *
       * OR
       *
       * 2. "React is..."
       *
       * Handle both formats.
       */

      let aiMessage = "";

      if (typeof response === "string") {
        aiMessage = response;
      } else if (response?.message) {
        aiMessage = response.message;
      } else if (response?.data?.message) {
        aiMessage = response.data.message;
      }

      if (!aiMessage) {
        aiMessage =
          "Sorry, I could not generate a response.";
      }

      // Add AI response
      setMessages((previousMessages) => [
        ...previousMessages,
        {
          role: "ai",
          content: aiMessage,
        },
      ]);
    } catch (error) {
      console.error("AI Chat Error:", error);

      const backendMessage =
        error?.response?.data?.message;

      setError(
        backendMessage ||
          "Unable to connect with AI. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // KEYBOARD HANDLER
  // =========================

  const handleKeyDown = (event) => {
    /*
     * Enter = Send
     * Shift + Enter = New line
     */

    if (
      event.key === "Enter" &&
      !event.shiftKey
    ) {
      event.preventDefault();
      askAI();
    }
  };

  // =========================
  // UI
  // =========================

  return (
    <Container
      maxWidth="md"
      sx={{
        py: {
          xs: 2,
          sm: 3,
          md: 4,
        },
      }}
    >
      <Paper
        elevation={4}
        sx={{
          height: {
            xs: "calc(100vh - 100px)",
            md: "calc(100vh - 150px)",
          },

          minHeight: {
            xs: 500,
            md: 550,
          },

          display: "flex",
          flexDirection: "column",

          overflow: "hidden",

          borderRadius: {
            xs: 2,
            sm: 3,
          },
        }}
      >
        {/* =========================
            HEADER
        ========================= */}

        <Box
          sx={{
            px: {
              xs: 2,
              sm: 3,
            },

            py: 2,

            display: "flex",
            alignItems: "center",

            gap: 2,

            borderBottom: 1,
            borderColor: "divider",
          }}
        >
          <Avatar
            sx={{
              width: 45,
              height: 45,
              bgcolor: "primary.main",
            }}
          >
            <SmartToyIcon />
          </Avatar>

          <Box sx={{ minWidth: 0 }}>
            <Typography
              variant="h6"
              fontWeight={700}
            >
              AI Study Assistant
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
            >
              Your personal AI learning assistant
            </Typography>
          </Box>
        </Box>

        {/* =========================
            CHAT AREA
        ========================= */}
        <Box
          sx={{
            flex: 1,

            overflowY: "auto",

            p: {
              xs: 2,
              sm: 3,
            },

            bgcolor: "background.default",
          }}
        >
          <Stack spacing={2.5}>
            {messages.map((item, index) => {
              const isUser =
                item.role === "user";

              return (
                <Box
                  key={index}
                  sx={{
                    display: "flex",

                    justifyContent: isUser
                      ? "flex-end"
                      : "flex-start",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",

                      alignItems:
                        "flex-start",

                      gap: 1,

                      maxWidth: {
                        xs: "95%",
                        sm: "82%",
                      },

                      flexDirection: isUser
                        ? "row-reverse"
                        : "row",
                    }}
                  >
                    {/* Avatar */}

                    <Avatar
                      sx={{
                        width: 36,
                        height: 36,

                        flexShrink: 0,

                        bgcolor: isUser
                          ? "primary.main"
                          : "secondary.main",
                      }}
                    >
                      {isUser ? (
                        <PersonIcon fontSize="small" />
                      ) : (
                        <SmartToyIcon fontSize="small" />
                      )}
                    </Avatar>

                    {/* Message */}

                    <Paper
                      elevation={1}
                      sx={{
                        px: 2,
                        py: 1.5,

                        borderRadius: 2.5,

                        bgcolor: isUser
                          ? "primary.main"
                          : "background.paper",

                        color: isUser
                          ? "primary.contrastText"
                          : "text.primary",

                        whiteSpace: "pre-wrap",

                        wordBreak:
                          "break-word",

                        overflowWrap:
                          "anywhere",
                      }}
                    >
                      <Typography
                        variant="body1"
                        sx={{
                          lineHeight: 1.7,
                        }}
                      >
                        {item.content}
                      </Typography>
                    </Paper>
                  </Box>
                </Box>
              );
            })}

            {/* =========================
                AI LOADING
            ========================= */}

            {loading && (
              <Box
                sx={{
                  display: "flex",

                  alignItems:
                    "flex-start",

                  gap: 1,
                }}
              >
                <Avatar
                  sx={{
                    width: 36,
                    height: 36,

                    bgcolor:
                      "secondary.main",
                  }}
                >
                  <SmartToyIcon fontSize="small" />
                </Avatar>

                <Paper
                  elevation={1}
                  sx={{
                    px: 2,
                    py: 1.5,

                    borderRadius: 2.5,
                  }}
                >
                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                  >
                    <CircularProgress
                      size={18}
                    />

                    <Typography
                      variant="body2"
                      color="text.secondary"
                    >
                      AI is thinking...
                    </Typography>
                  </Stack>
                </Paper>
              </Box>
            )}

            {/* Auto-scroll target */}

            <Box ref={messagesEndRef} />
          </Stack>
        </Box>

        {/* =========================
            ERROR
        ========================= */}

        {error && (
          <Box
            sx={{
              px: {
                xs: 1.5,
                sm: 2,
              },

              pb: 1,
            }}
          >
            <Alert
              severity="error"
              onClose={() => setError("")}
            >
              {error}
            </Alert>
          </Box>
        )}

        <Divider />

        {/* =========================
            INPUT AREA
        ========================= */}

        <Box
          sx={{
            p: {
              xs: 1.5,
              sm: 2,
            },
          }}
        >
          <Stack
            direction="row"
            spacing={1}
            alignItems="flex-end"
          >
            <TextField
              fullWidth
              multiline
              maxRows={4}
              value={message}
              onChange={(event) =>
                setMessage(
                  event.target.value
                )
              }
              onKeyDown={handleKeyDown}
              placeholder="Ask your question..."
              disabled={loading}
              size="medium"
            />

            <Button
              variant="contained"
              onClick={askAI}
              disabled={
                !message.trim() ||
                loading
              }
              sx={{
                minWidth: 52,
                width: 52,
                height: 56,

                borderRadius: 2,
              }}
            >
              {loading ? (
                <CircularProgress
                  size={22}
                  color="inherit"
                />
              ) : (
                <SendIcon />
              )}
            </Button>
          </Stack>

          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              display: "block",

              mt: 1,

              textAlign: "center",
            }}
          >
            Press Enter to send • Shift +
            Enter for a new line
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default AIAssistant;

