import { NextApiRequest, NextApiResponse } from 'next/types';
import sharp from 'sharp';
import { Storage } from '@google-cloud/storage';

const getGCPCredentials = () => {
    // for Vercel, use environment variables
    return process.env.GCP_PRIVATE_KEY
      ? {
          credentials: {
            client_email: process.env.GCP_SERVICE_ACCOUNT_EMAIL,
            private_key: process.env.GCP_PRIVATE_KEY,
          },
          projectId: process.env.GCP_PROJECT_ID,
        }
        // for local development, use gcloud CLI
      : {};
  };


// Initialize Google Cloud Storage client with authentication
let storage: Storage;
if (process.env.NODE_ENV === "production") storage = new Storage(getGCPCredentials());
else {
  storage = new Storage({
    projectId: "tv-show-app-602d7",
    keyFilename: "gcpCreds.json"
  });
}

async function getAverageColor(imagePath: string): Promise<string> {
    const bucketName = process.env.GCP_BUCKET_NAME || "";
    const bucket = storage.bucket(bucketName);
    const file = bucket.file(imagePath);
    const [exists] = await file.exists();
    if (!exists) {
        throw new Error(`File ${imagePath} does not exist in bucket ${bucketName}`);
    }
    
    const [buffer] = await file.download();
    const { data } = await sharp(buffer)
      .resize(1, 1)
      .raw()
      .toBuffer({ resolveWithObject: true });
    const averageColor = `rgb(${data[0]},${data[1]},${data[2]})`;
    return averageColor;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  const imagePath = req.query.imagePath as unknown as string;
  const averageColor = await getAverageColor(imagePath);
  res.setHeader('Cache-Control', 'public, max-age=600, s-maxage=600, stale-while-revalidate=120');
  res.status(200).json({ averageColor });
}
