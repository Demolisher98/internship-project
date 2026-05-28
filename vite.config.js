import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Optimized for local development and error-free GitHub Pages deployment
export default defineConfig({
  base: '/internship-project/',
  plugins: [react()],
  server: {
    host: true,
    port: 5173
  }
})