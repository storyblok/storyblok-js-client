<template>
  <div>
    <span data-test="stories">{{ result }}</span>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import StoryblokJSClient from "../";

const { options } = defineProps({ options: Object });
let result = ref(0);

onMounted(async () => {
  const Storyblok = new StoryblokJSClient(options);
  const { data } = await Storyblok.get("cdn/stories");
  result.value = data.stories.length;
});
</script>
