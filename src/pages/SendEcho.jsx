import React, { useState } from "react";
import API from "../api.js";
import "./SendEcho.css";

export default function SendEcho() {
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
      alert("Echo sent!");
    } catch (err) {
      console.error(err);
      alert("Failed to send echo.");
    }
  };

  return (
    <div className="send-echo-container">
      <h2>Send Echo</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title"></label>
          <input
            type="text"
            id="title"
            name="title"
            placeholder="Enter title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="author"></label>
          <input
            type="text"
            id="author"
            name="author"
            placeholder="Enter author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="content"></label>
          <textarea
            id="content"
            name="content"
            placeholder="Enter your message"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>

        <button type="submit">Send Echo</button>
      </form>
    </div>
  );
}
