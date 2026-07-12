/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true, // для сумісності зі статичним хостингом на Netlify
  },
};

module.exports = nextConfig;
