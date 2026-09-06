import { useDraggable } from '@dnd-kit/core';
import { Link } from '@inertiajs/react';
import { ArrowRight, GripVertical } from 'lucide-react';

const STATUS_DOT = {
    applied: 'bg-blue-500',
    interview: 'bg-amber-500',
    offer: 'bg-emerald-500',
    rejected: 'bg-red-500',
};

export default function KanbanCard({ application }) {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: application.id.toString(),
    });

    const style = transform
        ? {
              transform: `translate3d(${transform.x}px, ${transform.y}px, 0) rotate(${isDragging ? '2deg' : '0deg'})`,
              zIndex: 50,
          }
        : undefined;

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...listeners}
            {...attributes}
            className={`group cursor-grab touch-none rounded-xl border border-gray-100 bg-white p-3 shadow-sm transition-all duration-150 active:cursor-grabbing ${
                isDragging ? 'scale-105 opacity-90 shadow-xl' : 'hover:-translate-y-0.5 hover:shadow-md'
            }`}
        >
            <div className="flex items-start gap-2">
                <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${STATUS_DOT[application.status]}`} />
                <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-gray-900">{application.company}</p>
                    <p className="truncate text-xs text-gray-500">{application.role}</p>
                </div>
                <GripVertical size={16} className="mt-0.5 shrink-0 text-gray-300 opacity-0 transition-opacity group-hover:opacity-100" />
            </div>

            <Link
                href={route('applications.show', application.id)}
                onClick={(e) => e.stopPropagation()}
                className="mt-2 flex items-center gap-1 text-xs font-medium text-brand-dark opacity-0 transition-opacity group-hover:opacity-100 hover:underline"
            >
                View details
                <ArrowRight size={11} />
            </Link>
        </div>
    );
}