
import {
  Controller,
  Get,
  Patch,
  Param,
  Body,
  Delete,
  Post,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Req,
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';

import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';

import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  // =====================================================
  // GET ALL USERS
  // =====================================================

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  // =====================================================
  // GET USER BY ID
  // =====================================================

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  // =====================================================
  // UPDATE USER PROFILE
  // =====================================================

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(
      +id,
      updateUserDto,
    );
  }

  // =====================================================
  // DELETE USER
  // =====================================================

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }

  // =====================================================
  // UPLOAD / UPDATE PROFILE PICTURE
  // =====================================================

  @Post('profile-picture')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('file'),
  )
  async uploadProfilePicture(
    @UploadedFile()
    file: Express.Multer.File,

    @Req() req: any,
  ) {
    // -----------------------------------------------------
    // CHECK FILE
    // -----------------------------------------------------

    if (!file) {
      return {
        message: 'Profile picture is required',
      };
    }

    // -----------------------------------------------------
    // UPLOAD NEW IMAGE TO CLOUDINARY
    // -----------------------------------------------------

    const result =
      await this.cloudinaryService.uploadImage(
        file,
      );

    // -----------------------------------------------------
    // SAVE NEW IMAGE
    // AND DELETE OLD IMAGE
    // -----------------------------------------------------

    const updatedUser =
      await this.usersService.updateProfileImage(
        req.user.id,
        result.secure_url as string,
        result.public_id as string,
      );

    // -----------------------------------------------------
    // RESPONSE
    // -----------------------------------------------------

    return {
      message:
        'Profile picture updated successfully',

      profileImageUrl:
        updatedUser?.profileImageUrl,

      profileImagePublicId:
        updatedUser?.profileImagePublicId,
    };
  }
}

