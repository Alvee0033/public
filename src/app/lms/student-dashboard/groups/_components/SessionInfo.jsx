const SessionInfo = ({ session, formatDateTime }) => (
  <div className="space-y-6">
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Session Details</h3>
      <div className="bg-gray-50 rounded-xl p-6">
        <div className="space-y-1">
          <p className="text-sm text-gray-500">Topic</p>
          <p className="text-lg font-medium text-gray-900">{session.topic || "No topic specified"}</p>
        </div>
      </div>
    </div>
  </div>
)

export default SessionInfo
