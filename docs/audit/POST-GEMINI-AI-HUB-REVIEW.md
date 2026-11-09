# Post-Implementation Review: Gemini AI Intelligence Hub

**Review date:** 2026-11-09  
**Reviewed main commit:** `4c43583014347183b0ca5bed8a7ea29de361e84c`  
**Previous baseline:** `ef17a215d7e056ce6c0c1b36f5e4ecdd71a31f5c`  
**Scope:** New Gemini gateway, Express routes, WAMS data store, AI UI, and CI configuration.  
**Disposition:** Not approved for operational or sensitive-data use.

## Executive summary

The new change is a meaningful prototype step: Gemini is called from a server-side Express module rather than directly from the React component, and the UI has a dedicated national intelligence view. However, the current implementation does **not** satisfy the database-first requirement for operational use.

The principal blockers are: hard-coded demonstration data instead of a verified database/provider integration; unauthenticated API routes; client-controlled identity context; non-persistent audit logs; unvalidated model-supplied evidence; fabricated fallback/simulation outputs; and transmission of the entire cross-sector snapshot to Gemini without data-classification filtering.

No application code, database, schema, secret, or production configuration was changed during this review.

## Findings

### P0 — Blockers before any operational deployment

#### P0.1 — No authenticated authorization boundary on API routes

File: `server/routes.ts`

The routes `/wams/telemetry`, `/wams/weather`, `/wams/seismic`, `/wams/dams`, `/wams/hospitals`, `/wams/roads`, `/wams/aviation`, `/wams/ports`, `/wams/agriculture`, `/ai/query`, `/ai/cascading-risk`, `/ai/audit-logs`, and `/ai/health` are registered without visible authentication or authorization middleware.

The AI query route accepts `userContext` from the request body. The UI currently supplies a fixed role and governorate. Client-provided role, identity, and region are untrusted and cannot establish authorization.

**Impact:** If deployed as-is, callers may read all exposed sector data, submit analyses, and read audit entries without an enforced user/agency/region boundary.

**Required remediation:** Add server-validated OIDC/session authentication and per-request authorization. Derive principal, role, agency, region, and data scope from verified server-side claims; ignore client-supplied identity context. Deny by default.

#### P0.2 — The “verified operational data store” is hard-coded fixture data

File: `server/wamsDataStore.ts`

The store initializes weather stations, seismic events, wildfire incidents, dams, hospitals, roads, aviation, ports, and agricultural records as literal arrays in source code. Weather timestamps are assigned with `new Date().toISOString()` when the process starts. The inspected implementation does not demonstrate a database adapter, telemetry ingestion client, source authentication, provenance validation, or freshness validation.

The comment calling the data “verified” is not proof of operational provenance.

**Impact:** The AI hub can present illustrative values as current national observations. This violates the database-first requirement.

**Required remediation:** Mark all fixtures visibly and programmatically as DEMO/SYNTHETIC; prohibit them in operational mode. Define source/provider interfaces and connect only after the real data stores, ownership, schemas, and authorized feeds have been reviewed and approved. Each record must carry source, observation time, ingestion time, quality flags, and validation status.

#### P0.3 — Cross-sector snapshot is sent wholesale to Gemini

File: `server/geminiGateway.ts`, method `analyzeWithGrounding`

The implementation serializes the entire `getNationalOperationalSnapshot()` into the Gemini prompt. This snapshot includes cross-sector data, including hospital readiness and other operational information. There is no visible data-classification policy, user-scope filtering, field-level minimization, or redaction step before the external API call.

**Impact:** Potential disclosure of restricted health, infrastructure, and operational information to an external provider.

**Required remediation:** Build an allowlisted evidence package per authenticated user, sector, purpose, and data classification. Default-deny restricted/sensitive data. Require institutional, legal, and privacy approval before any protected data is sent externally. Minimize fields and redact identifiers where possible.

#### P0.4 — Fallback analysis fabricates or hard-codes operational claims

File: `server/geminiGateway.ts`, method `generateGroundedFallbackAnalysis`

