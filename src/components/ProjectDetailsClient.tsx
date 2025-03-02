'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Message } from '@/types/chat';
import { v4 as uuidv4 } from 'uuid';

export default function ProjectDetailsClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const params = new URLSearchParams();
    searchParams.forEach((value, key) => {
      params.append(key, value);
    });

    // Create initial context message
    const contextMessage: Message = {
      id: uuidv4(),
      role: 'assistant',
      content: `I'm here to help you with information about the project: ${searchParams.get('title')} by ${searchParams.get('company')}. 
        The project has an estimated value of ₹${searchParams.get('value')} Cr.
        What would you like to know about this project?`,
      timestamp: new Date().toISOString(),
    };

    // Store the context message in localStorage
    localStorage.setItem('chatContext', JSON.stringify({
      message: contextMessage,
      projectContext: {
        title: searchParams.get('title'),
        company: searchParams.get('company'),
        value: searchParams.get('value'),
        description: searchParams.get('description'),
        source_url: searchParams.get('source_url')
      }
    }));

    // Redirect to home with params
    router.replace(`/?${params.toString()}`);
  }, [router, searchParams, mounted]);

  // Return null since this component only handles redirection
  return null;
} 