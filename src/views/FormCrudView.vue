<script lang="ts" setup>
import BaseButton from "@/components/base/BaseButton.vue";
import BaseInput from "@/components/base/BaseInput.vue";
import BaseSelectBox from "@/components/base/BaseSelectBox.vue";
import { computed, onMounted, reactive, type Reactive } from "vue";
import { generateUUID } from "@/utility";
import {
  formCategoryItems,
  FormSection,
  type FormSectionInterface,
  ResponseInputType,
  FormType,
  type FormCategory,
  type FormDataInterface,
} from "@/types";
import FormSectionItem from "@/components/form/FormSectionItem.vue";
import { useFetch } from "@/composable/useFetch";
import router from "@/router";

const props = defineProps<{ id?: string | number }>();
const {
  fetchData: fetchFormData,
  data: requestFormData,
  loading: requestFetchDataLoading,
  error: requestFetchDataError,
} = useFetch();

onMounted(async () => {
  if (props.id) {
    await fetchFormData(`form?form_id=${props.id}`);
    if (requestFormData.value.ok) {
      const items: FormDataInterface = requestFormData.value.data;
      // Object.keys(items).forEach((key) => {
      //   formData[key] = items[key];
      // });
      formData.form_title = items.form_title;
      formData.form_type = items.form_type;
      formData.description = items.description;
      formData.sections = items.sections;
    }
  }
});

const formData: Reactive<FormDataInterface> = reactive<FormDataInterface>({
  form_title: "",
  form_type: "public",
  description: "",
  sections: [],
});
const userInfo = reactive({
  first_name: "",
  last_name: "",
  email: "",
});

const categoryType = computed({
  get() {
    return formCategoryItems.find(({ value }) => value === formData.form_type);
  },
  set(val: FormCategory) {
    formData.form_type = val.value;
  },
});

function removeSection(itemId: string | number): void {
  const index = formData.sections.findIndex(({ id }) => id === itemId);
  if (index > -1) formData.sections.splice(index, 1);
}
function duplicateItem(itemId: string | number): void {
  const item = formData.sections.find(({ id }) => id === itemId);
  const index: number = formData.sections.indexOf(item);
  if (index > -1) {
    const newItem: FormSectionInterface = { ...item, id: generateUUID() };
    formData.sections.join();
    formData.sections.splice(index + 1, 0, newItem);
  }
}
function downWardItem(itemId: string | number): void {
  const index = formData.sections.findIndex(({ id }) => id === itemId);
  if (index > -1)
    [formData.sections[index], formData.sections[index + 1]] = [
      formData.sections[index + 1],
      formData.sections[index],
    ];
}
function upWardItem(itemId: string | number): void {
  const index = formData.sections.findIndex(({ id }) => id === itemId);
  if (index > -1)
    [formData.sections[index - 1], formData.sections[index]] = [
      formData.sections[index],
      formData.sections[index - 1],
    ];
}

function addNewSection(): void {
  const newSection = new FormSection(
    "",
    ResponseInputType.short,
    false,
    [],
    generateUUID()
  );
  formData.sections.push(newSection);
}
function handleSubmitForm() {
  if (props.id) editForm();
  else createForm();
}

const { fetchData, data, error, loading } = useFetch();
async function createForm() {
  await fetchData("form", { method: "POST", body: formData });
  if (data.value.ok) router.push({ name: "forms" });
  else if (data.value) error.value = data.value.error;
}

const {
  fetchData: fetchUpdateForm,
  data: requestUpdateFormData,
  loading: requestUpdateFormLoading,
  error: requestUpdateFormError,
} = useFetch();
async function editForm() {
  await fetchUpdateForm(`form?form_id=${props.id}`, {
    method: "PUT",
    body: formData,
  });
  if (requestUpdateFormError.value) error.value = requestUpdateFormError.value;
  else if (!requestUpdateFormData.value.ok)
    error.value = requestUpdateFormData.value?.error;
  else router.push({ name: "forms" });
}

