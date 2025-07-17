import { User } from './_components/types'
import { UserManagement } from './_components/user-management'

async function getUsers(): Promise<User[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users`, {
    cache: 'no-store'
  })
  if (!res.ok) {
    throw new Error('Failed to fetch users')
  }
  return res.json()
}

export default async function UsersPage() {
  const users = await getUsers()
  
  return <UserManagement users={users} />
}