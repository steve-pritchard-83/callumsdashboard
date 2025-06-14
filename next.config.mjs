/** @type {import('next').NextConfig} */
import withPWA from "next-pwa";

const isDevelopment = process.env.NODE_ENV === "development";

const nextConfig = withPWA({
  dest: "public",
  disable: isDevelopment,
})({
  // Your Next.js config
});

export default nextConfig; 