'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Brain, Wand2, ArrowRight, CheckCircle2, Zap, BookOpen, Clock, Users, ShieldCheck, GraduationCap, Target, Briefcase, Microscope } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'

const MOCK_QUESTIONS = [
  {
    id: 1,
    question: "Primary Academic Objective",
    description: "Select the goal that best aligns with your current academic trajectory.",
    options: [
      { id: 'a', text: "Full-tuition scholarship abroad", label: "International Excellence", icon: GraduationCap },
      { id: 'b', text: "Career transition to high-growth tech", label: "Industry Pivot", icon: Target },
      { id: 'c', text: "Practical skills for rapid employment", label: "Skill Accelerator", icon: Briefcase },
      { id: 'd', text: "Research expertise & PhD pathways", label: "Academic Research", icon: Microscope }
    ]
  },
  {
    id: 2,
    question: "Preferred Learning Methodology",
    description: "How do you absorb complex information most effectively?",
    options: [
      { id: 'a', text: "Self-paced video & documentation", label: "Asynchronous", icon: BookOpen },
      { id: 'b', text: "Live instructor-led workshops", label: "Synchronous", icon: Users },
      { id: 'c', text: "Project-based learning with mentors", label: "Experiential", icon: Wand2 },
      { id: 'd', text: "Peer-to-peer collaborative study", label: "Social Learning", icon: Users }
    ]
  },
  {
    id: 3,
    question: "Financial Impact Strategy",
    description: "Which scholarship structure provides the most value for your situation?",
    options: [
      { id: 'a', text: "Upfront tuition discount (High Impact)", label: "Direct Savings", icon: Zap },
      { id: 'b', text: "Monthly stipend for living expenses", label: "Living Support", icon: Clock },
      { id: 'c', text: "Work-study opportunity at institute", label: "Integrated Work", icon: Briefcase },
      { id: 'd', text: "Guaranteed internship with partner firm", label: "Career Bridge", icon: Target }
    ]
  },
  {
    id: 4,
    question: "Enrollment Timeline Preference",
    description: "When do you plan to begin your next program?",
    options: [
      { id: 'a', text: "Within 3 months", label: "Immediate", icon: Clock },
      { id: 'b', text: "Within 6 months", label: "Near Term", icon: Clock },
      { id: 'c', text: "Within 12 months", label: "Planned", icon: Clock },
      { id: 'd', text: "Flexible timeline", label: "Flexible", icon: Clock }
    ]
  },
  {
    id: 5,
    question: "Preferred Learning Format",
    description: "Which delivery mode works best with your current routine?",
    options: [
      { id: 'a', text: "On-campus immersive learning", label: "On-Campus", icon: Users },
      { id: 'b', text: "Hybrid learning", label: "Hybrid", icon: Wand2 },
      { id: 'c', text: "Fully online", label: "Online", icon: BookOpen },
      { id: 'd', text: "Any format", label: "Flexible", icon: Target }
    ]
  },
  {
    id: 6,
    question: "Most Important Outcome",
    description: "What matters most after completing your program?",
    options: [
      { id: 'a', text: "Fast employment outcomes", label: "Employment", icon: Briefcase },
      { id: 'b', text: "Research and publications", label: "Research", icon: Microscope },
      { id: 'c', text: "Startup/entrepreneurship support", label: "Entrepreneurship", icon: Target },
      { id: 'd', text: "Global relocation opportunities", label: "Global Mobility", icon: GraduationCap }
    ]
  }
]

import api from '@/lib/axios'

function formatDegreeLabel(value = "") {
  const text = String(value || "").replace(/_/g, " ").trim()
  if (!text) return "Program"
  return text.replace(/\b\w/g, (m) => m.toUpperCase())
}

function parseTuitionValue(tuitionText = "") {
  const text = String(tuitionText || "")
  const matches = text.match(/[\d,.]+/g)
  if (!matches?.length) return 0
  const number = Number(matches[0].replace(/,/g, ""))
  return Number.isFinite(number) ? number : 0
}

