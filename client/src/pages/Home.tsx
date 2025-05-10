import { Link } from "react-router-dom";
import CallToAction from "../components/CallToAction";
import { useEffect, useState } from "react";
import PostCard from "../components/PostCard";

interface Post {
  _id: string;
  slug?: string;
  image: string;
  title: string;
  category: string;
}

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const res = await fetch("/api/post/getposts");
      const data = await res.json();
      setPosts(data.posts);
    };
    fetchPosts();
  }, []);

  return (
    <div>
      <div className="flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold lg:text-6xl">Welcome to Mil Blog</h1>
        <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
          Dive into field reports, tactical analyses, and Mil insights shaped by
          real-world defense and innovation challenges. Curated for military
          minds and those who stand with them.
        </p>
        <Link
          to="/search"
          className="text-sm font-semibold text-[#4B5320] hover:text-white hover:bg-[#4B5320] border border-[#4B5320] px-4 py-2 w-fit rounded transition duration-200"
        >
          View all posts
        </Link>
      </div>

      <div className="p-3 dark:bg-slate-700">
        <CallToAction />
      </div>

      <div className="max-w-6xl mx-auto p-3 flex flex-col gap-8 py-7">
        {posts && posts.length > 0 && (
          <div className="flex flex-col gap-6">
            <h2 className="text-2xl font-semibold text-center">Recent Posts</h2>
            <div className="flex flex-wrap gap-4">
              {posts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
            <Link
              to={"/search"}
              className="text-lg text-#4B5320-500 hover:underline text-center"
            >
              View all posts
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
