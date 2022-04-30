import { HttpException, Injectable } from '@nestjs/common';
import { LoginAuthDto } from './dto/login-auth.dto';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { hash, compare } from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';
import { Users, UsersDocument } from 'src/users/schema/users.schema';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { transporter } from '../config/mailer';
import { VerifyAuthDto } from './dto/verify-auth.dto';
import { ResetAuthDto } from './dto/reset-password.dto';
import { v4 as uuidv4 } from 'uuid';
import { PUBLIC_RESTORE_URL_dev, PUBLIC_VERIFY_URL_dev } from 'src/config/mailer.constants';
import { ChangePasswordAuthDto } from './dto/change-password.dto';

@Injectable()
export class AuthService {

  constructor(
    @InjectModel(Users.name) private userModel:Model<UsersDocument>,
    private jwtService: JwtService
    ) {}

  async register(userObject: RegisterAuthDto) {
    const { password, isGoogleAccount, googleId, email } = userObject;
    
    const findUser = await this.userModel.findOne({email});
    if(findUser) throw new HttpException('EMAIL ALREADY REGISTERED', 200);

    if( isGoogleAccount ) {
      const findGoogleUser = await this.userModel.findOne({ googleId });
      if(findGoogleUser) throw new HttpException('EMAIL ALREADY REGISTERED WITH GOOGLE', 200);
      return this.userModel.create(userObject);
    }
    
    const verifyCode = Math.floor(Math.random()*(999999-100000+1)+ 100000 );
    
    const plainToHash = await hash(password, 10);
    userObject = {...userObject, password: plainToHash, emailVerified: false, verifyCode};

    const { _id } = await this.userModel.create(userObject);
    
    await this.sendEmail('"Email verification NameOfMyApp" <myapp@gmail.com>', userObject.email, "Verify your email with us ✔", `
    <h2>Thank you for registering with us!</h2>   
    <hr/>
    <h3>Enter this verification code in the following link to finish the registration</h3>
    <b>${verifyCode}</b>
    <br/>
    <span>${PUBLIC_VERIFY_URL_dev}/${_id}</span>
  `);

    return {
      msg: "Check your email to verify your account",
      userId: _id
    };
  }

  async login(userObjectLogin: LoginAuthDto) {
    const { email, password } = userObjectLogin;
    const findUser = await this.userModel.findOne({email});
    if(!findUser) throw new HttpException('USER NOT FOUND', 404);
    if(findUser.isGoogleAccount) throw new HttpException('PLEASE SIGNIN WITH GOOGLE', 200);

    const checkPassword = await compare(password, findUser.password);

    if(!checkPassword) throw new HttpException('PASSWORD INVALID', 403);

    const payload = { id: findUser._id, name: findUser.name, imgUrl: findUser.imgUrl };
    const token = this.jwtService.sign(payload);

    const data = {
      user: findUser,
      token
    };

    return data;
  }

  async checkIfIsVerifiedAccount(userId: string) {
    const { emailVerified } = await this.userModel.findOne({id: userId});
    return emailVerified;
  }

  async validateVerifyCode(verifyAuthDto: VerifyAuthDto) {
    const { userId, verifyCodeInput } = verifyAuthDto;
    const userObject = await this.userModel.findOne({id: userId});
    if( userObject.emailVerified ) throw new HttpException('Account already verify', 403);
    if( verifyCodeInput !== userObject.verifyCode ) throw new HttpException('The code not match, try again', 403);
  
    let mutableUserObject = userObject;
    mutableUserObject.emailVerified = true;
  
    await this.userModel.updateOne({id: userId}, mutableUserObject );
    return {msg: 'User verifiqued with success!'}
  }

  /***********TODO: Utils method ************* */
  async sendEmail(from: string, to: string, subject: string, html: string) {
    await transporter.sendMail({
      from, // sender address
      to, // list of receivers
      subject, // Subject linetext body
      html, 
    });
  }
  /************************ */

  async resetPasswordAccount(resetAuthDto: ResetAuthDto ) {
    const { email } = resetAuthDto;
    const account = await this.userModel.findOne({email});

    if(!account || !account.emailVerified) throw new HttpException('Email incorrect', 403);
    
    const securityCode = uuidv4();

    this.sendEmail('"Reset password NameOfMyApp" <myapp@gmail.com>', email, 'Reset your password', `
      <h2>Restore your password with us!</h2>   
      <hr/>
      <h3>Enter in the next link to continue with the process</h3>
      <br/>
      <span>${PUBLIC_RESTORE_URL_dev}/${securityCode}</span>
    `);

    let mutableAccountData = account;
    mutableAccountData.resetCode = securityCode;
    
    await this.userModel.updateOne({_id: account._id}, mutableAccountData);

    return {msg: 'Check your email to continue with the password restore'};
  }

  async changePasswordAccount(changeDto: ChangePasswordAuthDto) {
    const { resetCode, newPassword } = changeDto;

    const findUser = await this.userModel.findOne({ resetCode });
    
    if(!findUser || !findUser.emailVerified) throw new HttpException('Something went wrong', 403);

    const plainToHash = await hash(newPassword, 10);
    await this.userModel.updateOne({ resetCode }, { password: plainToHash});

    return {msg: 'Password change with success'}
  }

}
