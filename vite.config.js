import { defineConfig } from 'vite';
import path from 'path';
import react from '@vitejs/plugin-react';

// Simple alias setup for the src folder
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // eslint-disable-next-line no-undef
      '@': path.resolve(__dirname, 'src'), // Resolve the @ alias to the src folder
    },
  },
});

