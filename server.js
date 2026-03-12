import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import OpenAI from 'openai';          // ← Changed from Anthropic
import Airtable from 'airtable';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import open from 'open';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PORT = process.env.AUDIT_PORT || 3001;
const app = express();
app.use(cors());
app.use(express.json());

// Health check — verify this server is the one responding (avoids 404 when something else uses 3000)
app.get('/health', (req, res) => res.json({ ok: true, service: 'audit-backend' }));

// ── Qwen client (uses OpenAI-compatible endpoint) ──────────
const qwen = new OpenAI({
  apiKey: process.env.QWEN_API_KEY,
  baseURL: 'https://dashscope-intl.aliyuncs.com/compatible-mode/v1'  // ← Qwen endpoint
});

// ── Airtable client (unchanged) ────────────────────────────
const airtableBaseId = (process.env.AIRTABLE_BASE_ID || '').replace(/\/$/, '');
const base = new Airtable({
  apiKey: process.env.AIRTABLE_API_KEY
}).base(airtableBaseId);

// ── SYSTEM MESSAGE (unchanged — paste your full one here) ──
const AUDIT_SYSTEM_MESSAGE = `
You are an expert AI Business Development Auditor specializing in workflow 
automation for small businesses. You have deep knowledge of no-code tools 
including Make.com, Zapier, Airtable, HubSpot, and AI APIs.

When given a client intake form, produce a structured audit analysis in this 
exact format. Do not deviate — this output populates a report template.

---
SECTION: EXECUTIVE_SUMMARY
Write 2-3 sentences summarizing the business, their biggest operational 
challenge, and the overall opportunity for AI/automation. Be specific.

---
SECTION: CURRENT_STATE
Write 2-3 sentences describing how the business currently operates based on 
their intake answers. Reference their actual tools and team size.

---
SECTION: RECOMMENDATION_1
TITLE: [Short title]
PROBLEM: [1-2 sentences on the specific pain point]
SOLUTION: [2-3 sentences on the exact AI/automation solution]
TOOLS: [Comma-separated list of tools]
TIME_SAVED: [Specific hours saved per week]
COMPLEXITY: [Low, Medium, or High]
ROI_NOTE: [One sentence on business impact beyond time savings]

---
SECTION: RECOMMENDATION_2
TITLE:
PROBLEM:
SOLUTION:
TOOLS:
TIME_SAVED:
COMPLEXITY:
ROI_NOTE:

---
SECTION: RECOMMENDATION_3
TITLE:
PROBLEM:
SOLUTION:
TOOLS:
TIME_SAVED:
COMPLEXITY:
ROI_NOTE:

---
SECTION: QUICK_WINS
List exactly 3 free, no-tech things the client can do this week.
Each on a new line starting with a dash (-).

---
SECTION: ROADMAP_30
One sentence: priority action for Days 1-30.

SECTION: ROADMAP_60
One sentence: priority action for Days 31-60.

SECTION: ROADMAP_90
One sentence: priority action for Days 61-90.

---
Always be specific to the client's answers. Never give generic advice. 
Reference their actual tools, tasks, and pain points by name.
`;

// ── USER MESSAGE TEMPLATE (unchanged) ─────────────────────
function buildUserMessage(data) {
  return `
Please analyze this client intake and produce the audit report.

CLIENT: ${data.client_name} — ${data.business_name}

INTAKE RESPONSES:
1. Business type: ${data.biz_type}
2. Team size: ${data.team_size}
3. Tools currently used: ${data.tools_used}
4. Primary revenue activity: ${data.revenue_activity}
5. Repetitive tasks: ${data.repetitive_tasks}
6. Biggest bottleneck: ${data.biggest_bottleneck}
7. Weekly admin hours: ${data.admin_hours}
8. Task they'd eliminate first: ${data.biggest_priority}
9. AI/automation experience: ${data.ai_experience}
10. Monthly software budget: ${data.budget}
11. Goal in 90 days: ${data.goal_90_days}
12. Additional context: ${data.anything_else || 'None provided'}
  `.trim();
}

// ── MAIN ROUTE: POST /submit-audit ─────────────────────────
app.post('/submit-audit', async (req, res) => {
  const data = req.body;

  // 1. Save to Airtable with status "Analyzing"
  let airtableRecord;
  try {
    const records = await base('Submissions').create([{
      fields: {
        status: 'Analyzing',
        client_name: data.client_name,
        client_email: data.client_email,
        client_phone: data.client_phone,
        business_name: data.business_name,
        biz_type: data.biz_type,
        team_size: data.team_size,
        tools_used: data.tools_used,
        revenue_activity: data.revenue_activity,
        repetitive_tasks: data.repetitive_tasks,
        biggest_bottleneck: data.biggest_bottleneck,
        admin_hours: data.admin_hours,
        biggest_priority: data.biggest_priority,
        ai_experience: data.ai_experience,
        budget: data.budget,
        goal_90_days: data.goal_90_days,
        anything_else: data.anything_else || '',
      }
    }]);
    airtableRecord = records[0];
    console.log('Saved to Airtable:', airtableRecord.id);
  } catch (err) {
    console.error('Airtable save failed:', err.message);
    return res.status(500).json({
      error: 'Failed to save submission',
      detail: err.message || undefined
    });
  }

  // 2. Call Qwen with system message + formatted intake
  let analysis;
  try {
    const response = await qwen.chat.completions.create({
      model: 'qwen3.5-plus',            // ← Swap to 'qwen-turbo' (cheaper) or 'qwen-max' (smarter)
      max_tokens: 2000,
      messages: [
        {
          role: 'system',            // ← System message goes here
          content: AUDIT_SYSTEM_MESSAGE
        },
        {
          role: 'user',              // ← Formatted intake goes here
          content: buildUserMessage(data)
        }
      ]
    });
    analysis = response.choices[0].message.content;
    console.log('Qwen analysis complete');
  } catch (err) {
    console.error('Qwen call failed:', err.message);
    try {
      await base('Error_Logs').create([{ fields: {
        submission: [airtableRecord.id],
        error_message: err.message,
        stage: 'Submission'
      }}]);
    } catch (logErr) {
      console.error('Error_Logs write failed:', logErr.message);
    }
    return res.status(500).json({ error: 'Analysis failed', detail: err.message });
  }

  // 3. Write Qwen's response back to Airtable (unchanged)
  try {
    await base('Submissions').update(airtableRecord.id, {
      claude_analysis: analysis,     // Airtable field name kept for compatibility; content is Qwen analysis
      status: 'Complete'
    });
    console.log('Analysis saved to Airtable');
  } catch (err) {
    console.error('Airtable update failed:', err.message);
  }

  // 4. Return analysis to frontend (unchanged)
  res.json({
    success: true,
    submission_id: airtableRecord.id,
    analysis: analysis
  });
});

// Serve static portfolio (index.html, projects/, assets/, etc.) — after API routes
app.use(express.static(join(__dirname)));

// ── START SERVER ───────────────────────────────────────────
app.listen(PORT, () => {
  const url = `http://localhost:${PORT}`;
  console.log(`Audit backend + site running at ${url}`);
  open(url).catch(() => console.log('Open in browser:', url));
});