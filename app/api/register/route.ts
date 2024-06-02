import { database } from "@/database/database"
import { User } from "@/models/enum/User"
import { NextResponse } from "next/server"

export async function POST(request: Request): Promise<NextResponse> {
  const { email, password } = await request.json()
  const user: User = {
    email,
    password
  }
  const { success, emailExist } = await database.register(user)
  const response = {
    success,
    emailExist
  }
  return NextResponse.json(response)
}