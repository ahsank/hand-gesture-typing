import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    host: true, // Allow external connections
    port: 3000,
    https: false, // Set to true if you need HTTPS for camera access
    open: true,
    headers: {
      // Required for SharedArrayBuffer (needed by MediaPipe WASM)
      'Cross-Origin-Embedder-Policy': 'require-corp',
      'Cross-Origin-Opener-Policy': 'same-origin'
    }
  },
  build: {
    target: 'esnext',
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          mediapipe: ['@mediapipe/tasks-vision']
        }
      }
    }
  },
  optimizeDeps: {
    include: ['@mediapipe/tasks-vision'],
    exclude: [] // Don't exclude MediaPipe
  },
  define: {
    // Define any global constants if needed
    __DEV__: JSON.stringify(process.env.NODE_ENV === 'development')
  },
  // Handle WASM files properly
  assetsInclude: ['**/*.wasm']
})
