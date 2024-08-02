import StoryblokClient from 'storyblok-js-client'

export default async function Home() {
  const { data } = await fetchData()

  return (
    <div>
      <h1>Story: {data.story.content.headline}</h1>
    </div>
  )
}

export async function fetchData() {
  const storyblokApi = new StoryblokClient({
    accessToken: 'OurklwV5XsDJTIE1NJaD2wtt',
  })

  const res = await storyblokApi.get(
    `cdn/stories/home`,
    { version: 'draft' },
    {
      // cache: 'no-store',
      next: {
        revalidate: 3600,
      },
    }
  )
  const { date, etag } = res.headers as any

  console.log(date, etag)

  return res
}

/**
 * 1. When should we use `cache: no-store`?
 *  - Edit environments (preview, staging) always `no-store`
 *  - Prod environments -> can they revalidate the cache? either by time, or by new version of the page
 *
 * 2. How to revalidate the Next.js cache?
 *  - By time? YES
 *  - By version? YES - by generated etag
 *
 * 3. How to revalidate Next.js on demand WHEN a storyblok story has changed?
 *  - Webhooks
 *
 *
 * NEXT STEPS
 *  - Release this
 *     - Publish announcement of custom Fetch options (Discord, socials, etc)
 *     - Review conversations, GH issues, tickets, etc
 *     - (Alex) - give the go to Thiago, msg on SDK channels
 *     - (Chakit) - announcement and converstations
 *  - Knowledge share: Facundo (Alex record video)
 *  - What docs do we need? Check Manuel
 *     - Give per-env recommendations on last part UT tutorial
 */
