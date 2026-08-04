import api from "./api";

export const updateVideoProgress = (
  videoId,
  watchedPercentage
) => {
  return api.post(
    `/video-progress/${videoId}`,
    {
      watchedPercentage,
    }
  );
};

export const getCourseProgress = (courseId) => {
  return api.get(
    `/video-progress/course/${courseId}`
  );
};

export const getVideoProgress = (videoId) => {
  return api.get(
    `/video-progress/video/${videoId}`
  );
};