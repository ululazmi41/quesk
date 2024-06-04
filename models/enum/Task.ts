export type Task = {
  id?: number
  user_id: number
  title: string
  description: string
  completed: boolean
  created_at?: string
  updated_at?: string
}