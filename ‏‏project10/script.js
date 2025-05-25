const hoursEl = document.getElementById("hours");
const minutesEl = document.getElementById("minutes");
const secondsEl = document.getElementById("seconds");
const startBtn = document.querySelector(".start-btn");
const stopBtn = document.querySelector(".stop-btn");
const resetBtn = document.querySelector(".reset-btn");
const clearLogsBtn = document.querySelector(".delete-local-storage-btn");
const logBtn = document.querySelector(".log-btn");
const showLogDiv = document.querySelector(".show-log");

let startTime = 0;
let elapsedTime = 0;
let timerId = null;
let arrayLogs = [];

hoursEl.textContent = "00";
minutesEl.textContent = "00";
secondsEl.textContent = "00";

startBtn.addEventListener("click", start);
stopBtn.addEventListener("click", stop);
resetBtn.addEventListener("click", reset);
logBtn.addEventListener("click", logLoop);
clearLogsBtn.addEventListener("click", deleteLocalStorage);

function start() {
  if (timerId) return;
  startTime = Date.now() - elapsedTime;
  timerId = setInterval(updateDisplay, 1000);
}

function updateDisplay() {
  elapsedTime = Date.now() - startTime;
  const hours = Math.floor(elapsedTime / 3600000);
  const minutes = Math.floor(elapsedTime / 60000) % 60;
  const seconds = Math.floor(elapsedTime / 1000) % 60;
  hoursEl.textContent = String(hours).padStart(2, "0");
  minutesEl.textContent = String(minutes).padStart(2, "0");
  secondsEl.textContent = String(seconds).padStart(2, "0");
}

function stop() {
  clearInterval(timerId);
  timerId = null;
}

function reset() {
  clearInterval(timerId);
  timerId = null;
  elapsedTime = 0;
  hoursEl.textContent = "00";
  minutesEl.textContent = "00";
  secondsEl.textContent = "00";
}

function logLoop() {
  showLogDiv.innerHTML = `
    <div class="mt-4 text-center">
      <textarea id="textarea" class="textarea form-control mb-2" rows="6" placeholder="don't forget to save..."></textarea>
      <button class="save-log-btn btn btn-dark me-2">Save Log</button>
      <button class="download-log-btn btn btn-dark">Download</button>
    </div>
  `;
  document.querySelector(".save-log-btn").addEventListener("click", saveLog);
  document
    .querySelector(".download-log-btn")
    .addEventListener("click", download);
}

function saveLog() {
  const text = document.getElementById("textarea").value;
  const timeStr = `${hoursEl.textContent}:${minutesEl.textContent}:${secondsEl.textContent}`;
  const date = new Date().toISOString();
  const newLog = { date, time: timeStr, text };
  arrayLogs.push(newLog);
  localStorage.setItem("logs", JSON.stringify(arrayLogs));
}

function download() {
  const textareaValue = document.getElementById("textarea").value;
  const blob = new Blob([textareaValue], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "myNotebook.doc";
  a.click();
  URL.revokeObjectURL(url);
}

function deleteLocalStorage() {
  localStorage.clear();
  arrayLogs = [];
}
