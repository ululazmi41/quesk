import crypto from 'crypto'
import { NextResponse } from "next/server"
import { isTokenValid } from "../../helpers/jwt"
import { database } from '@/data/database'
import { User } from '@/models/enum/User'

export async function PUT(request: Request): Promise<NextResponse> {
  const { isValid, payload } = isTokenValid(request)
  if (!isValid) {
    return NextResponse.json({}, { status: 401 })
  }

  const { oldPassword, newPassword } = await request.json()
  const decodedOldPassword = Buffer.from(oldPassword, 'base64').toString('utf-8')
  const requestOldPassword = crypto.createHash('sha256').update(decodedOldPassword).digest('hex')

  const { data } = await database.getUserById(payload.id)
  const user: User = data
  if (user.password !== requestOldPassword) {
    return NextResponse.json({}, { status: 403 })
  }
  const decodedNewPassword = Buffer.from(newPassword, 'base64').toString('utf-8')
  const requestNewPassword = crypto.createHash('sha256').update(decodedNewPassword).digest('hex')
  user.password = requestNewPassword

  await database.putUser(payload.id, user)
  return NextResponse.json({})
}