/* global React */

// Browser-friendly version of `AuditResultsSlides.jsx`
// Exposes `window.AuditSlidesDeck` which renders a slide deck from `auditData`.

const {
  useState,
  useEffect
} = React;
const complexityColor = {
  Low: "#7AC970",
  Medium: "#F0A500",
  High: "#E05C5C"
};
function AnimatedCounter({
  target,
  suffix = "",
  duration = 1200
}) {
  const [count, setCount] = useState(0);
  const isNum = !isNaN(parseFloat(target));
  useEffect(() => {
    if (!isNum) return;
    const end = parseFloat(target);
    let start = 0;
    const step = end / (duration / 16);
    const timer = setInterval(() => {
      start = Math.min(start + step, end);
      setCount(Math.floor(start));
      if (start >= end) clearInterval(timer);
    }, 16);
    return () => clearInterval(timer);
  }, [target]);
  return /*#__PURE__*/React.createElement("span", null, isNum ? count + suffix : target);
}
function FloatingOrbs({
  color
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      overflow: "hidden",
      pointerEvents: "none"
    }
  }, [...Array(6)].map((_, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      position: "absolute",
      width: `${40 + i * 20}px`,
      height: `${40 + i * 20}px`,
      borderRadius: "50%",
      background: `radial-gradient(circle, ${color}22 0%, transparent 70%)`,
      left: `${10 + i * 15}%`,
      top: `${20 + i % 3 * 25}%`,
      animation: `float${i % 3} ${3 + i * 0.7}s ease-in-out infinite`,
      animationDelay: `${i * 0.4}s`
    }
  })));
}
function ParticleField() {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      overflow: "hidden",
      pointerEvents: "none"
    }
  }, [...Array(20)].map((_, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      position: "absolute",
      width: "2px",
      height: "2px",
      borderRadius: "50%",
      background: "#C9A84C",
      opacity: 0.3 + Math.random() * 0.4,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      animation: `twinkle ${2 + Math.random() * 3}s ease-in-out infinite`,
      animationDelay: `${Math.random() * 3}s`
    }
  })));
}
function ToolBadge({
  tool,
  color
}) {
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 5,
      padding: "5px 14px",
      borderRadius: 3,
      background: `${color}18`,
      border: `1px solid ${color}44`,
      color,
      fontSize: 11,
      fontWeight: 700,
      letterSpacing: 0.5,
      fontFamily: "monospace",
      animation: "badgePop 0.4s cubic-bezier(0.34,1.56,0.64,1) both"
    }
  }, "\u2699 ", tool);
}
function SlideWrapper({
  children,
  visible,
  direction
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      opacity: visible ? 1 : 0,
      transform: visible ? "translateX(0) scale(1)" : direction === "left" ? "translateX(60px) scale(0.97)" : "translateX(-60px) scale(0.97)",
      transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
      pointerEvents: visible ? "auto" : "none"
    }
  }, children);
}
function CoverSlide({
  data,
  visible,
  meta
}) {
  return /*#__PURE__*/React.createElement(SlideWrapper, {
    visible: visible,
    direction: "left"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: "100%",
      height: "100%",
      background: "linear-gradient(135deg, #07080A 0%, #0D1018 50%, #07080A 100%)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
      overflow: "hidden",
      padding: "40px 32px",
      textAlign: "center"
    }
  }, /*#__PURE__*/React.createElement(ParticleField, null), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      top: "10%",
      left: "5%",
      width: 300,
      height: 300,
      borderRadius: "50%",
      background: "radial-gradient(circle, rgba(201,168,76,0.12) 0%, transparent 70%)",
      animation: "pulse 4s ease-in-out infinite"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      bottom: "5%",
      right: "5%",
      width: 250,
      height: 250,
      borderRadius: "50%",
      background: "radial-gradient(circle, rgba(74,173,219,0.1) 0%, transparent 70%)",
      animation: "pulse 5s ease-in-out infinite reverse"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 120,
      height: 120,
      borderRadius: "50%",
      border: "2px solid rgba(201,168,76,0.3)",
      borderTop: "2px solid #C9A84C",
      animation: "spin 8s linear infinite",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 24,
      position: "relative"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 48,
      lineHeight: 1
    }
  }, data.icon)), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 9,
      letterSpacing: 3,
      color: "#C9A84C",
      fontFamily: "monospace",
      marginBottom: 16,
      animation: "fadeUp 0.6s ease both",
      animationDelay: "0.2s",
      opacity: visible ? 1 : 0
    }
  }, data.label), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: "'Georgia', serif",
      fontSize: "clamp(28px, 5vw, 46px)",
      fontWeight: 900,
      color: "#F0E8D5",
      lineHeight: 1.1,
      marginBottom: 16,
      whiteSpace: "pre-line",
      animation: "fadeUp 0.6s ease both",
      animationDelay: "0.35s",
      opacity: visible ? 1 : 0
    }
  }, data.title), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "#7A7060",
      fontSize: 13,
      fontFamily: "sans-serif",
      marginBottom: 40,
      letterSpacing: 0.3,
      animation: "fadeUp 0.6s ease both",
      animationDelay: "0.5s",
      opacity: visible ? 1 : 0
    }
  }, data.sub), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 16,
      flexWrap: "wrap",
      justifyContent: "center",
      animation: "fadeUp 0.6s ease both",
      animationDelay: "0.65s",
      opacity: visible ? 1 : 0
    }
  }, data.stats.map((s, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      background: "rgba(255,255,255,0.03)",
      border: "1px solid rgba(201,168,76,0.25)",
      borderRadius: 4,
      padding: "18px 24px",
      textAlign: "center",
      minWidth: 90,
      animation: `popIn 0.5s cubic-bezier(0.34,1.56,0.64,1) both`,
      animationDelay: `${0.7 + i * 0.1}s`
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 28,
      fontWeight: 900,
      color: "#C9A84C",
      fontFamily: "'Georgia', serif",
      lineHeight: 1
    }
  }, visible && /*#__PURE__*/React.createElement(AnimatedCounter, {
    target: s.value
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: "#5A5448",
      fontFamily: "monospace",
      marginTop: 4,
      letterSpacing: 1
    }
  }, s.label)))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 40,
      padding: "10px 24px",
      border: "1px solid rgba(255,255,255,0.06)",
      borderRadius: 2,
      animation: "fadeUp 0.6s ease both",
      animationDelay: "1.1s",
      opacity: visible ? 1 : 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: "#3A3830",
      fontSize: 11,
      fontFamily: "monospace"
    }
  }, meta.company, "  \xB7  ", meta.industry, "  \xB7  ", meta.date))));
}
function SummarySlide({
  data,
  visible
}) {
  return /*#__PURE__*/React.createElement(SlideWrapper, {
    visible: visible,
    direction: "left"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: "100%",
      height: "100%",
      background: "#08090C",
      display: "flex",
      flexDirection: "column",
      position: "relative",
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement(FloatingOrbs, {
    color: data.accent
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: 0,
      top: 0,
      bottom: 0,
      width: 4,
      background: `linear-gradient(180deg, ${data.accent} 0%, transparent 100%)`
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "36px 44px 0",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 9,
      letterSpacing: 3,
      color: data.accent,
      fontFamily: "monospace",
      marginBottom: 6
    }
  }, data.label), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 14,
      marginBottom: 20
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 40
    }
  }, data.icon), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: "'Georgia', serif",
      fontSize: "clamp(24px,4vw,38px)",
      color: "#F0E8D5",
      fontWeight: 900,
      lineHeight: 1.1
    }
  }, data.title)), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 2,
      background: `linear-gradient(90deg, ${data.accent} 0%, transparent 60%)`
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      padding: "28px 44px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: "'Georgia', serif",
      fontSize: "clamp(13px,1.8vw,16px)",
      color: "#C0B8A8",
      lineHeight: 1.85,
      marginBottom: 28,
      borderLeft: `3px solid ${data.accent}44`,
      paddingLeft: 20
    }
  }, data.body), data.highlights?.length ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexWrap: "wrap",
      gap: 12
    }
  }, data.highlights.map((h, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      background: `${data.accent}12`,
      border: `1px solid ${data.accent}33`,
      borderRadius: 3,
      padding: "10px 18px",
      animation: `popIn 0.4s cubic-bezier(0.34,1.56,0.64,1) both`,
      animationDelay: `${0.3 + i * 0.15}s`
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 6,
      height: 6,
      borderRadius: "50%",
      background: data.accent,
      flexShrink: 0
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      color: data.accent,
      fontSize: 12,
      fontFamily: "monospace",
      fontWeight: 700
    }
  }, h)))) : null)));
}
function StateSlide({
  data,
  visible
}) {
  return /*#__PURE__*/React.createElement(SlideWrapper, {
    visible: visible,
    direction: "left"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: "100%",
      height: "100%",
      background: "#08090C",
      display: "flex",
      flexDirection: "column",
      position: "relative",
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      right: -60,
      top: -60,
      width: 300,
      height: 300,
      borderRadius: "50%",
      background: `radial-gradient(circle, ${data.accent}15 0%, transparent 70%)`,
      animation: "pulse 4s ease-in-out infinite"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: 0,
      top: 0,
      bottom: 0,
      width: 4,
      background: data.accent
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "36px 44px 0"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 9,
      letterSpacing: 3,
      color: data.accent,
      fontFamily: "monospace",
      marginBottom: 6
    }
  }, data.label), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 14,
      marginBottom: 20
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 40
    }
  }, data.icon), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: "'Georgia', serif",
      fontSize: "clamp(24px,4vw,38px)",
      color: "#F0E8D5",
      fontWeight: 900
    }
  }, data.title)), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 2,
      background: `linear-gradient(90deg, ${data.accent} 0%, transparent 60%)`
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      padding: "24px 44px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: "'Georgia', serif",
      fontSize: 14,
      color: "#8A8070",
      lineHeight: 1.7,
      marginBottom: 8
    }
  }, data.body), data.pains?.length ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 14
    }
  }, data.pains.map((p, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      background: `${data.accent}0D`,
      border: `1px solid ${data.accent}2A`,
      borderRadius: 4,
      padding: "18px 20px",
      display: "flex",
      alignItems: "center",
      gap: 14,
      animation: `slideIn 0.4s ease both`,
      animationDelay: `${0.2 + i * 0.12}s`,
      position: "relative",
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      background: `linear-gradient(135deg, ${data.accent}08 0%, transparent 60%)`
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 28,
      flexShrink: 0,
      zIndex: 1
    }
  }, p.icon), /*#__PURE__*/React.createElement("span", {
    style: {
      color: "#A09880",
      fontSize: 12,
      fontFamily: "sans-serif",
      lineHeight: 1.5,
      zIndex: 1
    }
  }, p.text)))) : null)));
}
function RecommendationSlide({
  data,
  visible
}) {
  const cc = complexityColor[data.complexity] || "#F0A500";
  return /*#__PURE__*/React.createElement(SlideWrapper, {
    visible: visible,
    direction: "left"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: "100%",
      height: "100%",
      background: "#08090C",
      display: "flex",
      flexDirection: "column",
      position: "relative",
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      right: -80,
      bottom: -80,
      width: 350,
      height: 350,
      borderRadius: "50%",
      background: `radial-gradient(circle, ${data.accent}10 0%, transparent 70%)`
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: 0,
      top: 0,
      bottom: 0,
      width: 4,
      background: data.accent
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "28px 44px 0"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 9,
      letterSpacing: 3,
      color: data.accent,
      fontFamily: "monospace"
    }
  }, data.label), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8,
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 10,
      color: "#5A5448",
      fontFamily: "monospace"
    }
  }, "COMPLEXITY"), /*#__PURE__*/React.createElement("span", {
    style: {
      padding: "3px 12px",
      borderRadius: 2,
      fontSize: 10,
      fontWeight: 700,
      fontFamily: "monospace",
      background: `${cc}20`,
      color: cc,
      border: `1px solid ${cc}44`
    }
  }, data.complexity), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 10,
      color: "#5A5448",
      fontFamily: "monospace"
    }
  }, "\xB7"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 10,
      color: data.accent,
      fontFamily: "monospace",
      fontWeight: 700
    }
  }, "\u23F1 ", data.timeSaved))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "flex-start",
      gap: 14,
      marginTop: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 44,
      flexShrink: 0,
      animation: "iconBounce 2s ease-in-out infinite"
    }
  }, data.icon), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: "'Georgia', serif",
      fontSize: "clamp(20px,3.2vw,32px)",
      color: "#F0E8D5",
      fontWeight: 900,
      lineHeight: 1.2,
      whiteSpace: "pre-line"
    }
  }, data.title)), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 2,
      background: `linear-gradient(90deg, ${data.accent} 0%, transparent 60%)`,
      marginTop: 12
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      padding: "16px 44px 20px",
      display: "flex",
      flexDirection: "column",
      gap: 10,
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 12
    }
  }, [{
    label: "🔴 PROBLEM",
    text: data.problem,
    color: "#E05C5C"
  }, {
    label: "🟢 SOLUTION",
    text: data.solution,
    color: "#7AC970"
  }].map((item, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      background: "rgba(255,255,255,0.02)",
      border: "1px solid rgba(255,255,255,0.06)",
      borderRadius: 4,
      padding: "16px 18px",
      animation: `slideIn 0.4s ease both`,
      animationDelay: `${0.2 + i * 0.15}s`
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 9,
      letterSpacing: 2,
      color: item.color,
      fontFamily: "monospace",
      fontWeight: 700,
      marginBottom: 8
    }
  }, item.label), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "#9A9080",
      fontSize: 12,
      fontFamily: "sans-serif",
      lineHeight: 1.7
    }
  }, item.text)))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexWrap: "wrap",
      gap: 8,
      animation: "fadeUp 0.4s ease both",
      animationDelay: "0.5s"
    }
  }, data.tools.map((t, i) => /*#__PURE__*/React.createElement(ToolBadge, {
    key: i,
    tool: t,
    color: data.accent
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      background: `linear-gradient(135deg, ${data.accent}15 0%, transparent 80%)`,
      border: `1px solid ${data.accent}33`,
      borderRadius: 4,
      padding: "14px 18px",
      display: "flex",
      alignItems: "center",
      gap: 12,
      animation: "fadeUp 0.4s ease both",
      animationDelay: "0.65s"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 22,
      flexShrink: 0
    }
  }, "\uD83D\uDCB0"), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "#C0B8A8",
      fontSize: 12,
      fontFamily: "sans-serif",
      lineHeight: 1.6
    }
  }, /*#__PURE__*/React.createElement("strong", {
    style: {
      color: data.accent
    }
  }, "ROI: "), data.roi)))));
}
function QuickWinsSlide({
  data,
  visible
}) {
  return /*#__PURE__*/React.createElement(SlideWrapper, {
    visible: visible,
    direction: "left"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: "100%",
      height: "100%",
      background: "#08090C",
      display: "flex",
      flexDirection: "column",
      position: "relative",
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement(ParticleField, null), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: 0,
      top: 0,
      bottom: 0,
      width: 4,
      background: data.accent
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "36px 44px 0"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 9,
      letterSpacing: 3,
      color: data.accent,
      fontFamily: "monospace",
      marginBottom: 6
    }
  }, data.label), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 14,
      marginBottom: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 44,
      animation: "zap 1.5s ease-in-out infinite"
    }
  }, data.icon), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: "'Georgia', serif",
      fontSize: "clamp(24px,4vw,38px)",
      color: "#F0E8D5",
      fontWeight: 900
    }
  }, data.title), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "#5A5448",
      fontSize: 12,
      fontFamily: "monospace"
    }
  }, data.sub))), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 2,
      background: `linear-gradient(90deg, ${data.accent} 0%, transparent 60%)`
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      padding: "28px 44px",
      display: "flex",
      flexDirection: "column",
      gap: 18,
      justifyContent: "center"
    }
  }, data.wins.map((w, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: "flex",
      gap: 20,
      alignItems: "center",
      background: "rgba(255,255,255,0.02)",
      border: "1px solid rgba(255,255,255,0.06)",
      borderRadius: 4,
      padding: "20px 24px",
      animation: `slideIn 0.5s cubic-bezier(0.34,1.56,0.64,1) both`,
      animationDelay: `${0.2 + i * 0.18}s`,
      position: "relative",
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: 0,
      top: 0,
      bottom: 0,
      width: 3,
      background: data.accent
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 36,
      flexShrink: 0
    }
  }, w.icon), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "#B0A898",
      fontSize: 13,
      fontFamily: "sans-serif",
      lineHeight: 1.7
    }
  }, w.text), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      right: 16,
      top: "50%",
      transform: "translateY(-50%)",
      width: 28,
      height: 28,
      borderRadius: "50%",
      border: `2px solid ${data.accent}44`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: data.accent,
      fontSize: 12,
      fontWeight: 900,
      fontFamily: "monospace"
    }
  }, i + 1))))));
}
function RoadmapSlide({
  data,
  visible
}) {
  return /*#__PURE__*/React.createElement(SlideWrapper, {
    visible: visible,
    direction: "left"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: "100%",
      height: "100%",
      background: "#08090C",
      display: "flex",
      flexDirection: "column",
      position: "relative",
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: 0,
      top: 0,
      bottom: 0,
      width: 4,
      background: "#C9A84C"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "32px 44px 0"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 9,
      letterSpacing: 3,
      color: "#C9A84C",
      fontFamily: "monospace",
      marginBottom: 6
    }
  }, data.label), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 14,
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 40
    }
  }, data.icon), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: "'Georgia', serif",
      fontSize: "clamp(22px,3.6vw,34px)",
      color: "#F0E8D5",
      fontWeight: 900,
      whiteSpace: "pre-line",
      lineHeight: 1.2
    }
  }, data.title)), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 2,
      background: "linear-gradient(90deg, #C9A84C 0%, transparent 60%)"
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      padding: "24px 44px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      gap: 0
    }
  }, data.phases.map((p, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: "flex",
      gap: 0,
      alignItems: "stretch"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      width: 60,
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 48,
      height: 48,
      borderRadius: "50%",
      background: `${p.color}20`,
      border: `2px solid ${p.color}`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: 22,
      flexShrink: 0,
      animation: `popIn 0.5s cubic-bezier(0.34,1.56,0.64,1) both`,
      animationDelay: `${0.2 + i * 0.2}s`,
      zIndex: 1
    }
  }, p.icon), i < data.phases.length - 1 && /*#__PURE__*/React.createElement("div", {
    style: {
      width: 2,
      flex: 1,
      minHeight: 24,
      background: `linear-gradient(180deg, ${p.color} 0%, ${data.phases[i + 1].color} 100%)`,
      opacity: 0.4
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      paddingLeft: 20,
      paddingBottom: i < data.phases.length - 1 ? 20 : 0,
      animation: `slideIn 0.5s ease both`,
      animationDelay: `${0.3 + i * 0.2}s`
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      marginBottom: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 10,
      fontFamily: "monospace",
      fontWeight: 700,
      color: p.color,
      letterSpacing: 1
    }
  }, p.phase), /*#__PURE__*/React.createElement("span", {
    style: {
      padding: "2px 10px",
      borderRadius: 2,
      fontSize: 9,
      fontWeight: 700,
      fontFamily: "monospace",
      background: `${p.color}18`,
      color: p.color,
      border: `1px solid ${p.color}33`,
      letterSpacing: 1
    }
  }, p.label)), /*#__PURE__*/React.createElement("div", {
    style: {
      background: `${p.color}0C`,
      border: `1px solid ${p.color}22`,
      borderRadius: 4,
      padding: "14px 18px"
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      color: "#B0A898",
      fontSize: 13,
      fontFamily: "sans-serif",
      lineHeight: 1.7
    }
  }, p.action))))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 20,
      padding: "16px 24px",
      background: "linear-gradient(135deg, rgba(201,168,76,0.12) 0%, transparent 80%)",
      border: "1px solid rgba(201,168,76,0.3)",
      borderRadius: 4,
      display: "flex",
      alignItems: "center",
      gap: 14,
      animation: "fadeUp 0.5s ease both",
      animationDelay: "0.8s"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 28
    }
  }, "\uD83C\uDFC6"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: "#C9A84C",
      fontFamily: "monospace",
      fontWeight: 700,
      letterSpacing: 1,
      marginBottom: 2
    }
  }, "DAY 90 OUTCOME"), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "#C0B8A8",
      fontSize: 12,
      fontFamily: "sans-serif"
    }
  }, data.outcome))))));
}
function SlideDeck({
  auditData
}) {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState("left");
  const total = auditData.slides.length;
  const go = next => {
    setDirection(next > current ? "left" : "right");
    setCurrent(next);
  };
  const prev = () => current > 0 && go(current - 1);
  const next = () => current < total - 1 && go(current + 1);
  useEffect(() => {
    const handler = e => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [current]);
  const slide = auditData.slides[current];
  const renderSlide = (s, i) => {
    const v = i === current;
    const meta = {
      company: auditData.company,
      industry: auditData.industry,
      date: auditData.date
    };
    switch (s.type) {
      case "cover":
        return /*#__PURE__*/React.createElement(CoverSlide, {
          key: s.id,
          data: s,
          visible: v,
          meta: meta
        });
      case "summary":
        return /*#__PURE__*/React.createElement(SummarySlide, {
          key: s.id,
          data: s,
          visible: v
        });
      case "state":
        return /*#__PURE__*/React.createElement(StateSlide, {
          key: s.id,
          data: s,
          visible: v
        });
      case "recommendation":
        return /*#__PURE__*/React.createElement(RecommendationSlide, {
          key: s.id,
          data: s,
          visible: v
        });
      case "quickwins":
        return /*#__PURE__*/React.createElement(QuickWinsSlide, {
          key: s.id,
          data: s,
          visible: v
        });
      case "roadmap":
        return /*#__PURE__*/React.createElement(RoadmapSlide, {
          key: s.id,
          data: s,
          visible: v
        });
      default:
        return null;
    }
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: "100%",
      height: "min(70vh, 720px)",
      background: "#04050A",
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
      userSelect: "none"
    }
  }, /*#__PURE__*/React.createElement("style", null, `
        @keyframes pulse { 0%,100%{transform:scale(1);opacity:.8} 50%{transform:scale(1.15);opacity:1} }
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        @keyframes popIn { from{opacity:0;transform:scale(0.7)} to{opacity:1;transform:scale(1)} }
        @keyframes slideIn { from{opacity:0;transform:translateX(-24px)} to{opacity:1;transform:translateX(0)} }
        @keyframes badgePop { from{opacity:0;transform:scale(0.8) translateY(8px)} to{opacity:1;transform:scale(1) translateY(0)} }
        @keyframes twinkle { 0%,100%{opacity:.2;transform:scale(1)} 50%{opacity:.8;transform:scale(1.5)} }
        @keyframes float0 { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-18px)} }
        @keyframes float1 { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
        @keyframes float2 { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-22px)} }
        @keyframes iconBounce { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(-6px) rotate(5deg)} }
        @keyframes zap { 0%,100%{transform:scale(1) rotate(0deg)} 50%{transform:scale(1.2) rotate(-8deg)} }
        * { box-sizing: border-box; margin: 0; padding: 0; }
      `), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 3,
      background: "#1A1C22",
      flexShrink: 0,
      position: "relative"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      height: "100%",
      width: `${(current + 1) / total * 100}%`,
      background: "linear-gradient(90deg, #C9A84C, #F0A500)",
      transition: "width 0.4s ease"
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      position: "relative",
      overflow: "hidden"
    }
  }, auditData.slides.map((s, i) => renderSlide(s, i))), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 56,
      background: "#07080A",
      borderTop: "1px solid rgba(255,255,255,0.05)",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 32px",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 6,
      alignItems: "center"
    }
  }, auditData.slides.map((_, i) => /*#__PURE__*/React.createElement("button", {
    key: i,
    onClick: () => go(i),
    style: {
      width: i === current ? 22 : 7,
      height: 7,
      borderRadius: 4,
      border: "none",
      background: i === current ? "#C9A84C" : i < current ? "#5A4A20" : "#2A2820",
      cursor: "pointer",
      transition: "all 0.3s ease",
      padding: 0
    }
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: "#3A3830",
      fontFamily: "monospace",
      letterSpacing: 1
    }
  }, String(current + 1).padStart(2, "0"), " / ", String(total).padStart(2, "0"), "  ·  ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: "#5A5448"
    }
  }, slide.label || (slide.title || "").split("\n")[0])), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8
    }
  }, [["←", prev, current === 0], ["→", next, current === total - 1]].map(([arrow, fn, disabled], i) => /*#__PURE__*/React.createElement("button", {
    key: i,
    onClick: fn,
    disabled: disabled,
    style: {
      width: 36,
      height: 36,
      borderRadius: "50%",
      background: disabled ? "transparent" : "rgba(201,168,76,0.1)",
      border: `1px solid ${disabled ? "rgba(255,255,255,0.05)" : "rgba(201,168,76,0.3)"}`,
      color: disabled ? "#2A2820" : "#C9A84C",
      cursor: disabled ? "default" : "pointer",
      fontSize: 16,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      transition: "all 0.2s"
    }
  }, arrow)))));
}

// Export to window for the page script to mount
window.AuditSlidesDeck = SlideDeck;
try {
  window.dispatchEvent(new CustomEvent("audit-slides-ready"));
} catch (_) {}
