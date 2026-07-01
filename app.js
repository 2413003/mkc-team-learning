const lessons = [
  {
    id: "setup",
    title: "Setup",
    source: "Before players arrive",
    duration: "01:05",
    caption: "Arrive early, set up the banner, sign-in sheet, chess sets, clocks, and laptop.",
    tip: "Put the laptop close to where players enter so first-time attendees can see MK Chess information quickly.",
    steps: [
      { title: "Arrive by 4:30pm", detail: "Use the extra time to orient yourself and speak with venue staff." },
      { title: "Prepare the room", detail: "Set up the banner and sign-in sheet before players arrive." },
      { title: "Place chess sets", detail: "Put 5-8 chess set bags on tables ready for attendees." },
      { title: "Check clocks and laptop", detail: "Put out 2-4 clocks and open the MK Chess website on the laptop." }
    ]
  },
  {
    id: "greet",
    title: "Greet & Sign In",
    source: "As people arrive",
    duration: "00:55",
    caption: "Welcome each attendee, ask them to sign in, and explain the session to first-time visitors.",
    tip: "A calm greeting at the entrance helps the room settle before pairing starts.",
    steps: [
      { title: "Welcome", detail: "Greet players warmly as they enter the play area." },
      { title: "Sign in", detail: "Ask each attendee to sign in before they sit down." },
      { title: "First time?", detail: "If it is their first time, explain how the session works." },
      { title: "Move them into play", detail: "Guide them toward a suitable table and keep arrivals moving." }
    ]
  },
  {
    id: "pairing",
    title: "Pairing",
    source: "Greet & Pair",
    duration: "01:20",
    caption: "Adults with adults. Juniors with juniors. Use separate tables where possible.",
    tip: "Separate groups helps players feel comfortable and keeps sessions running smoothly.",
    steps: [
      { title: "Take a seat", detail: "Invite an attendee to sit at an appropriate table." },
      { title: "Set up the board", detail: "Ask them to set up the chess set from the bag on the table." },
      { title: "Bring next player", detail: "Bring the next player over and guide them to a suitable match." },
      { title: "Keep groups separate", detail: "Aim to pair adult players with adults and junior players with juniors on separate tables." }
    ]
  },
  {
    id: "safeguarding",
    title: "Safeguarding",
    source: "Safeguarding policies",
    duration: "01:00",
    caption: "Juniors need a parent or guardian phone number, and a guardian should remain present in the building.",
    tip: "If something feels unclear, pause and choose the option that best protects the junior and MK Chess.",
    steps: [
      { title: "Junior definition", detail: "A junior is anyone under 18 years old." },
      { title: "Parent phone number", detail: "All juniors must be signed in with a parent or guardian phone number." },
      { title: "Never alone", detail: "Juniors should never be alone with an adult except their parent or guardian." },
      { title: "Guardian present", detail: "At this venue, a parent or guardian should remain in the building throughout the session." }
    ]
  },
  {
    id: "decisions",
    title: "Decision Making",
    source: "General decision-making",
    duration: "00:50",
    caption: "Act with integrity, protect the reputation of MK Chess, and make timely decisions.",
    tip: "Fast, honest decisions can be improved next time. Waiting for a perfect answer can slow the whole session.",
    steps: [
      { title: "Consider impact", detail: "Think about attendees, the venue, and the MK Chess team." },
      { title: "Uphold MK Chess", detail: "Act in the best interest of the club and its reputation." },
      { title: "Be honest", detail: "If you do not know something, say so." },
      { title: "Act decisively", detail: "Make a reasonable decision quickly and learn from the result." }
    ]
  }
];

const state = {
  lessonIndex: 2,
  stepIndex: 0,
  isPlaying: false,
  timer: null
};

const PLAY_STEP_MS = 2600;

const lessonList = document.querySelector("#lessonList");
const lessonTitle = document.querySelector("#lessonTitle");
const lessonSource = document.querySelector("#lessonSource");
const lessonStatus = document.querySelector("#lessonStatus");
const stageMount = document.querySelector("#stageMount");
const stageCaption = document.querySelector("#stageCaption");
const checklistTitle = document.querySelector("#checklistTitle");
const checklist = document.querySelector("#checklist");
const leaderTip = document.querySelector("#leaderTip");
const playButton = document.querySelector("#playButton");
const replayButton = document.querySelector("#replayButton");

