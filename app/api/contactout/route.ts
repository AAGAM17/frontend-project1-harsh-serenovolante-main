/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { linkedinUrl } = await req.json();

    if (!linkedinUrl) {
      return NextResponse.json({ error: "Missing LinkedIn URL" }, { status: 400 });
    }

    const response = await axios.get(
      "https://api.contactout.com/v1/people/linkedin",
      {
        headers: {
          "Content-Type": "application/json",
          authorization: "basic",
          token: "2Obzn5bs4lQMuTXfJgsHQhLU",
        },
        params: {
          profile: linkedinUrl,
          include_phone: "true",
        },
      }
    );

    return NextResponse.json({ profile: response.data });
  } catch (error: any) {
    console.error("ContactOut API error:", error.response?.data || error.message);
    return NextResponse.json(
      { error: error.response?.data || "Failed to fetch contact details" },
      { status: 500 }
    );
  }
}