The fallback returns fixed narrative values and claims not derived from the supplied records or deterministic calculation services. Examples include fixed visibility claims, CAPE and PostGIS areas, pressure comparisons, named model results, fixed confidence percentages (e.g. 98.4), and fixed missing-data messages. Several recommendations and sector narratives are hard-coded. Some values may happen to resemble fixture values, but no calculation/provenance path is established for the claims.

**Impact:** When Gemini is unavailable or the key is missing, the system can still display unsupported claims as grounded analysis.

**Required remediation:** Replace the fallback with a strict “AI unavailable” response or a separately implemented deterministic service whose outputs are demonstrably calculated from validated inputs. Never return illustrative values in operational mode. Do not assign confidence scores unless calibrated and supported by a documented method.

#### P0.5 — Evidence from Gemini is not validated against supplied records

File: `server/geminiGateway.ts`, method `analyzeWithGrounding`

The response is parsed using `JSON.parse`, but the implementation does not validate each `operationalEvidence.recordId` against the actual snapshot or validate source/value correspondence. It then assigns `dataSourcesUsed` from the first five weather stations regardless of the selected sector. It accepts the model's confidence value and analytical content without a schema/evidence-reference validation layer.

**Impact:** The UI can display fabricated record IDs, incorrect sources, unsupported measurements, or misleading confidence as if verified by WAMS.

**Required remediation:** Validate the complete response against a strict schema, resolve every evidence reference against the request evidence package, reject unknown IDs, and distinguish AI interpretation from observed facts and deterministic model outputs. If a claim cannot be grounded, label it unsupported or omit it.

### P1 — High-priority correctness and security issues

#### P1.1 — Function declarations are defined but not wired into the Gemini request

File: `server/geminiGateway.ts`

The class defines `getFunctionDeclarations()` and `executeToolLocally()`, but the inspected `generateContent` request sends a full serialized snapshot and does not pass tool declarations or execute a validated function-call cycle.

**Impact:** The implementation does not yet provide the bounded, read-only function-calling architecture described in its comments. It instead sends the full snapshot.

**Required remediation:** Either remove unused tool-calling scaffolding or implement a strict allowlisted tool loop. The backend must validate every proposed tool, arguments, user scope, query limits, and classification before executing it. No generic SQL or write tools.

#### P1.2 — Prompt-injection protection is a keyword blocklist

File: `server/geminiGateway.ts`, method `sanitizeInput`

The current protection uses a small set of regular expressions against the user prompt. This does not protect against indirect prompt injection in retrieved records, documents, or data fields, and cannot serve as an authorization boundary.

**Required remediation:** Treat all user and retrieved content as untrusted data; isolate it from system instructions; do not rely on keyword matching for security; enforce capabilities server-side and validate tool calls independently.

#### P1.3 — Audit log is in-memory and not immutable/persistent

File: `server/geminiGateway.ts`

Audit records are stored in a process-local array capped at 200 entries. `userId` is populated from `userContext.role`, and `clientIp` is hard-coded to `127.0.0.1`. The `/ai/audit-logs` route exposes the array without visible authorization.

**Impact:** Logs disappear on restart, do not identify the actual principal/client, and are neither append-only nor access-controlled.

**Required remediation:** Persist audit events to an approved append-only audit store; derive principal and request metadata server-side; apply access controls and retention policies; avoid logging secrets or sensitive payloads.

#### P1.4 — Cascading-risk “simulation” is hard-coded

File: `server/geminiGateway.ts`, method `evaluateCascadingRisk`

The method returns fixed hazard stages, probabilities, locations, data-grounding strings, and operational interventions. Although it obtains a snapshot, the returned scenario values are not calculated from it; the trigger only populates a label.

**Impact:** The interface may imply a live simulation and evidence-based probability estimates when it is actually a static demonstration.

**Required remediation:** Label as a static demo until a validated simulation engine exists. Implement model inputs, versioning, calibration, scenario assumptions, and reproducible outputs before operational use. Do not display unsupported probability percentages.

