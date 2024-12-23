import React, { useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogTitle } from "./ui/dialog";
import { IPost } from "../../types/Type";
import { Textarea } from "./ui/textarea";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useUpload } from "@src/hooks/use-upload";
import Image from "next/image";
import { SendIcon, Tag } from "lucide-react";
import { useEffect } from "react";

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
      <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-lg dark:bg-gray-800 dark:text-gray-100">
        <div className="flex flex-col gap-4">
          <DialogTitle>{id ? "Edit Post" : "Create Post"}</DialogTitle>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <MessageInput
              name="message"
              value={formData.message}
              onChange={updateFormData}
            />
            <TagInput
              onKeyDown={handleTagInputChange}
              onBlur={handleTagInputBlur}
              onAddTag={handleAddTag}
              isSubmitting={isSubmitting}
            />
            <TagList tags={formData.tag} onRemoveTag={removeTag} />
            {post && (
              <MediaPreviews
                selectedImage={selectedImage}
                selectedAudio={selectedAudio}
                audioObjectUrl={audioObjectUrl}
                onRemoveImage={() => handleFileRemove("image")}
                onRemoveAudio={() => handleFileRemove("audio")}
                post={post}
              />
            )}
            <FileUpload
              onImageUpload={handleFileChange("image")}
              onAudioUpload={handleFileChange("audio")}
              isImageUploading={isImageUploading}
              isAudioUploading={isAudioUploading}
            />
            <DialogFooter>
              <SubmitButton
                isSubmitting={isSubmitting}
                isImageUploading={isImageUploading}
                isAudioUploading={isAudioUploading}
              />
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Extracted sub-components

const MessageInput: React.FC<{
  name: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
}> = ({ name, value, onChange }) => (
  <Textarea
    name={name}
    placeholder="Enter your message here"
    value={value}
    onChange={onChange}
    rows={8}
    className="w-full"
  />
  
);

const TagInput: React.FC<{
  onKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  onBlur: (event: React.FocusEvent<HTMLInputElement>) => void;
  onAddTag: () => void;
  isSubmitting: boolean;
}> = ({ onKeyDown, onBlur, onAddTag, isSubmitting }) => (
  <div className="flex flex-col gap-2 sm:flex-row sm:gap-4">
    <Input
      name="tag"
      id="tagInput"
      type="text"
      placeholder="Write a tag"
      onKeyDown={onKeyDown}
      onBlur={onBlur}
      className="w-full rounded border border-gray-300 bg-gray-100 text-gray-800 placeholder-gray-500 focus:border-blue-500 sm:w-auto"
    />
    <Button
      variant="outline"
      type="button"
      onClick={onAddTag}
      disabled={isSubmitting}
      className="self-start rounded border-gray-300  px-4 py-2 font-bold text-gray-700 hover:bg-blue-50 hover:text-blue-600 active:bg-blue-100 dark:text-gray-200 dark:hover:bg-gray-700"
    >
      Add <Tag className="ml-1 text-blue-600" size={16} />
    </Button>
  </div>
);

const TagList: React.FC<{
  tags: string[];
  onRemoveTag: (tag: string) => void;
}> = ({ tags, onRemoveTag }) => (
  <div className="flex flex-wrap gap-2">
    {Array.isArray(tags) &&
      tags.map((tag, index) => (
        <div
          key={index}
          className="flex items-center gap-1 rounded border border-blue-300 bg-blue-100 px-2 py-1 text-blue-700"
        >
          <div className="font-medium">{tag}</div>
          <button
            type="button"
            onClick={() => onRemoveTag(tag)}
            className="ml-1 text-red-500 hover:text-red-700 focus:outline-none"
          >
            x
          </button>
        </div>
      ))}
  </div>
);


const MediaPreviews: React.FC<{
  selectedImage: File | null;
  selectedAudio: File | null;
  audioObjectUrl: string | null;
  onRemoveImage: () => void;
  onRemoveAudio: () => void;
  post?: IPost;
}> = ({
  selectedImage,
  selectedAudio,
  audioObjectUrl,
  onRemoveImage,
  onRemoveAudio,
  post,
}) => {
  const [currentAudioUrl, setCurrentAudioUrl] = useState<string | null>(
    audioObjectUrl,
  );
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);
  // Effect for updating audio URL
  useEffect(() => {
    if (post?.audioUrl && !selectedAudio) {
      setCurrentAudioUrl(post.audioUrl);
    } else if (audioObjectUrl) {
      setCurrentAudioUrl(audioObjectUrl);
    }
  }, [post?.audioUrl, audioObjectUrl, selectedAudio]);

  // Effect for updating image URL
  useEffect(() => {
    if (post?.imageUrl && !selectedImage) {
      setCurrentImageUrl(post.imageUrl);
    } else if (selectedImage) {
      setCurrentImageUrl(URL.createObjectURL(selectedImage));
    }
  }, [post?.imageUrl, selectedImage]);

  return (
    <div className="flex flex-col gap-4">
      {currentImageUrl && (
        <div className="flex flex-col gap-2">
          <Image
            width={200}
            height={200}
            src={currentImageUrl}
            alt="Preview"
            className="h-auto w-full"
          />
          <button
            type="button"
            onClick={onRemoveImage}
            className="text-red-500 hover:text-red-700"
          >
            Remove Image
          </button>
        </div>
      )}
      {currentAudioUrl && (
        <div className="flex flex-col gap-2">
          <audio
            src={currentAudioUrl}
            controls
            preload="auto"
            className="w-full"
          />
          <button
            type="button"
            onClick={onRemoveAudio}
            className="text-red-500 hover:text-red-700"
          >
            Remove Audio
          </button>
        </div>
      )}
    </div>
  );
};

const FileUpload: React.FC<{
  onImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onAudioUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isImageUploading: boolean;
  isAudioUploading: boolean;
}> = ({ onImageUpload, onAudioUpload, isImageUploading, isAudioUploading }) => (
  <div className="flex flex-col justify-center gap-4 sm:flex-row">
    <label htmlFor="imageUpload" className="cursor-pointer">
      {isImageUploading ? "Uploading..." : "Upload Image"}
      <Input
        id="imageUpload"
        type="file"
        accept="image/*"
        className="hidden"
        onChange={onImageUpload}
      />
    </label>
    <label htmlFor="audioUpload" className="cursor-pointer">
      {isAudioUploading ? "Uploading..." : "Upload Audio"}
      <Input
        id="audioUpload"
        type="file"
        accept="audio/*"
        className="hidden"
        onChange={onAudioUpload}
      />
    </label>
  </div>
);

const SubmitButton: React.FC<{
  isSubmitting: boolean;
  isImageUploading: boolean;
  isAudioUploading: boolean;
}> = ({ isSubmitting, isImageUploading, isAudioUploading }) => (
  <Button
    type="submit"
    className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
    disabled={isSubmitting || isImageUploading || isAudioUploading}
  >
    {isSubmitting ? (
      "Submitting..."
    ) : (
      <>
        Submit <SendIcon className="ml-2 h-4 w-4" />
      </>
    )}
  </Button>
);

export default DialogForm;
