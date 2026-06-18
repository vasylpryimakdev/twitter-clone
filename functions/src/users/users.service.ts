import { BadRequestException, Injectable } from "@nestjs/common";
import { UpdateUserDto } from "./dto/update-user.dto";
import { CreateUserDto } from "./dto/create-user.dto";
import { AuthUser } from "../auth/types/auth-user.type";
import { UsersRepository } from "./users.respository";
import { WriteUserModel } from "./types/write-user.model";
import { FieldValue } from "firebase-admin/firestore";
import { UserDeletionService } from "./user-deletion.service";

@Injectable()
export class UsersService {
  constructor(
    private usersRepository: UsersRepository,
    private readonly userDeletionService: UserDeletionService,
  ) {}

  async getById(id: string) {
    return await this.usersRepository.findById(id);
  }

  async createUserProfile({ id, email }: AuthUser, dto: CreateUserDto) {
    await this.usersRepository.assertUsernameAvailable(dto.username);

    const userData: WriteUserModel = {
      id,
      email,
      name: dto.name,
      surname: dto.surname,
      username: dto.username,
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

    if (dto.username) {
      await this.usersRepository.assertUsernameAvailable(dto.username);
    }

    await this.usersRepository.update(id, {
      ...dto,
      updatedAt: FieldValue.serverTimestamp(),
    });

    return await this.usersRepository.findById(id);
  }

  async deleteUser(id: string) {
    return this.userDeletionService.deleteUser(id);
  }
}
