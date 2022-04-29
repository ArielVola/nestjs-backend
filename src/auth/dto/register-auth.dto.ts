import { PartialType } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty } from 'class-validator';
import { LoginAuthDto } from './login-auth.dto';

export class RegisterAuthDto extends PartialType(LoginAuthDto) {
    
    _id: string;

    name: string;

    imgUrl: string;

    @IsBoolean()
    isGoogleAccount: boolean = false;

    googleId: string;

    emailVerified: boolean; 

    verifyCode: number;
}
