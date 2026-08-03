import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';

import { NotesService } from './notes.service';

@Controller('notes')
export class NotesController {
  constructor(
    private readonly notesService: NotesService,
  ) {}

  // =====================================================
  // UPLOAD PDF NOTE
  // =====================================================

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file'),
  )
  async uploadNote(
    @UploadedFile()
    file: Express.Multer.File,

    @Body('title')
    title: string,

    @Body('content')
    content: string,

    @Body(
      'courseId',
      ParseIntPipe,
    )
    courseId: number,
  ) {
    if (!file) {
      throw new BadRequestException(
        'PDF file is required.',
      );
    }

    return this.notesService.createNote(
      file,
      title,
      content,
      courseId,
    );
  }

  // =====================================================
  // GET NOTES BY COURSE
  // =====================================================

  @Get('course/:courseId')
  async getNotesByCourse(
    @Param(
      'courseId',
      ParseIntPipe,
    )
    courseId: number,
  ) {
    return this.notesService.getNotesByCourse(
      courseId,
    );
  }

  // =====================================================
  // GET NOTE BY ID
  // =====================================================

  @Get(':id')
  async getNoteById(
    @Param(
      'id',
      ParseIntPipe,
    )
    id: number,
  ) {
    return this.notesService.getNoteById(id);
  }

  // =====================================================
  // UPDATE NOTE
  // =====================================================

  @Patch(':id')
  async updateNote(
    @Param(
      'id',
      ParseIntPipe,
    )
    id: number,

    @Body('title')
    title: string,

    @Body('content')
    content: string,
  ) {
    return this.notesService.updateNote(
      id,
      title,
      content,
    );
  }

  // =====================================================
  // DELETE NOTE
  // =====================================================

  @Delete(':id')
  async deleteNote(
    @Param(
      'id',
      ParseIntPipe,
    )
    id: number,
  ) {
    return this.notesService.deleteNote(id);
  }
}

export default NotesController;