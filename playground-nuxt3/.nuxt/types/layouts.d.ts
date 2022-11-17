import { ComputedRef, Ref } from 'vue'
export type LayoutKey = string
declare module "/Users/alexjm/WebDev/@storyblok/storyblok-js-client/znuxt3-playground/node_modules/nuxt/dist/pages/runtime/composables" {
  interface PageMeta {
    layout?: false | LayoutKey | Ref<LayoutKey> | ComputedRef<LayoutKey>
  }
}