<script setup lang="ts">

import { useStatus } from "~/hooks/statuses";
import StatusPost from "~/components/status-post.vue";
import type { Status } from "~/models/status";

const result = await useStatus("713777587527607174") as Status;
</script>
<template>
  <status-post :status="result" />
</template>
