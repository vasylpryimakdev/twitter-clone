import { Injectable, NotFoundException } from "@nestjs/common";
import { UpdateUserDto } from "./dto/update-user.dto";
import { CreateUserDto } from "./dto/create-user.dto";
import { AuthUser } from "../auth/types/auth-user.type";
import { UsersRepository } from "./users.respository";
import { User } from "./users.entity";

@Injectable()
export class UsersService {
  constructor(private usersRepository: UsersRepository) {}

  async getById(uid: string) {
    const user = await this.usersRepository.findOne(uid);

    if (!user) {
      throw new NotFoundException("User not found");
    }

    return user;
  }

  async createUserProfile(
    { uid, email }: AuthUser,
    { name, surname }: CreateUserDto,
  ) {
    const userData: User = {
      uid,
      email,
      name: name,
      surname: surname,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return this.usersRepository.create(userData);
  }

  async updateUser(uid: string, data: Partial<UpdateUserDto>) {
    const updatedUser = await this.usersRepository.update(uid, data);

    if (!updatedUser) {
      throw new NotFoundException("User not found");
    }

    return updatedUser;
  }

  async deleteUser(uid: string) {
    await this.usersRepository.delete(uid);

    return { success: true };
  }
}
