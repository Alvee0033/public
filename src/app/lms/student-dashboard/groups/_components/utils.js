// Check if session is upcoming, ongoing, or completed
export const getSessionStatus = (session) => {
  if (!session.start_time || !session.end_time) return "scheduled"

  const now = new Date()
  const startTime = new Date(session.start_time)
  const endTime = new Date(session.end_time)

  if (now < startTime) return "upcoming"
  if (now >= startTime && now <= endTime) return "ongoing"
  return "completed"
}

// Format date and time separately
export const formatDateTime = (dateString) => {
  if (!dateString) return { date: "-", time: "-" }

  const date = new Date(dateString)
  return {
    date: date.toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    }),
    time: date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    }),
  }
}
