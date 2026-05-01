'use client';
import { avatarPlaceHolder } from '@/assets/images';
import Image from 'next/image';
import { useState } from 'react';

function GroupMember({ member, isActive }) {
  return (
    <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm mb-3">
      <div className="flex items-center gap-4">
        <Image
          src={member.avatar || avatarPlaceHolder}
          alt={member.name}
          width={48}
          height={48}
          className="w-12 h-12 rounded-full object-cover"
        />
        <span className="text-[#00B7EB] font-medium">{member.name}</span>
      </div>
      <div
        className={`w-4 h-4 rounded-full ${
          isActive ? 'bg-[#00B7EB]' : 'bg-gray-300'
        }`}
      />
    </div>
  );
}

function ReferralMember({ member }) {
  return (
    <div className="flex items-center p-4 bg-white rounded-lg shadow-sm mb-3">
      <Image
        src={member.avatar || avatarPlaceHolder}
        alt={member.name}
        width={48}
        height={48}
        className="w-12 h-12 rounded-full mr-4 object-cover"
      />
      <span className="text-[#00B7EB] font-medium">{member.name}</span>
    </div>
  );
}

export default function SocialInteractionPanel() {
  const [groupMembers] = useState([
    {
      id: 1,
      name: 'Jennifer Lope',
      avatar: avatarPlaceHolder,
      isActive: true,
    },
    {
      id: 2,
      name: 'Jennifer Lope',
      avatar: avatarPlaceHolder,
      isActive: false,
    },
    {
      id: 3,
      name: 'Jennifer Lope',
      avatar: avatarPlaceHolder,
      isActive: true,
    },
    {
      id: 4,
      name: 'Jennifer Lope',
      avatar: avatarPlaceHolder,
      isActive: false,
    },
    {
      id: 5,
      name: 'Jennifer Lope',
      avatar: avatarPlaceHolder,
      isActive: true,
    },
  ]);

  const [referrals] = useState([
    {
      id: 1,
      name: 'Jennifer Lope',
      avatar: avatarPlaceHolder,
    },
    {
      id: 2,
      name: 'Jennifer Lope',
      avatar: avatarPlaceHolder,
    },
    {
      id: 3,
      name: 'Jennifer Lope',
      avatar: avatarPlaceHolder,
    },
    {
      id: 4,
      name: 'Jennifer Lope',
      avatar: avatarPlaceHolder,
    },
    {
      id: 5,
      name: 'Jennifer Lope',
      avatar: avatarPlaceHolder,
    },
  ]);

  return (
    <div className="grid grid-cols-2 gap-6">
      {/* Learning Groups Section */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
            <h2 className="text-[#00B7EB] font-medium">
              SOPHIE&apos;S LEARNING & GAMIFICATION GROPS
            </h2>
          </div>
          <button className="px-4 py-2 text-gray-600 border rounded-md hover:bg-gray-50">
            Invite Friends
          </button>
        </div>
        <div className="space-y-3">
          {groupMembers.map((member) => (
            <GroupMember
              key={member.id}
              member={member}
              isActive={member.isActive}
            />
          ))}
        </div>
      </div>

      {/* Referrals Section */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
            <h2 className="text-[#00B7EB] font-medium">REFER FRIENDS & EARN</h2>
          </div>
          <button className="px-4 py-2 text-gray-600 border rounded-md hover:bg-gray-50">
            Refer Friends
          </button>
        </div>
        <div className="space-y-3">
          {referrals.map((referral) => (
            <ReferralMember key={referral.id} member={referral} />
          ))}
        </div>
      </div>
    </div>
  );
}
