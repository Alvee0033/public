import { NextResponse } from "next/server";

const DEFAULT_OLLAMA_MODEL = process.env.OLLAMA_MODEL || "llama3.2:3b";
const OLLAMA_CANDIDATE_URLS = [
  process.env.OLLAMA_BASE_URL,
  "http://127.0.0.1:11434",
  "http://localhost:11434",
  "http://127.0.0.1:11435",
  "http://localhost:11435",
].filter(Boolean);

function buildFallbackQuestions(profile) {
  const level = profile?.preferred_course_level || "Undergraduate";
  const subjects = profile?.preferred_subject_areas_text || "Technology, Business, Arts";
  const goals = profile?.preferred_institute_types_text || "Top global universities";
  return [
    {
      id: 1,
      question_type: "text",
      question: "Which subject area do you want to focus on most?",
      description: `Current profile subjects: ${subjects}. Pick your primary focus for precise matching.`,
      placeholder: "Type your subject (e.g., Computer Science, Public Health, Finance)",
    },
    {
      id: 2,
      question: "Which scholarship destination is your first priority?",
      description: `We detected level: ${level}. Choose your target geography.`,
      options: [
        { id: "a", text: "United States / Canada", label: "North America" },
        { id: "b", text: "United Kingdom / Europe", label: "Europe" },
        { id: "c", text: "Asia-Pacific", label: "APAC" },
        { id: "d", text: "Flexible / best funded option", label: "Flexible" },
      ],
    },
    {
      id: 3,
      question: "What funding structure helps you most right now?",
      description: `Your subject interests include: ${subjects}.`,
      options: [
        { id: "a", text: "100% tuition waiver", label: "Full Tuition" },
        { id: "b", text: "Partial tuition + monthly stipend", label: "Hybrid Funding" },
        { id: "c", text: "Research/assistantship based support", label: "Assistantship" },
        { id: "d", text: "Need-based grants + emergency fund", label: "Need-Based" },
      ],
    },
    {
      id: 4,
      question: "Which institute profile fits your long-term goal?",
      description: `Your institute preference: ${goals}.`,
      options: [
        { id: "a", text: "Top-ranked research universities", label: "Research Focus" },
        { id: "b", text: "Industry-connected practical programs", label: "Industry Focus" },
        { id: "c", text: "Affordable universities with strong ROI", label: "Value Focus" },
        { id: "d", text: "Flexible online/hybrid global programs", label: "Flexible Study" },
      ],
    },
    {
      id: 5,
      question: "What timeline are you targeting for enrollment?",
      description: "This helps us prioritize immediate-intake and deadline-friendly options.",
      options: [
        { id: "a", text: "Within 3 months", label: "Immediate" },
        { id: "b", text: "Within 6 months", label: "Near Term" },
        { id: "c", text: "Within 12 months", label: "Planned" },
        { id: "d", text: "Flexible timeline", label: "Flexible" },
      ],
    },
    {
      id: 6,
      question: "Which delivery format suits your current lifestyle?",
      description: "We can prioritize programs by format fit.",
      options: [
        { id: "a", text: "On-campus immersive", label: "On-Campus" },
        { id: "b", text: "Hybrid (online + campus)", label: "Hybrid" },
        { id: "c", text: "Fully online", label: "Online" },
        { id: "d", text: "Any format", label: "Flexible" },
      ],
    },
    {
      id: 7,
      question: "Which post-study outcome matters most?",
      description: "We use this to rank outcomes-focused programs.",
      options: [
        { id: "a", text: "High employability and placement", label: "Employment" },
        { id: "b", text: "Research publication opportunities", label: "Research" },
        { id: "c", text: "Startup/entrepreneurship support", label: "Entrepreneurship" },
        { id: "d", text: "Global mobility and visa pathways", label: "Global Mobility" },
      ],
    },
  ];
}

function getSubjectQuestion(profile) {
  const subjects = profile?.preferred_subject_areas_text || "Technology, Business, Arts";
  return {
    id: 1,
    question_type: "text",
    question: "Which subject area do you want to focus on most?",
    description: `Current profile subjects: ${subjects}. Pick your primary focus for precise matching.`,
    placeholder: "Type your subject (e.g., Computer Science, Public Health, Finance)",
  };
}

function extractJsonArray(text) {
  if (typeof text !== "string") return null;
  const cleaned = text.replace(/```json/gi, "").replace(/```/g, "").trim();
  const start = cleaned.indexOf("[");
  const end = cleaned.lastIndexOf("]");
  if (start === -1 || end === -1 || end < start) return null;
  try {
    return JSON.parse(cleaned.slice(start, end + 1));
  } catch {
    return null;
  }
}

