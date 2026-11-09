# WAMS API authentication

All routes mounted under `/api` require a signed access token. The API fails closed: if the identity-provider configuration is missing, tokens cannot be verified and requests receive HTTP 401.

## Required server environment

- `WAMS_AUTH_PUBLIC_KEY`: PEM-encoded RSA public key (PKCS#8/SPKI public-key PEM); literal `\\n` sequences are accepted.
- `WAMS_AUTH_ISSUER`: exact OIDC issuer value expected in the token's `iss` claim.
- `WAMS_AUTH_AUDIENCE`: exact API audience expected in `aud`.

Only RS256 is accepted. Tokens must contain a non-empty `sub`, matching `iss`, matching `aud`, and a future numeric `exp`. Optional `nbf` and `iat` are checked. The API does not accept identity or permissions supplied in request bodies.

## Least-privilege scopes

The following scopes are enforced on all 29 preserved API routes. Where two scopes are listed, both are required.

| API route | Required scope(s) |
|---|---|
| POST /api/wams/energy/grid-alert | wams:energy:operate + wams:data:national |
| POST /api/wams/telecom/mesh-resilience | wams:telecom:operate + wams:data:national |
| POST /api/wams/water/dam-cascade | wams:hydrology:operate + wams:data:national |
| GET /api/wams/telemetry | wams:telemetry:read + wams:data:national |
| POST /api/wams/hydrology/flash-flood | wams:hydrology:operate + wams:data:national |
| POST /api/wams/hydrology/dam-eval | wams:hydrology:operate + wams:data:national |
| GET /api/wams/weather | wams:weather:read |
| GET /api/wams/seismic | wams:seismic:read + wams:data:national |
| GET /api/wams/dams | wams:dams:read + wams:data:national |
| GET /api/wams/hospitals | wams:hospitals:read |
| POST /api/wams/health/hospital-stress | wams:health:operate + wams:data:national |
| POST /api/wams/health/evacuation-plan | wams:health:operate + wams:data:national |
| GET /api/wams/roads | wams:roads:read |
| POST /api/wams/traffic/road-alert | wams:traffic:operate + wams:data:national |
| POST /api/wams/industrial/hazard-alert | wams:industrial:operate + wams:data:national |
| GET /api/wams/aviation | wams:aviation:read + wams:data:national |
| POST /api/wams/aviation/metar-analysis | wams:aviation:operate + wams:data:national |
| GET /api/wams/ports | wams:maritime:read + wams:data:national |
| POST /api/wams/maritime/port-alert | wams:maritime:operate + wams:data:national |
| GET /api/wams/agriculture | wams:agriculture:read + wams:data:national |
| GET /api/wams/sector/:sectorId | wams:sector:read + wams:data:national |
| GET /api/wams/spatial-bbox | wams:spatial:read + wams:data:national |
| POST /api/wams/ingest/weather | wams:weather:ingest + wams:data:national |
| POST /api/wams/agriculture/frost-risk | wams:agriculture:operate + wams:data:national |
| POST /api/ai/query | ai:query:<sector> or ai:query:national |
| POST /api/ai/cascading-risk | ai:cascading-risk:read + wams:data:national |
| GET /api/ai/audit-logs | ai:audit:read |
| GET /api/wams/audit-chain/verify | wams:audit:verify |
| GET /api/ai/health | system:health:read |

AI sector values are restricted to `meteorology`, `geological`, `wildfire`, `hydrology`, `health`, `aviation`, `maritime`, `traffic`, `agriculture`, and `operations`. A sector-specific scope cannot query another sector; `ai:query:national` is an explicitly broader privilege.

Weather, hospital, and road list endpoints are restricted to the governorate in the verified token. Requests for another governorate are denied unless the token also has `wams:data:national`. Other cross-governorate or national-wide endpoints require `wams:data:national` explicitly.

Scopes may be supplied in the OIDC `scope` claim (space-delimited) or `permissions` claim (array). The identity provider must issue only the scopes approved for the user's assigned role and organization.

## Client integration gate

The repository does not yet contain a configured OIDC client/login flow. Do not place a private signing key in the browser and do not invent a client-side role. The frontend must obtain an access token from the selected trusted identity provider and send it as `Authorization: Bearer <access_token>`. Until that provider and client flow are configured, protected API calls correctly return 401; this is not an operationally complete login experience.

## Test coverage

`server/security/apiAuth.test.ts` exercises anonymous rejection, missing-scope rejection, valid scoped access for every API route, invalid signatures, and expired tokens using an ephemeral test key pair. These tests use no production credentials or database and do not modify data.
