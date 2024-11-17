// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  devtools: { enabled: true },
  modules: [
    "@nuxtjs/tailwindcss",
    '@pinia/nuxt',
  ],
  compatibilityDate: "2024-07-03",
  app: {
    head: {
      script: [
        {
          src: "https://unpkg.com/@material-tailwind/html@latest/scripts/dialog.js",
          async: true
        },
        {
          src: "https://unpkg.com/@material-tailwind/html@latest/scripts/ripple.js",
          async: true
        }

      ]
    }
  }
})
