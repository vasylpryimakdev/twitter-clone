import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { UpdateUserDto } from "./dto/update-user.dto";
import { CreateUserDto } from "./dto/create-user.dto";
import { AuthUser } from "../auth/types/auth-user.type";
import { UsersRepository } from "./users.respository";
import { WriteUserModel } from "./types/write-user.model";
import { FieldValue, Firestore } from "firebase-admin/firestore";
import { UserDeletionService } from "./user-deletion.service";
import { FIRESTORE } from "../common/firestore/firestore.provider";

@Injectable()
export class UsersService {
  constructor(
    private usersRepository: UsersRepository,
    private readonly userDeletionService: UserDeletionService,
    @Inject(FIRESTORE)
    private readonly firestore: Firestore,
  ) {}

  async getById(id: string) {
    return await this.usersRepository.findById(id);
  }

  async createUserProfile({ id, email }: AuthUser, dto: CreateUserDto) {
    const userRef = this.usersRepository.getRef(id);

    await this.firestore.runTransaction(async (tx) => {
      await this.usersRepository.assertUsernameAvailable(id, dto.username, tx);

      const userData: WriteUserModel = {
        id,
        email,
        name: dto.name,
        surname: dto.surname,
        username: dto.username,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      };

      tx.set(userRef, userData);
    });

    return this.usersRepository.findById(id);
  }

  async updateUser(id: string, dto: Partial<UpdateUserDto>) {
    const hasAtLeastOneField = Object.values(dto).some((v) => v !== undefined);

    if (!hasAtLeastOneField) {
      throw new BadRequestException("At least one field required");
    }

    const userRef = this.usersRepository.getRef(id);

    await this.firestore.runTransaction(async (tx) => {
      const userSnap = await tx.get(userRef);

      if (!userSnap.exists) {
        throw new NotFoundException("User not found");
      }

      if (dto.username) {
        await this.usersRepository.assertUsernameAvailable(
          id,
          dto.username,
          tx,
        );
      }

      const updateData: any = {
        ...dto,
        updatedAt: FieldValue.serverTimestamp(),
      };

      tx.update(userRef, updateData);
    });

    return this.usersRepository.findById(id);
  }

  async deleteUser(id: string) {
    return this.userDeletionService.deleteUser(id);
  }
}
