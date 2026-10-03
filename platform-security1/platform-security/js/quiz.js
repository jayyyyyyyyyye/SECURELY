/* ==========================================================
   quiz.js — the Security Knowledge Test (pages/quiz.html)

   To change the quiz, edit QUESTIONS and LEVELS below:
   - answer = position of the correct option (0 = A, 1 = B, 2 = C, 3 = D)
   - page   = lesson page to review if the question is missed
   ========================================================== */

const QUESTIONS = [
  {
    topic: "Security Basics",
    text: "Why is your email account especially important to protect?",
    options: [
      "It stores all of your photos",
      "It can be used to reset the passwords of your other accounts",
      "It is the most expensive account you own",
      "It has the most followers",
    ],
    answer: 1,
    why: "Most accounts let you reset your password by email, so whoever controls your email can often get into the rest.",
    page: "basics.html",
  },
  {
    topic: "Security Basics",
    text: "Backups mainly help with which goal of security?",
    options: [
      "Keeping your information private",
      "Keeping your information trustworthy",
      "Keeping your information available when you need it",
      "Making your files load faster",
    ],
    answer: 2,
    why: "A backup means you can still get your files back after a loss, a failure or an attack like ransomware.",
    page: "basics.html",
  },
  {
    topic: "Passwords",
    text: "Which is the safest password practice?",
    options: [
      "Use your birthday",
      "Use the same password everywhere",
      "Use unique, strong passwords",
      "Share your password with friends",
    ],
    answer: 2,
    why: "A unique, strong password for each account means one leak can't open your other accounts.",
    page: "passwords.html",
  },
  {
    topic: "Passwords",
    text: "What does two-factor authentication (2FA) add to your account?",
    options: [
      "A faster way to log in",
      "A second password that is the same as the first",
      "A bigger storage space",
      "A second proof that it's really you, such as a code from your phone",
    ],
    answer: 3,
    why: "2FA asks for something you have (like a phone) as well as something you know (your password), so a stolen password isn't enough.",
    page: "passwords.html#two-factor",
  },
  {
    topic: "Phishing",
    text: "A message says: \"Your account will be deleted in 10 minutes! Click here to verify your password.\" What should you do?",
    options: [
      "Click quickly before the account is deleted",
      "Don't click. Open the official app or website yourself to check",
      "Reply with your password",
      "Forward it to all your friends",
    ],
    answer: 1,
    why: "Urgency and a request for your password are warning signs. Check through the official app or site, never through the link.",
    page: "phishing.html",
  },
  {
    topic: "Phishing",
    text: "Which of these is a common warning sign of a phishing message?",
    options: [
      "Urgent language and a request for your password",
      "A message you were expecting from someone you know",
      "A message with no links in it",
      "A message that arrives during the day",
    ],
    answer: 0,
    why: "Pressure to act right now and requests for passwords or codes are classic phishing tricks.",
    page: "phishing.html#practice",
  },
  {
    topic: "Devices",
    text: "Why are software updates important?",
    options: [
      "They only change how your device looks",
      "They use up storage on purpose",
      "They are needed to play music",
      "They fix security holes that attackers could use",
    ],
    answer: 3,
    why: "Updates often patch known security problems. Skipping them leaves those holes open.",
    page: "devices.html#software-updates",
  },
  {
    topic: "Devices",
    text: "Where is the safest place to download an app?",
    options: [
      "A link sent to you by a stranger",
      "A website that offers paid apps for free",
      "The official app store",
      "A pop-up ad",
    ],
    answer: 2,
    why: "Official stores check apps before they are listed. Free copies of paid apps are a common way to spread malware.",
    page: "devices.html#downloading",
  },
  {
    topic: "Network Security",
    text: "You're on public Wi-Fi at a mall. What is the wisest choice?",
    options: [
      "Check your bank account, since the Wi-Fi has a password",
      "Avoid sensitive activities like banking, or wait until you're on a trusted network",
      "Turn off your device's updates",
      "Connect to every network with a similar name until one works",
    ],
    answer: 1,
    why: "You can't be sure who runs a public network or who else is on it, so keep sensitive activity for a network you trust.",
    page: "network.html#public-wifi",
  },
  {
    topic: "Network Security",
    text: "What should you change when you set up a new home router?",
    options: [
      "The color of its lights",
      "Nothing. The default settings are always fine",
      "The default admin login and the Wi-Fi password",
      "The brand name",
    ],
    answer: 2,
    why: "Default logins are often public knowledge, so anyone who gets into your network could use them to take control of the router.",
    page: "network.html#wifi",
  },
];

