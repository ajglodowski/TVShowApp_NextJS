import { Storage } from '@google-cloud/storage';
import type { NextApiRequest, NextApiResponse } from 'next';

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

export async function generatePresignedUrl(fileName: string) {

  const bucketName = process.env.GCP_BUCKET_NAME || "";
  const bucket = storage.bucket(bucketName);
  const file = bucket.file(fileName);

  const [url] = await file.getSignedUrl({
    version: 'v4',
    action: 'read',
    expires: Date.now() + 85 * 60 * 1000, // 85 minutes
  });

  return url;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const imageName = Array.isArray(req.query.imageName) 
        ? req.query.imageName[0] 
        : req.query.imageName as string;
    const path = req.query.path as unknown as string;
    const fullPath = `${path}/${imageName}`;
    
    //res.setHeader('Cache-Control', 'public, max-age=600, s-maxage=600, stale-while-revalidate=120'); // cache for 10 minutes
    const presignedUrl = await generatePresignedUrl(fullPath);
    res.status(200).json({ url: presignedUrl });
  } catch (error) {
    console.error('Error generating presigned URL:', error);
    res.status(500).json({ error: 'Failed to generate presigned URL' });
  }
}