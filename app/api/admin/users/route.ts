import { NextResponse } from "next/server";
import { database } from "@/data/database";

export async function GET(): Promise<NextResponse> {
  const { data } = await database.getUsers()
  const response = { data }
  return NextResponse.json(response)
}