function activeLesson() {
  return lessons[state.lessonIndex];
}

function lessonIcon(id) {
  const icons = {
    setup: `<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M8 18h32M14 18v20M34 18v20M10 38h28M15 10h18v8H15z"></path><path d="M20 10V6h8v4"></path></svg>`,
    greet: `<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M18 28l-8-8a5 5 0 0 1 7-7l5 5"></path><path d="M30 28l8-8a5 5 0 0 0-7-7l-5 5"></path><path d="M18 28l7 7a5 5 0 0 0 7 0l2-2"></path><path d="M24 20l-4 4 8 8"></path></svg>`,
    pairing: `<svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="14" cy="15" r="5"></circle><circle cx="34" cy="15" r="5"></circle><path d="M7 39c1-9 4-14 7-14s6 5 7 14"></path><path d="M27 39c1-9 4-14 7-14s6 5 7 14"></path><path d="M20 31h8"></path></svg>`,
    safeguarding: `<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M24 6l16 6v9c0 10-6 17-16 21C14 38 8 31 8 21v-9l16-6Z"></path><path d="M18 24l4 4 8-9"></path></svg>`,
    decisions: `<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M24 6v36"></path><path d="M14 12h20l-5 6 5 6H14"></path><path d="M24 28H11l4 5-4 5h13"></path></svg>`
  };
  return icons[id];
}

function renderLessonList() {
  lessonList.innerHTML = lessons.map((lesson, index) => `
    <button
      class="lesson-button ${index === state.lessonIndex ? "is-active" : ""}"
      type="button"
      data-lesson-index="${index}"
      aria-current="${index === state.lessonIndex ? "true" : "false"}"
    >
      ${lessonIcon(lesson.id)}
      <span>${lesson.title}</span>
    </button>
  `).join("");
}

function renderChecklist() {
  const lesson = activeLesson();
  checklistTitle.textContent = `${lesson.title} checklist`;
  checklist.innerHTML = lesson.steps.map((step, index) => `
    <li class="${index === state.stepIndex ? "is-current" : ""}">
      <div>
        <strong>${step.title}</strong>
        <p>${step.detail}</p>
      </div>
    </li>
  `).join("");
  leaderTip.textContent = lesson.tip;
}

function roomBase(extraClass = "") {
  return `
    <svg class="lesson-stage ${extraClass} ${state.isPlaying ? "is-playing" : ""} phase-${state.stepIndex}" viewBox="0 0 960 560" role="img" aria-label="${activeLesson().title} animated training scene">
      <defs>
        <marker id="arrowHead" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto" markerUnits="strokeWidth">
          <path d="M0,0 L0,6 L9,3 z" fill="#007f78"></path>
        </marker>
        <pattern id="boardPattern" width="24" height="24" patternUnits="userSpaceOnUse">
          <rect width="24" height="24" class="board-light"></rect>
          <rect width="12" height="12" class="board-dark"></rect>
          <rect x="12" y="12" width="12" height="12" class="board-dark"></rect>
        </pattern>
      </defs>
      <rect width="960" height="560" class="room-wall"></rect>
      <path d="M0 338h960v222H0z" class="floor"></path>
      <path d="M770 106h132v166H770z" fill="#f6fbff" stroke="#b8c6c6" stroke-width="3"></path>
      <path d="M814 106v166M770 162h132M770 218h132" class="window thin-line" stroke="#b8c6c6"></path>
      <path d="M0 338h960" stroke="#cbd5d1" stroke-width="2"></path>
  `;
}

function board(x, y, scale = 1) {
  return `
    <g transform="translate(${x} ${y}) scale(${scale})" class="board-focus">
      <rect x="0" y="0" width="144" height="144" fill="url(#boardPattern)" stroke="#111" stroke-width="4"></rect>
      <g class="piece-set">
        ${[8, 26, 44, 62, 80, 98, 116, 134].map((px) => `<circle cx="${px}" cy="20" r="5" fill="#111"></circle>`).join("")}
        ${[8, 26, 44, 62, 80, 98, 116, 134].map((px) => `<circle cx="${px}" cy="124" r="5" fill="#fff" stroke="#111" stroke-width="2"></circle>`).join("")}
        <path d="M26 36h92M26 108h92" stroke="#111" stroke-width="4" stroke-linecap="round"></path>
      </g>
    </g>
  `;
}

