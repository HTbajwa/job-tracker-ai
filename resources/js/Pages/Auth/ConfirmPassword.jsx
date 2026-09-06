import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PasswordInput from '@/Components/PasswordInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';
import { ShieldCheck } from 'lucide-react';

export default function ConfirmPassword() {
    const { data, setData, post, processing, errors, reset } = useForm({
        password: '',
    });

    function submit(e) {
        e.preventDefault();
        post(route('password.confirm'), {
            onFinish: () => reset('password'),
        });
    }

    return (
        <GuestLayout>
            <Head title="Confirm Password" />

            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-brand/10 text-brand-dark">
                <ShieldCheck size={22} />
            </div>

            <h2 className="mb-1 font-serif text-2xl font-semibold text-gray-900">Confirm your password</h2>
            <p className="mb-6 text-sm text-gray-500">
                This is a secure area. Please confirm your password before continuing.
            </p>

            <form onSubmit={submit} className="space-y-5">
                <div>
                    <InputLabel htmlFor="password" value="Password" />
                    <PasswordInput
                        id="password"
                        name="password"
                        value={data.password}
                        className="mt-1"
                        isFocused={true}
                        onChange={(e) => setData('password', e.target.value)}
                        required
                    />
                    <InputError message={errors.password} className="mt-2" />
                </div>

                <button
                    type="submit"
                    disabled={processing}
                    className="w-full rounded-lg bg-teal-900 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-teal-800 disabled:opacity-50"
                >
                    Confirm
                </button>
            </form>
        </GuestLayout>
    );
}