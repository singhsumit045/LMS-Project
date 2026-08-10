import {
Injectable,
ConflictException,
UnauthorizedException,
BadRequestException,
} from '@nestjs/common';

import { UsersService } from '../users/users.service';

import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

import { UpdateUserDto } from '../users/dto/update-user.dto';

import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

import { MailService } from '../mail/mail.service';

@Injectable()
export class AuthService {
constructor(
private readonly usersService: UsersService,
private readonly jwtService: JwtService,
private readonly configService: ConfigService,
private readonly mailService: MailService,
) {}

// =====================================================
// REGISTER
// =====================================================

async register(registerDto: RegisterDto) {
const normalizedEmail =
registerDto.email.trim().toLowerCase();


const existingUser =
  await this.usersService.findByEmail(
    normalizedEmail,
  );

if (existingUser) {
  throw new ConflictException(
    'Email already registered',
  );
}

// Generate 6 digit OTP
const otp = crypto
  .randomInt(100000, 1000000)
  .toString();

// OTP valid for 10 minutes
const otpExpiry = new Date(
  Date.now() + 10 * 60 * 1000,
);

// Hash password
const hashedPassword =
  await bcrypt.hash(
    registerDto.password,
    10,
  );

// Create user
const user =
  await this.usersService.save({
    name: registerDto.name,
    email: normalizedEmail,
    password: hashedPassword,
    role: registerDto.role || 'student',

    emailVerificationOtp: otp,
    emailVerificationOtpExpires:
      otpExpiry,

    isEmailVerified: false,
  });

// Send verification OTP
await this.mailService.sendEmailVerificationOtp(
  user.email,
  otp,
);

return {
  message:
    'Registration successful. Please check your email for the verification OTP.',
};


}

// =====================================================
// LOGIN
// =====================================================

async login(loginDto: LoginDto) {
const normalizedEmail =
loginDto.email.trim().toLowerCase();


const user =
  await this.usersService.findByEmail(
    normalizedEmail,
  );

if (!user) {
  throw new UnauthorizedException(
    'Invalid email or password',
  );
}

const isPasswordMatch =
  await bcrypt.compare(
    loginDto.password,
    user.password,
  );

if (!isPasswordMatch) {
  throw new UnauthorizedException(
    'Invalid email or password',
  );
}

// Email verification check
if (!user.isEmailVerified) {
  throw new UnauthorizedException(
    'Please verify your email before logging in.',
  );
}

const payload = {
  sub: user.id,
  email: user.email,
  role: user.role,
  name: user.name,
};

// Access Token
const accessToken =
  this.jwtService.sign(payload);

// Refresh Token
const refreshToken =
  this.jwtService.sign(
    payload,
    {
      secret:
        this.configService.get<string>(
          'JWT_REFRESH_SECRET',
        ) || 'lms-refresh-secret',

      expiresIn: '7d',
    },
  );

const hashedRefreshToken =
  await bcrypt.hash(
    refreshToken,
    10,
  );

await this.usersService.updateRefreshToken(
  user.id,
  hashedRefreshToken,
);

return {
  access_token: accessToken,
  refresh_token: refreshToken,

  user: {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  },
};


}

// =====================================================
// VERIFY EMAIL OTP
// =====================================================

async verifyEmail(
email: string,
otp: string,
): Promise<{ message: string }> {
const normalizedEmail =
email.trim().toLowerCase();


const user =
  await this.usersService.findByEmail(
    normalizedEmail,
  );

if (!user) {
  throw new BadRequestException(
    'User not found.',
  );
}

if (user.isEmailVerified) {
  throw new BadRequestException(
    'Email is already verified.',
  );
}

if (
  !user.emailVerificationOtp ||
  !user.emailVerificationOtpExpires
) {
  throw new BadRequestException(
    'Verification OTP not found. Please request a new OTP.',
  );
}

if (
  user.emailVerificationOtpExpires <
  new Date()
) {
  user.emailVerificationOtp = null;
  user.emailVerificationOtpExpires = null;

  await this.usersService.save(user);

  throw new BadRequestException(
    'OTP has expired. Please request a new OTP.',
  );
}

if (
  user.emailVerificationOtp !==
  otp.trim()
) {
  throw new BadRequestException(
    'Invalid verification OTP.',
  );
}

user.isEmailVerified = true;

user.emailVerificationOtp = null;
user.emailVerificationOtpExpires = null;

await this.usersService.save(user);

return {
  message:
    'Email verified successfully. You can now login.',
};


}

// =====================================================
// UPDATE PROFILE
// =====================================================

async updateProfile(
userId: number,
updateUserDto: UpdateUserDto,
) {
const user =
await this.usersService.findOne(
userId,
);


if (!user) {
  throw new UnauthorizedException(
    'User not found',
  );
}

const updatedUser =
  await this.usersService.update(
    userId,
    {
      name: updateUserDto.name,
    },
  );

if (!updatedUser) {
  throw new UnauthorizedException(
    'Unable to update profile',
  );
}

return {
  message:
    'Profile updated successfully',

  user: {
    id: updatedUser.id,
    name: updatedUser.name,
    email: updatedUser.email,
    role: updatedUser.role,
  },
};


}

// =====================================================
// CHANGE PASSWORD
// =====================================================

async changePassword(
userId: number,
changePasswordDto: ChangePasswordDto,
) {
const user =
await this.usersService.findOne(
userId,
);


if (!user) {
  throw new UnauthorizedException(
    'User not found',
  );
}

const isCurrentPasswordValid =
  await bcrypt.compare(
    changePasswordDto.currentPassword,
    user.password,
  );

if (!isCurrentPasswordValid) {
  throw new UnauthorizedException(
    'Current password is incorrect',
  );
}

const isSamePassword =
  await bcrypt.compare(
    changePasswordDto.newPassword,
    user.password,
  );

if (isSamePassword) {
  throw new UnauthorizedException(
    'New password must be different from current password',
  );
}

const hashedNewPassword =
  await bcrypt.hash(
    changePasswordDto.newPassword,
    10,
  );

await this.usersService.updatePassword(
  userId,
  hashedNewPassword,
);

await this.usersService.removeRefreshToken(
  userId,
);

return {
  message:
    'Password changed successfully',
};


}

// =====================================================
// REFRESH TOKEN
// =====================================================

async refreshToken(
refreshToken: string,
) {
if (!refreshToken) {
throw new UnauthorizedException(
'Refresh token is required',
);
}


try {
  const payload =
    this.jwtService.verify(
      refreshToken,
      {
        secret:
          this.configService.get<string>(
            'JWT_REFRESH_SECRET',
          ) ||
          'lms-refresh-secret',
      },
    );

  const user =
    await this.usersService.findOne(
      payload.sub,
    );

  if (
    !user ||
    !user.refreshToken
  ) {
    throw new UnauthorizedException(
      'Invalid refresh token',
    );
  }

  const isRefreshTokenValid =
    await bcrypt.compare(
      refreshToken,
      user.refreshToken,
    );

  if (!isRefreshTokenValid) {
    throw new UnauthorizedException(
      'Invalid refresh token',
    );
  }

  const newPayload = {
    sub: user.id,
    email: user.email,
    role: user.role,
    name: user.name,
  };

  const newAccessToken =
    this.jwtService.sign(
      newPayload,
    );

  const newRefreshToken =
    this.jwtService.sign(
      newPayload,
      {
        secret:
          this.configService.get<string>(
            'JWT_REFRESH_SECRET',
          ) ||
          'lms-refresh-secret',

        expiresIn: '7d',
      },
    );

  const hashedNewRefreshToken =
    await bcrypt.hash(
      newRefreshToken,
      10,
    );

  await this.usersService.updateRefreshToken(
    user.id,
    hashedNewRefreshToken,
  );

  return {
    access_token:
      newAccessToken,

    refresh_token:
      newRefreshToken,
  };
} catch (error) {
  throw new UnauthorizedException(
    'Invalid or expired refresh token',
  );
}

}

// =====================================================
// GET PROFILE
// =====================================================

async getProfile(
userId: number,
) {
const user =
await this.usersService.findOne(
userId,
);


if (!user) {
  throw new UnauthorizedException(
    'User not found',
  );
}

return {
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
  profileImageUrl:
    user.profileImageUrl,
  isEmailVerified:
    user.isEmailVerified,
};


}

// =====================================================
// LOGOUT
// =====================================================

async logout(
userId: number,
) {
await this.usersService.removeRefreshToken(
userId,
);
return {
  message:
    'Logout successful',
};
}
// =====================================================
// FORGOT PASSWORD - SEND OTP
// =====================================================

async forgotPassword(
email: string,
): Promise<{ message: string }> {
const normalizedEmail =
email.trim().toLowerCase();


const user =
  await this.usersService.findByEmail(
    normalizedEmail,
  );

if (!user) {
  return {
    message:
      'If an account exists with this email, a password reset OTP has been sent.',
  };
}

const otp =
  crypto
    .randomInt(
      100000,
      1000000,
    )
    .toString();

const otpExpiry = new Date(
  Date.now() +
    10 * 60 * 1000,
);

user.resetPasswordOtp = otp;

user.resetPasswordOtpExpires =
  otpExpiry;

user.resetPasswordToken = null;
user.resetPasswordExpires = null;

await this.usersService.save(user);

await this.mailService.sendPasswordResetOtpEmail(
  user.email,
  otp,
);

return {
  message:
    'If an account exists with this email, a password reset OTP has been sent.',
};
}
// =====================================================
// VERIFY RESET OTP
// =====================================================

async verifyResetOtp(
email: string,
otp: string,
): Promise<{ message: string }> {
const normalizedEmail =
email.trim().toLowerCase();


const user =
  await this.usersService.findByEmail(
    normalizedEmail,
  );

if (!user) {
  throw new BadRequestException(
    'Invalid OTP or email.',
  );
}

if (
  !user.resetPasswordOtp ||
  !user.resetPasswordOtpExpires
) {
  throw new BadRequestException(
    'No active OTP found. Please request a new OTP.',
  );
}

if (
  user.resetPasswordOtpExpires <
  new Date()
) {
  user.resetPasswordOtp = null;
  user.resetPasswordOtpExpires = null;

  await this.usersService.save(user);

  throw new BadRequestException(
    'OTP has expired. Please request a new OTP.',
  );
}

if (
  user.resetPasswordOtp !==
  otp.trim()
) {
  throw new BadRequestException(
    'Invalid OTP.',
  );
}

return {
  message:
    'OTP verified successfully.',
};


}

// =====================================================
// RESET PASSWORD USING OTP
// =====================================================

async resetPassword(
email: string,
otp: string,
newPassword: string,
): Promise<{ message: string }> {
const normalizedEmail =
email.trim().toLowerCase();


const user =
  await this.usersService.findByEmail(
    normalizedEmail,
  );

if (!user) {
  throw new BadRequestException(
    'Invalid password reset request.',
  );
}

if (
  !user.resetPasswordOtp ||
  !user.resetPasswordOtpExpires
) {
  throw new BadRequestException(
    'Please request a new password reset OTP.',
  );
}

if (
  user.resetPasswordOtpExpires <
  new Date()
) {
  user.resetPasswordOtp = null;
  user.resetPasswordOtpExpires = null;

  await this.usersService.save(user);

  throw new BadRequestException(
    'OTP has expired. Please request a new OTP.',
  );
}

if (
  user.resetPasswordOtp !==
  otp.trim()
) {
  throw new BadRequestException(
    'Invalid OTP.',
  );
}

const hashedPassword =
  await bcrypt.hash(
    newPassword,
    10,
  );

user.password =
  hashedPassword;

user.resetPasswordOtp = null;
user.resetPasswordOtpExpires = null;

user.resetPasswordToken = null;
user.resetPasswordExpires = null;

user.refreshToken = null;

await this.usersService.save(user);

return {
  message:
    'Password reset successfully.',
};
}
}
