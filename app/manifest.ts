import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "XBanka",
    short_name: "XBanka",
    description: 'A Progressive Web App built with Next.js',
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#000000",
    icons: [
      {
        src: "/favicon-square.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/favicon-square.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}