<script setup lang="ts">
import { Carousel, Slide } from 'vue3-carousel'

import type { Status } from '~/models/status';

const props = defineProps({
  status: {
    type: Object as PropType<Status>,
    required: true,
  },
})
</script>

<template>
  <div class="card bg-base-100 w-96 shadow-xl">
    <carousel :items-to-show="1">
      <slide v-for="attachment in status.mediaAttachments" :key="attachment.url">
        <img class="w-full" :src="attachment.url || ''" alt="Shoes" />
      </slide>
    </carousel>
  </div>
  <div class="card-body">
    <div v-html="status.content"></div>
    <div class="card-actions justify-end">
    </div>
  </div>
</template>

<style lang="scss">
.carousel {

  &__next,
  &__prev {
    display: none;
  }
}
</style>
