import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import KanbanBoard from '@/Components/KanbanBoard';
import { Head, Link, router, useForm } from '@inertiajs/react';

const STATUS_STYLES = {
    applied: 'bg-blue-100 text-blue-800',
    interview: 'bg-yellow-100 text-yellow-800',
    offer: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
};

export default function Index({ applications, filters }) {
    const [view, setView] = useState('kanban');

    const { data, setData, get } = useForm({
        search: filters.search || '',
        status: filters.status || '',
    });

    function handleFilter(e) {
        e.preventDefault();
        get(route('applications.index'), { preserveState: true });
    }

    function handleDelete(application) {
        if (confirm(`Delete application for ${application.company}?`)) {
            router.delete(route('applications.destroy', application.id));
        }
    }

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Applications
                    </h2>
                    <Link
                        href={route('applications.create')}
                        className="rounded-md bg-gray-800 px-4 py-2 text-sm text-white hover:bg-gray-700"
                    >
                        + Add Application
                    </Link>
                </div>
            }
        >
            <Head title="Applications" />

            <div className="py-12">
                <div className="mx-auto max-w-6xl sm:px-6 lg:px-8">
                    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                        <form onSubmit={handleFilter} className="flex gap-3">
                            <input
                                type="text"
                                placeholder="Search company or role..."
                                value={data.search}
                                onChange={(e) => setData('search', e.target.value)}
                                className="rounded-md border-gray-300 shadow-sm"
                            />
                            <select
                                value={data.status}
                                onChange={(e) => setData('status', e.target.value)}
                                className="rounded-md border-gray-300 shadow-sm"
                            >
                                <option value="">All statuses</option>
                                <option value="applied">Applied</option>
                                <option value="interview">Interview</option>
                                <option value="offer">Offer</option>
                                <option value="rejected">Rejected</option>
                            </select>
                            <button
                                type="submit"
                                className="rounded-md bg-gray-200 px-4 py-2 text-sm hover:bg-gray-300"
                            >
                                Filter
                            </button>
                        </form>

                        <div className="flex overflow-hidden rounded-md border border-gray-300">
                            <button
                                onClick={() => setView('kanban')}
                                className={`px-4 py-2 text-sm ${
                                    view === 'kanban' ? 'bg-gray-800 text-white' : 'bg-white text-gray-700'
                                }`}
                            >
                                Kanban
                            </button>
                            <button
                                onClick={() => setView('list')}
                                className={`px-4 py-2 text-sm ${
                                    view === 'list' ? 'bg-gray-800 text-white' : 'bg-white text-gray-700'
                                }`}
                            >
                                List
                            </button>
                        </div>
                    </div>

                    {applications.length === 0 ? (
                        <div className="rounded-lg bg-white p-8 text-center text-gray-500 shadow">
                            No applications yet. Add your first one.
                        </div>
                    ) : view === 'kanban' ? (
                        <KanbanBoard applications={applications} />
                    ) : (
                        <div className="overflow-hidden bg-white shadow sm:rounded-lg">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Company</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Role</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Applied Date</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium uppercase text-gray-500">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {applications.map((application) => (
                                        <tr key={application.id}>
                                            <td className="px-6 py-4">{application.company}</td>
                                            <td className="px-6 py-4">{application.role}</td>
                                            <td className="px-6 py-4">
                                                <span
                                                    className={`rounded-full px-2 py-1 text-xs font-medium ${STATUS_STYLES[application.status]}`}
                                                >
                                                    {application.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">{application.applied_date}</td>
                                            <td className="px-6 py-4 text-right text-sm">
                                                <Link
                                                    href={route('applications.show', application.id)}
                                                    className="mr-3 text-blue-600 hover:underline"
                                                >
                                                    View
                                                </Link>
                                                <Link
                                                    href={route('applications.edit', application.id)}
                                                    className="mr-3 text-gray-600 hover:underline"
                                                >
                                                    Edit
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(application)}
                                                    className="text-red-600 hover:underline"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}