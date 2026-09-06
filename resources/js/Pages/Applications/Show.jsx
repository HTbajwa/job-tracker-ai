import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import {
    ArrowLeft,
    Pencil,
    ExternalLink,
    Sparkles,
    FileText,
    Copy,
    Check,
    Calendar,
} from 'lucide-react';

const STATUS_STYLES = {
    applied: 'bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-200',
    interview: 'bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200',
    offer: 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200',
    rejected: 'bg-red-50 text-red-700 ring-1 ring-inset ring-red-200',
};

function formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
}

export default function Show({ application }) {
    const [jobDescription, setJobDescription] = useState('');
    const [copied, setCopied] = useState(false);

    const matchForm = useForm({ job_description: '' });
    const letterForm = useForm({ job_description: '' });

    const latestMatch = application.ai_matches?.length
        ? [...application.ai_matches].sort((a, b) => b.id - a.id)[0]
        : null;

    const isOverdue =
        application.follow_up_date &&
        new Date(application.follow_up_date) < new Date().setHours(0, 0, 0, 0);

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
                <div className="flex items-center justify-between">
                    <div>
                        <Link
                            href={route('applications.index')}
                            className="mb-1 flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
                        >
                            <ArrowLeft size={14} />
                            Back to Applications
                        </Link>
                        <h2 className="font-serif text-2xl font-semibold text-gray-900">
                            {application.company}
                        </h2>
                        <p className="text-sm text-gray-500">{application.role}</p>
                    </div>
                    <Link
                        href={route('applications.edit', application.id)}
                        className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                        <Pencil size={15} />
                        Edit
                    </Link>
                </div>
            }
        >
            <Head title={`${application.company} - ${application.role}`} />

            <div className="mx-auto max-w-3xl space-y-5">
                {/* Details card */}
                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                    <div className="mb-4 flex flex-wrap items-center gap-3">
                        <span className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${STATUS_STYLES[application.status]}`}>
                            {application.status}
                        </span>
                        {application.follow_up_date && (
                            <span
                                className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
                                    isOverdue ? 'bg-orange-50 text-orange-700' : 'bg-gray-100 text-gray-600'
                                }`}
                            >
                                <Calendar size={13} />
                                Follow up {formatDate(application.follow_up_date)}
                                {isOverdue && ' · Overdue'}
                            </span>
                        )}
                    </div>

                    <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <dt className="text-xs font-medium uppercase tracking-wide text-gray-400">Applied Date</dt>
                            <dd className="mt-1 text-sm text-gray-900">{formatDate(application.applied_date)}</dd>
                        </div>
                        {application.job_url && (
                            <div>
                                <dt className="text-xs font-medium uppercase tracking-wide text-gray-400">Job URL</dt>
                                <dd className="mt-1">
                                    <a
                                        href={application.job_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1 text-sm text-brand-dark hover:underline"
                                    >
                                        View listing
                                        <ExternalLink size={13} />
                                    </a>
                                </dd>
                            </div>
                        )}
                    </dl>

                    {application.notes && (
                        <div className="mt-4 border-t border-gray-100 pt-4">
                            <dt className="text-xs font-medium uppercase tracking-wide text-gray-400">Notes</dt>
                            <dd className="mt-1 whitespace-pre-wrap text-sm text-gray-700">{application.notes}</dd>
                        </div>
                    )}
                </div>

                {/* AI panel */}
                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                    <div className="mb-4 flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand/10 text-brand-dark">
                            <Sparkles size={16} />
                        </div>
                        <h3 className="font-serif text-lg font-semibold text-gray-900">AI Match &amp; Cover Letter</h3>
                    </div>

                    <textarea
                        rows={6}
                        placeholder="Paste the job description here..."
                        value={jobDescription}
                        onChange={(e) => setJobDescription(e.target.value)}
                        className="block w-full rounded-lg border-gray-300 text-sm shadow-sm focus:border-brand focus:ring-brand"
                    />

                    <div className="mt-3 flex flex-wrap gap-3">
                        <button
                            onClick={handleMatchScore}
                            disabled={matchForm.processing || jobDescription.trim().length < 20}
                            className="flex items-center gap-2 rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-teal-950 transition-colors hover:bg-brand-light disabled:opacity-40"
                        >
                            <Sparkles size={15} />
                            {matchForm.processing ? 'Scoring...' : 'Get Match Score'}
                        </button>
                        <button
                            onClick={handleCoverLetter}
                            disabled={letterForm.processing || jobDescription.trim().length < 20}
                            className="flex items-center gap-2 rounded-lg bg-teal-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-teal-800 disabled:opacity-40"
                        >
                            <FileText size={15} />
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
                        <div className="mt-6 rounded-xl bg-gray-50 p-5">
                            <div className="flex items-center gap-4">
                                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-white shadow-sm">
                                    <span className="font-serif text-xl font-bold text-brand-dark">
                                        {latestMatch.match_score}%
                                    </span>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-900">Match Score</p>
                                    <p className="text-xs text-gray-500">Based on your saved resume</p>
                                </div>
                            </div>
                            {latestMatch.missing_keywords?.length > 0 && (
                                <div className="mt-4">
                                    <p className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-400">
                                        Missing Keywords
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {latestMatch.missing_keywords.map((kw) => (
                                            <span
                                                key={kw}
                                                className="rounded-full bg-red-50 px-2.5 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-200"
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
                        <div className="mt-6 rounded-xl bg-gray-50 p-5">
                            <div className="mb-3 flex items-center justify-between">
                                <p className="text-sm font-medium text-gray-900">Cover Letter</p>
                                <button
                                    onClick={copyToClipboard}
                                    className="flex items-center gap-1.5 rounded-md bg-white px-2.5 py-1 text-xs font-medium text-gray-600 shadow-sm hover:bg-gray-100"
                                >
                                    {copied ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} />}
                                    {copied ? 'Copied' : 'Copy'}
                                </button>
                            </div>
                            <textarea
                                rows={8}
                                defaultValue={latestMatch.cover_letter}
                                className="block w-full rounded-lg border-gray-200 bg-white text-sm shadow-sm focus:border-brand focus:ring-brand"
                            />
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}