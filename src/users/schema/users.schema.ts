import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UsersDocument = Users & Document;

@Schema()
export class Users {
  @Prop()
  name: string;

  @Prop({unique: true})
  email: string;

  @Prop()
  password: string;

  @Prop()
  imgUrl: string;

  @Prop()
  isGoogleAccount: boolean;

  @Prop()
  googleId: string; 

  @Prop()
  emailVerified: boolean;

  @Prop()
  verifyCode: number;

  @Prop()
  resetCode: string;

}

export const UsersSchema = SchemaFactory.createForClass(Users);