import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { generateKeyPairSync, createSign } from 'node:crypto';
import express from 'express';
import type { Server } from 'node:http';
import { apiRouter } from '../routes';

const issuer = 'https://identity.example.test/';
const audience = 'wams-api';
const { publicKey, privateKey } = generateKeyPairSync('rsa', { modulusLength: 2048 });
process.env.WAMS_AUTH_PUBLIC_KEY = publicKey.export({ type: 'spki', format: 'pem' }).toString();
process.env.WAMS_AUTH_ISSUER = issuer;
process.env.WAMS_AUTH_AUDIENCE = audience;

function token(scopes: string[], overrides: Record<string, unknown> = {}): string {
  const encode = (value: unknown) => Buffer.from(JSON.stringify(value)).toString('base64url');
  const header = encode({ alg: 'RS256', typ: 'JWT' });
  const payload = encode({
    sub: 'test-operator-001',
    governorate: 'اللاذقية',
    iss: issuer,
    aud: audience,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 300,
    scope: scopes.join(' '),
    ...overrides
  });
  const input = header + '.' + payload;
  const signer = createSign('RSA-SHA256');
  signer.update(input);
  signer.end();
  return input + '.' + signer.sign(privateKey).toString('base64url');
}

const endpoints: Array<{ method: 'GET' | 'POST'; path: string; scope: string; body?: unknown }> = [
  { method: 'GET', path: '/api/wams/telemetry', scope: 'wams:telemetry:read wams:data:national' },
  { method: 'GET', path: '/api/wams/weather', scope: 'wams:weather:read' },
  { method: 'GET', path: '/api/wams/seismic', scope: 'wams:seismic:read' },
  { method: 'GET', path: '/api/wams/dams', scope: 'wams:dams:read' },
  { method: 'GET', path: '/api/wams/hospitals', scope: 'wams:hospitals:read' },
  { method: 'GET', path: '/api/wams/roads', scope: 'wams:roads:read' },
  { method: 'GET', path: '/api/wams/aviation', scope: 'wams:aviation:read' },
  { method: 'GET', path: '/api/wams/ports', scope: 'wams:ports:read' },
  { method: 'GET', path: '/api/wams/agriculture', scope: 'wams:agriculture:read' },
  { method: 'POST', path: '/api/ai/query', scope: 'ai:query:operations', body: { prompt: 'اختبار مصادقة فقط', sector: 'operations' } },
  { method: 'POST', path: '/api/ai/cascading-risk', scope: 'ai:cascading-risk:read', body: { triggerHazard: 'test' } },
  { method: 'GET', path: '/api/ai/audit-logs', scope: 'ai:audit:read' },
  { method: 'GET', path: '/api/ai/health', scope: 'system:health:read' }
];

