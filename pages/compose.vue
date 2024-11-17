<script setup lang="ts">
import { ref, computed } from "vue";
import { createRestAPIClient } from "masto";


import QuinjetContainer from "~/components/quinjet-container.vue";
import QuinjetPage from "~/components/quinjet-page.vue";

const attachments = ref(
  [] as { file: File; url: string; filterType: string; filterValue: number }[]
);
const content = ref<string>("");

// DND state
const dragOver = ref(false);

// Placeholder image URL
const placeholderImage = "https://via.placeholder.com/150?text=Upload+Image";

// Initialize Masto client
const masto = createRestAPIClient({
  url: "https://pixelfed.social",
  accessToken: sessionStorage.getItem("accessToken") as string,
});

// Handle file uploads
const onUploadAttachments = (files: FileList | null) => {
  if (files) {
    attachments.value = Array.from(files).map((file) => ({
      file,
      url: URL.createObjectURL(file),
      filterType: "",
      filterValue: 100,
    }));
  }
};

// Handle DND
const onDrop = (event: DragEvent) => {
  event.preventDefault();
  dragOver.value = false;
  if (event.dataTransfer?.files) {
    onUploadAttachments(event.dataTransfer.files);
  }
};

const submit = async () => {
  if (attachments.value.length === 0) return;

  // Convert filtered images to Blob using canvas
  const filteredFiles = await Promise.all(
    attachments.value.map((preview) => {
      return new Promise<File>((resolve) => {
        const img = new Image();
        img.src = preview.url;

        img.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;

          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.filter = `${preview.filterType}(${preview.filterValue}%)`;
            ctx.drawImage(img, 0, 0);

            canvas.toBlob((blob) => {
              if (blob) {
                const filteredFile = new File([blob], preview.file.name, {
                  type: preview.file.type,
                });
                resolve(filteredFile);
              }
            }, preview.file.type);
          }
        };
      });
    })
  );

  // Upload filtered files
  const mediaAttachments = await Promise.all(
    filteredFiles.map(async (file) => {
      const result = await masto.v1.media.create({
        file,
      });
      return result;
    })
  );

  const status = await masto.v1.statuses.create({
    mediaIds: mediaAttachments.map((media) => media.id),
    status: content.value,
  });

  location.href = "/";
};

// Handle drag and drop effects
const onDragOver = (event: DragEvent) => {
  event.preventDefault();
  dragOver.value = true;
};

const onDragLeave = () => {
  dragOver.value = false;
};
</script>

