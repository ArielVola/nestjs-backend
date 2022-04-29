import { IsNotEmpty, MinLength, MaxLength, IsEmail, IsBoolean } from "class-validator";

export class CreateGoogleUserDto {
    @IsNotEmpty()
    @MinLength(4)
    @MaxLength(20)
    name: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    imgUrl: string;

    @IsBoolean()
    isGoogleAccount: boolean;

    googleId: string;
}