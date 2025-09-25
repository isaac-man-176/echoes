import { useState } from 'react';
import axios from 'axios';
import './SearchEcho.css';

export default function SearchEcho() {
  const [query, setQuery] = useState('');
  const [aiText, setAiText] = useState('');
  const [echoCards, setEchoCards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setAiText('');
    setEchoCards([]);
    setHasSearched(true);

    try {
      const response = await axios.post(
        "https://echoes-ed6b.onrender.com/api/search-ai",
        { query }
      );

      console.log('=== RAW API RESPONSE ===');
      console.log('Raw API Response:', response.data);
      console.log('=======================');

      let data = response.data.results;

      if (typeof data === 'string') {
        // Clean the data first
        let cleanData = data
          .replace(/\*\*/g, '')
          .replace(/\*/g, '')
          .replace(/_/g, '')
          .replace(/"/g, '')
          .trim();

        console.log('=== CLEANED DATA ===');
        console.log('Cleaned data:', cleanData);
        console.log('===================');

        // Split into AI explanation and echoes section
        const echoesSectionStart = cleanData.toLowerCase().indexOf('here are some similar echoes i heard:');
        
        let explanation = '';
        let echoesText = '';
        
        if (echoesSectionStart > -1) {
          explanation = cleanData.substring(0, echoesSectionStart).trim();
          echoesText = cleanData.substring(echoesSectionStart + 'here are some similar echoes i heard:'.length).trim();
        } else {
          // Fallback: try to find where the actual echoes start
          const titleMatch = cleanData.match(/Title:\s*.+/i);
          if (titleMatch) {
            const titleStart = cleanData.indexOf(titleMatch[0]);
            explanation = cleanData.substring(0, titleStart).trim();
            echoesText = cleanData.substring(titleStart).trim();
          } else {
            explanation = cleanData;
            echoesText = '';
          }
        }
        
        setAiText(explanation);

        // Parse the echoes from the database format
        const echoes = [];
        
        if (echoesText) {
          // The echoes are in the format: "Title: [title] Author: [author] Content: [content]"
          // Split by lines and process each echo block
          const lines = echoesText.split('\n').filter(line => line.trim());
          
          console.log('=== ECHO LINES ===');
          lines.forEach((line, index) => {
            console.log(`Line ${index}:`, line);
          });
          console.log('==================');
          
          let currentEcho = {};
          
          lines.forEach((line) => {
            line = line.trim();
            
            // Check for Title line
            if (line.startsWith('Title:')) {
              // If we already have an echo, save it before starting a new one
              if (currentEcho.title && currentEcho.content) {
                echoes.push(currentEcho);
                currentEcho = {};
              }
              currentEcho.title = line.replace(/^Title:\s*/i, '').trim();
            }
            // Check for Author line
            else if (line.startsWith('Author:')) {
              currentEcho.author = line.replace(/^Author:\s*/i, '').trim();
            }
            // Check for Content line
            else if (line.startsWith('Content:')) {
              currentEcho.content = line.replace(/^Content:\s*/i, '').trim();
            }
            // If it's a continuation of content, add to current content
            else if (currentEcho.content && line) {
              currentEcho.content += ' ' + line;
            }
          });
          
          // Don't forget the last echo
          if (currentEcho.title && currentEcho.content) {
            echoes.push(currentEcho);
          }
          
          // If the above method didn't work, try regex parsing
          if (echoes.length === 0) {
            console.log('=== TRYING REGEX PARSING ===');
            // Use a more robust regex to capture the entire pattern
            const echoRegex = /Title:\s*([^\n]+?)\s*Author:\s*([^\n]+?)\s*Content:\s*([\s\S]*?)(?=\s*Title:\s*|$)/gi;
            let match;
            
            while ((match = echoRegex.exec(echoesText)) !== null) {
              const title = match[1].trim();
              const author = match[2].trim();
              const content = match[3].trim();
              
              if (title && content) {
                echoes.push({ title, author, content });
                console.log('Parsed echo:', { title, author, content });
              }
            }
          }
        }

        console.log('=== FINAL PARSED ECHOES ===');
        echoes.forEach((echo, index) => {
          console.log(`Echo ${index}:`, echo);
        });
        console.log('==========================');

        setEchoCards(echoes);

      } else if (Array.isArray(data)) {
        console.log('=== ARRAY RESPONSE ===');
        console.log('Array data:', data);
        console.log('=====================');
        setEchoCards(data);
        setAiText(data.length > 0 ? "Here are your results:" : "");
      }

    } catch (error) {
      console.error('Search error:', error);
      setAiText('Sorry, there was an error processing your search.');
      setEchoCards([{
        title: "Error",
        author: "",
        content: "Failed to fetch results. Please try again."
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="search-echo-container">
      <h2>Search Echoes</h2>

      <div className="search-input-container">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask about echoes..."
          disabled={loading}
        />
        <button onClick={handleSearch} disabled={loading}>
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      {aiText && (
        <div className="ai-explanation">
          <p>{aiText}</p>
        </div>
      )}

      <div className="echo-grid">
        {loading ? (
          <div className="loading-spinner">Searching for echoes...</div>
        ) : !hasSearched ? (
          <p className="no-echoes">Enter a search term to find echoes</p>
        ) : echoCards.length === 0 ? (
          <p className="no-echoes">No echoes found. Try a different search term.</p>
        ) : (
          echoCards.map((e, idx) => (
            <div key={idx} className="echo-card">
              <h3>{e.title}</h3>
              {e.author && e.author !== 'Unknown' && (
                <p className="echo-author">Author: {e.author}</p>
              )}
              <p className="echo-content">{e.content}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}