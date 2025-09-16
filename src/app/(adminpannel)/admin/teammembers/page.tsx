import { ITeamMember } from '@/schemas/teamMemberSchema';
import { fetchTeamMembers } from '@/services/teamMemberService';
import { TeamMemberManagement } from './_components/teammemberl-management';
export const dynamic = "force-dynamic";

export default async function TeamMemberPage() {
    const { data } = await fetchTeamMembers<ITeamMember[]>({ getAll: true })

    return <TeamMemberManagement initialTeamMembers={data || []} />
} 