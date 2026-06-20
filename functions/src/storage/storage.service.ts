import { Injectable } from "@nestjs/common";
import { getStorage } from "firebase-admin/storage";

@Injectable()
export class StorageService {
  private readonly bucket = getStorage().bucket(process.env.STORAGE_BUCKET);

  async deleteFile(path: string): Promise<void> {
    if (!path) return;

    try {
      await this.bucket.file(path).delete();

      console.log(`Deleted file: ${path}`);
    } catch (err) {
      console.error(`Failed to delete file: ${path}`, err);
    }
  }
}