// min = lowest score that earns the level (levels must be listed from lowest to highest)
const LEVELS = [
  { min: 0,  name: "Keep Learning",  message: "A good start. Read through the lessons and try again." },
  { min: 5,  name: "Security Aware", message: "You know the basics. Review the topics below and try again." },
  { min: 8,  name: "Security Smart", message: "Strong result! A little more review and you'll be there." },
  { min: 10, name: "Security Ready", message: "Perfect score! Keep your habits up to date." },
];

const LETTERS = ["A", "B", "C", "D"];

function initQuiz() {
  const root = document.querySelector("[data-quiz]");
  if (!root) return;

  let current = 0;
  let score = 0;
  let missed = [];

  function renderQuestion() {
    const q = QUESTIONS[current];
    const isLast = current === QUESTIONS.length - 1;

    root.innerHTML = `
      <div class="quiz-top"><span>Question ${current + 1} of ${QUESTIONS.length}</span><span>${q.topic}</span></div>
      <div class="progress" role="progressbar" aria-label="Quiz progress" aria-valuemin="0" aria-valuemax="${QUESTIONS.length}" aria-valuenow="${current}">
        <div class="progress-bar" style="width: ${(current / QUESTIONS.length) * 100}%"></div>
      </div>
      <h2 class="quiz-question">${q.text}</h2>
      <div class="options">
        ${q.options.map((text, i) => `
          <button class="option" type="button" data-index="${i}">
            <span class="option-letter">${LETTERS[i]}</span><span>${text}</span>
          </button>`).join("")}
      </div>
      <div class="feedback" aria-live="polite" hidden><strong></strong><p></p></div>
      <button class="btn btn-primary" type="button" data-next hidden>${isLast ? "See my score" : "Next question"} <span class="arrow" aria-hidden="true">→</span></button>`;

    const buttons = [...root.querySelectorAll(".option")];
    const feedback = root.querySelector(".feedback");
    const next = root.querySelector("[data-next]");

    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        const picked = Number(button.dataset.index);
        const isCorrect = picked === q.answer;

        if (isCorrect) score++;
        else missed.push(q);

        buttons.forEach((b) => { b.disabled = true; });
        buttons[q.answer].classList.add("correct");
        if (!isCorrect) button.classList.add("wrong");

        feedback.className = `feedback ${isCorrect ? "correct" : "wrong"}`;
        feedback.querySelector("strong").textContent = isCorrect ? "✅ Correct!" : "❌ Not quite.";
        feedback.querySelector("p").textContent = isCorrect ? q.why : `The answer is ${LETTERS[q.answer]}. ${q.why}`;
        feedback.hidden = false;
        next.hidden = false;
        next.focus();
      });
    });

    next.addEventListener("click", () => {
      current++;
      if (current < QUESTIONS.length) renderQuestion();
      else renderResults();
    });
  }

  function renderResults() {
    const level = [...LEVELS].reverse().find((l) => score >= l.min);

    const review = missed.length
      ? `<div class="review">
           <h3>Topics to review</h3>
           <ul class="list-warn">
             ${missed.map((q) => `<li><strong>${q.topic}:</strong> ${q.why} <a class="accent" href="${q.page}">Review →</a></li>`).join("")}
           </ul>
         </div>`
      : `<p class="note" style="margin-top: 24px">You answered every question correctly.</p>`;

    root.innerHTML = `
      <div class="score">
        <p class="eyebrow">Your score</p>
        <p class="score-number">${score}<span> / ${QUESTIONS.length}</span></p>
        <span class="score-level">${level.name}</span>
        <p class="lead">${level.message}</p>
      </div>
      ${review}
      <div class="btn-row score">
        <button class="btn btn-primary" type="button" data-restart>Try again</button>
        <a class="btn btn-ghost" href="basics.html">Back to the lessons</a>
      </div>`;

    root.querySelector("[data-restart]").addEventListener("click", () => {
      current = 0;
      score = 0;
      missed = [];
      renderQuestion();
    });
    root.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  renderQuestion();
}

initQuiz();
