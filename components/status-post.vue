<script setup lang="ts">
import { Carousel, Slide } from 'vue3-carousel'
import { AspectRatio } from 'radix-vue';

import type { Status } from '~/models/status';

const props = defineProps({
  status: {
    type: Object as PropType<Status>,
    required: true,
  },
})
</script>

<template>
  <div class="w-full py-12">
    <div class="bg-gray-700">
      <AspectRatio :ratio="1">
        <div class="w-full h-full flex justify-center items-center">
          <div class="bg-base-100 w-full h-full shadow-xl">
            <carousel :items-to-show="1">
              <slide v-for="attachment in status.mediaAttachments" :key="attachment.url">
                <img class="w-full" :src="attachment.url || ''" />
              </slide>
            </carousel>
          </div>
        </div>
      </AspectRatio>
    </div>
    <div class="card-body">
      <div v-html="status.content"></div>
      <div class="card-actions justify-end">
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.carousel {
  width: 100%;
  height: 100%;

  &__viewport {
    width: 100%;
    height: 100%;
    vertical-align: middle;
  }

  &__track {
    width: 100%;
    height: 100%;
  }

  &__slide {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  &__next,
  &__prev {
    display: none;
  }
}
</style>
