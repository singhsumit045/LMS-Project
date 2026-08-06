import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Rating } from './entities/rating.entity';
import { Course } from '../courses/entities/course.entity';
import { Enrollment } from '../enrollments/entities/enrollment.entity';

import { CreateRatingDto } from './dto/create-rating.dto';
import { UpdateRatingDto } from './dto/update-rating.dto';

@Injectable()
export class RatingsService {
  constructor(
    @InjectRepository(Rating)
    private readonly ratingsRepository: Repository<Rating>,

    @InjectRepository(Course)
    private readonly coursesRepository: Repository<Course>,

    @InjectRepository(Enrollment)
    private readonly enrollmentsRepository: Repository<Enrollment>,
  ) {}

 async create(
  createRatingDto: CreateRatingDto,
  studentId: number,
): Promise<Rating> {
  const { courseId, rating, review } = createRatingDto;

  // Check course exists
  const course = await this.coursesRepository.findOne({
    where: { id: courseId },
  });

  if (!course) {
    throw new BadRequestException(
      'Course not found',
    );
  }

  // Check enrollment
  const enrollment =
    await this.enrollmentsRepository.findOne({
      where: {
        user: {
          id: studentId,
        },
        course: {
          id: courseId,
        },
      },
      relations: {
        user: true,
        course: true,
      },
    });

  if (!enrollment) {
    throw new BadRequestException(
      'You are not enrolled in this course',
    );
  }

  // Check existing rating
  const existingRating =
    await this.ratingsRepository.findOne({
      where: {
        studentId,
        courseId,
      },
    });

  if (existingRating) {
    existingRating.rating = rating;
    existingRating.review = review ?? null;

    return await this.ratingsRepository.save(
      existingRating,
    );
  }

  // Create new rating
  const newRating =
    this.ratingsRepository.create({
      rating,
      review: review ?? null,
      studentId,
      courseId,
    });

  return await this.ratingsRepository.save(
    newRating,
  );
}

 async findAll(): Promise<Rating[]> {
  return await this.ratingsRepository.find({
    relations: {
      student: true,
      course: true,
    },
    order: {
      createdAt: 'DESC',
    },
  });
}

async findOne(
  id: number,
): Promise<Rating> {
  const rating =
    await this.ratingsRepository.findOne({
      where: { id },
      relations: {
        student: true,
        course: true,
      },
    });

  if (!rating) {
    throw new NotFoundException(
      `Rating with ID ${id} not found`,
    );
  }

  return rating;
}

async update(
  id: number,
  updateRatingDto: UpdateRatingDto,
): Promise<Rating> {
  const rating =
    await this.findOne(id);

  Object.assign(
    rating,
    updateRatingDto,
  );

  return await this.ratingsRepository.save(
    rating,
  );
}
async remove(
  id: number,
): Promise<{ message: string }> {
  const rating =
    await this.findOne(id);

  await this.ratingsRepository.remove(
    rating,
  );

  return {
    message:
      'Rating deleted successfully',
  };
}


async getCourseRatings(
  courseId: number,
): Promise<Rating[]> {
  return await this.ratingsRepository.find({
    where: {
      courseId,
    },
    relations: {
      student: true,
    },
    order: {
      createdAt: 'DESC',
    },
  });
}

async getAverageRating(
  courseId: number,
): Promise<{
  averageRating: number;
  totalRatings: number;
}> {
  const ratings =
    await this.ratingsRepository.find({
      where: {
        courseId,
      },
    });

  const totalRatings =
    ratings.length;

  if (totalRatings === 0) {
    return {
      averageRating: 0,
      totalRatings: 0,
    };
  }

  const total =
    ratings.reduce(
      (sum, rating) =>
        sum + Number(rating.rating),
      0,
    );

  return {
    averageRating: Number(
      (total / totalRatings).toFixed(1),
    ),
    totalRatings,
  };
}
}