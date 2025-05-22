import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    host: true, // Allow external connections
    port: 3000,
    https: false, // Set to true if you need HTTPS for camera access
    open: true
  },
  build: {
    target: 'esnext',
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          mediapipe: ['@mediapipe/hands', '@mediapipe/drawing_utils']
        }
      }
    }
  },
  optimizeDeps: {
    include: ['@mediapipe/hands', '@mediapipe/drawing_utils']
  },
  define: {
    // Define any global constants if needed
    __DEV__: JSON.stringify(process.env.NODE_ENV === 'development')
  }
})
