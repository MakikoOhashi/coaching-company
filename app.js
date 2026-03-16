const params = new URLSearchParams(window.location.search);

const COMMON_API_BASE_URL = params.get("apiBase") || "https://common-ai-api.makiron19831014.workers.dev";
const STUDENT_STATE_PATH = "/coaching/student-state";
const COACH_REPLY_PATH = "/coaching/coach-reply";
const CURRENT_QUESTION_PATH = "/coaching/company-question";
const SUBMIT_ANSWER_PATH = "/coaching/company-submit-answer";
const REFLECTION_REPLY_PATH = "/coaching/company-reflection-coach";
const APP_ID = params.get("appId") || "wakarumade-ios";
const GUEST_ID = params.get("guestId") || "coach-dashboard";
const COMPANY_STUDENT_KEY = params.get("studentKey") || "husband-company";

const refreshButton = document.getElementById("refreshButton");
const statusMessage = document.getElementById("statusMessage");
const stateView = document.getElementById("stateView");
const coachForm = document.getElementById("coachForm");
const coachInput = document.getElementById("coachInput");
const coachSubmit = document.getElementById("coachSubmit");
const chatMessages = document.getElementById("chatMessages");
const choiceList = document.getElementById("choiceList");
const answerButton = document.getElementById("answerButton");
const nextQuestionButton = document.getElementById("nextQuestionButton");
const answerFeedback = document.getElementById("answerFeedback");
const reflectionPanel = document.getElementById("reflectionPanel");
const reflectionThread = document.getElementById("reflectionThread");
const reflectionForm = document.getElementById("reflectionForm");
const reflectionLabel = document.getElementById("reflectionLabel");
const reflectionInput = document.getElementById("reflectionInput");
const reflectionSubmit = document.getElementById("reflectionSubmit");
const continueDiscussionButton = document.getElementById("continueDiscussionButton");
const chatHistory = [];
let currentQuestion = null;
let selectedChoice = null;
let autoAdvanceTimer = null;
let reflectionState = {
  active: false,
  coachTurn: 0,
  explanationText: "",
  mode: "mistake_review",
};

const textTargets = {
  currentSubject: document.getElementById("currentSubject"),
  currentMilestone: document.getElementById("currentMilestone"),
  riskLevel: document.getElementById("riskLevel"),
  passProbability: document.getElementById("passProbability"),
  nextActionToday: document.getElementById("nextActionToday"),
  blockProgress: document.getElementById("blockProgress"),
  blockAccuracyRate: document.getElementById("blockAccuracyRate"),
  totalAnswered: document.getElementById("totalAnswered"),
  streakCount: document.getElementById("streakCount"),
  dailyTargetCorrect: document.getElementById("dailyTargetCorrect"),
  todayRemainingToTarget: document.getElementById("todayRemainingToTarget"),
  basicRemainingQuestions: document.getElementById("basicRemainingQuestions"),
  basicEtaDays: document.getElementById("basicEtaDays"),
  coachScript: document.getElementById("coachScript"),
  sessionIntro: document.getElementById("sessionIntro"),
  questionTopic: document.getElementById("questionTopic"),
  questionIntro: document.getElementById("questionIntro"),
  questionStem: document.getElementById("questionStem"),
  coachIntervention: document.getElementById("coachIntervention"),
  sessionSummary: document.getElementById("sessionSummary"),
};

function setStatus(message, state = "idle") {
  statusMessage.textContent = message;
  statusMessage.dataset.state = state;
}

function writeText(id, value) {
  if (!textTargets[id]) return;
  textTargets[id].textContent = value;
}

function buildCoachScript(studentState, signals) {
  return [
    `Good morning. Based on your current status, your focus is ${studentState.currentSubject}.`,
    `You are currently at: ${studentState.currentMilestone}.`,
    `Your current pass probability is ${studentState.passProbability} percent, and your risk level is ${studentState.riskLevel}.`,
    `Today, I want you to do this: ${studentState.nextActionToday}`,
    `Right now you have answered ${signals.totalAnswered} questions in total and your current streak is ${signals.streakCount} days.`,
  ].join(" ");
}

