const COLUMN_META = {
    applied: { label: 'Applied', dot: 'bg-blue-500', accent: 'bg-blue-500' },
    interview: { label: 'Interview', dot: 'bg-amber-500', accent: 'bg-amber-500' },
    offer: { label: 'Offer', dot: 'bg-emerald-500', accent: 'bg-emerald-500' },
    rejected: { label: 'Rejected', dot: 'bg-red-500', accent: 'bg-red-500' },
};

import { useDroppable } from '@dnd-kit/core';

export default function KanbanColumn({ status, children, count }) {
    const { setNodeRef, isOver } = useDroppable({ id: status });
    const meta = COLUMN_META[status];

    return (
        <div
            ref={setNodeRef}
            className={`flex min-h-[400px] w-full flex-col rounded-2xl border bg-white transition-all duration-200 ${
                isOver ? 'border-brand shadow-lg ring-2 ring-brand/30' : 'border-gray-200 shadow-sm'
            }`}
        >
            <div className={`h-1.5 rounded-t-2xl ${meta.accent}`} />

            <div className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-2">
                    <span className={`h-2 w-2 rounded-full ${meta.dot}`} />
                    <h3 className="text-sm font-semibold text-gray-700">{meta.label}</h3>
                </div>
                <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-500">
                    {count}
                </span>
            </div>
<div className="custom-scrollbar max-h-[600px] flex-1 space-y-2.5 overflow-y-auto px-3 pb-4">
    {children}
    {count === 0 && (
        <div className="flex h-24 items-center justify-center rounded-xl border-2 border-dashed border-gray-100 text-xs text-gray-300">
            Drop here
        </div>
    )}
</div>
        </div>
    );
}