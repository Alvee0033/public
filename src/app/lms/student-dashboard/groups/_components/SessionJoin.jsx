"use client"

const SessionJoin = ({ session }) => (
  <div className="space-y-6">
    <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Join Session</h3>

    {session.session_link ? (
      <div className="space-y-4">
        <a
          href={session.session_link}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-semibold text-white bg-gradient-to-r from-green-600 to-blue-700 hover:from-green-400 hover:to-green-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          <svg
            className="w-5 h-5 group-hover:scale-110 transition-transform"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
            ></path>
          </svg>
          Join Session
        </a>

        {session.session_password && (
          <div className="bg-gray-50 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-lg">
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    ></path>
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Meeting Password</p>
                  <p className="text-lg font-mono font-semibold text-gray-900">{session.session_password}</p>
                </div>
              </div>
              <button
                className="px-4 py-2 text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                onClick={() => navigator.clipboard.writeText(session.session_password)}
              >
                Copy
              </button>
            </div>
          </div>
        )}
      </div>
    ) : (
      <div className="text-center py-12 bg-gray-50 rounded-xl">
        <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
        </div>
        <p className="text-gray-500 font-medium">No meeting link available</p>
      </div>
    )}
  </div>
)

export default SessionJoin
