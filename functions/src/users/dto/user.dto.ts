import {
  IsString,
  IsNotEmpty,
  Length,
  Matches,
  MaxLength,
  MinLength,
  IsOptional,
  ValidateNested,
  IsUrl,
  IsEnum,
} from "class-validator";
import { Transform, Type } from "class-transformer";

export class UserAvatarDto {
  @IsUrl({}, { message: "Avatar URL must be valid" })
  url!: string;

  @IsOptional()
  @IsString()
  path?: string;

  @IsEnum(["google", "upload"], {
    message: "type must be google or upload",
  })
  type!: "google" | "upload";
}

export class UserDto {
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
  @ValidateNested()
  @Type(() => UserAvatarDto)
  avatar?: UserAvatarDto;
}
