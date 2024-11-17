<script lang="ts" setup>
import NavBar from "~/components/nav-bar.vue";
</script>

<template>
  <div class="bg-white h-screen overflow-y-scroll px-8">
    <NavBar />
    <slot />
  </div>
</template>
