import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { PostType } from "./Type";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import { toast } from "sonner";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";

type EditDialogFormProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (postData: Partial<PostType>) => void;
  post: PostType | null;
  id: string;
};

const EditDialogForm: React.FC<EditDialogFormProps> = ({
  open,
  onClose,
  onSubmit,
  post,
  id,
}) => {
  const router = useRouter();
  const [editedPost, setEditedPost] = useState<Partial<PostType>>(post || {});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setEditedPost(post || {});
  }, [post]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedPost((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // NOTE: Handle the form submission, including uploading a new image if selected, updating the edited post, and closing the dialog
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!id) {
      toast.message("Missing id!");
      setSubmitting(false);
      return;
    }

    setSubmitting(true);
    try {
      if (!post) {
        console.error("Missing post data");
        return;
      }
      const response = await axios.patch(`/api/prompt/${id}`, {
        prompt: post.prompt,
        tag: post.tag,
      });

      if (response.status === 200) {
        router.push("/");
        onClose();
        toast.success("Prompt updated successfully");
      } else {
        toast.error("Failed to update Prompt");
      }
    } catch (error) {
      console.log("Error occured while updating Prompt", error);
      toast.error("Failed to update post");
    } finally {
      setSubmitting(false);
    }
    // onClose();
  };
  useEffect(() => {
    if (id.length < 1) {
      onClose();
    }
  }, [id, onClose]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Post</DialogTitle>
          {/* TODO: Fix this */}
          {/* @ts-ignore */}
          <DialogClose as={Cross2Icon} onClick={onClose} />
        </DialogHeader>
        {id ? <p>id: {id}</p> : null}
        <form onSubmit={handleSubmit}>
          <div>
            <input
              type="text"
              name="prompt"
              value={editedPost.prompt || ""}
              onChange={handleChange}
              placeholder="Prompt"
              style={{ width: "100%", marginBottom: "1rem" }}
            />
          </div>
          <DialogFooter>
            <button type="button" onClick={onClose}>
              Cancel
            </button>{" "}
            <button type="submit">
              {submitting ? "Submitting..." : "Update Changes"}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditDialogForm;
