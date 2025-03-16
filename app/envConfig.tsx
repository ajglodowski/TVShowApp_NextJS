const prodUrl = 'https://tv-show-app-next-js.vercel.app';
const localUrl = 'http://localhost:3000';
const isProd = process.env.VERCEL_ENV === 'production' || process.env.NEXT_PUBLIC_VERCEL_ENV === 'production';
export const serverBaseURL = isProd ? prodUrl : localUrl;
export const apiRoute = isProd ? prodUrl : ''; 
export const clientBaseURL = isProd ? '' : localUrl;