import PrimaryButton from '@/Components/PrimaryButton';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { MailCheck } from 'lucide-react';

export default function VerifyEmail({ status }) {
    const { post, processing } = useForm({});

    function submit(e) {
        e.preventDefault();
        post(route('verification.send'));
    }

    return (
        <GuestLayout>
            <Head title="Email Verification" />

            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-brand/10 text-brand-dark">
                <MailCheck size={22} />
            </div>

            <h2 className="mb-1 font-serif text-2xl font-semibold text-gray-900">Verify your email</h2>
            <p className="mb-6 text-sm text-gray-500">
                Thanks for signing up! Before getting started, please verify your email by clicking the link we
                just emailed you.
            </p>

            {status === 'verification-link-sent' && (
                <div className="mb-4 rounded-lg bg-green-50 p-3 text-sm font-medium text-green-700">
                    A new verification link has been sent to your email address.
                </div>
            )}

            <form onSubmit={submit} className="flex items-center justify-between">
                <PrimaryButton disabled={processing}>Resend Verification Email</PrimaryButton>

                <Link
                    href={route('logout')}
                    method="post"
                    as="button"
                    className="text-sm text-gray-500 underline hover:text-gray-700"
                >
                    Log Out
                </Link>
            </form>
        </GuestLayout>
    );
}