<script setup lang="ts">
import { defineProps } from 'vue';

import type { Account } from '~/models/account';

const props = defineProps({
  account: {
    type: Object as PropType<Account>,
    required: true,
  },
});
</script>

<template>
  <!-- stretched inside flex --->
  <div class="grid grid-cols-3">
    <div class="col-span-1 text-center">
      <div class="text-3xl font-black">{{ account.statusesCount }}</div>
      <div class="text-md text-gray-500">Posts</div>
    </div>
    <div class="col-span-1 text-center">
      <div class="text-3xl font-bold">{{ account.followersCount }}</div>
      <div class="text-md text-gray-500">Followers</div>
    </div>
    <div class="col-span-1 text-center">
      <div class="text-3xl font-bold">{{ account.followingCount }}</div>
      <div class="text-md text-gray-500">Following</div>
    </div>
  </div>
</template>
