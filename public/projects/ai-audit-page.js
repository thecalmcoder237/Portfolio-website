/**
 * AI Audit project page:
 * - Keeps raw analysis text in textarea / localStorage
 * - Renders analysis as an animated React slide deck (AuditResultsSlides format)
 */
(function () {
  const modal = document.getElementById("intakeModal");
  const openBtn = document.getElementById("openIntakeFullscreen");
  const shareBtn = document.getElementById("shareIntakeLink");
  const inlineMount = document.getElementById("ai-audit-intake-root");
  const modalMount = document.getElementById("ai-audit-intake-modal-mount");

  const summaryInput = document.getElementById("auditSummaryInput");
  const slidesMount = document.getElementById("auditSlidesMount");
  const summaryEmpty = document.getElementById("auditSummaryEmpty");
  const renderSummaryBtn = document.getElementById("renderAuditSummary");
  const clearSummaryBtn = document.getElementById("clearAuditSummary");
  const toggleSourceBtn = document.getElementById("toggleAuditSource");
  const sourceWrap = document.getElementById("auditSummarySourceWrap");

  const STORAGE_KEY = "ai_audit_summary_v1";
  const STORAGE_KEY_INTAKE = "ai_audit_intake_v1";

  const SECTION_LABELS = {
    EXECUTIVE_SUMMARY: "Executive Summary",
    CURRENT_STATE: "Current State",
    RECOMMENDATION_1: "Recommendation 01",
    RECOMMENDATION_2: "Recommendation 02",
    RECOMMENDATION_3: "Recommendation 03",
    QUICK_WINS: "Quick Wins",
    ROADMAP_30: "Days 1–30",
    ROADMAP_60: "Days 31–60",
    ROADMAP_90: "Days 61–90",
  };

  function escapeHtml(s) {
    if (s == null) return "";
    var t = String(s);
    return t
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function parseSections(text) {
    var raw = (text || "").trim();
    if (!raw) return [];
    var sections = [];
    var re = /---\s*SECTION:\s*(\w+)\s*\n([\s\S]*?)(?=---\s*SECTION:|$)/gi;
    var m;
    while ((m = re.exec(raw)) !== null) {
      var name = (m[1] || "").toUpperCase().replace(/\s+/g, "_");
      var body = (m[2] || "").trim();
      if (body) sections.push({ id: name, body: body });
    }
    if (sections.length === 0) sections.push({ id: "RAW", body: raw });
    return sections;
  }

  function setReportState(hasContent) {
    if (summaryEmpty) summaryEmpty.hidden = !!hasContent;
  }

  function firstParagraph(body) {
    return (body || "").split(/\n+/).map((s) => s.trim()).filter(Boolean)[0] || "";
  }

  function parseRecommendationBody(body) {
    var out = { title: "", problem: "", solution: "", tools: [], timeSaved: "", complexity: "Low", roi: "" };
    (body || "").split(/\n/).forEach(function (line) {
      var m = line.match(/^([A-Z_]+)\s*:\s*(.*)$/);
      if (!m) return;
      var key = m[1].toUpperCase();
      var val = (m[2] || "").trim();
      if (key === "TITLE") out.title = val;
      if (key === "PROBLEM") out.problem = val;
      if (key === "SOLUTION") out.solution = val;
      if (key === "TOOLS") out.tools = val ? val.split(/\s*,\s*/).filter(Boolean) : [];
      if (key === "TIME_SAVED") out.timeSaved = val;
      if (key === "COMPLEXITY") out.complexity = val || "Low";
      if (key === "ROI_NOTE") out.roi = val;
    });
    return out;
  }

  function buildAuditDataFromSections(rawText, intake) {
    var sections = parseSections(rawText);
    var secMap = {};
    sections.forEach(function (s) { secMap[s.id] = s.body; });

    var rec1 = parseRecommendationBody(secMap.RECOMMENDATION_1 || "");
    var rec2 = parseRecommendationBody(secMap.RECOMMENDATION_2 || "");
    var rec3 = parseRecommendationBody(secMap.RECOMMENDATION_3 || "");
    var wins = (secMap.QUICK_WINS || "").split(/\n/).map(function (l) { return l.replace(/^\s*-\s*/, "").trim(); }).filter(Boolean).slice(0, 3);

    var timeSaved = [rec1.timeSaved, rec2.timeSaved, rec3.timeSaved].filter(Boolean)[0] || "~12 hrs/week";
    var complexities = [rec1.complexity, rec2.complexity, rec3.complexity].filter(Boolean);
    var avgComplexity = complexities.length ? complexities[0] : "Low";

    var now = new Date();
    var date = now.toLocaleString(undefined, { month: "long", year: "numeric" });

    var in_ = intake || {};
    var client = (in_.client_name || "").trim() || "Client";
    var company = (in_.business_name || "").trim() || "Business";
    var industry = (in_.biz_type || "").trim() || "AI Audit";

    var highlights = [];
    if ((in_.repetitive_tasks || "").trim()) highlights.push((in_.repetitive_tasks || "").trim().slice(0, 80) + ((in_.repetitive_tasks || "").length > 80 ? "…" : ""));
    if ((in_.biggest_bottleneck || "").trim()) highlights.push((in_.biggest_bottleneck || "").trim().slice(0, 60) + ((in_.biggest_bottleneck || "").length > 60 ? "…" : ""));
    if ((in_.admin_hours || "").trim()) highlights.push((in_.admin_hours || "").trim() + " admin");
    if ((in_.tools_used || "").trim()) highlights.push((in_.tools_used || "").trim().slice(0, 50) + ((in_.tools_used || "").length > 50 ? "…" : ""));
    highlights = highlights.slice(0, 4);

    var pains = [];
    if ((in_.tools_used || "").trim()) pains.push({ icon: "📉", text: "Current tools: " + (in_.tools_used || "").trim().slice(0, 60) + ((in_.tools_used || "").length > 60 ? "…" : "") });
    if ((in_.admin_hours || "").trim()) pains.push({ icon: "⏱️", text: (in_.admin_hours || "").trim() + " on admin/reporting weekly" });
    if ((in_.biggest_bottleneck || "").trim()) pains.push({ icon: "💬", text: "Bottleneck: " + (in_.biggest_bottleneck || "").trim().slice(0, 70) + ((in_.biggest_bottleneck || "").length > 70 ? "…" : "") });
    if ((in_.biggest_priority || "").trim()) pains.push({ icon: "🔍", text: "Priority to fix: " + (in_.biggest_priority || "").trim().slice(0, 70) + ((in_.biggest_priority || "").length > 70 ? "…" : "") });
    if (pains.length === 0) pains = [{ icon: "📋", text: "See executive summary" }];

    return {
      client: client,
      company: company,
      industry: industry,
      date: date,
      slides: [
        {
          id: "cover",
          type: "cover",
          icon: "✨",
          label: "AI BUSINESS READINESS AUDIT",
          title: "Your Automation\nBlueprint is Ready",
          sub: "3 high-impact recommendations · audit summary · 90-day roadmap",
          stats: [
            { value: "3", label: "Opportunities" },
            { value: String(timeSaved).replace(/\s+/g, ""), label: "Saved/Week" },
            { value: "90", label: "Day Roadmap" },
            { value: avgComplexity, label: "Avg. Complexity" },
          ],
        },
        {
          id: "summary",
          type: "summary",
          icon: "📋",
          label: "SECTION 01",
          title: "Executive Summary",
          accent: "#F0A500",
          body: firstParagraph(secMap.EXECUTIVE_SUMMARY || rawText),
          highlights: highlights,
        },
        {
          id: "state",
          type: "state",
          icon: "📊",
          label: "SECTION 02",
          title: "Current State",
          accent: "#E05C5C",
          body: firstParagraph(secMap.CURRENT_STATE || "") || ("Team: " + (in_.team_size || "—") + ". Revenue focus: " + (in_.revenue_activity || "—") + "."),
          pains: pains,
        },
        {
          id: "rec1",
          type: "recommendation",
          icon: "💡",
          label: "RECOMMENDATION 01",
          title: rec1.title || "Recommendation 01",
          accent: "#4AADDB",
          complexity: rec1.complexity || "Low",
          timeSaved: rec1.timeSaved || "",
          tools: rec1.tools.length ? rec1.tools : ["Airtable", "Make.com", "AI API"],
          problem: rec1.problem || "",
          solution: rec1.solution || "",
          roi: rec1.roi || "",
        },
        {
          id: "rec2",
          type: "recommendation",
          icon: "💡",
          label: "RECOMMENDATION 02",
          title: rec2.title || "Recommendation 02",
          accent: "#7AC970",
          complexity: rec2.complexity || "Low",
          timeSaved: rec2.timeSaved || "",
          tools: rec2.tools.length ? rec2.tools : ["Airtable", "Make.com"],
          problem: rec2.problem || "",
          solution: rec2.solution || "",
          roi: rec2.roi || "",
        },
        {
          id: "rec3",
          type: "recommendation",
          icon: "💡",
          label: "RECOMMENDATION 03",
          title: rec3.title || "Recommendation 03",
          accent: "#C97AD9",
          complexity: rec3.complexity || "Low",
          timeSaved: rec3.timeSaved || "",
          tools: rec3.tools.length ? rec3.tools : ["Airtable", "Make.com"],
          problem: rec3.problem || "",
          solution: rec3.solution || "",
          roi: rec3.roi || "",
        },
        {
          id: "quickwins",
          type: "quickwins",
          icon: "⚡",
          label: "SECTION 06",
          title: "Quick Wins",
          sub: "Do these this week — free, zero tech required",
          accent: "#F0A500",
          wins: wins.length ? wins.map((t) => ({ icon: "✅", text: t })) : [],
        },
        {
          id: "roadmap",
          type: "roadmap",
          icon: "🗓️",
          label: "SECTION 07",
          title: "90-Day Implementation\nRoadmap",
          accent: "#F0A500",
          phases: [
            { phase: "Days 1–30", color: "#4AADDB", icon: "🚀", label: "FOUNDATION", action: firstParagraph(secMap.ROADMAP_30 || "") },
            { phase: "Days 31–60", color: "#7AC970", icon: "⚙️", label: "BUILD", action: firstParagraph(secMap.ROADMAP_60 || "") },
            { phase: "Days 61–90", color: "#C97AD9", icon: "🎯", label: "SCALE", action: firstParagraph(secMap.ROADMAP_90 || "") },
          ],
          outcome: "A clear set of automations deployed with measurable weekly time savings.",
        },
      ],
    };
  }

  function renderSummary(text, intake) {
    var cleaned = (text || "").trim();
    if (!cleaned) {
      setReportState(false);
      clearMountMessage();
      return;
    }
    setReportState(true);
    var intakeToUse = intake || (function () {
      try { return JSON.parse(localStorage.getItem(STORAGE_KEY_INTAKE) || "null"); } catch (_) { return null; }
    })();
    if (slidesMount && window.ReactDOM && window.React && window.AuditSlidesDeck) {
      clearMountMessage();
      try {
        var auditData = buildAuditDataFromSections(cleaned, intakeToUse);
        var root = slidesMount.__reactRoot || (slidesMount.__reactRoot = window.ReactDOM.createRoot(slidesMount));
        root.render(window.React.createElement(window.AuditSlidesDeck, { auditData: auditData }));
      } catch (err) {
        console.error("Audit slides render error:", err);
        showMountMessage("Could not display the report. Check the browser console or try a different format.");
      }
    } else {
      showMountMessage("Loading report viewer…");
      window.addEventListener("audit-slides-ready", function onReady() {
        window.removeEventListener("audit-slides-ready", onReady);
        var again = (summaryInput && summaryInput.value) || localStorage.getItem(STORAGE_KEY) || "";
        var intakeAgain = null;
        try { intakeAgain = JSON.parse(localStorage.getItem(STORAGE_KEY_INTAKE) || "null"); } catch (_) {}
        renderSummary(again, intakeAgain);
      }, { once: true });
    }
  }

  function showMountMessage(msg) {
    if (!slidesMount) return;
    clearMountMessage();
    var p = document.createElement("p");
    p.className = "audit-mount-message";
    p.setAttribute("aria-live", "polite");
    p.textContent = msg;
    slidesMount.appendChild(p);
  }

  function clearMountMessage() {
    if (!slidesMount) return;
    var msg = slidesMount.querySelector(".audit-mount-message");
    if (msg) msg.remove();
  }

  window.addEventListener("audit-complete", function (e) {
    var detail = e.detail || {};
    if (detail.analysis) {
      if (summaryInput) summaryInput.value = detail.analysis;
      localStorage.setItem(STORAGE_KEY, detail.analysis);
      if (detail.intake) {
        try { localStorage.setItem(STORAGE_KEY_INTAKE, JSON.stringify(detail.intake)); } catch (_) {}
      }
      renderSummary(detail.analysis, detail.intake);
      var section = document.getElementById("audit-summary");
      if (section) {
        section.style.display = "";
        section.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  });

  // Slides script loads with Babel (async); re-render when it's ready so the deck is not blank
  window.addEventListener("audit-slides-ready", function () {
    var text = (summaryInput && summaryInput.value) || localStorage.getItem(STORAGE_KEY) || "";
    var trimmed = (text || "").trim();
    if (!trimmed) return;
    var intake = null;
    try { intake = JSON.parse(localStorage.getItem(STORAGE_KEY_INTAKE) || "null"); } catch (_) {}
    renderSummary(trimmed, intake);
  });

  function maybeHideOptionalSections() {
    var screenshots = document.getElementById("screenshots");
    if (screenshots) {
      var imgs = Array.from(screenshots.querySelectorAll("img"));
      var hasReal = imgs.some(function (img) {
        return !String(img.getAttribute("src") || "").endsWith(".svg");
      });
      if (!hasReal) screenshots.style.display = "none";
    }
    var videos = document.getElementById("videos");
    if (videos) {
      var iframes = videos.querySelectorAll("iframe");
      if (!iframes || iframes.length === 0) videos.style.display = "none";
    }
  }

  function setModalOpen(isOpen) {
    if (!modal) return;
    if (isOpen) {
      modal.classList.add("is-open");
      modal.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
    } else {
      modal.classList.remove("is-open");
      modal.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
    }
  }

  function moveIntake(toModal) {
    if (!inlineMount || !modalMount) return;
    var root = document.getElementById("ai-audit-intake-root");
    if (!root) return;
    if (toModal) modalMount.appendChild(root);
    else inlineMount.replaceWith(root);
  }

  openBtn && openBtn.addEventListener("click", function () {
    setModalOpen(true);
    moveIntake(true);
    modal && modal.querySelector(".project-modal-body") && modal.querySelector(".project-modal-body").scrollTo({ top: 0, behavior: "smooth" });
  });

  modal && modal.addEventListener("click", function (e) {
    var t = e.target;
    if (!(t instanceof Element)) return;
    var actionEl = t.closest("[data-action]");
    if (!actionEl) return;
    if (actionEl.getAttribute("data-action") === "close-modal") {
      moveIntake(false);
      setModalOpen(false);
    }
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && modal && modal.classList.contains("is-open")) {
      moveIntake(false);
      setModalOpen(false);
    }
  });

  shareBtn && shareBtn.addEventListener("click", function () {
    var url = new URL(window.location.href);
    url.hash = "#try-it";
    url.searchParams.set("view", "intake");
    navigator.clipboard.writeText(url.toString()).then(function () {
      var old = shareBtn.textContent;
      shareBtn.textContent = "Link copied";
      setTimeout(function () { shareBtn.textContent = old || "Copy share link"; }, 1600);
    });
  });

  function scheduleAutoRender() {
    if (!summaryInput) return;
    if (summaryInput.__autoRenderTimer) clearTimeout(summaryInput.__autoRenderTimer);
    summaryInput.__autoRenderTimer = setTimeout(function () {
      summaryInput.__autoRenderTimer = null;
      var trimmed = (summaryInput.value || "").trim();
      if (trimmed) localStorage.setItem(STORAGE_KEY, trimmed);
      var intake = null;
      try { intake = JSON.parse(localStorage.getItem(STORAGE_KEY_INTAKE) || "null"); } catch (_) {}
      renderSummary(trimmed, intake);
    }, 500);
  }

  renderSummaryBtn && renderSummaryBtn.addEventListener("click", function () {
    var text = (summaryInput && summaryInput.value) || "";
    var trimmed = text.trim();
    localStorage.setItem(STORAGE_KEY, trimmed);
    renderSummary(trimmed);
  });

  if (summaryInput) {
    summaryInput.addEventListener("input", scheduleAutoRender);
    summaryInput.addEventListener("paste", scheduleAutoRender);
  }

  clearSummaryBtn && clearSummaryBtn.addEventListener("click", function () {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(STORAGE_KEY_INTAKE);
    if (summaryInput) summaryInput.value = "";
    renderSummary("");
  });

  toggleSourceBtn && toggleSourceBtn.addEventListener("click", function () {
    if (!sourceWrap) return;
    var isHidden = sourceWrap.hidden;
    sourceWrap.hidden = !isHidden;
    toggleSourceBtn.textContent = isHidden ? "Hide source" : "Edit source";
  });

  var saved = localStorage.getItem(STORAGE_KEY) || "";
  if (summaryInput && saved) summaryInput.value = saved;
  if (saved) {
    var savedIntake = null;
    try { savedIntake = JSON.parse(localStorage.getItem(STORAGE_KEY_INTAKE) || "null"); } catch (_) {}
    renderSummary(saved, savedIntake);
  }
  maybeHideOptionalSections();

  /* AI terminal typing effect */
  (function initAiTerminal() {
    var lines = document.querySelectorAll(".ai-terminal-line[data-typing]");
    if (!lines.length) return;
    var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      lines.forEach(function (el) {
        el.textContent = el.getAttribute("data-typing") || "";
        el.classList.add("typing-done");
      });
      return;
    }
    var delay = 80;
    var linePause = 400;
    var idx = 0;

    function typeNext() {
      if (idx >= lines.length) return;
      var el = lines[idx];
      var text = el.getAttribute("data-typing") || "";
      el.classList.add("typing-active");
      el.textContent = "";
      var i = 0;
      function tick() {
        if (i <= text.length) {
          el.textContent = text.slice(0, i);
          i++;
          setTimeout(tick, delay);
        } else {
          el.classList.remove("typing-active");
          el.classList.add("typing-done");
          idx++;
          setTimeout(typeNext, linePause);
        }
      }
      tick();
    }
    setTimeout(typeNext, 600);
  })();
})();
