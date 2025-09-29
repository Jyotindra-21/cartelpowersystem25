import React from 'react'
import { fetchOurStorySection } from '@/services/settings.services'
import { fetchTestimonials } from '@/services/testimonialService'
import { ITestimonial } from '@/schemas/testimonialSchema'
import CompanyOverview from './_components/company-overview';
export const dynamic = 'force-dynamic';

export default async function CompanyOverviewPage() {
  const [ourStory, testimonials] = await Promise.all([
    fetchOurStorySection(),
    fetchTestimonials<ITestimonial[]>({ getAll: true, status: true })
  ])
  return (
    <CompanyOverview
      data={ourStory?.data || null}
      testimonials={testimonials?.data || []}
    />
  )
}