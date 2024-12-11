import { NextApiRequest, NextApiResponse } from 'next/types';
import sharp from 'sharp';

const colorCache = new Map<string, string>();

async function getAverageColor(imageUrl: string): Promise<string> {
    if (colorCache.has(imageUrl)) {
        return colorCache.get(imageUrl) as string;
    }
    const defaultColor = 'rgb(0,0,0)';
    const response = await fetch(imageUrl);
    if (response.status !== 200) return defaultColor;
    const imageBuffer = await response.arrayBuffer();
    // Use sharp to resize the image to 1x1 and get the RGB values
    const { data } = await sharp(Buffer.from(imageBuffer))
      .resize(1, 1)
      .raw()
      .toBuffer({ resolveWithObject: true });
    const averageColor = `rgb(${data[0]},${data[1]},${data[2]})`;
    colorCache.set(imageUrl, averageColor);
    return averageColor;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    const imageUrl = req.query.imageUrl as unknown as string;
    const averageColor = await getAverageColor(imageUrl);
    res.setHeader('Cache-Control', 'public, max-age=600, s-maxage=600, stale-while-revalidate=120');
    res.status(200).json({ averageColor });
}
