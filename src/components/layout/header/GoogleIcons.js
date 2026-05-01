import React from 'react';

// This file provides placeholder components for Google app icons
// Replace these with actual image imports when available

function GoogleIconPlaceholder({ color = '#4285F4', letter, secondaryColor }) {
  return (
    <div 
      className="w-11 h-11 rounded-xl flex items-center justify-center overflow-hidden"
      style={{ backgroundColor: color }}
    >
      <span className="text-white font-bold text-xl">{letter}</span>
      {secondaryColor && (
        <div
          className="absolute bottom-0 right-0 w-4 h-4 rounded-br-xl"
          style={{ backgroundColor: secondaryColor }}
        />
      )}
    </div>
  );
}

export function AccountIcon() {
  return (
    <div className="w-12 h-12 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center overflow-hidden">
      <svg viewBox="0 0 24 24" width="26" height="26" fill="#5F6368">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
      </svg>
    </div>
  );
}

export function GmailIcon() {
  return (
    <div className="w-12 h-12 relative flex items-center justify-center">
      <svg width="42" height="32" viewBox="0 0 42 32">
        <path d="M5 1C2.8 1 1 2.8 1 5V27C1 29.2 2.8 31 5 31H37C39.2 31 41 29.2 41 27V5C41 2.8 39.2 1 37 1H5ZM5.6 5H36.4L21 15.3L5.6 5ZM5 27V9.7L21 20.7L37 9.7V27H5Z" fill="#EA4335"/>
      </svg>
    </div>
  );
}

export function DriveIcon() {
  return (
    <div className="w-12 h-12 flex items-center justify-center">
      <svg width="36" height="31" viewBox="0 0 36 31">
        <path d="M18.7 3.8L6.4 25.3H13.2L25.5 3.8" fill="#0F9D58" />
        <path d="M13.3 25.3L9.8 30.3H29.4L33 25.3" fill="#FBBC04" />
        <path d="M33 25.3H25.5L18.7 3.8L13.3 3.8L6.4 25.3L9.9 30.3H29.5" fill="#4285F4" />
      </svg>
    </div>
  );
}

export function ClassroomIcon() {
  return (
    <div className="w-12 h-12 flex items-center justify-center">
      <svg width="32" height="32" viewBox="0 0 32 32">
        <rect width="32" height="32" rx="4" fill="#0F9D58" />
        <path d="M8 8H24V16H8V8Z" fill="#FFFFFF" />
        <path d="M8 18H16V24H8V18Z" fill="#FFFFFF" />
        <path d="M18 18H24V24H18V18Z" fill="#FFFFFF" />
      </svg>
    </div>
  );
}

export function DocsIcon() {
  return (
    <div className="w-12 h-12 flex items-center justify-center">
      <svg width="32" height="32" viewBox="0 0 32 32">
        <rect width="28" height="32" rx="4" fill="#4285F4" />
        <path d="M8 8H20V10H8V8Z" fill="#FFFFFF" />
        <path d="M8 12H20V14H8V12Z" fill="#FFFFFF" />
        <path d="M8 16H20V18H8V16Z" fill="#FFFFFF" />
        <path d="M8 20H16V22H8V20Z" fill="#FFFFFF" />
      </svg>
    </div>
  );
}

export function GeminiIcon() {
  return (
    <div className="w-12 h-12 flex items-center justify-center">
      <svg width="32" height="32" viewBox="0 0 32 32">
        <rect width="32" height="32" rx="16" fill="#E1E4F6" />
        <path d="M16 6L26 16L16 26L6 16L16 6Z" fill="#8E24AA" />
        <circle cx="16" cy="16" r="4" fill="#FFFFFF" />
      </svg>
    </div>
  );
}

export function SheetsIcon() {
  return (
    <div className="w-12 h-12 flex items-center justify-center">
      <svg width="32" height="32" viewBox="0 0 32 32">
        <rect width="28" height="32" rx="4" fill="#0F9D58" />
        <path d="M8 8H14V12H8V8Z" fill="#FFFFFF" />
        <path d="M8 14H14V18H8V14Z" fill="#FFFFFF" />
        <path d="M8 20H14V24H8V20Z" fill="#FFFFFF" />
        <path d="M16 8H22V12H16V8Z" fill="#FFFFFF" />
        <path d="M16 14H22V18H16V14Z" fill="#FFFFFF" />
        <path d="M16 20H22V24H16V20Z" fill="#FFFFFF" />
      </svg>
    </div>
  );
}

