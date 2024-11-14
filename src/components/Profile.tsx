import { IPost } from "../../types/Type";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DialogForm from "./DialogForm";
import PostCard from "./PostCard";

type ProfilePropsType = {
  name: string;
  desc: string;
  data?: any;
  posts: IPost[];
  handleEdit?: (post: IPost) => void;
  handleDelete?: (post: IPost) => void;
};

const Profile: React.FC<ProfilePropsType> = ({
  name,
  desc,
  data,
  posts,
  handleEdit,
  handleDelete,
}) => {
  const router = useRouter();
  const [selectedPost, setSelectedPost] = useState<IPost | null>(null);
  const [isSelectedPostID, setIsSelectedPostID] = useState<string>("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  

const closeDialog = () => {
  setIsDialogOpen(false);
  setSelectedPost(null); 
};

 const handleEditSubmit = (postData: Partial<IPost>) => {
  if (handleEdit && selectedPost) {
    handleEdit({
      ...selectedPost,
      ...postData,
      audioUrl: postData.audioUrl || selectedPost.audioUrl,
    });
    setIsDialogOpen(false);
    window.location.reload();
    router.push("/profile");
  }
};

  const handleEditClick = (post: IPost) => {
    setSelectedPost(post);
    setIsDialogOpen(true);
    setIsSelectedPostID(post.id?.toString() || "");
  };

  return (
    <section className="mx-[10px] mb-20 mt-10 min-h-[80vh]">
      <div className="container mb-10 flex flex-col items-center justify-center">
        <h1 className="mx-[70px] text-center text-2xl font-bold text-white sm:mb-4 sm:text-left sm:text-5xl md:text-7xl">
          <span>{name}&apos;s Profile</span>
        </h1>
        <p className="desc mx-[70px] whitespace-pre-line text-center text-sm font-light leading-snug text-white sm:text-left sm:text-2xl md:text-base">
          {desc}
        </p>
      </div>

      <div className="mx-[70px] min-h-full max-w-full columns-1 gap-8 lg:columns-2">
        {posts.map((post) => (
          <div key={post.id} className="mb-8 break-inside-avoid">
            <PostCard
              post={post}
              handleEdit={() => handleEditClick(post)}
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
