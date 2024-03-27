// d:/Projects/Promptopia/src/components/DialogForm.tsx
import React, { useEffect, useRef, useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogTitle } from "./ui/dialog";
import { IPost } from "../../types/Type";
import { Textarea } from "./ui/textarea";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useUpload } from "@src/hooks/use-upload";
import Image from "next/image";
import { SendIcon, Tag } from "lucide-react";

type DialogFormProps = {
  open: boolean;
  onClose: () => void;
  post?: IPost | null;
  onSubmit: (postData: Partial<IPost>) => void;
  id?: string;
};

const DialogForm: React.FC<DialogFormProps> = ({
  open,
  onClose,
  post,
  onSubmit,
  id,
}) => {
  const {
    handleFileChange,
    selectedImage,
    selectedAudio,
    isImageUploading,
    isAudioUploading,
    isSubmitting,
    handleTagInputBlur,
    formData,
    audioObjectUrl,
    handleFileRemove,
    handleSubmit,
    updateFormData,
    removeTag,
    handleAddTag,
    handleTagInputChange,
  } = useUpload({
    post,
    id,
    onSubmit,
    onClose,
  });

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-h-[calc(100vh-5rem)] max-w-sm overflow-y-auto rounded-2xl bg-white p-6 shadow-lg dark:bg-gray-800 dark:text-gray-100 sm:rounded-xl md:max-w-md md:p-8 lg:max-w-lg lg:p-10">
        <DialogTitle>{id ? "Edit Post" : "Create Post"}</DialogTitle>
        <form onSubmit={handleSubmit} className="flex  flex-col gap-4 ">
          <Textarea
            name="message"
            placeholder="Enter your message here"
            value={formData.message}
            onChange={updateFormData}
            rows={8}
          />

          <div className="flex flex-row gap-2 rounded-md ">
            <Input
              name="tag"
              id="tagInput"
              type="text"
              placeholder="Write a tag"
              onKeyDown={handleTagInputChange}
              onBlur={handleTagInputBlur}
            />
            <Button
              variant={"outline"}
              type="button"
              onClick={handleAddTag}
              disabled={isSubmitting}
              className="self-start rounded  px-4 py-2 font-bold hover:bg-gray-100 dark:text-white"
            >
              Add <Tag className="ml-1" size={16} />
            </Button>
          </div>

          <div className="flex gap-2">
            {Array.isArray(formData.tag) &&
              formData.tag.map((tag, index) => (
                <div
                  key={index}
                  className="flex items-center gap-1 rounded bg-gray-200 px-2 py-1"
                >
                  {typeof tag === "string" && (
                    <>
                      <div>{tag}</div>

                      <button
                        type="button"
                        onClick={(e) => removeTag(tag)}
                        className="text-red-500 hover:text-red-700"
                      >
                        x
                      </button>
                    </>
                  )}
                </div>
              ))}
          </div>

          {/* Image and audio upload sections */}
          {selectedImage && (
            <div className="flex flex-col gap-2">
              <Image
                width={200}
                height={200}
                src={URL.createObjectURL(selectedImage)}
                alt="Preview"
                className="h-auto w-full"
              />
              <button
                type="button"
                onClick={(e) => handleFileRemove("image")}
                className="text-red-500 hover:text-red-700"
              >
                Remove Image
              </button>
            </div>
          )}
          {selectedAudio && (
            <div className="flex flex-col gap-2">
              <audio
                src={audioObjectUrl || undefined}
                controls
                preload="auto"
                className="w-full"
              />
              <button
                type="button"
                onClick={(e) => handleFileRemove("audio")}
                className="text-red-500 hover:text-red-700"
              >
                Remove Audio
              </button>
            </div>
          )}
          <div className="flex justify-center gap-4 ">
            <label htmlFor="imageUpload" className="cursor-pointer">
              {isImageUploading ? "Uploading..." : "Upload Image"}
              <Input
                id="imageUpload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange("image")}
              />
            </label>
            <label htmlFor="audioUpload" className="cursor-pointer  ">
              {isAudioUploading ? "Uploading..." : "Upload Audio"}
              <Input
                id="audioUpload"
                type="file"
                accept="audio/*"
                className="hidden"
                onChange={handleFileChange("audio")}
              />
            </label>
          </div>
          <DialogFooter>
            <Button
              type="submit"
              disabled={isSubmitting || isImageUploading || isAudioUploading}
              className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
            >
              {" "}
              <SendIcon className="mr-2 h-4 w-4" />
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default DialogForm;
