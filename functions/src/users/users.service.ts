import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { UpdateUserDto } from "./dto/update-user.dto";
import { CreateUserDto } from "./dto/create-user.dto";
import { AuthUser } from "../auth/types/auth-user.type";
import { UsersRepository } from "./users.respository";
import { CreateUserInput } from "./types/create-user-input.type";

@Injectable()
export class UsersService {
  constructor(private usersRepository: UsersRepository) {}

  async getById(id: string) {
    const user = await this.usersRepository.findOne(id);

    if (!user) {
      throw new NotFoundException("User not found");
    }

    return user;
  }

  async createUserProfile(
    { id, email }: AuthUser,
    { name, surname }: CreateUserDto,
  ) {
    const userData: CreateUserInput = {
      email,
      name,
      surname,
    };

    return this.usersRepository.create(id, userData);
  }

  async updateUser(id: string, data: Partial<UpdateUserDto>) {
    const updatedUser = await this.usersRepository.update(id, data);

    const hasAtLeastOneField = Object.values(data).some((v) => v !== undefined);

    if (!hasAtLeastOneField) {
      throw new BadRequestException("At least one field required");
    }

    if (!updatedUser) {
      throw new NotFoundException("User not found");
    }

    return updatedUser;
  }

  async deleteUser(id: string) {
    await this.usersRepository.delete(id);

    return { success: true };
  }
}
