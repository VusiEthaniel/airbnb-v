import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import babel from 'vite-plugin-babel';

export default defineConfig({
  plugins: [
    react({
      jsxRuntime: 'automatic',
      include: ['**/*.js', '**/*.jsx', '**/*.ts', '**/*.tsx'],
    }),
    babel({
      babelConfig: {
        presets: ['@babel/preset-react'],
      },
      filter: /\.js$/, // Apply Babel only to .js files
    }),
  ],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },

  // <<<<< Add this block to enable API proxy >>>>>
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:4000',  // your backend server address
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
