import React, { useEffect, useState } from "react";
import API from "../api.js";
import "./ViewEcho.css";

export default function ViewEchoes() {
  const [echoes, setEchoes] = useState([]);

  useEffect(() => {
    const fetchEchoes = async () => {
      try {
        const res = await API.get("/api/echoes");
        setEchoes(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchEchoes();
  }, []);

  return (
    <div className="view-echo-container">
      <h2>All Echoes</h2>
      {echoes.length === 0 ? (
        <p className="no-echoes">No echoes yet.</p>
      ) : (
        <div className="echo-grid">
          {echoes.map((e) => (
            <div key={e._id} className="echo-card">
              <h3>{e.title}</h3>
              <p><strong>Author:</strong> {e.author}</p>
              <p>{e.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
