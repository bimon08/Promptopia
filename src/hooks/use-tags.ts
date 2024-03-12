// d:/Projects/Promptopia/src/hooks/use-tag.ts
import { useCallback } from "react";

type useTagsProps = {
  formData: any;
  setFormData: (data: any) => void;
};

export const useTags = ({ formData, setFormData }: useTagsProps) => {
  const removeTag = useCallback((tag: string) => {
    setFormData((prevTags: any) => ({
      ...prevTags,
      tag: prevTags.tag.filter((t: string) => t !== tag),
    }));
  }, [setFormData]);

  const addTag = useCallback(
    (tag: string) => {
      if (tag && !formData.tag.includes(tag)) {
        setFormData((prevTags: any) => ({
          ...prevTags,
          tag: [...prevTags.tag, tag],
        }));
      }
    },
    [formData.tag, setFormData],
  );

  const handleTagInputChange = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Enter") {
        event.preventDefault();
        const newTag = event.currentTarget.value.trim();
        if (newTag) {
          addTag(newTag);
          event.currentTarget.value = "";
        }
      }
    },
    [addTag],
  );

  const handleTagInputBlur = useCallback(
    (event: React.FocusEvent<HTMLInputElement>) => {
      const newTag = event.currentTarget.value.trim();
      if (newTag) {
        addTag(newTag);
        event.currentTarget.value = "";
      }
    },
    [addTag],
  );

  const handleAddTag = useCallback(() => {
    const inputElement = document.getElementById(
      "tagInput",
    ) as HTMLInputElement;
    const newTag = inputElement.value.trim();
    if (newTag) {
      addTag(newTag);
      inputElement.value = "";
    }
  }, [addTag]);

  return {
    tags: formData.tag,
    addTag,
    removeTag,
    handleTagInputChange,
    handleTagInputBlur,
    handleAddTag,
  };
};