<template>
  <QuinjetPage>
    <QuinjetContainer>
      <!-- Drag-and-Drop Area -->
      <div class="p-4 border-2 border-dashed rounded-lg"
        :class="dragOver ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300'" @dragover="onDragOver"
        @dragleave="onDragLeave" @drop="onDrop">
        <div class="w-full h-64 flex items-center justify-center cursor-pointer" @click="$refs.fileInput.click()">
          <img :src="placeholderImage" alt="Upload Placeholder" class="w-32 h-32 object-cover" />
        </div>
        <input type="file" ref="fileInput" class="hidden" @change="(e) => onUploadAttachments(e.target.files)" multiple
          accept="image/*" />
      </div>

      <!-- Image Previews with Filters -->
      <div class="grid grid-cols-2 gap-4 mt-4">
        <div v-for="(preview, index) in attachments" :key="index"
          class="relative bg-white shadow-md rounded-lg overflow-hidden">
          <img :src="preview.url" :style="{ filter: `${preview.filterType}(${preview.filterValue}%)` }"
            class="w-full h-40 object-cover" alt="Image Preview" />
          <div class="p-2">
            <label class="block text-sm font-medium text-gray-700">Filter</label>
            <select
              class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              v-model="preview.filterType">
              <option value="">None</option>
              <option value="grayscale">Grayscale</option>
              <option value="sepia">Sepia</option>
              <option value="blur">Blur</option>
              <option value="brightness">Brightness</option>
            </select>
            <div v-if="preview.filterType !== ''" class="mt-2">
              <label class="block text-sm font-medium text-gray-700">Intensity</label>
              <input type="range" min="0" max="200" v-model="preview.filterValue"
                class="w-full mt-1 focus:ring-indigo-500 focus:border-indigo-500" />
            </div>
          </div>
        </div>
      </div>

      <!-- Caption Input -->
      <div class="mt-4">
        <label for="caption" class="block text-sm font-medium text-gray-700">Caption</label>
        <textarea v-model="content" id="caption" rows="4"
          class="mt-1 block w-full shadow-sm border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="Write a caption..."></textarea>
      </div>

      <!-- Upload Button -->
      <button class="mt-4 w-full bg-indigo-600 text-white font-bold py-2 px-4 rounded hover:bg-indigo-700"
        @click="submit">
        Upload
      </button>

      <div class="mb-3 flex gap-3">
        <button type="button" data-dialog-target="dialog-xs" data-riffle-light="true"
          class="rounded-md bg-slate-800 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ml-2">
          Open Dialog XS
        </button>
        <button v-ripple type="button" data-ripple-light="true"
          class="align-middle select-none font-sans font-bold text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-3 px-6 rounded-lg bg-gray-900 text-white shadow-md shadow-gray-900/10 hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none">
          Button
        </button>
        <div data-dialog-backdrop="dialog-xs" data-dialog-backdrop-close="true"
          class="pointer-events-none fixed inset-0 z-[999] grid h-screen w-screen place-items-center bg-black bg-opacity-60 opacity-0 backdrop-blur-sm transition-opacity duration-300">
          <div data-dialog="dialog-xs" class="relative m-4 p-4 w-1/4 rounded-lg bg-white shadow-sm">
            <div class="flex shrink-0 items-center pb-4 text-xl font-medium text-slate-800">
              Its a simple dialog.
            </div>
            <div class="relative border-t border-slate-200 py-4 leading-normal text-slate-600 font-light">
              The key to more success is to have a lot of pillows. Put it this
              way, it took me twenty five years to get these plants, twenty five
              years of blood sweat and tears, and I&apos;m never giving up,
              I&apos;m just getting started. I&apos;m up to something. Fan luv.
            </div>
            <div class="flex shrink-0 flex-wrap items-center pt-4 justify-end">
              <button data-dialog-close="true"
                class="rounded-md border border-transparent py-2 px-4 text-center text-sm transition-all text-slate-600 hover:bg-slate-100 focus:bg-slate-100 active:bg-slate-100 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                type="button">
                Cancel
              </button>
              <button data-dialog-close="true"
                class="rounded-md bg-green-600 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-green-700 focus:shadow-none active:bg-green-700 hover:bg-green-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ml-2"
                type="button">
                Confirm
              </button>
            </div>
          </div>
        </div>

        <button data-dialog-target="dialog-sm"
          class="rounded-md bg-slate-800 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ml-2"
          type="button">
          Open Dialog SM
        </button>
        <div data-dialog-backdrop="dialog-sm" data-dialog-backdrop-close="true"
          class="pointer-events-none fixed inset-0 z-[999] grid h-screen w-screen place-items-center bg-black bg-opacity-60 opacity-0 backdrop-blur-sm transition-opacity duration-300">
          <div data-dialog="dialog-sm" class="relative m-4 p-4 w-1/3 rounded-lg bg-white shadow-sm">
            <div class="flex shrink-0 items-center pb-4 text-xl font-medium text-slate-800">
              Its a simple dialog.
            </div>
            <div class="relative border-t border-slate-200 py-4 leading-normal text-slate-600 font-light">
              The key to more success is to have a lot of pillows. Put it this
              way, it took me twenty five years to get these plants, twenty five
              years of blood sweat and tears, and I&apos;m never giving up,
              I&apos;m just getting started. I&apos;m up to something. Fan luv.
            </div>
            <div class="flex shrink-0 flex-wrap items-center pt-4 justify-end">
              <button data-dialog-close="true"
                class="rounded-md border border-transparent py-2 px-4 text-center text-sm transition-all text-slate-600 hover:bg-slate-100 focus:bg-slate-100 active:bg-slate-100 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                type="button">
                Cancel
              </button>
              <button data-dialog-close="true"
                class="rounded-md bg-green-600 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-green-700 focus:shadow-none active:bg-green-700 hover:bg-green-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ml-2"
                type="button">
                Confirm
              </button>
            </div>
          </div>
        </div>

        <button data-dialog-target="dialog-md"
          class="rounded-md bg-slate-800 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ml-2"
          type="button">
          Open Dialog MD
        </button>
        <div data-dialog-backdrop="dialog-md" data-dialog-backdrop-close="true"
          class="pointer-events-none fixed inset-0 z-[999] grid h-screen w-screen place-items-center bg-black bg-opacity-60 opacity-0 backdrop-blur-sm transition-opacity duration-300">
          <div data-dialog="dialog-md" class="relative m-4 p-4 w-2/5 rounded-lg bg-white shadow-sm">
            <div class="flex shrink-0 items-center pb-4 text-xl font-medium text-slate-800">
              Its a simple dialog.
            </div>
            <div class="relative border-t border-slate-200 py-4 leading-normal text-slate-600 font-light">
              The key to more success is to have a lot of pillows. Put it this
              way, it took me twenty five years to get these plants, twenty five
              years of blood sweat and tears, and I&apos;m never giving up,
              I&apos;m just getting started. I&apos;m up to something. Fan luv.
            </div>
            <div class="flex shrink-0 flex-wrap items-center pt-4 justify-end">
              <button data-dialog-close="true"
                class="rounded-md border border-transparent py-2 px-4 text-center text-sm transition-all text-slate-600 hover:bg-slate-100 focus:bg-slate-100 active:bg-slate-100 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                type="button">
                Cancel
              </button>
              <button data-dialog-close="true"
                class="rounded-md bg-green-600 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-green-700 focus:shadow-none active:bg-green-700 hover:bg-green-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ml-2"
                type="button">
                Confirm
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="mb-3 flex gap-3">
        <button data-dialog-target="dialog-lg"
          class="rounded-md bg-slate-800 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ml-2"
          type="button">
          Open Dialog LG
        </button>
        <div data-dialog-backdrop="dialog-lg" data-dialog-backdrop-close="true"
          class="pointer-events-none fixed inset-0 z-[999] grid h-screen w-screen place-items-center bg-black bg-opacity-60 opacity-0 backdrop-blur-sm transition-opacity duration-300">
          <div data-dialog="dialog-lg" class="relative m-4 p-4 w-3/5 rounded-lg bg-white shadow-sm">
            <div class="flex shrink-0 items-center pb-4 text-xl font-medium text-slate-800">
              Its a simple dialog.
            </div>
            <div class="relative border-t border-slate-200 py-4 leading-normal text-slate-600 font-light">
              The key to more success is to have a lot of pillows. Put it this
              way, it took me twenty five years to get these plants, twenty five
              years of blood sweat and tears, and I&apos;m never giving up,
              I&apos;m just getting started. I&apos;m up to something. Fan luv.
            </div>
            <div class="flex shrink-0 flex-wrap items-center pt-4 justify-end">
              <button data-dialog-close="true"
                class="rounded-md border border-transparent py-2 px-4 text-center text-sm transition-all text-slate-600 hover:bg-slate-100 focus:bg-slate-100 active:bg-slate-100 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                type="button">
                Cancel
              </button>
              <button data-dialog-close="true"
                class="rounded-md bg-green-600 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-green-700 focus:shadow-none active:bg-green-700 hover:bg-green-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ml-2"
                type="button">
                Confirm
              </button>
            </div>
          </div>
        </div>

        <button data-dialog-target="dialog-xl"
          class="rounded-md bg-slate-800 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ml-2"
          type="button">
          Open Dialog XL
        </button>
        <div data-dialog-backdrop="dialog-xl" data-dialog-backdrop-close="true"
          class="pointer-events-none fixed inset-0 z-[999] grid h-screen w-screen place-items-center bg-black bg-opacity-60 opacity-0 backdrop-blur-sm transition-opacity duration-300">
          <div data-dialog="dialog-xl" class="relative m-4 p-4 w-3/4 rounded-lg bg-white shadow-sm">
            <div class="flex shrink-0 items-center pb-4 text-xl font-medium text-slate-800">
              Its a simple dialog.
            </div>
            <div class="relative border-t border-slate-200 py-4 leading-normal text-slate-600 font-light">
              The key to more success is to have a lot of pillows. Put it this
              way, it took me twenty five years to get these plants, twenty five
              years of blood sweat and tears, and I&apos;m never giving up,
              I&apos;m just getting started. I&apos;m up to something. Fan luv.
            </div>
            <div class="flex shrink-0 flex-wrap items-center pt-4 justify-end">
              <button data-dialog-close="true"
                class="rounded-md border border-transparent py-2 px-4 text-center text-sm transition-all text-slate-600 hover:bg-slate-100 focus:bg-slate-100 active:bg-slate-100 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                type="button">
                Cancel
              </button>
              <button data-dialog-close="true"
                class="rounded-md bg-green-600 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-green-700 focus:shadow-none active:bg-green-700 hover:bg-green-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ml-2"
                type="button">
                Confirm
              </button>
            </div>
          </div>
        </div>

        <button data-dialog-target="dialog-xxl"
          class="rounded-md bg-slate-800 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ml-2"
          type="button">
          Open Dialog XXL
        </button>
        <div data-dialog-backdrop="dialog-xxl" data-dialog-backdrop-close="true"
          class="pointer-events-none fixed inset-0 z-[999] grid h-screen w-screen place-items-center bg-black bg-opacity-60 opacity-0 backdrop-blur-sm transition-opacity duration-300">
          <div data-dialog="dialog-xxl" class="relative w-screen h-screen bg-white shadow-sm">
            <div class="flex shrink-0 items-center pb-4 text-xl font-medium text-slate-800">
              Its a simple dialog.
            </div>
            <div class="relative border-t border-slate-200 py-4 leading-normal text-slate-600 font-light">
              The key to more success is to have a lot of pillows. Put it this
              way, it took me twenty five years to get these plants, twenty five
              years of blood sweat and tears, and I&apos;m never giving up,
              I&apos;m just getting started. I&apos;m up to something. Fan luv.
            </div>
            <div class="flex shrink-0 flex-wrap items-center pt-4 justify-end">
              <button data-dialog-close="true"
                class="rounded-md border border-transparent py-2 px-4 text-center text-sm transition-all text-slate-600 hover:bg-slate-100 focus:bg-slate-100 active:bg-slate-100 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                type="button">
                Cancel
              </button>
              <button data-dialog-close="true"
                class="rounded-md bg-green-600 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-green-700 focus:shadow-none active:bg-green-700 hover:bg-green-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ml-2"
                type="button">
                Confirm
              </button>
            </div>
          </div>
        </div>
      </div>

    </QuinjetContainer>
  </QuinjetPage>
</template>

<style scoped>
.drag-over {
  border-color: #4f46e5;
  /* Indigo */
  background-color: #eef2ff;
  /* Indigo light */
}
</style>

