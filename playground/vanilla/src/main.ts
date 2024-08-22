import StoryblokClient from 'storyblok-js-client'
import RichTextResolver from 'storyblok-js-client/richTextResolver'
import './style.css'

// 2. Initialize the client with the preview token
// from your space dashboard at https://app.storyblok.com
const Storyblok = new StoryblokClient({
  accessToken: import.meta.env.VITE_ACCESS_TOKEN as string,
})

try {
  const result = await Storyblok.get('cdn/stories/', {
    version: 'draft',
  })
  const resolver = new RichTextResolver()
  
  const paragraph = {
    type: 'paragraph',
    content: [
      {
        text: 'Bold and italic',
        type: 'text',
        marks: [{ type: 'bold' }, { type: 'italic' }],
      },
    ],
  }

  const html = resolver.render(paragraph)

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


