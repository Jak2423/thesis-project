/** @type {import('next').NextConfig} */
const nextConfig = {
   webpack: (config) => {
      config.externals.push(
         "pino-pretty",
         "lokijs",
         "encoding",
         "canvas",
         "jsdom",
      );
      config.resolve.fallback = { fs: false, net: false, tls: false };
      return config;
   },
};

export default nextConfig;