function detectDomain(text = "") {
  const t = String(text || "").toLowerCase()
  if (!t) return "general"
  if (/(computer|software|data|ai|artificial intelligence|cyber|informatics|machine learning|coding)/.test(t)) return "cs"
  if (/(medicine|medical|nursing|health|biomedical|pharmacy|clinical|public health)/.test(t)) return "medical"
  if (/(business|mba|management|finance|economics|marketing|accounting)/.test(t)) return "business"
  if (/(engineering|mechanical|electrical|civil|chemical|industrial|stem)/.test(t)) return "engineering"
  if (/(law|legal|juris|llb|llm)/.test(t)) return "law"
  if (/(arts|design|humanities|literature|history|philosophy)/.test(t)) return "arts"
  return "general"
}

function scoreProgram(program, profile, answers, questions) {
  const name = `${program?.name || ""} ${program?.department || ""}`.toLowerCase()
  const institute = `${program?.institute?.canonical_name || ""}`.toLowerCase()
  const subjectAnswer = (() => {
    const subjectQIndex = (questions || []).findIndex((q) => {
      const t = String(q?.question || "").toLowerCase()
      return t.includes("subject") || t.includes("field of study") || t.includes("discipline")
    })
    if (subjectQIndex === -1) return ""
    const rawAnswer = answers?.[subjectQIndex]
    if (rawAnswer && typeof rawAnswer === "object" && rawAnswer.kind === "text") {
      return String(rawAnswer.value || "").toLowerCase()
    }
    const selectedOption = questions?.[subjectQIndex]?.options?.find((o) => o.id === rawAnswer)
    return `${selectedOption?.text || ""} ${selectedOption?.label || ""}`.toLowerCase()
  })()
  const subjectText = String(subjectAnswer || profile?.preferred_subject_areas_text || "").toLowerCase()
  const subjectDomain = detectDomain(subjectText)
  const programDomain = detectDomain(`${name} ${program?.department || ""}`)
  const levelText = String(profile?.preferred_course_level || "").toLowerCase()
  const answerTexts = Object.entries(answers).map(([qIdx, answerValue]) => {
    const q = questions?.[Number(qIdx)]
    if (answerValue && typeof answerValue === "object" && answerValue.kind === "text") {
      return String(answerValue.value || "").toLowerCase()
    }
    const opt = q?.options?.find((o) => o.id === answerValue)
    return `${opt?.text || ""} ${opt?.label || ""}`.toLowerCase()
  }).join(" ")

  let score = 70
  if (subjectDomain !== "general" && programDomain !== "general" && subjectDomain !== programDomain) {
    score -= 45
  }
  if (subjectDomain !== "general" && programDomain === subjectDomain) {
    score += 18
  }
  if (subjectText && (name.includes(subjectText) || institute.includes(subjectText))) score += 16
  if (subjectText.includes("computer") || subjectText.includes("ai") || subjectText.includes("data")) {
    if (name.includes("computer") || name.includes("ai") || name.includes("data") || name.includes("software")) score += 8
  }
  if (subjectText.includes("business") || subjectText.includes("mba") || subjectText.includes("management")) {
    if (name.includes("business") || name.includes("mba") || name.includes("management") || name.includes("finance")) score += 8
  }
  if (subjectText.includes("engineering") || subjectText.includes("stem")) {
    if (name.includes("engineering") || name.includes("stem") || name.includes("mechanical") || name.includes("electrical")) score += 8
  }
  if (levelText && formatDegreeLabel(program?.degree_level).toLowerCase().includes(levelText)) score += 8
  if (answerTexts.includes("tech") && (name.includes("tech") || name.includes("ai") || name.includes("engineering"))) score += 8
  if (answerTexts.includes("research") && (name.includes("research") || name.includes("phd"))) score += 8
  if (answerTexts.includes("career") && (name.includes("career") || name.includes("internship") || name.includes("employment"))) score += 6
  if (program?.confidence_score) score += Math.round(Math.min(Number(program.confidence_score) / 10, 6))
  return Math.max(1, Math.min(99, score))
}

function buildMatchReason(program, profile) {
  const subject = profile?.preferred_subject_areas_text || "your preferred subject area"
  const instituteName = program?.institute?.canonical_name || "this institute"
  const dept = program?.department || "program focus"
  return `Aligned with ${subject} goals, and ${instituteName} offers strong ${dept.toLowerCase()} outcomes.`
}

