import { PostType } from "./Type";
import UserProfile from "./UserProfile";
import PostContent from "./PostContent";
import { CardBody, CardContainer, CardItem } from "@src/components/ui/3d-card";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { useState, useMemo, useCallback } from "react";
import { motion } from "framer-motion";

type PromptCardProps = {
  post: PostType;
  handleEdit: () => void;
  handleDelete?: () => void;
  handleTagClick: (postTag: string) => void;
};

const PromptCard = ({
  post,
  handleEdit,
  handleDelete,
  handleTagClick,
}: PromptCardProps) => {
  const { data: session } = useSession();
  const pathName = usePathname();
  const router = useRouter();
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
  setCopied(post.prompt);
  console.log("Copied: ", post.prompt); // Check if state updates
  navigator.clipboard.writeText(post.prompt).catch((error) => {
    console.error("Error copying text: ", error);
  });
  setTimeout(() => setCopied(""), 3000);
}, [post.prompt]);

  const isOwnerViewing =
    session?.user?.id === post?.user?.id && pathName === "/profile";

   const cardVariants = {
     hidden: { opacity: 0, y: 50 },
     visible: { opacity: 1, y: 0 },
  };
  


  return (
    <motion.div
      className="max-w-[350px]  rounded-lg bg-slate-200 shadow-lg"
      initial="hidden"
      animate="visible"
      variants={cardVariants}
      transition={{ duration: 0.5 }}
    >
      <CardContainer className=" max-w-full ">
        <CardBody className="relative flex h-auto flex-col items-center gap-8  rounded-xl">
          <CardItem className="mt-6 px-6 text-xl font-bold text-neutral-600 dark:text-white ">
            <UserProfile
              post={post}
              onClick={handleProfileClick}
              copied={copied}
              handleCopy={handleCopy}
            />
          </CardItem>
          <CardItem className="flex flex-col items-center">
            <PostContent post={post} handleTagClick={handleTagClick} />
          </CardItem>
          <CardItem translateZ={10}>
            {isOwnerViewing && (
              <div className="flex-center mb-5 gap-4">
                <p
                  className="green_gradient cursor-pointer font-inter text-sm"
                  onClick={handleEdit}
                >
                  Edit
                </p>
                <p
                  className="orange_gradient cursor-pointer font-inter text-sm"
                  onClick={handleDelete}
                >
                  Delete
                </p>
              </div>
            )}
          </CardItem>
        </CardBody>
      </CardContainer>
    </motion.div>
  );
};

export default PromptCard;