function buildSessionIntro(studentState, signals) {
  return `前回の流れを踏まえると、今日は${studentState.currentSubject}を優先します。いまは ${studentState.currentMilestone} の段階なので、まずは今日の目標である ${signals.dailyTargetCorrect} 問正解を取りにいきましょう。`;
}

function buildQuestionTopic(studentState) {
  return `導入問題 / ${studentState.currentSubject}`;
}

function buildQuestionIntro(studentState) {
  return `${studentState.currentSubject}の導入問題です。前回つまずいた論点を1問だけ確認してから、今日の過去問レベル演習に入ります。`;
}

function buildCoachIntervention(studentState, signals) {
  if (signals.blockAccuracyRate < 60) {
    return `この論点はまだ少し不安定です。正誤だけで終えず、用語の意味を確認してからもう1問続けると強いです。`;
  }

  return `このままなら流れは悪くありません。1問ごとに確認しつつ、今日は${studentState.currentSubject}を最後まで崩さず進めましょう。`;
}

function buildSessionSummary(studentState, signals) {
  return `今日は${studentState.currentSubject}を中心に進めます。終了時には「どこが取れたか」「どこで止まったか」を整理して、次回の重点を決める想定です。現在の合格確率は${studentState.passProbability}%です。`;
}

function detectFocusTerm(text) {
  const candidates = ["先取特権", "区分所有権", "敷地利用権", "管理組合法人", "共益費用", "管理者"];
  return candidates.find((term) => text.includes(term)) || null;
}

function buildAnswerIntervention(question, result) {
  const combinedText = `${question?.stem || ""} ${result?.explanation || ""}`;
  const focusTerm = detectFocusTerm(combinedText);
  const looksLikeIssueSpotting =
    combinedText.includes("何に及ぶ") ||
    combinedText.includes("対象") ||
    combinedText.includes("範囲") ||
    combinedText.includes("どこまで");
  const looksLikeMisconception =
    combinedText.includes("不適切") ||
    combinedText.includes("不正確") ||
    combinedText.includes("当然に") ||
    combinedText.includes("だけ") ||
    combinedText.includes("誤り");

  if (result.isCorrect) {
    if (focusTerm) {
      return `正解です。この論点は取れています。次へ進む前に、「${focusTerm}」が何を意味するかを短く言えるかだけ確認しておきましょう。`;
    }
    return `正解です。この論点は取れています。解説を軽く確認してから次の1問へ進みましょう。`;
  }

  if (looksLikeMisconception) {
    return `ここは認識のズレを直しましょう。今回の誤りは、論点を広く取りすぎたか、特則を落とした可能性があります。まず「どこが言い過ぎだったか」を1つ言葉にしてみてください。`;
  }

  if (looksLikeIssueSpotting) {
    return `ここは論点を確認しましょう。この問題で問われているのは「何に及ぶか・どこまで認められるか」です。そこを意識して解説をもう一度見てみましょう。`;
  }

  if (focusTerm) {
    return `ここは用語理解を確認しましょう。まず「${focusTerm}」の意味を短く説明してみてください。`;
  }

  return `ここで止まりましたね。解説を確認して、同じテーマをもう1問続けると強いです。`;
}

