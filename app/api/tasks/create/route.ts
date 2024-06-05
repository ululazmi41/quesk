import { database } from "@/database/database"
import { Task } from "@/models/enum/Task"
import { NextResponse } from "next/server"

export async function POST(request: Request): Promise<NextResponse> {
  const { title, user_id, description, completed } = await request.json()
  const task: Task = {
    title,
    user_id,
    description,
    completed,
  }
  const { error } = await database.postTask(task)
  if (error) {
    throw error
  }
  const response = {
    success: true,
  }
  return NextResponse.json(response)
}
