import React, { useState } from "react";
import API from "../api.js";

export default function CreateEcho() {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/api/echoes", { title, author, content });
      setTitle("");
      setAuthor("");
      setContent("");
      alert("Echo created!");
    } catch (err) {
      console.error(err); alert("Failed to create echo.");
    }
  };

  return (
    <div>
      <h2>Create Echo</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} required />
        <input type="text" placeholder="Author" value={author} onChange={e => setAuthor(e.target.value)} required />
        <textarea placeholder="Content" value={content} onChange={e => setContent(e.target.value)} required />
        <button type="submit">Submit Echo</button>
      </form>
    </div>
  );
}
