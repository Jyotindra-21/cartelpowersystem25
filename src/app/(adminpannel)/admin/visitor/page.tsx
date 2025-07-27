import { getVisitors } from '@/services/visitor.services';
import { VisitorManagement } from './_components/visitor-management';
// import { ContactManagement } from './_components/contact-management';
export const dynamic = 'force-dynamic'; // Force dynamic rendering
export const revalidate = 0; //
export default async function ContactPage() {
    const { data, pagination } = await getVisitors({})
    return (

        <VisitorManagement visitor={data || []} paginationData={pagination || {
            page: 1,
            limit: 10,
            total: 0,
            pages: 1,
            hasNextPage: false,
            hasPrevPage: false
        }} />
    )
}