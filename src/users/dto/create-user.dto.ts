import { IsBoolean, IsEmail, IsNotEmpty, Length, MaxLength, MinLength } from "class-validator";

export class CreateUserDto {
    
    @IsNotEmpty()
    @MinLength(4)
    @MaxLength(20)
    name: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @MinLength(8)
    @MaxLength(20)
    password: string;

    imgUrl: string;

    @IsBoolean()
    isGoogleAccount: boolean;

    googleId: string;
}
