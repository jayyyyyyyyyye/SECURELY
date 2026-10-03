/* ==========================================================
   interactions.js — small learning interactions.
   Each one only starts if its markup exists on the page, so this
   file can be loaded on any page.

   1. Practice cards  <div class="msg-card" data-practice="phishing|share"></div>
   2. Habit checklist <div data-checklist>…</div>
   ========================================================== */

/* ---------- 1. Practice cards ---------- */

// Each example: { context?, from, subject, body, link?, answer, why }
// `answer` must match one of the card's choice values. All domains use .example, so none are real.

const PHISH_EXAMPLES = [
  {
    from: "Account Security <no-reply@account-alerts.example>",
    subject: "URGENT! Your account will be suspended today.",
    body: "We found a problem with your account. Verify your password immediately or it will be suspended.",
    link: "verify-account-example.com",
    answer: "suspicious",
    why: "Urgent threats and a request for your password are warning signs. Real services don't ask for your password through a link.",
  },
  {
    context: "You're in a group chat with your classmates and a friend posts this.",
    from: "Mika (Group Chat)",
    subject: "Meeting tomorrow",
    body: "Reminder: group meeting tomorrow at 3 PM in the library. Bring your notes!",
    answer: "safe",
    why: "It comes from someone you know, there's no pressure, no link, and no request for personal information.",
  },
  {
    from: "Rewards Team <winner@prize-center.example>",
    subject: "Congratulations! You won a brand-new phone",
    body: "Claim your prize today! Just pay a small delivery fee of ₱99 to confirm your winning.",
    link: "claim-your-prize.example",
    answer: "suspicious",
    why: "You can't win a contest you never entered. Asking you to pay a fee to receive a prize is a common scam.",
  },
  {
    context: "You just tapped 'Forgot password' in an app you use.",
    from: "Support <no-reply@your-app.example>",
    subject: "Your password reset code",
    body: "Use code 482913 to reset your password. If you didn't ask for this, you can ignore this message.",
    answer: "safe",
    why: "You asked for it a moment ago, and it doesn't ask for your current password or send you to a strange link.",
  },
  {
    from: "Bank Alerts <help@banksecure-alerts.example>",
    subject: "Unusual login detected",
    body: "Open the attached file and sign in to secure your account.",
    link: "attachment: security_update.exe",
    answer: "suspicious",
    why: "Unexpected attachments, especially programs like .exe files, can install malware. Contact your bank through its official app or website instead.",
  },
  {
    from: "Your friend (new message)",
    subject: "omg is this you? 😱",
    body: "I can't believe someone posted this video of you!!",
    link: "bit-short.example/xYz12",
    answer: "suspicious",
    why: "A hijacked account can message you in a friend's name. A shocking message with a mystery link is a warning sign, so ask your friend through another app first.",
  },
];

const SHARE_EXAMPLES = [
  {
    context: "Your profile is public.",
    from: "Your post",
    subject: "Photo of your new school ID",
    body: "Caption: \"Officially a student! 🎓\"",
    link: "The ID shows your full name, photo and ID number",
    answer: "think",
    why: "An ID gives strangers enough details to impersonate you or trick your school. Post a photo of something else, or cover the details first.",
  },
  {
    context: "You're posting after you left the café, and your friends are fine with being tagged.",
    from: "Your post",
    subject: "Group photo at the café",
    body: "Caption: \"Great afternoon with the squad!\"",
    answer: "post",
    why: "No live location, no personal documents, and everyone agreed. Still check who can see your posts in your privacy settings.",
  },
  {
    context: "Your profile is public.",
    from: "Your post",
    subject: "We're off to the province for two weeks!",
    body: "Caption: \"House is empty until the 20th 🏠✈️\"",
    answer: "think",
    why: "This tells everyone, including strangers, that your home is empty. Share trip photos after you're back, or only with close friends.",
  },
  {
    from: "Your post",
    subject: "Photo of your boarding pass",
    body: "Caption: \"Can't wait for this trip! ✈️\"",
    link: "The barcode and booking code are visible",
    answer: "think",
    why: "Barcodes and booking codes can reveal personal details and let someone change your booking. Crop them out or post a photo of the view instead.",
  },
  {
    from: "Your post",
    subject: "Photo of your cat asleep on the sofa",
    body: "Caption: \"Monday mood 😴\"",
    answer: "post",
    why: "No personal details here. Just glance at the background to be sure no mail, address or documents are visible.",
  },
  {
    from: "Your post",
    subject: "Screenshot of your grades",
    body: "Caption: \"So proud of myself!\"",
    link: "Your name and student number are visible",
    answer: "think",
    why: "Your student number and full name can help someone target your school accounts. Crop them out, or share the good news without the screenshot.",
  },
];

