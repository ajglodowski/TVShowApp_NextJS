import { NextApiRequest, NextApiResponse } from 'next/types';
import sharp from 'sharp';

const colorCache = new Map<string, string>();

async function getAverageColor(imageUrl: string, imageName: string): Promise<string> {
    const url = `${imageUrl}&imageName=${imageName}`;
    console.log("URL: " + url);
    const defaultColor = 'rgb(0,0,0)';
    console.log("Fetching image from: " + url);
    const response = await fetch(url);
    if (response.status !== 200) {
      console.log("Error: " + response.status);
      return defaultColor;
    }
    const imageBuffer = await response.arrayBuffer();
    const { data } = await sharp(Buffer.from(imageBuffer))
      .resize(1, 1)
      .raw()
      .toBuffer({ resolveWithObject: true });
    const averageColor = `rgb(${data[0]},${data[1]},${data[2]})`;
    console.log("Average color: " + averageColor);
    colorCache.set(url, averageColor);
    return averageColor;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    const imageUrl = req.query.imageUrl as unknown as string;
    const imageName = req.query.imageName as unknown as string;
    const averageColor = await getAverageColor(imageUrl, imageName);
    res.setHeader('Cache-Control', 'public, max-age=600, s-maxage=600, stale-while-revalidate=120');
    res.status(200).json({ averageColor });
}
