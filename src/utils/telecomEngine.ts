/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface TelemetryPacket {
  nodeId: string;
  status: 'online' | 'degraded' | 'offline';
  signalStrength: number; // 0-100
  latencyMs: number;
}

/**
 * Assesses Telecom Mesh Resilience
 */
export function evaluateTelecomMeshResilience(mesh: TelemetryPacket[]): {
  meshHealthScore: number;
  criticalNodes: string[];
  connectivityStatusAr: string;
} {
  const onlineNodes = mesh.filter(n => n.status === 'online').length;
  const meshHealthScore = Math.round((onlineNodes / mesh.length) * 100);
  const criticalNodes = mesh.filter(n => n.status === 'offline' || n.signalStrength < 20).map(n => n.nodeId);

  return {
    meshHealthScore,
    criticalNodes,
    connectivityStatusAr: meshHealthScore >= 80 ? 'مستقرة (Stable)' : meshHealthScore >= 50 ? 'ضعيفة (Degraded)' : 'مقطوعة (Critical)'
  };
}
