/**
 * AI Business Development Audit — Intake Form
 * Collects contact + business intake; submits to backend (Airtable + Qwen AI).
 * Set window.AUDIT_API_BASE (e.g. 'http://localhost:3001') if different from default.
 */
(function () {
  const API_BASE = (typeof window !== 'undefined' && window.AUDIT_API_BASE !== undefined)
    ? window.AUDIT_API_BASE
    : (typeof window !== 'undefined' && window.location && window.location.hostname === 'localhost')
      ? 'http://localhost:3001'
      : '';

  const questions = [
    { id: "client_name", section: "Contact", question: "Your full name", hint: "Name of the primary contact", type: "text" },
    { id: "client_email", section: "Contact", question: "Email address", hint: "We'll use this for the audit report and follow-up", type: "text" },
    { id: "client_phone", section: "Contact", question: "Phone number", hint: "Optional but helpful for scheduling the review call", type: "text", optional: true },
    { id: "business_name", section: "Contact", question: "Business or company name", hint: "Official name of the business", type: "text" },
    { id: "biz_type", section: "Business Overview", question: "What type of business do you run?", hint: "e.g. Real estate investment, construction contractor, marketing agency, law firm", type: "text" },
    { id: "team_size", section: "Business Overview", question: "How many people are on your team?", hint: "Include full-time, part-time, and regular contractors", type: "choice", options: ["Just me", "2–5 people", "6–15 people", "16–30 people", "30+ people"] },
    { id: "tools", section: "Business Overview", question: "What tools does your team currently use day-to-day?", hint: "List everything — spreadsheets, email, CRMs, WhatsApp, project tools, etc.", type: "text" },
    { id: "revenue_activity", section: "Business Overview", question: "What is your primary revenue-generating activity?", hint: "The core thing your business does to make money", type: "text" },
    { id: "repetitive_tasks", section: "Workflow Pain Points", question: "What tasks does your team repeat every day or every week?", hint: "Think about things you or your team do over and over — reports, emails, data entry, follow-ups", type: "textarea" },
    { id: "biggest_bottleneck", section: "Workflow Pain Points", question: "Where do things most often fall through the cracks or slow down?", hint: "What's the one thing that creates the most frustration or delays?", type: "textarea" },
    { id: "admin_hours", section: "Workflow Pain Points", question: "Roughly how many hours per week go into admin, reporting, or manual follow-ups?", hint: "Across your whole team", type: "choice", options: ["Under 5 hrs/week", "5–10 hrs/week", "10–20 hrs/week", "20–30 hrs/week", "30+ hrs/week"] },
    { id: "biggest_priority", section: "AI Readiness", question: "If you could eliminate ONE manual task tomorrow, what would it be?", hint: "The thing that eats the most time or causes the most errors", type: "textarea" },
    { id: "ai_experience", section: "AI Readiness", question: "How familiar is your team with AI tools like ChatGPT or automation tools like Zapier?", type: "choice", options: ["Never used them", "Tried a few times, not regularly", "We use 1–2 AI tools occasionally", "We actively use AI tools in our workflow"] },
    { id: "budget", section: "AI Readiness", question: "What is your approximate monthly budget for new software or automation tools?", type: "choice", options: ["$0 — free tools only", "$1–$50/month", "$50–$200/month", "$200–$500/month", "$500+/month"] },
    { id: "goal", section: "Goals", question: "What does success look like for you in 90 days?", hint: "Be specific — e.g. 'spend less time on reports', 'respond to leads faster', 'stop doing X manually'", type: "textarea" },
    { id: "anything_else", section: "Goals", question: "Anything else you'd like us to know before your audit?", hint: "Any context, constraints, or specific challenges not covered above", type: "textarea", optional: true },
  ];

  const sections = [...new Set(questions.map(function (q) { return q.section; }))];
  const sectionColors = {
    "Contact": "#6B7B8C",
    "Business Overview": "#C9A84C",
    "Workflow Pain Points": "#D4893A",
    "AI Readiness": "#4AADDB",
    "Goals": "#7A9E6A",
  };

  function escapeHtml(s) {
    if (s == null) return "";
    var t = String(s);
    return t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  var state = {
    answers: {},
    current: 0,
    submitted: false,
    copied: false,
    submitting: false,
    analysis: null,
    submissionId: null,
    error: null,
  };

  var root = document.getElementById("ai-audit-intake-root");
  if (!root) return;

  function getFirstIndexForSection(sectionName) {
    for (var i = 0; i < questions.length; i++) {
      if (questions[i].section === sectionName) return i;
    }
    return 0;
  }

  function buildPayload() {
    var a = state.answers;
    return {
      client_name: (a.client_name || '').trim(),
      client_email: (a.client_email || '').trim(),
      client_phone: (a.client_phone || '').trim(),
      business_name: (a.business_name || '').trim(),
      biz_type: (a.biz_type || '').trim(),
      team_size: (a.team_size || '').trim(),
      tools_used: (a.tools || '').trim(),
      revenue_activity: (a.revenue_activity || '').trim(),
      repetitive_tasks: (a.repetitive_tasks || '').trim(),
      biggest_bottleneck: (a.biggest_bottleneck || '').trim(),
      admin_hours: (a.admin_hours || '').trim(),
      biggest_priority: (a.biggest_priority || '').trim(),
      ai_experience: (a.ai_experience || '').trim(),
      budget: (a.budget || '').trim(),
      goal_90_days: (a.goal || '').trim(),
      anything_else: (a.anything_else || '').trim()
    };
  }

  function submitToBackend() {
    state.submitting = true;
    state.error = null;
    render();
    var payload = buildPayload();
    fetch(API_BASE + '/submit-audit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(function (res) { return res.json().then(function (data) { return { ok: res.ok, status: res.status, data: data }; }); })
      .then(function (result) {
        state.submitting = false;
        if (result.ok && result.data.success && result.data.analysis) {
          state.submitted = true;
          state.analysis = result.data.analysis;
          state.submissionId = result.data.submission_id || null;
          try {
            window.dispatchEvent(new CustomEvent('audit-complete', {
              detail: {
                analysis: state.analysis,
                submissionId: state.submissionId,
                intake: buildPayload()
              }
            }));
          } catch (_) {}
          var summaryEl = document.getElementById('audit-summary');
          if (summaryEl) summaryEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
          state.error = (result.data && (result.data.detail || result.data.error)) || 'Analysis failed. Please try again or copy your responses and contact support.';
        }
        render();
      })
      .catch(function (err) {
        state.submitting = false;
        state.error = err.message || 'Network error. Ensure the audit server is running at ' + API_BASE;
        render();
      });
  }

  function render() {
    var q = questions[state.current];
    var progress = (state.current / questions.length) * 100;
    var sectionColor = sectionColors[q.section] || "#C9A84C";
    var answered = (state.answers[q.id] || "").trim().length > 0;
    var isLast = state.current === questions.length - 1;

    if (state.submitting) {
      root.innerHTML =
        '<div class="intake-wrap intake-complete">' +
        '<div class="intake-complete-inner">' +
        '<div class="intake-complete-icon">⏳</div>' +
        '<div class="intake-complete-label">Submitting</div>' +
        '<h2 class="intake-complete-title">Saving your responses & running AI analysis</h2>' +
        '<p class="intake-complete-desc">Your intake is being saved to our records and sent to Qwen AI for the audit report. This usually takes 15–30 seconds.</p>' +
        '<div class="intake-spinner"></div>' +
        '</div></div>';
      return;
    }

    if (state.error) {
      var errMsg = escapeHtml(state.error);
      root.innerHTML =
        '<div class="intake-wrap intake-complete">' +
        '<div class="intake-complete-inner">' +
        '<div class="intake-complete-icon">⚠️</div>' +
        '<div class="intake-complete-label">Something went wrong</div>' +
        '<h2 class="intake-complete-title">Analysis could not be completed</h2>' +
        '<p class="intake-complete-desc">' + errMsg + '</p>' +
        '<button type="button" class="intake-btn intake-btn-copy" data-action="copy">Copy my responses</button>' +
        '<button type="button" class="intake-btn intake-btn-secondary" data-action="start-over">Start over</button>' +
        '</div></div>';
      return;
    }

    if (state.submitted && state.analysis) {
      root.innerHTML =
        '<div class="intake-wrap intake-complete">' +
        '<div class="intake-complete-inner">' +
        '<div class="intake-complete-icon">✅</div>' +
        '<div class="intake-complete-label">Audit complete</div>' +
        '<h2 class="intake-complete-title">Your report has been generated</h2>' +
        '<p class="intake-complete-desc">Your responses were saved and the AI analysis is displayed in the <strong>Audit Report Summary</strong> section below. You can also download the sample report from the Deliverables section.</p>' +
        '<button type="button" class="intake-btn intake-btn-copy" data-action="copy-analysis">' + (state.copied ? "✓ Copied!" : "Copy full report") + '</button>' +
        '<button type="button" class="intake-btn intake-btn-secondary" data-action="start-over">Start over</button>' +
        '</div></div>';
      return;
    }

    if (state.submitted) {
      var summaryHtml = questions.map(function (qu) {
        var sectionColorQu = sectionColors[qu.section] || "#C9A84C";
        return (
          '<div class="intake-summary-item">' +
          '<div class="intake-summary-section" style="color:' + sectionColorQu + '">' + escapeHtml(qu.section) + '</div>' +
          '<div class="intake-summary-question">' + escapeHtml(qu.question) + '</div>' +
          '<div class="intake-summary-answer">' + escapeHtml(state.answers[qu.id] || "(skipped)") + '</div>' +
          '</div>'
        );
      }).join("");

      root.innerHTML =
        '<div class="intake-wrap intake-complete">' +
        '<div class="intake-complete-inner">' +
        '<div class="intake-complete-icon">✅</div>' +
        '<div class="intake-complete-label">Intake complete</div>' +
        '<h2 class="intake-complete-title">Your responses are ready</h2>' +
        '<p class="intake-complete-desc">The server may be unavailable. Copy your responses below and use them with the analysis prompt, or try again later.</p>' +
        '<div class="intake-summary-box">' + summaryHtml + '</div>' +
        '<button type="button" class="intake-btn intake-btn-copy" data-action="copy">' + (state.copied ? "✓ Copied!" : "Copy All Responses") + '</button>' +
        '<button type="button" class="intake-btn intake-btn-secondary" data-action="start-over">Start Over</button>' +
        '</div></div>';
      return;
    }

    var pillsHtml = sections.map(function (s) {
      var firstIdx = getFirstIndexForSection(s);
      var secQuestions = questions.filter(function (qu) { return qu.section === s; });
      var doneCount = questions.slice(0, state.current).filter(function (qu) { return qu.section === s; }).length;
      var done = doneCount === secQuestions.length;
      var active = q.section === s;
      var color = sectionColors[s];
      return (
        '<button type="button" class="intake-pill" data-action="section" data-section-index="' + firstIdx + '" ' +
        'style="--pill-color:' + color + ';' +
        (active ? 'background:' + color + '20;color:' + color + ';border-color:' + color + ';font-weight:700;' : '') +
        (done && !active ? 'color:' + color + ';' : '') +
        '">' + (done && !active ? "✓ " : "") + escapeHtml(s) + '</button>'
      );
    }).join("");

    var fieldHtml = "";
    if (q.type === "choice") {
      fieldHtml = '<div class="intake-choices">' + q.options.map(function (opt) {
        var selected = state.answers[q.id] === opt;
        return (
          '<button type="button" class="intake-choice" data-action="choice" data-question-id="' + escapeHtml(q.id) + '" data-option="' + escapeHtml(opt) + '" ' +
          'style="--choice-color:' + sectionColor + ';' +
          (selected ? 'border-color:' + sectionColor + ';background:' + sectionColor + '15;color:#F0E8D5;' : '') +
          '">' +
          '<span class="intake-choice-radio" style="' + (selected ? 'border-color:' + sectionColor + ';background:' + sectionColor + ';' : '') + '"></span>' +
          escapeHtml(opt) + '</button>'
        );
      }).join("") + '</div>';
    } else if (q.type === "text") {
      fieldHtml = '<input type="text" class="intake-input" data-action="input" data-question-id="' + escapeHtml(q.id) + '" placeholder="Type your answer here..." value="' + escapeHtml(state.answers[q.id] || "") + '" style="--focus-color:' + sectionColor + '">';
    } else {
      fieldHtml = '<textarea class="intake-textarea" data-action="input" data-question-id="' + escapeHtml(q.id) + '" placeholder="Type your answer here..." rows="5" style="--focus-color:' + sectionColor + '">' + escapeHtml(state.answers[q.id] || "") + '</textarea>';
    }

    root.innerHTML =
      '<div class="intake-wrap" style="--section-color:' + sectionColor + '">' +
      '<div class="intake-progress-bar"><div class="intake-progress-fill" style="width:' + progress + '%;background:' + sectionColor + '"></div></div>' +
      '<div class="intake-header">' +
      '<div class="intake-header-section">' + escapeHtml(q.section) + '</div>' +
      '<div class="intake-header-count">' + (state.current + 1) + ' / ' + questions.length + '</div>' +
      '</div>' +
      '<div class="intake-pills">' + pillsHtml + '</div>' +
      '<div class="intake-body">' +
      '<div class="intake-question-block">' +
      '<div class="intake-question-num">Question ' + (state.current + 1) + (q.optional ? ' <span class="intake-optional">— Optional</span>' : '') + '</div>' +
      '<h2 class="intake-question-title">' + escapeHtml(q.question) + '</h2>' +
      (q.hint ? '<p class="intake-question-hint">' + escapeHtml(q.hint) + '</p>' : '') +
      fieldHtml +
      '<div class="intake-nav">' +
      (state.current > 0 ? '<button type="button" class="intake-btn intake-btn-back" data-action="back">← Back</button>' : '') +
      '<button type="button" class="intake-btn intake-btn-next" data-action="next" data-answered="' + (answered || q.optional) + '" style="background:' + (answered || q.optional ? sectionColor : '#1A1C22') + ';color:' + (answered || q.optional ? '#07080A' : '#3A3830') + '">' + (isLast ? "Complete Audit ✓" : "Next Question →") + '</button>' +
      '</div></div></div>' +
      '<div class="intake-footer">' +
      '<span>AI Business Development Audit · Jesse-Joel Nzumafor</span>' +
      '<span>' + Math.round(progress) + '% complete</span>' +
      '</div></div>';
  }

  function getCopyText() {
    return questions.map(function (qu) {
      return qu.question + "\n" + (state.answers[qu.id] || "(not answered)");
    }).join("\n\n");
  }

  function handleCopy(text) {
    navigator.clipboard.writeText(text).then(function () {
      state.copied = true;
      render();
      setTimeout(function () {
        state.copied = false;
        render();
      }, 2000);
    });
  }

  root.addEventListener("click", function (e) {
    var btn = e.target.closest("[data-action]");
    if (!btn) return;
    var action = btn.getAttribute("data-action");
    if (action === "next") {
      var q = questions[state.current];
      var answered = (state.answers[q.id] || "").trim().length > 0;
      if (!answered && !q.optional) return;
      if (state.current === questions.length - 1) {
        submitToBackend();
        return;
      }
      state.current++;
      render();
    } else if (action === "copy-analysis") {
      if (state.analysis) {
        handleCopy(state.analysis);
        state.copied = true;
        render();
        setTimeout(function () { state.copied = false; render(); }, 2000);
      }
    } else if (action === "back") {
      state.current--;
      render();
    } else if (action === "section") {
      state.current = parseInt(btn.getAttribute("data-section-index"), 10);
      render();
    } else if (action === "choice") {
      state.answers[btn.getAttribute("data-question-id")] = btn.getAttribute("data-option");
      render();
    } else if (action === "copy") {
      handleCopy(getCopyText());
    } else if (action === "start-over") {
      state.answers = {};
      state.current = 0;
      state.submitted = false;
      state.copied = false;
      state.analysis = null;
      state.submissionId = null;
      state.error = null;
      render();
    }
  });

  function updateNextButton() {
    if (state.submitted) return;
    var q = questions[state.current];
    var answered = (state.answers[q.id] || "").trim().length > 0;
    var sectionColor = sectionColors[q.section] || "#C9A84C";
    var nextBtn = root.querySelector(".intake-btn-next");
    if (nextBtn) {
      nextBtn.style.background = (answered || q.optional) ? sectionColor : "#1A1C22";
      nextBtn.style.color = (answered || q.optional) ? "#07080A" : "#3A3830";
      nextBtn.disabled = !answered && !q.optional;
    }
  }

  root.addEventListener("input", function (e) {
    var el = e.target;
    if (el.getAttribute("data-action") !== "input") return;
    var id = el.getAttribute("data-question-id");
    if (id) {
      state.answers[id] = el.value;
      updateNextButton();
    }
  });

  root.addEventListener("change", function (e) {
    var el = e.target;
    if (el.getAttribute("data-action") !== "input") return;
    var id = el.getAttribute("data-question-id");
    if (id) {
      state.answers[id] = el.value;
      render();
    }
  });

  render();
})();
