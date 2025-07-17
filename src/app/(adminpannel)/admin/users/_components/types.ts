export type User = {
  _id: string
  username: string
  email: string
  isVerified: boolean
  isAdmin: boolean
  role: 'admin' | 'user'
  createdAt: string
  updatedAt: string
}