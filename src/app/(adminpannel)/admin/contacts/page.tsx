import { getContacts } from '@/services/contact.services';
import { ContactManagement } from './_components/contact-management';
export const dynamic = 'force-dynamic'; // Force dynamic rendering
export const revalidate = 0; //
export default async function ContactPage() {
    const { data, pagination } = await getContacts({})

    return (
        <ContactManagement contact={data || []} paginationData={pagination || {
            page: 1,
            limit: 10,
            total: 0,
            pages: 1,
            hasNextPage: false,
            hasPrevPage: false
        }} />
    )
}