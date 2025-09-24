import React, { useEffect, useState } from "react";
import API from "../api.js";

export default function ViewEchoes() {
  const [echoes, setEchoes] = useState([]);

  useEffect(() => {
    const fetchEchoes = async () => {
      try {
        const res = await API.get("/echoes");
        setEchoes(res.data);
      } catch (err) { console.error(err); }
    };
    fetchEchoes();
  }, []);

  return (
    <div>
      <h2>All Echoes</h2>
      {echoes.length === 0 ? <p>No echoes yet.</p> : echoes.map(e => (
        <div key={e._id}>
          <h3>{e.title}</h3>
          <p><strong>Author:</strong> {e.author}</p>
          <p>{e.content}</p>
        </div>
      ))}
    </div>
  );
}
