"use client";

import { useEffect, useState } from "react";
import PromptCard from "./PromptCard";

const PromptCardList = ({ data, handleTagClick }) => {
  return (
    <div className="mt-16 prompt_layout">
      {data.map((post) => (
        <PromptCard key={post._id} post={post} handleTagClick={handleTagClick} />
      ))}
    </div>
  );
};

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [results, setResults] = useState(null);
  const [searchText, setSearchText] = useState("");

  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
  };

  useEffect(() => {
    if (searchText) {
      const searchTimeout = () =>
        setTimeout(() => {
          const searchResults = posts.filter((post) => {
            return (
              post.prompt.toLowerCase().includes(searchText.toLowerCase()) ||
              post.tag.toLowerCase().includes(searchText.toLowerCase()) ||
              post.creator.username.toLowerCase().includes(searchText.toLowerCase())
            );
          });
          // setPosts(searchResults);
          setResults(searchResults);
        }, 500);
      searchTimeout();
      return clearTimeout(searchTimeout);
    }
  }, [searchText]);

  const handleTagClick = (tag) => {
    setSearchText(tag);
  };

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch("/api/prompt");
      const data = await response.json();

      setPosts(data);
    };

    fetchPosts();
  }, []);

  return (
    <section className="feed">
      <form className="relative w-full flex-center ">
        <input
          style={{ color: "red" }}
          className="search_input peer"
          type="text"
          placeholder="Search for a tag or username"
          value={searchText}
          onChange={handleSearchChange}
          required
        />
      </form>

      <PromptCardList data={results ? results : posts} handleTagClick={handleTagClick} />
    </section>
  );
};

export default Feed;
