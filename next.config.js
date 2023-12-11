/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        minimumCacheTTL: 60 * 60 * 24 * 1, // 1 day
    },
}

module.exports = nextConfig
