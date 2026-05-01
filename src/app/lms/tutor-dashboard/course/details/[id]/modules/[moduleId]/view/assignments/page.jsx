"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "@/lib/axios";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ModuleAssignmentsViewPage() {
  const { id, moduleId } = useParams();
  const router = useRouter();
  const [assignments, setAssignments] = useState([]);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAssignments() {
      try {
        const res = await axios.get(`/course-assignments?limit=10000`);
        const allAssignments = res.data.data || [];
        const filtered = allAssignments.filter(a => String(a.course_module) === String(moduleId) || String(a.course_module_id) === String(moduleId));
        setAssignments(filtered);
        if (filtered.length > 0) setSelectedAssignmentId(filtered[0].id);
      } catch (error) {
        setAssignments([]);
      }
      setLoading(false);
    }
    if (moduleId) fetchAssignments();
  }, [moduleId]);

  const selectedAssignment = assignments.find(a => a.id === selectedAssignmentId);

  return (
    <main className="p-4 max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Assignments for Module #{moduleId}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex justify-between items-center">
            <div>
              <label className="font-semibold mr-2">Select Assignment:</label>
              <select
                className="border rounded px-2 py-1"
                value={selectedAssignmentId || ''}
                onChange={e => setSelectedAssignmentId(Number(e.target.value))}
              >
                {assignments.map(assignment => (
                  <option key={assignment.id} value={assignment.id}>{assignment.title || assignment.name}</option>
                ))}
              </select>
            </div>
            <Button onClick={() => router.push(`/lms/tutor-dashboard/course/details/${id}/modules/${moduleId}/add-assignment`)}>
              Add Assignment
            </Button>
          </div>
          {loading ? (
            <div>Loading assignments...</div>
          ) : assignments.length === 0 ? (
            <div>No assignments found for this module.</div>
          ) : selectedAssignment ? (
            <div className="border rounded-lg p-4 bg-gray-50">
              <div className="font-bold text-lg mb-2">{selectedAssignment.title || selectedAssignment.name}</div>
              <div className="mb-2 text-gray-700"><span className="font-semibold">Description:</span> {selectedAssignment.description}</div>
              <div className="mb-2 text-gray-700"><span className="font-semibold">Points:</span> {selectedAssignment.points}</div>
              <div className="mb-2 text-gray-700"><span className="font-semibold">Created At:</span> {new Date(selectedAssignment.created_at).toLocaleString()}</div>
              {/* You can add more assignment details here as needed */}
            </div>
          ) : null}
        </CardContent>
      </Card>
    </main>
  );
}
