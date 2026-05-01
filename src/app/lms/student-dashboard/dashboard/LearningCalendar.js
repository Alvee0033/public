'use client';
import { avatarPlaceHolder } from '@/assets/images';
import { Button } from '@/components/ui/button';
import axios from '@/lib/axios';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { useDraggable, useDroppable } from '@dnd-kit/core';
import {
  addDays,
  eachDayOfInterval,
  endOfWeek,
  isSameDay,
  startOfWeek,
} from 'date-fns';
import { CalendarIcon, Clock, Tag } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { toast } from 'sonner';

const DRAG_TYPE = 'EVENT';

const EVENT_TYPES = {
  TUTORING: { label: 'Tutoring', color: 'bg-[#00B7EB]', textColor: 'text-white' },
  LESSONS:  { label: 'Lessons',  color: 'bg-[#9932CC]', textColor: 'text-white' },
  ASSIGNMENTS: { label: 'Assignments', color: 'bg-[#FFA07A]', textColor: 'text-white' },
  EXAMS: { label: 'Exams', color: 'bg-[#4169E1]', textColor: 'text-white' },
  QUIZ:  { label: 'Quiz',  color: 'bg-[#6B8E23]',  textColor: 'text-white' },
};

// Sidebar for displaying events
function CalendarSidebar() {
  const [activeTab, setActiveTab] = useState('tutoring');

  const sidebarData = {
    tutoring: [
      { id: 1, title: 'Math Lesson - Name of The Lesson', date: 'Jan 23, 2021, 3:30 PM', avatar: avatarPlaceHolder },
      { id: 2, title: 'Physics Tutoring Session',         date: 'Jan 23, 2021, 3:30 PM', avatar: avatarPlaceHolder },
      { id: 3, title: 'Chemistry Lab Review',             date: 'Jan 23, 2021, 3:30 PM', avatar: avatarPlaceHolder },
    ],
    lessons: [
      { id: 1, title: 'Advanced Mathematics',  date: 'Jan 23, 2021, 3:30 PM', avatar: avatarPlaceHolder },
      { id: 2, title: 'Biology Fundamentals',  date: 'Jan 23, 2021, 3:30 PM', avatar: avatarPlaceHolder },
    ],
    assignments: [
      { id: 1, title: 'Math Problem Set #5', date: 'Jan 23, 2021, 3:30 PM' },
      { id: 2, title: 'Physics Lab Report',  date: 'Jan 23, 2021, 3:30 PM' },
      { id: 3, title: 'Literature Essay',    date: 'Jan 23, 2021, 3:30 PM' },
    ],
    exams: [
      { id: 1, title: 'Final Math Exam',   date: 'Jan 23, 2021, 3:30 PM' },
      { id: 2, title: 'Chemistry Midterm', date: 'Jan 23, 2021, 3:30 PM' },
    ],
  };

  const tabStyles = {
    tutoring:    'bg-[#00B7EB]',
    lessons:     'bg-[#9932CC]',
    assignments: 'bg-[#FFA07A]',
    exams:       'bg-[#4169E1]',
  };

  return (
    <div className="w-80 bg-white shadow-sm rounded-lg overflow-hidden">
      <div className="flex text-sm">
        {Object.keys(tabStyles).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 text-white capitalize ${tabStyles[tab]} ${
              activeTab === tab ? 'opacity-100' : 'opacity-80 hover:opacity-90'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
      <div className="p-4 space-y-3">
        {sidebarData[activeTab].map((event) => (
          <div
            key={event.id}
            className="bg-white rounded shadow-sm hover:shadow-md transition-shadow cursor-pointer relative p-3"
          >
            <h3 className="text-gray-800 mb-2">{event.title}</h3>
            <div className="flex items-center justify-between">
              <div className="flex items-center text-gray-500 text-sm">
                <CalendarIcon className="w-4 h-4 mr-2" />
                <span>{event.date}</span>
              </div>
              {event.avatar && (
                <Image src={event.avatar} alt="" className="w-8 h-8 rounded-full" width={32} height={32} />
              )}
            </div>
            <div className="absolute right-0 top-0 p-1">
              <div className="w-0 h-0 border-t-[12px] border-t-gray-200 border-l-[12px] border-l-transparent" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Event details popup
function EventDetailsPopup({ event, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">{event.title}</h3>
          <Button variant="ghost" size="sm" onClick={onClose}>×</Button>
        </div>
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4" />
            <span>{event.time || '00:00'}</span>
          </div>
          {event.description && <p className="text-gray-600">{event.description}</p>}
          <div className="flex items-center space-x-2">
            <Tag className="h-4 w-4" />
            <span>{EVENT_TYPES[event.type]?.label || 'Event'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Draggable event chip
function DraggableEvent({ event }) {
  const [showDetails, setShowDetails] = useState(false);
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `event-${event.id}-${event.day?.getTime() ?? 'sidebar'}`,
    data: event,
  });

  return (
    <>
      <div
        ref={setNodeRef}
        {...listeners}
        {...attributes}
        onClick={() => setShowDetails(true)}
        className={`p-2 rounded cursor-pointer hover:opacity-90 transition-opacity text-nowrap overflow-hidden ${
          isDragging ? 'opacity-40' : ''
        }`}
      >
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 rounded-full bg-gray-400 shrink-0" />
          <span className="text-sm truncate">{event.title}</span>
          {event.time && <span className="text-xs text-gray-500 shrink-0">{event.time}</span>}
        </div>
      </div>
      {showDetails && (
        <EventDetailsPopup event={event} onClose={() => setShowDetails(false)} />
      )}
    </>
  );
}

// Droppable calendar day cell
function CalendarDay({ day, dayEvents }) {
  const { isOver, setNodeRef } = useDroppable({
    id: `day-${day.getTime()}`,
    data: { day },
  });
  const isToday = isSameDay(day, new Date());

  return (
    <div
      ref={setNodeRef}
      className={`flex flex-col justify-start items-start p-2 h-28 rounded overflow-y-auto transition-colors ${
        isOver ? 'bg-gray-100' : 'bg-gray-50'
      } ${isToday ? 'ring-2 ring-inset ring-blue-500' : ''}`}
    >
      <div className={`text-sm mb-2 ${isToday ? 'font-bold text-blue-600' : ''}`}>
        {day.getDate().toString().padStart(2, '0')}
      </div>
      <div className="w-full space-y-1">
        {dayEvents.map((event) => (
          <DraggableEvent key={`${event.id}-${day.getTime()}`} event={{ ...event, day }} />
        ))}
      </div>
    </div>
  );
}

// Main Component
export default function LearningCalendar({ user }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [activeEvent, setActiveEvent] = useState(null);
  const [daysWithEvents, setDaysWithEvents] = useState([]);
  const [sidebarEvents, setSidebarEvents] = useState([
    { id: 1, title: 'Math Final Exam',    type: 'EXAMS',       time: '10:00 AM', description: 'Chapter 1-5 coverage' },
    { id: 2, title: 'Physics Tutoring',   type: 'TUTORING',    time: '2:00 PM',  description: 'One-on-one session' },
    { id: 3, title: 'History Assignment', type: 'ASSIGNMENTS', time: '11:59 PM', description: 'Essay submission deadline' },
  ]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const startDate = startOfWeek(currentDate, { weekStartsOn: 0 });
  const endDate   = endOfWeek(addDays(currentDate, 34), { weekStartsOn: 0 });
  const days      = eachDayOfInterval({ start: startDate, end: endDate });

  const handleDragStart = (event) => {
    setActiveEvent(event.active.data.current);
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    setActiveEvent(null);

    if (!over) return;

    const draggedEvent = active.data.current;
    const targetDay   = over.data.current?.day;
    if (!targetDay) return;

    // Prevent dropping on the same day
    if (draggedEvent.day && draggedEvent.day.getTime() === targetDay.getTime()) {
      toast.error('Event is already on this day.');
      return;
    }

    setDaysWithEvents((prev) => {
      const updated = [...prev];

      // Remove from source day if it came from the calendar
      if (draggedEvent.day) {
        const srcIdx = updated.findIndex((d) => d.date.getTime() === draggedEvent.day.getTime());
        if (srcIdx !== -1) {
          updated[srcIdx] = {
            ...updated[srcIdx],
            events: updated[srcIdx].events.filter((e) => e.id !== draggedEvent.id),
          };
        }
      } else {
        // Remove from sidebar events
        setSidebarEvents((s) => s.filter((e) => e.id !== draggedEvent.id));
      }

      // Add to target day
      const tgtIdx = updated.findIndex((d) => d.date.getTime() === targetDay.getTime());
      const newEntry = { ...draggedEvent, day: targetDay };
      if (tgtIdx !== -1) {
        updated[tgtIdx] = { ...updated[tgtIdx], events: [...updated[tgtIdx].events, newEntry] };
      } else {
        updated.push({ date: targetDay, events: [newEntry] });
      }

      return updated;
    });

    // Persist to API
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('access-token') : null;
      if (token) {
        await axios.post('/task_events', { daysWithEvents }, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success('Calendar updated.');
      }
    } catch {}
  };

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="flex flex-col bg-gray-100 rounded-lg">
        <div className="flex flex-1 overflow-hidden bg-white rounded-lg">
          <CalendarSidebar />
          <div className="p-4 flex-1">
            <div className="grid grid-cols-7 gap-px bg-gray-200 border">
              {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map((d) => (
                <div key={d} className="bg-white text-center text-sm p-2">{d}</div>
              ))}
              {days.map((day) => {
                const dayEvents =
                  daysWithEvents.find((d) => d.date.getTime() === day.getTime())?.events || [];
                return (
                  <CalendarDay key={day.getTime()} day={day} dayEvents={dayEvents} />
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <DragOverlay>
        {activeEvent ? (
          <div className="p-2 bg-white border border-blue-400 rounded shadow-lg text-sm opacity-90">
            {activeEvent.title}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
