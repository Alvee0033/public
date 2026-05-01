import {
  Award,
  Book,
  BookOpen,
  Building2,
  Calendar,
  CalendarCheck2,
  ClipboardList,
  Compass,
  FileBadge,
  FileText,
  Gamepad2,
  GraduationCap,
  Home,
  LayoutDashboardIcon,
  MapPin,
  Package,
  PackagePlus,
  PlusCircle,
  Settings,
  Shield,
  ShoppingCart,
  Sparkles,
  Star,
  Tag,
  Target,
  UserRound,
  Users,
  Wallet,
} from "lucide-react";

export const adminMenuItems = [
  {
    label: "Dashboard",
    href: "/lms/admin-dashboard",
    icon: LayoutDashboardIcon,
    permissionKey: "ADMIN_DASHBOARD:READ",
  },
];

export const tutorMenuItems = [
  {
    label: "Dashboard",
    href: "/lms/tutor-dashboard",
    icon: Home,
  },
  {
    label: "Tutors Profile",
    href: "/lms/tutor-dashboard/tutors-profile",
    icon: Users,
    permissionKey: "TUTORS_PROFILE:READ",
  },
  {
    label: "Course",
    icon: ShoppingCart,
    items: [
      {
        label: "Add Course",
        href: "/lms/tutor-dashboard/course/add-new",
        permissionKey: "COURSE:CREATE",
      },
      {
        label: "Manage Course",
        href: "/lms/tutor-dashboard/course/",
        permissionKey: "COURSE:UPDATE",
      },
      // {
      //   label: "Course Type",
      //   href: "/lms/tutor-dashboard/course-type",
      //   permissionKey: "COURSE:READ",
      // },
      {
        label: "Manage Students",
        href: "/lms/tutor-dashboard/students",
        permissionKey: "COURSE:READ",
      },
    ],
  },
  {
    label: "Session",
    icon: CalendarCheck2,
    items: [
      {
        label: "Group List",
        href: "/lms/tutor-dashboard/sessions/group-list",
        permissionKey: "GROUP:LIST",
      },
      {
        label: "Session List",
        href: "/lms/tutor-dashboard/sessions/session-list",
        permissionKey: "SESSION:LIST",
      },
    ],
  },
  {
    label: "Weekly Work Schedules",
    href: "/lms/tutor-dashboard/weekly-work-schedules",
    icon: Calendar,
    permissionKey: "WEEKLY_WORK_SCHEDULE:READ",
  },
  // {
  //   label: "TutorsPlan Membership",
  //   icon: ShoppingCart,
  //   items: [
  //     {
  //       label: "Add Plan",
  //       href: "/lms/tutor-dashboard/tutorship/add-plan",
  //       permissionKey: "MASTER_MEMBERSHIP_TYPE:READ",
  //     },
  //     {
  //       label: "Manage Plan",
  //       href: "/lms/tutor-dashboard/tutorship/all-plan",
  //       permissionKey: "MASTER_MEMBERSHIP_TYPE:READ",
  //     },
  //   ],
  // },
  // {
  //   label: "Sales Report",
  //   icon: Package,
  //   items: [
  //     {
  //       label: "Report",
  //       href: "/lms/tutor-dashboard/sales-report",
  //       permissionKey: "LEAD_SALES_REP:READ",
  //     },
  //     {
  //       label: "Course Sales",
  //       href: "/lms/tutor-dashboard/sales-report/course",
  //       permissionKey: "LEAD_SALES_REP:READ",
  //     },
  //     {
  //       label: "Mentorship Sales",
  //       href: "/lms/tutor-dashboard/sales-report/mentorship",
  //       permissionKey: "LEAD_SALES_REP:READ",
  //     },
  //   ],
  // },
  // {
  //   label: "Financial",
  //   // href: "/lms/tutor-dashboard/payment",
  //   icon: Package,
  //   items: [
  //     {
  //       label: "Manage Account",
  //       href: "/lms/tutor-dashboard/payment-account",
  //       permissionKey: "PAYMENT_ACCOUNT:READ",
  //     },
  //     {
  //       label: "Payment Method",
  //       href: "/lms/tutor-dashboard/payment-method",
  //       permissionKey: "PAYMENT_ACCOUNT:READ",
  //     },
  //     {
  //       label: "Payment Request",
  //       href: "/lms/tutor-dashboard/payment-request",
  //       permissionKey: "PAYMENT_ACCOUNT:READ",
  //     },
  //     ,
  //   ],
  // },

  // {
  //   label: "Profile Settings",
  //   href: "/lms/tutor-dashboard/settings",
  //   permissionKey: "PROFILE:READ",
  //   icon: Settings,
  // },
];

