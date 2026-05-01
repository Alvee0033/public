/* eslint-disable no-console */
const { chromium } = require("playwright");

const BASE_URL = process.env.CHATBOT_TEST_BASE_URL || "http://localhost:3014";

const bannedGeneric = /MIT|Stanford|Carnegie Mellon|Caltech|Harvard/i;

function mkCase(query, expectedMode) {
  return { query, expectedMode };
}

function buildCases() {
  const chatCases = [
    "hi",
    "hello there",
    "how are you",
    "what can you do",
    "thanks",
    "ok understood",
    "can you help me",
    "i need guidance",
    "who are you",
    "good morning",
    "tell me briefly what this app does",
    "i am confused",
    "can we talk",
    "what is scholarpass",
    "explain in simple words",
    "need help deciding",
    "how does this work",
    "great thank you",
    "that helps",
    "bye",
  ].map((q) => mkCase(q, "chat"));

  const subjects = [
    "computer science",
    "cs",
    "software engineering",
    "data science",
    "ai",
    "machine learning",
    "cyber security",
    "business",
    "mba",
    "medicine",
  ];
  const countries = ["usa", "uk", "canada", "australia", "germany", "netherlands"];
  const templates = [
    (s, c) => `find me ${s} programs in ${c}`,
    (s, c) => `${s} in ${c}`,
    (s, c) => `recommend ${s} masters in ${c}`,
    (s, c) => `show programs for ${s} ${c}`,
    (s, c) => `best ${s} course in ${c}`,
  ];

  const searchCases = [];
  for (const s of subjects) {
    for (const c of countries) {
      for (const t of templates) {
        searchCases.push(mkCase(t(s, c), "program_search"));
      }
    }
  }

  const noisyCases = [
    "find me cs programs in usa\\",
    "find me \"cs\" programs in usa",
    "find me cs programs in usa!!!",
    "cs progrms usa",
    "computer science admission usa",
    "show scholarship programs for ai",
    "programs for machine learning",
    "mba scholarship in uk",
    "medical programs in germany",
    "software engineering canada programs",
  ].map((q) => mkCase(q, "program_search"));

  return [...chatCases, ...searchCases, ...noisyCases];
}

async function runApiCase(tc) {
  const res = await fetch(`${BASE_URL}/api/chat-program-finder`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query: tc.query }),
  });
  const json = await res.json().catch(() => ({}));
  const answer = String(json?.answer || "");
  const mode = String(json?.mode || "");
  const programs = Array.isArray(json?.programs) ? json.programs : [];

  const assertions = {
    status_ok: res.status === 200,
    mode_ok: mode === tc.expectedMode,
    answer_present: answer.length > 0,
    no_generic_rankings: !bannedGeneric.test(answer),
    search_has_array: tc.expectedMode !== "program_search" || Array.isArray(json?.programs),
    chat_no_cards: tc.expectedMode !== "chat" || programs.length === 0,
  };

  const ok = Object.values(assertions).every(Boolean);
  return { ...tc, ok, mode, programs: programs.length, answer: answer.slice(0, 180), assertions };
}

async function runUiChecks() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1366, height: 900 } });
  const checks = [];

  await page.goto(`${BASE_URL}/`, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1200);
  const openBtn = page.locator('button:has-text("SP Connect")').first();
  if (await openBtn.count()) await openBtn.click();
  await page.waitForTimeout(1000);

  const input = page.locator('input[placeholder="Type subject, degree, university, or country..."]').first();
  checks.push({ name: "chat_input_visible", ok: (await input.count()) > 0 });
  const panel = page.locator("div.fixed").filter({ hasText: "Ask AI" }).first();

  await input.fill("hi how are you");
  await page.keyboard.press("Enter");
  await page.waitForTimeout(1800);
  const cardsAfterChat = await panel.locator('a[href^="/courses/program/"]').count();
  checks.push({ name: "chat_has_no_cards", ok: cardsAfterChat === 0, value: cardsAfterChat });

  await input.fill("computer science in usa");
  await page.keyboard.press("Enter");
  await page.waitForTimeout(2600);
  const cardsAfterSearch = await panel.locator('a[href^="/courses/program/"]').count();
  checks.push({ name: "search_renders_cards", ok: cardsAfterSearch >= 1, value: cardsAfterSearch });

  const panelText = await panel.innerText();
  checks.push({ name: "no_generic_rankings_in_ui", ok: !bannedGeneric.test(panelText) });

  await page.screenshot({ path: "/tmp/chatbot_quality_suite_ui.png", fullPage: true });
  await browser.close();

  return checks;
}

async function main() {
  const cases = buildCases();
  if (cases.length < 100) {
    throw new Error(`Expected >=100 cases, got ${cases.length}`);
  }

  const results = [];
  for (const tc of cases) {
    // Sequential by design to avoid overloading dev server and reduce flaky failures.
    // eslint-disable-next-line no-await-in-loop
    results.push(await runApiCase(tc));
  }

  const failed = results.filter((r) => !r.ok);
  const passCount = results.length - failed.length;

  const uiChecks = await runUiChecks();
  const uiFailed = uiChecks.filter((c) => !c.ok);

  console.log("QUALITY_SUITE_SUMMARY");
  console.log(JSON.stringify({
    total_api_tests: results.length,
    passed_api_tests: passCount,
    failed_api_tests: failed.length,
    total_ui_checks: uiChecks.length,
    failed_ui_checks: uiFailed.length,
    screenshot: "/tmp/chatbot_quality_suite_ui.png",
  }, null, 2));

  if (failed.length) {
    console.log("API_FAILURES");
    failed.slice(0, 30).forEach((f, i) => {
      console.log(`${i + 1}. query="${f.query}" mode=${f.mode} programs=${f.programs} assertions=${JSON.stringify(f.assertions)}`);
    });
  }
  if (uiFailed.length) {
    console.log("UI_FAILURES");
    uiFailed.forEach((f, i) => console.log(`${i + 1}. ${f.name} value=${f.value ?? ""}`));
  }

  if (failed.length || uiFailed.length) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("QUALITY_SUITE_ERROR", err);
  process.exit(1);
});
