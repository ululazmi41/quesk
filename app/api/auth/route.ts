import { database } from "@/database/database"
import { User } from "@/models/enum/User"
import { NextResponse } from "next/server"

export async function POST(request: Request): Promise<NextResponse> {
  const { email, password } = await request.json()
  const user: User = {
    email,
    password
  }
  const { userId, emailInvalid, passwordInvalid, success } = await database.login(user)
  const response = {
    success,
    emailInvalid,
    passwordInvalid,
    userId,
  }
  return NextResponse.json(response)
}