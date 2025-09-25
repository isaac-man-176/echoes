import express from 'express';
import axios from 'axios';
import Echo from '../models/Echo.js'; // import your Mongoose model

const router = express.Router();

// Input validation middleware
const validateSearchInput = (req, res, next) => {
  const { query } = req.body;
  
  if (!query || query.trim().length === 0) {
    return res.status(400).json({ 
      error: 'Query is required and cannot be empty' 
    });
  }
  
  if (query.length > 500) {
    return res.status(400).json({ 
      error: 'Query too long. Maximum 500 characters allowed.' 
    });
  }
  
  req.body.query = query.trim();
  next();
};

router.post('/search-ai', validateSearchInput, async (req, res) => {
  const { query } = req.body;

  // Validate API key
  if (!process.env.GEMINI_API_KEY) {
    console.error('GEMINI_API_KEY is not configured');
    return res.status(500).json({ 
      error: 'Server configuration error: API key missing' 
    });
  }

  try {
    // Using Gemini 2.5 Pro model - check the exact model name in Google AI Studio
    const allEchoes = await Echo.find({})
  .sort({ createdAt: -1 }) // latest first
  .limit(50)               // limit to avoid too long prompts
  .lean();
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;
    const echoesText = allEchoes.map((e, i) => `Echo - Title: ${e.title} Author: ${e.author} Content: ${e.content}`).join('\n');
     const prompt = `User Query: "${query}"

Available Echoes (recent user contributions):
${echoesText}

Instructions:
1. Analyze the user's query and find the most relevant echoes
2. Provide a helpful summary or response that incorporates relevant echoes. Make sure to format answer by restating the general pathway the user 
is thinking about, and then say "Here are some similar echoes I heard:" and list the echoes with title, number, author, and paste the full message of the echo
3. If no echoes are relevant, provide a general helpful response
4. Keep the response concise and focused
5. Reference specific echoes when appropriate
6. If the query is inappropriate or violates guidelines, respond with a polite refusal

Response:`;


    const requestBody = {
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }]
        }
      ],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 500,  // Increased for better responses
        topP: 0.8,
        topK: 40
      },
      safetySettings: [
        {
          category: "HARM_CATEGORY_HARASSMENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_HATE_SPEECH", 
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_DANGEROUS_CONTENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        }
      ]
    };

    console.log('Making request to Gemini 2.5 Pro API...');
    
    const response = await axios.post(apiUrl, requestBody, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 15000, // 15 second timeout for more complex models
    });

    console.log('Gemini API Response received');

    // Handle response
    if (response.data.error) {
      console.error('Gemini API returned error:', response.data.error);
      return res.status(400).json({ 
        error: `AI service error: ${response.data.error.message}` 
      });
    }

    const candidates = response.data?.candidates;
    if (!candidates || candidates.length === 0) {
      // Check if there's a prompt feedback block
      if (response.data.promptFeedback?.blockReason) {
        return res.status(400).json({ 
          error: `Query blocked: ${response.data.promptFeedback.blockReason}` 
        });
      }
      
      return res.json({ 
        results: "No response generated. The query may have been blocked by safety filters.",
        originalQuery: query
      });
    }

    const content = candidates[0]?.content;
    const outputText = content?.parts?.[0]?.text || 
                      "I apologize, but I couldn't generate a response for that query.";

    // Check for safety ratings
    if (candidates[0]?.safetyRatings && candidates[0].safetyRatings.some(rating => 
        ['HIGH', 'MEDIUM'].includes(rating.probability))) {
      return res.json({ 
        results: "This response was filtered due to safety concerns.",
        originalQuery: query
      });
    }

    res.json({ 
      results: outputText,
      originalQuery: query,
      timestamp: new Date().toISOString(),
      model: "gemini-2.5-pro"
    });

  } catch (err) {
    console.error('Gemini API error details:', {
      message: err.message,
      code: err.code,
      status: err.response?.status,
      data: err.response?.data
    });

    // If 404, try alternative model endpoints
    if (err.response?.status === 404) {
      console.log('Model not found, you may need to check available models in Google AI Studio');
      
      return res.status(400).json({ 
        error: 'Model configuration error. Available models can be checked in Google AI Studio.',
        suggestion: 'Try using gemini-pro or gemini-1.5-flash model instead'
      });
    }

    if (err.response?.status === 400) {
      return res.status(400).json({ 
        error: 'Invalid request to AI service. Please check your query.' 
      });
    }

    if (err.response?.status === 429) {
      return res.status(429).json({ 
        error: 'Rate limit exceeded. Please try again later.' 
      });
    }

    if (err.code === 'ECONNABORTED') {
      return res.status(504).json({ 
        error: 'Request to AI service timed out' 
      });
    }

    res.status(500).json({ 
      error: 'Internal server error while processing your request' 
    });
  }
});

// Helper endpoint to check available models
router.get('/models', async (req, res) => {
  if (!process.env.GEMINI_API_KEY) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  try {
    const response = await axios.get(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`
    );
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch models' });
  }
});

export default router;