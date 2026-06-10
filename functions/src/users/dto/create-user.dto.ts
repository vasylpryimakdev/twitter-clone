import { IsString, IsOptional } from "class-validator";

export class CreateUserDto {
  @IsString()
  name!: string;

  @IsString()
  surname!: string;

  @IsOptional()
  @IsString()
  photoURL?: string;
}
