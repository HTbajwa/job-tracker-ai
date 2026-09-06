import SidebarLayout from '@/Layouts/SidebarLayout';

export default function AuthenticatedLayout({ header, children }) {
    return <SidebarLayout header={header}>{children}</SidebarLayout>;
}