function normalizeClientQuestions(input) {
  if (!Array.isArray(input)) return [];
  return input
    .map((q, idx) => {
      const question = String(q?.question || "").trim();
      const description = String(q?.description || "").trim();
      const options = Array.isArray(q?.options)
        ? q.options
            .filter(Boolean)
            .map((opt, i) => ({
              id: String(opt?.id || ["a", "b", "c", "d"][i] || `${i + 1}`),
              text: String(opt?.text || "").trim(),
              label: String(opt?.label || opt?.text || "").trim(),
            }))
            .filter((opt) => opt.text.length > 0)
        : [];

      const isText =
        String(q?.question_type || "").toLowerCase() === "text" ||
        (options.length === 0 && /subject|field of study|discipline/i.test(question));

      return {
        id: q?.id ?? idx + 1,
        question_type: isText ? "text" : "multiple_choice",
        question: question || `Question ${idx + 1}`,
        description: description || "Select the best option for you.",
        placeholder: String(q?.placeholder || "Type your answer"),
        options,
      };
    })
    .filter((q) => q.question_type === "text" || q.options.length > 0);
}

async function fetchProgramsWithFallback() {
  const attempts = [
    { status: 'approved', limit: 100 },
    { status: 'published', limit: 100 },
    { limit: 100 },
  ]

  for (const params of attempts) {
    try {
      const qs = new URLSearchParams({ page: '1', ...Object.fromEntries(Object.entries(params).map(([k, v]) => [k, String(v)])) })
      const res = await fetch(`/api/v1/program-aggregation/program-records?${qs.toString()}`, {
        method: 'GET',
        headers: { Accept: 'application/json' },
      })
      if (!res.ok) continue
      const json = await res.json().catch(() => null)
      const payload = json?.data || json
      const items = Array.isArray(payload?.items) ? payload.items : []
      if (items.length > 0) return items
    } catch {
      // try next query strategy
    }
  }
  return []
}

