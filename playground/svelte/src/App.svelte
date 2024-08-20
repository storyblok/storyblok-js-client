<script lang="ts">
  import { onMount } from "svelte";
  import StoryblokClient from "storyblok-js-client";

  let story = null;
  let client = new StoryblokClient({ accessToken: "OurklwV5XsDJTIE1NJaD2wtt"})

  onMount(async () => {
    const { data } = await client.get("cdn/stories/svelte", {
      version: "draft",
    });
    story = data.story;
  });
</script>

<div>
  <pre><code>{ JSON.stringify(story, null, 2) }</code></pre>
</div>

<style>
  :root {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
      Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  }
</style>
