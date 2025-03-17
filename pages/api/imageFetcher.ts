import { NextApiRequest, NextApiResponse } from 'next';
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
const storage = new Storage(getGCPCredentials());

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    const imageName = Array.isArray(req.query.imageName) 
        ? req.query.imageName[0] 
        : req.query.imageName as string;
  const path = req.query.path as unknown as string;
  const fullPath = `${path}/${imageName}`;
  
  const bucketName = process.env.GCP_BUCKET_NAME || "";
  
  try {
    // Get a reference to the bucket and file
    const bucket = storage.bucket(bucketName);
    const file = bucket.file(fullPath);
    
    // Check if the file exists
    const [exists] = await file.exists();
    if (!exists) {
      res.status(404).json({ error: 'Image not found' });
      return;
    }
    
    // Get the file's metadata to determine content type
    const [metadata] = await file.getMetadata();
    const contentType = metadata.contentType || 'application/octet-stream';
    
    // Download the file content
    const [buffer] = await file.download();
    
    // Set appropriate headers
    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Length', buffer.length.toString());
    res.setHeader('Cache-Control', 'public, max-age=600, s-maxage=600, stale-while-revalidate=120');
    
    // Send the buffer
    res.status(200).send(buffer);
  } catch (error) {
    console.error('Error fetching image:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}