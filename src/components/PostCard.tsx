import { IPost } from "../../types/Type";
import UserProfile from "./UserProfile";
import PostContent from "./PostContent";
import { CardBody, CardContainer, CardItem } from "@src/components/ui/3d-card";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { useState, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import { cn } from "@src/lib/utils";
import { useTheme } from "next-themes";

type PostCardProps = {
  post: IPost;
  handleEdit?: () => void;
  handleDelete?: () => void;
  handleTagClick: (postTag: string) => void;
};

const PostCard = ({
  post,
  handleEdit,
  handleDelete,
  handleTagClick,
}: PostCardProps) => {
  const { data: session } = useSession();
  const pathName = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  const [copied, setCopied] = useState<string>("");

  const isUserProfile = useMemo(
    () => post?.user?.email === session?.user?.email,
    [post, session],
  );

  const handleProfileClick = useCallback(() => {
    const profilePath = isUserProfile
      ? "/profile"
      : `/profile/${post.user?.id}?name=${post.user?.username}`;
    router.push(profilePath);
  }, [router, isUserProfile, post.user]);

  const handleCopy = useCallback(() => {
    setCopied(post.message);
    console.log("Copied: ", post.message);
    navigator.clipboard.writeText(post.message).catch((error) => {
      console.error("Error copying text: ", error);
    });
    setTimeout(() => setCopied(""), 3000);
  }, [post.message]);

  const isOwnerViewing =
    session?.user?.id === post?.user?.id && pathName === "/profile";

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
  className={cn(
    "rounded-2xl shadow-lg transition-shadow duration-300 hover:shadow-xl",
    theme === "light" ? "bg-slate-200" : "bg-slate-800"
  )}
  initial="hidden"
  animate="visible"
  variants={cardVariants}
  transition={{ duration: 0.5 }}
  layout
>
  <CardContainer className="md:px-4">
    <CardBody className="relative flex h-auto flex-col items-center gap-8 rounded-2xl md:px-4">
      <CardItem className="mt-6 px-8 text-xl font-bold md:px-4">
        <UserProfile post={post} onClick={handleProfileClick} copied={copied} handleCopy={handleCopy} />
      </CardItem>
      <CardItem translateZ={20} className="flex flex-col items-center md:px-4">
        <PostContent post={post} handleTagClick={handleTagClick} />
      </CardItem>
      {isOwnerViewing && (
        <CardItem className="mb-5 flex justify-center gap-4 rounded-b-2xl p-2 md:p-4">
          <button
            className={cn(
              "rounded-3xl px-4 py-2 transition-colors duration-300 hover:text-green-600 md:px-8",
              theme === "light" ? "bg-slate-300" : "bg-slate-700"
            )}
            onClick={handleEdit}
          >
            Edit
          </button>
          <button
            className={cn(
              "rounded-3xl px-4 py-2 transition-colors duration-300 hover:text-red-600 md:px-8",
              theme === "light" ? "bg-slate-300" : "bg-slate-700"
            )}
            onClick={handleDelete}
          >
            Delete
          </button>
        </CardItem>
      )}
    </CardBody>
  </CardContainer>
</motion.div>
  );
};

export default PostCard;
