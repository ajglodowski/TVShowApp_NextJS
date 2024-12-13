export const imageUrlBase = process.env.IMAGE_BASE_URL;
export const serverBaseURL = process.env.VERCEL_ENV === 'production'
    ? 'https://tv-show-app-next-js.vercel.app'
    : process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : 'http://localhost:3000';
export const apiRoute = !!!process.env.NEXT_PUBLIC_VERCEL_URL ? '' : `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
export const clientBaseURL = !!!process.env.NEXT_PUBLIC_VERCEL_URL ? 'http://localhost:3000' : `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`