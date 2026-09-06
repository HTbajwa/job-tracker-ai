import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import KanbanBoard from '@/Components/KanbanBoard';
import ConfirmModal from '@/Components/ConfirmModal';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { Plus, Search, LayoutGrid, List as ListIcon, Trash2, Eye, Pencil } from 'lucide-react';

const STATUS_STYLES = {
    applied: 'bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-200',
    interview: 'bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200',
    offer: 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200',
    rejected: 'bg-red-50 text-red-700 ring-1 ring-inset ring-red-200',
};

export default function Index({ applications, allApplications, filters }) {
    const [view, setView] = useState('kanban');
    const [pendingDelete, setPendingDelete] = useState(null);

    const { data, setData, get } = useForm({
        search: filters.search || '',
        status: filters.status || '',
    });

    function handleFilter(e) {
        e.preventDefault();
        get(route('applications.index'), { preserveState: true });
    }

    function confirmDelete() {
        router.delete(route('applications.destroy', pendingDelete.id), {
            onFinish: () => setPendingDelete(null),
        });
    }

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="font-serif text-2xl font-semibold text-gray-900">Applications</h2>
                        <p className="text-sm text-gray-500">{allApplications.length} total</p>
                    </div>
                    <Link
                        href={route('applications.create')}
                        className="flex items-center gap-2 rounded-lg bg-teal-900 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-teal-800"
                    >
                        <Plus size={16} />
                        Add Application
                    </Link>
                </div>
            }
        >
            <Head title="Applications" />

            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <form onSubmit={handleFilter} className="flex flex-wrap gap-3">
                    <div className="relative">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search company or role..."
                            value={data.search}
                            onChange={(e) => setData('search', e.target.value)}
                            className="rounded-lg border-gray-300 pl-9 text-sm shadow-sm focus:border-brand focus:ring-brand"
                        />
                    </div>
                    <select
                        value={data.status}
                        onChange={(e) => setData('status', e.target.value)}
                        className="rounded-lg border-gray-300 text-sm shadow-sm focus:border-brand focus:ring-brand"
                    >
                        <option value="">All statuses</option>
                        <option value="applied">Applied</option>
                        <option value="interview">Interview</option>
                        <option value="offer">Offer</option>
                        <option value="rejected">Rejected</option>
                    </select>
                    <button
                        type="submit"
                        className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                        Filter
                    </button>
                </form>

                <div className="flex overflow-hidden rounded-lg border border-gray-200 bg-white">
                    <button
                        onClick={() => setView('kanban')}
                        className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium transition-colors ${
                            view === 'kanban' ? 'bg-teal-900 text-white' : 'text-gray-600 hover:bg-gray-50'
                        }`}
                    >
                        <LayoutGrid size={15} />
                        Kanban
                    </button>
                    <button
                        onClick={() => setView('list')}
                        className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium transition-colors ${
                            view === 'list' ? 'bg-teal-900 text-white' : 'text-gray-600 hover:bg-gray-50'
                        }`}
                    >
                        <ListIcon size={15} />
                        List
                    </button>
                </div>
            </div>

            {allApplications.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center">
                    <p className="text-gray-500">No applications yet.</p>
                    <Link
                        href={route('applications.create')}
                        className="mt-3 inline-block text-sm font-medium text-brand-dark hover:underline"
                    >
                        Add your first one →
                    </Link>
                </div>
            ) : view === 'kanban' ? (
                <KanbanBoard applications={allApplications} />
            ) : (
                <>
                    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                        <table className="min-w-full divide-y divide-gray-100">
                            <thead className="bg-gray-50/50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Company</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Role</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Applied</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Follow-up</th>
                                    <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {applications.data.map((application) => (
                                    <tr key={application.id} className="transition-colors hover:bg-gray-50/50">
                                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{application.company}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{application.role}</td>
                                        <td className="px-6 py-4">
                                            <span className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ${STATUS_STYLES[application.status]}`}>
                                                {application.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {new Date(application.applied_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            {application.follow_up_date ? (
                                                <span
                                                    className={
                                                        new Date(application.follow_up_date) < new Date().setHours(0, 0, 0, 0)
                                                            ? 'font-medium text-orange-600'
                                                            : 'text-gray-500'
                                                    }
                                                >
                                                    {new Date(application.follow_up_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                                </span>
                                            ) : (
                                                <span className="text-gray-300">—</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-1">
                                                <Link
                                                    href={route('applications.show', application.id)}
                                                    className="rounded-md p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
                                                    title="View"
                                                >
                                                    <Eye size={16} />
                                                </Link>
                                                <Link
                                                    href={route('applications.edit', application.id)}
                                                    className="rounded-md p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
                                                    title="Edit"
                                                >
                                                    <Pencil size={16} />
                                                </Link>
                                                <button
                                                    onClick={() => setPendingDelete(application)}
                                                    className="rounded-md p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {applications.last_page > 1 && (
                        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                            <p className="text-sm text-gray-500">
                                Showing {applications.from}–{applications.to} of {applications.total}
                            </p>
                            <div className="flex gap-1">
                                {applications.links.map((link, i) => (
                                    <Link
                                        key={i}
                                        href={link.url || '#'}
                                        preserveScroll
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                        className={`rounded-md px-3 py-1.5 text-sm ${
                                            link.active
                                                ? 'bg-teal-900 text-white'
                                                : link.url
                                                ? 'text-gray-600 hover:bg-gray-100'
                                                : 'cursor-not-allowed text-gray-300'
                                        }`}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </>
            )}

            <ConfirmModal
                show={pendingDelete !== null}
                title="Delete application?"
                message={
                    pendingDelete
                        ? `This will remove your application for ${pendingDelete.role} at ${pendingDelete.company}. This can't be undone.`
                        : ''
                }
                onConfirm={confirmDelete}
                onCancel={() => setPendingDelete(null)}
            />
        </AuthenticatedLayout>
    );
}