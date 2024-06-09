import { NextResponse } from "next/server"
import { isTokenValid } from "../helpers/jwt"
import { database } from "@/data/database"
import { User } from "@/models/enum/User"

export async function PUT(request: Request): Promise<NextResponse> {
  const { isValid, payload } = isTokenValid(request)
  if (!isValid) {
    return NextResponse.json({}, { status: 401 })
  }
  
  const { username, email } = await request.json()
  const { data: emails } = await database.getUsersByColumnData(payload.id, 'email', email)
  let emailAlreadyExist = false
  if (emails!.length > 0) {
    emailAlreadyExist = true
  }
  
  const { data: usernames } = await database.getUsersByColumnData(payload.id, 'username', username)
  let usernameAlreadyExist = false
  if (usernames!.length > 0) {
    usernameAlreadyExist = true
  }

  if (emailAlreadyExist || usernameAlreadyExist) {
    return NextResponse.json({
      emailAlreadyExist,
      usernameAlreadyExist
    }, { status: 409 })
  }
  
  const { data } = await database.getUserById(payload.id)
  const user: User = data
  user.username = username
  user.email = email
  
  await database.putUser(payload.id, user)
  const response = {}
  return NextResponse.json(response)
}