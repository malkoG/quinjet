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
  <div class="status-post-wrapper py-6 px-4 border-2 rounded-xl mb-6 shadow-lg">
    <div class="status-post w-full">
      <div class="flex mb-4">
        <div class="avatar w-16 h-16">
          <img class="w-8 h-8 rounded-full" :src="status.account.avatar || ''" alt="avatar" />
        </div>
        <div class="ml-4">
          <a :href="`/profile/${status.account.id}`">
            <div class="font-bold">{{ status.account.displayName }}</div>
          </a>
          <a :href="`/profile/${status.account.id}`">
            <div class="text-sm text-gray-500">{{ status.account.acct }}</div>
          </a>
        </div>
      </div>
      <div class="bg-gray-700">
        <AspectRatio :ratio="1">
          <div class="w-full h-full flex justify-center items-center">
            <div class="bg-base-100 w-full h-full">
              <carousel :items-to-show="1">
                <slide v-for="attachment in status.mediaAttachments" :key="attachment.url">
                  <img class="w-full" :src="attachment.url || ''" />
                </slide>
              </carousel>
            </div>
          </div>
        </AspectRatio>
      </div>
      <div class="px-4 py-4 pt-8 whitespace-normal break-all">
        <div v-html="status.content"></div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.status-post-wrapper {
  width: 100%;
}

.status-post {
  max-width: 468px;
}

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
