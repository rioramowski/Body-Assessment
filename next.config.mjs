/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async headers() {
    return [
      {
        // Allows the booking widget embedded on the external GHL-hosted
        // /apply page (polarity-fitness.com) to call these routes from the
        // browser. Hardcoded to the one real origin, never dynamically
        // reflected, and never paired with credentials: these routes carry
        // no cookies/session, so there is no ambient credential for a CORS
        // misconfiguration to expose.
        source: "/api/booking/:path*",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "https://polarity-fitness.com" },
          { key: "Vary", value: "Origin" },
          { key: "Access-Control-Allow-Methods", value: "GET, POST, OPTIONS" },
          { key: "Access-Control-Allow-Headers", value: "Content-Type" },
        ],
      },
    ];
  },
};

export default nextConfig;
