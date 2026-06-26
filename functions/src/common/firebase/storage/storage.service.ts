import { Inject, Injectable } from "@nestjs/common";
import { FIREBASE_BUCKET } from "../firebase.constants";
import { Bucket } from "@google-cloud/storage";

@Injectable()
export class StorageService {
  constructor(
    @Inject(FIREBASE_BUCKET)
    private readonly bucket: Bucket,
  ) {}

  async deleteFile(path: string) {
    if (!path) return;
    await this.bucket.file(path).delete();
  }
}
