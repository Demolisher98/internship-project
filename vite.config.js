import { defineConfig } from 'vite'
import basicSsl from '@vitejs/plugin-basic-ssl'
import { qrcode } from 'vite-plugin-qrcode' // <-- Import the plugin

export default defineConfig({
  base: '/internship-project/',
  plugins: command === 'serve' ? [basicSsl(), qrcode()] : [],
  server: {
    host: true,
    port: 5173
  }
})