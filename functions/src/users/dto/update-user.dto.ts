import {
  IsOptional,
  IsString,
  IsUrl,
  Length,
  Matches,
  MaxLength,
  MinLength,
} from "class-validator";
import { Transform } from "class-transformer";

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @Length(2, 30)
  @Matches(/^[a-zA-Zа-яА-ЯіІїЇєЄ'-]+$/, {
    message: "Name contains invalid characters",
  })
  name?: string;

  @IsOptional()
  @IsString()
  @Length(2, 30)
  @Matches(/^[a-zA-Zа-яА-ЯіІїЇєЄ'-]+$/, {
    message: "Surname contains invalid characters",
  })
  surname?: string;

  @IsString()
  @MinLength(3)
  @MaxLength(20)
  @Matches(/^[a-zA-Z0-9_]+$/)
  @Transform(({ value }) =>
    value
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "")
      .replace(/[^a-z0-9_]/g, ""),
  )
  username!: string;

  @IsOptional()
  @IsString()
  @IsUrl({
    protocols: ["http", "https"],
    require_protocol: true,
  })
  avatar?: string;
}
