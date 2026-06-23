import { Inject, Injectable } from "@nestjs/common";
import { FIREBASE_BUCKET } from "../firebase.constants";
import { Bucket } from "@google-cloud/storage";

@Injectable()
export class StorageService {
  constructor(
    @Inject(FIREBASE_BUCKET)
    private readonly bucket: Bucket,
  ) {}

  async uploadFile(path: string, buffer: Buffer, contentType: string) {
    const file = this.bucket.file(path);

    await file.save(buffer, {
      metadata: { contentType },
    });

    await file.makePublic();

    return file.publicUrl();
  }

  async deleteFile(path: string) {
    if (!path) return;
    await this.bucket.file(path).delete();
  }
}
