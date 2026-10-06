import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  root: '.',
  test: {
    environment: 'jsdom',
    setupFiles: './test/setup.js',
    include: ['test/**/*.test.{js,jsx}'],
    coverage: {
      provider: 'v8',
      reportsDirectory: './coverage',
      reporter: ['text', 'lcov'],
      include: ['src/views/{AdminLogin,Dashboard,Gallery,ExhibitView,QRCodeModal,PosterView,CanvasEditor}.jsx', 'src/components.jsx/QRCodeModal.jsx'],
      exclude: ['src/views/UploadWizard.jsx'],
    },
  },
})
