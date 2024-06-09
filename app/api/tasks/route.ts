import { database } from "@/data/database"
import { Task } from "@/models/enum/Task"
import { NextResponse } from "next/server"
import { isTokenValid } from "../helpers/jwt"

export async function GET(request: Request): Promise<NextResponse> {
  const { isValid, payload } = isTokenValid(request)
  if (!isValid) {
    return NextResponse.json({}, { status: 401 })
  }
  const { data } = await database.getTasksById(payload.id)
  const response = {
    success: true,
    data
  }
  return NextResponse.json(response)
}

export async function POST(request: Request): Promise<NextResponse> {
  const { isValid } = isTokenValid(request)
  if (!isValid) {
    return NextResponse.json({}, { status: 401 })
  }
  
  const { title, user_id, description, completed } = await request.json()
  const task: Task = {
    title,
    user_id,
    description,
    completed,
  }
  await database.postTask(task)
  const response = { success: true }
  return NextResponse.json(response)
}

export async function PUT(request: Request): Promise<NextResponse> {
  const { isValid } = isTokenValid(request)
  if (!isValid) {
    return NextResponse.json({}, { status: 401 })
  }

  const { id, title, user_id, description, completed } = await request.json()
  const task: Task = {
    id,
    title,
    user_id,
    description,
    completed,
  }
  await database.putTask(task)
  const response = { success: true }
  return NextResponse.json(response)
}

export async function DELETE(request: Request): Promise<NextResponse> {
  const { isValid } = isTokenValid(request)
  if (!isValid) {
    return NextResponse.json({}, { status: 401 })
  }
  
  const { id } = await request.json()
  await database.deleteTask(id)
  const response = { success: true }
  return NextResponse.json(response)
}
