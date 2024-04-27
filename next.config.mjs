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
   images: {
      remotePatterns: [
         {
            protocol: "https",
            hostname: "silver-patient-falcon-52.mypinata.cloud",
            pathname: "**",
         },
      ],
   },
};

export default nextConfig;
