# CAP-2029 / WAMS — Initial Technical Audit

**Date:** 2026-11-09  
**Scope:** Read-only source review of the current `main` snapshot, followed by this audit document on a dedicated branch.  
**Repository:** `gfa437926-tech/CAP-2029`  
**Reviewed baseline:** `b05c6c18f51024326809fe15d4c698ae32945f95` (reported repository HEAD at review start).  
**Branch:** `audit/initial-technical-review`

> This is a source-level audit, not a production-readiness certification. No database, secrets, deployment configuration, or production data were changed. A local dependency install, build, lint, and browser test have not yet been run.

## Executive assessment

The repository contains a substantial WAMS interface prototype and a broad set of operational screens. However, the current application is still a front-end demonstration: critical workflows are simulated in browser state, several security and infrastructure claims are visual placeholders, and CAP XML handling is not a standards-compliant parser/validator. It must not be used to issue real public warnings until the blocking items below are addressed.

## Findings

### P0 — Must fix before any real operational use

1. **No effective authentication or authorization**
   - `LoginView` accepts the form and calls `onLoginSuccess()`; the displayed email, password, and MFA code are not authenticated or verified.
   - Navigation and actions are not protected by server-enforced permissions.
   - User/role screens use mock data and local component state.
   - **Risk:** anyone able to access the UI can enter the application; UI role labels do not enforce access control.

2. **Alert lifecycle is not persisted or server-authoritative**
   - `App.tsx` initializes alerts from `mockAlerts` and performs create, edit, submit, approve, publish, and cancel through `setAlerts`.
   - Approval/publisher identities are hard-coded in handlers.
   - **Risk:** data is lost on refresh and lifecycle transitions can be forged by a modified client.

3. **CAP XML validation is insufficient for production**
   - `CapImportView.tsx` extracts elements using regular expressions rather than a namespace-aware XML parser and the official CAP 1.2 schema.
   - It does not establish full schema validity, signature/trust of sender, replay protection, or robust handling of XML namespaces and malformed input.
   - A missing polygon can be replaced with hard-coded sample coordinates when converting to a draft.
   - **Risk:** incorrect or fabricated geography and acceptance of malformed/untrusted warning messages.

4. **Review/approval controls are not reliable**
   - The Stage 1 checklist starts with all ten items marked reviewed, and its default notes assert that the review is complete.
   - The review rejection callback in `App.tsx` discards the supplied reason and simply changes the status back to draft.
   - Review UI presents GIS/quality checks as successful static statements rather than results from actual validation.
   - **Risk:** false sign-off, loss of rejection rationale, and approval based on unverified checks.

### P1 — Required before pilot deployment

5. **API console is a simulation**
   - `ApiAndHealthView.tsx` fabricates HTTP 200 responses using a timer and hard-coded payloads; it does not call a backend.
   - Latency, rate limits, ETag and service status labels are not measured.
   - **Risk:** operators may mistake demonstration output for live service telemetry.

6. **GIS is not yet a production GIS implementation**
   - `GISMapCanvas.tsx` draws a simplified canvas illustration with hard-coded geographic bounds/cities; it is not backed by authoritative map tiles or spatial services.
   - The declared `activeLayers` prop is not used in the inspected implementation; local layer toggles are maintained separately.
   - **Risk:** map presentation and layer state can mislead operators; geographic editing needs robust projection, validation and persistence.

7. **Administrative regions and settings are local-only**
   - Regions and settings are initialized in component state; the settings save action only displays a success toast.
   - The UI claims PostGIS boundaries are saved although the inspected view uses local sample records.
   - **Risk:** configuration changes are not durable and displayed status overstates implementation.

8. **Audit log and notification outbox need server-side guarantees**
   - These screens are rendered as views, but the current application state architecture does not demonstrate append-only audit persistence, transactional outbox processing, retries, deduplication, or delivery receipts.
   - **Risk:** warning publication may not be traceable or reliably delivered.

### P2 — Engineering quality and release controls

9. **No CI evidence yet**
   - At review time the repository had no visible workflow runs and no PRs.
   - `package.json` defines `build` and `lint` (TypeScript no-emit), but these commands have not been executed in this audit.
   - Add CI for dependency install, typecheck, production build, unit tests, security/dependency scanning, and browser tests.

10. **Operational data and demo identities are embedded in source**
    - `mockData.ts` contains illustrative users, institutional-looking email addresses, warning records, and geographic examples.
    - Keep all demo data clearly labelled and prevent it from being mistaken for live operational information.

## Recommended implementation sequence

1. Establish baseline checks: install from lockfile (if present), run typecheck and production build, record exact failures.
2. Add automated tests around alert lifecycle, state transitions, rejection reasons, CAP parsing and geographic validation.
3. Define the backend/API contract and threat model before connecting any database.
4. Implement real identity, MFA, server-side RBAC, separation of duties, and session security.
5. Implement durable alert lifecycle with versioning, concurrency controls, immutable audit events, and transactional publishing/outbox.
6. Replace regex CAP parsing with a hardened namespace-aware parser and official CAP 1.2 XSD validation; reject missing/invalid geometry instead of inserting fallback coordinates.
7. Replace simulated API/health views with real authenticated service calls and measured health checks.
8. Integrate authoritative GIS data and server-side geometry validation.
9. Add CI and browser regression tests; require green checks before merge.

## Safety and change boundary

- No database has been connected or modified.
- No secrets were requested, read, or added.
- No changes were made to `main`.
- This branch contains only this audit report.
- Database schema creation, migrations, production credentials, identity-provider configuration, and live warning publication remain gated on explicit review and approval.

## Verification status

| Check | Status |
|---|---|
| Source review of key application, navigation, alert, CAP, GIS, login, settings and API views | Completed (partial source-level scope) |
| Dedicated audit branch | Created |
| Audit report committed | Pending at time of report creation |
| Dependency installation | Not run |
| TypeScript lint/typecheck | Not run |
| Production build | Not run |
| Unit/browser tests | Not run |
| Backend/database integration | Not present / not tested |