function plasticChessBag(x, y, scale = 1) {
  return `
    <g transform="translate(${x} ${y}) scale(${scale})" class="plastic-bag">
      <path d="M22 18c4-16 62-16 68 0" class="plastic-bag-handle"></path>
      <path d="M8 18h96l-8 82H16z" class="plastic-bag-shell"></path>
      <path d="M17 34h78" class="plastic-bag-zip"></path>
      <path d="M25 47h58M22 68h66M34 86h38" class="plastic-bag-crease"></path>
      <g class="bag-pieces">
        <circle cx="31" cy="55" r="7"></circle>
        <path d="M31 62v17M22 79h18"></path>
        <circle cx="56" cy="53" r="6"></circle>
        <path d="M56 59v20M47 79h18"></path>
        <path d="M76 49h10l-4 9 8 20H72l8-20z"></path>
        <circle cx="43" cy="78" r="6"></circle>
        <path d="M43 84v9M35 93h16"></path>
      </g>
    </g>
  `;
}

function seatedPerson(x, y, options = {}) {
  const chairClass = options.gold ? "chair chair-gold" : "chair";
  const glasses = options.glasses ? `<circle cx="34" cy="20" r="7"></circle><circle cx="50" cy="20" r="7"></circle><path d="M41 20h3"></path>` : "";
  const hair = options.hair ? `<path d="M28 13c8-12 24-10 29 0"></path>` : "";
  return `
    <g transform="translate(${x} ${y})">
      <path d="M6 112l12-72h20l-8 72" class="${chairClass}"></path>
      <circle cx="42" cy="22" r="20" class="person-fill"></circle>
      ${hair}
      ${glasses}
      <path d="M42 42v54M42 59l-18 26M42 59l24 24M42 96l-18 32M42 96l31 28" class="person"></path>
    </g>
  `;
}

function standingPerson(x, y, options = {}) {
  const shirtText = options.shirt ? `<text x="0" y="82" text-anchor="middle" class="mk-text" font-size="22">MK</text><text x="0" y="100" text-anchor="middle" fill="#111" font-size="12" font-weight="760">CHESS</text>` : "";
  const childScale = options.child ? 0.82 : 1;
  const ghostClass = options.ghost ? "ghost" : "";
  const walkingClass = options.walking ? "walking-player" : "";
  return `
    <g transform="translate(${x} ${y}) scale(${childScale})" class="${ghostClass} ${walkingClass}">
      <circle cx="0" cy="0" r="29" class="person-fill"></circle>
      <circle cx="-9" cy="-3" r="3" fill="#111"></circle>
      <circle cx="10" cy="-3" r="3" fill="#111"></circle>
      <path d="M-9 12c8 6 18 6 26-1" class="person thin-line"></path>
      <path d="M-24 34h48l-8 88h-32z" class="shirt"></path>
      ${shirtText}
      <path d="M-22 48l-36 31M22 48l48-22M-9 122l-20 66M9 122l35 63" class="person ${options.leader ? "leader-arm" : ""}"></path>
    </g>
  `;
}

function callout(index, x, y, title, current = false) {
  return `
    <g class="callout callout-${index}">
      <rect x="${x}" y="${y}" width="198" height="48" rx="7" class="label-box"></rect>
      <circle cx="${x + 24}" cy="${y + 24}" r="16" class="${current ? "stage-number-current" : "stage-number"}"></circle>
      <text x="${x + 24}" y="${y + 31}" text-anchor="middle" fill="${current ? "#111" : "#fff"}" font-size="18" font-weight="860">${index}</text>
      <text x="${x + 50}" y="${y + 30}">${title}</text>
    </g>
  `;
}

