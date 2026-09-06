import { useEffect } from 'react';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import InputError from '@/Components/InputError';
import { Transition } from '@headlessui/react';
import { useForm, usePage } from '@inertiajs/react';

export default function UpdateResumeForm({ className = '' }) {
    const user = usePage().props.auth.user;

    const { data, setData, post, processing, recentlySuccessful, errors } = useForm({
        resume_text: user.resume_text || '',
        resume_pdf: null,
        _method: 'patch',
    });

    // Keep the textarea in sync whenever fresh user data arrives from the
    // server (e.g. right after a successful save, or a PDF extraction).
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
                <h2 className="text-lg font-medium text-gray-900">Resume / Skills Summary</h2>
                <p className="mt-1 text-sm text-gray-600">
                    This is used by the AI Match Score and Cover Letter features to compare against job descriptions.
                </p>
            </header>

            <form onSubmit={submit} className="mt-6 space-y-6">
                <div>
                    <InputLabel htmlFor="resume_pdf" value="Replace with a new PDF (optional)" />
                    <input
                        id="resume_pdf"
                        type="file"
                        accept="application/pdf"
                        className="mt-1 block w-full text-sm text-gray-600"
                        onChange={(e) => setData('resume_pdf', e.target.files[0])}
                    />
                    <InputError message={errors.resume_pdf} className="mt-2" />
                    <p className="mt-1 text-xs text-gray-500">
                        Uploading a new PDF will overwrite the text below with the extracted content.
                    </p>
                </div>

                <div>
                    <InputLabel htmlFor="resume_text" value="Or edit the text directly" />
                    <textarea
                        id="resume_text"
                        rows={6}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                        value={data.resume_text}
                        onChange={(e) => setData('resume_text', e.target.value)}
                    />
                    <InputError message={errors.resume_text} className="mt-2" />
                </div>

                <div className="flex items-center gap-4">
                    <PrimaryButton disabled={processing}>Save</PrimaryButton>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm text-gray-600">Saved.</p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}