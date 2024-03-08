import { IPost } from "../../types/Type";
import { useState } from "react";
import { useRouter } from "next/navigation";
import DialogForm from "./DialogForm";
import { toast } from "sonner";
import MessageCard from "./MessageCard";

type ProfilePropsType = {
  name: string;
  desc: string;
  data: IPost[];
  handleEdit?: (post: IPost) => void;
  handleDelete?: (post: IPost) => void;
};

const Profile: React.FC<ProfilePropsType> = ({
  name,
  desc,
  data,
  handleEdit,
  handleDelete,
}) => {
  const router = useRouter();
  const [selectedPost, setSelectedPost] = useState<IPost | null>(null);
  const [isSelectedPostID, setIsSelectedPostID] = useState<string>("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const closeDialog = () => {
    setIsDialogOpen(!isDialogOpen);
  };

  const handleEditSubmit = (postData: Partial<IPost>) => {
    if (handleEdit && selectedPost) {
      handleEdit({ ...selectedPost, ...postData });
      setIsDialogOpen(false);
    }
  };

  const handleEditClick = (post: IPost) => {
    setSelectedPost(post);
    setIsDialogOpen(true);
    setIsSelectedPostID(post.id?.toString() || "");
  };

  return (
    <section className="w-full">
      <h1 className="head_text text-left">
        <span className="blue_gradient">{name} Profile</span>
      </h1>
      <p className="desc text-left">{desc}</p>

      <div
        className=" mt-10"
        style={{
          columnCount: 2,
          columnGap: "32px",
        }}
      >
        {data.map((post) => (
          <div
            key={post.id}
            className="break-inside-avoid "
            style={{ breakInside: "avoid", marginBottom: "32px" }}
          >
            <MessageCard
              key={post.id}
              post={post}
              handleEdit={() => {
                handleEditClick(post);
              }}
              handleDelete={() => handleDelete && handleDelete(post)}
              handleTagClick={() => null}
            />
          </div>
        ))}
      </div>

      <DialogForm
        open={isDialogOpen}
        onClose={closeDialog}
        onSubmit={handleEditSubmit}
        post={selectedPost}
        id={isSelectedPostID}
      />
    </section>
  );
};

export default Profile;
