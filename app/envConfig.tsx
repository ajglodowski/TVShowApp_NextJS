export const imageUrlBase = process.env.IMAGE_BASE_URL;
export const baseURL = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : 'http://localhost:3000';