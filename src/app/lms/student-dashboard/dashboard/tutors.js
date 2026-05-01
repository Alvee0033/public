import { avatarPlaceHolder } from '@/assets/images';
import Image from 'next/image';
import Link from 'next/link';

// interface Tutor {
//   id: string
//   name: string
//   role: string
//   imageUrl: string
// }

const tutors = [
  {
    id: '1',
    name: 'Ronald Richards',
    role: 'Biology Professor',
    imageUrl: avatarPlaceHolder,
  },
  {
    id: '2',
    name: 'Eleanor Pena',
    role: 'Biology Professor',
    imageUrl: avatarPlaceHolder,
  },
  {
    id: '3',
    name: 'Bessie Cooper',
    role: 'Biology Professor',
    imageUrl: avatarPlaceHolder,
  },
  {
    id: '4',
    name: 'Marvin McKinney',
    role: 'Biology Professor',
    imageUrl: avatarPlaceHolder,
  },
  {
    id: '5',
    name: 'Savannah Nguyen',
    role: 'Biology Professor',
    imageUrl: avatarPlaceHolder,
  },
  {
    id: '6',
    name: 'Jenny Wilson',
    role: 'Biology Professor',
    imageUrl: avatarPlaceHolder,
  },
];

export default function TutorsSection() {
  return (
    <section className="w-full space-y-4 py-6 mt-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Anabia&apos;s Tutors</h2>
        <Link href="#" className="text-sm text-blue-600 hover:underline">
          See all
        </Link>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {tutors.map((tutor) => (
          <div
            key={tutor.id}
            className="flex items-center justify-between rounded-xl bg-white p-4 shadow-sm"
          >
            <div className="flex items-center gap-3">
              <Image
                src={'https://placehold.co/60x60/png'}
                alt={tutor.name}
                width={48}
                height={48}
                className="rounded-full bg-gray-100 w-12 h-12 "
              />
              <div>
                <h3 className="font-medium">{tutor.name}</h3>
                <p className="text-sm text-gray-500">{tutor.role}</p>
              </div>
            </div>
            <button className="text-sm font-medium text-blue-600 hover:underline p-2 py-1 rounded-full shadow-sm">
              Contact
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
