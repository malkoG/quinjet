<script setup lang="ts">

import StatusPost from "~/components/status-post.vue";
import type { Status } from "~/models/status";
import { createRestAPIClient } from "masto";

const masto = createRestAPIClient({
  url: "https://pixelfed.social",
  accessToken: sessionStorage.getItem("accessToken") as string,
});

const data = await masto.v1.statuses.$select("713777587527607174");
const result = await data.fetch() as Status;
console.log(result);
</script>
<template>
  <status-post :status="result" />
</template>
