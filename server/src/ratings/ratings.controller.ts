import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import type { Request } from 'express';

import { RatingsService } from './ratings.service';

import { CreateRatingDto } from './dto/create-rating.dto';
import { UpdateRatingDto } from './dto/update-rating.dto';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('ratings')
export class RatingsController {
  constructor(
    private readonly ratingsService: RatingsService,
  ) {}

  // =====================================================
  // CREATE / UPDATE RATING
  // =====================================================

  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Body() createRatingDto: CreateRatingDto,
    @Req() req: Request,
  ) {
    const studentId = (req.user as any).id;

    return this.ratingsService.create(
      createRatingDto,
      studentId,
    );
  }

  // =====================================================
  // GET ALL RATINGS
  // =====================================================

  @Get()
  findAll() {
    return this.ratingsService.findAll();
  }

  // =====================================================
  // GET COURSE RATINGS
  // =====================================================

  @Get('course/:courseId')
  getCourseRatings(
    @Param('courseId', ParseIntPipe)
    courseId: number,
  ) {
    return this.ratingsService.getCourseRatings(
      courseId,
    );
  }

  // =====================================================
  // GET COURSE AVERAGE RATING
  // =====================================================

  @Get('course/:courseId/average')
  getAverageRating(
    @Param('courseId', ParseIntPipe)
    courseId: number,
  ) {
    return this.ratingsService.getAverageRating(
      courseId,
    );
  }

  // =====================================================
  // GET RATING BY ID
  // =====================================================

  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe)
    id: number,
  ) {
    return this.ratingsService.findOne(id);
  }

  // =====================================================
  // UPDATE RATING
  // =====================================================

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe)
    id: number,

    @Body()
    updateRatingDto: UpdateRatingDto,
  ) {
    return this.ratingsService.update(
      id,
      updateRatingDto,
    );
  }

  // =====================================================
  // DELETE RATING
  // =====================================================

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe)
    id: number,
  ) {
    return this.ratingsService.remove(id);
  }
}