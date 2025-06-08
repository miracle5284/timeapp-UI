import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import mkcert from 'vite-plugin-mkcert';
import { fileURLToPath } from 'url';
import tailwindcss from "@tailwindcss/vite";
import {VitePWA} from "vite-plugin-pwa";

// Emulate __dirname in ESM
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
    const env = { ...process.env, ...loadEnv(mode, process.cwd()) };
    const isLocal = env.LOCAL === 'true';

    console.log('isLocal:', isLocal);
    // for Local development only - we want to server on https
    const httpsConfig = isLocal
        ? {
            key: fs.readFileSync(path.join(__dirname, 'certs/chrona-frontend.com-key.pem')),
            cert: fs.readFileSync(path.join(__dirname, 'certs/chrona-frontend.com.pem')),
        }
        : undefined;

    return {
        plugins: [
            react(),
            tailwindcss(),
            isLocal && mkcert(),
            VitePWA({
                registerType: 'autoUpdate',
                includeAssets: ['favicon.svg', 'robots.txt'],
                manifest: {
                    name: 'Chrona Time App',
                    short_name: 'Chrona',
                    start_url: '/',
                    display: 'standalone',
                    background_color: '#ffffff',
                    theme_color: '#0f172a',
                    //scope: '/',
                    icons: [
                        {
                            src: '/assets/img/clock_144x144.png',
                            sizes: '144x144',
                            type: 'image/png',
                            purpose: "any"
                        },
                        {
                            src: '/assets/img/clock_512x512.svg',
                            sizes: '512x512',
                            type: 'image/svg',
                            purpose: "any"
                        },
                    ],
                    "screenshots": [
                        {
                            "src": "/assets/img/clock_1280x720.svg",
                            "sizes": "1280x720",
                            "type": "image/svg",
                            "form_factor": "wide"
                        },
                        {
                            "src": "/assets/img/clock_375x667.svg",
                            "sizes": "375x667",
                            "type": "image/svg",
                            "form_factor": "narrow"
                        }
                    ],

                    // shortcuts: [
                    //     {
                    //         name: "Start Timer",
                    //         url: "/timer/start",
                    //         icons: [{ src: "/icons/start.png", sizes: "192x192", type: "image/png" }]
                    //     },
                    //     {
                    //         name: "Dashboard",
                    //         url: "/dashboard",
                    //         icons: [{ src: "/icons/dashboard.png", sizes: "192x192", type: "image/png" }]
                    //     }
                    // ]

                },
                // srcDir: '',
                // filename: 'sw.js',
                // devOptions: {
                //     enabled: true, // allow in dev
                //     type: 'module',
                //     navigateFallback: '/', // disable fallback in dev
                // },
                // injectManifest: {
                //     swSrc: path.resolve(__dirname, 'src/sw.js'),
                //     swDest: 'sw.js',
                // },
                strategies: "injectManifest",
                srcDir: "src",
                filename: "sw.js",
                workbox: {
                    globPatterns: ['**/*.{js,css,html,png,svg,ico,ts,webmanifest}'],
                    globIgnores: ['**/node_modules/**/*', 'workbox-*.js'],
                    manifestTransforms: [
                            async (entries) => {
                                const deduped = entries.filter(
                                    e => !e.url.includes('?__WB_REVISION__')
                                );
                                return { manifest: deduped };
                            }
                        ]
                    }
            }),
        ],//.filter(Boolean),
        server: isLocal
            ? {
                https: httpsConfig,
                host: 'chrona-frontend.com',
                watch: {
                    usePolling: true,
                },
                strictPort: true,
            }
            : undefined,
        define: {
            BACKEND_APP_URL: JSON.stringify(env.BACKEND_URL),
            VAPID_PUBLIC_KEY: JSON.stringify(env.VPUBLIC_KEY),
        },
    };
});
