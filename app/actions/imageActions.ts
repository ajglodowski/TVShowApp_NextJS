'use server';

import { Storage } from '@google-cloud/storage';
import sharp from 'sharp';
import { cacheLife } from 'next/dist/server/use-cache/cache-life';

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

let storage: Storage;
if (process.env.NODE_ENV === "production") storage = new Storage(getGCPCredentials());
else {
  try {
    storage = new Storage({
      projectId: process.env.GCP_PROJECT_ID || "tv-show-app-602d7", // Fallback projectId if needed
      keyFilename: "gcpCreds.json" // Assumes local key file
    });
  } catch (error) {
     console.warn("Local GCP creds file 'gcpCreds.json' not found or invalid, attempting fallback auth (e.g., gcloud CLI)...", error);
     storage = new Storage(getGCPCredentials()); // Fallback to env vars or default gcloud auth
  }
}

export async function getAverageColorAction(imagePath: string): Promise<string | null> {
  'use cache'
    cacheLife('minutes');
    try {
        if (!imagePath) {
            console.error('imagePath is required for getAverageColorAction');
            return null;
        }
        const bucketName = process.env.GCP_BUCKET_NAME || "";
        if (!bucketName) {
            console.error('GCP_BUCKET_NAME environment variable is not set.');
            return null;
        }
        
        const bucket = storage.bucket(bucketName);
        const file = bucket.file(imagePath);
        const [exists] = await file.exists();
        if (!exists) {
            console.error(`File ${imagePath} does not exist in bucket ${bucketName}`);
            // It might be valid for a file not to exist, return null instead of throwing
            return null; 
        }
        
        const [buffer] = await file.download();
        const { data } = await sharp(buffer)
          .resize(1, 1) 
          .raw()
          .toBuffer({ resolveWithObject: true });
        const averageColor = `rgb(${data[0]},${data[1]},${data[2]})`;
        return averageColor;
    } catch (error) {
        console.error('Error getting average color in Server Action:', error);
        return null; // Return null on error
    }
}

export async function generatePresignedUrlAction(path: string, imageName: string): Promise<string | null> {
    'use cache'
    cacheLife('minutes');

  try {
    if (!path || !imageName) {
        console.error('Path and imageName are required for generatePresignedUrlAction');
        return null;
    }
    const fullPath = `${path}/${imageName}`;
    const bucketName = process.env.GCP_BUCKET_NAME || "";
    if (!bucketName) {
        console.error('GCP_BUCKET_NAME environment variable is not set.');
        return null;
    }
    
    const bucket = storage.bucket(bucketName);
    const file = bucket.file(fullPath);

    const [url] = await file.getSignedUrl({
      version: 'v4',
      action: 'read',
      expires: Date.now() + 85 * 60 * 1000, // 85 minutes
    });

    return url;
  } catch (error) {
    console.error('Error generating presigned URL in Server Action:', error);
    return null; // Return null on error
  }
} 