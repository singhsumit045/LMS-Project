import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  TextField,
  MenuItem,
  InputAdornment,
  Chip,
  CircularProgress,
  Alert,
  Paper,
  Stack,
} from "@mui/material";

import {
  Search,
  School,
  ArrowForward,
  Add,
  AutoStories,
} from "@mui/icons-material";

import { getCourses } from "../../services/courseService";
import { getProfile } from "../../services/authService";

const CourseList = () => {
  const [courses, setCourses] = useState([]);
  const [user, setUser] = useState(null);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(true);

  const [error, setError] = useState("");

  const carouselRef = useRef(null);
  const animationRef = useRef(null);

  const mousePositionRef = useRef({
    x: 0,
    y: 0,
    inside: false,
  });

  const navigate = useNavigate();

  // =========================================================
  // FETCH USER PROFILE
  // =========================================================

  useEffect(() => {
    let mounted = true;

    const fetchProfile = async () => {
      try {
        const response = await getProfile();

        if (!mounted) return;

        setUser(response.data);

        localStorage.setItem(
          "user",
          JSON.stringify(response.data)
        );
      } catch (error) {
        console.log("Profile fetch error:", error);

        if (!mounted) return;

        try {
          const storedUser = JSON.parse(
            localStorage.getItem("user") || "null"
          );

          setUser(storedUser);
        } catch {
          setUser(null);
        }
      } finally {
        if (mounted) {
          setProfileLoading(false);
        }
      }
    };

    const accessToken =
      localStorage.getItem("access_token") ||
      localStorage.getItem("token");

    if (accessToken) {
      fetchProfile();
    } else {
      setProfileLoading(false);
    }

    return () => {
      mounted = false;
    };
  }, []);

  // =========================================================
  // FETCH COURSES
  // =========================================================

  useEffect(() => {
    let mounted = true;

    const fetchCourses = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getCourses();

        if (!mounted) return;

        setCourses(response.data || []);
      } catch (error) {
        console.log("Course fetch error:", error);

        if (!mounted) return;

        const message =
          error.response?.data?.message;

        setError(
          Array.isArray(message)
            ? message.join(", ")
            : message || "Unable to load courses."
        );
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchCourses();

    return () => {
      mounted = false;
    };
  }, []);

  // =========================================================
  // CATEGORIES
  // =========================================================

  const categories = useMemo(() => {
    return [
      ...new Set(
        courses
          .map((course) => course.category)
          .filter(Boolean)
      ),
    ].sort();
  }, [courses]);

  // =========================================================
  // FILTER COURSES
  // =========================================================

  const filteredCourses = useMemo(() => {
    const searchText = search
      .trim()
      .toLowerCase();

    return courses.filter((course) => {
      const title =
        course.title?.toLowerCase() || "";

      const description =
        course.description?.toLowerCase() || "";

      const matchesSearch =
        !searchText ||
        title.includes(searchText) ||
        description.includes(searchText);

      const matchesCategory =
        category === "all" ||
        course.category === category;

      return matchesSearch && matchesCategory;
    });
  }, [courses, search, category]);

  // =========================================================
  // ROLE CHECK
  // =========================================================

  const canCreateCourse =
    user?.role === "teacher" ||
    user?.role === "admin";

  // =========================================================
  // STOP CAROUSEL ANIMATION
  // =========================================================

  const stopCarousel = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(
        animationRef.current
      );

      animationRef.current = null;
    }
  }, []);

  // =========================================================
  // MOUSE CONTROLLED CAROUSEL
  // =========================================================

  const animateCarousel = useCallback(() => {
    const container = carouselRef.current;

    if (!container) {
      animationRef.current = null;
      return;
    }

    const {
      x,
      inside,
    } = mousePositionRef.current;

    if (!inside) {
      animationRef.current = null;
      return;
    }

    const rect =
      container.getBoundingClientRect();

    const relativeX = x - rect.left;

    const width = rect.width;

    const edgeZone = Math.min(
      180,
      width * 0.22
    );

    let speed = 0;

    // -------------------------------------------------------
    // MOVE RIGHT
    // -------------------------------------------------------

    if (
      relativeX >
      width - edgeZone
    ) {
      const distanceFromEdge =
        relativeX -
        (width - edgeZone);

      const intensity =
        distanceFromEdge /
        edgeZone;

      speed =
        0.8 +
        intensity * 3.5;
    }

    // -------------------------------------------------------
    // MOVE LEFT
    // -------------------------------------------------------

    else if (
      relativeX < edgeZone
    ) {
      const distanceFromEdge =
        edgeZone - relativeX;

      const intensity =
        distanceFromEdge /
        edgeZone;

      speed =
        -(0.8 +
          intensity * 3.5);
    }

    // -------------------------------------------------------
    // SCROLL
    // -------------------------------------------------------

    if (speed !== 0) {
      const maxScroll =
        container.scrollWidth -
        container.clientWidth;

      const nextPosition =
        container.scrollLeft + speed;

      if (nextPosition <= 0) {
        container.scrollLeft = 0;
      } else if (
        nextPosition >= maxScroll
      ) {
        container.scrollLeft = maxScroll;
      } else {
        container.scrollLeft = nextPosition;
      }
    }

    animationRef.current =
      requestAnimationFrame(
        animateCarousel
      );
  }, []);

  // =========================================================
  // MOUSE ENTER
  // =========================================================

  const handleMouseEnter = () => {
    mousePositionRef.current.inside = true;

    stopCarousel();

    animationRef.current =
      requestAnimationFrame(
        animateCarousel
      );
  };

  // =========================================================
  // MOUSE MOVE
  // =========================================================

  const handleMouseMove = (event) => {
    mousePositionRef.current.x =
      event.clientX;

    mousePositionRef.current.y =
      event.clientY;

    if (
      !animationRef.current
    ) {
      animationRef.current =
        requestAnimationFrame(
          animateCarousel
        );
    }
  };

  // =========================================================
  // MOUSE LEAVE
  // =========================================================

  const handleMouseLeave = () => {
    mousePositionRef.current.inside =
      false;

    stopCarousel();
  };

  // =========================================================
  // CLEANUP
  // =========================================================

  useEffect(() => {
    return () => {
      stopCarousel();
    };
  }, [stopCarousel]);

  // =========================================================
  // RESET CAROUSEL WHEN FILTER CHANGES
  // =========================================================

  useEffect(() => {
    if (!carouselRef.current) return;

    carouselRef.current.scrollTo({
      left: 0,
      behavior: "smooth",
    });
  }, [search, category]);

  // =========================================================
  // CLEAR FILTERS
  // =========================================================

  const clearFilters = () => {
    setSearch("");
    setCategory("all");
  };

  // =========================================================
  // CARD
  // =========================================================

  const renderCourseCard = (course) => {
    return (
      <Card
        elevation={0}
        sx={{
          height: "100%",
          minHeight: {
            xs: 455,
            sm: 470,
            md: 485,
          },

          display: "flex",
          flexDirection: "column",

          borderRadius: 4,

          border: "1px solid",
          borderColor: "divider",

          overflow: "hidden",

          backgroundColor:
            "background.paper",

          transition:
            "transform .25s ease, box-shadow .25s ease, border-color .25s ease",

          "&:hover": {
            transform:
              "translateY(-7px)",

            boxShadow:
              "0 18px 45px rgba(0,0,0,0.12)",

            borderColor:
              "primary.main",

            "& .course-image": {
              transform: "scale(1.06)",
            },

            "& .course-arrow": {
              transform:
                "translateX(4px)",
            },
          },
        }}
      >
        {/* =================================================
            IMAGE
        ================================================= */}

        <Box
          sx={{
            position: "relative",

            height: {
              xs: 185,
              sm: 190,
              md: 205,
            },

            overflow: "hidden",

            background:
              "linear-gradient(135deg, #1976d2 0%, #7b1fa2 100%)",

            flexShrink: 0,
          }}
        >
          {course.thumbnail ? (
            <Box
              component="img"
              className="course-image"
              src={course.thumbnail}
              alt={
                course.title ||
                "Course thumbnail"
              }
              onError={(e) => {
                e.currentTarget.style.display =
                  "none";

                const fallback =
                  e.currentTarget
                    .nextElementSibling;

                if (fallback) {
                  fallback.style.display =
                    "flex";
                }
              }}
              sx={{
                width: "100%",
                height: "100%",

                objectFit: "cover",

                display: "block",

                transition:
                  "transform .5s ease",
              }}
            />
          ) : null}

          {/* IMAGE FALLBACK */}

          <Box
            sx={{
              display:
                course.thumbnail
                  ? "none"
                  : "flex",

              position: "absolute",
              inset: 0,

              justifyContent:
                "center",

              alignItems:
                "center",

              color: "white",

              background:
                "linear-gradient(135deg, #1976d2 0%, #7b1fa2 100%)",
            }}
          >
            <School
              sx={{
                fontSize: 58,
                opacity: 0.9,
              }}
            />
          </Box>

          {/* CATEGORY */}

          {course.category && (
            <Chip
              icon={
                <AutoStories
                  sx={{
                    fontSize:
                      "16px !important",
                  }}
                />
              }
              label={course.category}
              size="small"
              sx={{
                position: "absolute",

                top: 14,
                left: 14,

                color: "white",

                backgroundColor:
                  "rgba(0,0,0,0.55)",

                backdropFilter:
                  "blur(8px)",

                border:
                  "1px solid rgba(255,255,255,0.2)",

                fontWeight: 600,

                "& .MuiChip-icon": {
                  color: "white",
                },
              }}
            />
          )}

          {/* PRICE BADGE */}

          <Box
            sx={{
              position: "absolute",

              right: 14,
              bottom: 14,

              px: 1.5,
              py: 0.7,

              borderRadius: 2,

              backgroundColor:
                "rgba(255,255,255,0.95)",

              color:
                "primary.main",

              fontWeight: 800,

              fontSize: "0.95rem",

              boxShadow:
                "0 4px 14px rgba(0,0,0,0.15)",
            }}
          >
            ₹{course.price ?? 0}
          </Box>
        </Box>

        {/* =================================================
            CONTENT
        ================================================= */}

        <CardContent
          sx={{
            flexGrow: 1,

            px: {
              xs: 2,
              md: 2.5,
            },

            pt: 2.5,

            pb: 1.5,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: 750,

              display:
                "-webkit-box",

              WebkitLineClamp: 2,

              WebkitBoxOrient:
                "vertical",

              overflow: "hidden",
              lineHeight: 1.35,
              minHeight: 58
            }}>
            {course.title ||
              "Untitled Course"}
          </Typography>

          <Typography
            variant="body2"
            sx={{
              color: "text.secondary",
              mt: 1.5,

              display:
                "-webkit-box",

              WebkitLineClamp: 3,

              WebkitBoxOrient:
                "vertical",

              overflow: "hidden",
              lineHeight: 1.65,
              minHeight: 68
            }}>
            {course.description ||
              "No description available for this course."}
          </Typography>

          {/* COURSE INFO */}

          <Stack
            direction="row"
            spacing={1}
            sx={{
              mt: 2.2,
              flexWrap: "wrap",
            }}
          >
            <Chip
              size="small"
              label="Online Course"
              variant="outlined"
              sx={{
                borderRadius: 1.5,
              }}
            />

            {course.category && (
              <Chip
                size="small"
                label={course.category}
                variant="outlined"
                color="primary"
                sx={{
                  borderRadius: 1.5,
                }}
              />
            )}
          </Stack>
        </CardContent>

        {/* =================================================
            ACTION
        ================================================= */}

        <CardActions
          sx={{
            px: {
              xs: 2,
              md: 2.5,
            },

            pb: {
              xs: 2,
              md: 2.5,
            },

            pt: 0,
          }}
        >
          <Button
            fullWidth
            variant="contained"
            endIcon={
              <ArrowForward className="course-arrow" />
            }
            onClick={() =>
              navigate(
                `/courses/${course.id}`
              )
            }
            sx={{
              minHeight: 44,

              borderRadius: 2.5,

              fontWeight: 700,

              textTransform:
                "none",

              transition:
                "all .2s ease",

              "& .course-arrow": {
                transition:
                  "transform .2s ease",
              },
            }}
          >
            View Course
          </Button>
        </CardActions>
      </Card>
    );
  };

  // =========================================================
  // UI
  // =========================================================

  return (
    <Container
      maxWidth="xl"
      sx={{
        py: {
          xs: 3,
          md: 5,
        },
      }}
    >
      {/* =====================================================
          HEADER
      ===================================================== */}

      <Box
        sx={{
          display: "flex",

          flexDirection: {
            xs: "column",
            md: "row",
          },

          justifyContent:
            "space-between",

          alignItems: {
            xs: "flex-start",
            md: "center",
          },

          gap: 2,

          mb: 4,
        }}
      >
        <Box>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 800,

              fontSize: {
                xs: "2rem",
                md: "2.5rem",
              },

              letterSpacing:
                "-0.5px"
            }}>
            Explore Courses
          </Typography>

          <Typography
            sx={{
              color: "text.secondary",
              mt: 0.8,
              fontSize: "1rem"
            }}>
            Learn new skills and grow
            your career
          </Typography>
        </Box>

        {!profileLoading &&
          canCreateCourse && (
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() =>
                navigate(
                  "/courses/create"
                )
              }
              sx={{
                borderRadius: 2.5,

                px: 2.5,

                py: 1.1,

                fontWeight: 700,

                textTransform:
                  "none",

                whiteSpace:
                  "nowrap",
              }}
            >
              Create Course
            </Button>
          )}
      </Box>

      {/* =====================================================
          SEARCH + FILTER
      ===================================================== */}

      <Paper
        elevation={0}
        sx={{
          p: {
            xs: 2,
            md: 2.5,
          },

          mb: 4,

          borderRadius: 3,

          border: "1px solid",

          borderColor:
            "divider",

          backgroundColor:
            "background.paper",
        }}
      >
        <Box
          sx={{
            display: "grid",

            gridTemplateColumns: {
              xs: "1fr",
              md: "2fr 1fr",
            },

            gap: 2,
          }}
        >
          <TextField
            fullWidth
            label="Search courses"
            placeholder="Search by title or description..."
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              },
            }}
          />

          <TextField
            fullWidth
            select
            label="Category"
            value={category}
            onChange={(e) =>
              setCategory(
                e.target.value
              )
            }
          >
            <MenuItem value="all">
              All Categories
            </MenuItem>

            {categories.map(
              (item) => (
                <MenuItem
                  key={item}
                  value={item}
                >
                  {item}
                </MenuItem>
              )
            )}
          </TextField>
        </Box>
      </Paper>

      {/* =====================================================
          ERROR
      ===================================================== */}

      {error && (
        <Alert
          severity="error"
          sx={{
            mb: 3,
            borderRadius: 2,
          }}
        >
          {error}
        </Alert>
      )}

      {/* =====================================================
          LOADING
      ===================================================== */}

      {loading ? (
        <Box
          sx={{
            minHeight: 300,

            display: "flex",

            justifyContent:
              "center",

            alignItems: "center",
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <>
          {/* =================================================
              COURSE HEADER
          ================================================= */}

          <Box
            sx={{
              display: "flex",

              justifyContent:
                "space-between",

              alignItems: "center",

              gap: 2,

              mb: 2.5,
            }}
          >
            <Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700
                }}
              >
                {filteredCourses.length}{" "}
                {filteredCourses.length ===
                1
                  ? "Course"
                  : "Courses"}
              </Typography>

              {filteredCourses.length >
                3 && (
                <Typography
                  variant="caption"
                  sx={{
                    color: "text.secondary"
                  }}
                >
                  Move your mouse to
                  the left or right
                  edge to scroll
                </Typography>
              )}
            </Box>

            {(search ||
              category !== "all") && (
              <Button
                size="small"
                onClick={
                  clearFilters
                }
                sx={{
                  whiteSpace:
                    "nowrap",
                  textTransform:
                    "none",
                }}
              >
                Clear Filters
              </Button>
            )}
          </Box>

          {/* =================================================
              EMPTY STATE
          ================================================= */}

          {filteredCourses.length ===
          0 ? (
            <Paper
              elevation={0}
              sx={{
                p: {
                  xs: 4,
                  md: 7,
                },

                textAlign:
                  "center",

                borderRadius: 3,

                border: "1px solid",

                borderColor:
                  "divider",
              }}
            >
              <School
                sx={{
                  fontSize: 60,

                  color:
                    "text.secondary",

                  mb: 1,
                }}
              />

              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700
                }}
              >
                No courses found
              </Typography>

              <Typography
                sx={{
                  color: "text.secondary",
                  mt: 1
                }}>
                Try changing your
                search or category
                filter.
              </Typography>

              <Button
                variant="outlined"
                sx={{
                  mt: 2.5,
                  borderRadius: 2,
                  textTransform:
                    "none",
                }}
                onClick={
                  clearFilters
                }
              >
                Clear Filters
              </Button>
            </Paper>
          ) : (
            /* =================================================
               MOUSE CONTROLLED CAROUSEL
            ================================================= */

            <Box
              sx={{
                position:
                  "relative",

                width: "100%",
              }}
            >
              {/* LEFT EDGE FADE */}

              {filteredCourses.length >
                3 && (
                <>
                  <Box
                    sx={{
                      position:
                        "absolute",

                      left: 0,
                      top: 0,
                      bottom: 0,

                      width: {
                        xs: 20,
                        md: 55,
                      },

                      zIndex: 2,

                      pointerEvents:
                        "none",

                      background:
                        "linear-gradient(to right, background.paper, transparent)",

                      opacity: 0.7,
                    }}
                  />

                  {/* RIGHT EDGE FADE */}

                  <Box
                    sx={{
                      position:
                        "absolute",

                      right: 0,
                      top: 0,
                      bottom: 0,

                      width: {
                        xs: 20,
                        md: 55,
                      },

                      zIndex: 2,

                      pointerEvents:
                        "none",

                      background:
                        "linear-gradient(to left, background.paper, transparent)",

                      opacity: 0.7,
                    }}
                  />
                </>
              )}

              <Box
                ref={
                  carouselRef
                }
                onMouseEnter={
                  handleMouseEnter
                }
                onMouseMove={
                  handleMouseMove
                }
                onMouseLeave={
                  handleMouseLeave
                }
                sx={{
                  display: "flex",

                  gap: 3,

                  width: "100%",

                  overflowX:
                    "auto",

                  overflowY:
                    "hidden",

                  scrollBehavior:
                    "auto",

                  WebkitOverflowScrolling:
                    "touch",

                  px: {
                    xs: 0,
                    md: 0.5,
                  },

                  pb: 2,

                  cursor:
                    filteredCourses.length >
                    3
                      ? "default"
                      : "default",

                  "&::-webkit-scrollbar":
                    {
                      display:
                        "none",
                    },

                  scrollbarWidth:
                    "none",

                  msOverflowStyle:
                    "none",
                }}
              >
                {filteredCourses.map(
                  (course) => (
                    <Box
                      key={
                        course.id
                      }
                      sx={{
                        flex: {
                          xs: "0 0 100%",
                          sm: "0 0 calc(50% - 12px)",
                          md: "0 0 calc(33.333% - 16px)",
                        },

                        minWidth: 0,
                      }}
                    >
                      {renderCourseCard(
                        course
                      )}
                    </Box>
                  )
                )}
              </Box>
            </Box>
          )}
        </>
      )}
    </Container>
  );
};

export default CourseList;