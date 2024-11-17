<script lang="ts" setup>

import { ref, onMounted, onUnmounted } from 'vue';

const menuVisible = ref(false);

const toggleMenu = () => {
  menuVisible.value = !menuVisible.value;
};

const handleClickOutside = (e: MouseEvent) => {
  const target = e.target as HTMLElement;
  if (!target.closest('.relative')) {
    menuVisible.value = false;
  }
};

onMounted(() => {
  window.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  window.removeEventListener('click', handleClickOutside);
});

</script>

<template>
  <header class="container mx-auto flex justify-between items-center text-lg font-black py-12 relative">
    <a href="/">
      <span class="text-4xl">
        🚀
      </span>
      <span class="text-3xl text-black">
        Quinjet
      </span>
    </a>

    <div class="flex justify-end items-center">
      <span class="text-4xl mr-4">
        🔔
      </span>

      <div>
        <a @click="toggleMenu" class="relative focus:outline-none text-4xl">
          🤔
        </a>
        <div v-if="menuVisible"
          class="absolute right-0 mt-4 w-48 bg-white rounded-md shadow-lg py-2 border-gray-200 border">
          <a href="#" class="block px-4 py-2 text-gray-800 hover:bg-gray-200">Profile</a>
          <a href="#" class="block px-4 py-2 text-gray-800 hover:bg-gray-200">Logout</a>
        </div>
      </div>
    </div>
  </header>
</template>