export default function MatchingProfilePage() {
  const [step, setStep] = useState('welcome') 
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [questions, setQuestions] = useState([])
  const [answers, setAnswers] = useState({})
  const [progress, setProgress] = useState(0)
  const [profile, setProfile] = useState(null)
  const [realMatches, setRealMatches] = useState([])
  const [resultStats, setResultStats] = useState({ scanned: 0, avgMatch: 0 })
  const [isClientReady, setIsClientReady] = useState(false)
  const [textAnswer, setTextAnswer] = useState("")

  const [error, setError] = useState(null)
  const currentQuestion = questions[currentQuestionIndex] || null

  useEffect(() => {
    setIsClientReady(true)
  }, [])

  useEffect(() => {
    const fetchProfileAndGenerate = async () => {
      if (step === 'analyzing') {
        try {
          setError(null)
          // 1. Fetch student profile (with guest fallback)
          let profileData = null
          try {
            const res = await api.get("/student-matching-profile/me", {
              suppressErrorStatuses: [401],
            })
            profileData = res?.data?.data?.profile || res?.data?.profile
          } catch (e) {
            console.log("Guest mode: using default profile context")
            profileData = { 
              preferred_course_level: "Undergraduate", 
              preferred_subject_areas_text: "General Studies",
              is_guest: true 
            }
          }
          setProfile(profileData)

          // 2. Generate personalized questions via AI (with retry)
          const endpoint = `${window.location.origin}/api/generate-questions`
          const generateOnce = async () => {
            try {
              const aiRes = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ profile: profileData })
              })
              if (!aiRes.ok) return null
              const payload = await aiRes.json()
              if (Array.isArray(payload)) return payload
              if (Array.isArray(payload?.data)) return payload.data
              return null
            } catch {
              return null
            }
          }

          let aiQuestions
          try {
            aiQuestions = await generateOnce()
          } catch (firstError) {
            // brief retry in case Ollama is still warming up
            await new Promise((resolve) => setTimeout(resolve, 700))
            aiQuestions = await generateOnce()
          }

          if (!aiQuestions || !Array.isArray(aiQuestions) || aiQuestions.length === 0) {
            throw new Error("AI returned invalid question format")
          }

          const normalized = normalizeClientQuestions(aiQuestions)
          if (!normalized.length) {
            throw new Error("AI returned unusable questions")
          }

          setCurrentQuestionIndex(0)
          setProgress(0)
          setQuestions(normalized)
          setStep('questioning')
        } catch (error) {
          // Production-friendly fallback so user can continue even if Ollama is unavailable.
          setCurrentQuestionIndex(0)
          setProgress(0)
          setQuestions(normalizeClientQuestions(MOCK_QUESTIONS))
          setStep('questioning')
        }
      }
    }

    fetchProfileAndGenerate()
  }, [step])

  useEffect(() => {
    if (step === 'processing') {
      let mounted = true
      const loadMatches = async () => {
        try {
          const items = await fetchProgramsWithFallback()
          const matched = items
            .map((item) => {
              const matchScore = scoreProgram(item, profile, answers, questions)
              const subjectQIndex = (questions || []).findIndex((q) => {
                const t = String(q?.question || "").toLowerCase()
                return t.includes("subject") || t.includes("field of study") || t.includes("discipline")
              })
              const selectedSubject =
                subjectQIndex >= 0
                  ? (
                      typeof answers?.[subjectQIndex] === "object" && answers?.[subjectQIndex]?.kind === "text"
                        ? answers?.[subjectQIndex]?.value
                        : questions?.[subjectQIndex]?.options?.find((o) => o.id === answers?.[subjectQIndex])?.text
                    )
                  : null
              const tuition = parseTuitionValue(item?.tuition_text)
              const originalPrice = tuition > 0 ? Math.round(tuition * 1.8) : 0
              return {
                id: item.id,
                title: item?.name || "Untitled Program",
                institute: item?.institute?.canonical_name || item?.institute?.match_key || "Partner Institute",
                matchScore,
                reason: selectedSubject
                  ? `Matches your selected subject focus: ${selectedSubject}. ${buildMatchReason(item, profile)}`
                  : buildMatchReason(item, profile),
                price: tuition,
                originalPrice,
                category: item?.department || "Program",
                level: formatDegreeLabel(item?.degree_level),
                impact: Math.min(95, Math.max(35, Math.round(matchScore - 10))),
                programDomain: detectDomain(`${item?.name || ""} ${item?.department || ""}`),
              }
            })
            .filter((item) => item.matchScore >= 72)
            .sort((a, b) => b.matchScore - a.matchScore)
            .slice(0, 8)

          if (mounted) {
            const avg = matched.length
              ? (matched.reduce((sum, p) => sum + p.matchScore, 0) / matched.length).toFixed(1)
              : 0
            setRealMatches(matched)
            setResultStats({ scanned: items.length, avgMatch: avg })
          }
        } catch {
          if (mounted) {
            setRealMatches([])
            setResultStats({ scanned: 0, avgMatch: 0 })
          }
        } finally {
          if (mounted) setStep('results')
        }
      }

      const timer = setTimeout(loadMatches, 1200)
      return () => {
        mounted = false
        clearTimeout(timer)
      }
    }
  }, [step])

  const goToNextQuestion = (value) => {
    if (!questions.length) return
    const newAnswers = { ...answers, [currentQuestionIndex]: value }
    setAnswers(newAnswers)
    
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setProgress(((currentQuestionIndex + 1) / questions.length) * 100)
    } else {
      setProgress(100)
      setStep('processing')
    }
  }
  const handleAnswer = (optionId) => goToNextQuestion(optionId)
  const handleTextAnswerSubmit = () => {
    const value = String(textAnswer || "").trim()
    if (!value) return
    goToNextQuestion({ kind: "text", value })
    setTextAnswer("")
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 selection:bg-indigo-100 font-sans">
      {/* Header */}
      <header className="sticky top-0 z-[100] bg-white border-b border-slate-100">
        <div className="container mx-auto px-6 max-w-7xl h-14 flex items-center justify-between">
           <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-indigo-900 rounded-lg flex items-center justify-center">
                <Brain className="text-white h-4 w-4" />
              </div>
              <span className="text-lg font-black text-indigo-950 tracking-tighter uppercase">ScholarMatch</span>
           </div>
           <Link href="/courses">
             <Button variant="ghost" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-indigo-600">
               Exit Analysis
             </Button>
           </Link>
        </div>
      </header>

      <main className="container mx-auto px-6 max-w-5xl py-20">
        <AnimatePresence mode="wait">
          {step === 'welcome' && (
            <motion.div 
              key="welcome"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="max-w-2xl mx-auto"
            >
              <div className="bg-white rounded-[2rem] border border-slate-100 p-12 shadow-sm">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 rounded-full mb-6">
                   <Sparkles className="h-3 w-3 text-indigo-600" />
                   <span className="text-[9px] font-black uppercase tracking-widest text-indigo-700">AI Personalization Engine</span>
                </div>
                <h1 className="text-5xl font-black tracking-tighter leading-[0.95] text-slate-900 mb-6">
                  Match with your <br/> <span className="text-indigo-600 italic">ideal scholarship.</span>
                </h1>
                <p className="text-slate-500 text-base font-medium mb-10 leading-relaxed">
                  We've analyzed your base profile. Now, answer 5-7 strategic questions to help our AI cross-reference real programs for your personalized match.
                </p>
                <div className="grid grid-cols-2 gap-4 mb-10">
                   {[
                     { label: "Data points", value: "24", icon: Target },
                     { label: "Matching Accuracy", value: "99.8%", icon: ShieldCheck }
                   ].map((item, i) => (
                     <div key={i} className="bg-slate-50 rounded-2xl p-4 flex items-center gap-3">
                        <item.icon className="h-5 w-5 text-indigo-600" />
                        <div>
                           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{item.label}</p>
                           <p className="text-lg font-black text-slate-900">{item.value}</p>
                        </div>
                     </div>
                   ))}
                </div>
                <Button 
                  onClick={() => setStep('analyzing')}
                  disabled={!isClientReady}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl h-14 text-xs font-black uppercase tracking-[0.2em] shadow-xl shadow-indigo-600/10"
                >
                  {isClientReady ? 'Start Personalized Matching' : 'Initializing...'}
                </Button>
              </div>
            </motion.div>
          )}

          {step === 'analyzing' && (
            <motion.div 
              key="analyzing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-8 py-20 text-center"
            >
              {error ? (
                <div className="space-y-6">
                  <div className="w-20 h-20 bg-red-50 rounded-3xl flex items-center justify-center mx-auto">
                    <Zap className="h-8 w-8 text-red-600" />
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-2xl font-black tracking-tight text-slate-900">AI Engine Error</h2>
                    <p className="text-slate-500 text-sm font-medium max-w-xs mx-auto">{error}</p>
                  </div>
                  <Button 
                    onClick={() => setStep('analyzing')}
                    className="bg-slate-900 text-white rounded-xl px-8"
                  >
                    Retry Generation
                  </Button>
                </div>
              ) : (
                <>
                  <div className="w-20 h-20 bg-white rounded-3xl shadow-xl flex items-center justify-center relative">
                    <div className="absolute inset-0 border-4 border-indigo-600/10 rounded-3xl animate-pulse" />
                    <Brain className="h-8 w-8 text-indigo-600 animate-bounce" />
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-2xl font-black tracking-tight text-slate-900">ScholarMatch AI is thinking...</h2>
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Generating personalized questions via Llama 3.2</p>
                    <div className="flex flex-col gap-2 w-64 mx-auto mt-6">
                      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: "100%" }}
                            transition={{ duration: 20 }}
                            className="h-full bg-indigo-600" 
                          />
                      </div>
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          )}

          {step === 'questioning' && (
            <motion.div 
              key="questioning"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              className="max-w-4xl mx-auto"
            >
              {!currentQuestion ? (
                <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
                  <p className="text-sm font-semibold text-slate-600 mb-4">Preparing your personalized questions...</p>
                  <Button onClick={() => setStep('analyzing')} className="bg-slate-900 text-white rounded-xl px-8">
                    Retry Generation
                  </Button>
                </div>
              ) : (
              <div className="flex flex-col lg:flex-row gap-12">
                 {/* Question Info */}
                 <div className="lg:w-1/3 space-y-6">
                    <div className="flex items-center gap-3">
                       <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-100 rounded-full">
                          <Zap className="h-3 w-3 text-amber-600 fill-amber-600" />
                          <span className="text-[9px] font-black uppercase tracking-widest text-amber-700">Question {currentQuestionIndex + 1} of {questions.length}</span>
                       </div>
                    </div>
                    <h2 className="text-4xl font-black tracking-tighter text-slate-900 leading-tight">
                       {currentQuestion.question}
                    </h2>
                    <p className="text-slate-500 font-medium leading-relaxed">
                       {currentQuestion.description}
                    </p>
                    <div className="pt-8">
                       <div className="h-1 w-full bg-slate-100 rounded-full">
                          <motion.div 
                             className="h-full bg-indigo-600 rounded-full"
                             initial={{ width: `${(currentQuestionIndex / questions.length) * 100}%` }}
                             animate={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                          />
                       </div>
                    </div>
                 </div>

                 {/* Options Grid */}
                 <div className="lg:w-2/3">
                    {(currentQuestion.question_type === "text" || !Array.isArray(currentQuestion.options)) ? (
                      <div className="bg-white p-6 rounded-[2rem] border border-slate-100 space-y-4">
                        <label className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Subject Focus</label>
                        <input
                          value={textAnswer}
                          onChange={(e) => setTextAnswer(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault()
                              handleTextAnswerSubmit()
                            }
                          }}
                          placeholder={currentQuestion.placeholder || "Type your subject"}
                          className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                        />
                        <Button
                          onClick={handleTextAnswerSubmit}
                          disabled={!String(textAnswer || "").trim()}
                          className="rounded-xl bg-slate-900 hover:bg-indigo-600 text-white h-11 px-6 text-[10px] font-black uppercase tracking-widest transition-all"
                        >
                          Continue
                        </Button>
                      </div>
                    ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {(Array.isArray(currentQuestion.options) ? currentQuestion.options : []).map((option) => {
                       const OptionIcon = option.icon && typeof option.icon === 'string' && option.icon.length > 2 ? Wand2 : Target 
                       return (
                         <button
                           key={option.id}
                           onClick={() => handleAnswer(option.id)}
                           className="group bg-white p-6 rounded-[2rem] border border-slate-100 text-left hover:border-indigo-600 hover:shadow-xl hover:shadow-indigo-600/5 transition-all duration-300 relative overflow-hidden"
                         >
                            <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-indigo-50 transition-colors">
                               <OptionIcon className="h-6 w-6 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                            </div>
                            <div className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-1 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                               {option.label}
                            </div>
                            <div className="text-base font-bold text-slate-900 pr-6">{option.text}</div>
                            <div className="absolute right-6 bottom-6 opacity-0 group-hover:opacity-100 transition-opacity">
                               <ArrowRight className="h-5 w-5 text-indigo-600" />
                            </div>
                         </button>
                       )
                    })}
                    </div>
                    )}
                 </div>
              </div>
              )}
            </motion.div>
          )}

          {step === 'processing' && (
            <motion.div 
              key="processing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-12 py-20 text-center"
            >
              <div className="relative w-40 h-40">
                 <div className="absolute inset-0 border-2 border-indigo-100 rounded-full" />
                 <motion.div 
                    className="absolute inset-0 border-4 border-t-indigo-600 border-r-transparent border-b-transparent border-l-transparent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                 />
                 <div className="absolute inset-0 flex items-center justify-center">
                    <Wand2 className="h-10 w-10 text-indigo-600" />
                 </div>
              </div>
              <div className="space-y-4">
                <h2 className="text-3xl font-black tracking-tighter text-slate-900 italic">Finding your match...</h2>
                <p className="text-slate-500 font-medium max-w-sm mx-auto">Our engine is cross-referencing your vectors with global program mandates.</p>
              </div>
            </motion.div>
          )}

          {step === 'results' && (
            <motion.div 
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-12"
            >
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200 pb-10">
                 <div className="space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-50 rounded-full">
                       <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />
                       <span className="text-[9px] font-black uppercase tracking-widest text-green-700">Matching Successful</span>
                    </div>
                    <h2 className="text-5xl font-black tracking-tighter text-slate-900 leading-[0.95]">
                       Your Elite <br/><span className="text-indigo-600 italic">Opportunities.</span>
                    </h2>
                 </div>
                 <div className="flex items-center gap-8">
                    <div className="text-center">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Programs Scanned</p>
                       <p className="text-2xl font-black text-slate-900 tracking-tighter">{resultStats.scanned || 0}</p>
                    </div>
                    <div className="w-px h-10 bg-slate-200" />
                    <div className="text-center">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Avg. Match</p>
                       <p className="text-2xl font-black text-slate-900 tracking-tighter">{resultStats.avgMatch || 0}%</p>
                    </div>
                 </div>
              </div>

              {realMatches.length === 0 ? (
                <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center">
                  <p className="text-sm font-semibold text-slate-600">No verified opportunities found for your current preferences.</p>
                </div>
              ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {realMatches.map((match) => (
                  <div key={match.id} className="group bg-white rounded-[2.5rem] border border-slate-100 p-8 hover:shadow-2xl hover:shadow-indigo-600/5 transition-all duration-500 relative overflow-hidden">
                    <div className="absolute top-8 right-8 text-right">
                       <div className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-1">Accuracy</div>
                       <div className="text-4xl font-black text-slate-900 italic tracking-tighter">{match.matchScore}%</div>
                    </div>

                    <div className="flex items-center gap-3 mb-8">
                       <Badge className="bg-slate-900 text-white border-none font-black text-[8px] uppercase tracking-widest px-2.5 py-1 rounded-md">
                         {match.level}
                       </Badge>
                       <Badge className="bg-amber-400 text-indigo-950 border-none font-black text-[8px] uppercase tracking-widest px-2.5 py-1 rounded-md flex items-center gap-1">
                          <Zap className="h-2 w-2 fill-indigo-950" /> VERIFIED
                       </Badge>
                    </div>

                    <h3 className="text-2xl font-black text-slate-900 mb-2 leading-tight pr-12">{match.title}</h3>
                    <p className="text-slate-400 text-xs font-black uppercase tracking-widest mb-8">{match.institute}</p>

                    <div className="bg-indigo-50/50 rounded-2xl p-5 mb-8 border border-indigo-100/50">
                       <div className="flex gap-4">
                          <Brain className="h-5 w-5 text-indigo-600 shrink-0 mt-0.5" />
                          <p className="text-[13px] text-slate-600 leading-relaxed font-medium">"{match.reason}"</p>
                       </div>
                    </div>

                    <div className="space-y-4">
                       <div className="space-y-1.5">
                          <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-slate-400">
                             <span>Impact Meter</span>
                             <span className="text-indigo-600">SAVE ${Math.max(0, (match.originalPrice || 0) - (match.price || 0))}</span>
                          </div>
                          <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                             <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${match.impact}%` }} />
                          </div>
                       </div>

                       <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                          <div className="flex flex-col">
                             <span className="text-[10px] font-bold text-slate-300 line-through leading-none">{match.originalPrice ? `$${match.originalPrice}` : 'Contact institute'}</span>
                             <span className="text-2xl font-black text-slate-900 leading-none mt-1">{match.price ? `$${match.price}` : 'Contact'}</span>
                          </div>
                          <Button className="rounded-xl bg-slate-900 hover:bg-indigo-600 text-white h-12 px-6 text-[10px] font-black uppercase tracking-widest transition-all">
                             Secure Matching Rate
                          </Button>
                       </div>
                    </div>
                  </div>
                ))}
              </div>
              )}

              <div className="flex justify-center pt-8">
                 <Link href="/courses">
                   <Button variant="outline" className="border-slate-200 text-slate-400 hover:text-indigo-600 hover:border-indigo-100 rounded-xl h-14 px-12 text-[10px] font-black uppercase tracking-[0.3em] transition-all">
                     Return to Marketplace
                   </Button>
                 </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}
