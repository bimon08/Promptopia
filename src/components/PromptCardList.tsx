import PromptCard from "./PromptCard";

interface PromptCardListProps {
    data: any[];
    handleTagClick?: (tag: string) => void;
}




export const PromptCardList = ({ data, handleTagClick }: PromptCardListProps) => {
  return (
    <div className="mt-16 prompt_layout">
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