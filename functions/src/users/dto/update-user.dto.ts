import { IsOptional, IsString, IsUrl, Length, Matches } from "class-validator";

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
  @Length(3, 20)
  @Matches(/^[a-zA-Z0-9_]+$/, {
    message: "Username can only contain letters, numbers and underscores",
  })
  username?: string;

  @IsOptional()
  @IsString()
  @IsUrl({
    protocols: ["http", "https"],
    require_protocol: true,
  })
  avatar?: string;
}
