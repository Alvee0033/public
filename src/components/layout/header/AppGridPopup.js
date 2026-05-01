import React from 'react';
import Link from 'next/link';
import tutorsplanLogo from '@/assets/icons/admin_logo.png';
import Image from 'next/image';
import {
  ChevronDown,
  Handshake,
  Gamepad2,
  School,
  BriefcaseBusiness,
  Users,
  NotebookPen,
  GraduationCap,
} from 'lucide-react';


// App grid data
const appGridItems = [
  { icon: <Gamepad2 />, label: "Games", href: "https://games.tutorsplan.com", color: "blue" },
  { icon: <Handshake />, label: "CRM", href: "https://crm.tutorsplan.com" },
  { icon: <School />, label: "LMS", href: "https://lms.tutorsplan.com" },
  { icon: <BriefcaseBusiness />, label: "Jobs", href: "https://jobs.tutorsplan.com" },
  { icon: <Users />, label: "Team", href: "https://team.tutorsplan.com" },
  { icon: <NotebookPen />, label: "Blog", href: "https://blog.tutorsplan.com" },
  { icon: <GraduationCap />, label: "ScholarPass", href: "https://scholarpass.org" },
  { 
    icon: <Image src={tutorsplanLogo} width={24} height={24} alt="TutorsPlan Logo" />, 
    label: "ScholarPASS", 
    href: "https://tutorsplan.com/" 
  },
  
];

function AppGridPopup() {
  return (
    <>
      <div className="grid grid-cols-3 gap-4">
        {appGridItems.map((item, index) => (
          <Link
            key={index}
            href={item.href}
            className="flex flex-col items-center justify-center gap-1 hover:bg-gray-50 rounded-lg p-2 transition-colors"
          >
            {item.icon}
            <span className="text-xs text-gray-700 font-normal text-center">{item.label}</span>
          </Link>
        ))}
      </div>
      <div className="mt-4 pt-3 border-t border-gray-100">
        <Link
          href="/about-us"
          className="text-sm text-blue-600 font-medium hover:text-blue-700 flex justify-center items-center gap-1"
        >
          More from ScholarPASS
          <ChevronDown className="w-4 h-4 rotate-[-90deg]" />
        </Link>
      </div>
    </>
  );
}

export default AppGridPopup; 