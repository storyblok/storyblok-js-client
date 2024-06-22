<script setup>
import StoryblokClient from 'storyblok-js-client'
const story = ref(null)
const client = new StoryblokClient({ accessToken: 'OurklwV5XsDJTIE1NJaD2wtt' })

const { data } = await client.get('cdn/stories/vue/test', {
	version: 'draft',
})

story.value = data.story

// onMounted(() => {
//   setTimeout(async () => {
//     const { data } = await client.get("cdn/stories/vue/test", {
//       version: "draft",
//     });

//     story.value = data.story;
//   }, 2000);
// });
</script>

<template>
	<div>
		<pre><code>{{story}}</code></pre>
	</div>
</template>
