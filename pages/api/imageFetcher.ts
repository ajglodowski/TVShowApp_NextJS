import { imageUrlBase } from '@/app/envConfig';
import { NextApiRequest, NextApiResponse } from 'next';
import fetch from 'node-fetch';

const BASE_URL = imageUrlBase;

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    // time stamp for request start
    const imageName = req.query.imageName as unknown as string;

    // Validate the image name to prevent misuse
    /*
    if (!imageName || typeof imageName !== 'string' || /[<>:"/\\|?*]/.test(imageName)) {
        res.status(400).json({ error: 'Invalid image name' });
        return;
    }
        */

    const imageUrl = `${BASE_URL}${encodeURIComponent(imageName)}`;

    try {
        // Fetch the image from the constructed URL
        const response = await fetch(imageUrl);

        if (!response.ok) {
            res.status(response.status).json({ error: 'Failed to fetch image' });
            return;
        }

        // Read the response as a buffer to calculate Content-Length
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const contentType = response.headers.get('content-type') || 'application/octet-stream';

        // Set appropriate headers
        res.setHeader('Content-Type', contentType);
        res.setHeader('Content-Length', buffer.length.toString());
        res.setHeader('Cache-Control', 'public, max-age=600, s-maxage=600, stale-while-revalidate=120'); // Optional: Add caching for performance

        // Send the buffer
        res.status(200).send(buffer);
    } catch (error) {
        console.error('Error fetching image:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
