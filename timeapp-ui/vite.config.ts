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
    const isProd  = mode === 'production';
    
    // Debug environment variables in development
    if (isLocal) {
        console.log('Environment variables loaded:', {
            VITE_BACKEND_API_URL: env.VITE_BACKEND_API_URL,
            VITE_VPUBLIC_KEY: env.VITE_VPUBLIC_KEY,
            BACKEND_URL: env.BACKEND_URL,
            VPUBLIC_KEY: env.VPUBLIC_KEY
        });
    }

    // HTTPS config for local development
    const httpsConfig = isLocal
        ? {
            key:  fs.readFileSync(path.resolve(__dirname, 'certs/chrona-frontend.com-key.pem')),
            cert: fs.readFileSync(path.resolve(__dirname, 'certs/chrona-frontend.com.pem')),
        }
        : undefined;

    return {
        plugins: [
            react(),
            tailwindcss(),
            // local HTTPS with mkcert
            isLocal && mkcert(),

            // PWA plugin
            isProd &&
            VitePWA({
                registerType:   'autoUpdate',
                injectRegister: 'auto',           // inject SW registration script
                strategies:     'injectManifest', // keep your custom sw.js
                srcDir:         'src',
                filename:       'sw.js',
                includeAssets: ['favicon.svg', 'robots.txt'],

                manifest: {
                    name:            'Chrona Time App',
                    short_name:      'Chrona',
                    start_url:       '/',
                    scope:           '/',
                    display:         'standalone',
                    background_color:'#ffffff',
                    theme_color:     '#0f172a',
                    icons: [
                        {
                            src:     '/assets/img/clock_144x144.png',
                            sizes:   '144x144',
                            type:    'image/png',
                            purpose: 'any',
                        },
                        {
                            src:     '/assets/img/clock_512x512.svg',
                            sizes:   '512x512',
                            type:    'image/svg+xml',
                            purpose: 'any',
                        },
                    ],
                    screenshots: [
                        {
                            src:         '/assets/img/clock_1280x720.svg',
                            sizes:       '1280x720',
                            type:        'image/svg+xml',
                            form_factor: 'wide',
                        },
                        {
                            src:         '/assets/img/clock_375x667.svg',
                            sizes:       '375x667',
                            type:        'image/svg+xml',
                            form_factor: 'narrow',
                        },
                    ],
                },

                workbox: {
                    globPatterns: ['**/*.{js,css,html,png,svg,webmanifest}'],
                    globIgnores:  ['**/node_modules/**/*', 'workbox-*.js'],
                    manifestTransforms: [
                        async (entries) => {
                            const seen = new Set<string>();
                            const deduped = entries.filter((e) => {
                                const url = e.url.split('?')[0];
                                if (seen.has(url)) return false;
                                seen.add(url);
                                return true;
                            });
                            return { manifest: deduped };
                        },
                    ],
                },
            }),
        ].filter(Boolean),

        // Local dev server with HTTPS
        server: isLocal
            ? {
                https:    httpsConfig,
                host:     'chrona-frontend.com',
                watch:    { usePolling: true },
                strictPort: true,
            }
            : undefined,

            // Env-injected globals
    define: {
        BACKEND_APP_URL:  JSON.stringify(env.VITE_BACKEND_API_URL || env.BACKEND_URL || ''),
        VAPID_PUBLIC_KEY: JSON.stringify(env.VITE_VPUBLIC_KEY || env.VPUBLIC_KEY || ''),
    },
    };
});
