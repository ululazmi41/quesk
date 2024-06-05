export type User = {
  username?: string
  email: string
  password: string
}

export namespace User {
  export function empty(): User {
    return {
      email: "",
      password: "",
    }
  }
}
