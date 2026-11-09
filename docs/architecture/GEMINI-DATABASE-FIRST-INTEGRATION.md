# Gemini Database-First Integration Architecture

**Status:** Architecture proposal / implementation gate  
**Scope:** WAMS (CAP-2029) only  
**Branch:** `ai/gemini-database-first-architecture`

## 1. Non-negotiable operating principle

WAMS-owned and explicitly approved data sources are the sole source of operational facts. Gemini is an advisory analysis provider only. It must not be treated as a sensor, observation source, forecast authority, system operator, or database.

- WAMS retrieves and validates data.
- Domain services perform deterministic/scientific calculations.
- Gemini interprets only the minimum approved evidence supplied by WAMS.
- WAMS validates and records the response.
- Authorized human officials retain responsibility for official warnings and operational decisions.

## 2. Findings from the inspected main-branch files

Inspected at base commit `ef17a215d7e056ce6c0c1b36f5e4ecdd71a31f5c`:

- `package.json` declares `@google/genai`, `express`, and `dotenv`. A dependency declaration does not establish an implemented or secure integration.
- `.env.example` contains a placeholder `GEMINI_API_KEY="MY_GEMINI_API_KEY"`. This is not a secret and must never be replaced with a real key in a committed file.
- `src/App.tsx` initializes alerts and data sources from `mockAlerts` and `mockDataSources`. This path is currently demonstration data, not proof of a production database connection.
- `src/components/views/ApiAndHealthView.tsx` fabricates API responses in the browser with `setTimeout`. The displayed HTTP-like responses are not evidence of a live backend.
- `vite.config.ts` configures the Vite frontend. The inspected application entry point is a React browser application.
- No implemented .NET backend, Gemini gateway, approved read-only data service, or evidence-validation service was established by this focused inspection.
- Repository code search was unavailable because the repository search index was not enabled. Therefore, this report does not claim an exhaustive proof that no other Gemini call exists. A full repository-wide source scan and dependency audit remain required before implementation.

## 3. Required target architecture

```text
React / WAMS UI
      |
      v
ASP.NET Core API
      |
      +--> Authentication / Authorization / tenant & agency scope
      |
      +--> Domain APIs (read-only for AI retrieval)
      |       |
      |       +--> approved WAMS data stores and validated data providers
      |
      +--> Scientific/domain calculation services
      |
      +--> AI orchestration / Gemini Gateway
              |
              +--> data minimization and redaction
              +--> prompt-injection boundary
              +--> Gemini API (server-side only)
              +--> structured output validation
              +--> evidence-reference validation
              +--> audit, quotas, timeout and usage controls
```

The Gemini Gateway must not have database credentials or direct network access to database endpoints. It receives a bounded evidence package from authorized WAMS services.

## 4. Data authority and evidence contract

Every evidence item sent to Gemini should carry, where available:

- `sourceSystem`
- `dataset`
- `recordId` or stable reference
- `observedAt` and `ingestedAt`
- `validFrom` and `validTo` for time-bounded products
- `location` / station or geographic reference
- `units`
- `qualityFlags`
- `validationStatus`
- `provenance`

Every AI response must distinguish:

1. facts copied from supplied evidence;
2. outputs produced by deterministic scientific/domain services;
3. AI-generated interpretation;
4. recommendations requiring human review.

The response must cite supplied evidence identifiers. A citation that does not resolve to an item in the request evidence package must be rejected or marked unsupported. Missing, stale, conflicting, or insufficient data must produce an explicit insufficiency result rather than a guessed answer.

## 5. Allowed capabilities

Gemini may:
- summarize authorized evidence;
- compare time periods and geographic areas represented in supplied data;
- explain results produced by WAMS scientific services;
- identify candidate anomalies for human review;
- draft internal reports and situation summaries;
- propose questions or scenarios for domain experts;
- return structured advisory outputs with uncertainty and limitations.

Gemini must not:
- create, update, or delete operational records;
- execute SQL or arbitrary code;
- query the database directly;
- publish, amend, or cancel official CAP alerts;
- issue evacuation, dispatch, medical, aviation, port, or other operational commands;
- control sensors, stations, vehicles, or field equipment;
- bypass user, agency, regional, or data-classification permissions;
- invent observations, event records, sources, or confidence values.

