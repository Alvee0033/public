'use client';
import { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import BaseQuestion from './BaseQuestion';

function SortableItem({ item, index }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`p-4 rounded-lg border-2 bg-white select-none cursor-grab active:cursor-grabbing ${
        isDragging ? 'border-purple-500 shadow-lg opacity-80' : 'border-gray-200'
      }`}
    >
      <div className="flex items-center gap-3">
        <span className="text-gray-400">{index + 1}.</span>
        <span className="text-gray-900">{item.content}</span>
      </div>
    </div>
  );
}

export default function DragDrop({ question, answer = [], onAnswer }) {
  const [items, setItems] = useState(
    answer.length > 0
      ? answer
      : question.items.map((item, index) => ({
          id: `item-${index}`,
          content: item,
        }))
  );

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setItems((prev) => {
      const oldIndex = prev.findIndex((i) => i.id === active.id);
      const newIndex = prev.findIndex((i) => i.id === over.id);
      const updated = arrayMove(prev, oldIndex, newIndex);
      onAnswer(updated);
      return updated;
    });
  };

  return (
    <BaseQuestion number={question.number} text={question.text}>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-2">
            {items.map((item, index) => (
              <SortableItem key={item.id} item={item} index={index} />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </BaseQuestion>
  );
}
