/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Router } from 'express';
import { wamsDataStore } from './wamsDataStore';
import { geminiGateway } from './geminiGateway';
import { authenticateApiRequest, requireApiScopes, requireAnyApiScopes, type WamsAuthClaims } from './security/apiAuth';

export const apiRouter = Router();

// Every API route is authenticated. Missing or invalid OIDC/JWT configuration fails closed.
apiRouter.use(authenticateApiRequest);

// ==========================================
// 1. WAMS Operational Data (read-only scopes)
// ==========================================

apiRouter.get('/wams/telemetry', requireApiScopes('wams:telemetry:read'), (req, res) => {
  try {
    const snapshot = wamsDataStore.getNationalOperationalSnapshot();
    res.json({ status: 'success', data: snapshot });
  } catch {
    res.status(500).json({ status: 'error', message: 'Failed to fetch telemetry' });
  }
});

apiRouter.get('/wams/weather', requireApiScopes('wams:weather:read'), (req, res) => {
  const gov = typeof req.query.governorate === 'string' ? req.query.governorate : undefined;
  res.json({ status: 'success', data: wamsDataStore.getWeatherObservations(gov) });
});

apiRouter.get('/wams/seismic', requireApiScopes('wams:seismic:read'), (_req, res) => {
  res.json({ status: 'success', data: wamsDataStore.getSeismicEvents(10) });
});

apiRouter.get('/wams/dams', requireApiScopes('wams:dams:read'), (_req, res) => {
  res.json({ status: 'success', data: wamsDataStore.getDamsStatus() });
});

apiRouter.get('/wams/hospitals', requireApiScopes('wams:hospitals:read'), (_req, res) => {
  res.json({ status: 'success', data: wamsDataStore.getHospitalsReadiness() });
});

apiRouter.get('/wams/roads', requireApiScopes('wams:roads:read'), (_req, res) => {
  res.json({ status: 'success', data: wamsDataStore.getRoadHazards() });
});

apiRouter.get('/wams/aviation', requireApiScopes('wams:aviation:read'), (_req, res) => {
  res.json({ status: 'success', data: wamsDataStore.getAviationStatus() });
});

apiRouter.get('/wams/ports', requireApiScopes('wams:ports:read'), (_req, res) => {
  res.json({ status: 'success', data: wamsDataStore.getPortConditions() });
});

apiRouter.get('/wams/agriculture', requireApiScopes('wams:agriculture:read'), (_req, res) => {
  res.json({ status: 'success', data: wamsDataStore.getAgriculturalRisks() });
});

// ==========================================
// 2. Gemini AI Intelligence Layer
// ==========================================

const AI_QUERY_SECTORS = new Set([
  'meteorology', 'geological', 'wildfire', 'hydrology', 'health',
  'aviation', 'maritime', 'traffic', 'agriculture', 'operations'
]);

apiRouter.post('/ai/query', (req, res, next) => {
  const sector = typeof req.body?.sector === 'string' ? req.body.sector : 'operations';
  if (!AI_QUERY_SECTORS.has(sector)) {
    return res.status(400).json({ status: 'error', code: 'INVALID_SECTOR', message: 'Unsupported AI sector' });
  }
  return requireAnyApiScopes(`ai:query:${sector}`, 'ai:query:national')(req, res, next);
}, async (req, res) => {
  try {
    const { prompt, sector = 'operations' } = req.body ?? {};
    if (typeof prompt !== 'string' || !prompt.trim() || prompt.length > 4000) {
      return res.status(400).json({ status: 'error', code: 'INVALID_PROMPT', message: 'A prompt of 1–4000 characters is required' });
    }

    // Identity and context come only from the verified token, never from client-supplied userContext.
    const claims = res.locals.auth as WamsAuthClaims;
    const verifiedContext = {
      role: typeof claims.role === 'string' ? claims.role : 'authenticated',
      governorate: typeof claims.governorate === 'string' ? claims.governorate : '',
      userId: claims.sub
    };
    const result = await geminiGateway.analyzeWithGrounding(prompt.trim(), String(sector), verifiedContext);
    res.json({ status: 'success', data: result });
  } catch {
    res.status(500).json({ status: 'error', message: 'AI Gateway execution failed' });
  }
});

apiRouter.post('/ai/cascading-risk', requireApiScopes('ai:cascading-risk:read'), (req, res) => {
  try {
    const triggerHazard = typeof req.body?.triggerHazard === 'string' ? req.body.triggerHazard : 'torrential_rain';
    const result = geminiGateway.evaluateCascadingRisk(triggerHazard);
    res.json({ status: 'success', data: result });
  } catch {
    res.status(500).json({ status: 'error', message: 'Cascading analysis failed' });
  }
});

apiRouter.get('/ai/audit-logs', requireApiScopes('ai:audit:read'), (_req, res) => {
  res.json({ status: 'success', data: geminiGateway.getAuditLogs() });
});

apiRouter.get('/ai/health', requireApiScopes('system:health:read'), (_req, res) => {
  const hasKey = !!process.env.GEMINI_API_KEY;
  res.json({
    status: 'success',
    gateway: {
      status: 'configured',
      mode: hasKey ? 'live_gemini_api' : 'grounded_rule_based_fallback',
      model: hasKey ? 'gemini-3.8-flash' : 'WAMS-Gateway-RuleEngine-v1.0',
      databaseFirstEnforced: true,
      directDatabaseAccessAllowed: false,
      writePermissionsAllowed: false,
      readOnlyMediationActive: true,
      unprovenEarthquakePredictionAllowed: false,
      individualMedicalDiagnosisAllowed: false
    }
  });
});
