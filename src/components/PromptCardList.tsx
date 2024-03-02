import PromptCard from "./PromptCard";
import { PostType } from "./Type";

interface PromptCardListProps {
  data: PostType[];
  handleTagClick?: (tag: string) => void;
  handleDelete?: (id: string) => void;
}

export const PromptCardList = ({
  data,
  handleTagClick,
}: PromptCardListProps) => {
  return (
    <div className="prompt_layout mt-16">
      {data.map((post) => (
        <PromptCard
          key={post._id}
          post={post}
          handleTagClick={handleTagClick}
        />
      ))}
    </div>
  );
};
