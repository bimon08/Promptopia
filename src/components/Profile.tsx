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
  setSelectedPost(null); // Reset selected post on dialog close
};

 const handleEditSubmit = (postData: Partial<IPost>) => {
  if (handleEdit && selectedPost) {
    // Retain any existing fields on selectedPost that are not in postData
    handleEdit({
      ...selectedPost,
      ...postData,
      audioUrl: postData.audioUrl || selectedPost.audioUrl,
    });
    setIsDialogOpen(false);
    window.location.reload();// This will force a reload of the page to reflect updated data
    router.push("/profile");
  }
};

  const handleEditClick = (post: IPost) => {
    setSelectedPost(post);
    setIsDialogOpen(true);
    setIsSelectedPostID(post.id?.toString() || "");
  };

  return (
    // <section className="contai ner mx-auto mb-20 mt-10 min-h-[80vh]">
    <section className="mx-[10px] mb-20 mt-10 min-h-[80vh]">
      <div className="container mb-40">
        <h1 className="mb-4 text-left text-5xl font-bold md:text-7xl">
          <span>{name}&apos;s Profile</span>
        </h1>
        <p className="desc whitespace-pre-line text-left text-sm font-light leading-snug md:text-base">
          {desc}
        </p>
      </div>

      {/* <div className="columns-1 gap-8 sm:columns-2 lg:columns-3"> */}
      <div className="columns-1 gap-8 sm:columns-2 lg:columns-3 mx-[70px]">
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
