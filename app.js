const params = new URLSearchParams(window.location.search);

const COMMON_API_BASE_URL = params.get("apiBase") || "https://common-ai-api.makiron19831014.workers.dev";
const STUDENT_STATE_PATH = "/coaching/student-state";
const APP_ID = params.get("appId") || "wakarumade-ios";
const GUEST_ID = params.get("guestId") || "coach-dashboard";

const refreshButton = document.getElementById("refreshButton");
const statusMessage = document.getElementById("statusMessage");
const stateView = document.getElementById("stateView");

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

  stateView.hidden = false;
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
    setStatus(`Learner state loaded successfully. Updated at ${new Date(payload.studentState.updatedAt).toLocaleString()}.`);
  } catch (error) {
    stateView.hidden = true;
    setStatus(error instanceof Error ? error.message : "Failed to load learner state.", "error");
  } finally {
    refreshButton.disabled = false;
  }
}

refreshButton.addEventListener("click", loadStudentState);

loadStudentState();
