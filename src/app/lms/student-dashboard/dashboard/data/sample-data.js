export const sampleEvents = [
  {
    id: "1",
    title: "Math Algebra Session",
    type: "tutoring",
    date: new Date(2025, 0, 15, 10, 0),
    startTime: "10:00",
    endTime: "11:00",
    duration: 60,
    status: "scheduled",
    tutor: "Dr. Sarah Johnson",
    subject: "Mathematics",
    description: "Advanced algebra concepts and problem solving",
    location: "Virtual Room A",
  },
  {
    id: "2",
    title: "Physics Mechanics",
    type: "tutoring",
    date: new Date(2025, 0, 16, 14, 0),
    startTime: "14:00",
    endTime: "15:30",
    duration: 90,
    status: "scheduled",
    tutor: "Prof. Michael Chen",
    subject: "Physics",
    description: "Newton's laws and motion dynamics",
    location: "Virtual Room B",
  },
  {
    id: "3",
    title: "SAT Prep Workshop",
    type: "group",
    date: new Date(2025, 0, 17, 16, 0),
    startTime: "16:00",
    endTime: "18:00",
    duration: 120,
    status: "scheduled",
    tutor: "Ms. Jennifer Lee",
    subject: "Test Prep",
    description: "SAT Math and Reading strategies",
    location: "Group Room 1",
    participants: 8,
    maxParticipants: 12,
  },
  {
    id: "4",
    title: "Calculus Fundamentals",
    type: "lesson",
    date: new Date(2025, 0, 20, 11, 0),
    startTime: "11:00",
    endTime: "12:00",
    duration: 60,
    status: "scheduled",
    subject: "Mathematics",
    description: "Interactive calculus lesson with practice problems",
  },
  {
    id: "5",
    title: "Chemistry Lab Experiment",
    type: "scholarpass",
    date: new Date(2025, 0, 18, 15, 0),
    startTime: "15:00",
    endTime: "17:00",
    duration: 120,
    status: "scheduled",
    tutor: "Dr. Maria Santos",
    subject: "Chemistry",
    description: "Hands-on organic chemistry synthesis lab",
    location: "ScholarPASS Lab A",
    participants: 4,
    maxParticipants: 6,
  },
  {
    id: "6",
    title: "Advanced Physics Research",
    type: "scholarpass",
    date: new Date(2025, 0, 21, 13, 0),
    startTime: "13:00",
    endTime: "16:00",
    duration: 180,
    status: "scheduled",
    tutor: "Prof. David Kim",
    subject: "Physics",
    description: "Quantum mechanics research project",
    location: "ScholarPASS Lab B",
    participants: 3,
    maxParticipants: 5,
  },
  {
    id: "7",
    title: "Algebra Quiz",
    type: "assessment",
    date: new Date(2025, 0, 22, 10, 0),
    startTime: "10:00",
    endTime: "11:00",
    duration: 60,
    status: "pending",
    subject: "Mathematics",
    description: "Chapter 5-7 assessment on algebraic expressions",
  },
  {
    id: "8",
    title: "Midterm Physics Exam",
    type: "exam",
    date: new Date(2025, 0, 25, 9, 0),
    startTime: "09:00",
    endTime: "12:00",
    duration: 180,
    status: "scheduled",
    subject: "Physics",
    description: "Comprehensive midterm covering mechanics and thermodynamics",
    location: "Exam Hall A",
  },
]

// Generate more events for the year
export const generateMoreEvents = () => {
  const additionalEvents = []
  const subjects = ["Mathematics", "Physics", "Chemistry", "Biology", "English", "History", "Computer Science"]
  const tutors = [
    "Dr. Sarah Johnson",
    "Prof. Michael Chen",
    "Dr. Emily Rodriguez",
    "Ms. Jennifer Lee",
    "Dr. Robert Kim",
    "Dr. Maria Santos",
    "Prof. David Kim",
  ]

  for (let month = 1; month < 12; month++) {
    for (let day = 1; day <= 28; day += 3) {
      const eventTypes = ["tutoring", "group", "lesson", "assessment", "exam", "scholarpass"]
      const randomType = eventTypes[Math.floor(Math.random() * eventTypes.length)]
      const randomSubject = subjects[Math.floor(Math.random() * subjects.length)]
      const randomTutor = tutors[Math.floor(Math.random() * tutors.length)]

      additionalEvents.push({
        id: `gen-${month}-${day}`,
        title: `${randomSubject} ${
          randomType === "tutoring"
            ? "Session"
            : randomType === "group"
              ? "Class"
              : randomType === "lesson"
                ? "Lesson"
                : randomType === "assessment"
                  ? "Quiz"
                  : randomType === "exam"
                    ? "Test"
                    : "Lab"
        }`,
        type: randomType,
        date: new Date(2025, month, day, 9 + Math.floor(Math.random() * 8), 0),
        startTime: `${9 + Math.floor(Math.random() * 8)}:00`,
        endTime: `${10 + Math.floor(Math.random() * 8)}:00`,
        duration: randomType === "scholarpass" ? 120 : 60,
        status: Math.random() > 0.3 ? "scheduled" : "completed",
        tutor: randomType === "lesson" ? undefined : randomTutor,
        subject: randomSubject,
        participants:
          randomType === "group" || randomType === "scholarpass" ? Math.floor(Math.random() * 8) + 3 : undefined,
        maxParticipants: randomType === "group" || randomType === "scholarpass" ? 12 : undefined,
        location:
          randomType === "scholarpass"
            ? `ScholarPASS Lab ${String.fromCharCode(65 + Math.floor(Math.random() * 3))}`
            : undefined,
      })
    }
  }

  return additionalEvents
}

export const allEvents = [...sampleEvents, ...generateMoreEvents()]

export const getYearlyStats = (year) => {
  const yearEvents = allEvents.filter((event) => event.date.getFullYear() === year)

  return {
    tutoring: yearEvents.filter((e) => e.type === "tutoring").length,
    group: yearEvents.filter((e) => e.type === "group").length,
    lessons: yearEvents.filter((e) => e.type === "lesson").length,
    assessments: yearEvents.filter((e) => e.type === "assessment").length,
    exams: yearEvents.filter((e) => e.type === "exam").length,
    scholarpass: yearEvents.filter((e) => e.type === "scholarpass").length,
  }
}
