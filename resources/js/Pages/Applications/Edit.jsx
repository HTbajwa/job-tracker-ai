import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, useForm } from '@inertiajs/react';

export default function Edit({ application }) {
    const { data, setData, put, processing, errors } = useForm({
        company: application.company,
        role: application.role,
        status: application.status,
        applied_date: application.applied_date,
        job_url: application.job_url || '',
        notes: application.notes || '',
        follow_up_date: application.follow_up_date || '',
    });

    function submit(e) {
        e.preventDefault();
        put(route('applications.update', application.id));
    }

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Edit Application
                </h2>
            }
        >
            <Head title="Edit Application" />

            <div className="py-12">
                <div className="mx-auto max-w-2xl sm:px-6 lg:px-8">
                    <div className="bg-white p-6 shadow sm:rounded-lg">
                        <form onSubmit={submit} className="space-y-4">
                            <div>
                                <InputLabel htmlFor="company" value="Company" />
                                <TextInput
                                    id="company"
                                    className="mt-1 block w-full"
                                    value={data.company}
                                    onChange={(e) => setData('company', e.target.value)}
                                    required
                                />
                                <InputError message={errors.company} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="role" value="Role" />
                                <TextInput
                                    id="role"
                                    className="mt-1 block w-full"
                                    value={data.role}
                                    onChange={(e) => setData('role', e.target.value)}
                                    required
                                />
                                <InputError message={errors.role} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="status" value="Status" />
                                <select
                                    id="status"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                    value={data.status}
                                    onChange={(e) => setData('status', e.target.value)}
                                >
                                    <option value="applied">Applied</option>
                                    <option value="interview">Interview</option>
                                    <option value="offer">Offer</option>
                                    <option value="rejected">Rejected</option>
                                </select>
                                <InputError message={errors.status} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="applied_date" value="Applied Date" />
                                <TextInput
                                    id="applied_date"
                                    type="date"
                                    className="mt-1 block w-full"
                                    value={data.applied_date}
                                    onChange={(e) => setData('applied_date', e.target.value)}
                                    required
                                />
                                <InputError message={errors.applied_date} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="job_url" value="Job URL" />
                                <TextInput
                                    id="job_url"
                                    type="url"
                                    className="mt-1 block w-full"
                                    value={data.job_url}
                                    onChange={(e) => setData('job_url', e.target.value)}
                                />
                                <InputError message={errors.job_url} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="notes" value="Notes" />
                                <textarea
                                    id="notes"
                                    rows={4}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                    value={data.notes}
                                    onChange={(e) => setData('notes', e.target.value)}
                                />
                                <InputError message={errors.notes} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="follow_up_date" value="Follow-up Date (optional)" />
                                <TextInput
                                    id="follow_up_date"
                                    type="date"
                                    className="mt-1 block w-full"
                                    value={data.follow_up_date}
                                    onChange={(e) => setData('follow_up_date', e.target.value)}
                                />
                                <InputError message={errors.follow_up_date} className="mt-2" />
                            </div>

                            <PrimaryButton disabled={processing}>Update Application</PrimaryButton>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}