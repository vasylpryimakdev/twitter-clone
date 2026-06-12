import {
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
} from "class-validator";

export class UpdatePostDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(120)
  title?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(5000)
  text?: string;

  @IsOptional()
  @IsUrl({
    protocols: ["http", "https"],
    require_protocol: true,
  })
  photoUrl?: string | null;
}
