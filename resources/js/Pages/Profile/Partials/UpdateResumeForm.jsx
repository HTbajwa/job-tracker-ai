import { useEffect, useState } from 'react';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import { Transition } from '@headlessui/react';
import { useForm, usePage } from '@inertiajs/react';

export default function UpdateResumeForm({ className = '' }) {
    const user = usePage().props.auth.user;
    const [resumeTab, setResumeTab] = useState('text');

    const { data, setData, post, processing, recentlySuccessful, errors } = useForm({
        resume_text: user.resume_text || '',
        resume_pdf: null,
        _method: 'patch',
    });

    useEffect(() => {
        setData('resume_text', user.resume_text || '');
    }, [user.resume_text]);

    function submit(e) {
        e.preventDefault();
        post(route('profile.updateResume'), {
            preserveScroll: true,
            onSuccess: () => setData('resume_pdf', null),
        });
    }

    return (
        <section className={className}>
            <header>
                <h2 className="font-serif text-lg font-semibold text-gray-900">Resume / Skills Summary</h2>
                <p className="mt-1 text-sm text-gray-500">
                    This is used by the AI Match Score and Cover Letter features to compare against job
                    descriptions.
                </p>
            </header>

            <form onSubmit={submit} className="mt-6 space-y-5">
                <div className="flex gap-6 border-b border-gray-200">
                    <button
                        type="button"
                        onClick={() => setResumeTab('text')}
                        className={`-mb-px border-b-2 pb-2 text-sm font-medium transition-colors ${
                            resumeTab === 'text'
                                ? 'border-brand text-teal-900'
                                : 'border-transparent text-gray-400 hover:text-gray-600'
                        }`}
                    >
                        Edit Text
                    </button>
                    <button
                        type="button"
                        onClick={() => setResumeTab('pdf')}
                        className={`-mb-px border-b-2 pb-2 text-sm font-medium transition-colors ${
                            resumeTab === 'pdf'
                                ? 'border-brand text-teal-900'
                                : 'border-transparent text-gray-400 hover:text-gray-600'
                        }`}
                    >
                        Replace with PDF
                    </button>
                </div>

                {resumeTab === 'text' ? (
                    <div>
                        <textarea
                            id="resume_text"
                            rows={8}
                            placeholder="Paste your skills, tech stack, and experience..."
                            className="block w-full rounded-lg border-gray-300 text-sm shadow-sm focus:border-brand focus:ring-brand"
                            value={data.resume_text}
                            onChange={(e) => setData('resume_text', e.target.value)}
                        />
                        <InputError message={errors.resume_text} className="mt-2" />
                    </div>
                ) : (
                    <div>
                        <InputLabel htmlFor="resume_pdf" value="Upload a new PDF" />
                        <input
                            id="resume_pdf"
                            type="file"
                            accept="application/pdf"
                            className="mt-1 block w-full text-sm text-gray-600 file:mr-3 file:rounded-md file:border file:border-gray-300 file:bg-gray-50 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-gray-700 hover:file:bg-gray-100"
                            onChange={(e) => setData('resume_pdf', e.target.files[0])}
                        />
                        <InputError message={errors.resume_pdf} className="mt-2" />
                        <p className="mt-2 text-xs text-gray-500">
                            Uploading a PDF will overwrite the text above with the extracted content.
                        </p>
                    </div>
                )}

                <div className="flex items-center gap-4">
                    <button
                        type="submit"
                        disabled={processing}
                        className="rounded-lg bg-teal-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-teal-800 disabled:opacity-50"
                    >
                        Save
                    </button>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm text-gray-500">Saved.</p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}