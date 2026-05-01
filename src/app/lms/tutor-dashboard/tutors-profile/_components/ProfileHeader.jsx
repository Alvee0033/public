"use client";

export default function ProfileHeader({ name }) {
    return (
        <div className="bg-white border-b px-6 py-4">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                        Tutors Profile
                    </h1>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-lg font-semibold">{name}</span>
                    <span className="text-sm text-gray-600">Tutor Dashboard</span>
                </div>
            </div>
        </div>
    );
}
