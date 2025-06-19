import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import mkcert from 'vite-plugin-mkcert';
import { fileURLToPath } from 'url';
import tailwindcss from "@tailwindcss/vite";

// Emulate __dirname in ESM
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
    const env = { ...process.env, ...loadEnv(mode, process.cwd()) };
    const isLocal = env.LOCAL === 'true';

    console.log('isLocal:', isLocal);
    // for Local development only - we want to servee on https
    const httpsConfig = isLocal
        ? {
            key: fs.readFileSync(path.join(__dirname, 'certs/chrona-frontend.com-key.pem')),
            cert: fs.readFileSync(path.join(__dirname, 'certs/chrona-frontend.com.pem')),
        }
        : undefined;

    return {
        base: "./",
        build: {
            outDir: "dist",
            sourcemap: true,
        },
        plugins: [
            react(),
            tailwindcss(),
            isLocal && mkcert()
        ].filter(Boolean),
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
        },
    };
});
