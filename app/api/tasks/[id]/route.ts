import fs from 'fs'
import JWT from 'jsonwebtoken'
import { database } from "@/database/database";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  const jwtKey = fs.readFileSync('app/api/keys/jwt.key')
  const token = request.headers.get("authorization")?.split(' ')[1]!
  const isValid = JWT.verify(token, jwtKey)
  if (!isValid) {
    const response = { data: {} }
    return NextResponse.json(response, { status: 401 })
  }

  const regex = /^[0-9]+$/
  if (regex.test(params.id) === false) {
    const response = { data: {} }
    return NextResponse.json(response, { status: 500 })
  }
  
  const { exist, data } = await database.getTask(parseInt(params.id))
  if (!exist) {
    const response = { data: {} }
    return NextResponse.json(response, { status: 404 })
  }

  const payload = JWT.decode(token) as JWT.JwtPayload
  if (payload.id !== data!["user_id"]!) {
    const response = { data: {} }
    return NextResponse.json(response, { status: 403 })
  }

  const response = { data }
  return NextResponse.json(response)
}