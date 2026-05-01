
"use client";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import axios from "@/lib/axios";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import RichText from "@/components/shared/rich-text";

export default function AddQuiz() {
  const [showAddForm, setShowAddForm] = useState(true);
  const [quizzes, setQuizzes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [quizToDelete, setQuizToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showAiModal, setShowAiModal] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiGeneratedQuizzes, setAiGeneratedQuizzes] = useState([]);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState(null);
  const [moduleInfo, setModuleInfo] = useState(null);
  const [courseInfo, setCourseInfo] = useState(null);

  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const dropdownRefs = useRef({});
  const moduleId = params.moduleId || searchParams.get('moduleId');
  const courseId = params.id || params.courseId;

  // Validation schema
  const validationSchema = Yup.object({
    quizName: Yup.string().required("Quiz name is required"),
    shortDescription: Yup.string(),
    points: Yup.number().positive("Points must be positive").integer("Points must be integer").required("Points required"),
  });
  const initialValues = { quizName: "", shortDescription: "", points: 10 };

  // Fetch module info
  useEffect(() => {
    async function fetchModuleInfo() {
      if (moduleId) {
        try {
          const response = await axios.get(`/course-modules/${moduleId}`);
          setModuleInfo(response.data.data);
        } catch (error) { }
      }
    }
    async function fetchCourseInfo() {
      if (courseId) {
        try {
          const response = await axios.get(`/courses/${courseId}`);
          setCourseInfo(response.data.data);
        } catch (error) { }
      }
    }
    fetchModuleInfo();
    fetchCourseInfo();
  }, [moduleId, courseId]);

  // Fetch quizzes
  const fetchQuizzes = async () => {
    if (!courseId) return;
    setIsLoading(true);
    try {
      let filter = { course_id: parseInt(courseId) };
      if (moduleId) filter.course_module_id = parseInt(moduleId);
      const response = await axios.get(`/quizs?filter=${JSON.stringify(filter)}&limit=1000`);
      setQuizzes(response.data?.data || []);
    } catch (error) {
      setQuizzes([]);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => { fetchQuizzes(); }, [courseId, moduleId]);

  // Create quiz
  const handleCreateQuiz = async (values, { resetForm }) => {
    setIsLoading(true);
    try {
      if (!courseId || !moduleId) {
        toast.error("Course or Module ID missing.");
        return;
      }
      const quizData = {
        name: values.quizName,
        description: values.shortDescription,
        points: parseInt(values.points),
        course: parseInt(courseId),
        course_module: parseInt(moduleId)
      };
      const response = await axios.post("/quizs", quizData);
      if (response.data) {
        toast.success("Quiz created successfully");
        router.push(`/lms/tutor-dashboard/course/details/${courseId}/modules`);
        resetForm();
      }
    } catch (error) {
      toast.error("Failed to create quiz.");
    } finally {
      setIsLoading(false);
    }
  };

  // Delete quiz
  const handleDeleteQuiz = async () => {
    if (!quizToDelete) return;
    setIsDeleting(true);
    try {
      await axios.delete(`/quizs/${quizToDelete.id}`);
      setQuizzes(quizzes.filter(q => q.id !== quizToDelete.id));
      setShowDeleteModal(false);
      setQuizToDelete(null);
      toast.success("Quiz deleted successfully");
    } catch (error) {
      toast.error("Failed to delete quiz.");
    } finally {
      setIsDeleting(false);
    }
  };

  // AI quiz generation
  const handleAiGeneration = async () => {
    if (!aiPrompt.trim()) return;
    setAiLoading(true);
    setAiError(null);
    try {
      const reqBody = {
        prompt: `Create meaningful quiz questions for Course ID: ${courseId} ${moduleId ? `Module ID: ${moduleId}` : ''}. ${aiPrompt}`,
        response: { title: "", description: "", questions: [{ question: "", options: ["", "", "", ""], correct_answer: 0 }] }
      };
      const response = await axios.post("/ai/openai", reqBody);
      setAiGeneratedQuizzes([response.data.data]);
    } catch (err) {
      setAiError("Failed to generate quiz: " + err.message);
    } finally {
      setAiLoading(false);
    }
  };

  const handleSaveAiQuiz = async (quiz) => {
    setAiLoading(true);
    try {
      if (!courseId || !moduleId) {
        toast.error("Course or Module ID missing.");
        return;
      }
      const quizData = {
        name: quiz.title,
        description: quiz.description,
        points: 10,
        content: JSON.stringify(quiz.questions),
        course: parseInt(courseId),
        course_module: parseInt(moduleId)
      };
      const response = await axios.post("/quizs", quizData);
      if (response.data) {
        toast.success("AI generated quiz saved successfully");
        router.push(`/lms/courses/view/${courseId}/course-builder/modules`);
        setAiPrompt("");
        setAiGeneratedQuizzes([]);
        setAiError(null);
      }
    } catch (error) {
      toast.error("Failed to save quiz.");
    } finally {
      setAiLoading(false);
    }
  };

  // Dropdown logic
  const toggleDropdown = (quizId) => {
    setOpenDropdown(openDropdown === quizId ? null : quizId);
  };
  const openDeleteModal = (quiz) => {
    setQuizToDelete(quiz);
    setShowDeleteModal(true);
    setOpenDropdown(null);
  };

  // Blank Form Content
  const BlankFormContent = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Add New Quiz</h1>
          <div className="mt-2 text-sm text-gray-600">
            <p><span className="font-medium">Course:</span> {courseInfo?.name || `Course ID: ${courseId}`}</p>
            <p><span className="font-medium">Module:</span> {moduleInfo?.title || `Module ID: ${moduleId}`}</p>
          </div>
        </div>
      </div>
      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleCreateQuiz}>
        {({ values, errors, touched, setFieldValue }) => (
          <Form className="space-y-6">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Quiz Name</label>
                <Field type="text" name="quizName" placeholder="Enter Quiz Name" className="w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-[#5f2ded] focus:border-transparent text-sm" />
                {touched.quizName && errors.quizName && (<p className="mt-1 text-sm text-red-600">{errors.quizName}</p>)}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Points</label>
                <Field type="number" name="points" placeholder="Enter quiz points" min="1" className="w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-[#5f2ded] focus:border-transparent text-sm" />
                {touched.points && errors.points && (<p className="mt-1 text-sm text-red-600">{errors.points}</p>)}
              </div>
              <div>
                <RichText label="Short Description" name="shortDescription" disableErrorMsg={false} />
              </div>
            </div>
            <div className="flex justify-end space-x-3 pt-6">
              <button type="button" onClick={() => router.push(`/lms/courses/view/${courseId}/course-builder/modules`)} disabled={isLoading} className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5f2ded] transition-colors disabled:opacity-50">
                Cancel
              </button>
              <button type="submit" disabled={isLoading || !values.quizName.trim() || !values.points} className="inline-flex items-center px-6 py-2 text-sm font-medium text-white bg-gradient-to-r from-[#5f2ded] to-[#f2277e] rounded-md shadow-sm hover:from-[#5f2ded]/90 hover:to-[#f2277e]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5f2ded] transition-colors disabled:opacity-50">
                {isLoading ? (<div className="flex items-center"><svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>Creating...</div>) : ("Create Quiz")}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );

  return (
    <div className="py-10">
      <Tabs defaultValue="blank_form">
        <div className="w-full mb-6">
          <TabsList className="grid grid-cols-3 w-1/2 h-auto p-0 bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
            <TabsTrigger value="blank_form" className="relative h-12 px-4 py-3 text-sm font-medium transition-all duration-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#5f2ded] data-[state=active]:to-[#f2277e] data-[state=active]:text-white data-[state=active]:shadow-none hover:bg-gradient-to-r hover:from-[#5f2ded]/10 hover:to-[#f2277e]/10 border-r border-gray-200 last:border-r-0 rounded-none first:rounded-l-lg last:rounded-r-lg">Blank Form</TabsTrigger>
            <TabsTrigger value="generate" className="relative h-12 px-4 py-3 text-sm font-medium transition-all duration-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#5f2ded] data-[state=active]:to-[#f2277e] data-[state=active]:text-white data-[state=active]:shadow-none hover:bg-gradient-to-r hover:from-[#5f2ded]/10 hover:to-[#f2277e]/10 border-r border-gray-200 last:border-r-0 rounded-none first:rounded-l-lg last:rounded-r-lg">Generate By Public AI</TabsTrigger>
            <TabsTrigger value="learningart_dataset" className="relative h-12 px-4 py-3 text-sm font-medium transition-all duration-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#5f2ded] data-[state=active]:to-[#f2277e] data-[state=active]:text-white data-[state=active]:shadow-none hover:bg-gradient-to-r hover:from-[#5f2ded]/10 hover:to-[#f2277e]/10 border-r border-gray-200 last:border-r-0 rounded-none first:rounded-l-lg last:rounded-r-lg">LearningART.ai Dataset</TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="blank_form">
          <BlankFormContent />
        </TabsContent>
        <TabsContent value="generate">
          <div className="space-y-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-3">Prompt to Generate Custom Quiz</h4>
                  <div className="mb-4">
                    <textarea value={aiPrompt} onChange={(e) => setAiPrompt(e.target.value)} placeholder="Describe the quiz you want to generate..." rows={4} className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#5f2ded] focus:border-transparent resize-none" />
                  </div>
                  <button onClick={handleAiGeneration} disabled={aiLoading || !aiPrompt.trim()} className="px-6 py-2 text-sm font-medium text-white bg-gradient-to-r from-[#5f2ded] to-[#f2277e] rounded-md shadow-sm hover:from-[#5f2ded]/90 hover:to-[#f2277e]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5f2ded] transition-colors disabled:opacity-50">
                    {aiLoading ? (<div className="flex items-center"><svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>Generating...</div>) : ('Generate Quiz')}
                  </button>
                </div>
                {aiError && (<div className="p-4 bg-red-50 border border-red-200 rounded-md"><div className="flex items-center"><svg className="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg><p className="text-red-800">{aiError}</p></div></div>)}
                {aiGeneratedQuizzes.length > 0 && (<div className="space-y-4"><h4 className="text-lg font-semibold text-gray-900">Generated Quiz:</h4>{aiGeneratedQuizzes.map((quiz, index) => (<div key={index} className="border border-gray-200 rounded-lg p-6 bg-gray-50"><div className="mb-4"><h5 className="text-lg font-medium text-gray-900 mb-2">{quiz.title}</h5><p className="text-gray-600 mb-4">{quiz.description}</p></div>{quiz.questions && quiz.questions.length > 0 && (<div className="mb-4"><h6 className="text-md font-medium text-gray-800 mb-3">Questions Preview:</h6><div className="space-y-4">{quiz.questions.slice(0, 3).map((question, qIndex) => (<div key={qIndex} className="bg-white p-4 rounded-md border border-gray-100"><div className="font-medium text-gray-900 mb-2">{qIndex + 1}. {question.question}</div><div className="space-y-1">{question.options.map((option, oIndex) => (<div key={oIndex} className={`text-sm px-3 py-1 rounded ${oIndex === question.correct_answer ? 'bg-green-100 text-green-800 font-medium' : 'bg-gray-100 text-gray-700'}`}>{String.fromCharCode(65 + oIndex)}. {option}</div>))}</div></div>))}{quiz.questions.length > 3 && (<div className="text-sm text-gray-500 text-center py-2">... and {quiz.questions.length - 3} more questions</div>)}</div></div>)}<div className="flex justify-end space-x-3"><button onClick={() => { setAiGeneratedQuizzes([]); setAiPrompt(""); setAiError(null); }} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5f2ded] transition-colors">Regenerate</button><button onClick={() => handleSaveAiQuiz(quiz)} disabled={aiLoading} className="px-6 py-2 text-sm font-medium text-white bg-gradient-to-r from-[#5f2ded] to-[#f2277e] rounded-md shadow-sm hover:from-[#5f2ded]/90 hover:to-[#f2277e]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5f2ded] transition-colors disabled:opacity-50">{aiLoading ? (<div className="flex items-center"><svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>Saving...</div>) : ('Save Quiz to Module')}</button></div></div>))}</div>)}
                {!aiLoading && aiGeneratedQuizzes.length === 0 && aiPrompt && !aiError && (<div className="text-center py-8"><svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg><p className="text-gray-500">Click \"Generate Quiz\" to create a quiz using AI.</p></div>)}
              </div>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="learningart_dataset">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold mb-4 text-[#5f2ded]">LearningART.ai Dataset</h3>
            <p className="text-gray-600">LearningART.ai Dataset coming soon</p>
          </div>
        </TabsContent>
      </Tabs>
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" /></svg>
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium text-gray-900">Delete Quiz</h3>
              </div>
            </div>
            <div className="mb-4">
              <p className="text-sm text-gray-500">Are you sure you want to delete the quiz \"{quizToDelete?.name || 'Untitled Quiz'}\"? This action cannot be undone.</p>
            </div>
            <div className="flex justify-end space-x-3">
              <button onClick={() => setShowDeleteModal(false)} disabled={isDeleting} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5f2ded] transition-colors disabled:opacity-50">Cancel</button>
              <button onClick={handleDeleteQuiz} disabled={isDeleting} className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors disabled:opacity-50">{isDeleting ? (<div className="flex items-center"><svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>Deleting...</div>) : ('Delete')}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
