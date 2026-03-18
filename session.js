const params = new URLSearchParams(window.location.search);
const SUPPORTED_LANGS = new Set(["ja", "en"]);

export const COMMON_API_BASE_URL = params.get("apiBase") || "https://common-ai-api.makiron19831014.workers.dev";
export const APP_ID = params.get("appId") || "coaching-company-web";
export const GUEST_ID = params.get("guestId") || "coach-dashboard";
export const COMPANY_STUDENT_KEY = params.get("studentKey") || "husband-company";
export const LANG = resolveLang();
export const AVAILABLE_TIME = resolveAvailableTime();

const STUDENT_STATE_PATH = "/coaching/student-state";
const CURRENT_QUESTION_PATH = "/coaching/company-question";
const SUBMIT_ANSWER_PATH = "/coaching/company-submit-answer";
const REFLECTION_REPLY_PATH = "/coaching/company-reflection-coach";
const TRANSLATE_PATH = "/coaching/translate";

const STORAGE_KEY = "coaching-company-session";
const TRANSLATION_CACHE_KEY = "coaching-company-translation-cache";

const COPY = {
  ja: {
    topTitle: "合格まで、今日やることはもう決まっています。",
    topCopy: "今日の状態に合わせて、最初の1問から進めます。",
    startButton: "始める",
    coachLabel: "担当コーチ",
    viewState: "いまの状況を見る",
    hideState: "いまの状況を閉じる",
    yes: "はい",
    currentTheme: "今日のテーマ",
    currentMilestoneLabel: "いまの到達地点",
    currentRisk: "現在のリスク",
    passChance: "合格可能性",
    nextAction: "今日やること",
    timePrompt: "今日は何分取れそうですか？",
    timeShort: "15分",
    timeNormal: "30分",
    timeLong: "60分以上",
    timeAdviceLabel: "今日の見立て",
    introTitle: "昨日つまずいた論点を、まず1問だけ確認しましょう。",
    next: "次へ",
    topicFallback: "今日の論点に入ります。",
    answer: "回答する",
    interventionTitle: "解説を確認して、短く整理します",
    currentQuestion: "今の問題",
    explainBriefly: "短く説明してみてください",
    mistakePrompt: "どこがずれていたかを一言で整理してください",
    submit: "送信",
    continueChat: "もう少し続ける",
    proceedNext: "次へ進む",
    closeSession: "Close the session",
    dayEndTitle: "今日もお疲れさまでした。",
    dayEndBody: "今日の予定分はここまでです。また明日、続きから進めましょう。",
    backTop: "トップに戻る",
    autoAdvance: (seconds) => `${seconds}秒後に次の問題へ進みます。`,
    skipAhead: "すぐ進む",
    loading: "読み込み中です...",
  },
  en: {
    topTitle: "Your plan to pass is already set for today.",
    topCopy: "The AI coaching company manages what to study today and how to move through it.",
    startButton: "Start",
    coachLabel: "Your coach",
    viewState: "See current status",
    hideState: "Hide current status",
    yes: "Yes",
    currentTheme: "Today's topic",
    currentMilestoneLabel: "Current milestone",
    currentRisk: "Current risk",
    passChance: "Pass probability",
    nextAction: "Today's action",
    timePrompt: "How much time do you have today?",
    timeShort: "15 min",
    timeNormal: "30 min",
    timeLong: "60+ min",
    timeAdviceLabel: "Coach suggestion",
    introTitle: "Let's quickly revisit the point that felt shaky last time.",
    next: "Next",
    topicFallback: "Let's move into today's topic.",
    answer: "Submit answer",
    interventionTitle: "Review the explanation and summarize it briefly.",
    currentQuestion: "Current question",
    explainBriefly: "Explain it briefly",
    mistakePrompt: "Put the misunderstanding into one short sentence",
    submit: "Send",
    continueChat: "Ask one more thing",
    proceedNext: "Go to next",
    closeSession: "Close the session",
    dayEndTitle: "Great work today.",
    dayEndBody: "You finished today's planned set. Let's continue from here tomorrow.",
    backTop: "Back to top",
    autoAdvance: (seconds) => `Moving to the next question in ${seconds} seconds.`,
    skipAhead: "Move now",
    loading: "Loading...",
  },
};

