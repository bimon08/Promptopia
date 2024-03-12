// d:/Projects/Promptopia/src/components/DialogForm.tsx
import React, { useEffect, useRef, useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogTitle } from "./ui/dialog";
import { IPost } from "../../types/Type";
import { Textarea } from "./ui/textarea";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useUpload } from "@src/hooks/use-upload";
import Image from "next/image";

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
      <DialogContent className="max-h-[calc(100vh-5rem)] overflow-y-auto">
        <DialogTitle>{id ? "Edit Post" : "Create Post"}</DialogTitle>
        <form onSubmit={handleSubmit} className="flex  flex-col gap-4">
          <Textarea
            name="message"
            placeholder="Enter your message here"
            value={formData.message}
            onChange={updateFormData}
            rows={8}
          />

          <div className="flex flex-col gap-2">
            <Input
              name="tag"
              id="tagInput"
              type="text"
              placeholder="Add a tag"
              onKeyDown={handleTagInputChange}
              onBlur={handleTagInputBlur}
            />
            <Button
              type="button"
              onClick={handleAddTag}
              disabled={isSubmitting}
              className="self-start rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
            >
              Add
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
            <label htmlFor="audioUpload" className="cursor-pointer">
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
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default DialogForm;
