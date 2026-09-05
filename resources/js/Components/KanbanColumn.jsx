import { useDroppable } from '@dnd-kit/core';

const COLUMN_STYLES = {
    applied: 'border-blue-300 bg-blue-50',
    interview: 'border-yellow-300 bg-yellow-50',
    offer: 'border-green-300 bg-green-50',
    rejected: 'border-red-300 bg-red-50',
};

export default function KanbanColumn({ status, title, children }) {
    const { setNodeRef, isOver } = useDroppable({ id: status });

    return (
        <div
            ref={setNodeRef}
            className={`min-h-[300px] w-full rounded-lg border-2 p-3 ${COLUMN_STYLES[status]} ${
                isOver ? 'ring-2 ring-gray-400' : ''
            }`}
        >
            <h3 className="mb-3 text-sm font-semibold uppercase text-gray-700">{title}</h3>
            <div className="space-y-2">{children}</div>
        </div>
    );
}