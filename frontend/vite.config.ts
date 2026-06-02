import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite' // This should now resolve!

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
})