'use client';
import { avatarPlaceHolder } from '@/assets/images';
import { Button } from '@/components/ui/button';
import axios from '@/lib/axios';
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
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { toast } from 'sonner';
// Define Drag-and-Drop types
const DRAG_TYPE = 'EVENT';

// Add new event types and their colors
const EVENT_TYPES = {
  TUTORING: {
    label: 'Tutoring',
    color: 'bg-[#00B7EB]',
    textColor: 'text-white',
  }, // Bright blue
  LESSONS: { label: 'Lessons', color: 'bg-[#9932CC]', textColor: 'text-white' }, // Purple
  ASSIGNMENTS: {
    label: 'Assignments',
    color: 'bg-[#FFA07A]',
    textColor: 'text-white',
  }, // Salmon
  EXAMS: { label: 'Exams', color: 'bg-[#4169E1]', textColor: 'text-white' }, // Royal blue
  QUIZ: { label: 'Quiz', color: 'bg-[#6B8E23]', textColor: 'text-white' }, // Olive green
};

const TIME_SLOTS = [
  '6 am - 7 am',
  '7 am - 8 am',
  '8 am - 9 am',
  '9 am - 10 am',
  '10 am - 11 am',
  '11 am - 12 pm',
  '1 pm - 2 pm',
  '2 pm - 3 pm',
  '3 pm - 4 pm',
  '4 pm - 5 pm',
  '5 pm - 6 pm',
];

// Sidebar for displaying events
function CalendarSidebar() {
  const [activeTab, setActiveTab] = useState('tutoring');

  const sidebarData = {
    tutoring: [
      {
        id: 1,
        title: 'Math Lesson - Name of The Lesson',
        date: 'Jan 23, 2021, 3:30 PM',
        avatar: avatarPlaceHolder,
      },
      {
        id: 2,
        title: 'Physics Tutoring Session',
        date: 'Jan 23, 2021, 3:30 PM',
        avatar: avatarPlaceHolder,
      },
      {
        id: 3,
        title: 'Chemistry Lab Review',
        date: 'Jan 23, 2021, 3:30 PM',
        avatar: avatarPlaceHolder,
      },
    ],
    lessons: [
      {
        id: 1,
        title: 'Advanced Mathematics',
        date: 'Jan 23, 2021, 3:30 PM',
        avatar: avatarPlaceHolder,
      },
      {
        id: 2,
        title: 'Biology Fundamentals',
        date: 'Jan 23, 2021, 3:30 PM',
        avatar: avatarPlaceHolder,
      },
    ],
    assignments: [
      {
        id: 1,
        title: 'Math Problem Set #5',
        date: 'Jan 23, 2021, 3:30 PM',
      },
      {
        id: 2,
        title: 'Physics Lab Report',
        date: 'Jan 23, 2021, 3:30 PM',
      },
      {
        id: 3,
        title: 'Literature Essay',
        date: 'Jan 23, 2021, 3:30 PM',
      },
    ],
    exams: [
      {
        id: 1,
        title: 'Final Math Exam',
        date: 'Jan 23, 2021, 3:30 PM',
      },
      {
        id: 2,
        title: 'Chemistry Midterm',
        date: 'Jan 23, 2021, 3:30 PM',
      },
    ],
  };

  const tabStyles = {
    tutoring: 'bg-[#00B7EB]',
    lessons: 'bg-[#9932CC]',
    assignments: 'bg-[#FFA07A]',
    exams: 'bg-[#4169E1]',
  };

  return (
    <div className="w-80 bg-white shadow-sm rounded-lg overflow-hidden">
      {/* Event Type Tabs */}
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

      {/* Event Cards */}
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
                <Image
                  src={event.avatar}
                  alt=""
                  className="w-8 h-8 rounded-full"
                  width={32}
                  height={32}
                />
              )}
            </div>
            {/* Triangle indicator */}
            <div className="absolute right-0 top-0 p-1">
              <div className="w-0 h-0 border-t-[12px] border-t-gray-200 border-l-[12px] border-l-transparent" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Draggable sidebar events
