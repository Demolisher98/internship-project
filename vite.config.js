import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react' // or '@vitejs/plugin-react-swc' if using react
import basicSsl from '@vitejs/plugin-basic-ssl'
import { qrcode } from 'vite-plugin-qrcode'

// 💡 NOTICE the ({ command }) parameters inside the defineConfig call below
export default defineConfig(({ command }) => {
  return {
    base: '/internship-project/',
    plugins: command === 'serve' ? [react(), basicSsl(), qrcode()] : [react()],
  }
})