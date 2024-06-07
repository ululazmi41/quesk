import fs from "fs"
import crypto from 'crypto'
import JWT from 'jsonwebtoken'
import { User } from "@/models/enum/User"
import { database } from "@/database/database"
import { NextResponse } from "next/server"

export async function POST(request: Request): Promise<NextResponse> {
  const authorization = request.headers.get('authorization')?.split(' ')[1]!
  const responseTesting = {
    authorization,
    headers: request.headers
  }
  return NextResponse.json(responseTesting)

  const decoded = Buffer.from(authorization, 'base64').toString('utf-8')
  const { email, password } = JSON.parse(decoded)
  const hashed = crypto.createHash('sha256').update(password).digest('hex')
  const user: User = {
    email,
    password: hashed
  }

  const { success, id, username } = await database.login(user)
  if (!success) {
    const response = { token: null }
    return NextResponse.json(response, { status: 401 })
  }

  const payload = { id, username }
  const jwtKey = fs.readFileSync('app/api/keys/jwt.key')
  const jwtToken = JWT.sign(payload, jwtKey)
  const response = { token: jwtToken }
  return NextResponse.json(response)
}