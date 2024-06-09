import { createClient } from '@supabase/supabase-js'
import { User } from '@/models/enum/User'
import { Task } from '@/models/enum/Task'

const TABLE_USER = 'users'
const TABLE_TASK = 'tasks'
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

interface databaseInterface {
  login(user: User): Promise<{ success: boolean, id: number, username: string }>
  register(user: User): Promise<{ success: boolean, emailExist: boolean }>
  
  getUsers(): Promise<{ data: any[] | null}>
  getUserById(id: number): Promise<{ data?: any, exist: boolean }>
  getUsersByColumnData(id: number, columnName: string, columnData: string): Promise<{ data?: any[] | null }>
  putUser(id: number, user: User): void
  
  getTask(id: number): void
  getTaskByID(userId: number): void
  getTasks(): Promise<{ data: any[] | null }>
  getTasksById(id: number): Promise<{ data: any[] | null }>
  postTask(task: Task): void
  putTask(task: Task): void
  deleteTask(id: number): void
}

class Database implements databaseInterface {
  async getUsersByColumnData(id: number, columnName: string, columnData: string): Promise<{ data?: any[] | null }> {
    const { data } = await supabase.from(TABLE_USER).select().eq(columnName, columnData).neq('id', id)
    return { data }
  }
  
  async putUser(id: number, user: User) {
    await supabase.from(TABLE_USER).update(user).eq('id', id)
  }

  async getUsers(): Promise<{ data: any[] | null }> {
    const { data } = await supabase.from(TABLE_USER).select()
    return { data }
  }

  async getTasksById(id: number): Promise<{ data: any[] | null }> {
    const { data } = await supabase.from(TABLE_TASK).select().eq('user_id', id)
    return { data }
  }

  async getUserById(id: number): Promise<{ data?: any, exist: boolean }> {
    const { data, error, count } = await supabase.from(TABLE_USER).select().eq('id', id)
    if (error) {
      throw error
    }
    if (data!.length > 0) {
      return { data: data[0], exist: true }
    }
    return { exist: false }
  }
  
  async login(user: User): Promise<{ success: boolean, id: number, username: string }> {
    const { data } = await supabase.from(TABLE_USER).select().eq("email", user.email)
    if (data?.length === 0) {
      return {
        id: -1,
        success: false,
        username: '',
      }
    }
    if (data![0]["password"] !== user.password) {
      return {
        id: -1,
        success: false,
        username: '',
      }
    }
    
    return {
      id: parseInt(data![0]["id"]),
      success: true,
      username: data![0]["username"],
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

  async getTasks(): Promise<{ data: any[] | null }> {
    const { data, error } = await supabase.from(TABLE_TASK).select()
    if (error) {
      throw error
    }
    return { data }
  }

  async getTaskByID(userId: number): Promise<{ data: any[] | null }> {
    const { data, error } = await supabase.from(TABLE_TASK).select().eq('user_id', userId)
    if (error) {
      throw error
    }
    return { data }
  }

  async getTask(id: number): Promise<{ exist: boolean, data: any }> {
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
    const { error } = await supabase.from(TABLE_TASK).insert(task)
    if (error) {
      throw error
    }
  }

  async putTask(task: Task) {
    task.updated_at = (new Date(Date.now())).toISOString()
    const { error } = await supabase.from(TABLE_TASK).update(task).eq('id', task.id)
    if (error) {
      throw error
    }
  }

  async deleteTask(id: number) {
    const { error } = await supabase.from(TABLE_TASK).delete().eq('id', id)
    if (error) {
      throw error
    }
  }
}

const database = new Database()
export { database }
