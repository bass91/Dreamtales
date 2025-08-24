// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  app: {
    head: {
      title: 'DreamTales',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Your journey into wonderful stories begins here.' }
      ]
    }
  },
  css: [
    'open-props/style',
    'open-props/normalize',
    'open-props/buttons',
    'open-props/sizes',
    'open-props/animations',
    'open-props/borders',
    'open-props/easings',
    'open-props/colors'
  ],
  typescript: {
    strict: true
  }
})
