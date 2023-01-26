export default defineNuxtConfig({
  app: {
    head: {
      link: [
        {
          rel: 'icon',
          type: 'image/svg+xml',
          href: '/favicon.svg'
        }
      ]
    }
  },
  css: [
    '@/assets/css/global.css',
    '@/assets/css/themes.css',
    '@/assets/css/utils.css',
    '@/assets/css/prism.css',
    '@/assets/css/markdown.css',
    '@fortawesome/fontawesome-svg-core/styles.css',
    'katex/dist/katex.min.css'
  ],
  build: {
    transpile: [
      '@fortawesome/vue-fontawesome',
      '@fortawesome/fontawesome-svg-core',
      '@fortawesome/free-solid-svg-icons'
    ]
  }
});
