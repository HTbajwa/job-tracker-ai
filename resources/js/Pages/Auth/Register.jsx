import { useState } from 'react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PasswordInput from '@/Components/PasswordInput';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Register() {
    const [resumeTab, setResumeTab] = useState('pdf');

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        resume_text: '',
        resume_pdf: null,
    });

    function submit(e) {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    }

    return (
        <GuestLayout>
            <Head title="Register" />

            <h2 className="mb-1 font-serif text-2xl font-semibold text-gray-900">Create your account</h2>
            <p className="mb-5 text-sm text-gray-500">Start tracking applications in minutes.</p>

            <form onSubmit={submit} className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                        <InputLabel htmlFor="name" value="Name" />
                        <TextInput
                            id="name"
                            name="name"
                            value={data.name}
                            className="mt-1 block w-full focus:border-brand focus:ring-brand"
                            autoComplete="name"
                            isFocused={true}
                            onChange={(e) => setData('name', e.target.value)}
                            required
                        />
                        <InputError message={errors.name} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel htmlFor="email" value="Email" />
                        <TextInput
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            className="mt-1 block w-full focus:border-brand focus:ring-brand"
                            autoComplete="username"
                            onChange={(e) => setData('email', e.target.value)}
                            required
                        />
                        <InputError message={errors.email} className="mt-2" />
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                        <InputLabel htmlFor="password" value="Password" />
                        <PasswordInput
                            id="password"
                            name="password"
                            value={data.password}
                            className="mt-1"
                            autoComplete="new-password"
                            onChange={(e) => setData('password', e.target.value)}
                            required
                        />
                        <InputError message={errors.password} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel htmlFor="password_confirmation" value="Confirm Password" />
                        <PasswordInput
                            id="password_confirmation"
                            name="password_confirmation"
                            value={data.password_confirmation}
                            className="mt-1"
                            autoComplete="new-password"
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            required
                        />
                        <InputError message={errors.password_confirmation} className="mt-2" />
                    </div>
                </div>

                <div className="border-t border-gray-100 pt-4">
                    <div className="flex items-center justify-between">
                        <InputLabel value="Resume / Skills Summary (optional)" />
                    </div>
                    <p className="mb-2 mt-1 text-xs text-gray-500">
                        Powers the AI Match Score &amp; Cover Letter features.
                    </p>

                    <div className="mb-3 flex gap-6 border-b border-gray-200">
                        <button
                            type="button"
                            onClick={() => setResumeTab('pdf')}
                            className={`-mb-px border-b-2 pb-2 text-sm font-medium transition-colors ${
                                resumeTab === 'pdf'
                                    ? 'border-brand text-teal-900'
                                    : 'border-transparent text-gray-400 hover:text-gray-600'
                            }`}
                        >
                            Upload PDF
                        </button>
                        <button
                            type="button"
                            onClick={() => setResumeTab('text')}
                            className={`-mb-px border-b-2 pb-2 text-sm font-medium transition-colors ${
                                resumeTab === 'text'
                                    ? 'border-brand text-teal-900'
                                    : 'border-transparent text-gray-400 hover:text-gray-600'
                            }`}
                        >
                            Paste Text
                        </button>
                    </div>

                    {resumeTab === 'pdf' ? (
                        <div>
                            <input
                                id="resume_pdf"
                                type="file"
                                accept="application/pdf"
                                className="block w-full text-sm text-gray-600 file:mr-3 file:rounded-md file:border file:border-gray-300 file:bg-gray-50 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-gray-700 hover:file:bg-gray-100"
                                onChange={(e) => setData('resume_pdf', e.target.files[0])}
                            />
                            <InputError message={errors.resume_pdf} className="mt-2" />
                        </div>
                    ) : (
                        <div>
                            <textarea
                                id="resume_text"
                                rows={3}
                                placeholder="Paste your skills, tech stack, and experience..."
                                className="block w-full rounded-lg border-gray-300 text-sm shadow-sm focus:border-brand focus:ring-brand"
                                value={data.resume_text}
                                onChange={(e) => setData('resume_text', e.target.value)}
                            />
                            <InputError message={errors.resume_text} className="mt-2" />
                        </div>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={processing}
                    className="w-full rounded-lg bg-teal-900 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-teal-800 disabled:opacity-50"
                >
                    Create Account
                </button>

                <p className="text-center text-sm text-gray-500">
                    Already have an account?{' '}
                    <Link href={route('login')} className="font-medium text-brand-dark hover:underline">
                        Log in
                    </Link>
                </p>
            </form>
        </GuestLayout>
    );
}