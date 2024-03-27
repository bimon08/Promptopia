import { IPost } from "../../types/Type";
import { useState } from "react";
import { useRouter } from "next/navigation";
import DialogForm from "./DialogForm";
import PostCard from "./PostCard";

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
    
    <section className="container mx-auto mb-20 mt-10 min-h-[80vh]">
      <div className="container mb-40">
        <h1 className="mb-4 text-left text-5xl font-bold md:text-7xl">
          <span className="">{name}'s Profile</span>
        </h1>
        <p className="desc whitespace-pre-line text-left text-sm font-light leading-snug md:text-base">
          {desc}
        </p>
      </div>

      <div className="container columns-1 gap-8 sm:columns-2 lg:columns-3">
        {data.map((post) => (
          <div key={post.id} className="mb-8 break-inside-avoid">
            <PostCard
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
