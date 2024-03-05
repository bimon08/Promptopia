import PromptCard from "./PromptCard";
import { PostType } from "./Type";
import EditDialogForm from "./EditDialogForm";
import { useState } from "react";

type ProfilePropsType = {
  name: string;
  desc: string;
  data: PostType[];
  handleEdit?: (post: PostType) => void;
  handleDelete?: (id: string) => void;
};

const Profile: React.FC<ProfilePropsType> = ({
  name,
  desc,
  data,
  handleEdit,
  handleDelete,
}) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);
  const [selectedPost, setSelectedPost] = useState<PostType | null>(null);
  const [isSelectedPostID, setIsSelectedPostID] = useState<string>("");
  const openEditDialog = (id: string) => {
    const post = data.find((post) => post.id === id);
    if (post) {
      setSelectedPost(post);
      setIsSelectedPostID(id);
      setIsEditDialogOpen(true);
    }
  };

  const closeEditDialog = () => {
    setIsSelectedPostID("");
    setIsEditDialogOpen(false);
  };

  const handleEditSubmit = (postData: Partial<PostType>) => {
    if (handleEdit && selectedPost) {
      handleEdit({ ...selectedPost, ...postData });
      setIsEditDialogOpen(false);
    }
  };
  return (
    <section className="w-full">
      <h1 className="head_text text-left">
        <span className="blue_gradient">{name} Profile</span>
      </h1>
      <p className="desc text-left">{desc}</p>

      <div className="prompt_layout mt-10">
        {/* Prompt Card List */}
        {data.map((post: PostType) => (
          <PromptCard
            key={post.id}
            post={post}
            handleEdit={() => openEditDialog(post.id ?? "")}
            handleDelete={() => {
              handleDelete && post.id && handleDelete(post.id);
            }}
          />
        ))}
      </div>

      <EditDialogForm
        open={isEditDialogOpen}
        onClose={closeEditDialog}
        onSubmit={handleEditSubmit}
        post={selectedPost}
        id={isSelectedPostID}
      />
    </section>
  );
};

export default Profile;
