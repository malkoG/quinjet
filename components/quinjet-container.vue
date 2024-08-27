<template>
  <div class="container mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4">
    <div id="profile" class="md:col-span-1"></div>
    <div id="feed" class="col-span-2">
      <slot/>
    </div>
    <div id="notifications" class="hidden lg:block lg:col-span-1"></div>
  </div>
</template>
