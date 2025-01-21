<script setup lang="ts">
import BaseButton from "@/components/base/BaseButton.vue";
</script>
<template>
  <div class="h-screen flex items-center justify-center">
    <div>
      <div class="text-4xl">Not Found</div>
      <div class="mt-5 text-center">
        <BaseButton to="/forms" class="outline px-5 py-2 mx-auto"
          >لیست فرم ها</BaseButton
        >
      </div>
    </div>
  </div>
</template>
