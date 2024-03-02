import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { PostType } from "./Type";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from "./ui/dialog";
import { toast } from "sonner";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Textarea } from "./ui/textarea";

type EditDialogFormProps = {
  open: boolean;
  onClose: () => void;
  post: PostType | null;
  onSubmit: (postData: Partial<PostType>) => void;
  id: string;
};

const EditDialogForm: React.FC<EditDialogFormProps> = ({
  open,
  onClose,
  post,
  id,
}) => {
  const router = useRouter();
  const [editedPost, setEditedPost] = useState<Partial<PostType>>(post || {});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setEditedPost(post || {});
  }, [post]);

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditedPost((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!id) {
      toast.message("Missing id!");
      return;
    }

    setSubmitting(true);
    try {
      if (!editedPost) {
        console.error("Missing post data");
        return;
      }
      console.log(editedPost);
      const response = await axios.patch(`/api/prompt/${id}`, {
        prompt: editedPost.prompt,
        tag: editedPost.tag,
      });

      if (response.status === 200) {
        const {message} = response.data;
        toast.success(message);
        onClose();
        router.push("/");
      } else {
        toast.error("Failed to update Prompt");
      }
    } catch (error) {
      console.log("Error occurred while updating Prompt", error);
      toast.error("Failed to update post");
    } finally {
      setSubmitting(false);
      onClose();
    }
    
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <div
        className={`fixed inset-0 z-40 bg-white/5 backdrop-blur-lg ${
          open ? "visible" : "hidden"
        }`}
      ></div>
      <DialogContent>
        <DialogTitle>Edit Post</DialogTitle>

        <form onSubmit={handleSubmit}>
          <div>
            <Textarea
              name="prompt"
              value={editedPost.prompt || ""}
              onChange={handleChange}
              placeholder="Prompt"
              rows={10}
              className="mb-4 w-full rounded-md border border-gray-300 p-2 text-sm focus:outline-none focus:ring focus:ring-blue-300"
            />

            <Textarea
              name="tag"
              value={editedPost.tag || ""}
              onChange={handleChange}
              placeholder="Type your message here."
              className="mb-4 w-full resize-y rounded-md border border-gray-300 p-2 text-sm focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>
          <DialogFooter className="flex-center mt-5 gap-4 border-t border-gray-100 pt-3">
            <button
              className="green_gradient cursor-pointer font-inter text-sm"
              type="button"
              onClick={onClose}
            >
              Cancel
            </button>{" "}
            <button
              type="submit"
              className="orange_gradient cursor-pointer font-inter text-sm"
            >
              {submitting ? "Submitting..." : "Update Changes"}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditDialogForm;
