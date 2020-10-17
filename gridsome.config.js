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
  plugins: []
}
