import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Show({ application }) {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    {application.company} — {application.role}
                </h2>
            }
        >
            <Head title={`${application.company} - ${application.role}`} />

            <div className="py-12">
                <div className="mx-auto max-w-2xl sm:px-6 lg:px-8">
                    <div className="bg-white p-6 shadow sm:rounded-lg">
                        <dl className="space-y-3">
                            <div>
                                <dt className="text-sm font-medium text-gray-500">Status</dt>
                                <dd className="text-sm text-gray-900">{application.status}</dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-gray-500">Applied Date</dt>
                                <dd className="text-sm text-gray-900">{application.applied_date}</dd>
                            </div>
                            {application.job_url && (
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Job URL</dt>
                                    <dd className="text-sm text-blue-600">
                                        <a href={application.job_url} target="_blank" rel="noopener noreferrer">
                                            {application.job_url}
                                        </a>
                                    </dd>
                                </div>
                            )}
                            {application.notes && (
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Notes</dt>
                                    <dd className="text-sm text-gray-900 whitespace-pre-wrap">{application.notes}</dd>
                                </div>
                            )}
                            {application.follow_up_date && (
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Follow-up Date</dt>
                                    <dd className="text-sm text-gray-900">{application.follow_up_date}</dd>
                                </div>
                            )}
                        </dl>

                        <div className="mt-6 flex gap-3">
                            <Link
                                href={route('applications.edit', application.id)}
                                className="rounded-md bg-gray-800 px-4 py-2 text-sm text-white hover:bg-gray-700"
                            >
                                Edit
                            </Link>
                            <Link
                                href={route('applications.index')}
                                className="rounded-md bg-gray-200 px-4 py-2 text-sm hover:bg-gray-300"
                            >
                                Back to List
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}