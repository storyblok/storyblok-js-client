import StoryblokClient, { ISbCache } from 'storyblok-js-client'
import { ISbStoryData } from '../../src/interfaces'
import { get, getAll, set, flush } from '@/lib/redis'
import { NextPageContext } from 'next'

type HomePageProps = {
  story: ISbStoryData[],
}

export default function Home({ story }: HomePageProps) {
  return (
    <div>
      <pre><code>{ JSON.stringify(story, null, 2) }</code></pre>
    </div>

  )
}

export async function getServerSideProps(context: NextPageContext) {
  const { query } = context
  const config = {
    accessToken: "OurklwV5XsDJTIE1NJaD2wtt",
    cache: {
      type: "custom",
      clear: "auto",
      custom: { get, getAll, set, flush },
    } as ISbCache
  }

  const client = new StoryblokClient(config)

  const { data } = await client.get("cdn/stories", {
    version: query.version === 'draft' ? "draft" : "published",
    by_slugs: "vue/,svelte/",
  });

  // Pass data to the page via props
  return { props: { story: data.stories } }
}
