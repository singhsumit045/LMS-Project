import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Certificate } from './entities/certificate.entity';

import { ExamAttempt } from '../exams/entities/exam-attempt.entity/exam-attempt.entity';

import { Exam } from '../exams/entities/exam.entity';


@Injectable()
export class CertificateService {

  constructor(

    @InjectRepository(Certificate)
    private readonly certificateRepository:
      Repository<Certificate>,


    @InjectRepository(ExamAttempt)
    private readonly examAttemptRepository:
      Repository<ExamAttempt>,


    @InjectRepository(Exam)
    private readonly examRepository:
      Repository<Exam>,

  ) {}



  // =====================================================
  // GENERATE CERTIFICATE NUMBER
  // =====================================================

  private generateCertificateNumber(): string {

    const timestamp = Date.now();


    const random =
      Math.floor(
        1000 + Math.random() * 9000
      );


    return `LH-${timestamp}-${random}`;

  }




  // =====================================================
  // GET COMPLETE CERTIFICATE
  // =====================================================

  private async getCompleteCertificate(
    certificateId:number,
  ):Promise<any>{


    const certificate =
      await this.certificateRepository.findOne({

        where:{
          id:certificateId,
        },


        relations:{

          student:true,

          exam:true,

          attempt:true,


          course:{
            teacher:true,
          },

        },

      });



    if(!certificate){

      throw new NotFoundException(
        "Certificate not found."
      );

    }



    return {


      ...certificate,


      teacherName:
        certificate.course?.teacher?.name || null,


      teacherSignature:
        certificate.course?.teacher?.signatureUrl || null,


      teacherSignaturePublicId:
        certificate.course?.teacher?.signaturePublicId || null,


    };


  }






  // =====================================================
  // GET OR CREATE CERTIFICATE
  // =====================================================

  async getOrCreateCertificate(

    studentId:number,

    courseId:number,

  ):Promise<any>{



    const existingCertificate =
      await this.certificateRepository.findOne({

        where:{
          studentId,
          courseId,
        },


        relations:{

          student:true,

          exam:true,

          attempt:true,


          course:{
            teacher:true,
          },


        },

      });



    if(existingCertificate){

      return {

        ...existingCertificate,


        teacherName:
          existingCertificate.course?.teacher?.name,


        teacherSignature:
          existingCertificate.course?.teacher?.signatureUrl,

      };

    }




    const exams =
      await this.examRepository.find({

        where:{
          courseId,
        },

      });



    if(exams.length===0){

      throw new NotFoundException(
        "No exam found for this course."
      );

    }



    const examIds =
      exams.map(
        exam=>exam.id
      );




    const passedAttempt =

      await this.examAttemptRepository

      .createQueryBuilder("attempt")


      .leftJoinAndSelect(
        "attempt.exam",
        "exam"
      )


      .leftJoinAndSelect(
        "attempt.student",
        "student"
      )


      .where(
        "attempt.studentId=:studentId",
        {
          studentId,
        }
      )


      .andWhere(
        "attempt.submitted=:submitted",
        {
          submitted:true,
        }
      )


      .andWhere(
        "attempt.passed=:passed",
        {
          passed:true,
        }
      )


      .andWhere(
        "attempt.examId IN (:...examIds)",
        {
          examIds,
        }
      )


      .orderBy(
        "attempt.createdAt",
        "ASC"
      )


      .getOne();





    if(!passedAttempt){

      throw new BadRequestException(
        "Certificate is available only after passing the exam."
      );

    }





    const certificate =
      this.certificateRepository.create({

        certificateNumber:
          this.generateCertificateNumber(),


        studentId,


        examId:
          passedAttempt.examId,


        attemptId:
          passedAttempt.id,


        courseId,


        score:Number(
          passedAttempt.score || 0
        ),


        percentage:Number(
          passedAttempt.percentage || 0
        ),


      });




    const savedCertificate =
      await this.certificateRepository.save(
        certificate
      );



    return this.getCompleteCertificate(
      savedCertificate.id
    );

  }






  // =====================================================
  // GENERATE CERTIFICATE FOR ATTEMPT
  // =====================================================

  async generateCertificateForAttempt(

    attemptId:number,

    studentId:number,

  ):Promise<any>{



    const attempt =
      await this.examAttemptRepository.findOne({

        where:{
          id:attemptId,
        },


        relations:{

          exam:true,

          student:true,

        },

      });




    if(!attempt){

      throw new NotFoundException(
        "Exam attempt not found."
      );

    }




    if(
      Number(attempt.studentId)
      !== Number(studentId)
    ){

      throw new BadRequestException(
        "You are not allowed."
      );

    }





    if(!attempt.submitted){

      throw new BadRequestException(
        "Exam not submitted."
      );

    }





    if(!attempt.passed){

      throw new BadRequestException(
        "Certificate available after passing exam."
      );

    }





    const certificate =
      this.certificateRepository.create({

        certificateNumber:
          this.generateCertificateNumber(),


        studentId,


        examId:
          attempt.examId,


        attemptId:
          attempt.id,


        courseId:
          attempt.exam.courseId,


        score:Number(
          attempt.score || 0
        ),


        percentage:Number(
          attempt.percentage || 0
        ),

      });




    const saved =
      await this.certificateRepository.save(
        certificate
      );



    return this.getCompleteCertificate(
      saved.id
    );


  }







  // =====================================================
  // GET CERTIFICATE BY ATTEMPT
  // =====================================================

  async getCertificateByAttempt(

    attemptId:number,

    studentId:number,

  ):Promise<any>{



    const certificate =
      await this.certificateRepository.findOne({

        where:{
          attemptId,
          studentId,
        },


        relations:{

          student:true,

          exam:true,

          attempt:true,


          course:{
            teacher:true,
          },


        },


      });



    if(certificate){

      return {

        ...certificate,

        teacherName:
          certificate.course?.teacher?.name,

        teacherSignature:
          certificate.course?.teacher?.signatureUrl,

      };

    }





    return this.generateCertificateForAttempt(
      attemptId,
      studentId
    );


  }






  // =====================================================
  // GET CERTIFICATE BY ID
  // =====================================================

  async getCertificateById(

    certificateId:number,

    studentId:number,

  ):Promise<any>{



    const certificate =
      await this.certificateRepository.findOne({

        where:{
          id:certificateId,
          studentId,
        },


        relations:{

          student:true,

          exam:true,

          attempt:true,


          course:{
            teacher:true,
          },


        },


      });




    if(!certificate){

      throw new NotFoundException(
        "Certificate not found."
      );

    }



    return {

      ...certificate,


      teacherName:
        certificate.course?.teacher?.name,


      teacherSignature:
        certificate.course?.teacher?.signatureUrl,


    };


  }






  // =====================================================
  // GET CERTIFICATE BY COURSE
  // =====================================================

  async getCertificateByCourse(

    courseId:number,

    studentId:number,

  ):Promise<any>{


    return this.getOrCreateCertificate(
      studentId,
      courseId
    );

  }

  // =====================================================
  // GET ALL STUDENT CERTIFICATES
  // =====================================================

  async getMyCertificates(

    studentId:number,

  ):Promise<any[]>{



    const certificates =
      await this.certificateRepository.find({

        where:{
          studentId,
        },


        relations:{

          student:true,

          exam:true,

          attempt:true,


          course:{
            teacher:true,
          },

        },

        order:{
          issuedAt:"DESC",
        },

      });


    return certificates.map(
      certificate=>({

        ...certificate,


        teacherName:
          certificate.course?.teacher?.name,

        teacherSignature:
          certificate.course?.teacher?.signatureUrl,

      })
    );

  }

}