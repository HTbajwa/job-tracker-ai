import { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import {
    LayoutDashboard,
    Briefcase,
    User,
    LogOut,
    Menu,
    X,
    Plus,
    TrendingUp,
} from 'lucide-react';

const NAV_ITEMS = [
    { name: 'Dashboard', href: 'dashboard', icon: LayoutDashboard },
    { name: 'Applications', href: 'applications.index', icon: Briefcase },
    { name: 'Profile', href: 'profile.edit', icon: User },
];

export default function SidebarLayout({ header, children }) {
    const { auth, navStats } = usePage().props;
    const [mobileOpen, setMobileOpen] = useState(false);

    const initials = auth.user.name
        .split(' ')
        .map((part) => part[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();

    return (
        <div className="min-h-screen bg-cream">
            {/* Mobile top bar */}
            <div className="flex items-center justify-between border-b border-teal-800 bg-teal-900 px-4 py-3 md:hidden">
                <span className="font-serif text-lg font-semibold text-white">JobTracker</span>
                <button onClick={() => setMobileOpen(!mobileOpen)} className="text-white">
                    {mobileOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            <div className="flex">
                {/* Sidebar */}
                <aside
                    className={`fixed inset-y-0 left-0 z-40 w-64 transform bg-teal-900 transition-transform duration-200 md:static md:translate-x-0 ${
                        mobileOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
                >
                    <div className="flex h-full flex-col px-4 py-6">
                        <div className="mb-6 hidden items-center gap-2 px-2 md:flex">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand font-serif text-lg font-bold text-teal-950">
                                J
                            </div>
                            <span className="font-serif text-lg font-semibold text-white">JobTracker</span>
                        </div>

                        <Link
                            href={route('applications.create')}
                            className="mb-6 flex items-center justify-center gap-2 rounded-lg bg-brand px-3 py-2.5 text-sm font-semibold text-teal-950 transition-colors hover:bg-brand-light"
                        >
                            <Plus size={18} />
                            New Application
                        </Link>

                        <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-teal-400">
                            Menu
                        </p>

                    <nav className="space-y-1">
    {NAV_ITEMS.map((item) => {
        const isActive = route().current(item.href) || route().current(`${item.href}.*`);
        const Icon = item.icon;
        return (
            <Link
                key={item.name}
                href={route(item.href)}
                className={`flex items-center gap-3 rounded-lg border-l-2 px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                        ? 'border-brand bg-teal-800/60 text-white'
                        : 'border-transparent text-teal-100 hover:bg-teal-800/40 hover:text-white'
                }`}
            >
                <Icon size={18} className={isActive ? 'text-brand' : ''} />
                {item.name}
            </Link>
        );
    })}
</nav>

                        {navStats && (
                            <div className="mt-6 rounded-lg border border-teal-800 bg-teal-800/50 p-4">
                                <div className="flex items-center gap-2 text-teal-300">
                                    <TrendingUp size={16} />
                                    <span className="text-xs font-medium uppercase tracking-wide">
                                        This Week
                                    </span>
                                </div>
                                <p className="mt-2 text-2xl font-bold text-white">
                                    {navStats.thisWeek}
                                    <span className="ml-1 text-sm font-normal text-teal-300">
                                        application{navStats.thisWeek !== 1 ? 's' : ''}
                                    </span>
                                </p>
                            </div>
                        )}

                        <div className="mt-auto border-t border-teal-800 pt-4">
                            <div className="mb-3 flex items-center gap-3 px-3">
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand text-sm font-bold text-teal-950">
                                    {initials}
                                </div>
                                <div className="min-w-0">
                                    <p className="truncate text-sm font-medium text-white">
                                        {auth.user.name}
                                    </p>
                                    <p className="truncate text-xs text-teal-300">{auth.user.email}</p>
                                </div>
                            </div>
                            <Link
                                href={route('logout')}
                                method="post"
                                as="button"
                                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-teal-100 hover:bg-teal-800 hover:text-white"
                            >
                                <LogOut size={18} />
                                Log Out
                            </Link>
                        </div>
                    </div>
                </aside>

                {mobileOpen && (
                    <div
                        className="fixed inset-0 z-30 bg-black/30 md:hidden"
                        onClick={() => setMobileOpen(false)}
                    />
                )}

                <div className="min-h-screen flex-1 md:ml-0">
                    {header && (
                        <header className="border-b border-gray-200 bg-white px-6 py-5">
                            {header}
                        </header>
                    )}
                    <main className="p-6">{children}</main>
                </div>
            </div>
        </div>
    );
}