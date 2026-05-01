"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { useMemo, useState, memo } from "react";
import { useCalendarEvents } from "../_hooks/useCalendarEvents";

const eventColors = {
  tutoring: "bg-blue-500 text-white",
  group: "bg-green-500 text-white",
  lesson: "bg-purple-500 text-white",
  scholarpass: "bg-teal-500 text-white",
  assessment: "bg-orange-500 text-white",
  exam: "bg-red-500 text-white",
};

// Subtle background styles for compact year-view day cells (lighter tones)
const eventCellBg = {
  tutoring: "bg-blue-100 text-blue-700",
  group: "bg-green-100 text-green-700",
  lesson: "bg-purple-100 text-purple-700",
  scholarpass: "bg-teal-100 text-teal-700",
  assessment: "bg-orange-100 text-orange-700",
  exam: "bg-red-100 text-red-700",
};

// Status-based styling for events
const eventStatusStyles = {
  pending: "opacity-80 border border-yellow-300",
  scheduled: "border-l-2 border-green-400",
  completed: "border-l-2 border-blue-400",
  closed: "opacity-80 border-l-2 border-gray-400",
};

export function CalendarView() {
  const { events, yearlyStats, loading } = useCalendarEvents();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewType, setViewType] = useState("month");
  const [selectedEvent, setSelectedEvent] = useState(null);

  const navigateDate = (direction) => {
    const newDate = new Date(currentDate);

    switch (viewType) {
      case "day":
        newDate.setDate(newDate.getDate() + (direction === "next" ? 1 : -1));
        break;
      case "week":
        newDate.setDate(newDate.getDate() + (direction === "next" ? 7 : -7));
        break;
      case "month":
        newDate.setMonth(newDate.getMonth() + (direction === "next" ? 1 : -1));
        break;
      case "year":
        newDate.setFullYear(
          newDate.getFullYear() + (direction === "next" ? 1 : -1)
        );
        break;
    }

    setCurrentDate(newDate);
  };

  const visibleEvents = useMemo(() => {
    if (!Array.isArray(events) || events.length === 0) return [];

    if (viewType === "month") {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();
      const startDate = new Date(year, month, 1);
      const endDate = new Date(year, month + 1, 0);

      return events.filter(
        (event) => event.date >= startDate && event.date <= endDate
      );
    } else if (viewType === "week") {
      const startOfWeek = new Date(currentDate);
      const dayOfWeek =
        currentDate.getDay() === 0 ? 6 : currentDate.getDay() - 1;
      startOfWeek.setDate(currentDate.getDate() - dayOfWeek);

      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);

      return events.filter(
        (event) => event.date >= startOfWeek && event.date <= endOfWeek
      );
    } else if (viewType === "day") {
      const dayStart = new Date(currentDate);
      dayStart.setHours(0, 0, 0, 0);

      const dayEnd = new Date(currentDate);
      dayEnd.setHours(23, 59, 59, 999);

      return events.filter(
        (event) => event.date >= dayStart && event.date <= dayEnd
      );
    }

    return events;
  }, [events, viewType, currentDate]);

  const getEventsForDate = (date) => {
    return visibleEvents.filter(
      (event) => event.date.toDateString() === date.toDateString()
    );
  };

  // Memoize getEventsForDate for better performance
  const getEventsForDateMemo = useMemo(() => {
    // Create a cache of date strings to events
    const cache = new Map();
    visibleEvents.forEach((event) => {
      const dateStr = event.date.toDateString();
      if (!cache.has(dateStr)) {
        cache.set(dateStr, []);
      }
      cache.get(dateStr).push(event);
    });
    return (date) => cache.get(date.toDateString()) || [];
  }, [visibleEvents]);

  const handleEventClick = (event) => {
    setSelectedEvent(event);
  };

  const renderMonthView = () => {
    // Same implementation but handle loading state
    if (loading) {
      return (
        <div className="flex justify-center items-center h-96 bg-white rounded-lg border">
          <div className="flex flex-col items-center">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-2" />
            <p className="text-gray-500">Loading calendar data...</p>
          </div>
        </div>
      );
    }

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    // Adjust so Monday is 0, Sunday is 6
    const startingDayOfWeek = (firstDay.getDay() + 6) % 7;

    const days = [];

    // Empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(
        <div
          key={`empty-${i}`}
          className="flex-1 min-h-[80px] border border-gray-100"
        ></div>
      );
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dayEvents = getEventsForDateMemo(date);
      const isToday = date.toDateString() === new Date().toDateString();

      days.push(
        <div
          key={day}
          className={`flex-1 min-h-[80px] border border-gray-100 p-1 overflow-hidden cursor-pointer flex flex-col ${
            isToday ? "bg-blue-50 border-blue-200" : "hover:bg-gray-50"
          }`}
          onClick={() => {
            setCurrentDate(date);
            setViewType("day");
          }}
          tabIndex={0}
          role="button"
          aria-label={`View ${date.toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric",
          })}`}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              setCurrentDate(date);
              setViewType("day");
            }
          }}
        >
          <div
            className={`text-sm font-medium mb-1 ${
              isToday ? "text-blue-600" : ""
            }`}
          >
            {day}
          </div>
          <div className="space-y-1 flex-1 overflow-hidden">
            {dayEvents.slice(0, 3).map((event) => (
              <div
                key={event.id}
                className={`text-xs px-1 py-0.5 rounded truncate ${
                  eventColors[event.type]
                } ${eventStatusStyles[event.status] || ""}`}
                title={`${event.title} - ${event.startTime} (${event.status})`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleEventClick(event);
                }}
              >
                <span className="font-medium">{event.startTime}</span>{" "}
                {event.title}
              </div>
            ))}
            {dayEvents.length > 3 && (
              <div className="text-xs text-gray-500 px-1">
                +{dayEvents.length - 3} more
              </div>
            )}
          </div>
        </div>
      );
    }

    return (
      <div className="bg-white rounded-lg border w-full h-full flex flex-col overflow-hidden min-h-[920px]">
        <div className="grid grid-cols-7 border-b">
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, idx) => {
            // Calculate the date for this weekday in the current week
            const today = new Date();
            const year = currentDate.getFullYear();
            const month = currentDate.getMonth();
            // Find the first day of the current month view
            const firstDay = new Date(year, month, 1);
            // Find the first Monday of the month view (could be in previous month)
            const firstMonday = new Date(firstDay);
            const offset = (firstDay.getDay() + 6) % 7; // Monday=0, Sunday=6
            firstMonday.setDate(firstDay.getDate() - offset);
            // The date for this weekday in the first week of the month view
            const headerDate = new Date(firstMonday);
            headerDate.setDate(firstMonday.getDate() + idx);

            return (
              <div
                key={day}
                className="p-3 text-center font-medium text-gray-700 border-r last:border-r-0 cursor-pointer hover:font-bold"
                onClick={() => {
                  setCurrentDate(headerDate);
                  setViewType("week");
                }}
                tabIndex={0}
                role="button"
                aria-label={`View ${headerDate.toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}`}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    setCurrentDate(headerDate);
                    setViewType("week");
                  }
                }}
              >
                {day}
              </div>
            );
          })}
        </div>
        <div className="grid grid-cols-7 flex-1 min-h-0">{days}</div>
      </div>
    );
  };

  // --- Week View Implementation ---
  const renderWeekView = () => {
    // Get start of week (Monday)
    const startOfWeek = new Date(currentDate);
    const dayOfWeek = currentDate.getDay() === 0 ? 6 : currentDate.getDay() - 1; // 0 (Sun) -> 6, 1 (Mon) -> 0, ..., 6 (Sat) -> 5
    startOfWeek.setDate(currentDate.getDate() - dayOfWeek);
    // Build array of 7 days
    const days = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      const dayEvents = getEventsForDateMemo(date);
      const isToday = date.toDateString() === new Date().toDateString();
      days.push(
        <div
          key={i}
          className="flex-1 border border-gray-100 bg-white rounded-lg flex flex-col min-w-0 cursor-pointer"
          onClick={() => {
            setCurrentDate(date);
            setViewType("day");
          }}
          tabIndex={0}
          role="button"
          aria-label={`View ${date.toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric",
          })}`}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              setCurrentDate(date);
              setViewType("day");
            }
          }}
        >
          <div
            className={`p-2 text-center font-medium border-b ${
              isToday ? "text-blue-600 bg-blue-50" : "text-gray-700"
            }`}
          >
            {date.toLocaleDateString("en-US", {
              weekday: "short",
              month: "short",
              day: "numeric",
            })}
          </div>
          <div className="flex-1 p-2 space-y-2 overflow-y-auto">
            {dayEvents.length === 0 && (
              <div className="text-xs text-gray-400 text-center">No events</div>
            )}
            {dayEvents.map((event) => (
              <div
                key={event.id}
                className={`text-xs px-2 py-1 rounded ${
                  eventColors[event.type]
                } ${eventStatusStyles[event.status] || ""}`}
                title={`${event.title} - ${event.startTime} (${event.status})`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleEventClick(event);
                }}
              >
                <div className="font-medium truncate">{event.title}</div>
                <div className="flex justify-between text-[10px]">
                  <span>{event.startTime}</span>
                  <span className="opacity-90 capitalize">{event.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return <div className="flex gap-2 w-full h-full min-h-[920px]">{days}</div>;
  };

  // --- Day View Implementation ---
  const renderDayView = () => {
    const date = currentDate;
    const dayEvents = getEventsForDateMemo(date);
    const isToday = date.toDateString() === new Date().toDateString();

    // Group events by hour (0-23)
    const eventsByHour = Array.from({ length: 24 }, (_, hour) => {
      // Try to parse event.startTime as "HH:mm" or "H:mm" or "HH:mm:ss"
      const eventsForHour = dayEvents.filter((event) => {
        if (!event.startTime) return false;
        const [h] = event.startTime.split(":");
        return parseInt(h, 10) === hour;
      });
      return eventsForHour;
    });

    return (
      <div className="bg-white rounded-lg border w-full h-full flex flex-col overflow-hidden min-h-[920px]">
        <div
          className={`p-4 text-center font-medium border-b text-lg ${
            isToday ? "text-blue-600 bg-blue-50" : "text-gray-700"
          }`}
        >
          {date.toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </div>
        <div className="flex-1 overflow-y-auto divide-y min-h-0">
          {Array.from({ length: 24 }, (_, hour) => (
            <div
              key={hour}
              className="flex items-start py-2 px-2 sm:px-4 min-h-[40px]"
            >
              <div className="w-12 sm:w-14 text-right pr-2 sm:pr-4 text-xs text-gray-500 shrink-0">
                {hour.toString().padStart(2, "0")}:00
              </div>
              <div className="flex-1 min-w-0">
                {eventsByHour[hour].length === 0 ? (
                  <span className="text-xs text-gray-300">No events</span>
                ) : (
                  eventsByHour[hour].map((event) => (
                    <div
                      key={event.id}
                      className={`mb-1 text-sm px-2 sm:px-3 py-2 rounded shadow ${
                        eventColors[event.type]
                      } ${eventStatusStyles[event.status] || ""}`}
                      title={`${event.title} - ${event.startTime} (${event.status})`}
                    >
                      <div className="font-semibold truncate">
                        {event.title}
                      </div>
                      <div className="text-xs flex justify-between">
                        <span>{event.startTime}</span>
                        <span className="opacity-90 capitalize">
                          {event.status}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderYearView = () => {
    const months = [];
    const year = currentDate.getFullYear();

    for (let month = 0; month < 12; month++) {
      const monthDate = new Date(year, month, 1);
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      const firstDayOfWeek = monthDate.getDay();

      const days = [];

      // Empty cells for days before month starts
      for (let i = 0; i < firstDayOfWeek; i++) {
        days.push(<div key={`empty-${i}`} className="h-6"></div>);
      }

      // Days of the month
      for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day);
        const dayEvents = getEventsForDateMemo(date);
        const isToday = date.toDateString() === new Date().toDateString();

        days.push(
          <div
            key={day}
            className={`h-6 text-xs flex items-center justify-center relative cursor-pointer hover:bg-gray-100 rounded ${
              isToday ? "bg-blue-100 text-blue-600 font-semibold" : ""
            } ${
              // apply subtle event background when not the highlighted 'today' cell
              !isToday && dayEvents.length > 0
                ? eventCellBg[dayEvents[0]?.type] || "bg-gray-100"
                : ""
            }`}
            onClick={(e) => {
              e.stopPropagation(); // Prevent month card click
              setCurrentDate(date);
              setViewType("day");
            }}
            tabIndex={0}
            role="button"
            aria-label={`View ${date.toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
              year: "numeric",
            })}`}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.stopPropagation();
                setCurrentDate(date);
                setViewType("day");
              }
            }}
          >
            {day}
          </div>
        );
      }

      months.push(
        <div
          key={month}
          className="bg-white rounded-lg border p-3 cursor-pointer group"
          onClick={() => {
            setCurrentDate(new Date(year, month, 1));
            setViewType("month");
          }}
          tabIndex={0}
          role="button"
          aria-label={`View ${monthDate.toLocaleDateString("en-US", {
            month: "long",
          })}`}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              setCurrentDate(new Date(year, month, 1));
              setViewType("month");
            }
          }}
        >
          <h4
            className="font-medium text-sm mb-2 text-center cursor-pointer group-hover:font-bold"
            // Remove onClick from here, handled by parent
          >
            {monthDate.toLocaleDateString("en-US", { month: "long" })}
          </h4>
          <div className="grid grid-cols-7 gap-1 text-xs text-gray-500 mb-1">
            {["S", "M", "T", "W", "T", "F", "S"].map((day) => (
              <div key={day} className="text-center font-medium">
                {day}
              </div>
            ))}
          </div>
          <div
            className="grid grid-cols-7 gap-1"
            // Prevent month card click when clicking on days grid
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
          >
            {days}
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {/* Yearly Stats */}
        <div className="bg-white rounded-lg border p-4">
          <h3 className="font-semibold mb-4">Yearly Stats</h3>
          <div className="grid grid-cols-6 gap-4 text-sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {yearlyStats.tutoring}
              </div>
              <div className="text-gray-600">Tutoring Sessions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {yearlyStats.group}
              </div>
              <div className="text-gray-600">Group Classes</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {yearlyStats.lessons}
              </div>
              <div className="text-gray-600">Lessons</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-teal-600">
                {yearlyStats.scholarpass}
              </div>
              <div className="text-gray-600">ScholarPASS Lab</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {yearlyStats.assessments}
              </div>
              <div className="text-gray-600">Assessments</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {yearlyStats.exams}
              </div>
              <div className="text-gray-600">Exams</div>
            </div>
          </div>
        </div>

        {/* Year Grid */}
        <div className="grid grid-cols-3 gap-4">{months}</div>
      </div>
    );
  };

  const getDateRangeText = () => {
    switch (viewType) {
      case "day":
        return currentDate.toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        });
      case "week":
        const startOfWeek = new Date(currentDate);
        startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        return `${startOfWeek.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        })} - ${endOfWeek.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })}`;
      case "month":
        return currentDate.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
        });
      case "year":
        return currentDate.getFullYear().toString();
      default:
        return "";
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-gray-50 h-[1084px] max-h-[1084px] min-h-[1084px]">
      {/* Calendar Header */}
      <div className="bg-white border-b p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateDate("prev")}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <h2 className="text-xl font-semibold">{getDateRangeText()}</h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateDate("next")}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex space-x-1">
            {["day", "week", "month", "year"].map((view) => (
              <Button
                key={view}
                variant={viewType === view ? "default" : "outline"}
                size="sm"
                onClick={() => setViewType(view)}
                className="capitalize"
              >
                {view}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Calendar Content */}
      <div className="flex-1 p-4 overflow-auto min-h-0">
        {loading && (
          <div className="flex justify-center items-center h-full">
            <div className="flex flex-col items-center">
              <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-3" />
              <p className="text-gray-500">Loading your calendar data...</p>
            </div>
          </div>
        )}

        {!loading && (
          <>
            {viewType === "year" && renderYearView()}
            {viewType === "month" && renderMonthView()}
            {viewType === "week" && renderWeekView()}
            {viewType === "day" && renderDayView()}
          </>
        )}
      </div>

      {/* Event Detail Modal */}
      {selectedEvent && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setSelectedEvent(null)}
        >
          <div
            className="bg-white rounded-lg shadow-lg max-w-md w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className={`p-4 rounded-t-lg ${eventColors[selectedEvent.type]}`}
            >
              <h3 className="text-lg font-bold">{selectedEvent.title}</h3>
              <div className="flex items-center justify-between">
                <p>{new Date(selectedEvent.date).toLocaleDateString()}</p>
                <p>{selectedEvent.startTime}</p>
              </div>
            </div>
            <div className="p-4">
              <div className="mb-3">
                <span
                  className={`px-2 py-1 rounded text-xs font-medium capitalize ${
                    selectedEvent.status === "pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : selectedEvent.status === "scheduled"
                      ? "bg-green-100 text-green-800"
                      : selectedEvent.status === "completed"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {selectedEvent.status}
                </span>
              </div>

              {selectedEvent.type === "tutoring" && (
                <div className="space-y-2">
                  <p>
                    <strong>Course:</strong>{" "}
                    {selectedEvent.originalData.course?.name || "N/A"}
                  </p>
                  <p>
                    <strong>Module:</strong>{" "}
                    {selectedEvent.originalData.course_module?.title || "N/A"}
                  </p>
                  <p>
                    <strong>Lesson:</strong>{" "}
                    {selectedEvent.originalData.course_lesson?.title || "N/A"}
                  </p>
                  {selectedEvent.originalData.google_meet_link && (
                    <p>
                      <strong>Meeting Link:</strong>{" "}
                      <a
                        href={selectedEvent.originalData.google_meet_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline"
                      >
                        Join Meeting
                      </a>
                    </p>
                  )}
                </div>
              )}

              {selectedEvent.type === "exam" && (
                <div className="space-y-2">
                  <p>
                    <strong>Exam Type:</strong>{" "}
                    {selectedEvent.originalData.exam_type || "N/A"}
                  </p>
                  <p>
                    <strong>Duration:</strong>{" "}
                    {selectedEvent.originalData.exam_duration || "N/A"} minutes
                  </p>
                </div>
              )}

              <div className="mt-4 flex justify-end">
                <button
                  className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 text-sm"
                  onClick={() => setSelectedEvent(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Wrap with memo to prevent unnecessary re-renders
export default memo(CalendarView);
