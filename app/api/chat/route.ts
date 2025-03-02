import { NextResponse } from 'next/server';
import axios from 'axios';

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

export async function POST(request: Request) {
  try {
    console.log('=== Starting Groq API Request ===');
    
    // Log the raw request
    const rawBody = await request.text();
    console.log('Raw request body:', rawBody);
    
    // Parse the JSON (doing it separately to catch JSON parse errors)
    let message, conversationHistory, projectContext;
    try {
      const parsedBody = JSON.parse(rawBody);
      message = parsedBody.message;
      conversationHistory = parsedBody.conversationHistory;
      projectContext = parsedBody.projectContext;
    } catch (e) {
      console.error('JSON Parse Error:', e);
      return NextResponse.json({ error: 'Invalid JSON in request body' }, { status: 400 });
    }

    console.log('Project Context:', projectContext);
    
    // Check API key
    if (!process.env.GROQ_API_KEY) {
      console.error('Groq API key is missing in environment variables');
      console.log('Available env vars:', Object.keys(process.env));
      return NextResponse.json(
        { error: 'Groq API key is not configured' },
        { status: 500 }
      );
    }

    console.log('API Configuration:', {
      url: GROQ_API_URL,
      messageLength: message?.length || 0,
      historyLength: conversationHistory?.length || 0,
      apiKeyPresent: !!process.env.GROQ_API_KEY,
      apiKeyPrefix: process.env.GROQ_API_KEY?.substring(0, 8)
    });

    const requestBody = {
      model: 'mixtral-8x7b-32768',
      messages: [
        {
          role: 'system',
          content: `You are a helpful JSW Steel assistant that provides accurate information about steel projects and leads.
          
${projectContext ? `Project Context:
Title: ${projectContext.title}
Company: ${projectContext.company}
Value: ₹${projectContext.value} Cr
Description: ${projectContext.description}
Source URL: ${projectContext.source_url}` : 'No specific project context available.'}

Please provide accurate information about ${projectContext ? 'this project' : 'JSW Steel projects'} and help users with their queries. Focus on the steel requirements and technical aspects of the project.`
        },
        // Format conversation history to ensure alternating messages
        ...(conversationHistory || []).map((msg: { role: string; content: string }) => ({
          role: msg.role,
          content: msg.content
        })),
        {
          role: 'user',
          content: message
        }
      ],
      temperature: 0.7,
      max_tokens: 4096
    };

    console.log('Request payload to Groq:', JSON.stringify(requestBody, null, 2));

    console.log('Making request to Groq...');
    const response = await axios.post(
      GROQ_API_URL,
      requestBody,
      {
        headers: {
          'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000 // 30 second timeout
      }
    ).catch((error) => {
      console.error('=== Groq API Error Details ===');
      if (error.response) {
        console.error('Error Response:', {
          status: error.response.status,
          statusText: error.response.statusText,
          data: error.response.data,
          headers: error.response.headers
        });
        throw new Error(`Groq API Error (${error.response.status}): ${JSON.stringify(error.response.data)}`);
      } else if (error.request) {
        console.error('No Response Error:', {
          request: {
            method: error.request.method,
            path: error.request.path,
            headers: error.request.headers
          }
        });
        throw new Error('No response received from Groq API (timeout or network error)');
      } else {
        console.error('Request Setup Error:', error.message);
        throw error;
      }
    });

    console.log('Groq Response:', {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
      dataStructure: {
        hasChoices: !!response.data?.choices,
        choicesLength: response.data?.choices?.length,
        firstChoiceHasMessage: !!response.data?.choices?.[0]?.message,
        firstChoiceMessageLength: response.data?.choices?.[0]?.message?.content?.length
      }
    });

    if (!response.data?.choices?.[0]?.message?.content) {
      console.error('Invalid response format:', response.data);
      return NextResponse.json(
        { error: 'Invalid response format from Groq' },
        { status: 500 }
      );
    }

    const result = { content: response.data.choices[0].message.content };
    console.log('=== Successfully completed Groq request ===');
    console.log('Returning response with content length:', result.content.length);
    
    return NextResponse.json(result);
  } catch (error: unknown) {
    console.error('=== Groq API Fatal Error ===');
    console.error('Error details:', {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      isAxiosError: axios.isAxiosError(error),
    });
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
} 