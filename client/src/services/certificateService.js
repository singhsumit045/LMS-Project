
import api from "./api";

// =====================================================
// GENERATE CERTIFICATE
// =====================================================

export const generateCertificate = async (attemptId) => {
    const response = await api.post(
        `/certificates/attempt/${attemptId}`
    );

    return response.data;
};

// =====================================================
// GET MY CERTIFICATES
// =====================================================

export const getMyCertificates = async () => {
    const response = await api.get(
        "/certificates/my"
    );

    return response.data;
};

// =====================================================
// GET CERTIFICATE BY COURSE
//
// IMPORTANT:
// Existing students ke liye bhi kaam karega.
// Backend passed attempt find karke certificate
// create karega agar pehle certificate nahi bana.
// =====================================================

export const getCertificateByCourse = async (
    courseId
) => {
    const response = await api.get(
        `/certificates/course/${courseId}`
    );

    return response.data;
};

// =====================================================
// GET CERTIFICATE BY ATTEMPT
// =====================================================

export const getCertificateByAttempt = async (
    attemptId
) => {
    const response = await api.get(
        `/certificates/attempt/${attemptId}`
    );

    return response.data;
};

// =====================================================
// GET CERTIFICATE BY ID
// =====================================================

export const getCertificateById = async (
    certificateId
) => {
    const response = await api.get(
        `/certificates/${certificateId}`
    );

    return response.data;
};