export function SlidesIcon() {
  return (
    <div className="w-12 h-12 flex items-center justify-center">
      <svg width="32" height="32" viewBox="0 0 32 32">
        <rect width="28" height="32" rx="4" fill="#FBBC04" />
        <rect x="8" y="8" width="16" height="10" rx="1" fill="#FFFFFF" />
        <rect x="10" y="20" width="12" height="2" rx="1" fill="#FFFFFF" />
        <rect x="13" y="24" width="6" height="2" rx="1" fill="#FFFFFF" />
      </svg>
    </div>
  );
}

export function CalendarIcon() {
  return (
    <div className="w-12 h-12 flex items-center justify-center">
      <svg width="32" height="32" viewBox="0 0 32 32">
        <rect width="28" height="28" rx="4" fill="#4285F4" />
        <rect x="8" y="8" width="16" height="16" rx="1" fill="#FFFFFF" />
        <rect x="8" y="4" width="3" height="6" rx="1.5" fill="#4285F4" />
        <rect x="21" y="4" width="3" height="6" rx="1.5" fill="#4285F4" />
        <rect x="11" y="12" width="4" height="4" rx="1" fill="#4285F4" />
      </svg>
    </div>
  );
}

export function ChatIcon() {
  return (
    <div className="w-12 h-12 flex items-center justify-center">
      <svg width="32" height="32" viewBox="0 0 32 32">
        <path d="M16 4C9.4 4 4 9.4 4 16C4 22.6 9.4 28 16 28C22.6 28 28 22.6 28 16C28 9.4 22.6 4 16 4ZM13 20C11.3 20 10 18.7 10 17C10 15.3 11.3 14 13 14C14.7 14 16 15.3 16 17C16 18.7 14.7 20 13 20ZM19 20C17.3 20 16 18.7 16 17C16 15.3 17.3 14 19 14C20.7 14 22 15.3 22 17C22 18.7 20.7 20 19 20Z" fill="#0F9D58" />
      </svg>
    </div>
  );
}

export function MeetIcon() {
  return (
    <div className="w-12 h-12 flex items-center justify-center">
      <svg width="32" height="32" viewBox="0 0 32 32">
        <rect width="32" height="22" rx="4" fill="#4285F4" />
        <path d="M20 11L26 7V19L20 15V11Z" fill="#FFFFFF" />
        <rect x="6" y="7" width="14" height="12" rx="2" fill="#FFFFFF" />
      </svg>
    </div>
  );
}

export function FormsIcon() {
  return (
    <div className="w-12 h-12 flex items-center justify-center">
      <svg width="32" height="32" viewBox="0 0 32 32">
        <rect width="28" height="32" rx="4" fill="#8E24AA" />
        <rect x="8" y="8" width="16" height="2" rx="1" fill="#FFFFFF" />
        <rect x="8" y="12" width="16" height="2" rx="1" fill="#FFFFFF" />
        <rect x="8" y="16" width="16" height="2" rx="1" fill="#FFFFFF" />
        <path d="M8 20H10V24H8V20Z" fill="#FFFFFF" />
        <rect x="12" y="21" width="12" height="2" rx="1" fill="#FFFFFF" />
      </svg>
    </div>
  );
}

// Export all icons as a collection
export const GoogleIcons = {
  Account: AccountIcon,
  Gmail: GmailIcon,
  Drive: DriveIcon,
  Classroom: ClassroomIcon,
  Docs: DocsIcon,
  Gemini: GeminiIcon,
  Sheets: SheetsIcon,
  Slides: SlidesIcon,
  Calendar: CalendarIcon,
  Chat: ChatIcon,
  Meet: MeetIcon,
  Forms: FormsIcon
};

export default GoogleIcons; 