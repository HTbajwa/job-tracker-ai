import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const STATUS_COLORS = {
    applied: '#3b82f6',
    interview: '#eab308',
    offer: '#22c55e',
    rejected: '#ef4444',
};

export default function Dashboard({ stats, statusBreakdown, insight, upcomingFollowUps }) {
    const chartData = Object.entries(statusBreakdown).map(([status, count]) => ({
        status: status.charAt(0).toUpperCase() + status.slice(1),
        count,
        fill: STATUS_COLORS[status],
    }));

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-6xl space-y-6 sm:px-6 lg:px-8">
                    {/* Stat cards */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <div className="rounded-lg bg-white p-6 shadow">
                            <p className="text-sm font-medium text-gray-500">Total Applications</p>
                            <p className="mt-1 text-3xl font-bold text-gray-900">{stats.total}</p>
                        </div>
                        <div className="rounded-lg bg-white p-6 shadow">
                            <p className="text-sm font-medium text-gray-500">Response Rate</p>
                            <p className="mt-1 text-3xl font-bold text-gray-900">{stats.responseRate}%</p>
                        </div>
                        <div className="rounded-lg bg-white p-6 shadow">
                            <p className="text-sm font-medium text-gray-500">Applications This Week</p>
                            <p className="mt-1 text-3xl font-bold text-gray-900">{stats.thisWeek}</p>
                        </div>
                    </div>

                    {/* AI Insight */}
                    {insight && (
                        <div className="rounded-lg border border-indigo-200 bg-indigo-50 p-4">
                            <p className="text-sm font-medium text-indigo-900">
                                <span className="mr-1">✨</span>
                                {insight}
                            </p>
                        </div>
                    )}

                    {/* Status breakdown chart */}
                    <div className="rounded-lg bg-white p-6 shadow">
                        <h3 className="mb-4 text-sm font-medium text-gray-700">Applications by Status</h3>
                        {stats.total > 0 ? (
                            <ResponsiveContainer width="100%" height={250}>
                                <BarChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="status" tick={{ fontSize: 12 }} />
                                    <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                                    <Tooltip />
                                    <Bar dataKey="count" radius={[4, 4, 0, 0]} />
                                </BarChart>
     
                            </ResponsiveContainer>
                        ) : (
                            <p className="py-8 text-center text-sm text-gray-500">
                                No applications yet — add your first one to see stats here.
                            </p>
                        )}
                    </div>
                                               {upcomingFollowUps.length > 0 && (
    <div className="rounded-lg bg-white p-6 shadow">
        <h3 className="mb-4 text-sm font-medium text-gray-700">Upcoming Follow-ups</h3>
        <div className="space-y-2">
            {upcomingFollowUps.map((item) => (
                <Link
                    key={item.id}
                    href={route('applications.show', item.id)}
                    className="flex items-center justify-between rounded-md border border-gray-100 p-3 hover:bg-gray-50"
                >
                    <div>
                        <p className="text-sm font-medium text-gray-900">{item.company}</p>
                        <p className="text-xs text-gray-500">{item.role}</p>
                    </div>
                    <span
                        className={`rounded-full px-2 py-1 text-xs font-medium ${
                            item.is_overdue ? 'bg-orange-100 text-orange-800' : 'bg-gray-100 text-gray-700'
                        }`}
                    >
                        {new Date(item.follow_up_date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                        })}
                        {item.is_overdue && ' (overdue)'}
                    </span>
                </Link>
            ))}
        </div>
    </div>
)}

                    

                    <div>
                        <Link
                            href={route('applications.index')}
                            className="rounded-md bg-gray-800 px-4 py-2 text-sm text-white hover:bg-gray-700"
                        >
                            View All Applications
                        </Link>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}