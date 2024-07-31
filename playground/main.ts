import StoryblokClient, { RichtextResolver, RichtextSchema } from '../'

const client = new StoryblokClient({})

// TODO: Remove when deprecation of `RichtextResolver` is done
console.log(new RichtextResolver().render())