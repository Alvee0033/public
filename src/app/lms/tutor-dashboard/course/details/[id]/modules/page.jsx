"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "@/lib/axios";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const ModulesList = () => {
  const { id } = useParams();
  const router = useRouter();
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchModules() {
      try {
        // Fetch all modules, then filter client-side by course_id
        const url = `/course-modules?limit=100000`;
        const res = await axios.get(url);
        const allModules = res.data.data || [];
        const filtered = allModules.filter(m => String(m.course_id) === String(id));
        setModules(filtered);
      } catch (error) {
        setModules([]);
      }
      setLoading(false);
    }
    if (id) fetchModules();
  }, [id]);

  return (
    <main className="p-4 max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Modules for Course #{id}</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div>Loading modules...</div>
          ) : modules.length === 0 ? (
            <div>No modules found for this course.</div>
          ) : (
            <ul className="divide-y">
              {modules.map(module => (
                <li key={module.id} className="py-4">
                  <div
                    className="flex justify-between items-center cursor-pointer hover:bg-gray-50 rounded-lg transition"
                    onClick={() => router.push(`/lms/tutor-dashboard/course/details/${module.course_id}/modules/${module.id}/view`)}
                  >
                    <div>
                      <div className="font-bold text-lg">{module.title}</div>
                      <div className="text-gray-600 text-sm">{module.short_description}</div>
                      <div className="text-xs text-gray-400">Created: {new Date(module.created_at).toLocaleDateString()}</div>
                      <div className="mt-2 flex gap-6">
                        <span
                          className="text-blue-600 hover:underline cursor-pointer text-sm"
                          onClick={e => { e.stopPropagation(); router.push(`/lms/tutor-dashboard/course/details/${module.course_id}/modules/${module.id}/add-lesson`); }}
                        >
                          Add Lesson
                        </span>
                        <span
                          className="text-green-600 hover:underline cursor-pointer text-sm"
                          onClick={e => { e.stopPropagation(); router.push(`/lms/tutor-dashboard/course/details/${module.course_id}/modules/${module.id}/add-quiz`); }}
                        >
                          Add Quiz
                        </span>
                        <span
                          className="text-purple-600 hover:underline cursor-pointer text-sm"
                          onClick={e => { e.stopPropagation(); router.push(`/lms/tutor-dashboard/course/details/${module.course_id}/modules/${module.id}/add-assignment`); }}
                        >
                          Add Assignment
                        </span>
                      </div>
                    </div>
                    <Badge variant={module.module_content_approved ? "success" : "destructive"}>
                      {module.module_content_approved ? "Approved" : "Pending"}
                    </Badge>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </main>
  );
};

export default ModulesList;
