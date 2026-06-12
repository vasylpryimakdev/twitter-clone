import { IsOptional, IsString, Length, Matches } from "class-validator";

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

  @IsOptional()
  @IsString()
  @Matches(/^https?:\/\/.*\.(jpg|jpeg|png|webp)$/i, {
    message: "Avatar must be a valid image URL",
  })
  avatar?: string;
}
