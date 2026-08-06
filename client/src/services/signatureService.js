import api from "./api";


// Upload Teacher Signature
export const uploadSignature = async (file) => {

  const formData = new FormData();

  formData.append(
    "signature",
    file
  );

  const response =
    await api.post(
      "/users/upload-signature",
      formData,
      {
        headers: {
          "Content-Type":
            "multipart/form-data",
        },
      }
    );


  return response.data;

};