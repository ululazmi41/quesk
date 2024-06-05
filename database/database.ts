import { createClient } from '@supabase/supabase-js'
import { User } from '@/models/enum/User'
import { Task } from '@/models/enum/Task'

const TABLE_USER = 'users'
const TABLE_TASK = 'tasks'
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

class Database {
  async getUserById(id: number): Promise<{ data?: User, success: boolean }> {
    const { data, error } = await supabase.from(TABLE_USER).select().eq('id', id)
    if (error) {
      throw error
    }
    if (data!.length > 0) {
      return { data: data[0], success: true }
    }
    return { success: false }
  }
  
  async login(user: User): Promise<{ success: boolean, emailInvalid: boolean, passwordInvalid: boolean, userId: number }> {
    const { data } = await supabase.from(TABLE_USER).select().eq("email", user.email)
    if (data?.length === 0) {
      return {
        success: false,
        emailInvalid: true,
        passwordInvalid: false,
        userId: 0
      }
    }
    if (data![0]["password"] !== user.password) {
      return {
        success: false,
        emailInvalid: false,
        passwordInvalid: true,
        userId: 0
      }
    }
    
    return {
      success: true,
      emailInvalid: false,
      passwordInvalid: false,
      userId: data![0]["id"]
    }
  }
  
  async register(user: User): Promise<{ success: boolean, emailExist: boolean }> {
    const { data } = await supabase.from(TABLE_USER).select().eq("email", user.email)
    if (data!.length > 0) {
      return {
        success: false,
        emailExist: true
      }
    }

    const { error } = await supabase.from(TABLE_USER).insert(user)

    if (error) {
      throw error
    }

    return {
      success: true,
      emailExist: false
    }
  }

  async getTasks() {
    const { data, error } = await supabase.from(TABLE_TASK).select()
    return { data, error }
  }

  async getTaskByID(userId: number) {
    const { data, error } = await supabase.from(TABLE_TASK).select().eq('user_id', userId)
    return { data, error }
  }

  async getTask(id: number) {
    const { data, error } = await supabase.from(TABLE_TASK).select().eq("id", id)
    if (error) {
      throw error
    }
    if (data!.length > 0) {
      return { exist: true, data: data[0] }
    }
    return { exist: false, data: {} }
  }

  async postTask(task: Task) {
    const now = new Date(Date.now()).toISOString()
    task.created_at = now
    task.updated_at = now
    const error = await supabase.from(TABLE_TASK).insert(task)
    return error
  }

  async putTask(task: Task) {
    task.updated_at = (new Date()).toISOString()
    const { error } = await supabase.from(TABLE_TASK).update(task).eq('id', task.id)
    return error
  }

  async deleteTask(id: number) {
    const { error } = await supabase.from(TABLE_TASK).delete().eq('id', id)
    return error
  }
}

const database = new Database()
export { database }
