import React from "react";
import useSWR from "swr";
import axios from "@/lib/axios";
import { useAppSelector } from "@/redux/hooks";

const fetcher = (url) => axios.get(url).then((res) => res.data);

const GroupSession = () => {
  // Get user data from Redux state
  const userData = useAppSelector((state) => state.auth.user);
  const studentId = userData?.student_id;

  const {
    data: groupMapData,
    isLoading: isGroupLoading,
    error: groupError,
  } = useSWR(studentId ? "/group-student-map" : null, fetcher);

  const groupSessions = React.useMemo(() => {
    if (!groupMapData?.data || !studentId) return [];
    return groupMapData.data.filter((item) => item.student_id === studentId);
  }, [groupMapData, studentId]);

  if (isGroupLoading) {
    return <div className="p-4">Loading group sessions...</div>;
  }
  if (groupError) {
    return (
      <div className="p-4 text-red-500">Failed to load group sessions.</div>
    );
  }

  return (
    <div className="bg-white rounded shadow p-4 mb-4">
      <h2 className="text-[var(--primaryColor)] font-bold mb-4">My Groups</h2>
      <div className="max-h-[400px] overflow-y-auto">
        {groupSessions.length === 0 ? (
          <div className="min-h-[160px] flex items-center justify-center text-gray-500">
            No group sessions found.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {groupSessions.map((session, idx) => (
              <div
                key={session.id || idx}
                className="bg-gradient-to-br from-blue-50 to-white border border-gray-200 rounded-xl shadow-sm p-4 flex flex-col justify-between transition-transform hover:scale-[1.02]"
              >
                <div>
                  <h3 className="text-lg font-semibold text-blue-700 mb-1 truncate">
                    <a
                      href={`/lms/student-dashboard/groups/${session.group_id}`}
                      className="hover:underline"
                    >
                      {session.group.title}
                    </a>
                  </h3>
                  <p className="text-sm text-gray-500 mb-2 truncate">
                    {session.group.description || "No description"}
                  </p>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <span className="inline-block px-3 py-1 text-xs rounded-full bg-blue-100 text-blue-700 font-medium">
                    Group ID: {session.group_id}
                  </span>
                  <a
                    href={`/lms/student-dashboard/groups/${session.group_id}`}
                    className="text-xs text-white bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded transition-colors font-medium"
                  >
                    View Details
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GroupSession;
