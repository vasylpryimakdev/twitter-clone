import { IsString, IsNotEmpty, Length, Matches } from "class-validator";

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
  @IsNotEmpty()
  @Length(3, 20)
  @Matches(/^[a-zA-Z0-9_]+$/, {
    message: "Username can only contain letters, numbers and underscores",
  })
  username!: string;
}
