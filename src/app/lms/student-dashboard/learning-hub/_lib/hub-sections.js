import {
  Award,
  BellRing,
  BookOpen,
  Building2,
  CalendarClock,
  CheckCircle2,
  Compass,
  GraduationCap,
  MapPinned,
  NotebookPen,
  Sparkles,
  WalletCards,
} from "lucide-react";

export const learningHubSections = [
  {
    slug: "my-hub",
    title: "My Hub",
    eyebrow: "Student access",
    description:
      "See your primary Learning Hub, local support details, service types, and the fastest way back into the hub profile.",
    actionLabel: "Open hub directory",
    actionHref: "/learninghub",
    secondaryLabel: "Browse hub profiles",
    secondaryHref: "/learninghub",
    icon: Building2,
    highlights: [
      "Primary hub profile and available services",
      "Location, contact, and in-person support context",
      "Fast access to the wider Learning Hub directory",
    ],
    relatedRoutes: ["Hub profile", "Nearby hubs", "Local learning support"],
  },
  {
    slug: "upcoming-sessions",
    title: "Upcoming Hub Sessions",
    eyebrow: "Schedule",
    description:
      "Keep upcoming in-person classes, tutoring blocks, workshops, and group sessions visible from the student LMS.",
    actionLabel: "Open group sessions",
    actionHref: "/lms/student-dashboard/groups",
    secondaryLabel: "View weekly schedule",
    secondaryHref: "/lms/student-dashboard/my-weekly-schedules",
    icon: CalendarClock,
    highlights: [
      "Scheduled classes and support slots",
      "Student group sessions and peer learning",
      "Quick jump into timetable views",
    ],
    relatedRoutes: ["Group sessions", "Weekly schedule", "Session reminders"],
  },
  {
    slug: "continue-learning",
    title: "Continue Learning",
    eyebrow: "Courses",
    description:
      "Surface the active courses, progress, next lesson, and resume actions linked to hub-based or partner learning.",
    actionLabel: "Continue my courses",
    actionHref: "/lms/student-dashboard/my-courses",
    secondaryLabel: "Browse course catalog",
    secondaryHref: "/learninghub/course-list",
    icon: BookOpen,
    highlights: [
      "Current enrollment and progress state",
      "Resume lesson or course player entry point",
      "Partner course discovery through the hub",
    ],
    relatedRoutes: ["My courses", "Course player", "Hub courses"],
  },
  {
    slug: "book-support",
    title: "Book Support",
    eyebrow: "Tutoring",
    description:
      "Let students request academic support, tutoring, mentoring, and guided help from the Learning Hub network.",
    actionLabel: "Open my tutors",
    actionHref: "/lms/student-dashboard/my-tutors",
    secondaryLabel: "Explore hubs",
    secondaryHref: "/learninghub",
    icon: MapPinned,
    highlights: [
      "Book tutor or mentor support",
      "Academic help and local learning assistance",
      "Direct handoff into existing tutor flows",
    ],
    relatedRoutes: ["My tutors", "Tutor support", "Learning guidance"],
  },
  {
    slug: "hub-courses",
    title: "Hub Courses",
    eyebrow: "Catalog",
    description:
      "Browse courses available through Learning Hubs and partner institutes without leaving the student LMS ecosystem.",
    actionLabel: "Open hub course list",
    actionHref: "/learninghub/course-list",
    secondaryLabel: "Explore all hubs",
    secondaryHref: "/learninghub",
    icon: NotebookPen,
    highlights: [
      "Hub-linked course discovery",
      "Partner institute learning options",
      "Program exploration before enrollment",
    ],
    relatedRoutes: ["Course list", "Course details", "Partner courses"],
  },
  {
    slug: "scholarship-support",
    title: "Scholarship Support",
    eyebrow: "Wallet",
    description:
      "Keep scholarship-eligible study options and student wallet support visible where course decisions happen.",
    actionLabel: "View my scholarships",
    actionHref: "/lms/student-dashboard/my-scholarships",
    secondaryLabel: "Open matching profile",
    secondaryHref: "/lms/student-dashboard/scholarship-matching-profile",
    icon: WalletCards,
    highlights: [
      "Scholarship-backed course discovery",
      "Wallet and eligibility awareness",
      "Fast path into scholarship tracking",
    ],
    relatedRoutes: ["My scholarships", "Matching profile", "Eligible courses"],
  },
  {
    slug: "my-tutors-mentors",
    title: "My Tutors & Mentors",
    eyebrow: "People",
    description:
      "Show assigned tutors, mentor relationships, session context, and the human support layer behind the hub experience.",
    actionLabel: "Manage tutor view",
    actionHref: "/lms/student-dashboard/my-tutors",
    secondaryLabel: "Book support",
    secondaryHref: "/lms/student-dashboard/learning-hub/book-support",
    icon: GraduationCap,
    highlights: [
      "Assigned tutor visibility",
      "Mentor contact and support context",
      "Connection back to session booking flows",
    ],
    relatedRoutes: ["My tutors", "Mentor support", "Session planning"],
  },
  {
    slug: "assignments",
    title: "Hub Assignments",
    eyebrow: "Tasks",
    description:
      "Keep local coursework, tasks, deadlines, and submission actions grouped under the Learning Hub student area.",
    actionLabel: "Open assignments",
    actionHref: "/lms/student-dashboard/assignments",
    secondaryLabel: "Resume courses",
    secondaryHref: "/lms/student-dashboard/my-courses",
    icon: CheckCircle2,
    highlights: [
      "Assignment due dates",
      "Submission and review flows",
      "Course-linked task visibility",
    ],
    relatedRoutes: ["Assignments", "Submissions", "Course tasks"],
  },
  {
    slug: "certificates-achievements",
    title: "Certificates & Achievements",
    eyebrow: "Progress",
    description:
      "Celebrate completed hub learning, certificates, and visible milestones so students see advancement in one place.",
    actionLabel: "Open certificates",
    actionHref: "/lms/student-dashboard/my-certificates",
    secondaryLabel: "Continue learning",
    secondaryHref: "/lms/student-dashboard/learning-hub/continue-learning",
    icon: Award,
    highlights: [
      "Completion milestones",
      "Certificate access",
      "Achievement visibility tied to learning progress",
    ],
    relatedRoutes: ["Certificates", "Completion", "Milestones"],
  },
  {
    slug: "announcements",
    title: "Announcements",
    eyebrow: "Updates",
    description:
      "Use this area for class updates, scholarship windows, batch launches, events, and other hub communication meant for students.",
    actionLabel: "Explore hub directory",
    actionHref: "/learninghub",
    secondaryLabel: "Open recommendations",
    secondaryHref: "/lms/student-dashboard/learning-hub/recommendations",
    icon: BellRing,
    highlights: [
      "Batch and session updates",
      "Scholarship and event alerts",
      "Hub communication entry point",
    ],
    relatedRoutes: ["News", "Events", "Student notices"],
  },
  {
    slug: "attendance-checkins",
    title: "Attendance & Check-ins",
    eyebrow: "Presence",
    description:
      "Give students a clear view of attendance, missed sessions, and on-site learning participation tied to hub activity.",
    actionLabel: "Open schedule",
    actionHref: "/lms/student-dashboard/my-weekly-schedules",
    secondaryLabel: "View sessions",
    secondaryHref: "/lms/student-dashboard/groups",
    icon: CheckCircle2,
    highlights: [
      "Attendance tracking context",
      "Missed session awareness",
      "Check-in and participation visibility",
    ],
    relatedRoutes: ["Attendance", "Schedules", "Session participation"],
  },
  {
    slug: "recommendations",
    title: "Recommendations",
    eyebrow: "Discovery",
    description:
      "Recommend hubs, tutors, scholarships, and courses based on the student profile so the dashboard keeps suggesting next moves.",
    actionLabel: "Explore hubs",
    actionHref: "/learninghub",
    secondaryLabel: "See scholarships",
    secondaryHref: "/lms/student-dashboard/my-scholarships",
    icon: Sparkles,
    highlights: [
      "Suggested hubs and services",
      "Recommended programs and tutors",
      "Profile-driven next best actions",
    ],
    relatedRoutes: ["Recommendations", "Discovery", "Suggested support"],
  },
];

export function getLearningHubSection(slug) {
  return learningHubSections.find((section) => section.slug === slug) ?? null;
}

export const learningHubOverview = {
  slug: "overview",
  title: "Learning Hub",
  eyebrow: "Student workspace",
  description:
    "Everything student-facing about the Learning Hub experience belongs here: your hub, sessions, support, courses, scholarships, mentors, announcements, and next recommendations.",
  icon: Compass,
};
