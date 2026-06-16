import { BadRequestException, Injectable } from "@nestjs/common";
import { UpdateUserDto } from "./dto/update-user.dto";
import { CreateUserDto } from "./dto/create-user.dto";
import { AuthUser } from "../auth/types/auth-user.type";
import { UsersRepository } from "./users.respository";
import { WriteUserModel } from "./types/write-user.model";
import { FieldValue } from "firebase-admin/firestore";

@Injectable()
export class UsersService {
  constructor(private usersRepository: UsersRepository) {}

  async getById(id: string) {
    return await this.usersRepository.findById(id);
  }

  async createUserProfile({ id, email }: AuthUser, dto: CreateUserDto) {
    const userData: WriteUserModel = {
      id,
      email,
      name: dto.name,
      surname: dto.surname,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    };

    await this.usersRepository.create(id, userData);

    return await this.usersRepository.findById(id);
  }

  async updateUser(id: string, dto: Partial<UpdateUserDto>) {
    const hasAtLeastOneField = Object.values(dto).some((v) => v !== undefined);

    if (!hasAtLeastOneField) {
      throw new BadRequestException("At least one field required");
    }

    await this.usersRepository.update(id, { ...dto });

    return await this.usersRepository.findById(id);
  }

  async deleteUser(id: string) {
    return await this.usersRepository.delete(id);
  }
}
