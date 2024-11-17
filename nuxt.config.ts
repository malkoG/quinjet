import Aura from '@primevue/themes/aura';
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  devtools: { enabled: true },
  modules: [
    "@nuxtjs/tailwindcss",
    '@pinia/nuxt',
    '@primevue/nuxt-module'
  ],
  primevue: {
    options: {
      ripple: true,
      inputVariant: 'filled',
      theme: {
        preset: Aura,
        options: {
          prefix: 'p',
          darkModeSelector: 'system',
          cssLayer: false
        }
      }
    }
  },
  compatibilityDate: "2024-07-03",
  app: {
    head: {
      script: [
        {
          src: "https://unpkg.com/@material-tailwind/html@latest/scripts/dialog.js",
          async: true,

          tagPosition: "bodyClose",
        },
        {
          src: "https://unpkg.com/@material-tailwind/html@latest/scripts/ripple.js",
          async: true,
          tagPosition: "bodyClose",
        }

      ]
    }
  },
})