function pairingStage() {
  return `
    ${roomBase("stage-pairing stage-pairing-video")}
      <path d="M0 332h482v228H0z" fill="#dff2ef" class="highlight-zone adult-zone group-focus"></path>
      <path d="M520 332h440v228H520z" fill="#fff1bf" class="highlight-zone junior-zone group-focus"></path>

      <g class="group-label adult-label-video">
        <rect x="146" y="82" width="176" height="68" class="label-teal"></rect>
        <text x="234" y="113" text-anchor="middle" fill="#fff">ADULT</text>
        <text x="234" y="139" text-anchor="middle" fill="#fff">PLAYERS</text>
      </g>
      <g class="group-label junior-label-video">
        <rect x="668" y="86" width="164" height="64" class="label-gold"></rect>
        <text x="750" y="116" text-anchor="middle">JUNIOR</text>
        <text x="750" y="141" text-anchor="middle">PLAYERS</text>
      </g>

      <g class="adult-table-video seat-focus">
        <rect x="145" y="220" width="188" height="84" rx="7" class="table-top"></rect>
        ${board(181, 233, 0.52)}
        <path d="M108 224l18 86h42l-14-86z" class="chair"></path>
        <path d="M324 224l-18 86h-42l14-86z" class="chair"></path>
        <g class="adult-seated adult-seated-first">
          ${seatedPerson(93, 184, { glasses: true })}
        </g>
        <g class="adult-seated adult-seated-next">
          ${seatedPerson(315, 184)}
        </g>
      </g>

      <g class="junior-table-video">
        <rect x="676" y="224" width="178" height="80" rx="7" class="table-top"></rect>
        ${board(713, 237, 0.48)}
        <path d="M634 228l18 80h38l-13-80z" class="chair chair-gold"></path>
        <path d="M846 228l-18 80h-38l13-80z" class="chair chair-gold"></path>
        ${seatedPerson(616, 188, { gold: true, child: true, hair: true })}
        ${seatedPerson(832, 188, { gold: true, child: true })}
      </g>

      <g class="separation-video">
        <path d="M500 96v402" class="motion-arrow separation-line" stroke="#111" stroke-dasharray="12 14"></path>
        <path d="M502 276c56-52 100-70 150-60" class="motion-arrow junior-guide-arrow" marker-end="url(#arrowHead)"></path>
        <path d="M486 276c-54-47-100-63-152-48" class="motion-arrow adult-guide-arrow" marker-end="url(#arrowHead)"></path>
      </g>

      <g class="setup-table-video board-focus">
        <path d="M96 428l214-76 300 42-260 130z" class="table-top"></path>
        <g class="setup-board-empty">
          <rect x="256" y="383" width="150" height="150" fill="#fff8e9" stroke="#111" stroke-width="4"></rect>
        </g>
        <g class="setup-board-complete">
          ${board(256, 383, 1.04)}
        </g>
        <g class="setup-bag-video">
          ${plasticChessBag(126, 408, 0.9)}
          <path d="M134 446c24 16 70 18 96 2" class="bag-mouth-open"></path>
        </g>
        <g class="loose-pieces-video">
          <circle cx="226" cy="430" r="6" fill="#111"></circle>
          <circle cx="242" cy="454" r="6" fill="#fff" stroke="#111" stroke-width="3"></circle>
          <path d="M214 474h22M225 456v18" class="line-art thin-line"></path>
          <path d="M250 424h12l-5 12 8 22h-20l8-22z" fill="#111"></path>
        </g>
        <path d="M456 414h54v96h-54z" class="chair"></path>
        <path d="M340 502h78v60h-78z" class="chair"></path>
      </g>

      <g class="leader-video">
        ${standingPerson(496, 254, { shirt: true, leader: true })}
      </g>

      <g class="adult-arrival-video">
        ${standingPerson(380, 246)}
      </g>
      <g class="next-player-video">
        ${standingPerson(628, 404)}
      </g>
      <g class="next-player-ghost">
        ${standingPerson(782, 404, { ghost: true })}
      </g>

      <path d="M438 244c-34-28-76-38-122-28" class="motion-arrow arrow-seat" marker-end="url(#arrowHead)"></path>
      <path d="M238 418c32-35 70-45 122-30" class="motion-arrow arrow-board" marker-end="url(#arrowHead)"></path>
      <path d="M590 398c-48-18-92-48-114-90" class="motion-arrow arrow-player" marker-end="url(#arrowHead)"></path>

      ${callout(1, 94, 176, "Take a seat", state.stepIndex === 0)}
      ${callout(2, 100, 382, "Set up board", state.stepIndex === 1)}
      ${callout(3, 642, 392, "Bring next", state.stepIndex === 2)}
      ${callout(4, 740, 172, "Keep separate", state.stepIndex === 3)}
    </svg>
  `;
}

