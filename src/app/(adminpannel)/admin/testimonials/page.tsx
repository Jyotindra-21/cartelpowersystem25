import { ITestimonial } from '@/schemas/testimonialSchema';
import { TestimonialManagement } from './_components/testimonial-management';
import { fetchTestimonials } from '@/services/testimonialService';
export const dynamic = "force-dynamic";

export default async function TestimonialPage() {
    const { data } = await fetchTestimonials<ITestimonial[]>({ getAll: true })

    return <TestimonialManagement initialTestimonials={data || []} />
} 