describe('WAMS API authentication and authorization', () => {
  let server: Server;
  let baseUrl: string;

  beforeAll(async () => {
    const app = express();
    app.use(express.json());
    app.use('/api', apiRouter);
    server = app.listen(0);
    await new Promise<void>(resolve => server.once('listening', resolve));
    const address = server.address();
    if (!address || typeof address === 'string') throw new Error('Test server did not bind a TCP port');
    baseUrl = 'http://127.0.0.1:' + address.port;
  });

  afterAll(async () => {
    if (server) await new Promise<void>((resolve, reject) => server.close(error => error ? reject(error) : resolve()));
  });

  it.each(endpoints)('$method $path rejects anonymous requests', async endpoint => {
    const response = await fetch(baseUrl + endpoint.path, {
      method: endpoint.method,
      headers: endpoint.body ? { 'content-type': 'application/json' } : undefined,
      body: endpoint.body ? JSON.stringify(endpoint.body) : undefined
    });
    expect(response.status).toBe(401);
    expect((await response.json()).code).toBe('UNAUTHENTICATED');
  });

  it.each(endpoints)('$method $path rejects authenticated users without its scope', async endpoint => {
    const response = await fetch(baseUrl + endpoint.path, {
      method: endpoint.method,
      headers: {
        authorization: 'Bearer ' + token(['unrelated:read']),
        ...(endpoint.body ? { 'content-type': 'application/json' } : {})
      },
      body: endpoint.body ? JSON.stringify(endpoint.body) : undefined
    });
    expect(response.status).toBe(403);
    expect((await response.json()).code).toBe('FORBIDDEN');
  });

  it.each(endpoints)('$method $path accepts a valid token with its exact scope', async endpoint => {
    const response = await fetch(baseUrl + endpoint.path, {
      method: endpoint.method,
      headers: {
        authorization: 'Bearer ' + token([endpoint.scope]),
        ...(endpoint.body ? { 'content-type': 'application/json' } : {})
      },
      body: endpoint.body ? JSON.stringify(endpoint.body) : undefined
    });
    expect(response.status).toBe(200);
  });

  it('ignores client-supplied AI identity and audits the verified token subject', async () => {
    const response = await fetch(baseUrl + '/api/ai/query', {
      method: 'POST',
      headers: {
        authorization: 'Bearer ' + token(['ai:query:operations']),
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        prompt: 'اختبار ربط هوية المستخدم',
        sector: 'operations',
        userContext: { role: 'system_admin', governorate: 'دمشق', userId: 'forged-user' }
      })
    });
    expect(response.status).toBe(200);

    const audit = await fetch(baseUrl + '/api/ai/audit-logs', {
      headers: { authorization: 'Bearer ' + token(['ai:audit:read']) }
    });
    expect(audit.status).toBe(200);
    const payload = await audit.json() as { data: Array<{ userId: string }> };
    expect(payload.data[0]?.userId).toBe('test-operator-001');
    expect(payload.data[0]?.userId).not.toBe('forged-user');
  });

  it('does not let an operations scope query a different sector', async () => {
    const response = await fetch(baseUrl + '/api/ai/query', {
      method: 'POST',
      headers: {
        authorization: 'Bearer ' + token(['ai:query:operations']),
        'content-type': 'application/json'
      },
      body: JSON.stringify({ prompt: 'اختبار صلاحيات القطاع', sector: 'health' })
    });
    expect(response.status).toBe(403);
  });

  it('rejects unsupported AI sectors', async () => {
    const response = await fetch(baseUrl + '/api/ai/query', {
      method: 'POST',
      headers: {
        authorization: 'Bearer ' + token(['ai:query:national']),
        'content-type': 'application/json'
      },
      body: JSON.stringify({ prompt: 'test', sector: 'unknown-sector' })
    });
    expect(response.status).toBe(400);
  });


  it('restricts weather, hospitals, and roads to the verified governorate', async () => {
    for (const path of ['/api/wams/weather', '/api/wams/hospitals', '/api/wams/roads']) {
      const own = await fetch(baseUrl + path, {
        headers: { authorization: 'Bearer ' + token([path.endsWith('weather') ? 'wams:weather:read' : path.endsWith('hospitals') ? 'wams:hospitals:read' : 'wams:roads:read']) }
      });
      expect(own.status).toBe(200);
      const foreign = await fetch(baseUrl + path + '?governorate=دمشق', {
        headers: { authorization: 'Bearer ' + token([path.endsWith('weather') ? 'wams:weather:read' : path.endsWith('hospitals') ? 'wams:hospitals:read' : 'wams:roads:read']) }
      });
      expect(foreign.status).toBe(403);
      expect((await foreign.json()).code).toBe('GEOGRAPHIC_SCOPE_DENIED');
    }
  });

  it('requires an explicit national-data scope for the full telemetry snapshot', async () => {
    const response = await fetch(baseUrl + '/api/wams/telemetry', {
      headers: { authorization: 'Bearer ' + token(['wams:telemetry:read']) }
    });
    expect(response.status).toBe(403);
  });

  it('rejects tokens signed by an untrusted key', async () => {
    const { privateKey: attackerKey } = generateKeyPairSync('rsa', { modulusLength: 2048 });
    const encode = (value: unknown) => Buffer.from(JSON.stringify(value)).toString('base64url');
    const header = encode({ alg: 'RS256', typ: 'JWT' });
    const payload = encode({ sub: 'attacker', iss: issuer, aud: audience, exp: Math.floor(Date.now() / 1000) + 300, scope: 'wams:telemetry:read' });
    const input = header + '.' + payload;
    const signer = createSign('RSA-SHA256');
    signer.update(input);
    signer.end();
    const forged = input + '.' + signer.sign(attackerKey).toString('base64url');
    const response = await fetch(baseUrl + '/api/wams/telemetry', { headers: { authorization: 'Bearer ' + forged } });
    expect(response.status).toBe(401);
  });

  it('rejects expired tokens', async () => {
    const expired = token(['wams:telemetry:read'], { exp: Math.floor(Date.now() / 1000) - 1 });
    const response = await fetch(baseUrl + '/api/wams/telemetry', { headers: { authorization: 'Bearer ' + expired } });
    expect(response.status).toBe(401);
  });
});