function addChatMessage(role, text) {
  chatHistory.push({ role, text });
  if (chatHistory.length > 6) {
    chatHistory.shift();
  }
  const message = document.createElement("div");
  message.className = "chat-message";
  message.dataset.role = role;
  message.textContent = text;
  chatMessages.appendChild(message);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function clearAnswerFeedback() {
  answerFeedback.hidden = true;
  answerFeedback.textContent = "";
  answerFeedback.dataset.result = "";
}

function resetReflectionPanel() {
  if (autoAdvanceTimer) {
    window.clearTimeout(autoAdvanceTimer);
    autoAdvanceTimer = null;
  }
  reflectionState = {
    active: false,
    coachTurn: 0,
    explanationText: "",
    mode: "mistake_review",
  };
  reflectionThread.innerHTML = "";
  reflectionInput.value = "";
  reflectionInput.disabled = false;
  reflectionSubmit.disabled = false;
  continueDiscussionButton.hidden = true;
  reflectionPanel.hidden = true;
}

function appendReflectionMessage(role, text) {
  const bubble = document.createElement("div");
  bubble.className = "reflection-bubble";
  bubble.dataset.role = role;
  bubble.textContent = text;
  reflectionThread.appendChild(bubble);
}

function openReflectionPanel(initialCoachMessage, explanationText) {
  const focusTerm = detectFocusTerm(`${currentQuestion?.stem || ""} ${explanationText || ""}`);
  const isCorrectCheck = initialCoachMessage.startsWith("正解です。");
  reflectionState = {
    active: true,
    coachTurn: 1,
    explanationText,
    mode: isCorrectCheck ? "correct_check" : "mistake_review",
  };
  reflectionThread.innerHTML = "";
  appendReflectionMessage("coach", initialCoachMessage);
  reflectionInput.value = "";
  reflectionInput.disabled = false;
  reflectionSubmit.disabled = false;
  continueDiscussionButton.hidden = true;
  reflectionLabel.textContent = isCorrectCheck ? "短く説明してみてください" : "どこがずれていたかを一言で整理してください";
  reflectionInput.placeholder = isCorrectCheck
    ? `例: ${focusTerm || "先取特権"}は一定の債権を確保するために優先して回収できる権利`
    : "例: 賃借人の動産まで及ぶと広く考えすぎた";
  reflectionPanel.hidden = false;
}

function scheduleAutoAdvance() {
  if (autoAdvanceTimer) {
    window.clearTimeout(autoAdvanceTimer);
  }
  continueDiscussionButton.hidden = false;
  autoAdvanceTimer = window.setTimeout(() => {
    autoAdvanceTimer = null;
    handleNextQuestion();
  }, 5000);
}

function renderQuestion(question) {
  currentQuestion = question;
  selectedChoice = null;
  clearAnswerFeedback();
  writeText("questionTopic", `導入問題 / ${question.subject}`);
  writeText("questionIntro", "まずは前回つまずいた論点を1問だけ確認します。このあと今日の本題に入ります。");
  writeText("questionStem", question.stem);

  choiceList.innerHTML = "";
  question.choices.forEach((choiceText, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "choice-button";
    button.textContent = `${index + 1}. ${choiceText}`;
    button.addEventListener("click", () => {
      selectedChoice = index + 1;
      [...choiceList.querySelectorAll(".choice-button")].forEach((node, nodeIndex) => {
        node.dataset.selected = nodeIndex === index ? "true" : "false";
      });
    });
    choiceList.appendChild(button);
  });
}

function renderStudentState(payload) {
  const { studentState, signals } = payload;

  writeText("currentSubject", studentState.currentSubject);
  writeText("currentMilestone", studentState.currentMilestone);
  writeText("riskLevel", studentState.riskLevel);
  writeText("passProbability", `${studentState.passProbability}%`);
  writeText("nextActionToday", studentState.nextActionToday);
  writeText("blockProgress", `${signals.blockProgress}/${signals.blockTotal}`);
  writeText("blockAccuracyRate", `${signals.blockAccuracyRate}%`);
  writeText("totalAnswered", String(signals.totalAnswered));
  writeText("streakCount", `${signals.streakCount} days`);
  writeText("dailyTargetCorrect", `${signals.dailyTargetCorrect} correct`);
  writeText("todayRemainingToTarget", `${signals.todayRemainingToTarget} remaining`);
  writeText("basicRemainingQuestions", `${signals.basicRemainingQuestions} questions`);
  writeText("basicEtaDays", signals.basicEtaDays === null ? "Not enough pace yet" : `${signals.basicEtaDays} days`);
  writeText("coachScript", buildCoachScript(studentState, signals));
  writeText("sessionIntro", buildSessionIntro(studentState, signals));
  if (!currentQuestion) {
    writeText("questionTopic", buildQuestionTopic(studentState));
    writeText("questionIntro", buildQuestionIntro(studentState));
    writeText("questionStem", "設問を読み込み中です。");
  }
  writeText("coachIntervention", buildCoachIntervention(studentState, signals));
  writeText("sessionSummary", buildSessionSummary(studentState, signals));

  stateView.hidden = false;
}

async function fetchCoachReply(message) {
  const response = await fetch(`${COMMON_API_BASE_URL}${COACH_REPLY_PATH}`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-app-id": APP_ID,
      "x-guest-id": GUEST_ID,
    },
    body: JSON.stringify({ message, chatHistory }),
  });

  const payload = await response.json();
  if (!response.ok || !payload.ok) {
    throw new Error(payload.message || payload.error || "Failed to get coach reply.");
  }
  return payload;
}

