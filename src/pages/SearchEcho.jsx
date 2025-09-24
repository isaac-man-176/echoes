import { useState } from 'react';
import axios from 'axios';

export default function SearchEcho() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState('');

  const handleSearch = async () => {
    try {
      const response = await axios.post("https://echoes-ed6b.onrender.com/api/search-ai", { query });
      setResults(response.data.results);
    } catch (error) {
      console.error(error);
      setResults('Error fetching results');
    }
  };

  return (
    <div>
      <h2>Search Echoes</h2>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Ask about echoes..."
      />
      <button onClick={handleSearch}>Search</button>

      <div>
        <h3>Results:</h3>
        <pre>{results}</pre>
      </div>
    </div>
  );
}
