const SessionHeader = ({ session, status }) => {
  const statusConfig = {
    upcoming: { text: "Upcoming", color: "bg-blue-50 text-blue-700 border-blue-200" },
    ongoing: { text: "Live Now", color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
    completed: { text: "Session Ended", color: "bg-gray-50 text-gray-700 border-gray-200" },
    scheduled: { text: "Scheduled", color: "bg-amber-50 text-amber-700 border-amber-200" },
  }

  const { text, color } = statusConfig[status] || statusConfig.scheduled

  return (
    <div className="border-b border-gray-100 px-8 py-6 bg-blue-700">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium border ${color}`}>
            {status === "ongoing" && (
              <span className="flex h-2 w-2 mr-2">
                <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            )}
            {text}
          </span>
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold text-white tracking-tight">{session.title}</h1>
          {session.course_name && <p className="text-lg text-white">{session.course_name}</p>}
        </div>
      </div>
    </div>
  )
}

export default SessionHeader
