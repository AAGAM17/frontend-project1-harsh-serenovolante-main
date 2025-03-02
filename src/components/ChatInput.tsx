import React, { useState } from 'react';

interface ChatInputProps {
  onSendMessage: (message: string) => Promise<void>;
  isLoading: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading }) => {
  const [message, setMessage] = useState('');

  const handleSendMessage = async () => {
    if (message.trim() && !isLoading) {
      try {
        await onSendMessage(message.trim());
        setMessage('');
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  const handleKeyPress = async (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      await handleSendMessage();
    }
  };

  const handleDraftMail = async () => {
    if (!isLoading) {
      const emailPrompt = `""You are a sales executive at JSW Steel drafting a tailored email to a client (Bombardier/L&T) that has won a metro rail project. Use the provided project details, estimated steel requirements, and JSW Steel’s product portfolio to create a persuasive, professional proposal. Follow this structure:

Email Structure Guidelines

Subject Line: Clear and action-oriented (e.g., “JSW Steel Proposal for Bombardier’s 61.785 km Metro Rail Project – Timely Supply Assurance”).
Opening:
Congratulate the client on winning the contract.
Briefly mention JSW Steel’s expertise in metro rail projects (e.g., “We’ve supplied steel for 450+ km of metro lines across India”).
Tailored Recommendations:
Primary Product (TMT Bars): Highlight JSW NeoSteel 550D/600 for pillars, viaducts, and seismic resistance. Include the estimated requirement (~5,700MT).
Secondary Products:
Hot Rolled Steel: Emphasize structural applications (e.g., platforms, brackets).
Electrical Steel: Link to traction systems/transformers.
Galvalume Steel: Mention corrosion resistance for roofing/cladding.
Tertiary Product (Special Alloy Steel): Position for precision components (gears, bearings).
Sales Team Coordination: Clarify that dedicated teams for each product category (Long/Flat Products) will handle their requirements.
Timeline Alignment: Reference the project dates (Feb 2025–Feb 2026) and assure phased delivery.
Value Add: Mention JSW’s logistics network, quality certifications (IS/ISO), and ESG compliance.
Closing: Propose a meeting/call with Karthick Nathan (CC relevant regional managers).
Key Data to Integrate:

Client: Bombardier (procurement manager: Karthick Nathan, email: karthick@lntecc.com).
Project: 61.785 km metro rail.
Requirements:
TMT Bars (~5,700MT)
Hot Rolled (~1,600MT)
Electrical Steel (~1,000MT)
Galvalume Steel (~800MT)
Special Alloy Steel (~800MT)
Sales Teams:
Long Products Team: TMT Bars, Special Alloy Steel.
Flat Products Team: Hot Rolled, Electrical Steel, Galvalume.
Tone & Style:

Professional yet proactive: Avoid jargon, focus on solutions.
Confident: Highlight JSW’s market leadership (e.g., “India’s largest steel producer for 13+ years”).
Collaborative: Use phrases like “partnering for success” or “tailored to your project’s scale.”
Example Output:

Subject: JSW Steel Partnership Proposal – Bombardier’s 61.785 km Metro Rail Project

Dear Mr. Karthick Nathan,

Congratulations to Bombardier on securing the prestigious 61.785 km metro rail project! At JSW Steel, we understand the critical role of high-quality steel in delivering resilient urban infrastructure and are keen to support your vision.

Why JSW Steel?

Supplied 480+ km of metro rail tracks & structures nationwide.
Dedicated teams for seamless coordination:
Long Products Team: TMT Bars (JSW NeoSteel 550D/600) for viaducts, pillars, and seismic-resistant foundations.
Flat Products Team: Hot Rolled plates for structural brackets, Electrical Steel for traction systems, and Galvalume for corrosion-resistant roofing.
Proposed Supply Plan:

TMT Bars: ~5,700MT of JSW NeoSteel 550D (IS 1786-certified) – phased delivery aligned with your Feb 2025–2026 timeline.
Hot Rolled Steel: ~1,600MT for fabrication of platforms and support structures.
Electrical Steel: ~1,000MT of CRGO coils for transformers and power distribution.
Galvalume: ~800MT of AL-ZN coated sheets for station roofing (30-year durability).
Special Alloy Steel: ~800MT for precision components like bearings and gears.
Our teams will ensure 100% traceability, Just-in-Time delivery, and ESG-compliant sourcing. Let’s schedule a call to finalize timelines and introduce you to our product specialists.

Best regards,
[Your Name]
Regional Sales Head – Infrastructure Projects
JSW Steel
[Your Contact Details]
[CC: Regional Managers for Long & Flat Products]

`;

      await onSendMessage(emailPrompt);
    }
  };

  const handleGetMoreInfo = () => {
    window.location.href = 'https://aijsw.vercel.app';
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white">
      <div className="max-w-3xl mx-auto px-4 py-5 space-y-3">
      <div className="grid grid-cols-2 gap-3">
          <button
            onClick={handleDraftMail}
            disabled={isLoading}
            className="hover:bg-[#898989] hover:bg-opacity-10 border border-[#E5E5E5] border-[1.5px] text-black text-sm font-medium rounded-[10px] py-3 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Draft a Mail
          </button>
          <button
            onClick={handleGetMoreInfo}
            className="hover:bg-[#898989] hover:bg-opacity-10 border border-[#E5E5E5] border-[1.5px] text-black text-sm font-medium rounded-[10px] py-3 transition-colors"
          >
            Get More Info
          </button>
        </div>
        <div className={`flex items-center space-x-2 rounded-[10px] shadow-md border border-[${message.trim() ? '#E4E4E7' : '#E5E5E5'}] border-[1.5px] px-3 py-3`}>
          <button className="p-2 rounded-[10px] text-[#000000] hover:bg-[#898989] hover:bg-opacity-10 transition-colors px-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13" />
            </svg>
          </button>
          
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Type your message..."
            className="flex-1 bg-transparent outline-none text-[15px] placeholder-[#999999]"
            disabled={isLoading}
          />
          
          <button 
            onClick={handleSendMessage}
            disabled={!message.trim() || isLoading}
            className={`transition-colors ${
              message.trim() && !isLoading
                ? 'text-white bg-[#1F66F4] hover:bg-[#3575F5]'
                : 'bg-[#8FB2F9] text-[#FFFFFF] cursor-not-allowed'
            }  rounded-[10px] p-2`}
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
<path d="M3.714 3.048a.498.498 0 0 0-.683.627l2.843 7.627a2 2 0 0 1 0 1.396l-2.842 7.627a.498.498 0 0 0 .682.627l18-8.5a.5.5 0 0 0 0-.904z"></path><path d="M6 12h16"></path>              </svg>
            )}
          </button>
        </div>

        
      </div>
    </div>
  );
}; 