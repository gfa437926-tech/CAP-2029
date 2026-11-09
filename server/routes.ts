/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Router } from 'express';
import { wamsDataStore } from './wamsDataStore';
import { geminiGateway } from './geminiGateway';

export const apiRouter = Router();

// ==========================================
// 1. WAMS Verified Operational Data Endpoints
// ==========================================

apiRouter.get('/wams/telemetry', (req, res) => {
  try {
    const snapshot = wamsDataStore.getNationalOperationalSnapshot();
    res.json({
      status: 'success',
      data: snapshot
    });
  } catch (err: any) {
    res.status(500).json({ status: 'error', message: err?.message || 'Failed to fetch telemetry' });
  }
});

apiRouter.get('/wams/weather', (req, res) => {
  const gov = req.query.governorate as string;
  res.json({ status: 'success', data: wamsDataStore.getWeatherObservations(gov) });
});

apiRouter.get('/wams/seismic', (req, res) => {
  res.json({ status: 'success', data: wamsDataStore.getSeismicEvents(10) });
});

apiRouter.get('/wams/dams', (req, res) => {
  res.json({ status: 'success', data: wamsDataStore.getDamsStatus() });
});

apiRouter.get('/wams/hospitals', (req, res) => {
  res.json({ status: 'success', data: wamsDataStore.getHospitalsReadiness() });
});

apiRouter.get('/wams/roads', (req, res) => {
  res.json({ status: 'success', data: wamsDataStore.getRoadHazards() });
});

apiRouter.get('/wams/aviation', (req, res) => {
  res.json({ status: 'success', data: wamsDataStore.getAviationStatus() });
});

apiRouter.get('/wams/ports', (req, res) => {
  res.json({ status: 'success', data: wamsDataStore.getPortConditions() });
});

apiRouter.get('/wams/agriculture', (req, res) => {
  res.json({ status: 'success', data: wamsDataStore.getAgriculturalRisks() });
});

// ==========================================
// 2. Gemini AI Intelligence Layer Endpoints
// ==========================================

apiRouter.post('/ai/query', async (req, res) => {
  try {
    const { prompt, sector = 'operations', userContext } = req.body;
    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ status: 'error', message: 'Prompt query is required' });
    }

    const result = await geminiGateway.analyzeWithGrounding(prompt, sector, userContext);
    res.json({
      status: 'success',
      data: result
    });
  } catch (err: any) {
    res.status(500).json({
      status: 'error',
      message: err?.message || 'AI Gateway execution failed'
    });
  }
});

apiRouter.post('/ai/cascading-risk', (req, res) => {
  try {
    const { triggerHazard = 'torrential_rain' } = req.body;
    const result = geminiGateway.evaluateCascadingRisk(triggerHazard);
    res.json({
      status: 'success',
      data: result
    });
  } catch (err: any) {
    res.status(500).json({ status: 'error', message: err?.message || 'Cascading analysis failed' });
  }
});

apiRouter.get('/ai/audit-logs', (req, res) => {
  res.json({
    status: 'success',
    data: geminiGateway.getAuditLogs()
  });
});

apiRouter.get('/ai/health', (req, res) => {
  const hasKey = !!process.env.GEMINI_API_KEY;
  res.json({
    status: 'success',
    gateway: {
      status: 'healthy',
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
