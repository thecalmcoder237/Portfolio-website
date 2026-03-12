# Audit tool backend

Node/Express backend for the AI Business Development Audit. Uses **Qwen** (Alibaba DashScope) via the OpenAI-compatible API and **Airtable** for submissions and error logs.

## Stack

- **Node** (ESM), **Express**, **OpenAI SDK** (pointed at Qwen’s compatible endpoint), **Airtable**, **dotenv**, **cors**

## Run

```bash
npm start
```

Server: **http://localhost:3001** (override with `AUDIT_PORT` in `.env`). Use **GET /health** to confirm the audit backend is responding.

## Environment

| Variable | Description |
|----------|-------------|
| `QWEN_API_KEY` | DashScope API key from dashscope.aliyuncs.com |
| `AIRTABLE_API_KEY` | Airtable personal access token |
| `AIRTABLE_BASE_ID` | Airtable base ID |
| `AUDIT_PORT` | Optional; default 3001 |

Copy `.env.example` to `.env` and fill in values. Do not commit `.env`.

## API

**POST /submit-audit**

Request body: JSON with intake fields (`client_name`, `business_name`, `biz_type`, `team_size`, `tools_used`, `revenue_activity`, `repetitive_tasks`, `biggest_bottleneck`, `admin_hours`, `biggest_priority`, `ai_experience`, `budget`, `goal_90_days`, `anything_else`; optional `client_email`, `client_phone`).

Flow: save to Airtable (status “Analyzing”) → call Qwen (`qwen-plus`) → update Airtable (status “Complete”, analysis in `claude_analysis`) → return `{ success, submission_id, analysis }`.

## Model

Default model: `qwen-plus`. To change, edit `model` in `server.js` (e.g. `qwen-turbo`, `qwen-max`, `qwen2.5-72b-instruct`).

## Testing

**Run the server in one terminal** (`npm start`), then in **a second terminal** run:

```powershell
$body = @{
  client_name = "Test"
  business_name = "Test Co"
  biz_type = "Real estate"
  team_size = "2-5"
  tools_used = "Excel"
  revenue_activity = "Property sales"
  repetitive_tasks = "Emails"
  biggest_bottleneck = "Reports"
  admin_hours = "10-20 hrs"
  biggest_priority = "Deal analysis"
  ai_experience = "Never used"
  budget = "$50-200"
  goal_90_days = "Save time"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3001/submit-audit" -Method Post -Body $body -ContentType "application/json"
```

Success: response includes `success: true`, `submission_id`, and `analysis`. Check Airtable for the new submission and analysis text.