function SidebarEvent({ event }) {
  const [{ isDragging }, drag] = useDrag({
    type: DRAG_TYPE,
    item: { ...event, source: 'sidebar' },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <div
      ref={drag}
      className={`flex items-center space-x-2 bg-${event.color}-50 px-3 py-2 rounded-md cursor-pointer`}
    >
      <div className={`w-1 h-5 bg-${event.color}-400 rounded-full`} />
      <span>{event.title}</span>
    </div>
  );
}

// Add EventDetailsPopup component
function EventDetailsPopup({ event, onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">{event.title}</h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            ×
          </Button>
        </div>
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4" />
            <span>{event.time || '00:00'}</span>
          </div>
          {event.description && (
            <p className="text-gray-600">{event.description}</p>
          )}
          <div className="flex items-center space-x-2">
            <Tag className="h-4 w-4" />
            <span>{EVENT_TYPES[event.type]?.label || 'Event'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Draggable event component
function DraggableEvent({ event }) {
  const [showDetails, setShowDetails] = useState(false);
  const [{ isDragging }, drag] = useDrag({
    type: DRAG_TYPE,
    item: event,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <>
      <div
        ref={drag}
        onClick={() => setShowDetails(true)}
        className={`
          p-2 bg-${event.color}-50 
          text-nowrap overflow-hidden rounded 
          cursor-pointer hover:bg-${event.color}-100 
          transition-colors ${isDragging ? 'opacity-50' : ''}
        `}
      >
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full bg-${event.color}-400`} />
          <span className="text-sm">{event.title}</span>
          {event.time && (
            <span className="text-xs text-gray-500">{event.time}</span>
          )}
        </div>
      </div>
      {showDetails && (
        <EventDetailsPopup
          event={event}
          onClose={() => setShowDetails(false)}
        />
      )}
    </>
  );
}

// Droppable calendar day component
function CalendarDay({ day, dayEvents, handleDropEvent }) {
  const [{ isOver }, drop] = useDrop({
    accept: DRAG_TYPE,
    drop: (item) => handleDropEvent(item, day),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  const isToday = isSameDay(day, new Date());

  return (
    <div
      ref={drop}
      className={`
        flex flex-col justify-start items-start 
        p-2 h-28 ${isOver ? 'bg-gray-100' : 'bg-gray-50'} 
        rounded overflow-y-auto
        ${isToday ? 'ring-2 ring-primary ring-inset' : ''}
      `}
    >
      <div
        className={`
        text-sm mb-2 
        ${isToday ? 'font-bold text-primary' : ''}
      `}
      >
        {day.getDate().toString().padStart(2, '0')}
      </div>
      <div className="w-full space-y-1">
        {dayEvents.map((event) => (
          <DraggableEvent key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
}

// Main Component
export default function LearningCalendar({ user }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState([
    {
      id: 1,
      title: 'Math Final Exam',
      type: 'EXAM',
      color: EVENT_TYPES.EXAMS.color,
      time: '10:00 AM',
      description: 'Chapter 1-5 coverage',
      tutorAvatar: avatarPlaceHolder,
    },
    {
      id: 2,
      title: 'Physics Tutoring',
      type: 'TUTORING',
      color: EVENT_TYPES.TUTORING.color,
      time: '2:00 PM',
      description: 'One-on-one session',
      tutorAvatar: avatarPlaceHolder,
    },
    {
      id: 3,
      title: 'History Assignment',
      type: 'ASSIGNMENT',
      color: EVENT_TYPES.ASSIGNMENTS.color,
      time: '11:59 PM',
      description: 'Essay submission deadline',
      tutorAvatar: avatarPlaceHolder,
    },
  ]);
  const [daysWithEvents, setDaysWithEvents] = useState([]);

  const startDate = startOfWeek(currentDate, { weekStartsOn: 0 });
  const endDate = endOfWeek(addDays(currentDate, 34), { weekStartsOn: 0 });
  const days = eachDayOfInterval({ start: startDate, end: endDate });

  const handleDropEvent = async (item, day) => {
    const updatedDaysWithEvents = [...daysWithEvents];

    if (item.source === 'calendar' && item.day.getTime() === day.getTime()) {
      toast.error('Event is already assigned to this day.');
      return;
    }

    // Remove from source day
    if (item.source === 'calendar') {
      const sourceDayIndex = updatedDaysWithEvents.findIndex(
        (d) => d.date.getTime() === item.day.getTime()
      );
      if (sourceDayIndex !== -1) {
        updatedDaysWithEvents[sourceDayIndex].events = updatedDaysWithEvents[
          sourceDayIndex
        ].events.filter((e) => e.id !== item.id);
      }
    }

    // Add to target day
    const targetDayIndex = updatedDaysWithEvents.findIndex(
      (d) => d.date.getTime() === day.getTime()
    );
    if (targetDayIndex !== -1) {
      updatedDaysWithEvents[targetDayIndex].events.push({
        ...item,
        source: 'calendar',
        day,
      });
    } else {
      updatedDaysWithEvents.push({
        date: day,
        events: [{ ...item, source: 'calendar', day }],
      });
    }

    setDaysWithEvents(updatedDaysWithEvents);

    // Remove from sidebar if moved from there
    if (item.source === 'sidebar') {
      setEvents((prev) => prev.filter((e) => e.id !== item.id));
    }
    // Get the token manually from cookies
    const getCookie = (cookieName) => {
      const cookies = document.cookie.split('; ');
      for (let cookie of cookies) {
        const [name, value] = cookie.split('=');
        if (name === cookieName) return value;
      }
      return null;
    };

    const token = localStorage.getItem('access-token'); // Replace 'yourTokenName' with your actual cookie name

    if (!token) {
      toast.error('Authorization token is missing.');
      return;
    }

    // API call to save the updated days with events
    try {
      const response = await axios.post(
        '/task_events', // Replace with your actual API endpoint
        { daysWithEvents: updatedDaysWithEvents },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the headers
          },
        }
      );
      toast.success('Events updated successfully!');
    } catch (error) {}
  };

  const goToPreviousMonth = () => {
    setCurrentDate((prevDate) => subMonths(prevDate, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate((prevDate) => addMonths(prevDate, 1));
  };

  const handleRemoveEventFromSidebar = (item) => {
    setEvents((prev) => prev.filter((event) => event.id !== item.id));
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex flex-col bg-gray-100 rounded-lg">
        <div className="flex flex-1 overflow-hidden bg-white rounded-lg">
          <CalendarSidebar />
          <div className="p-4 flex-1">
            <div className="grid grid-cols-7 gap-px bg-gray-200 border">
              {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map((day) => (
                <div key={day} className="bg-white text-center text-sm p-2">
                  {day}
                </div>
              ))}
              {days.map((day) => {
                const dayEvents =
                  daysWithEvents.find((d) => d.date.getTime() === day.getTime())
                    ?.events || [];
                return (
                  <CalendarDay
                    key={day}
                    day={day}
                    dayEvents={dayEvents}
                    handleDropEvent={handleDropEvent}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </DndProvider>
  );
}

function CalendarEvent({ event }) {
  return (
    <div
      className={`${event.type.color} ${event.type.textColor} p-2 rounded-md flex items-center gap-2`}
    >
      {event.tutor && (
        <Image
          src={event.tutor.avatar}
          alt={event.tutor.name}
          className="w-6 h-6 rounded-full"
          width={24}
          height={24}
        />
      )}
      <span className="text-sm">{event.title}</span>
    </div>
  );
}

function CalendarHeader() {
  const tabs = [
    { label: 'Tutoring', color: 'bg-[#00B7EB] text-white' },
    { label: 'Lessons', color: 'bg-[#9932CC] text-white' },
    { label: 'Assignments', color: 'bg-[#FFA07A] text-white' },
    { label: 'Exams', color: 'bg-[#4169E1] text-white' },
  ];

  return (
    <div className="flex space-x-2">
      {tabs.map((tab, index) => (
        <button key={index} className={`px-4 py-1 rounded ${tab.color}`}>
          {tab.label}
        </button>
      ))}
    </div>
  );
}

function CalendarGrid() {
  const timeSlots = [
    '6 am - 7 am',
    '7 am - 8 am',
    '8 am - 9 am',
    '9 am - 10 am',
    '10 am - 11 am',
    '11 am - 12 pm',
    '1 pm - 2 pm',
    '2 pm - 3 pm',
    '3 pm - 4 pm',
    '4 pm - 5 pm',
    '5 pm - 6 pm',
  ];

  const days = [
    { date: 'Jan 15, 2015', day: 'Mon' },
    { date: 'Jan 15, 2015', day: 'Tues' },
    { date: 'Jan 15, 2015', day: 'Wed' },
    { date: 'Jan 15, 2015', day: 'Thur' },
    { date: 'Jan 15, 2015', day: 'Fri' },
    { date: 'Jan 15, 2015', day: 'Sat' },
    { date: 'Jan 15, 2015', day: 'Sun' },
  ];

  const events = [
    {
      time: '7 am - 8 am',
      day: 'Sat',
      type: 'quiz',
      title: 'Quiz',
      color: 'bg-[#6B8E23]',
    },
    { time: '8 am - 9 am', day: 'Mon', type: 'lesson', color: 'bg-[#9932CC]' },
    {
      time: '9 am - 10 am',
      day: 'Fri',
      type: 'tutoring',
      color: 'bg-[#00B7EB]',
    },
    {
      time: '10 am - 11 am',
      day: 'Mon',
      type: 'tutoring',
      avatar: '/avatar1.jpg',
      color: 'bg-[#00B7EB]',
    },
    {
      time: '10 am - 11 am',
      day: 'Tues',
      type: 'tutoring',
      avatar: '/avatar2.jpg',
      color: 'bg-[#00B7EB]',
    },
    {
      time: '10 am - 11 am',
      day: 'Wed',
      type: 'tutoring',
      avatar: '/avatar3.jpg',
      color: 'bg-[#00B7EB]',
    },
    {
      time: '10 am - 11 am',
      day: 'Wed',
      type: 'assignment',
      title: 'Assignments',
      color: 'bg-[#FFA07A]',
    },
    {
      time: '10 am - 11 am',
      day: 'Fri',
      type: 'tutoring',
      avatar: '/avatar4.jpg',
      color: 'bg-[#00B7EB]',
    },
    {
      time: '10 am - 11 am',
      day: 'Sat',
      type: 'tutoring',
      avatar: '/avatar5.jpg',
      color: 'bg-[#00B7EB]',
    },
    {
      time: '10 am - 11 am',
      day: 'Sun',
      type: 'exam',
      title: 'Exam 1',
      color: 'bg-[#4169E1]',
    },
    {
      time: '1 pm - 2 pm',
      day: 'Mon',
      type: 'assignment',
      title: 'Assignments',
      color: 'bg-[#FFA07A]',
    },
    {
      time: '1 pm - 2 pm',
      day: 'Tues',
      type: 'assignment',
      title: 'Assignment 3',
      color: 'bg-[#00B7EB]',
    },
    {
      time: '1 pm - 2 pm',
      day: 'Sat',
      type: 'exam',
      title: 'Exam 1',
      color: 'bg-[#4169E1]',
    },
    {
      time: '1 pm - 2 pm',
      day: 'Sun',
      type: 'assignment',
      title: 'Assignments',
      color: 'bg-[#FFA07A]',
    },
    {
      time: '3 pm - 4 pm',
      day: 'Thu',
      type: 'exam',
      title: 'Exam 2',
      color: 'bg-[#4169E1]',
    },
    {
      time: '3 pm - 4 pm',
      day: 'Sun',
      type: 'tutoring',
      avatar: '/avatar6.jpg',
      color: 'bg-[#00B7EB]',
    },
  ];

  const getEventForTimeSlot = (time, day) => {
    return events.find((event) => event.time === time && event.day === day);
  };

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="border p-2 text-sm text-gray-600">Time/Day</th>
            {days.map((day, index) => (
              <th key={index} className="border p-2">
                <div className="text-sm text-gray-600">{day.date}</div>
                <div className="text-sm font-medium">{day.day}</div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {timeSlots.map((time) => (
            <tr key={time}>
              <td className="border p-2 text-sm text-gray-600">{time}</td>
              {days.map((day, index) => {
                const event = getEventForTimeSlot(time, day.day);
                return (
                  <td key={index} className="border p-2">
                    {event && (
                      <div className={`${event.color} text-white p-2 rounded`}>
                        {event.avatar ? (
                          <Image
                            src={event.avatar}
                            alt=""
                            className="w-8 h-8 rounded-full"
                            width={32}
                            height={32}
                          />
                        ) : (
                          event.title
                        )}
                      </div>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Sidebar Lesson Card Component
function LessonCard({ lesson }) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-3 cursor-pointer hover:shadow-md transition-shadow">
      <h3 className="text-gray-800">{lesson.title}</h3>
      <div className="flex items-center justify-between mt-2">
        <div className="flex items-center text-gray-500 text-sm">
          <CalendarIcon className="w-4 h-4 mr-2" />
          <span>{lesson.date}</span>
        </div>
        <Image
          src={lesson.tutorAvatar}
          alt=""
          className="w-8 h-8 rounded-full"
          width={32}
          height={32}
        />
      </div>
    </div>
  );
}

// Event Type Tabs
function EventTypeTabs() {
  return (
    <div className="flex space-x-1">
      <button className="px-4 py-2 bg-[#00B7EB] text-white rounded">
        Tutoring
      </button>
      <button className="px-4 py-2 bg-[#9932CC] text-white rounded">
        Lessons
      </button>
      <button className="px-4 py-2 bg-[#FFA07A] text-white rounded">
        Assignments
      </button>
      <button className="px-4 py-2 bg-[#4169E1] text-white rounded">
        Exams
      </button>
    </div>
  );
}

// Calendar Grid Cell Component
function CalendarCell(props) {
  return (
    <div className="border border-gray-100 h-16 relative">
      <span className="text-sm text-gray-500">{props.time || ''}</span>
    </div>
  );
}
