<script setup lang="ts">
import { shallowRef, type ShallowRef, type Component } from "vue";
import router from "./router";
import layouts from "@/layouts";

const layout: ShallowRef<Component | string> = shallowRef("div");
router.afterEach((to) => {
  layout.value = layouts[to.meta.layout as keyof typeof layouts];
});
</script>

<template>
  <component :is="layout || 'div'">
    <router-view v-slot="{ Component }">
      <transition name="fade">
        <component :is="Component" />
      </transition>
    </router-view>
  </component>
</template>
