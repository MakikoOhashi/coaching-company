const params = new URLSearchParams(window.location.search);

export const COMMON_API_BASE_URL = params.get("apiBase") || "https://common-ai-api.makiron19831014.workers.dev";
export const APP_ID = params.get("appId") || "coaching-company-web";
export const GUEST_ID = params.get("guestId") || "coach-dashboard";
export const COMPANY_STUDENT_KEY = params.get("studentKey") || "husband-company";

const STUDENT_STATE_PATH = "/coaching/student-state";
const CURRENT_QUESTION_PATH = "/coaching/company-question";
const SUBMIT_ANSWER_PATH = "/coaching/company-submit-answer";
const REFLECTION_REPLY_PATH = "/coaching/company-reflection-coach";

const STORAGE_KEY = "coaching-company-session";

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

export function mergeStore(patch) {
  writeStore({ ...readStore(), ...patch });
}

export function clearStore() {
  window.sessionStorage.removeItem(STORAGE_KEY);
}

export function getStore() {
  return readStore();
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
  mergeStore({
    studentState: payload.studentState,
    signals: payload.signals,
  });
  return payload;
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

export function buildCoachScript(studentState) {
  return `おはようございます。昨日の続きから始めましょう。今日は${studentState.currentSubject}から入ります。いまは ${studentState.currentMilestone} の段階です。まずは ${studentState.nextActionToday}`;
}

export function buildSessionIntro(studentState, signals) {
  return `前回の流れを踏まえると、今日は${studentState.currentSubject}を優先します。いまは ${studentState.currentMilestone} の段階なので、まずは今日の目標である ${signals.dailyTargetCorrect} 問正解を取りにいきましょう。`;
}

export function buildQuestionTopic(question) {
  const parts = ["導入問題", question.subject];
  if (question.subtopic) parts.push(question.subtopic);
  return parts.join(" / ");
}

export function buildQuestionIntro() {
  return "まずは前回つまずいた論点を1問だけ確認します。このあと今日の本題に入ります。";
}

export function buildInterventionLead(result) {
  if (result.isCorrect) {
    return "ここを短く言葉にしてから次へ進みましょう。";
  }
  return "ここは一度整理してから次に進みましょう。";
}

export function buildInitialReflectionPrompt(result) {
  if (result.isCorrect) {
    return "正解です。この論点は取れています。次へ進む前に、「先取特権」が何を意味するかを短く言えるかだけ確認しておきましょう。";
  }
  return "今回の誤りは、論点を広く取りすぎたか、特則を落とした可能性があります。まず「どこが言い過ぎだったか」を一言で整理してみてください。";
}

export function buildSummaryText(studentState, extraText = "") {
  const closing = `この1問を反映して、現在の合格確率は${studentState.passProbability}%です。次も${studentState.currentSubject}を続けて確認しましょう。`;
  return extraText ? `${extraText} ${closing}` : closing;
}
