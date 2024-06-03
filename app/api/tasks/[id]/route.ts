import { database } from "@/database/database";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  let response = {}
  const regex = /^[0-9]+$/
  if (regex.test(params.id) === false) {
    response = {
      success: false,
      data: {}
    }
  } else {
    const { exist, data } = await database.getTask(parseInt(params.id))
      response = {
      success: exist,
      data
    }
  }
  return NextResponse.json(response)
}