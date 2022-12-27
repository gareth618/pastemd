export default defineNuxtConfig({
  css: [
    '@/assets/css/global.css',
    '@/assets/css/themes.css',
    '@/assets/css/utils.css',
    '@fortawesome/fontawesome-svg-core/styles.css'
  ],
  build: {
    transpile: [
      '@fortawesome/vue-fontawesome',
      '@fortawesome/fontawesome-svg-core',
      '@fortawesome/free-solid-svg-icons'
    ]
  }
});
