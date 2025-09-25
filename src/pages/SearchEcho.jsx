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

        // Extract AI explanation (look for patterns like "similar echoes I heard")
        let explanation = '';
        if (cleanData.includes('similar echoes I heard') || cleanData.includes('initiating a conversation')) {
          const explanationEnd = cleanData.indexOf('Ec') > -1 ? cleanData.indexOf('Ec') : 
                               cleanData.indexOf('Echo') > -1 ? cleanData.indexOf('Echo') : -1;
          
          if (explanationEnd > 0) {
            explanation = cleanData.substring(0, explanationEnd).trim();
          } else {
            // Find the first line that looks like an echo start
            const lines = cleanData.split('\n');
            for (let i = 0; i < lines.length; i++) {
              if (lines[i].match(/^(Ec|Echo|Testing|Result)\s*\d*/i)) {
                explanation = lines.slice(0, i).join(' ').trim();
                break;
              }
            }
          }
        }
        
        setAiText(explanation || "Here's what I found:");

        // Parse the specific format: "Ec\nAuthor: Dev\nEcho 3 by dev: testing"
        const echoes = [];
        const lines = cleanData.split('\n').filter(line => line.trim());
        
        console.log('=== ALL LINES ===');
        lines.forEach((line, index) => {
          console.log(`Line ${index}:`, line);
        });
        console.log('================');
        
        let currentEcho = null;
        
        for (let i = 0; i < lines.length; i++) {
          const line = lines[i].trim();
          
          // Check if this line starts a new echo (Ec, Echo, Testing, etc.)
          if (line.match(/^(Ec|Echo|Testing|Result)\s*\d*/i) && 
              i + 1 < lines.length && lines[i + 1].trim().startsWith('Author:')) {
            
            // Save previous echo if exists
            if (currentEcho) {
              echoes.push(currentEcho);
            }
            
            // Extract title from first line
            const title = line.replace(/^Ec\s*/i, 'Echo ').trim();
            
            // Extract author from next line
            const authorLine = lines[i + 1].trim();
            const authorMatch = authorLine.match(/Author:\s*(.+)/i);
            const author = authorMatch ? authorMatch[1].trim() : 'Dev';
            
            // Look for content in subsequent lines
            let content = '';
            if (i + 2 < lines.length) {
              // Get the next line which should contain the actual echo content
              const contentLine = lines[i + 2].trim();
              
              console.log('=== CONTENT LINE ANALYSIS ===');
              console.log('Original content line:', contentLine);
              
              // Remove any "Echo X by dev:" prefix from the content
              content = contentLine.replace(/Echo\s+\d+\s+by\s+[^:]+:\s*/i, '').trim();
              
              console.log('After removing Echo prefix:', content);
              console.log('============================');
              
              // Skip the author line since we've used it
              i += 1;
            }
            
            currentEcho = {
              title: title,
              author: author,
              content: content || 'Content not available'
            };
            
            console.log('=== PARSED ECHO ===');
            console.log('Title:', currentEcho.title);
            console.log('Author:', currentEcho.author);
            console.log('Content:', currentEcho.content);
            console.log('==================');
            
            // Skip the content line since we've used it
            i += 1;
          }
        }
        
        // Don't forget the last echo
        if (currentEcho) {
          echoes.push(currentEcho);
        }

        // If no echoes found with the expected format, try alternative parsing
        if (echoes.length === 0) {
          console.log('=== FALLBACK PARSING ===');
          // Fallback: look for any lines that contain actual content
          lines.forEach((line, index) => {
            // Skip lines that are part of the AI explanation
            if (!line.includes('similar echoes') && 
                !line.includes('initiating a conversation') &&
                line.trim() && 
                line !== 'Hi') {
              
              console.log(`Fallback line ${index}:`, line);
              
              // Check if this line contains an echo pattern
              const echoMatch = line.match(/(Echo\s+\d+)\s+by\s+([^:]+):\s*(.+)/i);
              if (echoMatch) {
                echoes.push({
                  title: echoMatch[1].trim(),
                  author: echoMatch[2].trim(),
                  content: echoMatch[3].trim()
                });
              } else {
                // Just use the line as content
                echoes.push({
                  title: `Result ${index + 1}`,
                  author: 'Dev',
                  content: line.trim()
                });
              }
            }
          });
          console.log('======================');
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