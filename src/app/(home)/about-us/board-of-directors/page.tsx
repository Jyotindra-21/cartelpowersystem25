import React from 'react'
import { fetchTeamMembers } from '@/services/teamMemberService'
import { fetchOurStorySection } from '@/services/settings.services'
import BoardOfDirectors from './_components/bord-of-directors'
import { ITeamMember } from '@/schemas/teamMemberSchema'
export const dynamic = 'force-dynamic';

export default async function BoardOfDirectorsPage() {
  const [ourStory, teamMembers] = await Promise.all([
    fetchOurStorySection(),
    fetchTeamMembers<ITeamMember[]>({ getAll: true, status: true })
  ])
  return (
    <BoardOfDirectors
      data={ourStory?.data || null}
      teamMembers={teamMembers?.data || []}
    />
  )
}