function setupStage() {
  return `
    ${roomBase("stage-setup")}
      <g class="banner-wave">
        <rect x="94" y="92" width="176" height="88" fill="#007f78" stroke="#111" stroke-width="4"></rect>
        <text x="182" y="128" text-anchor="middle" fill="#fff" font-size="28" font-weight="860">MK</text>
        <text x="182" y="156" text-anchor="middle" fill="#fff" font-size="16" font-weight="760">CHESS</text>
      </g>
      <g class="sign-sheet">
        <rect x="336" y="118" width="134" height="92" fill="#fff"></rect>
        <path d="M360 150h78M360 174h58"></path>
      </g>
      <g class="clock">
        <circle cx="722" cy="401" r="38" fill="#fff"></circle>
        <path class="clock-hand" d="M722 401v-24M722 401l18 13"></path>
      </g>
      <path d="M122 402h240l80 70H70z" class="table-top"></path>
      ${board(174, 382, 0.7)}
      ${plasticChessBag(100, 372, 0.76)}
      <path d="M548 396h252v80H548z" class="table-top"></path>
      <rect x="582" y="342" width="170" height="95" fill="#e9f4f2" stroke="#111" stroke-width="4"></rect>
      <text x="667" y="386" text-anchor="middle" fill="#007f78" font-size="24" font-weight="860">mkchess.co.uk</text>
      ${standingPerson(472, 310, { shirt: true, leader: true })}
      ${callout(1, 80, 218, "Arrive early", state.stepIndex === 0)}
      ${callout(2, 298, 238, "Room ready", state.stepIndex === 1)}
      ${callout(3, 94, 474, "Chess sets", state.stepIndex === 2)}
      ${callout(4, 654, 294, "Clocks + laptop", state.stepIndex === 3)}
    </svg>
  `;
}

function greetStage() {
  return `
    ${roomBase("stage-greet")}
      <path d="M116 112h190v300H116z" fill="#f6fbff" stroke="#111" stroke-width="4"></path>
      <path d="M282 260h12" class="line-art"></path>
      <path d="M348 426h220v76H348z" class="table-top"></path>
      <rect x="390" y="354" width="136" height="92" fill="#fff" stroke="#111" stroke-width="4"></rect>
      <path d="M418 388h72M418 414h54" class="sign-sheet"></path>
      <path d="M456 420l44 20" class="sign-pen line-art"></path>
      ${standingPerson(438, 276, { shirt: true, leader: true })}
      ${standingPerson(228, 282)}
      ${standingPerson(668, 300, { child: true })}
      <path d="M498 256c36-35 86-47 144-35" class="motion-arrow arrow-player" marker-end="url(#arrowHead)"></path>
      ${callout(1, 98, 76, "Welcome", state.stepIndex === 0)}
      ${callout(2, 344, 302, "Sign in", state.stepIndex === 1)}
      ${callout(3, 584, 158, "First time?", state.stepIndex === 2)}
      ${callout(4, 634, 420, "Move to play", state.stepIndex === 3)}
    </svg>
  `;
}

function safeguardingStage() {
  return `
    ${roomBase("stage-safeguarding")}
      <path class="policy-shield" d="M476 102l162 58v96c0 112-61 183-162 222-101-39-162-110-162-222v-96l162-58Z" fill="#eef8f6" stroke="#111" stroke-width="5"></path>
      <path d="M400 286l50 50 112-124" stroke="#007f78" stroke-width="16" fill="none" stroke-linecap="round" stroke-linejoin="round"></path>
      <g class="seat-focus">
        ${standingPerson(236, 332, { child: true })}
        ${standingPerson(136, 302)}
        <path d="M192 330h72" class="line-art"></path>
      </g>
      <g>
        <rect x="676" y="292" width="164" height="116" fill="#fff" stroke="#111" stroke-width="4"></rect>
        <path d="M706 334h86M706 364h104"></path>
        <text x="758" y="448" text-anchor="middle" fill="#007f78" font-size="18" font-weight="820">Phone number</text>
      </g>
      ${callout(1, 78, 106, "Under 18", state.stepIndex === 0)}
      ${callout(2, 658, 210, "Phone number", state.stepIndex === 1)}
      ${callout(3, 94, 410, "Never alone", state.stepIndex === 2)}
      ${callout(4, 642, 466, "Guardian present", state.stepIndex === 3)}
    </svg>
  `;
}

