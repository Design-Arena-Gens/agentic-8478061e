import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'RasaRoots Smart Canteen',
    short_name: 'RasaRoots',
    description:
      'Responsive smart canteen for Indian cuisine with personalised meal planning, loyalty, and cultural storytelling.',
    start_url: '/',
    display: 'standalone',
    background_color: '#FFF8E7',
    theme_color: '#FF7F50',
    icons: [
      {
        src: '/icons/icon-192x192.svg',
        sizes: '192x192',
        type: 'image/svg+xml'
      },
      {
        src: '/icons/icon-512x512.svg',
        sizes: '512x512',
        type: 'image/svg+xml'
      }
    ]
  };
}
