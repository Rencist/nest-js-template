import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

type attachment = {
  filename: string;
  path: string;
};

export class email {
  from?: string = process.env.EMAIL;

  @IsEmail()
  @IsNotEmpty()
  to: string;

  @IsString()
  @IsNotEmpty()
  subject: string;

  @IsString()
  text: string;

  @IsString()
  html: string;

  @IsOptional()
  attachments?: attachment[];
}