function resolveLang() {
  const fromQuery = params.get("lang");
  if (fromQuery && SUPPORTED_LANGS.has(fromQuery)) {
    window.sessionStorage.setItem("coaching-company-lang", fromQuery);
    return fromQuery;
  }
  const fromSession = window.sessionStorage.getItem("coaching-company-lang");
  if (fromSession && SUPPORTED_LANGS.has(fromSession)) {
    return fromSession;
  }
  return "ja";
}

function resolveAvailableTime() {
  const value = params.get("time");
  if (value === "short" || value === "normal" || value === "long") {
    return value;
  }
  return "normal";
}

function readStore() {
  try {
    return JSON.parse(window.sessionStorage.getItem(STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
}

function writeStore(next) {
  window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}

function readTranslationCache() {
  try {
    return JSON.parse(window.sessionStorage.getItem(TRANSLATION_CACHE_KEY) || "{}");
  } catch {
    return {};
  }
}

function writeTranslationCache(next) {
  window.sessionStorage.setItem(TRANSLATION_CACHE_KEY, JSON.stringify(next));
}

export function mergeStore(patch) {
  writeStore({ ...readStore(), ...patch });
}

export function clearStore() {
  window.sessionStorage.removeItem(STORAGE_KEY);
}

export function getStore() {
  return readStore();
}

export function t(key, ...args) {
  const entry = COPY[LANG][key];
  return typeof entry === "function" ? entry(...args) : entry;
}

export function withLang(path) {
  return withLangFor(path, LANG);
}

export function withLangFor(path, lang) {
  const url = new URL(path, window.location.href);
  url.searchParams.set("lang", lang);
  if (params.get("appId")) url.searchParams.set("appId", params.get("appId"));
  if (params.get("apiBase")) url.searchParams.set("apiBase", params.get("apiBase"));
  if (params.get("guestId")) url.searchParams.set("guestId", params.get("guestId"));
  if (params.get("studentKey")) url.searchParams.set("studentKey", params.get("studentKey"));
  return `${url.pathname}${url.search}`;
}

export function mountLanguageToggle() {
  const existing = document.getElementById("langToggle");
  if (existing) return;

  const wrapper = document.createElement("div");
  wrapper.id = "langToggle";
  wrapper.className = "lang-toggle";
  wrapper.innerHTML = `
    <a class="lang-toggle__link ${LANG === "ja" ? "is-active" : ""}" href="${withLangFor(window.location.pathname, "ja")}">JP</a>
    <a class="lang-toggle__link ${LANG === "en" ? "is-active" : ""}" href="${withLangFor(window.location.pathname, "en")}">EN</a>
  `;
  document.body.appendChild(wrapper);
}

async function postJson(path, body) {
  const response = await fetch(`${COMMON_API_BASE_URL}${path}`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-app-id": APP_ID,
      "x-guest-id": GUEST_ID,
    },
    body: JSON.stringify(body),
  });

  const payload = await response.json();
  if (!response.ok || !payload.ok) {
    throw new Error(payload.message || payload.error || "Request failed.");
  }
  return payload;
}

export async function loadStudentState() {
  const payload = await postJson(STUDENT_STATE_PATH, {});
  const dailyQuota = deriveDailyQuota(payload.studentState, payload.signals, readStore());
  mergeStore({
    studentState: payload.studentState,
    signals: payload.signals,
    dailyQuota,
  });
  return { ...payload, dailyQuota };
}

export function deriveDailyQuota(studentState, signals, store = {}) {
  const selectedTime = store.availableTime || AVAILABLE_TIME;
  const recentWrongTopic = store.currentQuestion?.subtopic || null;
  const recentFollowupTopic = store.lastResult && !store.lastResult.isCorrect ? store.currentQuestion?.subtopic || null : null;

  let sessionMode = "advance";
  if (studentState.riskLevel === "high" || signals.streakCount <= 1) {
    sessionMode = "recovery";
  } else if (recentFollowupTopic || signals.blockAccuracyRate < 60) {
    sessionMode = "stabilize";
  }

  let questionCount = 3;
  if (selectedTime === "short") {
    questionCount = 2;
  } else if (selectedTime === "normal") {
    questionCount = sessionMode === "advance" ? 3 : 2;
  } else {
    questionCount = sessionMode === "advance" ? 4 : 3;
  }

  const introQuestionTopic = recentWrongTopic || recentFollowupTopic || studentState.currentSubject;
  const targetUnderstandingGoal =
    sessionMode === "recovery"
      ? `${studentState.currentSubject}の基本論点を広げすぎずに押さえる`
      : sessionMode === "stabilize"
        ? `${studentState.currentSubject}の揺れている論点を整理して安定させる`
        : `${studentState.currentSubject}の理解を保ったまま前へ進める`;

  const reason =
    sessionMode === "recovery"
      ? "直近のリスクが高いため、まずはリズム回復を優先します。"
      : sessionMode === "stabilize"
        ? "理解がまだ揺れているため、今日は定着を優先します。"
        : "理解が比較的安定しているため、今日は前進を優先します。";

  const nextActionToday =
    sessionMode === "recovery"
      ? `${studentState.currentSubject}を導入1問＋本題1問で軽く立て直しましょう。`
      : sessionMode === "stabilize"
        ? `${studentState.currentSubject}を導入1問＋本題${Math.max(1, questionCount - 1)}問で固めましょう。`
        : `${studentState.currentSubject}を導入1問＋本題${Math.max(1, questionCount - 1)}問で前に進めましょう。`;

  return {
    sessionSubject: studentState.currentSubject,
    sessionMode,
    introQuestionTopic,
    mainQuestionTopic: studentState.currentSubject,
    questionCount,
    targetUnderstandingGoal,
    reason,
    nextActionToday,
    availableTime: selectedTime,
  };
}

export async function loadQuestion() {
  const payload = await postJson(CURRENT_QUESTION_PATH, { studentKey: COMPANY_STUDENT_KEY });
  mergeStore({ currentQuestion: payload.question });
  return payload.question;
}

export async function submitAnswer(questionId, selected) {
  const payload = await postJson(SUBMIT_ANSWER_PATH, {
    studentKey: COMPANY_STUDENT_KEY,
    questionId,
    selected,
  });

  mergeStore({
    studentState: payload.studentState,
    signals: payload.signals,
    lastResult: payload.result,
  });

  return payload;
}

export async function requestReflection({ questionText, explanationText, learnerReflection, coachTurn, mode }) {
  return postJson(REFLECTION_REPLY_PATH, {
    questionText,
    explanationText,
    learnerReflection,
    coachTurn,
    mode,
  });
}

export async function translateTexts(texts, targetLang = LANG) {
  if (targetLang !== "en") return texts;

  const normalizedTexts = texts.map((text) => (typeof text === "string" ? text : ""));
  const cache = readTranslationCache();
  const missing = [...new Set(normalizedTexts.filter((text) => text && !cache[`en:${text}`]))];

  if (missing.length > 0) {
    const payload = await postJson(TRANSLATE_PATH, {
      texts: missing,
      targetLang,
    });
    const nextCache = { ...cache };
    missing.forEach((text, index) => {
      nextCache[`en:${text}`] = payload.translations?.[index] || text;
    });
    writeTranslationCache(nextCache);
  }

  const latestCache = readTranslationCache();
  return normalizedTexts.map((text) => (text ? latestCache[`en:${text}`] || text : text));
}

export function buildCoachScript(studentState, dailyQuota) {
  const nextAction = dailyQuota?.nextActionToday || studentState.nextActionToday;
  if (LANG === "en") {
    return `Good morning. Let's continue from yesterday. We'll start with ${studentState.currentSubject} today. Right now you are at ${studentState.currentMilestone}. First, let's work on this: ${nextAction}`;
  }
  return `おはようございます。昨日の続きから始めましょう。今日は${studentState.currentSubject}から入ります。いまは ${studentState.currentMilestone} の段階です。まずは ${nextAction}`;
}

export function buildTimeAdvice(studentState, dailyQuota) {
  const count = dailyQuota?.questionCount || 2;
  if (LANG === "en") {
    return `If you can take about ${dailyQuota?.availableTime === "short" ? "15 minutes" : dailyQuota?.availableTime === "long" ? "60 minutes or more" : "30 minutes"}, ${count} questions is a good target today. Finishing this set should help your pass probability move in the right direction.`;
  }
  return `今日は${dailyQuota?.availableTime === "short" ? "15分" : dailyQuota?.availableTime === "long" ? "60分以上" : "30分"}ほど取れそうなら、${count}問前後がちょうど良さそうです。今日のセットを終えると、合格可能性の回復や前進につながります。`;
}

export function buildSessionIntro(studentState, signals, dailyQuota) {
  const sessionMode = dailyQuota?.sessionMode || "advance";
  const questionCount = dailyQuota?.questionCount || signals.dailyTargetCorrect;
  if (LANG === "en") {
    return `Based on the last session, we'll prioritize ${studentState.currentSubject} today. You are currently at ${studentState.currentMilestone}. Today's mode is ${sessionMode}, so we'll work through about ${questionCount} questions with understanding first.`;
  }
  return `前回の流れを踏まえると、今日は${studentState.currentSubject}を優先します。いまは ${studentState.currentMilestone} の段階です。今日は ${sessionMode === "recovery" ? "立て直し" : sessionMode === "stabilize" ? "定着" : "前進"} を優先して、導入を含めて ${questionCount} 問前後で進めましょう。`;
}

export function buildTopicMessage(question) {
  if (!question?.subject && !question?.subtopic) {
    return t("topicFallback");
  }

  if (question.subject && question.subtopic) {
    return LANG === "en" ? `Today's focus is ${question.subject}: ${question.subtopic}.` : `${question.subject}、${question.subtopic}です。`;
  }

  return LANG === "en" ? `Today's focus is ${question.subject || question.subtopic}.` : `${question.subject || question.subtopic}です。`;
}

export function buildQuestionTopic(question) {
  const parts = [];
  if (question.subject) parts.push(question.subject);
  if (question.subtopic) parts.push(question.subtopic);
  return parts.join(" / ");
}

export function buildReasonPrompt(selectedChoice) {
  if (selectedChoice) {
    return LANG === "en"
      ? `You chose ${selectedChoice}. Can you give your reason in one short sentence?`
      : `${selectedChoice}を選んだんですね。理由を一言で言えますか？`;
  }
  return LANG === "en" ? "Can you say why you chose that answer in one short sentence?" : "この答えにした理由を、一言で言えますか？";
}

export function buildInterventionLead(result) {
  if (result.isCorrect) {
    return "ここを短く言葉にしてから次へ進みましょう。";
  }
  return "ここは一度整理してから次に進みましょう。";
}

export function buildInitialReflectionPrompt(result) {
  if (result.isCorrect) {
    return LANG === "en"
      ? 'You have this point. Before moving on, let’s just check whether you can briefly say what "statutory lien" means.'
      : "この論点は取れています。次へ進む前に、「先取特権」が何を意味するかを短く言えるかだけ確認しておきましょう。";
  }
  return LANG === "en"
    ? "This mistake may have come from reading the scope too broadly or missing the special rule. First, put into one short sentence what felt overstated."
    : "今回の誤りは、論点を広く取りすぎたか、特則を落とした可能性があります。まず「どこが言い過ぎだったか」を一言で整理してみてください。";
}

export function buildSummaryText(studentState, extraText = "") {
  const closing =
    LANG === "en"
      ? `Your current pass probability is ${studentState.passProbability}%. Next, we'll continue with ${studentState.currentSubject}.`
      : `現在の合格確率は${studentState.passProbability}%です。次も${studentState.currentSubject}を続けて確認しましょう。`;
  if (!extraText) {
    return LANG === "en" ? `If you keep the key point from this question, that's enough for now. ${closing}` : `ここでは今回のポイントを押さえられれば十分です。${closing}`;
  }
  return `${extraText} ${closing}`;
}

export function getNextStageHref(store = getStore()) {
  const completedCount = Number(store.completedCount || 0);
  const plannedCount = Number(store.dailyQuota?.questionCount || 0);
  if (plannedCount > 0 && completedCount >= plannedCount) {
    return withLang("./day-end.html");
  }
  return withLang("./question.html");
}
