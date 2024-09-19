/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'res.cloudinary.com',
            port: '',
            pathname: '/**',
          },
          {
            protocol: 'https',
            hostname: 'cdn.dribbble.com',
            port: '',
            pathname: '/**',
          },
          {
            protocol: 'https',
            hostname: 'dribbble.com',
            port: '',
            pathname: '/**',
          },
        ],
      }
};

export default nextConfig;
