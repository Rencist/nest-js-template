import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

class constraintValue {
  @ApiProperty({ example: 'error message' })
  constraitName: string;
}

class messageValue {
  @ApiProperty()
  constraints: constraintValue;
}

export class BadRequestResponse {
  @ApiProperty()
  statusCode: HttpStatus;

  @ApiProperty({ example: '400' })
  message: messageValue;

  @ApiProperty()
  error: string;
}
