import formidable from 'formidable';
import type { NextApiRequest, NextApiResponse } from 'next';
import sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { putImmutableJpeg, R2_PROFILE_PICS_BUCKET, R2_SHOW_IMAGES_BUCKET } from '@/app/utils/r2';

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

const MAX_FILE_SIZE = 10 * 1024 * 1024; // matches the client-side limit
const PROFILE_PIC_MAX_DIMENSION = 1024;

type UploadType = 'show' | 'profile';

async function uploadShowImage(imageId: string, filepath: string): Promise<void> {
  // .rotate() applies EXIF orientation before it is stripped
  const source = sharp(filepath).rotate();
  const [original, tile, detail] = await Promise.all([
    source.clone().jpeg({ quality: 90 }).toBuffer(),
    source.clone().resize(200, 200, { fit: 'cover' }).jpeg({ quality: 90 }).toBuffer(),
    source.clone().resize(640, 640, { fit: 'cover' }).jpeg({ quality: 90 }).toBuffer(),
  ]);
  // Must match the key layout in app/utils/imageUrls.ts and the iOS app's ImageHost
  await Promise.all([
    putImmutableJpeg(R2_SHOW_IMAGES_BUCKET, `shows/${imageId}.jpeg`, original),
    putImmutableJpeg(R2_SHOW_IMAGES_BUCKET, `shows/${imageId}_200x200.jpeg`, tile),
    putImmutableJpeg(R2_SHOW_IMAGES_BUCKET, `shows/${imageId}_640x640.jpeg`, detail),
  ]);
}

async function uploadProfilePic(imageId: string, filepath: string): Promise<void> {
  const image = await sharp(filepath)
    .rotate()
    .resize(PROFILE_PIC_MAX_DIMENSION, PROFILE_PIC_MAX_DIMENSION, { fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: 90 })
    .toBuffer();
  await putImmutableJpeg(R2_PROFILE_PICS_BUCKET, `${imageId}.jpeg`, image);
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

    const form = formidable({ multiples: false, maxFileSize: MAX_FILE_SIZE });

    // Parse the form data
    const [fields, files] = await new Promise<[formidable.Fields, formidable.Files]>((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        else resolve([fields, files]);
      });
    });

    const type = fields.type?.[0] as UploadType | undefined;
    if (type !== 'show' && type !== 'profile') {
      return res.status(400).json({ error: 'type must be "show" or "profile"' });
    }

    // Check if an image was uploaded
    const imageFile = files.image?.[0];
    if (!imageFile) {
      return res.status(400).json({ error: 'No image found in request' });
    }

    // The UUID is what gets stored in show.pictureUrl / user.profilePhotoURL
    const imageId = uuidv4();
    if (type === 'show') await uploadShowImage(imageId, imageFile.filepath);
    else await uploadProfilePic(imageId, imageFile.filepath);

    res.status(200).json({
      success: true,
      imageId: imageId,
    });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ error: 'Failed to upload image' });
  }
}
