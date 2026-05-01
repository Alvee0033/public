const SessionParticipants = ({ session, tutorName }) => (
  <div className="space-y-6">
    <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Group Leader</h3>

    <div className="bg-gray-50 rounded-xl p-6">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white shadow-lg">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            ></path>
          </svg>
        </div>
        <div className="flex-1">
          <p className="text-sm text-gray-500 mb-1">Tutor</p>
          <p className="text-lg font-semibold text-gray-900">
            {tutorName || (session.tutor_id ? `Tutor #${session.tutor_id}` : "Not assigned")}
          </p>
        </div>
      </div>
    </div>
  </div>
)

export default SessionParticipants