export const studentMenuItems = [
  {
    label: "Dashboard",
    href: "/lms/student-dashboard",
    icon: LayoutDashboardIcon,
    permissionKey: "STUDENT_DASHBOARD:READ",
  },
  {
    label: "Learning Hub",
    icon: Compass,
    items: [
      {
        label: "My Hub",
        href: "/lms/student-dashboard/learning-hub/my-hub",
        permissionKey: "PROFILE:READ",
      },
      {
        label: "Upcoming Hub Sessions",
        href: "/lms/student-dashboard/learning-hub/upcoming-sessions",
        permissionKey: "PROFILE:READ",
      },
      {
        label: "Continue Learning",
        href: "/lms/student-dashboard/learning-hub/continue-learning",
        permissionKey: "PROFILE:READ",
      },
      {
        label: "Book Support",
        href: "/lms/student-dashboard/learning-hub/book-support",
        permissionKey: "PROFILE:READ",
      },
      {
        label: "Hub Courses",
        href: "/lms/student-dashboard/learning-hub/hub-courses",
        permissionKey: "PROFILE:READ",
      },
      {
        label: "Scholarship Support",
        href: "/lms/student-dashboard/learning-hub/scholarship-support",
        permissionKey: "PROFILE:READ",
      },
      {
        label: "My Tutors & Mentors",
        href: "/lms/student-dashboard/learning-hub/my-tutors-mentors",
        permissionKey: "PROFILE:READ",
      },
      {
        label: "Hub Assignments",
        href: "/lms/student-dashboard/learning-hub/assignments",
        permissionKey: "PROFILE:READ",
      },
      {
        label: "Certificates & Achievements",
        href: "/lms/student-dashboard/learning-hub/certificates-achievements",
        permissionKey: "PROFILE:READ",
      },
      {
        label: "Announcements",
        href: "/lms/student-dashboard/learning-hub/announcements",
        permissionKey: "PROFILE:READ",
      },
      {
        label: "Attendance & Check-ins",
        href: "/lms/student-dashboard/learning-hub/attendance-checkins",
        permissionKey: "PROFILE:READ",
      },
      {
        label: "Recommendations",
        href: "/lms/student-dashboard/learning-hub/recommendations",
        permissionKey: "PROFILE:READ",
      },
    ],
  },
  {
    label: "Courses",
    icon: BookOpen,
    items: [
      {
        label: "My Courses",
        href: "/lms/student-dashboard/my-courses",
        icon: Book,
        permissionKey: "STUDENT_COURSES:READ",
      },
      {
        label: "My Bundle Courses",
        href: "/lms/student-dashboard/my-bundle-courses",
        icon: Package,
        permissionKey: "STUDENT_COURSES:READ",
      },
      {
        label: "Learning Goals",
        href: "/lms/student-dashboard/learning-goals",
        icon: Target,
        permissionKey: "LEARNING_GOALS:READ",
      },
      // {
      //   label: 'Live Tutoring',
      //   href: '/lms/student-dashboard/live-classes',
      //   permissionKey: 'LIVE_CLASSES:READ',
      // },
      {
        label: "Assignments",
        href: "/lms/student-dashboard/assignments",
        icon: ClipboardList,
        permissionKey: "COURSE_ASSIGNMENT:READ",
      },
      {
        label: "Quiz",
        href: "/lms/student-dashboard/quiz",
        icon: CalendarCheck2,
        permissionKey: "QUIZ:READ",
      },
    ],
  },
  {
    label: "My Certificates",
    icon: Award, // Award is better for certificates/achievements
    href: "/lms/student-dashboard/my-certificates",
    permissionKey: "REFERRALS:READ",
  },
  {
    label: "Scholarship matching",
    icon: Sparkles,
    href: "/lms/student-dashboard/scholarship-matching-profile",
    permissionKey: "PROFILE:READ",
  },
  {
    label: "My Scholarships",
    icon: FileBadge, // FileBadge is more appropriate for scholarship documents
    href: "/lms/student-dashboard/my-scholarships",
    permissionKey: "REFERRALS:READ",
  },
  {
    label: "Student Tags",
    href: "/lms/student-dashboard/tags",
    icon: Tag,
    permissionKey: "PROFILE:READ",
  },
  {
    label: "Profile Settings",
    href: "/lms/student-dashboard/settings",
    icon: Settings,
    permissionKey: "PROFILE:READ",
  },
];

