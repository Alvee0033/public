const SessionTiming = ({ session, formatDateTime, status }) => {
  const start = formatDateTime(session.start_time)
  const end = formatDateTime(session.end_time)

  return (
    <div className="space-y-6">
      <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Schedule</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-50 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-white rounded-lg shadow-sm">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Start Time</p>
              <p className="text-lg font-semibold text-gray-900">{start.date}</p>
              <p className="text-base text-gray-700">{start.time}</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-white rounded-lg shadow-sm">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">End Time</p>
              <p className="text-lg font-semibold text-gray-900">{end.date}</p>
              <p className="text-base text-gray-700">{end.time}</p>
            </div>
          </div>
        </div>
      </div>

      {status === "ongoing" && (
        <div className="flex items-center gap-3 text-emerald-700 bg-emerald-50 border border-emerald-200 p-4 rounded-xl">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="font-medium">Session is live now</span>
        </div>
      )}
    </div>
  )
}

export default SessionTiming
