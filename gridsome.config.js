// This is where project configuration and plugin options are located.
// Learn more: https://gridsome.org/docs/config

// Changes here require a server restart.
// To restart press CTRL + C in terminal and run `gridsome develop`

module.exports = {
  siteName: 'Daily Mood Log',
  siteUrl: 'https://daily-mood-log.netlify.app/',
  icon: {
    favicon: './src/android-chrome-512x512.png',
    touchicon: './src/apple-touch-icon.png',
  },
  css: {
    loaderOptions: {
      scss: {
      }
    }
  },
  plugins: [
    {
      use: "gridsome-plugin-i18n",
      options: {
        locales: [ // locales list
          'fr',
          'fr-m',
          'fr-f'
        ],
        pathAliases: { // path segment alias for each locales
          'fr': 'fr',
          'fr-m': 'm',
          'fr-f': 'f',
        },
        fallbackLocale: 'fr', // fallback language
        defaultLocale: 'fr', // default language
        enablePathRewrite: true, // rewrite path with locale prefix, default: true
        rewriteDefaultLanguage: false, // rewrite default locale, default: true
        messages: {
          'fr': require('./src/locales/fr-fr.json'),
          'fr-m': require('./src/locales/fr-m.json'),
          'fr-f': require('./src/locales/fr-f.json')
        }
      }
    }
  ]
}
