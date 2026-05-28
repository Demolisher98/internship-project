import { defineConfig } from 'vite'
import basicSsl from '@vitejs/plugin-basic-ssl'
import { qrcode } from 'vite-plugin-qrcode'

export default defineConfig(({ command }) => {
  return {
    base: '/internship-project/',
    // Only load local development tools when running 'npm run dev' (serve)
    plugins: command === 'serve' ? [basicSsl(), qrcode()] : [],
  }
})