async function fetchCurrentQuestion() {
  const response = await fetch(`${COMMON_API_BASE_URL}${CURRENT_QUESTION_PATH}`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-app-id": APP_ID,
      "x-guest-id": GUEST_ID,
    },
    body: JSON.stringify({ studentKey: COMPANY_STUDENT_KEY }),
  });

  const payload = await response.json();
  if (!response.ok || !payload.ok) {
    throw new Error(payload.message || payload.error || "Failed to load current question.");
  }
  return payload;
}

async function submitCurrentAnswer() {
  if (!currentQuestion || !selectedChoice) {
    throw new Error("Please choose one option before answering.");
  }

  const response = await fetch(`${COMMON_API_BASE_URL}${SUBMIT_ANSWER_PATH}`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-app-id": APP_ID,
      "x-guest-id": GUEST_ID,
    },
    body: JSON.stringify({
      studentKey: COMPANY_STUDENT_KEY,
      questionId: currentQuestion.id,
      selected: selectedChoice,
    }),
  });

  const payload = await response.json();
  if (!response.ok || !payload.ok) {
    throw new Error(payload.message || payload.error || "Failed to submit answer.");
  }
  return payload;
}

async function requestReflectionCoach(learnerReflection) {
  const response = await fetch(`${COMMON_API_BASE_URL}${REFLECTION_REPLY_PATH}`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-app-id": APP_ID,
      "x-guest-id": GUEST_ID,
    },
    body: JSON.stringify({
      questionText: currentQuestion?.stem || "",
      explanationText: reflectionState.explanationText,
      learnerReflection,
      coachTurn: reflectionState.coachTurn,
      mode: reflectionState.mode,
    }),
  });

  const payload = await response.json();
  if (!response.ok || !payload.ok) {
    throw new Error(payload.message || payload.error || "Failed to get reflection coach reply.");
  }
  return payload;
}

async function loadStudentState() {
  refreshButton.disabled = true;
  setStatus("Loading the learner state from common-ai-api...");

  try {
    const response = await fetch(`${COMMON_API_BASE_URL}${STUDENT_STATE_PATH}`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-app-id": APP_ID,
        "x-guest-id": GUEST_ID,
      },
      body: JSON.stringify({}),
    });

    const payload = await response.json();

    if (!response.ok || !payload.ok) {
      throw new Error(payload.message || payload.error || "Failed to load learner state.");
    }

    renderStudentState(payload);
    const questionPayload = await fetchCurrentQuestion();
    renderQuestion(questionPayload.question);
    setStatus(`Learner state loaded successfully. Updated at ${new Date(payload.studentState.updatedAt).toLocaleString()}.`);
  } catch (error) {
    stateView.hidden = true;
    setStatus(error instanceof Error ? error.message : "Failed to load learner state.", "error");
  } finally {
    refreshButton.disabled = false;
  }
}

async function handleAnswerSubmit() {
  answerButton.disabled = true;
  nextQuestionButton.disabled = true;
  setStatus("Checking the answer...");

  try {
    const payload = await submitCurrentAnswer();
    renderStudentState(payload);
    answerFeedback.hidden = false;
    answerFeedback.dataset.result = payload.result.isCorrect ? "correct" : "incorrect";
    answerFeedback.textContent = payload.result.isCorrect
      ? `Correct. ${payload.result.explanation}`
      : `Not quite. Correct answer: ${payload.result.correct}. ${payload.result.explanation}`;
    const interventionMessage = buildAnswerIntervention(currentQuestion, payload.result);
    writeText("coachIntervention", payload.result.isCorrect ? interventionMessage : "誤答を整理してから次に進みましょう。");
    writeText(
      "sessionSummary",
      `この1問を反映して、現在の合格確率は${payload.studentState.passProbability}%です。次も${payload.studentState.currentSubject}を続けて確認しましょう。`,
    );
    const shouldOpenReflection = !payload.result.isCorrect || interventionMessage.startsWith("正解です。");
    if (shouldOpenReflection) {
      openReflectionPanel(interventionMessage, payload.result.explanation);
    } else {
      resetReflectionPanel();
    }
    setStatus("Answer checked.");
  } catch (error) {
    answerFeedback.hidden = false;
    answerFeedback.dataset.result = "incorrect";
    answerFeedback.textContent = error instanceof Error ? error.message : "Failed to submit answer.";
    setStatus(error instanceof Error ? error.message : "Failed to submit answer.", "error");
  } finally {
    answerButton.disabled = false;
    nextQuestionButton.disabled = false;
  }
}

