import { useDraggable } from '@dnd-kit/core';
import { Link } from '@inertiajs/react';

export default function KanbanCard({ application }) {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: application.id.toString(),
    });

    const style = transform
        ? {
              transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
              zIndex: 50,
          }
        : undefined;

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...listeners}
            {...attributes}
            className={`cursor-grab rounded-md bg-white p-3 shadow-sm active:cursor-grabbing ${
                isDragging ? 'opacity-50' : ''
            }`}
        >
            <p className="text-sm font-medium text-gray-900">{application.company}</p>
            <p className="text-xs text-gray-600">{application.role}</p>
            <Link
                href={route('applications.show', application.id)}
                className="mt-2 inline-block text-xs text-blue-600 hover:underline"
                onClick={(e) => e.stopPropagation()}
            >
                View →
            </Link>
        </div>
    );
}