import { useEffect, useState } from 'react';
import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { router } from '@inertiajs/react';
import KanbanColumn from './KanbanColumn';
import KanbanCard from './KanbanCard';

const COLUMNS = [
    { status: 'applied', title: 'Applied' },
    { status: 'interview', title: 'Interview' },
    { status: 'offer', title: 'Offer' },
    { status: 'rejected', title: 'Rejected' },
];

export default function KanbanBoard({ applications: serverApplications }) {
    // Local, optimistic copy of the applications list. We render from
    // this instead of the prop directly, so a drag can update the UI
    // instantly without waiting for the server round-trip.
    const [applications, setApplications] = useState(serverApplications);
    const [activeId, setActiveId] = useState(null);

    // Keep local state in sync whenever the server sends fresh props
    // (e.g. after a filter change, or a full page visit).
    useEffect(() => {
        setApplications(serverApplications);
    }, [serverApplications]);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: { distance: 8 },
        })
    );

    function applicationsByStatus(status) {
        return applications.filter((application) => application.status === status);
    }

    function handleDragStart(event) {
        setActiveId(event.active.id);
    }

    function handleDragEnd(event) {
        const { active, over } = event;
        setActiveId(null);

        if (!over) return;

        const applicationId = active.id;
        const newStatus = over.id;

        const application = applications.find((app) => app.id.toString() === applicationId);
        if (!application || application.status === newStatus) return;

        const previousStatus = application.status;

        // 1. Optimistic update — change it locally right away.
        setApplications((current) =>
            current.map((app) =>
                app.id.toString() === applicationId ? { ...app, status: newStatus } : app
            )
        );

        // 2. Fire the real request in the background.
        router.patch(
            route('applications.updateStatus', applicationId),
            { status: newStatus },
            {
                preserveScroll: true,
                preserveState: true,
                only: [], // we don't need any props back — we already updated locally
                onError: () => {
                    // 3. Rollback if the server rejected the change
                    // (e.g. authorization failure, validation error).
                    setApplications((current) =>
                        current.map((app) =>
                            app.id.toString() === applicationId
                                ? { ...app, status: previousStatus }
                                : app
                        )
                    );
                },
            }
        );
    }

    const activeApplication = applications.find((app) => app.id.toString() === activeId);

    return (
        <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {COLUMNS.map((column) => (
                    <KanbanColumn key={column.status} status={column.status} title={column.title}>
                        {applicationsByStatus(column.status).map((application) => (
                            <KanbanCard key={application.id} application={application} />
                        ))}
                    </KanbanColumn>
                ))}
            </div>

            <DragOverlay>
                {activeApplication ? <KanbanCard application={activeApplication} /> : null}
            </DragOverlay>
        </DndContext>
    );
}