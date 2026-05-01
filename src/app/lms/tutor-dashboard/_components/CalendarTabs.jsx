"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { DayView } from "../_components/schedule/day-view";
import { MonthView } from "../_components/schedule/month-view";
import { WeekView } from "../_components/schedule/week-view";
import { YearView } from "../_components/schedule/year-view";

export default function CalendarTabs({
  activeView,
  setActiveView,
  selectedDate,
  setSelectedDate,
  scheduledTasks,
  handleDragOver,
  handleDrop
}) {
  return (
    <Tabs value={activeView} onValueChange={setActiveView} className="flex-1 flex flex-col min-w-0">
      <div className="bg-white border-r overflow-hidden flex flex-col">
        <TabsList className="h-10 w-full justify-start px-2 sm:px-4 bg-transparent overflow-x-auto whitespace-nowrap scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
          <TabsTrigger value="day" className={cn("data-[state=active]:bg-white data-[state=active]:shadow-none rounded-none border-b-2 border-transparent data-[state=active]:border-gray-900 text-xs sm:text-base px-2 sm:px-4")}>Day</TabsTrigger>
          <TabsTrigger value="week" className={cn("data-[state=active]:bg-white data-[state=active]:shadow-none rounded-none border-b-2 border-transparent data-[state=active]:border-gray-900 text-xs sm:text-base px-2 sm:px-4")}>Week</TabsTrigger>
          <TabsTrigger value="month" className={cn("data-[state=active]:bg-white data-[state=active]:shadow-none rounded-none border-b-2 border-transparent data-[state=active]:border-gray-900 text-xs sm:text-base px-2 sm:px-4")}>Month</TabsTrigger>
          <TabsTrigger value="year" className={cn("data-[state=active]:bg-white data-[state=active]:shadow-none rounded-none border-b-2 border-transparent data-[state=active]:border-gray-900 text-xs sm:text-base px-2 sm:px-4")}>Year</TabsTrigger>
        </TabsList>
      </div>
      <div className="flex-1 overflow-x-auto overflow-y-hidden min-w-0">
        <TabsContent value="day" className="h-full m-0 p-0 min-w-[320px]">
          <DayView selectedDate={selectedDate} scheduledTasks={scheduledTasks} onDragOver={handleDragOver} onDrop={handleDrop} />
        </TabsContent>
        <TabsContent value="week" className="h-full m-0 p-0 min-w-[320px]">
          <WeekView selectedDate={selectedDate} scheduledTasks={scheduledTasks} onDragOver={handleDragOver} onDrop={handleDrop} />
        </TabsContent>
        <TabsContent value="month" className="h-full m-0 p-0 min-w-[320px]">
          <MonthView selectedDate={selectedDate} scheduledTasks={scheduledTasks} onDragOver={handleDragOver} onDrop={handleDrop} onSelectDate={date => { setSelectedDate(date); setActiveView("day"); }} />
        </TabsContent>
        <TabsContent value="year" className="h-full m-0 p-0 min-w-[320px]">
          <YearView selectedDate={selectedDate} scheduledTasks={scheduledTasks} onSelectMonth={date => { setSelectedDate(date); setActiveView("month"); }} />
        </TabsContent>
      </div>
    </Tabs>
  );
}
