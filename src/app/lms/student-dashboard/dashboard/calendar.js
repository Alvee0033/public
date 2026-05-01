"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import axios from "@/lib/axios";
import { cn } from "@/lib/utils";
import {
  addDays,
  addMonths,
  addWeeks,
  addYears,
  endOfWeek,
  format,
  startOfWeek,
  subDays,
  subMonths,
  subWeeks,
  subYears,
} from "date-fns";
import { CalendarIcon, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useAppSelector } from "@/redux/hooks";

import { DayView } from "@/components/schedule/day-view";
import { MonthView } from "@/components/schedule/month-view";
import TaskCard from "@/components/schedule/task-card";
import { WeekView } from "@/components/schedule/week-view";
import { YearView } from "@/components/schedule/year-view";
import useSWR from "swr";

function Calendar() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [activeView, setActiveView] = useState("year");
  const [activeTab, setActiveTab] = useState("tutoring");
  const [draggingTask, setDraggingTask] = useState(null);

  const fetcher = async (url) => {
    try {
      const res = await axios.get(url);
      return res?.data?.data || {};
    } catch (error) {
      console.error("Error fetching data:", error);
      return {};
    }
  };

  // Get user data from Redux state
  const user = useAppSelector((state) => state.auth.user);
  const studentId = user?.student_id || null;

  const {
    data: tutoringSessions,
    error: tutoringSessionsError,
    mutate: refetch,
  } = useSWR(
    `/student-tutoring-sessions?pagination=true&filter=${JSON.stringify({
      student: parseInt(studentId),
    })}`,
    fetcher
  );
  const tutoringSessionsLoading =
    !tutoringSessions && !tutoringSessionsError && !!studentId;

  const {
    data: assignments,
    error: assignmentsError,
    mutate: assignmentsRefetch,
  } = useSWR(
    `/student-course-assignments?pagination=true&filter=${JSON.stringify({
      student: parseInt(studentId),
    })}`,
    fetcher
  );
  const assignmentsLoading = !assignments && !assignmentsError && !!studentId;

  const {
    data: exams,
    error: examsError,
    mutate: examsRefetch,
  } = useSWR(
    `/student-exams?pagination=true&filter=${JSON.stringify({
      student: parseInt(studentId),
    })}`,
    fetcher
  );
  const examsLoading = !exams && !examsError && !!studentId;

  // Add a new SWR hook for lessons
  const {
    data: lessons,
    error: lessonsError,
    mutate: lessonsRefetch,
  } = useSWR(
    `/student-lessons?pagination=true&filter=${JSON.stringify({
      student: parseInt(studentId),
    })}`,
    fetcher
  );
  const lessonsLoading = !lessons && !lessonsError && !!studentId;

  const [scheduledTasks, setScheduledTasks] = useState([]);

  // Update scheduledTasks when tutoringSessions changes
  useEffect(() => {
    try {
      if (tutoringSessions || assignments || exams || lessons) {
        // Combine all different types of tasks with proper type identification
        const allTasks = [
          ...(Array.isArray(tutoringSessions)
            ? tutoringSessions.map((task) => ({ ...task, type: "tutoring" }))
            : []),
          ...(Array.isArray(assignments)
            ? assignments.map((task) => ({ ...task, type: "assignment" }))
            : []),
          ...(Array.isArray(exams)
            ? exams.map((task) => ({ ...task, type: "exam" }))
            : []),
          ...(Array.isArray(lessons)
            ? lessons.map((task) => ({ ...task, type: "lesson" }))
            : []),
        ];

        setScheduledTasks(allTasks);
      }
    } catch (error) {
      console.error("Error processing calendar data:", error);
      setScheduledTasks([]);
    }
  }, [tutoringSessions, assignments, exams, lessons]);
  const handlePrevious = () => {
    switch (activeView) {
      case "day":
        setSelectedDate(subDays(selectedDate, 1));
        break;
      case "week":
        setSelectedDate(subWeeks(selectedDate, 1));
        break;
      case "month":
        setSelectedDate(subMonths(selectedDate, 1));
        break;
      case "year":
        setSelectedDate(subYears(selectedDate, 1));
        break;
    }
  };

  const handleNext = () => {
    switch (activeView) {
      case "day":
        setSelectedDate(addDays(selectedDate, 1));
        break;
      case "week":
        setSelectedDate(addWeeks(selectedDate, 1));
        break;
      case "month":
        setSelectedDate(addMonths(selectedDate, 1));
        break;
      case "year":
        setSelectedDate(addYears(selectedDate, 1));
        break;
    }
  };

  const handleDragStart = (task) => {
    setDraggingTask(task);
  };

  const handleDrop = async (timeSlot, date = selectedDate) => {
    if (!draggingTask) return;
    if (!timeSlot || typeof timeSlot !== "string" || !timeSlot.includes(":")) {
      console.error("Invalid timeSlot:", timeSlot);
      return;
    }

    // Calculate end time based on duration
    const [hours, minutes] = timeSlot.split(":").map(Number);
    const startDate = new Date(date);
    startDate.setHours(hours, minutes, 0);

    const endDate = new Date(startDate);
    endDate.setMinutes(
      endDate.getMinutes() + draggingTask.estimated_time_in_hours || 0
    );

    const endHours = endDate.getHours().toString().padStart(2, "0");
    const endMinutes = endDate.getMinutes().toString().padStart(2, "0");
    // Calculate start and end date-time
    const start_date_time = new Date();
    const end_date_time = new Date(start_date_time);
    end_date_time.setHours(end_date_time.getHours() + 1);
    end_date_time.setMinutes(end_date_time.getMinutes() + 30);

    const newTask = {
      id: draggingTask?.id,
      title: draggingTask?.name,
      startTime: start_date_time,
      endTime: end_date_time,
      date: format(date, "yyyy-MM-dd"),
    };
    setScheduledTasks([...scheduledTasks, newTask]);
    const taskId = draggingTask?.id || null;
    try {
      // Call API to update the task
      await axios.patch(`/task-events/${taskId}`, {
        start_date_time,
        end_date_time,
      });
    } catch (error) {
      console.error("Failed to update task:", error);
    }

    setDraggingTask(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const getHeaderText = () => {
    switch (activeView) {
      case "day":
        return format(selectedDate, "EEEE, MMMM d, yyyy");
      case "week": {
        const start = startOfWeek(selectedDate, { weekStartsOn: 1 });
        const end = endOfWeek(selectedDate, { weekStartsOn: 1 });
        return `${format(start, "MMMM d")} - ${format(end, "MMMM d, yyyy")}`;
      }
      case "month":
        return format(selectedDate, "MMMM yyyy");
      case "year":
        return format(selectedDate, "yyyy");
      default:
        return format(selectedDate, "EEEE, MMMM d, yyyy");
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 border border-gray-200">
      {/* Header */}
      <header className="flex items-center justify-between p-3 bg-white border-b shadow-sm">
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrevious}
            className="p-1.5 rounded-md hover:bg-gray-100 transition-colors"
            aria-label="Previous"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={() => setSelectedDate(new Date())}
            className="p-1.5 rounded-md hover:bg-gray-100 transition-colors"
            aria-label="Today"
          >
            <CalendarIcon className="h-5 w-5" />
          </button>
          <button
            onClick={handleNext}
            className="p-1.5 rounded-md hover:bg-gray-100 transition-colors"
            aria-label="Next"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
          <h1 className="text-lg font-medium ml-2">{getHeaderText()}</h1>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w- bg-white border-r overflow-hidden flex flex-col">
          <Tabs
            defaultValue="tutoring"
            value={activeTab}
            onValueChange={setActiveTab}
            className="flex-1 flex flex-col"
          >
            <TabsList className="w-full justify-start px-4 pt-2 h-12 bg-white border-b">
              <TabsTrigger
                value="tutoring"
                className="data-[state=active]:bg-gray-100"
              >
                Tutoring
              </TabsTrigger>
              <TabsTrigger
                value="lessons"
                className="data-[state=active]:bg-gray-100"
              >
                Lessons
              </TabsTrigger>
              <TabsTrigger
                value="assignments"
                className="data-[state=active]:bg-gray-100"
              >
                Assignments
              </TabsTrigger>
              <TabsTrigger
                value="exams"
                className="data-[state=active]:bg-gray-100"
              >
                Exams
              </TabsTrigger>
            </TabsList>

            <TabsContent
              value="tutoring"
              className="flex-1 overflow-y-auto p-0 m-0"
            >
              <div className="p-4 max-h-[calc(100vh-200px)] overflow-y-scroll">
                {tutoringSessionsLoading ? (
                  <div className="text-center text-gray-500">
                    <Loader2 className="animate-spin h-5 w-5 inline-block" />
                  </div>
                ) : Array.isArray(tutoringSessions) &&
                  tutoringSessions.length > 0 ? (
                  <div className="space-y-3">
                    {tutoringSessions.map((tutoring) => (
                      <TaskCard
                        key={tutoring.id}
                        task={tutoring}
                        onDragStart={() => handleDragStart(tutoring)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-gray-500">
                    No tasks available.
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent
              value="lessons"
              className="flex-1 overflow-y-auto p-0 m-0"
            >
              <div className="p-4 max-h-[calc(100vh-200px)] overflow-y-scroll">
                {lessonsLoading ? (
                  <div className="text-center text-gray-500">
                    <Loader2 className="animate-spin h-5 w-5 inline-block" />
                  </div>
                ) : Array.isArray(lessons) && lessons.length > 0 ? (
                  <div className="space-y-3">
                    {lessons.map((lesson) => (
                      <TaskCard
                        key={lesson.id}
                        task={lesson}
                        onDragStart={() => handleDragStart(lesson)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-gray-500">
                    No lessons available.
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent
              value="assignments"
              className="flex-1 overflow-y-auto p-0 m-0"
            >
              <div className="p-4 max-h-[calc(100vh-200px)] overflow-y-scroll">
                {assignmentsLoading ? (
                  <div className="text-center text-gray-500">
                    <Loader2 className="animate-spin h-5 w-5 inline-block" />
                  </div>
                ) : Array.isArray(assignments) && assignments.length > 0 ? (
                  <div className="space-y-3">
                    {assignments.map((assignment) => (
                      <TaskCard
                        key={assignment.id}
                        task={assignment}
                        onDragStart={() => handleDragStart(assignment)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-gray-500">
                    No assignments available.
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent
              value="exams"
              className="flex-1 overflow-y-auto p-0 m-0"
            >
              <div className="p-4 max-h-[calc(100vh-200px)] overflow-y-scroll">
                {examsLoading ? (
                  <div className="text-center text-gray-500">
                    <Loader2 className="animate-spin h-5 w-5 inline-block" />
                  </div>
                ) : Array.isArray(exams) && exams.length > 0 ? (
                  <div className="space-y-3">
                    {exams.map((exam) => (
                      <TaskCard
                        key={exam.id}
                        task={exam}
                        onDragStart={() => handleDragStart(exam)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-gray-500">
                    No exams available.
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Calendar Area */}
        <div className="flex-1 flex flex-col bg-white">
          <Tabs
            value={activeView}
            onValueChange={setActiveView}
            className="flex-1 flex flex-col"
          >
            <div className="border-b bg-gray-50">
              <TabsList className="h-10 w-full justify-start px-4 bg-transparent">
                <TabsTrigger
                  value="day"
                  className={cn(
                    "data-[state=active]:bg-white data-[state=active]:shadow-none rounded-none border-b-2 border-transparent data-[state=active]:border-gray-900"
                  )}
                >
                  Day
                </TabsTrigger>
                <TabsTrigger
                  value="week"
                  className={cn(
                    "data-[state=active]:bg-white data-[state=active]:shadow-none rounded-none border-b-2 border-transparent data-[state=active]:border-gray-900"
                  )}
                >
                  Week
                </TabsTrigger>
                <TabsTrigger
                  value="month"
                  className={cn(
                    "data-[state=active]:bg-white data-[state=active]:shadow-none rounded-none border-b-2 border-transparent data-[state=active]:border-gray-900"
                  )}
                >
                  Month
                </TabsTrigger>
                <TabsTrigger
                  value="year"
                  className={cn(
                    "data-[state=active]:bg-white data-[state=active]:shadow-none rounded-none border-b-2 border-transparent data-[state=active]:border-gray-900"
                  )}
                >
                  Year
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="flex-1 overflow-hidden">
              <TabsContent value="day" className="h-full m-0 p-0">
                <DayView
                  selectedDate={selectedDate}
                  scheduledTasks={scheduledTasks}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                />
              </TabsContent>

              <TabsContent value="week" className="h-full m-0 p-0">
                <WeekView
                  selectedDate={selectedDate}
                  scheduledTasks={scheduledTasks}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                />
              </TabsContent>

              <TabsContent value="month" className="h-full m-0 p-0">
                <MonthView
                  selectedDate={selectedDate}
                  scheduledTasks={scheduledTasks}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onSelectDate={(date) => {
                    setSelectedDate(date);
                    setActiveView("day");
                  }}
                />
              </TabsContent>

              <TabsContent value="year" className="h-full m-0 p-0">
                <YearView
                  selectedDate={selectedDate}
                  scheduledTasks={scheduledTasks}
                  onSelectMonth={(date) => {
                    setSelectedDate(date);
                    setActiveView("month");
                  }}
                />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

// Export as default instead of named export
export default Calendar;
