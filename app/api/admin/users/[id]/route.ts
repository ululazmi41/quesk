import { database } from "@/database/database";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }): Promise<NextResponse> {
  const { data, success } = await database.getUserById(parseInt(params.id))
  return NextResponse.json({data})
}