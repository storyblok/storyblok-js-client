import StoryblokClient from '../'
const spaceId = 67647

let Storyblok = new StoryblokClient({
  oauthToken: process.env.VITE_OAUTH_TOKEN,
})

for (var i = 0; i < 26; i++) {
  Storyblok.post(`spaces/${spaceId}/stories`, {
    story: { name: 'Testcontent ' + i, slug: 'testcontent-' + i },
  })
}
