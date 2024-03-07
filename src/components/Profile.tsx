import PromptCard from "./PromptCard";
import { PostType } from "./Type";
import EditDialogForm from "./EditDialogForm";
import { useState } from "react";
import { useRouter } from "next/navigation";

type ProfilePropsType = {
  name: string;
  desc: string;
  data: PostType[];
  handleEdit?: (post: PostType) => void;
  handleDelete?: (post: PostType) => void;
};

const Profile: React.FC<ProfilePropsType> = ({
  name,
  desc,
  data,
  handleEdit,
  handleDelete,
}) => {
  const router = useRouter();
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



 const handleEditClick = (post: PostType) => {
   router.push(`/update-prompt?id=${post.id}`);
 };

  return (
    <section className="w-full">
      <h1 className="head_text text-left">
        <span className="blue_gradient">{name} Profile</span>
      </h1>
      <p className="desc text-left">{desc}</p>

      <div className="prompt_layout mt-10">
        {data.map((post: PostType) => (
          <PromptCard
            key={post.id}
            post={post}
                handleEdit={() => handleEditClick(post)}
            handleDelete={() => handleDelete && handleDelete(post)}
            handleTagClick={() => null}
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
