<script setup lang="ts">
import { AspectRatio } from 'radix-vue';
import { defineProps } from 'vue';

import type { Status } from '~/models/status';

const props = defineProps({
  status: {
    type: Object as PropType<Status>,
    required: true,
  },
});
</script>

<template>
  <div class="bg-gray-700">
    <AspectRatio :ratio="1">
      <div class="w-full h-full flex justify-center items-center object-contain">
        <div class="bg-base-100 w-full h-full flex justify-center items-center rounded-sm">
          <img :src="status.mediaAttachments[0].url" alt="status thumbnail" class="object-contain h-full" />
        </div>
      </div>
    </AspectRatio>
  </div>
</template>
