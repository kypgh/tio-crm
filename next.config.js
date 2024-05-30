/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  webpack: (config, options) => {
    config.module.rules.push({
      test: /\.(jpe?g|png|svg|gif|ico|eot|ttf|woff|woff2|mp4|pdf|webm|txt|xml)$/,
      type: "asset/resource",
      generator: {
        filename: "static/chunks/[path][name].[hash][ext]",
      },
    });

    return config;
  },
  async headers() {
    return [
      {
        source: "/:all*(svg|jpg|png)",
        locale: false,
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=63072000, must-revalidate",
          },
        ],
      },
    ];
  },
  swcMinify: true,
  reactStrictMode: false,
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
    domains: [],
  },
  images: {
    formats: ["image/avif", "image/webp"],
    domains: ["storage.googleapis.com"],
  },
  devIndicators: {
    buildActivityPosition: "bottom-left",
  },
};

module.exports = nextConfig;