const {
  fetchData: fetchRemoveForm,
  data: requestRemoveForm,
  loading: requestRemoveFormLoading,
  error: requestRemoveFormError,
} = useFetch();
async function handleRemoveForm() {
  await fetchRemoveForm(`form?form_id=${props.id}`, { method: "Delete" });
  if (requestRemoveFormError.value) error.value = requestRemoveFormError.value;
  else if (!requestRemoveForm.value.ok)
    error.value = requestRemoveForm.value?.error;
  else router.push({ name: "forms" });
}
</script>
<template>
  <div class="page">
    <header class="page_header">
      <div>
        <h1>
          <span v-if="!id">ساخت فرم</span>
          <span v-else>ویرایش فرم</span>
        </h1>
      </div>
    </header>
    <div v-if="requestFetchDataLoading" class="page__loading">
      <div class="loader"></div>
    </div>
    <div v-else-if="requestFetchDataError" v-text="requestFetchDataError"></div>
    <div v-else class="page__content formScaffold">
      <div class="card formScaffold__firstrow">
        <BaseButton
          v-if="id"
          class="outline"
          @handle-click="handleRemoveForm"
          :is-loading="requestRemoveFormLoading"
        >
          <template #prepend>
            <svg class="size-6">
              <use class="size-6" href="/img/icons.svg#trash-bin"></use>
            </svg>
          </template>
          <span>حذف فرم</span>
        </BaseButton>
        <BaseButton
          @handle-click="handleSubmitForm"
          :is-loading="loading || requestUpdateFormLoading"
        >
          <template #prepend>
            <svg class="size-6">
              <use class="size-6" href="/img/icons.svg#tick"></use>
            </svg>
          </template>
          <span>ذخیره فرم</span>
        </BaseButton>
      </div>
      <div class="card formScaffold__secondrow">
        <div class="flex flex-col">
          <BaseInput
            v-model="formData.form_title"
            label="نام فرم"
            placeholder="یک عنوان برای این فرم"
          ></BaseInput>
          <div>
            <label form="description">توضیحات فرم</label>
            <textarea
              class="textarea"
              v-model="formData.description"
              name="description"
              id="description"
              placeholder="توضیحات در مورد این فرم"
            ></textarea>
          </div>
        </div>
        <div class="mr-3 flex flex-col">
          <BaseSelectBox
            label="دسته بندی"
            :items="formCategoryItems"
            v-model="categoryType"
            :disabled="id ? true : false"
          ></BaseSelectBox>
          <Transition name="fade">
            <div class="mt-5" v-if="formData.form_type === FormType.public">
              <BaseInput
                label="نام"
                placeholder="نام"
                v-model="userInfo.first_name"
              ></BaseInput>
            </div>
          </Transition>
        </div>
        <Transition name="fade">
          <div
            v-if="formData.form_type === FormType.public"
            class="mr-3 flex flex-col"
          >
            <BaseInput
              label="نام خانوادگی"
              placeholder="نام خانوادگی"
              v-model="userInfo.last_name"
            ></BaseInput>
            <BaseInput
              type="email"
              label="ایمیل"
              placeholder="ایمیل"
              v-model="userInfo.email"
            ></BaseInput>
          </div>
        </Transition>
      </div>
      <TransitionGroup name="list" tag="div">
        <FormSectionItem
          v-for="(item, index) in formData.sections"
          :key="item.id"
          :id="item.id as number"
          :index="index"
          :length="formData.sections.length"
          v-model:title="item.title"
          v-model:type="item.type"
          v-model:required="item.required"
          v-model:properties="item.properties"
          @handle-remove-item="removeSection"
          @handle-duplicate-item="duplicateItem"
          @hanlde-down-ward-item="downWardItem"
          @hanlde-up-ward-item="upWardItem"
        ></FormSectionItem>
        <div class="newsection card">
          <BaseButton class="outline" @handle-click="addNewSection"
            ><span class="plusicon">+</span>پرسش جدید</BaseButton
          >
        </div>
      </TransitionGroup>
    </div>
    <div class="error">
      {{ error }}
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.page {
  @apply pt-5;
  &__content {
    .card {
      @apply p-5 my-3;
    }
    .formScaffold {
      &__firstrow {
        @apply flex justify-end;
        .btn {
          @apply py-1 px-3 w-36;
        }
        > .btn:first-child {
          @apply ml-3;
        }
      }
      &__secondrow {
        @apply flex;
        > div:first-child {
          @apply max-w-64;
        }
      }
    }
    .newsection {
      @apply text-center;
      .btn {
        @apply mx-auto py-0 px-16 outline-gray-200;
        .plusicon {
          @apply text-3xl font-semibold pt-2 ml-2;
        }
      }
    }
  }
  &__loading {
    @apply h-full flex items-center justify-center;
    .loader {
      @apply text-gray-500;
    }
  }
  .error {
    @apply fixed top-0 left-0 right-0 bg-red-200 text-center;
  }
}
</style>
