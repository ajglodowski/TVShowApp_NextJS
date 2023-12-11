/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'firebasestorage.googleapis.com',
                port: '',
                pathname: '/v0/b/tv-show-app-602d7.appspot.com/o/**',
            },
        ],
        minimumCacheTTL: 60 * 60 * 24 * 1, // 1 day
    },
}

module.exports = nextConfig
