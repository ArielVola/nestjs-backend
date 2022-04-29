import { IsEmail } from "class-validator";

export class LoginAuthDto {
    @IsEmail()
    email: string;

    password: string;
}
