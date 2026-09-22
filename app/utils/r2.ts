import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';

// Bucket → public domain mapping lives in app/utils/imageUrls.ts
export const R2_SHOW_IMAGES_BUCKET = 'showlog-images';
export const R2_PROFILE_PICS_BUCKET = 'showlog-profile-pics';

let client: S3Client | null = null;

function getR2Client(): S3Client {
  if (client) return client;
  const accountId = process.env.R2_ACCOUNT_ID;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
  if (!accountId || !accessKeyId || !secretAccessKey) {
    throw new Error('R2_ACCOUNT_ID, R2_ACCESS_KEY_ID and R2_SECRET_ACCESS_KEY must be set');
  }
  client = new S3Client({
    region: 'auto',
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: { accessKeyId, secretAccessKey },
  });
  return client;
}

// Keys are fresh UUIDs on every upload, so objects can be cached forever
export async function putImmutableJpeg(bucket: string, key: string, body: Buffer): Promise<void> {
  await getR2Client().send(new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    Body: body,
    ContentType: 'image/jpeg',
    CacheControl: 'public, max-age=31536000, immutable',
  }));
}
