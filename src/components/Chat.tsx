'use client';

/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { ChatInput } from './ChatInput';
import { Message as MessageComponent } from './Message';
import { ChatState, Message } from '@/types/chat';
import { v4 as uuidv4 } from 'uuid';
import { PersonDetails } from './SearchRoles';
import ContactsList from './ContactList';
import { ResizableBox } from "react-resizable";
import "react-resizable/css/styles.css"; 
import DraggableResizableIframe from './TheOrgEmbed';
import { Button } from '@/components/ui/button';
import SlidingSheet from './SlidingSheet';
import Image from 'next/image';

interface ChatProps {
  chatState: ChatState;
  setChatState: React.Dispatch<React.SetStateAction<ChatState>>;
  projectId: string;
}

export const Chat: React.FC<ChatProps> = ({ chatState, setChatState, projectId }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();
  const [embedUrl, setEmbedUrl] = useState<string | null>(null);
  const [showOrgChart, setShowOrgChart] = useState(false);
  const [showSlidingSheet, setShowSlidingSheet] = useState(false);

  const fetchCompanyOrgChart = async () => {
    try {
      console.log(searchParams.get('company_domain'));
      const response = await fetch(`https://api.theorg.com/v1/companies/search?domain=${searchParams.get('company_domain')}`, {method: "GET", headers: {
        'X-API-KEY': 'aec9bff984c043df8b1b9739f6032f6d'}});
  
      if (!response.ok) {
        throw new Error("Failed to fetch company data");
      }
  
      const data = await response.json();
      setEmbedUrl(data.companies?.[0]?.embedUrl || null); 
      return data.companies?.[0]?.embedUrl || null; // Return first company's embed URL
    } catch (error) {
      console.error("Error fetching company org chart:", error);
      return null;
    }
  };
  

  useEffect(() => {
    // Extract context from URL parameters
    const title = searchParams.get('title');
    if (title && chatState.messages.length === 0) {
      const welcomeMessage: Message = {
        id: uuidv4(),
        role: 'assistant',
        content: `I&apos;m here to help you with information about the project: ${title} by ${searchParams.get('company')}. 
          The project has an estimated value of ₹${searchParams.get('value')} Cr.
          What would you like to know about this project?`,
        timestamp: new Date().toISOString(),
      };

      setChatState(prev => ({
        ...prev,
        messages: [welcomeMessage],
        projectInfo: {
          title,
          company: searchParams.get('company'),
          value: searchParams.get('value'),
          description: searchParams.get('description'),
          source_url: searchParams.get('source_url')
        }
      }));
    }
    fetchCompanyOrgChart()
  }, [searchParams, chatState.messages.length, setChatState]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatState.messages]);

  const handleSendMessage = async (content: string) => {
    if (!content.trim() || chatState.isLoading) return;

    try {
      setChatState(prev => ({
        ...prev,
        isLoading: true,
        error: null
      }));

      // Add user message
      const userMessage: Message = {
        id: uuidv4(),
        role: 'user',
        content: content.trim(),
        timestamp: new Date().toISOString(),
      };

      setChatState(prev => ({
        ...prev,
        messages: [...prev.messages, userMessage]
      }));

      // Get AI response
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: content,
          conversationHistory: chatState.messages,
          projectContext: chatState.projectInfo
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get response');
      }

      // Add AI response
      setChatState(prev => ({
        ...prev,
        messages: [...prev.messages, {
          id: uuidv4(),
          role: 'assistant',
          content: data.content,
          timestamp: new Date().toISOString(),
        }],
        isLoading: false
      }));
    } catch (error) {
      setChatState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'An error occurred'
      }));
    }
  };
  const handleContacts = () => {
    setShowSlidingSheet(true);
    setShowOrgChart(false);
  }

  return (
    <div className="flex flex-col h-screen bg-white">
      <header className="py-3 px-4 border-b border-[#E5E5E5] bg-white flex items-center justify-between relative">
        <div className="flex items-center">
          <Image src="/jsw_logo.png" alt="JSW Steel Logo" className="h-8 w-8 mr-2" width={32} height={32} />
          <h1 className="text-lg font-medium text-[#1a1a1a]"><span className='hidden lg:inline md:inline'>JSW Steel</span> Leads Chat</h1>
        </div>

        <div className="flex space-x-4 ml-auto">  
          <Button onClick={() => setShowOrgChart(!showOrgChart)} className="bg-gray-500 hover:bg-gray-300 transition duration-300">Org Chart</Button>
          <Button onClick={handleContacts} className="bg-gray-500 hover:bg-gray-300 transition duration-300">Contacts</Button>
        </div>

        <DraggableResizableIframe embedUrl={embedUrl ?? ''} showOrgChart={showOrgChart} />
      </header>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto py-4">
          {chatState.messages.map((message) => (
            <MessageComponent
              key={message.id}
              content={message.content}
              role={message.role}
              timestamp={new Date(message.timestamp)}
            />
          ))}
          {chatState.error && (
            <div className="text-red-500 text-center py-2">
              {chatState.error}
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <ChatInput onSendMessage={handleSendMessage} isLoading={chatState.isLoading} />

      <SlidingSheet isOpen={showSlidingSheet} onClose={() => setShowSlidingSheet(false)} />
    </div>
  );
}; 