import React from 'react';

interface MessageProps {
  content: string;
  role: 'system' | 'user' | 'assistant';
  timestamp: Date;
}

export const Message: React.FC<MessageProps> = ({ content, role, timestamp }) => {
  const isUser = role === 'user';
  
  const handleDraftEmail = () => {
    // Extract relevant information from the message content
    const subject = 'Project Information';
    const body = content.replace(/\n/g, '%0D%0A'); // Replace newlines with URL-encoded line breaks
    
    // Create mailto link
    const mailtoLink = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    // Open default email client
    window.location.href = mailtoLink;
  };

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-3 ${
          isUser
            ? 'bg-[#F8F8F8] text-black'
            : 'text-black'
        }`}
      >
        <p className="text-[15px] leading-relaxed whitespace-pre-wrap">{content}</p>
        <div className="flex justify-between items-center mt-2">
          <p className={`text-xs ${isUser ? 'text-[#999999]' : 'text-[#999999]'}`}>
            {new Date(timestamp).toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit',
              hour12: true 
            })}
          </p>
          {!isUser && content.toLowerCase().includes('email') && (
            <button
              onClick={handleDraftEmail}
              className="text-xs text-[#67B7F7] hover:text-[#5aa6e6] ml-4"
            >
              Draft Email
            </button>
          )}
        </div>
      </div>
    </div>
  );
}; 