<script lang="ts" setup>
import { computed, ref } from "vue";

const props = withDefaults(
  defineProps<{
    mLeft?: number;
    mTop?: number;
    active: boolean;
    mWidth?: number;
    classes?: string;
  }>(),
  {
    mLeft: 0,
    mTop: 0,
    mWidth: 0,
    classes: "bg-white",
  }
);

const menu = ref<HTMLElement | null>(null);
const menuContent = ref<HTMLElement | null>(null);

//TODO  reactive style
const style = computed(() => {
  const properties: DOMRect | undefined = menu.value?.getBoundingClientRect();
  menuContent.value?.getBoundingClientRect();
  return {
    width: `${properties?.width + props.mWidth}px`,
    left: `${properties?.left + props.mLeft}px`,
    top: `${properties?.top + properties?.height + props.mTop}px`,
  };
});
</script>

<style lang="postcss">
.menu {
  @apply absolute overflow-y-auto p-0 m-0 rounded-b-xl max-w-full min-h-10 border-b border-r border-l border-gray-100 text-black max-h-48;
  li {
    @apply cursor-pointer p-2;
    &:hover {
      @apply bg-gray-200;
    }
  }
}
</style>

<template>
  <div class="menu-global" ref="menu">
    <slot name="activator"></slot>
    <Teleport to="body">
      <transition name="fade">
        <div
          v-if="active"
          ref="menuContent"
          :style="style"
          :class="['menu', classes]"
        >
          <slot name="prepend-item"></slot>
          <slot name="items"></slot>
          <slot name="append-item"></slot>
        </div>
      </transition>
    </Teleport>
  </div>
</template>
