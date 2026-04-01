import { ApiProperty } from '@nestjs/swagger';

export class GenericResponse<T> {
  @ApiProperty()
  statusCode: number;

  @ApiProperty()
  status: string;

  @ApiProperty({ type: () => ({}) as T })
  data: T;

  constructor(data: T, statusCode = 200, status = 'success') {
    this.statusCode = statusCode;
    this.status = status;
    this.data = data;
  }
}
