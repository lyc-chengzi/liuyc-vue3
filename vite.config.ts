import { fileURLToPath, URL } from 'node:url';
import { resolve } from 'node:path';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue(), vueJsx()],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./packages', import.meta.url))
        }
    },
    build: {
        lib: {
            entry: resolve(__dirname, 'packages/liuyc-vue/src/index.ts'),
            name: 'liuyc-vue',
            fileName: 'liuyc-vue'
        },
        outDir: resolve(__dirname, 'packages/liuyc-vue/dist'),
        rollupOptions: {
            external: ['vue'],
            output: {
                globals: {
                    vue: 'Vue'
                }
            }
        }
    }
});
