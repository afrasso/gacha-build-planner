/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    esmExternals: false, // Disable ESM Externals for better compatibility with mocks
  },
  async headers() {
    return [
      {
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Access-Control-Allow-Methods", value: "GET,DELETE,PATCH,POST,PUT" },
          {
            key: "Access-Control-Allow-Headers",
            value:
              "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
          },
        ],
        source: "/api/:path*",
      },
    ];
  },
  images: {
    domains: ["static.wikia.nocookie.net"],
  },
  reactStrictMode: false, // Disable React Strict Mode for testing
};

export default nextConfig;
