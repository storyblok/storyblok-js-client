import StoryblokClient from 'storyblok-js-client'
import './style.css'

const headers = new Headers()
headers.append('Awiwi', 'Awiwi')
const headers2 = {
  Awiwi: 'Awiwi',
}
console.log(headers2.constructor.name)
// 2. Initialize the client with the preview token
// from your space dashboard at https://app.storyblok.com
const Storyblok = new StoryblokClient({
  accessToken: import.meta.env.VITE_ACCESS_TOKEN as string,
  headers,
  inlineAssets: true,
})

try {
  const result = await Storyblok.get('cdn/stories/', {
    version: 'draft',
    resolve_relations: 'root.author',
    resolve_assets: 1,
  })

  document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <pre>
    <code>
      ${JSON.stringify(result, null, 2)}
    </code>
  </pre>
`
} catch (error) {
  console.error(error)
}