function normalizeQuestions(items) {
  if (!Array.isArray(items)) return [];
  return items.slice(0, 7).map((item, index) => {
    const fallbackOptions = [
      { id: "a", text: "Option A", label: "Option A" },
      { id: "b", text: "Option B", label: "Option B" },
      { id: "c", text: "Option C", label: "Option C" },
      { id: "d", text: "Option D", label: "Option D" },
    ];
    const options = Array.isArray(item?.options) ? item.options : fallbackOptions;
    const q = String(item?.question || "").trim();
    const d = String(item?.description || "").trim();
    const questionType = String(item?.question_type || item?.type || "").toLowerCase() === "text" ? "text" : "multiple_choice";
    if (questionType === "text") {
      return {
        id: index + 1,
        question_type: "text",
        question: q || `Question ${index + 1}`,
        description: d || "Provide your answer.",
        placeholder: String(item?.placeholder || "Type your answer"),
      };
    }
    return {
      id: index + 1,
      question_type: "multiple_choice",
      question: q || `Question ${index + 1}`,
      description: d || "Select the best option for you.",
      options: options.slice(0, 4).map((opt, i) => ({
        id: String(opt?.id || ["a", "b", "c", "d"][i] || `o${i + 1}`),
        text: String(opt?.text || `Option ${i + 1}`),
        label: String(opt?.label || opt?.text || `Option ${i + 1}`),
      })),
    };
  });
}

function hasMeaningfulQuestions(questions) {
  if (!Array.isArray(questions) || questions.length < 5) return false;
  const hasGoodOptions = questions
    .filter((q) => q?.question_type !== "text")
    .every((q) =>
      Array.isArray(q?.options) &&
      q.options.length >= 2 &&
      q.options.some((opt) => !/^option\s+[a-d1-4]$/i.test(String(opt?.text || "").trim())),
    );
  if (!hasGoodOptions) return false;
  return questions.some((q) => {
    const text = String(q?.question || "").toLowerCase();
    return text && !/^question\s+\d+$/.test(text);
  });
}

function ensureSubjectQuestion(questions, profile) {
  if (!Array.isArray(questions)) return [getSubjectQuestion(profile)];
  const hasSubjectQuestion = questions.some((q) => {
    const text = String(q?.question || "").toLowerCase();
    return text.includes("subject") || text.includes("field of study") || text.includes("discipline");
  });
  const base = hasSubjectQuestion ? questions : [getSubjectQuestion(profile), ...questions];
  const withSubjectFirst = [...base];
  const subjectIndex = withSubjectFirst.findIndex((q) => {
    const text = String(q?.question || "").toLowerCase();
    return text.includes("subject") || text.includes("field of study") || text.includes("discipline");
  });
  if (subjectIndex > 0) {
    const [subjectQ] = withSubjectFirst.splice(subjectIndex, 1);
    withSubjectFirst.unshift({ ...subjectQ, question_type: "text", placeholder: subjectQ?.placeholder || "Type your subject focus" });
  } else if (subjectIndex === 0) {
    withSubjectFirst[0] = { ...withSubjectFirst[0], question_type: "text", placeholder: withSubjectFirst[0]?.placeholder || "Type your subject focus" };
  }
  return withSubjectFirst.slice(0, 7).map((q, index) => ({ ...q, id: index + 1 }));
}

export async function POST(request) {
  try {
    const { profile } = await request.json();

    const systemPrompt =
      "You are a professional academic advisor AI. Return ONLY JSON containing 5 to 7 items. Shape per item: either {id:number,question_type:'text',question:string,description:string,placeholder:string} OR {id:number,question_type:'multiple_choice',question:string,description:string,options:[{id:'a'|'b'|'c'|'d',text:string,label:string}]}. The FIRST question MUST be question_type='text' asking student's primary subject/field of study. Never use generic options like 'Option A'.";
    
    const userPrompt = profile?.is_guest 
      ? `The user is a Guest. Generate 5 to 7 foundational discovery questions to identify their academic interests and scholarship eligibility (e.g. location, GPA, field, timeline, budget). First question must be subject/field selection.`
      : `Generate 5 to 7 highly personalized multiple-choice questions for this student.
      
      Student Profile Context:
      - Course Level: ${profile?.preferred_course_level || 'General/Undergraduate'}
      - Subjects: ${profile?.preferred_subject_areas_text || 'Technology and Arts'}
      - Goals: ${profile?.preferred_institute_types_text || 'Premium Institutions'}
      First question must be subject/field selection.`;

    let lastError = null;

    for (const ollamaUrl of OLLAMA_CANDIDATE_URLS) {
      try {
        const response = await fetch(`${ollamaUrl}/api/generate`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            model: DEFAULT_OLLAMA_MODEL,
            prompt: `${systemPrompt}\n\n${userPrompt}`,
            stream: false,
            format: "json",
            keep_alive: "30m",
            options: { temperature: 0.3 },
          }),
          signal: AbortSignal.timeout(30000),
        });

        if (!response.ok) {
          const errorText = await response.text();
          lastError = new Error(
            `Ollama ${ollamaUrl} error: ${response.status} - ${errorText}`,
          );
          continue;
        }

        const data = await response.json();
        const raw = data?.response;
        const parsed =
          extractJsonArray(raw) ||
          (Array.isArray(raw) ? raw : null) ||
          (Array.isArray(data?.questions) ? data.questions : null) ||
          (Array.isArray(data?.response?.questions) ? data.response.questions : null);
        const questions = ensureSubjectQuestion(normalizeQuestions(parsed), profile);

        if (hasMeaningfulQuestions(questions)) {
          return NextResponse.json(questions);
        }
        return NextResponse.json(buildFallbackQuestions(profile));
      } catch (err) {
        lastError = err;
      }
    }

    // Always return usable personalized questions even if Ollama is unavailable.
    return NextResponse.json(buildFallbackQuestions(profile));
  } catch (error) {
    console.error("Local AI Error:", error);
    return NextResponse.json(buildFallbackQuestions({}));
  }
}
