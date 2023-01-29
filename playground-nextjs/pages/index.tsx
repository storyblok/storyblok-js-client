import StoryblokClient, { ISbCache } from 'storyblok-js-client'
import { ISbStoryData } from '../../src/interfaces'
import { get, getAll, set, flush } from '@/lib/redis'

type HomePageProps = {
  story: ISbStoryData,
}

export default function Home({ story }: HomePageProps) {
  return (
    <div>
      <pre><code>{ JSON.stringify(story, null, 2) }</code></pre>
    </div>

  )
}

export async function getServerSideProps() {
  const config = {
    accessToken: "OurklwV5XsDJTIE1NJaD2wtt",
    cache: {
      type: "custom",
      clear: "manual",
      custom: { get, getAll, set, flush },
    } as ISbCache
  }

  const client = new StoryblokClient(config)

  const { data } = await client.get("cdn/stories/svelte", {
    version: "published",
  });

  // Pass data to the page via props
  return { props: { story: data.story } }
}
