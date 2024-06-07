import { database } from "@/database/database"
import { NextResponse } from "next/server"
import { isTokenValid } from "../../helpers/jwt"

export async function GET(
  request: Request,
  { params }: { params: { id: string } }): Promise<NextResponse> {
  const { isValid, payload } = isTokenValid(request)
  if (!isValid) {
    return NextResponse.json({}, { status: 401 })
  }
  const { data, exist } = await database.getUserById(parseInt(params.id))
  if (!exist) {
    return NextResponse.json({}, { status: 404 })
  }
  if (data["id"] !== payload.id) {
    return NextResponse.json({}, { status: 403 })
  }
  const response = { data }
  return NextResponse.json(response)
}