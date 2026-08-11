import api from "./api";

const aiService = {
  chat: async (message) => {
    const response = await api.post("/ai/chat", {
      message,
    });

    return response.data;
  },

  generateQuiz: async ({
    topic,
    numberOfQuestions,
    difficulty,
  }) => {
    const response = await api.post(
      "/ai/generate-quiz",
      {
        topic,
        numberOfQuestions,
        difficulty,
      }
    );

    return response.data;
  },
};

export default aiService;