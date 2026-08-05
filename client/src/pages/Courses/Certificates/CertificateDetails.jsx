
import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Container,
    Paper,
    Typography,
} from "@mui/material";

import {
    ArrowBack,
    Download,
    Print,
} from "@mui/icons-material";

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import LearnHubLogo from "../../../assets/LearnHub.png";

import {
    getCertificateById,
} from "../../../services/certificateService";

const CertificateDetails = () => {
    const { certificateId } = useParams();
    const navigate = useNavigate();

    const [certificate, setCertificate] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // =====================================================
    // GET CERTIFICATE
    // =====================================================

    useEffect(() => {
        const fetchCertificate = async () => {
            try {
                setLoading(true);
                setError("");

                const data = await getCertificateById(
                    certificateId
                );

                console.log(
                    "Certificate Data:",
                    data
                );

                setCertificate(data);
            } catch (err) {
                console.error(
                    "Certificate Error:",
                    err
                );

                setError(
                    err.response?.data?.message ||
                        "Unable to load certificate."
                );
            } finally {
                setLoading(false);
            }
        };

        if (certificateId) {
            fetchCertificate();
        }
    }, [certificateId]);

    // =====================================================
    // PRINT
    // =====================================================

    const handlePrint = () => {
        window.print();
    };

    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {
        return (
            <Box
                sx={{
                    minHeight: "70vh",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <CircularProgress size={45} />
            </Box>
        );
    }

    // =====================================================
    // ERROR
    // =====================================================

    if (error) {
        return (
            <Container
                maxWidth="md"
                sx={{ py: 5 }}
            >
                <Alert
                    severity="error"
                    sx={{ mb: 3 }}
                >
                    {error}
                </Alert>

                <Button
                    variant="contained"
                    startIcon={<ArrowBack />}
                    onClick={() =>
                        navigate("/my-courses")
                    }
                >
                    Back
                </Button>
            </Container>
        );
    }

    if (!certificate) {
        return (
            <Container
                maxWidth="md"
                sx={{ py: 5 }}
            >
                <Alert severity="warning">
                    Certificate not found.
                </Alert>
            </Container>
        );
    }

    // =====================================================
    // CERTIFICATE DATA
    // =====================================================

    const studentName =
        certificate.student?.name ||
        certificate.studentName ||
        certificate.user?.name ||
        "Student";

    const courseName =
        certificate.course?.title ||
        certificate.courseName ||
        "Course";

    const examName =
        certificate.exam?.title ||
        certificate.examTitle ||
        "Final Assessment";

    const percentage =
        certificate.percentage ??
        certificate.score ??
        0;

    const certificateNumber =
        certificate.certificateNumber ||
        certificate.certificateId ||
        certificate.id ||
        "N/A";

    const issueDate =
        certificate.issuedAt ||
        certificate.createdAt ||
        new Date().toISOString();

    const teacherName =
        certificate.teacher?.name ||
        certificate.teacherName ||
        certificate.exam?.teacher?.name ||
        "Instructor";

    const formattedDate =
        new Date(issueDate).toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "long",
                year: "numeric",
            }
        );

    // =====================================================
    // UI
    // =====================================================

    return (
        <>
            {/* =================================================
                PRINT CSS
            ================================================= */}

            <style>
                {`
                    @page {
                        size: A4 landscape;
                        margin: 0;
                    }

                    @media print {

                        html,
                        body {
                            width: 297mm !important;
                            height: 210mm !important;
                            margin: 0 !important;
                            padding: 0 !important;
                            overflow: hidden !important;
                            background: #ffffff !important;
                        }

                        body * {
                            visibility: hidden;
                        }

                        .certificate-print-area,
                        .certificate-print-area * {
                            visibility: visible;
                        }

                        .certificate-print-area {
                            position: absolute !important;
                            left: 0 !important;
                            top: 0 !important;
                            width: 297mm !important;
                            height: 210mm !important;
                            margin: 0 !important;
                            padding: 0 !important;
                            overflow: hidden !important;
                        }

                        .no-print {
                            display: none !important;
                        }

                        /* Hide website footer */
                        footer,
                        .footer,
                        #footer,
                        [class*="footer"],
                        [id*="footer"] {
                            display: none !important;
                            visibility: hidden !important;
                        }

                        .certificate-paper {
                            width: 297mm !important;
                            height: 210mm !important;
                            min-height: 0 !important;
                            max-width: none !important;
                            margin: 0 !important;
                            padding: 0 !important;
                            border-radius: 0 !important;
                            box-shadow: none !important;
                            overflow: hidden !important;
                            page-break-after: avoid !important;
                            page-break-before: avoid !important;
                            page-break-inside: avoid !important;
                        }

                        .certificate-content {
                            width: 100% !important;
                            height: 100% !important;
                            min-height: 0 !important;
                            padding: 25mm 30mm !important;
                            box-sizing: border-box !important;
                        }
                    }
                `}
            </style>

            {/* =================================================
                SCREEN CONTAINER
            ================================================= */}

            <Container
                maxWidth="xl"
                className="certificate-print-area"
                sx={{
                    py: {
                        xs: 2,
                        sm: 4,
                        md: 5,
                    },
                }}
            >
                {/* =================================================
                    BUTTONS
                ================================================= */}

                <Box
                    className="no-print"
                    sx={{
                        display: "flex",
                        justifyContent:
                            "space-between",
                        alignItems: "center",
                        gap: 2,
                        mb: 3,
                        flexWrap: "wrap",
                    }}
                >
                    <Button
                        variant="outlined"
                        startIcon={<ArrowBack />}
                        onClick={() =>
                            navigate("/my-courses")
                        }
                    >
                        Back
                    </Button>

                    <Box
                        sx={{
                            display: "flex",
                            gap: 2,
                            flexWrap: "wrap",
                        }}
                    >
                        <Button
                            variant="outlined"
                            startIcon={<Print />}
                            onClick={handlePrint}
                        >
                            Print
                        </Button>

                        <Button
                            variant="contained"
                            startIcon={<Download />}
                            onClick={handlePrint}
                        >
                            Download Certificate
                        </Button>
                    </Box>
                </Box>

                {/* =================================================
                    CERTIFICATE
                ================================================= */}

                <Paper
                    className="certificate-paper"
                    elevation={8}
                    sx={{
                        position: "relative",
                        overflow: "hidden",

                        width: "100%",
                        maxWidth: 1200,

                        height: {
                            xs: 620,
                            sm: 680,
                            md: 700,
                        },

                        mx: "auto",

                        backgroundColor: "#fff",
                    }}
                >
                    {/* =================================================
                        OUTER BORDER
                    ================================================= */}

                    <Box
                        sx={{
                            position: "absolute",
                            inset: {
                                xs: 8,
                                sm: 14,
                                md: 18,
                            },
                            border:
                                "3px solid #c9a227",
                            pointerEvents:
                                "none",
                            zIndex: 5,
                        }}
                    />

                    {/* =================================================
                        INNER BORDER
                    ================================================= */}

                    <Box
                        sx={{
                            position: "absolute",
                            inset: {
                                xs: 15,
                                sm: 21,
                                md: 26,
                            },
                            border:
                                "1px solid #d8c36a",
                            pointerEvents:
                                "none",
                            zIndex: 5,
                        }}
                    />

                    {/* =================================================
                        TOP GOLD LINE
                    ================================================= */}

                    <Box
                        sx={{
                            position: "absolute",
                            top: {
                                xs: 16,
                                sm: 22,
                                md: 27,
                            },
                            left: "50%",
                            transform:
                                "translateX(-50%)",
                            width: {
                                xs: 90,
                                sm: 130,
                                md: 170,
                            },
                            height: 4,
                            backgroundColor:
                                "#c9a227",
                            zIndex: 6,
                        }}
                    />

                    {/* =================================================
                        MAIN CONTENT
                    ================================================= */}

                    <Box
                        className="certificate-content"
                        sx={{
                            position: "relative",
                            zIndex: 2,

                            width: "100%",
                            height: "100%",

                            minHeight: 0,

                            display: "flex",
                            flexDirection:
                                "column",
                            alignItems: "center",
                            justifyContent:
                                "space-between",

                            textAlign: "center",

                            px: {
                                xs: 4,
                                sm: 7,
                                md: 10,
                            },

                            py: {
                                xs: 3,
                                sm: 4,
                                md: 5,
                            },

                            boxSizing:
                                "border-box",
                        }}
                    >
                        {/* =================================================
                            LOGO
                        ================================================= */}

                        <Box>
                            <Box
                                component="img"
                                src={LearnHubLogo}
                                alt="LearnHub"
                                sx={{
                                    width: {
                                        xs: 100,
                                        sm: 130,
                                        md: 155,
                                    },

                                    maxHeight: 65,

                                    objectFit:
                                        "contain",
                                }}
                            />

                            <Typography
                                sx={{
                                    fontSize: {
                                        xs: "0.6rem",
                                        sm: "0.7rem",
                                        md: "0.75rem",
                                    },

                                    letterSpacing: 3,

                                    color: "#777",

                                    fontWeight: 600,
                                }}
                            >
                                LEARNING MANAGEMENT
                                SYSTEM
                            </Typography>
                        </Box>

                        {/* =================================================
                            TITLE
                        ================================================= */}

                        <Box>
                            <Typography
                                sx={{
                                    fontFamily:
                                        "Georgia, serif",

                                    fontSize: {
                                        xs: "1.7rem",
                                        sm: "2.2rem",
                                        md: "2.8rem",
                                    },

                                    fontWeight: 700,

                                    letterSpacing: {
                                        xs: 2,
                                        sm: 4,
                                    },

                                    color: "#222",

                                    lineHeight: 1.1,
                                }}
                            >
                                CERTIFICATE
                            </Typography>

                            <Typography
                                sx={{
                                    fontFamily:
                                        "Georgia, serif",

                                    fontSize: {
                                        xs: "0.8rem",
                                        sm: "1rem",
                                        md: "1.1rem",
                                    },

                                    letterSpacing: 3,

                                    color: "#c9a227",

                                    fontWeight: 600,

                                    mt: 0.3,
                                }}
                            >
                                OF COMPLETION
                            </Typography>
                        </Box>

                        {/* =================================================
                            STUDENT
                        ================================================= */}

                        <Box
                            sx={{
                                width: "100%",
                            }}
                        >
                            <Typography
                                sx={{
                                    fontSize: {
                                        xs: "0.75rem",
                                        sm: "0.85rem",
                                        md: "0.95rem",
                                    },

                                    color: "#666",

                                    fontStyle: "italic",
                                }}
                            >
                                This certificate is
                                proudly presented to
                            </Typography>

                            <Typography
                                sx={{
                                    mt: 0.8,

                                    fontFamily:
                                        "Georgia, serif",

                                    fontSize: {
                                        xs: "1.6rem",
                                        sm: "2rem",
                                        md: "2.5rem",
                                    },

                                    fontWeight: 700,

                                    color: "#222",

                                    borderBottom:
                                        "2px solid #c9a227",

                                    display:
                                        "inline-block",

                                    px: 2,

                                    pb: 0.3,

                                    lineHeight: 1.2,
                                }}
                            >
                                {studentName}
                            </Typography>
                        </Box>

                        {/* =================================================
                            COURSE
                        ================================================= */}

                        <Box
                            sx={{
                                width: "100%",
                            }}
                        >
                            <Typography
                                sx={{
                                    fontSize: {
                                        xs: "0.75rem",
                                        sm: "0.85rem",
                                        md: "0.95rem",
                                    },

                                    color: "#666",
                                }}
                            >
                                for successfully
                                completing
                            </Typography>

                            <Typography
                                sx={{
                                    mt: 0.5,

                                    fontFamily:
                                        "Georgia, serif",

                                    fontSize: {
                                        xs: "1.1rem",
                                        sm: "1.4rem",
                                        md: "1.7rem",
                                    },

                                    fontWeight: 700,

                                    color: "#333",

                                    lineHeight: 1.2,
                                }}
                            >
                                {courseName}
                            </Typography>

                            <Typography
                                sx={{
                                    mt: 0.4,

                                    fontSize: {
                                        xs: "0.7rem",
                                        sm: "0.8rem",
                                        md: "0.9rem",
                                    },

                                    color: "#777",
                                }}
                            >
                                and successfully
                                passing the assessment
                            </Typography>

                            <Typography
                                sx={{
                                    mt: 0.3,

                                    fontSize: {
                                        xs: "0.75rem",
                                        sm: "0.85rem",
                                        md: "0.95rem",
                                    },

                                    fontWeight: 600,

                                    color: "#555",
                                }}
                            >
                                {examName}
                            </Typography>
                        </Box>

                        {/* =================================================
                            SCORE + STATUS
                        ================================================= */}

                        <Box
                            sx={{
                                display: "flex",

                                justifyContent:
                                    "center",

                                alignItems:
                                    "center",

                                gap: {
                                    xs: 4,
                                    sm: 7,
                                    md: 10,
                                },

                                flexWrap: "wrap",
                            }}
                        >
                            <Box>
                                <Typography
                                    sx={{
                                        fontSize:
                                            "0.65rem",

                                        color: "#777",

                                        letterSpacing: 1,
                                    }}
                                >
                                    SCORE
                                </Typography>

                                <Typography
                                    sx={{
                                        fontSize: {
                                            xs: "1.2rem",
                                            sm: "1.5rem",
                                            md: "1.7rem",
                                        },

                                        fontWeight: 700,

                                        color: "#222",
                                    }}
                                >
                                    {percentage}%
                                </Typography>
                            </Box>

                            <Box>
                                <Typography
                                    sx={{
                                        fontSize:
                                            "0.65rem",

                                        color: "#777",

                                        letterSpacing: 1,
                                    }}
                                >
                                    STATUS
                                </Typography>

                                <Typography
                                    sx={{
                                        fontSize: {
                                            xs: "1.2rem",
                                            sm: "1.5rem",
                                            md: "1.7rem",
                                        },

                                        fontWeight: 700,

                                        color: "#2e7d32",
                                    }}
                                >
                                    PASSED
                                </Typography>
                            </Box>
                        </Box>

                        {/* =================================================
                            SIGNATURES
                        ================================================= */}

                        <Box
                            sx={{
                                width: "100%",

                                display: "flex",

                                justifyContent:
                                    "space-between",

                                alignItems:
                                    "flex-end",

                                gap: 4,

                                px: {
                                    xs: 1,
                                    sm: 5,
                                    md: 10,
                                },
                            }}
                        >
                            {/* INSTRUCTOR */}

                            <Box
                                sx={{
                                    minWidth: {
                                        xs: 110,
                                        sm: 180,
                                        md: 210,
                                    },
                                }}
                            >
                                <Box
                                    sx={{
                                        borderBottom:
                                            "1px solid #555",

                                        mb: 0.5,
                                    }}
                                />

                                <Typography
                                    sx={{
                                        fontSize: {
                                            xs: "0.65rem",
                                            sm: "0.75rem",
                                        },

                                        fontWeight: 600,
                                    }}
                                >
                                    {teacherName}
                                </Typography>

                                <Typography
                                    sx={{
                                        fontSize:
                                            "0.65rem",

                                        color: "#777",
                                    }}
                                >
                                    Instructor
                                </Typography>
                            </Box>

                            {/* DATE */}

                            <Box
                                sx={{
                                    minWidth: {
                                        xs: 110,
                                        sm: 180,
                                        md: 210,
                                    },
                                }}
                            >
                                <Box
                                    sx={{
                                        borderBottom:
                                            "1px solid #555",

                                        mb: 0.5,
                                    }}
                                />

                                <Typography
                                    sx={{
                                        fontSize: {
                                            xs: "0.65rem",
                                            sm: "0.75rem",
                                        },

                                        fontWeight: 600,
                                    }}
                                >
                                    {formattedDate}
                                </Typography>

                                <Typography
                                    sx={{
                                        fontSize:
                                            "0.65rem",

                                        color: "#777",
                                    }}
                                >
                                    Date of Issue
                                </Typography>
                            </Box>
                        </Box>

                        {/* =================================================
                            CERTIFICATE ID
                        ================================================= */}

                        <Box>
                            <Typography
                                sx={{
                                    fontSize: {
                                        xs: "0.55rem",
                                        sm: "0.65rem",
                                    },

                                    color: "#888",

                                    letterSpacing: 1,
                                }}
                            >
                                CERTIFICATE ID
                            </Typography>

                            <Typography
                                sx={{
                                    fontSize: {
                                        xs: "0.6rem",
                                        sm: "0.7rem",
                                    },

                                    fontWeight: 700,

                                    letterSpacing: 1,

                                    color: "#444",
                                }}
                            >
                                {certificateNumber}
                            </Typography>
                        </Box>
                    </Box>
                </Paper>
            </Container>
        </>
    );
};

export default CertificateDetails;
