# WAMS API authentication

All routes mounted under `/api` require a signed access token. The API fails closed: if the identity-provider configuration is missing, tokens cannot be verified and requests receive HTTP 401.

## Required server environment

- `WAMS_AUTH_PUBLIC_KEY`: PEM-encoded RSA public key (PKCS#8/SPKI public-key PEM); literal `\\n` sequences are accepted.
- `WAMS_AUTH_ISSUER`: exact OIDC issuer value expected in the token's `iss` claim.
- `WAMS_AUTH_AUDIENCE`: exact API audience expected in `aud`.

Only RS256 is accepted. Tokens must contain a non-empty `sub`, matching `iss`, matching `aud`, and a future numeric `exp`. Optional `nbf` and `iat` are checked. The API does not accept identity or permissions supplied in request bodies.

## Least-privilege scopes

| API route | Required scope |
|---|---|
| GET /api/wams/telemetry | wams:telemetry:read |
| GET /api/wams/weather | wams:weather:read |
| GET /api/wams/seismic | wams:seismic:read |
| GET /api/wams/dams | wams:dams:read |
| GET /api/wams/hospitals | wams:hospitals:read |
| GET /api/wams/roads | wams:roads:read |
| GET /api/wams/aviation | wams:aviation:read |
| GET /api/wams/ports | wams:ports:read |
| GET /api/wams/agriculture | wams:agriculture:read |
| POST /api/ai/query | ai:query:<sector> or ai:query:national |

AI sector values are restricted to `meteorology`, `geological`, `wildfire`, `hydrology`, `health`, `aviation`, `maritime`, `traffic`, `agriculture`, and `operations`. A sector-specific scope cannot query another sector; `ai:query:national` is an explicitly broader privilege.
| POST /api/ai/cascading-risk | ai:cascading-risk:read |
| GET /api/ai/audit-logs | ai:audit:read |
| GET /api/ai/health | system:health:read |

Scopes may be supplied in the OIDC `scope` claim (space-delimited) or `permissions` claim (array). The identity provider must issue only the scopes approved for the user's assigned role and organization.

## Client integration gate

The repository does not yet contain a configured OIDC client/login flow. Do not place a private signing key in the browser and do not invent a client-side role. The frontend must obtain an access token from the selected trusted identity provider and send it as `Authorization: Bearer <access_token>`. Until that provider and client flow are configured, protected API calls correctly return 401; this is not an operationally complete login experience.

## Test coverage

`server/security/apiAuth.test.ts` exercises anonymous rejection, missing-scope rejection, valid scoped access for every API route, invalid signatures, and expired tokens using an ephemeral test key pair. These tests use no production credentials or database and do not modify data.
