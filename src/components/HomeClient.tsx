'use client';

import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Message, ChatState, ProjectInfo } from '@/types/chat';
import { useSearchParams } from 'next/navigation';
import { Chat } from './Chat';

export default function HomeClient() {
  const [chatState, setChatState] = useState<ChatState>({
    messages: [],
    isLoading: false,
    error: null,
    projectInfo: null
  });
  const searchParams = useSearchParams();

  useEffect(() => {
    // Extract context from URL parameters or localStorage
    const title = searchParams.get('title');
    
    // Default welcome message if no parameters are present
    if (!title) {
      const defaultMessage: Message = {
        id: uuidv4(),
        role: 'assistant',
        content: 'Welcome to JSW Steel Leads Chat. Please provide project details to continue.',
        timestamp: new Date().toISOString(),
      };
      setChatState(prev => ({
        ...prev,
        messages: [defaultMessage]
      }));
      return;
    }

    // If title exists, proceed with project info
    const projectInfo: ProjectInfo = {
      title,
      company: searchParams.get('company'),
      value: searchParams.get('value'),
      description: searchParams.get('description'),
      source_url: searchParams.get('source_url')
    };
    
    // Try to get stored context message
    const storedContext = localStorage.getItem('chatContext');
    if (storedContext) {
      try {
        const { message } = JSON.parse(storedContext);
        setChatState(prev => ({
          ...prev,
          messages: [message],
          projectInfo
        }));
        localStorage.removeItem('chatContext');
      } catch (error) {
        console.error('Error parsing stored context:', error);
        const welcomeMessage: Message = {
          id: uuidv4(),
          role: 'assistant',
          content: `I'm here to help you with information about the project: ${projectInfo.title} by ${projectInfo.company}. 
            The project has an estimated value of ₹${projectInfo.value} Cr.
            What would you like to know about this project?`,
          timestamp: new Date().toISOString(),
        };
        setChatState(prev => ({
          ...prev,
          messages: [welcomeMessage],
          projectInfo
        }));
      }
    } else {
      const welcomeMessage: Message = {
        id: uuidv4(),
        role: 'assistant',
        content: `I'm here to help you with information about the project: ${projectInfo.title} by ${projectInfo.company}. 
          The project has an estimated value of ₹${projectInfo.value} Cr.
          What would you like to know about this project?`,
        timestamp: new Date().toISOString(),
      };
      setChatState(prev => ({
        ...prev,
        messages: [welcomeMessage],
        projectInfo
      }));
    }
  }, [searchParams]);

  return (
    <Chat 
      chatState={chatState}
      setChatState={setChatState}
      projectId={chatState.projectInfo?.title || ''}
    />
  );
} 