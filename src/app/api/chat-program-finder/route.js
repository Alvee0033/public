import { NextResponse } from "next/server";

const DEFAULT_OLLAMA_MODEL = process.env.OLLAMA_MODEL || "llama3.2:3b";
const BACKEND_BASE_URL =
  process.env.BACKEND_API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4050";
const OLLAMA_CANDIDATE_URLS = [
  process.env.OLLAMA_BASE_URL,
  "http://127.0.0.1:11434",
  "http://localhost:11434",
  "http://127.0.0.1:11435",
  "http://localhost:11435",
].filter(Boolean);

function normalizeQuery(input = "") {
  return String(input || "")
    .replace(/[\\`"'[\]{}()<>]/g, " ")
    .replace(/[^\w\s:+-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizePrograms(items) {
  return (Array.isArray(items) ? items : [])
    .map((item) => ({
      id: item?.id,
      title: item?.name || "Untitled Program",
      institute: item?.institute?.canonical_name || item?.institute?.match_key || "Partner Institute",
      level: String(item?.degree_level || "Program").replace(/_/g, " "),
      department: item?.department || null,
      tuition: item?.tuition_text || "Contact institute",
      logo: item?.institute?.logo_url || "",
      status: item?.status || null,
      countryText: String(
        item?.institute?.country ||
          item?.institute?.country_name ||
          item?.institute?.location ||
          item?.country ||
          item?.country_name ||
          item?.location ||
          ""
      ).toLowerCase(),
    }))
    .filter((p) => p.id);
}

function scoreProgram(program, query) {
  const q = String(query || "").toLowerCase().trim();
  if (!q) return 0;
  const hay = `${program?.title || ""} ${program?.institute || ""} ${program?.department || ""} ${program?.level || ""}`.toLowerCase();
  if (hay.includes(q)) return 100;
  const words = q.split(/\s+/).filter(Boolean);
  if (!words.length) return 0;
  const hits = words.reduce((sum, w) => sum + (hay.includes(w) ? 1 : 0), 0);
  return Math.round((hits / words.length) * 100);
}

function detectDomain(text = "") {
  const t = String(text || "").toLowerCase();
  if (/\bcs\b|comp\s*sci|computer\s*science|software|data|ai|artificial intelligence|cyber|informatics|machine learning|coding/.test(t)) return "cs";
  if (/(medicine|medical|nursing|health|biomedical|pharmacy|clinical|public health)/.test(t)) return "medical";
  if (/(business|mba|management|finance|economics|marketing|accounting)/.test(t)) return "business";
  if (/(engineering|mechanical|electrical|civil|chemical|industrial|stem)/.test(t)) return "engineering";
  if (/(law|legal|juris|llb|llm)/.test(t)) return "law";
  if (/(arts|design|humanities|literature|history|philosophy)/.test(t)) return "arts";
  return "general";
}

function detectCountryPreference(query = "") {
  const q = normalizeQuery(query).toLowerCase();
  if (/\busa\b|\bus\b|united states|america/.test(q)) return "usa";
  if (/\buk\b|united kingdom|england|scotland|wales/.test(q)) return "uk";
  if (/\bcanada\b/.test(q)) return "canada";
  if (/\baustralia\b/.test(q)) return "australia";
  if (/\bgermany\b/.test(q)) return "germany";
  if (/\bnetherlands\b|holland/.test(q)) return "netherlands";
  return "any";
}

function matchesCountry(program, pref) {
  if (!program || pref === "any") return true;
  const t = String(program.countryText || "").toLowerCase();
  if (!t) return false;
  if (pref === "usa") return /\busa\b|\bunited states\b|\bamerica\b|\bu\.s\.\b/.test(t);
  if (pref === "uk") return /\buk\b|\bunited kingdom\b|england|scotland|wales/.test(t);
  if (pref === "canada") return /\bcanada\b/.test(t);
  if (pref === "australia") return /\baustralia\b/.test(t);
  if (pref === "germany") return /\bgermany\b/.test(t);
  if (pref === "netherlands") return /\bnetherlands\b|holland/.test(t);
  return true;
}

async function fetchProgramsWithFallback(query) {
  const q = String(query || "").trim();
  const attempts = [
    { status: "approved", limit: 60, search: q },
    { status: "published", limit: 60, search: q },
    { limit: 60, search: q },
    { status: "approved", limit: 60 },
    { status: "published", limit: 60 },
    { limit: 60 },
  ];

  for (const params of attempts) {
    try {
      const qs = new URLSearchParams({
        page: "1",
        ...Object.fromEntries(Object.entries(params).map(([k, v]) => [k, String(v)])),
      });
      const res = await fetch(`${BACKEND_BASE_URL}/api/v1/program-aggregation/program-records?${qs.toString()}`, {
        method: "GET",
        headers: { Accept: "application/json" },
        signal: AbortSignal.timeout(15000),
      });
      if (!res.ok) continue;
      const json = await res.json().catch(() => null);
      const payload = json?.data || json;
      const items = Array.isArray(payload?.items) ? payload.items : [];
      if (items.length > 0) return items;
    } catch {}
  }
  return [];
}

function shouldSearchPrograms(query = "", history = []) {
  const q = normalizeQuery(query).toLowerCase();
  if (!q.trim()) return false;
  const hasCountryHint = /\busa\b|\bus\b|united states|america|\buk\b|united kingdom|england|scotland|wales|canada|australia|germany|netherlands|europe|asia/.test(q);
  const hasStudyIntent = /(study|admission|admissions|apply|application|program|programs|course|courses|degree|degrees|masters|master|bachelor|phd|scholarship|university|college|institute)/.test(q);
  const hasSubjectHint = /\bcs\b|computer\s*science|software|data\s*science|artificial intelligence|\bai\b|machine learning|cyber|engineering|business|mba|medicine|medical|law|arts/.test(q);
  const searchSignals = [
    "program",
    "programs",
    "find program",
    "find programs",
    "suggest program",
    "suggest programs",
    "recommend program",
    "recommend programs",
    "show program",
    "show programs",
    "match program",
    "matching program",
    "scholarship",
    "course",
    "courses",
    "master",
    "bachelor",
    "phd",
    "mba",
    "university",
    "institute",
    "study in",
    "admission",
    "tuition",
  ];
  if (searchSignals.some((s) => q.includes(s))) return true;
  if (hasSubjectHint && (hasCountryHint || hasStudyIntent)) return true;
  // Follow-up continuity: only continue search mode if RECENT USER messages were search-intent.
  const recentUserText = Array.isArray(history)
    ? history
        .filter((m) => String(m?.role || "").toLowerCase() === "user")
        .slice(-4)
        .map((m) => normalizeQuery(m?.text || "").toLowerCase())
        .join(" ")
    : "";
  const recentSearchContext =
    /program|programs|course|courses|scholarship|degree|admission|study|university|college|institute|find|recommend|show/.test(recentUserText);
  const shortFollowUp = q.split(/\s+/).filter(Boolean).length <= 4;
  const greetingOnly = /^(hi|hii|hello|hey|yo|sup|good morning|good evening|thanks|thank you)$/.test(q);
  if (!greetingOnly && recentSearchContext && (hasSubjectHint || shortFollowUp)) return true;
  return false;
}

async function generateOllamaReply(query, programs) {
  const shortlist = programs.slice(0, 5).map((p, i) => ({
    rank: i + 1,
    title: p.title,
    institute: p.institute,
    level: p.level,
    department: p.department || "General",
    tuition: p.tuition,
  }));

  const systemPrompt =
    "You are ScholarPASS conversational program advisor. Be direct and practical. Return plain text only (no markdown). Use only the provided program list. Do not invent institutions or rankings.";
  const userPrompt = `User query: ${query}

Top matching real programs:
${JSON.stringify(shortlist, null, 2)}

Write a concise conversational answer:
1) Confirm intent.
2) Mention why top 1-2 options fit.
3) Ask one follow-up preference question to refine search.
Keep it under 120 words.`;

  for (const ollamaUrl of OLLAMA_CANDIDATE_URLS) {
    try {
      const response = await fetch(`${ollamaUrl}/api/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: DEFAULT_OLLAMA_MODEL,
          prompt: `${systemPrompt}\n\n${userPrompt}`,
          stream: false,
          keep_alive: "30m",
          options: { temperature: 0.35 },
        }),
        signal: AbortSignal.timeout(30000),
      });
      if (!response.ok) continue;
      const data = await response.json().catch(() => null);
      const text = String(data?.response || "").trim();
      if (text) return text;
    } catch {}
  }

  if (!programs.length) {
    return `I could not find matching programs from current records. Tell me subject + degree + country and I will refine the search.`;
  }
  const top = programs[0];
  const second = programs[1];
  return second
    ? `I found ${programs.length} matched programs. Top options are ${top.title} at ${top.institute} and ${second.title} at ${second.institute}. I displayed the matched cards below. Want me to filter by budget or country?`
    : `I found 1 matched program: ${top.title} at ${top.institute}. I displayed the matched card below. Want me to widen by country or degree level?`;
}