const PRACTICE_SETS = {
  phishing: {
    examples: PHISH_EXAMPLES,
    icon: "📧",
    label: "Practice message",
    question: "Is this message safe?",
    choices: [
      { value: "safe", label: "Safe" },
      { value: "suspicious", label: "Suspicious" },
    ],
  },
  share: {
    examples: SHARE_EXAMPLES,
    icon: "📱",
    label: "Practice post",
    question: "Should you post this?",
    choices: [
      { value: "post", label: "Post it" },
      { value: "think", label: "Think twice" },
    ],
  },
};

function createPracticeCard(card, config) {
  card.innerHTML = `
    <div class="msg-meta"><span data-field="counter"></span><span>${config.label}</span></div>
    <p class="msg-context" data-field="context" hidden></p>
    <div class="msg-head">
      <span class="icon-tile" aria-hidden="true">${config.icon}</span>
      <div>
        <p class="msg-from" data-field="from"></p>
        <p class="msg-subject" data-field="subject"></p>
      </div>
    </div>
    <p class="msg-body" data-field="body"></p>
    <span class="msg-link" data-field="link" hidden></span>

    <p class="msg-question">${config.question}</p>
    <div class="answer-row">
      ${config.choices.map((c) => `<button class="btn btn-ghost" type="button" data-answer="${c.value}">${c.label}</button>`).join("")}
    </div>

    <div class="feedback" aria-live="polite" hidden>
      <strong data-field="verdict"></strong>
      <p data-field="why"></p>
    </div>
    <button class="btn btn-primary" type="button" data-next hidden>Try More Examples <span class="arrow" aria-hidden="true">→</span></button>`;

  const field = (name) => card.querySelector(`[data-field="${name}"]`);
  const answerButtons = card.querySelectorAll("[data-answer]");
  const feedback = card.querySelector(".feedback");
  const nextButton = card.querySelector("[data-next]");
  let index = 0;

  function showExample() {
    const example = config.examples[index];

    ["context", "from", "subject", "body", "link"].forEach((name) => {
      field(name).textContent = example[name] || "";
      field(name).hidden = !example[name];
    });
    field("counter").textContent = `Example ${index + 1} of ${config.examples.length}`;

    answerButtons.forEach((button) => { button.disabled = false; });
    feedback.hidden = true;
    nextButton.hidden = true;
  }

  function answer(choice) {
    const example = config.examples[index];
    const isCorrect = choice === example.answer;

    feedback.className = `feedback ${isCorrect ? "correct" : "wrong"}`;
    field("verdict").textContent = isCorrect ? "✅ Correct!" : "⚠️ Not quite.";
    field("why").textContent = example.why;

    answerButtons.forEach((button) => { button.disabled = true; });
    feedback.hidden = false;
    nextButton.hidden = false;
  }

  answerButtons.forEach((button) => {
    button.addEventListener("click", () => answer(button.dataset.answer));
  });
  nextButton.addEventListener("click", () => {
    index = (index + 1) % config.examples.length;
    showExample();
  });

  showExample();
}

function initPracticeCards() {
  document.querySelectorAll("[data-practice]").forEach((card) => {
    const config = PRACTICE_SETS[card.dataset.practice];
    if (config) createPracticeCard(card, config);
  });
}

/* ---------- 2. "How secure are your habits?" ---------- */

// upTo = highest share of ticked habits (0–1) that gets this message
const CHECKLIST_MESSAGES = [
  { upTo: 0,    text: "Tick the habits you already follow. Every one counts." },
  { upTo: 0.43, text: "Good start. Pick one habit to add this week." },
  { upTo: 0.86, text: "You're building good security habits." },
  { upTo: 1,    text: "Great habits! Keep them up and review them now and then." },
];

function setupChecklist(card) {
  const boxes = [...card.querySelectorAll('input[type="checkbox"]')];
  const count = card.querySelector("[data-count]");
  const bar = card.querySelector("[data-bar]");
  const message = card.querySelector("[data-message]");
  const progress = bar.parentElement;

  progress.setAttribute("aria-valuemax", boxes.length);

  function update() {
    const done = boxes.filter((box) => box.checked).length;
    const share = done / boxes.length;

    count.textContent = `${done} / ${boxes.length} completed`;
    bar.style.width = `${share * 100}%`;
    progress.setAttribute("aria-valuenow", done);
    message.textContent = CHECKLIST_MESSAGES.find((m) => share <= m.upTo).text;
  }

  boxes.forEach((box) => box.addEventListener("change", update));
  update();
}

initPracticeCards();
document.querySelectorAll("[data-checklist]").forEach(setupChecklist);
