export interface LoginFormPattern {
  [key: string]: {
    required?: boolean;
    pattern: RegExp;
    error: { [key: string]: string };
    hasChanged: boolean;
  };
}
export interface LoginFormPatternInterface {
  email: string;
  password: string;
}
export interface User {
  email: string;
}

export interface UserStore {
  user: User;
  access_token: string | null;
  refresh_token: string | null;
}

export interface SelectProps {
  label?: string;
  placeholder?: string;
  readonly?: boolean;
  items?: Array<{
    [key: string]: string | object | [];
  }>;
  modelValue: string;
  textPath?: string;
  keyPath?: string;
  disabled?: boolean;
}
export interface FormDataInterface {
  form_title: string;
  form_type: string;
  description: string;
  sections: FormSectionInterface[];
  form_id?: string | number;
}
export enum FormType {
  public = "public",
  private = "private",
}
export enum ResponseInputType {
  short = "text",
  long = "textarea",
  single = "radio",
  multiple = "checkbox",
  file = "file",
}
export type FormCategory = {
  name: string;
  value: FormType;
};
export type ResponseCategory = {
  name: string;
  value: ResponseInputType;
};
export const formCategoryItems: FormCategory[] = [
  {
    name: "عمومی",
    value: FormType.public,
  },
  {
    name: "خصوصی",
    value: FormType.private,
  },
];

export const responseCategoryItems: ResponseCategory[] = [
  {
    name: "پاسخ کوتاه",
    value: ResponseInputType.short,
  },
  {
    name: "پاسخ بلند",
    value: ResponseInputType.long,
  },
  {
    name: "تک پاسخی",
    value: ResponseInputType.single,
  },
  {
    name: "چندین پاسخی",
    value: ResponseInputType.multiple,
  },
  {
    name: "بارگزاری پیوست",
    value: ResponseInputType.file,
  },
];

export interface FormSectionInterface {
  id?: string | number;
  title: string;
  type: ResponseInputType;
  required: boolean;
  properties: Array<object | string> | [];
}

export class FormSection implements FormSectionInterface {
  id?: string | number;
  title: string;
  type: ResponseInputType;
  required: boolean;
  properties: Array<object | string> | [];

  constructor(
    title: string,
    type: ResponseInputType,
    required: boolean,
    properties: Array<object | string> | [],
    id?: string | number
  ) {
    this.id = id;
    this.title = title;
    this.type = type;
    this.required = required;
    this.properties = properties;
  }
}
export const loginFormPattern: LoginFormPattern = {
  email: {
    required: true,
    pattern:
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    error: {
      required: "ایمیل الزامی است",
      inValid: "ایمیل صحیح وارد نشده است",
    },
    hasChanged: false,
  },
  password: {
    required: true,
    pattern:
      /^([0-9]+[^&\\;<>]*[^a-zA-Z0-9&\\;<>][^&\\;<>]*)|([^&\\;<>]*[0-9]+[^a-zA-Z0-9&\\;<>][^&\\;<>]*)|([^&\\;<>]*[^a-zA-Z0-9&\\;<>][0-9]+[^&\\;<>]*)|([^&\\;<>]*[^a-zA-Z0-9&\\;<>][^&\\;<>]*)[0-9]+$/,
    error: {
      required: "رمزعبور الزامی است",
      inValid: "رمز عبور باید شامل اعداد و حروف خاص باشد",
    },
    hasChanged: false,
  },
};
export const sections: FormSection[] = [
  new FormSection("", ResponseInputType.short, true, [], 1),
];
export enum FileTypes {
  jpg = "image/jpeg",
  png = "image/png",
  pdf = "application/pdf",
}

export class UploadableFile {
  file: File;
  id: string;
  url: string;
  status: null;
  type: string;
  constructor(file: File) {
    this.file = file;
    this.id = `${file.name}-${file.size}-${file.lastModified}-${file.type}`;
    this.url = URL.createObjectURL(file);
    this.status = null;
    this.type = file.type;
  }
}
