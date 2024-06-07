import crypto from 'crypto'
import { database } from "@/database/database"
import { User } from "@/models/enum/User"
import { NextResponse } from "next/server"

export async function POST(request: Request): Promise<NextResponse> {
  const authorization = request.headers.get('authorization')?.split(' ')[1]!
  const decoded = Buffer.from(authorization, 'base64').toString('utf-8')
  const { email, password } = JSON.parse(decoded)
  const hashed = crypto.createHash('sha256').update(password).digest('hex')
  const user: User = { email, password: hashed }
  const { success, emailExist } = await database.register(user)
  const response = {
    success,
    emailExist
  }
  return NextResponse.json(response)
}