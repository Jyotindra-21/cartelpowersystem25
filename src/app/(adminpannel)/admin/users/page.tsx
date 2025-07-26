import { fetchUsers } from '@/services/user.services'
import { UserManagement } from './_components/user-management'
export const dynamic = "force-dynamic";

export default async function UsersPage() {
  const { data } = await fetchUsers({ getAll: true })

  return <UserManagement initialUsers={data || []} />
} 