export const guardianMenuItems = [
  {
    label: "Dashboard",
    href: "/lms/guardian-dashboard",
    icon: Home,
    permissionKey: "GUARDIAN_DASHBOARD:READ",
  },
  {
    label: "Add Student",
    href: "/lms/guardian-dashboard/students/add",
    icon: ShoppingCart,
    permissionKey: "STUDENTS:CREATE",
  },
  // {
  //   label: "Students",
  //   icon: ShoppingCart,
  //   items: [
  //     {
  //       label: "Manage Students",
  //       href: "/lms/guardian-dashboard/students",
  //       permissionKey: "STUDENTS:READ",
  //     },
  //     {
  //       label: "Add Student",
  //       href: "/lms/guardian-dashboard/students/add",
  //       permissionKey: "STUDENTS:CREATE",
  //     },
  //   ],
  // },
  // {
  //   label: "Course Progress",
  //   icon: Package,
  //   items: [
  //     {
  //       label: "All Courses",
  //       href: "/lms/guardian-dashboard/courses/all",
  //       permissionKey: "COURSE_PROGRESS:READ",
  //     },
  //     {
  //       label: "Progress Reports",
  //       href: "/lms/guardian-dashboard/courses/progress",
  //       permissionKey: "COURSE_PROGRESS:READ",
  //     },
  //   ],
  // },

  // {
  //   label: 'Payments',
  //   icon: Package,
  //   items: [
  //     {
  //       label: 'Payment History',
  //       href: '/lms/guardian-dashboard/payments/history',
  //       permissionKey: 'PAYMENTS:READ',
  //     },
  //     {
  //       label: 'Invoices',
  //       href: '/lms/guardian-dashboard/payments/invoices',
  //       permissionKey: 'PAYMENTS:READ',
  //     },
  //     {
  //       label: 'Payment Methods',
  //       href: '/lms/guardian-dashboard/payments/methods',
  //       permissionKey: 'PAYMENTS:READ',
  //     },
  //   ],
  // },

  {
    label: "Profile Settings",
    href: "/lms/guardian-dashboard/settings",
    icon: Settings,
    permissionKey: "PROFILE:READ",
  },
];
export const partnerMenuItems = [
  {
    label: "Dashboard",
    href: "/lms/partner-dashboard",
    icon: Home,
  },
  {
    label: "My Hubs",
    href: "/lms/partner-dashboard",
    icon: Building2,
  },
  {
    label: "Register a Hub",
    href: "/learninghubs/register",
    icon: PlusCircle,
  },
  {
    label: "Hub Directory",
    href: "/hub-directory-page",
    icon: MapPin,
  },
  {
    label: "Students",
    href: "/lms/partner-dashboard/students",
    icon: ShoppingCart,
  },
  {
    label: "Courses",
    href: "/lms/partner-dashboard/courses",
    icon: Package,
  },
  {
    label: "Tutors",
    href: "/lms/partner-dashboard/tutors",
    icon: Package,
  },
  {
    label: "Team Training",
    href: "/lms/partner-dashboard/team-training",
    icon: Package,
  },
  {
    label: "Schedule",
    href: "/lms/partner-dashboard/schedule",
    icon: Package,
  },
  {
    label: "Settings",
    href: "/lms/partner-dashboard/settings",
    icon: PackagePlus,
  },
  {
    label: "Help & Support",
    href: "/lms/partner-dashboard/help-support",
    icon: Package,
  },
];

export const hubMenuItems = [
  {
    label: "Dashboard",
    href: "/lms/hub-dashboard",
    icon: LayoutDashboardIcon,
  },
  {
    label: "Hub Class Score",
    href: "/lms/hub-dashboard?tab=score",
    icon: Star,
  },
  {
    label: "Institute Partnerships",
    href: "/lms/hub-dashboard?tab=growth",
    icon: Building2,
  },
  {
    label: "Student Section",
    href: "/lms/hub-dashboard?tab=students",
    icon: UserRound,
  },
  {
    label: "Manage Tutors",
    href: "/lms/hub-dashboard?tab=tutors",
    icon: GraduationCap,
  },
  {
    label: "Manage Courses",
    href: "/lms/hub-dashboard?tab=courses",
    icon: BookOpen,
  },
  {
    label: "Scholarship Wallet",
    href: "/lms/hub-dashboard?tab=wallet",
    icon: Wallet,
  },
  {
    label: "Hub Directory",
    href: "/hub-directory-page",
    icon: MapPin,
  },
  {
    label: "Register a Hub",
    href: "/learninghubs/register",
    icon: PlusCircle,
  },
];
