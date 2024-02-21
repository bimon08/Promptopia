import PromptCard from "./PromptCard";
import { PostType } from "./Type";

type ProfilePropsType = {
  name: string;
  desc: string;
  data: PostType[];
  handleEdit?: (post: PostType) => void;
  handleDelete?: (post: PostType) => void;
  handleTagClick?: (postTag: string) => void;
};

const Profile = ({
  name,
  desc,
  data,
  handleEdit,
  handleDelete,
}: ProfilePropsType) => {
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
            key={post._id}
            post={post}
            handleEdit={() => handleEdit && handleEdit(post)}
            handleDelete={() => handleDelete && handleDelete(post)}
          />
        ))}
      </div>
    </section>
  );
};

export default Profile;
