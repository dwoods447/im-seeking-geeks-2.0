export interface JwtPayload {
  expiresIn: string
  exp: number
}

export interface UserPayload extends JwtPayload {
  userId: string
}
