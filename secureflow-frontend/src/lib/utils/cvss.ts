export interface CVSSVector {
  version: string;
  attackVector: 'N' | 'A' | 'L' | 'P';
  attackComplexity: 'L' | 'H';
  privilegesRequired: 'N' | 'L' | 'H';
  userInteraction: 'N' | 'R';
  scope: 'U' | 'C';
  confidentiality: 'N' | 'L' | 'H';
  integrity: 'N' | 'L' | 'H';
  availability: 'N' | 'L' | 'H';
}

export interface CVSSDecoded {
  attackVector: string;
  attackComplexity: string;
  privilegesRequired: string;
  userInteraction: string;
  scope: string;
  confidentiality: string;
  integrity: string;
  availability: string;
}

export const CVSS_METRICS: Record<string, { label: string; values: Record<string, string> }> = {
  AV: {
    label: 'Attack Vector',
    values: { N: 'Network', A: 'Adjacent', L: 'Local', P: 'Physical' },
  },
  AC: {
    label: 'Attack Complexity',
    values: { L: 'Low', H: 'High' },
  },
  PR: {
    label: 'Privileges Required',
    values: { N: 'None', L: 'Low', H: 'High' },
  },
  UI: {
    label: 'User Interaction',
    values: { N: 'None', R: 'Required' },
  },
  S: {
    label: 'Scope',
    values: { U: 'Unchanged', C: 'Changed' },
  },
  C: {
    label: 'Confidentiality',
    values: { N: 'None', L: 'Low', H: 'High' },
  },
  I: {
    label: 'Integrity',
    values: { N: 'None', L: 'Low', H: 'High' },
  },
  A: {
    label: 'Availability',
    values: { N: 'None', L: 'Low', H: 'High' },
  },
};

export function parseCVSSVector(vector: string): CVSSVector | null {
  const match = vector.match(/^CVSS:(\d\.\d)\/(.+)$/);
  if (!match || !match[2]) return null;

  const version = match[1];
  const metrics = match[2].split('/');
  const result: Partial<CVSSVector> = { version };

  for (const metric of metrics) {
    const [key, value] = metric.split(':');
    if (key && value && key in CVSS_METRICS) {
      const metricDef = CVSS_METRICS[key];
      if (metricDef && value in metricDef.values) {
        (result as Record<string, string>)[key] = value;
      }
    }
  }

  return result as CVSSVector;
}

export function decodeCVSSVector(vector: string): CVSSDecoded | null {
  const parsed = parseCVSSVector(vector);
  if (!parsed) return null;

  // Use type assertions with explicit types
  const attackVector = (parsed.attackVector ?? 'N') as 'N' | 'A' | 'L' | 'P';
  const attackComplexity = (parsed.attackComplexity ?? 'L') as 'L' | 'H';
  const privilegesRequired = (parsed.privilegesRequired ?? 'N') as 'N' | 'L' | 'H';
  const userInteraction = (parsed.userInteraction ?? 'N') as 'N' | 'R';
  const scope = (parsed.scope ?? 'U') as 'U' | 'C';
  const confidentiality = (parsed.confidentiality ?? 'N') as 'N' | 'L' | 'H';
  const integrity = (parsed.integrity ?? 'N') as 'N' | 'L' | 'H';
  const availability = (parsed.availability ?? 'N') as 'N' | 'L' | 'H';

  return {
    attackVector: (CVSS_METRICS.AV?.values[attackVector]!)!,
    attackComplexity: (CVSS_METRICS.AC?.values[attackComplexity]!)!,
    privilegesRequired: (CVSS_METRICS.PR?.values[privilegesRequired]!)!,
    userInteraction: (CVSS_METRICS.UI?.values[userInteraction]!)!,
    scope: (CVSS_METRICS.S?.values[scope]!)!,
    confidentiality: (CVSS_METRICS.C?.values[confidentiality]!)!,
    integrity: (CVSS_METRICS.I?.values[integrity]!)!,
    availability: (CVSS_METRICS.A?.values[availability]!)!,
  };
}

export function calculateCVSSScore(vector: string): number | null {
  const parsed = parseCVSSVector(vector);
  if (!parsed) return null;

  const weights = {
    AV: { N: 0.85, A: 0.62, L: 0.55, P: 0.2 },
    AC: { L: 0.77, H: 0.44 },
    PR: { N: 0.85, L: 0.62, H: 0.27 },
    UI: { N: 0.85, R: 0.62 },
    S: { U: 1.0, C: 1.08 },
    C: { N: 0, L: 0.22, H: 0.56 },
    I: { N: 0, L: 0.22, H: 0.56 },
    A: { N: 0, L: 0.22, H: 0.56 },
  } as const;

  const { attackVector = 'N', attackComplexity = 'L', privilegesRequired = 'N', userInteraction = 'N', scope = 'U', confidentiality = 'N', integrity = 'N', availability = 'N' } = parsed;

  const baseScore = Math.min(
    10,
    Math.round(
      (weights.AV[attackVector] *
        weights.AC[attackComplexity] *
        weights.PR[privilegesRequired] *
        weights.UI[userInteraction] *
        (weights.C[confidentiality] + weights.I[integrity] + weights.A[availability]) *
        weights.S[scope]) *
        10
    ) / 10
  );

  return baseScore;
}

export function getSeverityFromScore(score: number): 'critical' | 'high' | 'medium' | 'low' | 'none' {
  if (score >= 9.0) return 'critical';
  if (score >= 7.0) return 'high';
  if (score >= 4.0) return 'medium';
  if (score > 0) return 'low';
  return 'none';
}