import { create } from 'zustand';
import type { Scan, ScanTelemetry } from '@/types/scan';

interface ScanState {
  activeScans: Map<string, Scan>;
  scanHistory: Scan[];
  scanTelemetry: Map<string, ScanTelemetry[]>;
  isLoading: boolean;
  error: string | null;
  setActiveScans: (scans: Scan[]) => void;
  addActiveScan: (scan: Scan) => void;
  updateActiveScan: (scanId: string, updates: Partial<Scan>) => void;
  removeActiveScan: (scanId: string) => void;
  setScanHistory: (scans: Scan[]) => void;
  addScanTelemetry: (scanId: string, telemetry: ScanTelemetry) => void;
  clearScanTelemetry: (scanId: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useScanStore = create<ScanState>((set) => ({
  activeScans: new Map(),
  scanHistory: [],
  scanTelemetry: new Map(),
  isLoading: false,
  error: null,

  setActiveScans: (scans) => {
    const map = new Map(scans.map((s) => [s.id, s]));
    set({ activeScans: map });
  },

  addActiveScan: (scan) => {
    set((state) => {
      const next = new Map(state.activeScans);
      next.set(scan.id, scan);
      return { activeScans: next };
    });
  },

  updateActiveScan: (scanId, updates) => {
    set((state) => {
      const next = new Map(state.activeScans);
      const existing = next.get(scanId);
      if (existing) {
        next.set(scanId, { ...existing, ...updates });
      }
      return { activeScans: next };
    });
  },

  removeActiveScan: (scanId) => {
    set((state) => {
      const next = new Map(state.activeScans);
      next.delete(scanId);
      return { activeScans: next };
    });
  },

  setScanHistory: (scans) => {
    set({ scanHistory: scans });
  },

  addScanTelemetry: (scanId, telemetry) => {
    set((state) => {
      const next = new Map(state.scanTelemetry);
      const existing = next.get(scanId) || [];
      next.set(scanId, [...existing, telemetry]);
      return { scanTelemetry: next };
    });
  },

  clearScanTelemetry: (scanId) => {
    set((state) => {
      const next = new Map(state.scanTelemetry);
      next.delete(scanId);
      return { scanTelemetry: next };
    });
  },

  setLoading: (isLoading) => {
    set({ isLoading });
  },

  setError: (error) => {
    set({ error });
  },
}));