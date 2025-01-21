import { ref } from "vue";
import { UploadableFile, FileTypes } from "@/types";

export const useUploadAbleFile = () => {
  const files = ref<UploadableFile[]>([]);

  function addFiles(newFiles: File[]): void {
    const newUploadableFiles = [...newFiles]
      .map((file) => new UploadableFile(file))
      .filter((file) => {
        const res: boolean =
          file.type !== FileTypes.jpg ||
          file.type !== FileTypes.png ||
          file.type !== FileTypes.pdf;
        return !fileExists(file.id) || res;
      });
    files.value = files.value.concat(newUploadableFiles);
  }

  function fileExists(otherId: string) {
    return files.value.some(({ id }) => id === otherId);
  }

  return { files, addFiles };
};
