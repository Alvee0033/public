'use client';

import { Home, Award, BookOpen } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMobileDetection } from '@/hooks/useMobileDetection';

const MobileBottomNav = () => {
  const isMobile = useMobileDetection();
  const pathname = usePathname();

  // Don't render if not on mobile
  if (!isMobile) return null;

  const navItems = [
    {
      icon: Home,
      label: 'Home',
      href: '/',
      active: pathname === '/',
    },
    {
      icon: Award,
      label: 'Institutes',
      href: '/institutes',
      active: pathname.startsWith('/institutes'),
    },
    {
      icon: BookOpen,
      label: 'LearningHub',
      href: '/learninghub',
      active: pathname.startsWith('/learninghub'),
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 safe-bottom">
      <div className="flex justify-around items-center px-4 py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center p-2 rounded-lg transition-colors ${
                item.active
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
              }`}
            >
              <Icon className="w-5 h-5 mb-1" />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default MobileBottomNav;
