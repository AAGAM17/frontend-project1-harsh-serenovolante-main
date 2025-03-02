/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';
import axios from 'axios';

import React, { useEffect, useState } from 'react';

const fetchExaAiResults = async (company: string) => {
  try {
    const currentUrl = window.location.href;
    const url = new URL(currentUrl);
    const response = await fetch('/api/exa-search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: url.searchParams.get("company") }),
    });

    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error("Error fetching Exa AI results:", error);
    return [];
  }
};

export const PersonDetails: React.FC<{ company: string }> = ({ company }) => {
  const [contacts, setContacts] = useState<{ title: string; url: string, author:string, image:string, summary:string, text:string, details:boolean, highlights:Array<string>, work_email?: string, phone?: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [contactLoading, setContactLoading] = useState(false);
  const [screenSize, setScreenSize] = useState({ width: window.innerWidth, height: window.innerHeight });

  
  useEffect(() => {
    const handleResize = () => {
      setScreenSize({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener("resize", handleResize);
    console.log(screenSize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleSearchContacts = async () => {
    setLoading(true);
    const results = await fetchExaAiResults(company);
    setContacts(results);
    setLoading(false);
  };

  const handleSearchDetails = async (index: number) => {
    setContactLoading(true);
    try {
      const contact = contacts[index];
      const linkedinUrl = contact.url;
  
      const response = await axios.post("/api/contactout", {
        linkedinUrl,
      });
      
  
      const data = response.data.profile;
  
      // Update state with fetched email & phone
      const updatedContacts = [...contacts];
      updatedContacts[index] = {
        ...contact,
        work_email: data.work_email?.[0] || "Couldn't Get",
        phone: data.phone?.[0] || "Couldn't Get",
      };
  
      setContacts(updatedContacts);
    } catch (error) {
      console.error("Error fetching contact details:", error);
    } finally {
      setContactLoading(false);
    }
  };
  

  return (
    <div className="absolute top-full right-4 border border-[#E5E5E5] border-[1.5px] color-white hover:shadow-md rounded-[8px] p-4 mt-2 max-w-[400px] w-[90%] overflow-auto bg-white" style={{maxHeight: `${(screenSize.height*0.5)}px`}}>
      
      <button
        onClick={handleSearchContacts}
        className="mt-2 w-full bg-[#1F66F4] text-white py-2 px-4 rounded-md hover:bg-[#3575F5] text-sm"
        disabled={loading}
      >
        {loading ? "Searching..." : "Search More Contacts"}
      </button>

      {contacts.length > 0 && (
        <div className="mt-2">
          <h3 className="text-sm font-semibold py-2">LinkedIn Profiles</h3>
          <ul className="mt-1 space-y-1">
            {contacts.map((contact, index) => {
              const name = contact.author ? contact.author.split(' - ')[0] : 'Unknown';

              return (
                <li key={index} className="flex items-top space-x-3 border-b pb-2">
                <img src={contact.image} alt={`${name}'s Profile picture`} className="h-10 w-10 rounded-full object-cover" />
  
                <div className="flex-1 space-y-2">
                  <h2 className="text-m font-semibold text-gray-800">{name}</h2>
                  <p className="text-s text-gray-900"><span className="font-semibold">Role:</span> {contact.highlights[0]}</p>
                  <p className="text-s text-gray-900"><span className="font-semibold">Email:</span> {contact.work_email}</p>
                  <p className="text-s text-gray-900"><span className="font-semibold">Phone:</span> {contact.phone}</p>
                  <p className="text-s text-gray-900"> {contact.summary}</p>

                  <div><button
        onClick={() => handleSearchDetails(index)}
        className="mt-2 w-full bg-[#1F66F4] text-white py-1 px-3 rounded-md hover:bg-[#3575F5] w-[200px] text-sm"
        disabled={contactLoading}
      >
        {contactLoading ? "Searching..." : "Request Contact Info"}
      </button></div>
  
                  <a
                    href={contact.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 text-xs hover:underline"
                  >
                    LinkedIn Profile
                  </a>
                </div>
              </li>
  
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};
