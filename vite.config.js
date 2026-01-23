import { defineConfig } from 'vite';
import path from 'path';
import fs from 'fs';

function getJsEntries(dir) {
  const entries = {};
  const files = fs.readdirSync(dir);

  for (const file of files) {
    if (file.endsWith('.js') && !file.includes('config')) {
      const name = path.parse(file).name;
      entries[name] = path.resolve(dir, file);
    }
  }

  return entries;
}

export default defineConfig(({ mode }) => {
    let base = './'; // default for development
  
    if (mode === 'staging') {
        base = 'https://3200kelvin.github.io/IWC/dist/';
    } else if (mode === 'production') {
        base = 'https://www.iwcglobal.net/app/';
    }

    console.log(base);

    return {
        base,
        server: {
            fs: {
                allow: ['.'], // allow serving files from project root
            },
            cors: true, // Enable CORS for all origins (or customize below)
            headers: {
                'Access-Control-Allow-Origin': '*', // or restrict to Webflow origin
                'Access-Control-Allow-Methods': 'GET,OPTIONS',
                'Access-Control-Allow-Headers': '*',
            },
        },
        build: {
            rollupOptions: {
                input: getJsEntries(path.resolve(__dirname, './')), // or './' for root
                output: {
                    entryFileNames: '[name].js',
                    chunkFileNames: '[name].js',
                    assetFileNames: '[name][extname]',
                },
            },
        },
    };
});