function decisionStage() {
  return `
    ${roomBase("stage-decisions")}
      <g transform="translate(178 146)">
        <rect width="212" height="260" fill="#eef8f6" stroke="#111" stroke-width="4"></rect>
        <text x="106" y="54" text-anchor="middle" fill="#007f78" font-size="22" font-weight="860">ATTENDEES</text>
        <text x="106" y="116" text-anchor="middle" font-size="20" font-weight="760">VENUE</text>
        <text x="106" y="180" text-anchor="middle" font-size="20" font-weight="760">MK CHESS</text>
      </g>
      <g transform="translate(588 146)">
        <rect width="212" height="260" fill="#fff8df" stroke="#111" stroke-width="4"></rect>
        <text x="106" y="70" text-anchor="middle" font-size="21" font-weight="860">FAST</text>
        <text x="106" y="128" text-anchor="middle" font-size="21" font-weight="860">HONEST</text>
        <text x="106" y="186" text-anchor="middle" font-size="21" font-weight="860">LEARN</text>
      </g>
      ${standingPerson(486, 332, { shirt: true, leader: true })}
      <path class="motion-arrow decision-arrow arrow-player" d="M398 268h154" marker-end="url(#arrowHead)"></path>
      ${callout(1, 106, 430, "Impact", state.stepIndex === 0)}
      ${callout(2, 188, 84, "Reputation", state.stepIndex === 1)}
      ${callout(3, 616, 84, "Be honest", state.stepIndex === 2)}
      ${callout(4, 654, 430, "Decide fast", state.stepIndex === 3)}
    </svg>
  `;
}

function renderStage() {
  const lesson = activeLesson();
  const renderers = {
    setup: setupStage,
    greet: greetStage,
    pairing: pairingStage,
    safeguarding: safeguardingStage,
    decisions: decisionStage
  };
  stageMount.innerHTML = renderers[lesson.id]();
  stageCaption.textContent = lesson.id === "pairing" ? lesson.steps[state.stepIndex].detail : lesson.caption;
}

function render() {
  const lesson = activeLesson();
  lessonTitle.textContent = lesson.title;
  lessonSource.textContent = lesson.source;
  lessonStatus.textContent = `Step ${state.stepIndex + 1} of ${lesson.steps.length}`;
  playButton.disabled = state.isPlaying;
  renderLessonList();
  renderChecklist();
  renderStage();
}

function stopPlayback() {
  state.isPlaying = false;
  if (state.timer) {
    window.clearInterval(state.timer);
    state.timer = null;
  }
}

function play() {
  stopPlayback();
  state.isPlaying = true;
  render();
  state.timer = window.setInterval(() => {
    const lesson = activeLesson();
    if (state.stepIndex >= lesson.steps.length - 1) {
      stopPlayback();
      render();
      return;
    }
    state.stepIndex += 1;
    render();
  }, PLAY_STEP_MS);
}

function replay() {
  stopPlayback();
  state.stepIndex = 0;
  render();
  window.setTimeout(play, 80);
}

lessonList.addEventListener("click", (event) => {
  const button = event.target.closest("[data-lesson-index]");
  if (!button) return;
  stopPlayback();
  state.lessonIndex = Number(button.dataset.lessonIndex);
  state.stepIndex = 0;
  render();
});

playButton.addEventListener("click", play);
replayButton.addEventListener("click", replay);

document.querySelector('[data-action="focus-lessons"]').addEventListener("click", () => {
  document.querySelector(".lesson-rail").scrollIntoView({ behavior: "smooth", block: "start" });
});

document.querySelector('[data-action="restart"]').addEventListener("click", replay);

render();
