import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import UpdateResumeForm from './Partials/UpdateResumeForm';
import { User, Lock, FileText, AlertTriangle } from 'lucide-react';

const TABS = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'resume', label: 'Resume', icon: FileText },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'danger', label: 'Danger Zone', icon: AlertTriangle },
];

export default function Edit({ mustVerifyEmail, status }) {
    const [activeTab, setActiveTab] = useState('profile');

    return (
        <AuthenticatedLayout
            header={<h2 className="font-serif text-2xl font-semibold text-gray-900">Profile</h2>}
        >
            <Head title="Profile" />

            <div className="mx-auto max-w-3xl">
                {/* Tab bar */}
                <div className="mb-5 flex gap-1 overflow-x-auto rounded-xl border border-gray-200 bg-white p-1.5">
                    {TABS.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex shrink-0 items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                                    isActive
                                        ? 'bg-teal-900 text-white'
                                        : 'text-gray-600 hover:bg-gray-100'
                                }`}
                            >
                                <Icon size={15} />
                                {tab.label}
                            </button>
                        );
                    })}
                </div>

                {/* Tab content */}
                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
                    {activeTab === 'profile' && (
                        <UpdateProfileInformationForm
                            mustVerifyEmail={mustVerifyEmail}
                            status={status}
                            className="max-w-xl"
                        />
                    )}
                    {activeTab === 'resume' && <UpdateResumeForm className="max-w-xl" />}
                    {activeTab === 'security' && <UpdatePasswordForm className="max-w-xl" />}
                    {activeTab === 'danger' && <DeleteUserForm className="max-w-xl" />}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}