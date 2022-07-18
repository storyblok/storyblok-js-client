import type { NavigationGuard } from 'vue-router'
export type MiddlewareKey = string
declare module "/Users/alexjm/WebDev/@storyblok/storyblok-js-client/znuxt3-playground/node_modules/nuxt/dist/pages/runtime/composables" {
  interface PageMeta {
    middleware?: MiddlewareKey | NavigationGuard | Array<MiddlewareKey | NavigationGuard>
  }
}