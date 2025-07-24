import { fetchUsers } from '@/services/user.services'
import { UserManagement } from './_components/user-management'

export default async function UsersPage() {
  const { data } = await fetchUsers({ getAll: true })

  console.log("data", data);
  return <UserManagement initialUsers={data || []} />
} 