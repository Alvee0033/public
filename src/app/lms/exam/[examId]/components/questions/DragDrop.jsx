'use client';
import { useState } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import BaseQuestion from './BaseQuestion';

export default function DragDrop({ question, answer = [], onAnswer }) {
    const [items, setItems] = useState(
        answer.length > 0
            ? answer
            : question.items.map((item, index) => ({
                id: `item-${index}`,
                content: item
            }))
    );

    const handleDragEnd = (result) => {
        if (!result.destination) return;

        const newItems = Array.from(items);
        const [reorderedItem] = newItems.splice(result.source.index, 1);
        newItems.splice(result.destination.index, 0, reorderedItem);

        setItems(newItems);
        onAnswer(newItems);
    };

    return (
        <BaseQuestion number={question.number} text={question.text}>
            <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="droppable">
                    {(provided) => (
                        <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            className="space-y-2"
                        >
                            {items.map((item, index) => (
                                <Draggable
                                    key={item.id}
                                    draggableId={item.id}
                                    index={index}
                                >
                                    {(provided, snapshot) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            className={`p-4 rounded-lg border-2 bg-white
                                                ${snapshot.isDragging
                                                    ? 'border-purple-500 shadow-lg'
                                                    : 'border-gray-200'}`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <span className="text-gray-400">
                                                    {index + 1}.
                                                </span>
                                                <span className="text-gray-900">
                                                    {item.content}
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
        </BaseQuestion>
    );
} 