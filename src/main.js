// This is the main.js file. Import global CSS and scripts here.
import BootstrapVue from 'bootstrap-vue'

import '~/assets/main.scss'

// The Client API can be used here. Learn more: gridsome.org/docs/client-api
import DefaultLayout from '~/layouts/Default.vue'

export default function (Vue, { router, head, isClient }) {
  Vue.component('Layout', DefaultLayout) // Set default layout as a global component
  Vue.use(BootstrapVue)
  head.meta.push({
    name: 'description',
    content: 'Welcome to the Daily Mood Log website'
  })
}
