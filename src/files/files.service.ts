import { Injectable } from '@nestjs/common';
import EasyYandexS3 from 'easy-yandex-s3';

@Injectable()
export class FilesService extends EasyYandexS3 {
  constructor() {
    super({
      auth: {
        accessKeyId: process.env.YANDEX_CLOUD_KEY_ID,
        secretAccessKey: process.env.YANDEX_CLOUD_KEY_SECRET,
      },
      Bucket: 'nest-auth',
      debug: true,
    });
  }
  async uploadAvatar(image: Express.Multer.File) {
    try {
      const upload: any = await this.Upload(
        { buffer: image.buffer },
        '/avatars/',
      );
      return upload.key;
    } catch (error) {
      return false;
    }
  }
  async deleteAvatar(path: string) {
    try {
      return this.Remove(path);
    } catch (error) {
      return false;
    }
  }
}