function buildProgramSearchReply(query, programs) {
  if (!programs.length) {
    return "No exact matches found in current records. Refine with subject + degree + country and I will search again.";
  }
  const top = programs.slice(0, 3);
  const labels = top.map((p) => `${p.title} (${p.institute})`);
  return `I found ${programs.length} matched programs for "${query}". Showing the best matches as cards: ${labels.join("; ")}.`;
}

async function generateGeneralReply(query) {
  const systemPrompt =
    "You are ScholarPASS AI assistant. Be intelligent, conversational, concise, and helpful. Do not force program search unless user asks. Avoid dictionary-style definitions unless explicitly requested. Return plain text only.";
  const userPrompt = `User message: ${query}\nRespond naturally in platform-assistant context. If user intent is unclear, ask about subject + degree + country.`;

  for (const ollamaUrl of OLLAMA_CANDIDATE_URLS) {
    try {
      const response = await fetch(`${ollamaUrl}/api/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: DEFAULT_OLLAMA_MODEL,
          prompt: `${systemPrompt}\n\n${userPrompt}`,
          stream: false,
          keep_alive: "30m",
          options: { temperature: 0.45 },
        }),
        signal: AbortSignal.timeout(30000),
      });
      if (!response.ok) continue;
      const data = await response.json().catch(() => null);
      const text = String(data?.response || "").trim();
      if (text) return text;
    } catch {}
  }
  return "Got it. I can chat normally, and when you want program recommendations, just ask me to find programs for your subject/country/degree.";
}

export async function POST(request) {
  try {
    const body = await request.json();
    const query = normalizeQuery(body?.query || "");
    const history = Array.isArray(body?.history) ? body.history : [];
    if (!query) {
      return NextResponse.json({ answer: "Tell me what program you want (subject, degree, country).", programs: [] });
    }

    const wantsSearch = shouldSearchPrograms(query, history);
    if (!wantsSearch) {
      const answer = await generateGeneralReply(query);
      return NextResponse.json({ answer, programs: [], mode: "chat" });
    }

    const rawItems = await fetchProgramsWithFallback(query);
    const normalized = normalizePrograms(rawItems);
    const queryDomain = detectDomain(query);
    const rankedPool = normalized
      .map((p) => {
        const baseScore = scoreProgram(p, query);
        const programDomain = detectDomain(`${p.title} ${p.department || ""}`);
        let adjusted = baseScore;
        if (queryDomain !== "general" && programDomain !== "general" && queryDomain !== programDomain) adjusted -= 35;
        if (queryDomain !== "general" && programDomain === queryDomain) adjusted += 12;
        return { ...p, programDomain, score: Math.max(0, Math.min(100, adjusted)) };
      })
      .filter((p) => p.score >= 35);

    const strictDomainPool =
      queryDomain !== "general"
        ? rankedPool.filter((p) => p.programDomain === queryDomain)
        : rankedPool;

    const countryPref = detectCountryPreference(query);
    const countryPool =
      countryPref !== "any"
        ? strictDomainPool.filter((p) => matchesCountry(p, countryPref))
        : strictDomainPool;

    const hasStrictDomain = strictDomainPool.length > 0;
    const hasCountryMatch = countryPool.length > 0;
    const basePool =
      countryPref === "any"
        ? (hasStrictDomain ? strictDomainPool : rankedPool)
        : hasCountryMatch
          ? countryPool
          : hasStrictDomain
            ? strictDomainPool
            : rankedPool;

    const ranked = basePool
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)
      .map(({ score, programDomain, countryText, ...rest }) => rest);

    let answer = buildProgramSearchReply(query, ranked);
    if (countryPref !== "any" && !hasCountryMatch && ranked.length > 0) {
      answer = `No exact ${countryPref.toUpperCase()} match found in current records. Showing closest subject-matched programs as cards.`;
    }
    return NextResponse.json({ answer, programs: ranked, mode: "program_search" });
  } catch (error) {
    console.error("chat-program-finder error", error);
    return NextResponse.json(
      {
        answer: "I hit a temporary issue. Please retry with subject + degree + country.",
        programs: [],
      },
      { status: 200 },
    );
  }
}
