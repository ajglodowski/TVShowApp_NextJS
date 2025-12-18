import { Storage } from '@google-cloud/storage';
import formidable from 'formidable';
import type { NextApiRequest, NextApiResponse } from 'next';
import sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';
import { createServerClient, type CookieOptions } from '@supabase/ssr';

export const config = {
  api: {
    bodyParser: false, // Disable the default body parser as we're using formidable
  },
};

// Create a Supabase client for authentication checks
const getSupabaseForAuth = async (req: NextApiRequest, res: NextApiResponse) => {
  const cookieStore = req.cookies;
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore[name];
        },
        set(name: string, value: string, _options: CookieOptions) {
          res.setHeader('Set-Cookie', `${name}=${value}; Path=/; HttpOnly; SameSite=Lax`);
        },
        remove(name: string, _options: CookieOptions) {
          res.setHeader('Set-Cookie', `${name}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`);
        },
      },
    }
  );
  
  return supabase;
};

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

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Check authentication
    const supabase = await getSupabaseForAuth(req, res);
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized: Authentication required' });
    }

    const form = formidable({ multiples: false });
    
    // Parse the form data
    const [fields, files] = await new Promise<[formidable.Fields, formidable.Files]>((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        else resolve([fields, files]);
      });
    });

    // Get the path parameter
    const path = fields.path?.[0] || '';
    if (!path) {
      return res.status(400).json({ error: 'Path is required' });
    }

    // Check if an image was uploaded
    const imageFile = files.image?.[0];
    if (!imageFile) {
      return res.status(400).json({ error: 'No image found in request' });
    }

    // Generate a UUID for the image
    const imageId = uuidv4();
    const fileName = `${imageId}.jpeg`;
    const fullPath = `${path}/${fileName}`;

    // Get GCP bucket
    const bucketName = process.env.GCP_BUCKET_NAME || "";
    const bucket = storage.bucket(bucketName);
    const file = bucket.file(fullPath);

    // Convert the image to JPEG format using sharp
    const convertedImageBuffer = await sharp(imageFile.filepath)
      .jpeg({ quality: 90 })
      .toBuffer();

    // Upload the converted buffer to Google Cloud Storage with cache control headers
    await file.save(convertedImageBuffer, {
      metadata: {
        contentType: 'image/jpeg',
        cacheControl: 'public, max-age=31536000', // Cache for 1 year (in seconds)
      },
    });

    // Return the generated UUID and full path
    res.status(200).json({ 
      success: true,
      imageId: imageId,
      fileName: fileName,
      fullPath: fullPath
    });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ error: 'Failed to upload image' });
  }
}