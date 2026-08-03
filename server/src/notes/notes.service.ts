import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Note } from './entities/note.entity';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Injectable()
export class NotesService {
  constructor(
    @InjectRepository(Note)
    private readonly noteRepository: Repository<Note>,

    private readonly cloudinaryService: CloudinaryService,
  ) {}

  // =====================================================
  // CREATE / UPLOAD NOTE
  // =====================================================

  async createNote(
    file: any,
    title: string,
    content: string,
    courseId: number,
  ) {
    if (!file) {
      throw new BadRequestException(
        'PDF file is required.',
      );
    }

    if (!title?.trim()) {
      throw new BadRequestException(
        'Note title is required.',
      );
    }

    if (!courseId) {
      throw new BadRequestException(
        'Course ID is required.',
      );
    }

    // Only PDF allowed
    if (file.mimetype !== 'application/pdf') {
      throw new BadRequestException(
        'Only PDF files are allowed.',
      );
    }

    // Upload PDF to Cloudinary
    const result =
      await this.cloudinaryService.uploadNote(file);

    const note = this.noteRepository.create({
      title: title.trim(),
      content: content?.trim() || '',
      noteUrl: result.secure_url,
      publicId: result.public_id,
      courseId,
    });

    return await this.noteRepository.save(note);
  }

  // =====================================================
  // GET NOTES BY COURSE
  // =====================================================

  async getNotesByCourse(courseId: number) {
    return await this.noteRepository.find({
      where: {
        courseId,
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  // =====================================================
  // GET NOTE BY ID
  // =====================================================

  async getNoteById(id: number) {
    const note = await this.noteRepository.findOne({
      where: {
        id,
      },
    });

    if (!note) {
      throw new NotFoundException(
        'Note not found.',
      );
    }

    return note;
  }

  // =====================================================
  // UPDATE NOTE
  // =====================================================

  async updateNote(
    id: number,
    title: string,
    content: string,
  ) {
    const note = await this.getNoteById(id);

    note.title = title?.trim() || note.title;
    note.content =
      content?.trim() ?? note.content;

    return await this.noteRepository.save(note);
  }

  // =====================================================
  // DELETE NOTE
  // =====================================================

  async deleteNote(id: number) {
    const note = await this.getNoteById(id);

    // Delete PDF from Cloudinary
    if (note.publicId) {
      await this.cloudinaryService.deleteFile(
        note.publicId,
        'raw',
      );
    }

    // Delete record from MySQL
    await this.noteRepository.delete(id);

    return {
      message:
        'Note deleted successfully.',
    };
  }
}