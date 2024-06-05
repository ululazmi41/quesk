import { database } from "@/database/database"
import { Task } from "@/models/enum/Task"
import { NextResponse } from "next/server"

export async function GET(request: Request): Promise<NextResponse> {
  const { data, error } = await database.getTasks()
  if (error) {
    throw error
  }
  const response = {
    success: true,
    data: data
  }
  return NextResponse.json(response)
}

export async function POST(request: Request): Promise<NextResponse> {
  const { user_id } = await request.json()
  const { data, error } = await database.getTaskByID(user_id)
  if (error) {
    throw error
  }
  const response = { data }
  return NextResponse.json(response)
}

export async function PUT(request: Request): Promise<NextResponse> {
  const { id, title, user_id, description, completed } = await request.json()
  const task: Task = {
    id,
    title,
    user_id,
    description,
    completed,
  }
  const error = await database.putTask(task)
  if (error) {
    throw error
  }
  const response = {
    success: true,
  }
  return NextResponse.json(response)
}

export async function DELETE(request: Request): Promise<NextResponse> {
  const { id } = await request.json()
  const error = await database.deleteTask(id)
  if (error) {
    throw error
  }
  const response = {
    success: true,
  }
  return NextResponse.json(response)
}
