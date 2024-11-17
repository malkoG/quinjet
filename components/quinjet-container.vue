<script setup lang="ts">
import ProfileColumn from '~/components/profile-column.vue'
import NotificationColumn from './notification-column.vue';

defineProps({
  hideNotifications: {
    type: Boolean,
    default: false,
  },
  hideComposeButton: {
    type: Boolean,
    default: false,
  },
});

const handleComposeClick = () => {
  location.href = '/compose';
}
</script>

<template>
  <div class="container mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4">
    <div id="profile" class="md:col-span-1">
      <ProfileColumn />
    </div>
    <div id="feed" class="col-span-2">
      <slot />
    </div>
    <template v-if="!hideNotifications">
      <div id="notifications" class="hidden lg:block lg:col-span-1">
        <NotificationColumn />
      </div>
    </template>
  </div>

  <div class="fixed w-full h-screen left-0 top-0 z-10">
    <div class="container mx-auto h-full relative">
      <button v-if="!hideComposeButton"
        class="absolute bottom-4 right-4 w-14 h-14 rounded-full bg-indigo-100 text-white flex items-center justify-center shadow-lg hover:bg-indigo-600"
        @click="handleComposeClick">
        <i class="pi pi-camera text-white text-2xl"></i>
      </button>
    </div>
  </div>
</template>
