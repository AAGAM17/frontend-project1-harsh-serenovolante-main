/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { companyId } = await req.json();

    if (!companyId) {
      return NextResponse.json({ error: "Missing company id" }, { status: 400 });
    }

    const response = await axios.get(
      "https://api.apollo.io/api/v1/people/search",
      {
        headers: {
          "Content-Type": "application/json",
          "accept": "application/json",
          "x-api-key": "vG4qx3Wzx7NwPPcREYt5nQ",
        },
        params: {
          organization_ids: [companyId],
          titles: [
                    'Procurement',
                    'Purchasing',
                    'Supply Chain',
                    'Materials',
                    'Sourcing',
                    'Buyer',
                    'Vendor'
                ],
                seniorities: [
                    'director',
                    'vp',
                    'head',
                    'manager',
                    'lead'
                ],
                page: 1,
                per_page: 10
        },
      }
    );

    return NextResponse.json({ people: response.data });
  } catch (error: any) {
    console.error("Apollo API error:", error.response?.data || error.message);
    return NextResponse.json(
      { error: error.response?.data || "Failed to fetch company details" },
      { status: 500 }
    );
  }
}
