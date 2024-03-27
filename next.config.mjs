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
      return config;
   },
};

export default nextConfig;
