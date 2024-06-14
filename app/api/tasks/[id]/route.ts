import { database } from "@/data/database";
import { NextResponse } from "next/server";
import { isTokenValid } from '../../helpers/jwt';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  const { isValid, payload } = isTokenValid(request)
  if (!isValid) {
    return NextResponse.json({}, { status: 401 })
  }

  const regex = /^[0-9]+$/
  if (regex.test(params.id) === false) {
    const response = { data: {} }
    return NextResponse.json(response, { status: 400 })
  }
  
  const { exist, data } = await database.getTask(parseInt(params.id))
  if (!exist) {
    const response = { data: {} }
    return NextResponse.json(response, { status: 404 })
  }

  if (payload.id !== data!["user_id"]!) {
    const response = { data: {} }
    return NextResponse.json(response, { status: 403 })
  }

  const response = { data }
  return NextResponse.json(response)
}