async function handleNextQuestion() {
  nextQuestionButton.disabled = true;
  setStatus("Loading the next question...");
  try {
    const payload = await fetchCurrentQuestion();
    resetReflectionPanel();
    renderQuestion(payload.question);
    setStatus("Next question loaded.");
  } catch (error) {
    setStatus(error instanceof Error ? error.message : "Failed to load next question.", "error");
  } finally {
    nextQuestionButton.disabled = false;
  }
}

async function handleReflectionSubmit(event) {
  event.preventDefault();
  const learnerReflection = reflectionInput.value.trim();
  if (!learnerReflection || !reflectionState.active) return;

  reflectionInput.disabled = true;
  reflectionSubmit.disabled = true;
  appendReflectionMessage("user", learnerReflection);
  setStatus("Coach is checking your reflection...");

  try {
    const payload = await requestReflectionCoach(learnerReflection);
    appendReflectionMessage("coach", payload.coachMessage);
    writeText("coachIntervention", payload.coachMessage);
    reflectionInput.value = "";

    const reachedEnd =
      reflectionState.mode === "correct_check" ||
      reflectionState.coachTurn >= 3 ||
      payload.suggestNext;
    if (reachedEnd) {
      reflectionInput.disabled = true;
      reflectionSubmit.disabled = true;
      reflectionInput.placeholder = "ここまでで次へ進めます。必要なら Next を押してください。";
      reflectionState.active = false;
      scheduleAutoAdvance();
    } else {
      reflectionState.coachTurn += 1;
      reflectionInput.disabled = false;
      reflectionSubmit.disabled = false;
      reflectionInput.focus();
    }
    setStatus("Reflection received.");
  } catch (error) {
    appendReflectionMessage("coach", error instanceof Error ? error.message : "Failed to get reflection coach reply.");
    reflectionInput.disabled = false;
    reflectionSubmit.disabled = false;
    setStatus(error instanceof Error ? error.message : "Failed to get reflection coach reply.", "error");
  }
}

async function handleCoachSubmit(event) {
  event.preventDefault();
  const message = coachInput.value.trim();
  if (!message) return;

  addChatMessage("user", message);
  coachInput.value = "";
  coachInput.disabled = true;
  coachSubmit.disabled = true;
  setStatus("Coach is preparing a response...");

  try {
    const payload = await fetchCoachReply(message);
    renderStudentState(payload);
    addChatMessage("coach", payload.coachReply);
    setStatus("Coach response received.");
  } catch (error) {
    addChatMessage("coach", error instanceof Error ? error.message : "Failed to get coach reply.");
    setStatus(error instanceof Error ? error.message : "Failed to get coach reply.", "error");
  } finally {
    coachInput.disabled = false;
    coachSubmit.disabled = false;
    coachInput.focus();
  }
}

function handleContinueDiscussion() {
  if (autoAdvanceTimer) {
    window.clearTimeout(autoAdvanceTimer);
    autoAdvanceTimer = null;
  }
  continueDiscussionButton.hidden = true;
  coachInput.focus();
  setStatus("この論点について質問を続けられます。");
}

refreshButton.addEventListener("click", loadStudentState);
coachForm.addEventListener("submit", handleCoachSubmit);
answerButton.addEventListener("click", handleAnswerSubmit);
nextQuestionButton.addEventListener("click", handleNextQuestion);
reflectionForm.addEventListener("submit", handleReflectionSubmit);
continueDiscussionButton.addEventListener("click", handleContinueDiscussion);

loadStudentState();
