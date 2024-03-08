import axios from "axios";
import { toast } from "sonner";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { IPost } from "../../types/Type";
import { useRouter } from "next/navigation";
import { useUpload } from "@src/hooks/use-upload";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogTitle } from "./ui/dialog";
import Image from "next/image";
import { useSession } from "next-auth/react";

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
  const router = useRouter();
  const { data: session } = useSession();
  const [formData, setFormData] = useState<Partial<IPost>>(post || {});
  const [submitting, setSubmitting] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const {
    handleImageChange,
    handleAudioChange,
    imageUrl,
    audioUrl,
    isLoading,
    imagePreviewUrl,
    audioPreviewUrl,
    deleteUploadedFile
  } = useUpload();

  useEffect(() => {
    console.log("DialogForm id", id);
    setFormData(post || {});
    setTags(post?.tag?.split(",") || []);
  }, [post]);

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      audioUrl: audioUrl ?? prev.audioUrl,
      imageUrl: imageUrl ?? prev.imageUrl,
    }));
  }, [audioUrl, imageUrl]);

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddTag = () => {
    const inputElement = document.getElementById(
      "tagInput",
    ) as HTMLInputElement;
    const newTag = inputElement.value.trim();
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag]);
      inputElement.value = "";
    }
  };

  const handleTagRemove = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  setSubmitting(true);

  try {
    if (!formData) {
      console.error("Missing post data");
      toast.error("Please fill in the required fields");
      return;
    }

    const response = id
      ? await axios.patch(`/api/message/${id}`, {
          message: formData.message,
          tag: tags.join(","),
          imageUrl: formData.imageUrl,
          audioUrl: formData.audioUrl,
        })
      : await axios.post("/api/message/new", {
          ...formData,
          tag: tags.join(","),
          userId: session?.user?.id,
        });

    if (response.status === 200 || response.status === 201) {
      const { message } = response.data;
      toast.success(message);
      onSubmit(formData);
      onClose();
      router.push("/");
    } else {
      const { error } = response.data;
      toast.error(error || "Failed to update/create message");
    }
  } catch (error: any) {
    console.error("Error occurred while updating/creating message", error);

    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      const { status, data } = error.response;
      if (status === 400) {
        // Bad Request
        const { issues } = data;
        const errorMessages = issues
          .map((issue: any) => issue.message)
          .join(", ");
        toast.error(`Invalid input: ${errorMessages}`);
      } else if (status === 401) {
        // Unauthorized
        toast.error("Unauthorized access. Please log in.");
      } else if (status === 404) {
        // Not Found
        toast.error("Post not found.");
      } else {
        // Other status codes
        toast.error("An error occurred while updating/creating the post.");
      }
    } else if (error.request) {
      // The request was made but no response was received
      toast.error("No response received from the server.");
    } else {
      // Something happened in setting up the request that triggered an Error
      toast.error("Error setting up the request.");
    }
  } finally {
    setSubmitting(false);
  }
};

  const handleClose = () => {
    setFormData({});
    setTags([]);
    deleteUploadedFile(imageUrl, "image", session?.user?.email);
    deleteUploadedFile(audioUrl, "audio", session?.user?.email);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <div
        className={`fixed inset-0 z-40 bg-white/5 backdrop-blur-lg ${
          open ? "visible" : "hidden"
        }`}
      ></div>
      <DialogContent>
        <DialogTitle>
          {id && id !== "" ? "Edit Post" : "Create Post"}
        </DialogTitle>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Textarea
            name="message"
            placeholder="Enter your message here"
            value={formData.message || ""}
            onChange={handleChange}
            className="w-full resize-none bg-transparent"
            rows={8}
          />

          <div className="flex items-center gap-2">
            <Input
              id="tagInput"
              type="text"
              placeholder="Add tag"
              className="w-full rounded-md border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Button type="button" onClick={handleAddTag}>
              Add Tag
            </Button>
          </div>
          {/* Image Preview */}
          {imagePreviewUrl && (
            <div className="mt-4">
              <Image src={imagePreviewUrl} alt="Preview" className="max-w-xs" />
              {imageUrl ? (
                <p>Image uploaded</p>
              ) : (
                <p>Image selected, not yet uploaded</p>
              )}
            </div>
          )}

          {/* Audio Preview */}
          {audioPreviewUrl && (
            <div className="mt-4">
              <audio controls src={audioPreviewUrl}>
                Your browser does not support the audio element.
              </audio>
              {audioUrl ? (
                <p>Audio uploaded</p>
              ) : (
                <p>Audio selected, not yet uploaded</p>
              )}
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            {tags.map((tag, index) => (
              <div
                key={index}
                className="flex items-center gap-2 rounded-md bg-blue-100 px-2 py-1 text-sm text-blue-700"
              >
                <span>{tag}</span>
                <Button
                  type="button"
                  onClick={() => handleTagRemove(tag)}
                  className="text-blue-500 hover:text-blue-700"
                >
                  &times;
                </Button>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <label htmlFor="imageUpload" className="cursor-pointer">
              {isLoading ? "Uploading..." : "Upload Image"}
              <Input
                id="imageUpload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </label>
            <label htmlFor="audioUpload" className="cursor-pointer">
              {isLoading ? "Uploading..." : "Upload Audio"}
              <Input
                id="audioUpload"
                type="file"
                accept="audio/*"
                className="hidden"
                onChange={handleAudioChange}
              />
            </label>
          </div>

          <DialogFooter>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Submitting..." : id ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default DialogForm;
