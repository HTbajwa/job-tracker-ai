import { Link } from '@inertiajs/react';
import { Briefcase, Sparkles, TrendingUp } from 'lucide-react';

export default function GuestLayout({ children }) {
    return (
        <div className="flex min-h-screen bg-cream">
            {/* Left branding panel — hidden on mobile */}
            <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-teal-900 p-12 lg:flex">
                <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-brand/10" />
                <div className="absolute -bottom-32 -left-16 h-80 w-80 rounded-full bg-teal-700/30" />

                <Link href="/" className="relative z-10 flex items-center gap-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand font-serif text-xl font-bold text-teal-950">
                        J
                    </div>
                    <span className="font-serif text-xl font-semibold text-white">JobTracker</span>
                </Link>

                <div className="relative z-10">
                    <h1 className="mb-4 font-serif text-4xl font-semibold leading-tight text-white">
                        Track every application, land the right offer.
                    </h1>
                    <p className="mb-8 text-teal-200">
                        Kanban boards, AI match scoring, and cover letters all in one place.
                    </p>

                    <div className="space-y-4">
                        <div className="flex items-center gap-3 text-teal-100">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-800">
                                <Briefcase size={18} />
                            </div>
                            <span className="text-sm">Organize applications with a visual Kanban board</span>
                        </div>
                        <div className="flex items-center gap-3 text-teal-100">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-800">
                                <Sparkles size={18} />
                            </div>
                            <span className="text-sm">AI-powered resume match scoring &amp; cover letters</span>
                        </div>
                        <div className="flex items-center gap-3 text-teal-100">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-800">
                                <TrendingUp size={18} />
                            </div>
                            <span className="text-sm">Spot patterns in your job search with insights</span>
                        </div>
                    </div>
                </div>

                <p className="relative z-10 text-xs text-teal-400">© {new Date().getFullYear()} JobTracker</p>
            </div>

            {/* Right form panel */}
            <div className="flex w-full flex-col items-center justify-center px-6 py-12 lg:w-1/2">
                {/* Mobile-only logo */}
                <Link href="/" className="mb-6 flex items-center gap-2 lg:hidden">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand font-serif text-lg font-bold text-teal-950">
                        J
                    </div>
                    <span className="font-serif text-lg font-semibold text-gray-900">JobTracker</span>
                </Link>

                <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm">
                    {children}
                </div>
            </div>
        </div>
    );
}