#### P1.5 — Gateway health reports a healthy state without checking dependency health

File: `server/routes.ts`

The health endpoint reports `gateway.status: healthy` and a mode inferred only from whether an environment variable exists. It does not establish successful authentication, valid credentials, API reachability, database readiness, or provider health. The model name is also hard-coded.

**Required remediation:** Separate liveness and readiness checks, do not expose sensitive configuration, and report Gemini connectivity only after a safe bounded health probe. Never equate “key exists” with provider health.

#### P1.6 — AI UI sends hard-coded user identity context

File: `src/components/views/WAMSIntelligenceHubView.tsx`

The browser sends `userContext: { role: 'operations_officer', governorate: 'اللاذقية' }`. This is not an authenticated identity and must not be trusted by the backend.

**Required remediation:** Remove this field from the client request. Obtain identity and permitted scope from authenticated server context.

#### P1.7 — Production start command and CI runtime are inconsistent

Files: `package.json`, `.github/workflows/ci.yml`

The start script is `node server.ts`, while the CI workflow uses Node 20 and the dev script uses `tsx server.ts`. Standard Node 20 does not execute TypeScript entry points directly. The production build script runs `vite build`, which builds the frontend and does not compile the Express TypeScript server.

**Required remediation:** Compile the server to JavaScript as part of a production build and start the compiled output, or explicitly adopt and test a supported runtime strategy. Keep dev and production commands distinct.

#### P1.8 — CI uses npm ci but no package-lock.json is present

Files: `.github/workflows/ci.yml`, `package.json`, `bun.lock`

The repository contains `bun.lock`, while the workflow runs `npm ci`. The inspected main branch has no `package-lock.json`. npm ci requires an npm lockfile and is expected to fail in this configuration.

**Required remediation:** Choose one package manager consistently. Either commit a reviewed package-lock and use npm ci, or use Bun with a pinned version and frozen-lockfile installation.

## Positive changes observed

- Gemini SDK use is in a server-side module rather than imported directly into React.
- The API key is read from the server environment, not from a Vite-prefixed client variable in the inspected gateway.
- The UI has a dedicated national intelligence hub and sector navigation.
- The system prompt states advisory-only and several domain safety limits.
- A deterministic calculation/data-service boundary is a reasonable future architecture, provided its inputs and provenance are real and validated.

These positives do not offset the P0 blockers.

## CI / validation status

- The inspected latest commit is `4c43583014347183b0ca5bed8a7ea29de361e84c`.
- GitHub combined commit status returned no status entries.
- The available commit-workflow lookup is limited to pull-request-triggered runs; it returned no runs for this commit. Therefore, this review does not claim that all push-triggered workflows are absent or that tests passed.
- No local build, typecheck, or test run was performed as part of this source review.
- The CI workflow's `npm ci` versus missing `package-lock.json` mismatch is a source-level blocker independent of test results.

## Recommended remediation order

1. Disable or restrict all AI and data API routes until authentication/authorization is implemented.
2. Put all hard-coded fixtures and canned fallback/simulation outputs behind explicit DEMO mode; prevent them from being represented as live operational data.
3. Define and approve actual WAMS data sources, schemas, classifications, and read-only access contracts.
4. Add authenticated identity, agency/region scoping, and field-level data minimization before Gemini calls.
5. Implement strict structured-output and evidence-reference validation.
6. Persist protected audit events with server-derived principal and request metadata.
7. Implement or remove the unused function-calling code.
8. Correct production TypeScript build/start and align CI with the committed lockfile/package manager.
9. Add tests for unauthenticated access, authorization boundaries, data minimization, fake evidence rejection, fallback labeling, prompt injection, audit persistence, provider outage, and no-write guarantees.
10. Re-run typecheck, tests, build, dependency/security scans, and browser/API integration tests on the resulting remediation branch.

## Explicit boundaries

This review does not authorize or perform database schema changes, production data access, external Gemini calls, API-key configuration, or integration with METRA or any other project. The existing database must remain untouched until its schema and data ownership are reviewed and approved.
