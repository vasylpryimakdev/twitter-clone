import { BadRequestException, Injectable } from "@nestjs/common";
import { UpdateUserDto } from "./dto/update-user.dto";
import { CreateUserDto } from "./dto/create-user.dto";
import { AuthUser } from "../auth/types/auth-user.type";
import { UsersRepository } from "./users.respository";
import { CreateUserInput } from "./types/create-user-input.type";

@Injectable()
export class UsersService {
  constructor(private usersRepository: UsersRepository) {}

  async getById(id: string) {
    return await this.usersRepository.findOne(id);
  }

  async createUserProfile({ id, email }: AuthUser, dto: CreateUserDto) {
    const userData: CreateUserInput = {
      email,
      name: dto.name,
      surname: dto.surname,
    };

    return this.usersRepository.create(id, userData);
  }

  async updateUser(id: string, dto: Partial<UpdateUserDto>) {
    const hasAtLeastOneField = Object.values(dto).some((v) => v !== undefined);

    if (!hasAtLeastOneField) {
      throw new BadRequestException("At least one field required");
    }

    return await this.usersRepository.update(id, dto);
  }

  async deleteUser(id: string) {
    return await this.usersRepository.delete(id);
  }
}
