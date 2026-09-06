import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';

const STATUS_OPTIONS = [
    { value: 'applied', label: 'Applied' },
    { value: 'interview', label: 'Interview' },
    { value: 'offer', label: 'Offer' },
    { value: 'rejected', label: 'Rejected' },
];

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        company: '',
        role: '',
        status: 'applied',
        applied_date: '',
        job_url: '',
        notes: '',
        follow_up_date: '',
    });

    function submit(e) {
        e.preventDefault();
        post(route('applications.store'));
    }

    return (
        <AuthenticatedLayout
            header={
                <div>
                    <Link
                        href={route('applications.index')}
                        className="mb-1 flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
                    >
                        <ArrowLeft size={14} />
                        Back to Applications
                    </Link>
                    <h2 className="font-serif text-2xl font-semibold text-gray-900">Add Application</h2>
                </div>
            }
        >
            <Head title="Add Application" />

            <div className="mx-auto max-w-2xl rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
                <form onSubmit={submit} className="space-y-5">
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                        <div>
                            <InputLabel htmlFor="company" value="Company" />
                            <TextInput
                                id="company"
                                className="mt-1 block w-full focus:border-brand focus:ring-brand"
                                value={data.company}
                                onChange={(e) => setData('company', e.target.value)}
                                required
                                autoFocus
                            />
                            <InputError message={errors.company} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="role" value="Role" />
                            <TextInput
                                id="role"
                                className="mt-1 block w-full focus:border-brand focus:ring-brand"
                                value={data.role}
                                onChange={(e) => setData('role', e.target.value)}
                                required
                            />
                            <InputError message={errors.role} className="mt-2" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                        <div>
                            <InputLabel htmlFor="status" value="Status" />
                            <select
                                id="status"
                                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-brand focus:ring-brand"
                                value={data.status}
                                onChange={(e) => setData('status', e.target.value)}
                            >
                                {STATUS_OPTIONS.map((opt) => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                            <InputError message={errors.status} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="applied_date" value="Applied Date" />
                            <TextInput
                                id="applied_date"
                                type="date"
                                className="mt-1 block w-full focus:border-brand focus:ring-brand"
                                value={data.applied_date}
                                onChange={(e) => setData('applied_date', e.target.value)}
                                required
                            />
                            <InputError message={errors.applied_date} className="mt-2" />
                        </div>
                    </div>

                    <div>
                        <InputLabel htmlFor="job_url" value="Job URL (optional)" />
                        <TextInput
                            id="job_url"
                            type="url"
                            placeholder="https://..."
                            className="mt-1 block w-full focus:border-brand focus:ring-brand"
                            value={data.job_url}
                            onChange={(e) => setData('job_url', e.target.value)}
                        />
                        <InputError message={errors.job_url} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel htmlFor="notes" value="Notes (optional)" />
                        <textarea
                            id="notes"
                            rows={4}
                            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-brand focus:ring-brand"
                            value={data.notes}
                            onChange={(e) => setData('notes', e.target.value)}
                        />
                        <InputError message={errors.notes} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel htmlFor="follow_up_date" value="Follow-up Reminder (optional)" />
                        <TextInput
                            id="follow_up_date"
                            type="date"
                            className="mt-1 block w-full focus:border-brand focus:ring-brand"
                            value={data.follow_up_date}
                            onChange={(e) => setData('follow_up_date', e.target.value)}
                        />
                        <InputError message={errors.follow_up_date} className="mt-2" />
                    </div>

                    <div className="flex items-center gap-3 border-t border-gray-100 pt-5">
                        <button
                            type="submit"
                            disabled={processing}
                            className="rounded-lg bg-teal-900 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-teal-800 disabled:opacity-50"
                        >
                            Save Application
                        </button>
                        <Link
                            href={route('applications.index')}
                            className="rounded-lg px-5 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100"
                        >
                            Cancel
                        </Link>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}