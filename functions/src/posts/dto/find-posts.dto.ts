import { IsOptional, IsString, IsNumber } from "class-validator";

export class FindPostsDto {
  @IsOptional()
  @IsString()
  userId?: string;

  @IsOptional()
  @IsString()
  cursor?: string;

  @IsOptional()
  @IsString()
  search?: string;

  @IsNumber()
  limit!: number;
}
