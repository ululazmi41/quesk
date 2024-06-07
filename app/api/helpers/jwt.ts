import fs from 'fs'
import JWT from 'jsonwebtoken'

function isTokenValid(request: Request) {
  const jwtKey = fs.readFileSync('app/api/keys/jwt.key')
  const token = request.headers.get('authorization')?.split(' ')[1]!
  const isValid = JWT.verify(token, jwtKey)
  const payload = JWT.decode(token) as JWT.JwtPayload
  return { isValid, payload }
}

export { isTokenValid }
