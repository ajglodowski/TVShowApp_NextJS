'use server';

import sharp from 'sharp';
import { cacheLife } from 'next/dist/server/use-cache/cache-life';
import { getShowImageUrl } from '@/app/utils/imageUrls';

export async function getAverageColorAction(imageId: string): Promise<string | null> {
    'use cache'
    cacheLife('days');
    try {
        if (!imageId) {
            console.error('imageId is required for getAverageColorAction');
            return null;
        }

        const response = await fetch(getShowImageUrl(imageId, 'tile'));
        if (!response.ok) {
            // It might be valid for an image not to exist, return null instead of throwing
            console.error(`Show image ${imageId} could not be fetched: ${response.status}`);
            return null;
        }

        const buffer = Buffer.from(await response.arrayBuffer());
        const { data } = await sharp(buffer)
          .resize(1, 1)
          .raw()
          .toBuffer({ resolveWithObject: true });
        const averageColor = `rgb(${data[0]},${data[1]},${data[2]})`;
        return averageColor;
    } catch (error) {
        console.error('Error getting average color in Server Action:', error);
        return null;
    }
}
