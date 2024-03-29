import React from "react";
import { IPost } from "../../types/Type";
import PostCard from "./PostCard";

interface FeedProps {
  posts: IPost[];
  handleTagClick: (tag: string) => void; 
}

const Feed: React.FC<FeedProps> = ({ posts, handleTagClick }) => {
  return (
    <section className=" mx-[10px] mb-20 mt-10 min-h-[80vh] ">
      <div className="columns-1 gap-8 sm:columns-2 lg:columns-3">
        {posts.map((post) => (
          <div key={post.id} className="mb-8 break-inside-avoid">
            <PostCard post={post} handleTagClick={handleTagClick} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default Feed;
