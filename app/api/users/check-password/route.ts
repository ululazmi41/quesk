import crypto from 'crypto'
import { NextResponse } from "next/server"
import { isTokenValid } from "../../helpers/jwt"
import { database } from "@/data/database"
import { User } from "@/models/enum/User"

export async function POST(request: Request): Promise<NextResponse> {
  const { isValid, payload } = isTokenValid(request)
  if (!isValid) {
    return NextResponse.json({}, { status: 401 })
  }
  const { password } = await request.json()
  const decoded = Buffer.from(password, 'base64').toString('utf-8')
  const requestPassword = crypto.createHash('sha256').update(decoded).digest('hex')

  const { data } = await database.getUserById(payload.id)
  const user: User = data
  const response = {
    match: user.password === requestPassword
  }
  return NextResponse.json(response)
}