import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';
import { Mail } from 'lucide-react';

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    function submit(e) {
        e.preventDefault();
        post(route('password.email'));
    }

    return (
        <GuestLayout>
            <Head title="Forgot Password" />

            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-brand/10 text-brand-dark">
                <Mail size={22} />
            </div>

            <h2 className="mb-1 font-serif text-2xl font-semibold text-gray-900">Forgot your password?</h2>
            <p className="mb-6 text-sm text-gray-500">
                No problem. Enter your email and we&apos;ll send you a reset link.
            </p>

            {status && (
                <div className="mb-4 rounded-lg bg-green-50 p-3 text-sm font-medium text-green-700">
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="space-y-5">
                <div>
                    <InputLabel htmlFor="email" value="Email" />
                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full focus:border-brand focus:ring-brand"
                        isFocused={true}
                        onChange={(e) => setData('email', e.target.value)}
                        required
                    />
                    <InputError message={errors.email} className="mt-2" />
                </div>

                <button
                    type="submit"
                    disabled={processing}
                    className="w-full rounded-lg bg-teal-900 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-teal-800 disabled:opacity-50"
                >
                    Email Password Reset Link
                </button>
            </form>
        </GuestLayout>
    );
}