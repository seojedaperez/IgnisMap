import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: process.env.NODE_ENV === 'production' ? '/IgnisMap/' : '/',
  plugins: [
    react({
      jsxRuntime: 'automatic'
    }),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'IgnisMap - Predicción de Incendios',
        short_name: 'IgnisMap',
        description: 'Aplicación para predicción y monitoreo de incendios forestales',
        theme_color: '#dc2626',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/IgnisMap/',
        start_url: '/IgnisMap/',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\.open-meteo\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'weather-api-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24
              }
            }
          },
          {
            urlPattern: /^https:\/\/atlas\.microsoft\.com\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'azure-maps-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 2
              }
            }
          }
        ]
      }
    })
  ],
  build: {
    target: 'esnext',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    },
    rollupOptions: {
      external: [
        '@azure/core-tracing',
        './globalThis-utils',
        /^@azure\//
      ],
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['lucide-react', 'clsx'],
          'map-vendor': ['leaflet', 'react-leaflet', 'leaflet-draw', 'react-leaflet-draw'],
          'chart-vendor': ['recharts'],
          'geo-vendor': ['geotiff', 'proj4', 'turf', 'ml-matrix'],
          'emergency-services': [
            'src/services/emergencyAnalysisService.ts',
            'src/services/azureService.ts',
            'src/services/azureMapsService.ts'
          ],
          'data-services': [
            'src/services/planetaryComputerService.ts',
            'src/services/weatherService.ts',
            'src/services/windAnalysisService.ts',
            'src/services/biodiversityAssessmentService.ts'
          ],
          'tactical-components': [
            'src/components/TacticalMapVisualization.tsx',
            'src/components/TacticalPlanPanel.tsx',
            'src/components/FireAnalysisPanel.tsx'
          ]
        },
        chunkFileNames: (chunkInfo) => {
          return `js/[name]-[hash].js`
        }
      }
    },
    chunkSizeWarningLimit: 1000
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'leaflet',
      'react-leaflet'
    ],
    exclude: [
      '@azure/cognitiveservices-computervision',
      '@azure/core-tracing',
      '@azure/ai-text-analytics',
      'geotiff'
    ]
  },
  define: {
    global: 'globalThis'
  },
  resolve: {
    alias: {
      './globalThis': 'globalThis',
      './globalThis-utils': 'globalThis'
    }
  }
})
