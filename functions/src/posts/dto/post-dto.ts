import {
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";

export class PostImageDto {
  @IsString()
  url!: string;

  @IsString()
  path!: string;
}

export class PostDto {
  @IsString()
  @MinLength(1)
  @MaxLength(120)
  title!: string;

  @IsString()
  @MinLength(1)
  @MaxLength(5000)
  text!: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => PostImageDto)
  image?: PostImageDto | null;
}
