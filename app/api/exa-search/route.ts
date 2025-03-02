/* eslint-disable @typescript-eslint/no-unused-vars */
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { query } = await req.json();
    const roles = 
      "Chief Procurement Officer (CPO),Chief Supply Chain Officer (CSCO),Director of Procurement,Director of Supply Chain,Vice President of Procurement,Vice President of Supply Chain Management,Vice President of Sourcing & Vendor Management,Head of Procurement,Head of Supply Chain Management,General Manager – Procurement,Senior Procurement Manager";
    const systemPrompt = `Give me the linkedin profile links of CPO or similar role individuals working in the company: ${query}`;

    const response = await axios.post(
      "https://api.exa.ai/search",
      {
        'model': 'sonar-pro',
        'query': systemPrompt,
        'useAutoprompt': true,
        'numResults': 5,
        'category': `Linkedin profile working at ${query}`,
        'includeDomains': ['linkedin.com', 'linkedin.in', 'in.linkedin.com'],
        'type': 'auto',
        'contents': {
          'text': true,
          'summary': {'query': "Summary of the employee and their career, keep it short"},
          'highlights': {'query': "Position/Role of the employee, keep it short", 'numSentences': 1, 'highlightsPerUrl': 1},
        }
    },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.EXA_API_KEY}`,
        },
      }
    );

    console.log(response.data.results);

    return NextResponse.json({ results: response.data.results });
  } catch (error) {
    console.error("Perplexity API error:", error);
    return NextResponse.json({ error: "Failed to fetch results" }, { status: 500 });
  }
}
