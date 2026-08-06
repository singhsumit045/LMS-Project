import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';


interface UploadedFile {
  buffer: Buffer;
  originalname: string;
  mimetype: string;
  size: number;
}


@Injectable()
export class CloudinaryService {

  constructor() {

    cloudinary.config({

      cloud_name:
        process.env.CLOUDINARY_CLOUD_NAME,

      api_key:
        process.env.CLOUDINARY_API_KEY,

      api_secret:
        process.env.CLOUDINARY_API_SECRET,

    });

  }



  // =====================================================
  // UPLOAD IMAGE (PROFILE)
  // =====================================================

  async uploadImage(
    file: UploadedFile,
  ): Promise<any> {


    return new Promise(
      (resolve, reject) => {


        const uploadStream =
          cloudinary.uploader.upload_stream(

            {
              folder:
                'learnhub/profiles',

              resource_type:
                'image',
            },


            (error, result) => {


              if (error) {

                reject(error);

              } else {

                resolve(result);

              }

            }

          );


        uploadStream.end(file.buffer);


      }
    );

  }




  // =====================================================
  // UPLOAD TEACHER SIGNATURE
  // =====================================================

  async uploadSignature(
    file: UploadedFile,
  ): Promise<any> {


    return new Promise(
      (resolve, reject) => {


        const uploadStream =
          cloudinary.uploader.upload_stream(

            {

              folder:
                'learnhub/signatures',

              resource_type:
                'image',

              // signature image optimization
              transformation: [
                {
                  width: 500,
                  height: 200,
                  crop: 'limit',
                }
              ]

            },


            (error, result) => {


              if (error) {

                reject(error);

              } else {

                resolve(result);

              }


            }

          );


        uploadStream.end(file.buffer);


      }
    );

  }





  // =====================================================
  // UPLOAD VIDEO
  // =====================================================

  async uploadVideo(
    file: UploadedFile,
  ): Promise<any> {


    return new Promise(
      (resolve, reject) => {


        const uploadStream =
          cloudinary.uploader.upload_stream(

            {

              folder:
                'learnhub/videos',

              resource_type:
                'video',

            },


            (error, result) => {


              if (error) {

                reject(error);

              } else {

                resolve(result);

              }

            }


          );


        uploadStream.end(file.buffer);


      }
    );

  }





  // =====================================================
  // UPLOAD PDF NOTE
  // =====================================================

  async uploadNote(
    file: UploadedFile,
  ): Promise<any> {


    return new Promise(
      (resolve, reject) => {


        const uploadStream =
          cloudinary.uploader.upload_stream(

            {

              folder:
                'learnhub/notes',

              resource_type:
                'raw',

              use_filename:
                true,

              unique_filename:
                true,

            },


            (error, result) => {


              if (error) {

                reject(error);

              } else {

                resolve(result);

              }


            }


          );


        uploadStream.end(file.buffer);


      }
    );

  }





  // =====================================================
  // DELETE FILE FROM CLOUDINARY
  // =====================================================

  async deleteFile(

    publicId: string,

    resourceType:
      | 'image'
      | 'video'
      | 'raw' = 'image',

  ): Promise<any> {


    return new Promise(

      (resolve, reject) => {


        cloudinary.uploader.destroy(

          publicId,

          {

            resource_type:
              resourceType,

          },


          (error, result) => {


            if (error) {

              reject(error);

            } else {

              resolve(result);

            }


          }


        );


      }

    );


  }


}