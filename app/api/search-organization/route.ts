/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { company } = await req.json();

    if (!company) {
      return NextResponse.json({ error: "Missing company name" }, { status: 400 });
    }

    const response = await axios.get(
      "https://api.apollo.io/api/v1/organizations/search",
      {
        headers: {
          "Content-Type": "application/json",
          "accept": "application/json",
          "x-api-key": "vG4qx3Wzx7NwPPcREYt5nQ",
        },
        params: {
          q_organization_name: company,
          page: 1,
          per_page: 1,
        },
      }
    );

    return NextResponse.json({ company: response.data });
  } catch (error: any) {
    console.error("Apollo API error:", error.response?.data || error.message);
    return NextResponse.json(
      { error: error.response?.data || "Failed to fetch company details" },
      { status: 500 }
    );
  }
}
