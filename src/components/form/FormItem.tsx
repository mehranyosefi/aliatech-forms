import type { FormSection, FormType } from "@/types";
import BaseButton from "../base/BaseButton.vue";
import { computed } from "vue";
interface FormItemProps {
  item: {
    form_id: string | number;
    form_title: string;
    form_type: FormType;
    sections: FormSection[] | [];
    created_at: string
  }
}

export default function FormItem(props: FormItemProps) {
  const { item } = props;
  const created_at = new Date(item.created_at).toLocaleDateString('fa-IR')
  return (
    <div class='card border p-2'>
      <div class='rounded-xl bg-gray-200 text-center px-10 py-12'>{item.form_title}</div>
      <div class="my-4"><span class='text-gray-500 text-sm'>{created_at}</span></div>
      <BaseButton class="w-full py-1 outline !outline-gray-100" to={`/forms/crud?id=${item.form_id}`}>
        {{
          default: () => <span>مشاهده فرم</span>,
          prepend: () => <svg class="size-5"><use class="size-5" href='/img/icons.svg#eye-outline'></use></svg>,
        }}
      </BaseButton>
    </div >
  )
}
