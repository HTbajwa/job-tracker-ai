import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Show({ application }) {
    const [jobDescription, setJobDescription] = useState('');
    const [copied, setCopied] = useState(false);

    const matchForm = useForm({ job_description: '' });
    const letterForm = useForm({ job_description: '' });

    // Latest AI match record for this application (if any) — we only
    // show the most recent one, per our earlier decision to skip history.
    const latestMatch = application.ai_matches?.length
        ? [...application.ai_matches].sort((a, b) => b.id - a.id)[0]
        : null;

    function handleMatchScore(e) {
        e.preventDefault();
        matchForm.setData('job_description', jobDescription);
        matchForm.post(route('applications.matchScore', application.id), {
            preserveScroll: true,
            onSuccess: () => matchForm.reset(),
        });
    }

    function handleCoverLetter(e) {
        e.preventDefault();
        letterForm.setData('job_description', jobDescription);
        letterForm.post(route('applications.coverLetter', application.id), {
            preserveScroll: true,
            onSuccess: () => letterForm.reset(),
        });
    }

    function copyToClipboard() {
        navigator.clipboard.writeText(latestMatch?.cover_letter || '');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }

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
                <div className="mx-auto max-w-3xl space-y-6 sm:px-6 lg:px-8">
                    {/* Application details */}
                    <div className="bg-white p-6 shadow sm:rounded-lg">
                        <dl className="space-y-3">
                            <div>
                                <dt className="text-sm font-medium text-gray-500">Status</dt>
                                <dd className="text-sm text-gray-900">{application.status}</dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-gray-500">Applied Date</dt>
                            <dd className="text-sm text-gray-900">
    {new Date(application.applied_date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    })}
</dd>
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
                                    <dd className="whitespace-pre-wrap text-sm text-gray-900">{application.notes}</dd>
                                </div>
                            )}








                            {application.follow_up_date && (
    <div>
        <dt className="text-sm font-medium text-gray-500">Follow-up Date</dt>
        <dd className="text-sm text-gray-900">
            {new Date(application.follow_up_date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            })}
            {new Date(application.follow_up_date) < new Date().setHours(0, 0, 0, 0) && (
                <span className="ml-2 rounded-full bg-orange-100 px-2 py-0.5 text-xs font-medium text-orange-800">
                    Overdue
                </span>
            )}
        </dd>
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

                    {/* AI panel */}
                    <div className="bg-white p-6 shadow sm:rounded-lg">
                        <h3 className="mb-3 text-lg font-semibold text-gray-800">AI Match &amp; Cover Letter</h3>

                        <textarea
                            rows={6}
                            placeholder="Paste the job description here..."
                            value={jobDescription}
                            onChange={(e) => setJobDescription(e.target.value)}
                            className="block w-full rounded-md border-gray-300 shadow-sm"
                        />

                        <div className="mt-3 flex gap-3">
                            <button
                                onClick={handleMatchScore}
                                disabled={matchForm.processing || jobDescription.trim().length < 20}
                                className="rounded-md bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-500 disabled:opacity-50"
                            >
                                {matchForm.processing ? 'Scoring...' : 'Get Match Score'}
                            </button>
                            <button
                                onClick={handleCoverLetter}
                                disabled={letterForm.processing || jobDescription.trim().length < 20}
                                className="rounded-md bg-gray-800 px-4 py-2 text-sm text-white hover:bg-gray-700 disabled:opacity-50"
                            >
                                {letterForm.processing ? 'Generating...' : 'Generate Cover Letter'}
                            </button>
                        </div>

                        {(matchForm.errors.job_description || letterForm.errors.job_description) && (
                            <p className="mt-2 text-sm text-red-600">
                                {matchForm.errors.job_description || letterForm.errors.job_description}
                            </p>
                        )}

                        {/* Match score result */}
                        {latestMatch?.match_score !== null && latestMatch?.match_score !== undefined && (
                            <div className="mt-6 rounded-md border border-gray-200 p-4">
                                <div className="flex items-center gap-3">
                                    <span className="text-2xl font-bold text-indigo-600">
                                        {latestMatch.match_score}%
                                    </span>
                                    <span className="text-sm text-gray-600">match score</span>
                                </div>
                                {latestMatch.missing_keywords?.length > 0 && (
                                    <div className="mt-3">
                                        <p className="text-sm font-medium text-gray-700">Missing keywords:</p>
                                        <div className="mt-1 flex flex-wrap gap-2">
                                            {latestMatch.missing_keywords.map((kw) => (
                                                <span
                                                    key={kw}
                                                    className="rounded-full bg-red-100 px-2 py-1 text-xs text-red-800"
                                                >
                                                    {kw}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Cover letter result */}
                        {latestMatch?.cover_letter && (
                            <div className="mt-6 rounded-md border border-gray-200 p-4">
                                <div className="mb-2 flex items-center justify-between">
                                    <p className="text-sm font-medium text-gray-700">Cover Letter</p>
                                    <button
                                        onClick={copyToClipboard}
                                        className="text-xs text-indigo-600 hover:underline"
                                    >
                                        {copied ? 'Copied!' : 'Copy'}
                                    </button>
                                </div>
                                <textarea
                                    rows={8}
                                    defaultValue={latestMatch.cover_letter}
                                    className="block w-full rounded-md border-gray-300 text-sm shadow-sm"
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}