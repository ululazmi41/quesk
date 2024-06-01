import { createClient } from '@supabase/supabase-js'
import { User } from '@/models/enum/User'

const TABLE_USER = 'users'
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

class Database {
  async emailExist(): Promise<boolean> {
    // const { data, error } = await supabase.from(TABLE).select()
    // return { data, error }
    return false
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
  
  // async put(id: number, post: Post) {
  //   const { error } = await supabase.from(TABLE).update(post).eq('id', id)
  //   return error
  // }

  // async delete(id: number) {
  //   const { error } = await supabase.from(TABLE).delete().eq('id', id)
  //   return error
  // }
}

const database = new Database()
export { database }