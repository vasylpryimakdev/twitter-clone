import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";

import { FieldValue } from "firebase-admin/firestore";
import { FirestoreService } from "../common/firebase/firebase.service";
import { StorageService } from "../common/firebase/storage/storage.service";
import { UsersRepository } from "./users.repository";
import { User } from "./types/users.entity";
import { AuthUser } from "../common/types/auth-user.type";
import { CreateUserDto } from "./dto/create-user.dto";
import { WriteUserModel } from "./types/write-user.model";
import { UpdateUserDto } from "./dto/update-user.dto";
import { DeletionService } from "../deletion/deletion.service";

@Injectable()
export class UsersService {
  constructor(
    private readonly firestoreService: FirestoreService,
    private readonly storageService: StorageService,
    private usersRepository: UsersRepository,
    private deletionService: DeletionService,
  ) {}

  async getById(id: string): Promise<User | null> {
    return await this.usersRepository.findById(id);
  }

  async createProfile(
    { id, email }: AuthUser,
    dto: CreateUserDto,
  ): Promise<WriteUserModel> {
    const { name, surname, username, avatar } = dto;

    const userRef = this.usersRepository.getRef(id);

    let resultUser: any;

    await this.firestoreService.runTransaction(async (tx) => {
      const userSnap = await tx.get(userRef);

      if (userSnap.exists) {
        resultUser = userSnap.data();
        return;
      }

      const existingUser = await this.usersRepository.findByUsername(
        username,
        tx,
      );

      const isUsernameTaken = existingUser && existingUser.id !== id;

      if (isUsernameTaken) {
        throw new BadRequestException("Username already taken");
      }

      const mappedAvatar = avatar
        ? {
            url: avatar.url,
            type: avatar.type,
            ...(avatar.path ? { path: avatar.path } : {}),
          }
        : null;

      const userData: WriteUserModel = {
        id,
        email,
        name,
        surname,
        username,
        avatar: mappedAvatar,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      };

      tx.create(userRef, userData);

      resultUser = userData;
    });

    return resultUser;
  }

  async updateProfile(
    id: string,
    dto: Partial<UpdateUserDto>,
  ): Promise<User | null> {
    const { name, surname, username, avatar } = dto;
    const hasAtLeastOneField = Object.values(dto).some((v) => v !== undefined);

    if (!hasAtLeastOneField) {
      throw new BadRequestException("At least one field required");
    }

    const userRef = this.usersRepository.getRef(id);

    await this.firestoreService.runTransaction(async (tx) => {
      const userSnap = await tx.get(userRef);

      if (!userSnap.exists) {
        throw new NotFoundException("User not found");
      }

      const user = userSnap.data() as User;

      if (username) {
        const existingUser = await this.usersRepository.findByUsername(
          username,
          tx,
        );

        const isUsernameTaken = existingUser && existingUser.id !== id;

        if (isUsernameTaken) {
          throw new BadRequestException("Username already taken");
        }
      }

      const updateData: Partial<WriteUserModel> = {
        updatedAt: FieldValue.serverTimestamp(),
      };

      if (name !== undefined) {
        updateData.name = name;
      }

      if (surname !== undefined) {
        updateData.surname = surname;
      }

      if (username !== undefined) {
        updateData.username = username;
      }

      if (avatar !== undefined) {
        if (avatar === null) {
          if (user.avatar?.type === "upload") {
            await this.storageService.deleteFile(user.avatar.path!);
          }

          updateData.avatar = null;
        } else {
          if (user.avatar?.type === "upload") {
            await this.storageService.deleteFile(user.avatar.path!);
          }

          updateData.avatar = {
            url: avatar.url,
            path: avatar.path,
            type: avatar.type,
          };
        }
      }

      tx.update(userRef, updateData);
    });

    return this.usersRepository.findById(id);
  }

  async deleteProfile(id: string): Promise<void> {
    return this.deletionService.deleteUser(id);
  }
}
