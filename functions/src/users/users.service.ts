import { Injectable, NotFoundException } from "@nestjs/common";
import { firebaseAdmin } from "../config/firebase.config";
import { UpdateUserDto } from "./dto/update-user.dto";
import { CreateUserDto } from "./dto/create-user.dto";

@Injectable()
export class UsersService {
  private usersCollection = firebaseAdmin.firestore().collection("users");

  async getById(uid: string) {
    const doc = await this.usersCollection.doc(uid).get();

    if (!doc.exists) {
      throw new NotFoundException("User not found");
    }

    return doc.data();
  }

  async createUserProfile(
    userId: string,
    email: string,
    { name, surname }: CreateUserDto,
  ) {
    const userData = {
      uid: userId,
      email,
      name: name || "",
      surname: surname || "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await this.usersCollection.doc(userId).set(userData);

    return {
      success: true,
      user: userData,
    };
  }

  async updateUser(uid: string, data: Partial<UpdateUserDto>) {
    const ref = this.usersCollection.doc(uid);

    const doc = await ref.get();

    if (!doc.exists) {
      throw new NotFoundException("User not found");
    }

    await ref.update({
      ...data,
      updatedAt: new Date().toISOString(),
    });

    return this.getById(uid);
  }

  async deleteUser(uid: string) {
    await this.usersCollection.doc(uid).delete();

    return { success: true };
  }
}
