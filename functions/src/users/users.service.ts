import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { UserDto } from "./dto/user.dto";
import { AuthUser } from "../auth/types/auth-user.type";
import { UsersRepository } from "./users.respository";
import { WriteUserModel } from "./types/write-user.model";
import { FieldValue, Firestore } from "firebase-admin/firestore";
import { UserDeletionService } from "./user-deletion.service";
import { FIRESTORE } from "../common/firestore/firestore.provider";
import { User } from "./types/users.entity";
import { StorageService } from "../storage/storage.service";

@Injectable()
export class UsersService {
  constructor(
    private usersRepository: UsersRepository,
    private readonly userDeletionService: UserDeletionService,
    private readonly storageService: StorageService,
    @Inject(FIRESTORE)
    private readonly firestore: Firestore,
  ) {}

  async getById(id: string) {
    return await this.usersRepository.findById(id);
  }

  async createUserProfile({ id, email }: AuthUser, dto: UserDto) {
    const userRef = this.usersRepository.getRef(id);

    await this.firestore.runTransaction(async (tx) => {
      await this.usersRepository.assertUsernameAvailable(id, dto.username, tx);

      const userData: WriteUserModel = {
        id,
        email,
        name: dto.name,
        surname: dto.surname,
        username: dto.username,

        avatar: dto.avatar
          ? {
              url: dto.avatar.url,
              ...(dto.avatar.path ? { path: dto.avatar.path } : {}),
              type: dto.avatar.type,
            }
          : null,

        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      };

      tx.set(userRef, userData);
    });

    return this.usersRepository.findById(id);
  }

  async updateUser(id: string, dto: Partial<UserDto>) {
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

      const user = userSnap.data() as User;

      if (dto.username) {
        await this.usersRepository.assertUsernameAvailable(
          id,
          dto.username,
          tx,
        );
      }

      const updateData: Partial<WriteUserModel> = {
        updatedAt: FieldValue.serverTimestamp(),
      };

      if (dto.name !== undefined) {
        updateData.name = dto.name;
      }

      if (dto.surname !== undefined) {
        updateData.surname = dto.surname;
      }

      if (dto.username !== undefined) {
        updateData.username = dto.username;
      }

      if (dto.avatar !== undefined) {
        if (dto.avatar === null) {
          if (user.avatar?.type === "upload") {
            await this.storageService.deleteFile(user.avatar.path!);
          }

          updateData.avatar = null;
        } else {
          if (user.avatar?.type === "upload") {
            await this.storageService.deleteFile(user.avatar.path!);
          }

          updateData.avatar = {
            url: dto.avatar.url,
            path: dto.avatar.path,
            type: dto.avatar.type,
          };
        }
      }

      tx.update(userRef, updateData);
    });

    return this.usersRepository.findById(id);
  }

  async deleteUser(id: string) {
    return this.userDeletionService.deleteUser(id);
  }
}
