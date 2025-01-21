<script lang="ts" setup>
import { onMounted } from "vue";
import BaseButton from "@/components/base/BaseButton.vue";
import FormItem from "@/components/form/FormItem.tsx";
import { useFetch } from "@/composable/useFetch";

const { fetchData, data, error, loading } = useFetch();
onMounted(async () => {
  await fetchData("forms?page=1&per_page=15");
});
</script>

<template>
  <div class="page">
    <header class="page__header">
      <div><h1>فرم ها</h1></div>
      <BaseButton to="/forms/create">
        <template #prepend>
          <span class="prepend">+</span>
        </template>
        <span>ایجاد فرم</span>
      </BaseButton>
    </header>
    <div class="page__content card">
      <div v-if="loading" class="page__content__loading">
        ...loading
        <div class="loader"></div>
      </div>
      <div v-else-if="error" v-text="error"></div>
      <template v-else>
        <div v-if="!data?.data?.length" class="page__content__empty">
          <p>هیچ فرمی تا به حال ساخته نشده است!</p>
          <router-link to="/forms/create">ایجاد فرم</router-link>
        </div>
        <div v-if="data?.data?.length" class="page__content__items scrollbar">
          <FormItem v-for="(form, index) in data?.data" :key="index">{{
            form
          }}</FormItem>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped lang="postcss">
.page {
  @apply pt-5;
  header {
    @apply flex items-center justify-between;
    .btn {
      @apply py-[.1rem] px-3;
      .prepend {
        @apply font-bold mx-1 text-[1.1rem] leading-6 pt-[.15em];
      }
    }
  }
  .page__content {
    @apply mt-7 p-3 h-[calc(100vh-150px)] overflow-y-auto;
    &__items {
      @apply grid grid-cols-1 row-span-1 grid-rows-[220px] gap-y-5 sm:grid-cols-2 lg:grid-cols-3  gap-x-2 px-3 py-2;
    }
    &__empty {
      @apply flex flex-wrap justify-center items-center w-full h-full text-center;
      a {
        @apply mr-3 text-blue-500;
      }
    }
  }
}
</style>
