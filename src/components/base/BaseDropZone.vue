<script lang="ts" setup>
import { useUploadAbleFile } from "@/composable/useUploadAbleFIle";
import { shallowRef, type ShallowRef } from "vue";
import { FileTypes } from "@/types";

const emit = defineEmits(["files-dropped"]);
const active: ShallowRef<boolean> = shallowRef<boolean>(false);
const { addFiles, files } = useUploadAbleFile();

function onDrop(e: DragEvent): void {
  active.value = false;
  if (e.dataTransfer) {
    emit("files-dropped", [...e.dataTransfer.files]);
    addFiles([...e.dataTransfer.files]);
  }
}
function uploadFile(e: Event): void {
  if ((e.target as HTMLInputElement).files)
    addFiles([...(e.target as HTMLInputElement).files!]);
}

defineExpose({ files });
</script>

<template>
  <div
    class="dropzone"
    :data-active="active"
    @dragenter.prevent="active = true"
    @dragover.prevent="active = true"
    @dragleave.prevent="active = false"
    @drop.prevent="onDrop"
  >
    <slot :dropZoneActive="active">
      <div class="dropzone__scaffold" :class="{ active: active }">
        <div class="dropzone__scaffold__content">
          <div v-if="active">فایل را رها کنید</div>
          <div v-else>
            <div class="dropzone__scaffold__files">
              <div v-for="(file, index) in files" :key="index">
                <img
                  v-if="
                    file.type === FileTypes.jpg || file.type === FileTypes.png
                  "
                  :src="file.url"
                  :alt="`image of ${file.id}`"
                  class="file"
                />
                <iframe
                  v-else
                  :src="file.url"
                  frameborder="0"
                  class="file"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
        <div
          class="dropzone__scaffold__input"
          :class="{ '!bottom-0': active || files.length > 0 }"
        >
          <label for="input-file">
            <svg :class="{ 'bg-white': files.length > 1 }">
              <use href="/img/icons.svg#cloud-upload"></use>
            </svg>
          </label>
          <input type="file" id="input-file" multiple @change="uploadFile" />
          <div>
            <span v-show="!active && files.length < 1"
              >فایل ها را اینجا رها کنید</span
            >
          </div>
        </div>
      </div>
    </slot>
  </div>
</template>
<style lang="postcss" scoped>
.dropzone {
  &__scaffold {
    @apply relative;
    &__content {
      @apply w-full max-w-full h-60 max-h-60 overflow-x-hidden bg-whitesmoke z-10 border border-dashed rounded-xl border-gray-200 transition-all
    duration-300 flex flex-wrap items-center justify-center py-3;
    }
    &.active {
      @apply border-green-500;
    }

    &__input {
      @apply absolute bottom-20 text-center w-full;
      label {
        @apply cursor-pointer;
        svg {
          @apply mx-auto text-gray-500;
        }
        svg,
        use {
          @apply size-16;
        }
      }
      input {
        @apply hidden;
      }
    }
    &__files {
      @apply w-full flex items-center justify-around flex-wrap;
      .file {
        @apply mx-10 border rounded w-56 h-56;
      }
    }
  }
}
</style>
