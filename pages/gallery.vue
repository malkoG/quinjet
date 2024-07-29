<script setup lang="ts">
import { createRestAPIClient } from 'masto';
import { useStatus } from '~/hooks/statuses'

const masto = createRestAPIClient({
	url: 'https://pixelfed.social'
})

const result = await useStatus('713777587527607174')
</script>
<template>
  <div v-for="attachment in result.mediaAttachments">
	<div class="card bg-base-100 w-96 shadow-xl">
	  <figure>
		<img
		  :src="attachment.url || ''"
		  alt="Shoes" />
	  </figure>
	  <div class="card-body">
	    <p>{{ result.content }}</p>
		<div class="card-actions justify-end">
		</div>
	  </div>
	</div>
  </div>
</template>
