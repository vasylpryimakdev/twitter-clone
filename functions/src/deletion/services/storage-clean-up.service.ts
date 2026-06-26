import { Inject, Injectable, Logger } from "@nestjs/common";
import { Bucket } from "@google-cloud/storage";
import { FIREBASE_BUCKET } from "../../common/firebase/firebase.constants";

@Injectable()
export class StorageCleanupService {
  private readonly logger = new Logger(StorageCleanupService.name);

  constructor(
    @Inject(FIREBASE_BUCKET)
    private readonly bucket: Bucket,
  ) {}

  async deleteUserFiles(userId: string) {
    const prefix = `users/${userId}/`;
    await this.deleteByPrefix(prefix);
  }

  async deleteByPrefix(prefix: string) {
    try {
      const [files] = await this.bucket.getFiles({ prefix });

      if (!files.length) return;

      await Promise.all(
        files.map(async (file) => {
          try {
            await file.delete();
          } catch (err) {
            this.logger.warn(`Failed to delete file: ${file.name}`);
          }
        }),
      );

      this.logger.log(`Storage cleanup completed for prefix: ${prefix}`);
    } catch (err) {
      this.logger.error(`Storage cleanup failed for prefix: ${prefix}`, err);
    }
  }

  async deleteFile(path: string) {
    try {
      await this.bucket.file(path).delete();
    } catch (err) {
      this.logger.warn(`Failed to delete file: ${path}`);
    }
  }
}
