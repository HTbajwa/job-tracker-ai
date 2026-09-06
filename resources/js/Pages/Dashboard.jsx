import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Briefcase, TrendingUp, CalendarClock, Sparkles, ArrowRight } from 'lucide-react';

const STATUS_COLORS = {
    Applied: '#3b82f6',
    Interview: '#eab308',
    Offer: '#22c55e',
    Rejected: '#ef4444',
};

export default function Dashboard({ stats, statusBreakdown, insight, upcomingFollowUps }) {
    const chartData = Object.entries(statusBreakdown).map(([status, count]) => {
        const label = status.charAt(0).toUpperCase() + status.slice(1);
        return { status: label, count, fill: STATUS_COLORS[label] };
    });

    return (
        <AuthenticatedLayout
            header={<h2 className="font-serif text-2xl font-semibold text-gray-900">Dashboard</h2>}
        >
            <Head title="Dashboard" />

            <div className="space-y-5">
                {/* Stat cards */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div className="flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                            <Briefcase size={20} />
                        </div>
                        <div>
                            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">Total</p>
                            <p className="font-serif text-2xl font-bold text-gray-900">{stats.total}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                            <TrendingUp size={20} />
                        </div>
                        <div>
                            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">Response Rate</p>
                            <p className="font-serif text-2xl font-bold text-gray-900">{stats.responseRate}%</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-brand-dark">
                            <CalendarClock size={20} />
                        </div>
                        <div>
                            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">This Week</p>
                            <p className="font-serif text-2xl font-bold text-gray-900">{stats.thisWeek}</p>
                        </div>
                    </div>
                </div>

                {/* AI Insight */}
                {insight && (
                    <div className="flex items-start gap-3 rounded-2xl border border-brand/20 bg-brand/5 p-4">
                        <Sparkles size={16} className="mt-0.5 shrink-0 text-brand-dark" />
                        <p className="text-sm text-teal-900">{insight}</p>
                    </div>
                )}

                {/* Chart + Follow-ups side by side */}
                <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
                    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm lg:col-span-2">
                        <h3 className="mb-3 text-sm font-semibold text-gray-700">Applications by Status</h3>
                        {stats.total > 0 ? (
                            <ResponsiveContainer width="100%" height={220}>
                                <BarChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="status" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                                    <YAxis allowDecimals={false} tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                                    <Tooltip cursor={{ fill: '#f8fafc' }} />
                                    <Bar dataKey="count" radius={[6, 6, 0, 0]} maxBarSize={48} />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex h-[220px] flex-col items-center justify-center text-center">
                                <p className="text-sm text-gray-500">No applications yet.</p>
                                <Link
                                    href={route('applications.create')}
                                    className="mt-2 text-sm font-medium text-brand-dark hover:underline"
                                >
                                    Add your first one →
                                </Link>
                            </div>
                        )}
                    </div>

                    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                        <h3 className="mb-3 text-sm font-semibold text-gray-700">Upcoming Follow-ups</h3>
                        {upcomingFollowUps.length > 0 ? (
                            <div className="custom-scrollbar max-h-[220px] space-y-2 overflow-y-auto pr-1">
                                {upcomingFollowUps.map((item) => (
                                    <Link
                                        key={item.id}
                                        href={route('applications.show', item.id)}
                                        className="flex items-center justify-between rounded-lg border border-gray-100 p-2.5 transition-colors hover:bg-gray-50"
                                    >
                                        <div className="min-w-0">
                                            <p className="truncate text-sm font-medium text-gray-900">{item.company}</p>
                                            <p className="truncate text-xs text-gray-500">{item.role}</p>
                                        </div>
                                        <span
                                            className={`ml-2 shrink-0 rounded-full px-2 py-1 text-xs font-medium ${
                                                item.is_overdue
                                                    ? 'bg-orange-100 text-orange-700'
                                                    : 'bg-gray-100 text-gray-600'
                                            }`}
                                        >
                                            {new Date(item.follow_up_date).toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                            })}
                                        </span>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div className="flex h-[220px] items-center justify-center text-center text-sm text-gray-400">
                                No upcoming follow-ups.
                            </div>
                        )}
                    </div>
                </div>

                <Link
                    href={route('applications.index')}
                    className="inline-flex items-center gap-2 text-sm font-medium text-brand-dark hover:underline"
                >
                    View All Applications
                    <ArrowRight size={14} />
                </Link>
            </div>
        </AuthenticatedLayout>
    );
}