## 6. Safe tool/function-calling pattern

Function calling is a request proposal, not authorization. The model may request only a fixed allowlist of read-only WAMS functions. The backend must independently validate the authenticated user, agency scope, region, query bounds, requested fields, rate limits, and data classification before execution.

Initial candidate tools (not yet implemented):
- `get_weather_observations`
- `get_active_weather_alerts`
- `get_earthquake_reports`
- `get_wildfire_incidents`
- `get_flood_risk_areas`
- `get_airport_weather_status`
- `get_port_conditions`
- `get_road_hazards`
- `generate_national_risk_summary`

Do not expose a generic SQL tool, arbitrary URL fetch, unrestricted file access, or write-capable function to Gemini.

## 7. API contract proposal

Proposed endpoint (not yet implemented):

`POST /api/v1/ai/analysis`

Request:
- `question`
- `domain`
- optional bounded time range and geographic scope
- optional output format

The server derives user identity and permissions from the authenticated session; the client must not be trusted to assert roles or agency scope.

Response:
- `analysisId`
- `status` (completed / insufficient_data / unavailable / rejected)
- `summary`
- `findings[]`
- `evidenceRefs[]`
- `uncertainty`
- `limitations[]`
- `humanReviewRequired`
- `modelProvider` and model identifier
- timestamps

Do not return chain-of-thought or hidden reasoning. Return concise conclusions, evidence, and uncertainty.

## 8. Security and privacy controls

- Keep the Gemini key in a server-side secret manager or protected runtime secret.
- Never expose the key in React, Vite `VITE_*` variables, browser bundles, source maps, logs, or Git history.
- Do not commit real secrets or production data.
- Use OIDC/MFA where applicable, least privilege, and agency/region-level authorization.
- Minimize and redact personal, health, security-sensitive, and operationally sensitive data before external processing.
- Require institutional, legal, and privacy review before sending protected data to a third-party AI provider.
- Treat retrieved documents, alerts, user prompts, and tool outputs as untrusted input; defend against prompt injection.
- Apply timeouts, bounded retries, rate limits, quotas, cost monitoring, and safe failure behavior.
- Log the analysis ID, requesting principal, permitted data references, provider/model, outcome, and review actions without logging secrets or unnecessary sensitive payloads.
- AI outage must not interrupt core WAMS alerting or domain workflows.

## 9. Implementation sequence and gates

1. Complete repository-wide inventory of all Gemini imports, API calls, environment variables, routes, and build-time exposure.
2. Confirm the authoritative WAMS data stores and existing backend/API contracts. Do not infer a schema.
3. Obtain review and explicit approval of the data model and any required schema changes before modifying a database.
4. Implement ASP.NET Core authentication and authorization boundaries.
5. Implement approved read-only domain query services.
6. Implement a provider-neutral AI interface and server-side Gemini adapter.
7. Implement evidence packaging, redaction, structured response validation, and evidence-reference checks.
8. Add a UI that clearly labels outputs as advisory and shows their evidence.
9. Add security, privacy, prompt-injection, authorization, resilience, and cost-control tests.
10. Pilot only with synthetic or explicitly approved non-sensitive data; require agency/domain expert acceptance before operational use.

## 10. Acceptance criteria

- No Gemini key or direct Gemini API call exists in the browser bundle.
- Gemini has no database credentials and cannot perform database writes.
- All AI data retrieval is mediated by authenticated, authorized WAMS services.
- Every factual claim in an AI response is either linked to supplied evidence or explicitly labeled as interpretation/unsupported.
- Insufficient or stale evidence is surfaced rather than fabricated.
- Official warning lifecycle and operational decisions remain under existing authorized human workflows.
- Core WAMS workflows remain functional when Gemini is unavailable.
- Automated tests cover authorization boundaries, data minimization, prompt injection, evidence validation, secret scanning, quotas, and failure modes.
- No production database or schema is changed as part of this architecture-only phase.

## 11. Explicit non-goals for this change

This branch documents architecture only. It does not:
- add a Gemini API key;
- make external Gemini API calls;
- connect to or modify any database;
- create a production .NET backend;
- claim that mock data or simulated API calls are live;
- connect METRA or another external project;
- publish official alerts or operational decisions.
