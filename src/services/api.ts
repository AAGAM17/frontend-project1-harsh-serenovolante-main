/* eslint-disable @typescript-eslint/no-unused-vars */
import axios from 'axios';
import { Message, ProjectInfo } from '../types/chat';
import { v4 as uuidv4 } from 'uuid';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const chatApi = {
  async sendMessage(projectId: string, content: string, projectInfo?: ProjectInfo): Promise<Message> {
    try {
      // Extract context from the current URL if available
      const currentUrl = window.location.href;
      let contextFromUrl = {};
      
      if (currentUrl.includes('project-details')) {
        const url = new URL(currentUrl);
        contextFromUrl = {
          title: url.searchParams.get('title') || '',
          company: url.searchParams.get('company') || '',
          value: url.searchParams.get('value') || '0',
          description: url.searchParams.get('description') || '',
          source_url: url.searchParams.get('source_url') || ''
        };
      }

      // Use context from URL or passed projectInfo
      const context = contextFromUrl || (projectInfo ? {
        title: projectInfo.title,
        company: projectInfo.company,
        value: projectInfo.value,
        description: projectInfo.description,
        source_url: projectInfo.source_url
      } : undefined);

      // Create user message
      const userMessage: Message = {
        id: uuidv4(),
        role: 'user',
        content,
        timestamp: new Date().toISOString(),
      };

      // Construct the request with project context
      const requestData = {
        message: content,
        conversationHistory: [],
        projectContext: context
      };

      // Send message to Perplexity API
      const response = await api.post('/api/chat', requestData);

      // Create assistant message from response
      const assistantMessage: Message = {
        id: uuidv4(),
        role: 'assistant',
        content: response.data.content,
        timestamp: new Date().toISOString(),
      };

      return assistantMessage;
    } catch (error) {
      console.error('Error in sendMessage:', error);
      throw error;
    }
  },

  async getProjectInfo(projectId: string): Promise<ProjectInfo> {
    const response = await api.get(`/api/project/${projectId}`);
    return response.data;
  },

  async initializeChat(projectId: string): Promise<{
    messages: Message[];
    projectInfo: ProjectInfo;
  }> {
    const projectInfo = await this.getProjectInfo(projectId);
    
    const initialMessage: Message = {
      id: uuidv4(),
      role: 'assistant',
      content: `I'm here to help you with information about the project: ${projectInfo.title} by ${projectInfo.company}. 
        The project has an estimated value of ₹${projectInfo.value} Cr.
        What would you like to know about this project?`,
      timestamp: new Date().toISOString(),
    };

    return {
      messages: [initialMessage],
      projectInfo,
    };
  },
}; 