import {
  IsString,
  IsNotEmpty,
  Length,
  Matches,
  MaxLength,
  MinLength,
  IsOptional,
  IsUrl,
} from "class-validator";
import { Transform } from "class-transformer";

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @Length(2, 30)
  @Matches(/^[a-zA-Zа-яА-ЯіІїЇєЄ'-]+$/, {
    message: "Name contains invalid characters",
  })
  name!: string;

  @IsString()
  @IsNotEmpty()
  @Length(2, 30)
  @Matches(/^[a-zA-Zа-яА-ЯіІїЇєЄ'-]+$/, {
    message: "Surname contains invalid characters",
  })
  surname!: string;

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
  @IsUrl({}, { message: "Avatar must be a valid URL" })
  avatar?: string;
}
