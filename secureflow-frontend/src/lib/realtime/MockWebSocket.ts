import { WebSocketMessage, ConnectionStatus } from './WebSocketManager';

export interface MockWebSocketConfig {
  url: string;
  protocols?: string[];
  mockDelay?: number;
  shouldFail?: boolean;
  failureRate?: number;
}

type MessageHandler = (message: WebSocketMessage) => void;

export class MockWebSocket {
  private config: MockWebSocketConfig;
  private status: ConnectionStatus = 'disconnected';
  private handlers: Map<string, MessageHandler[]> = new Map();
  private statusHandlers: ((status: ConnectionStatus) => void)[] = [];
  private messageQueue: WebSocketMessage[] = [];
  private timers: Map<string, ReturnType<typeof setTimeout>> = new Map();
  private mockDataGenerators: Map<string, () => WebSocketMessage> = new Map();

  constructor(config: MockWebSocketConfig) {
    this.config = config;
  }

  connect(): Promise<void> {
    this.status = 'connecting';
    this.notifyStatusChange();

    return new Promise((resolve, reject) => {
      const delay = this.config.mockDelay || 100;
      setTimeout(() => {
        if (this.config.shouldFail && Math.random() < (this.config.failureRate || 0.1)) {
          this.status = 'error';
          this.notifyStatusChange();
          reject(new Error('Mock WebSocket connection failed'));
        } else {
          this.status = 'connected';
          this.notifyStatusChange();
          this.startMockGenerators();
          this.flushQueue();
          resolve();
        }
      }, delay);
    });
  }

  disconnect(): void {
    this.status = 'disconnected';
    this.notifyStatusChange();
    this.stopMockGenerators();
    this.clearTimers();
  }

  send(message: WebSocketMessage): void {
    if (this.status !== 'connected') {
      this.messageQueue.push(message);
      return;
    }

    // Echo back for certain message types
    if (message.type === 'ping') {
      setTimeout(() => {
        this.emit('message', {
          type: 'pong',
          payload: { timestamp: new Date().toISOString() },
          timestamp: new Date().toISOString(),
        });
      }, 10);
    } else if (message.type === 'subscribe_scans') {
      setTimeout(() => {
        const payload = message.payload as { scanIds: string[] } | undefined;
        this.emit('message', {
          type: 'subscribed',
          payload: { scanIds: payload?.scanIds || [] },
          timestamp: new Date().toISOString(),
        });
      }, 50);
    } else if (message.type === 'subscribe_dashboard') {
      setTimeout(() => {
        this.emit('message', {
          type: 'subscribed',
          payload: { channel: 'dashboard' },
          timestamp: new Date().toISOString(),
        });
        // Send initial dashboard data
        this.emit('message', {
          type: 'dashboard_update',
          payload: {
            healthScore: 92,
            activeScans: 2,
            criticalFindings: 3,
            recentActivity: 14,
          },
          timestamp: new Date().toISOString(),
        });
      }, 50);
    } else if (message.type === 'subscribe_audit') {
      setTimeout(() => {
        this.emit('message', {
          type: 'subscribed',
          payload: { channel: 'audit' },
          timestamp: new Date().toISOString(),
        });
      }, 50);
    }
  }

  on(event: string, handler: Function): () => void {
    if (!this.handlers.has(event)) {
      this.handlers.set(event, []);
    }
    this.handlers.get(event)!.push(handler as MessageHandler);
    return () => {
      const handlers = this.handlers.get(event);
      if (handlers) {
        const index = handlers.indexOf(handler as MessageHandler);
        if (index !== -1) handlers.splice(index, 1);
      }
    };
  }

  onStatusChange(handler: (status: ConnectionStatus) => void): () => void {
    this.statusHandlers.push(handler);
    return () => {
      const index = this.statusHandlers.indexOf(handler);
      if (index !== -1) this.statusHandlers.splice(index, 1);
    };
  }

  private emit(event: string, message: WebSocketMessage): void {
    const handlers = this.handlers.get(event);
    if (handlers) {
      handlers.forEach((h) => h(message));
    }
    if (event === 'message') {
      this.handlers.get('*')?.forEach((h) => h(message));
    }
  }

  private notifyStatusChange(): void {
    this.statusHandlers.forEach((h) => h(this.status));
  }

  private startMockGenerators(): void {
    // Scan progress generator
    const scanTimer = setInterval(() => {
      if (this.status !== 'connected') return;
      this.emit('message', {
        type: 'scan_progress',
        payload: {
          scanId: `scan-${Math.floor(Math.random() * 100)}`,
          stage: ['clone', 'trivy', 'gitleaks', 'sbom'][Math.floor(Math.random() * 4)],
          progress: Math.floor(Math.random() * 100),
          message: ['Cloning repository', 'Running Trivy scan', 'Running Gitleaks scan', 'Generating SBOM'][Math.floor(Math.random() * 4)],
          eta: Math.floor(Math.random() * 300),
        },
        timestamp: new Date().toISOString(),
      });
    }, 5000);

    this.timers.set('scan', scanTimer);

    // Dashboard updates
    const dashboardTimer = setInterval(() => {
      if (this.status !== 'connected') return;
      this.emit('message', {
        type: 'dashboard_update',
        payload: {
          healthScore: 85 + Math.floor(Math.random() * 15),
          activeScans: Math.floor(Math.random() * 5),
          criticalFindings: Math.floor(Math.random() * 5),
          recentActivity: 10 + Math.floor(Math.random() * 20),
        },
        timestamp: new Date().toISOString(),
      });
    }, 15000);

    this.timers.set('dashboard', dashboardTimer);

    // Audit events
    const auditTimer = setInterval(() => {
      if (this.status !== 'connected') return;
      const events = [
        { type: 'scan_completed', title: 'Scan completed for repo', severity: 'info' },
        { type: 'vulnerability_found', title: 'New vulnerability found', severity: 'critical' },
        { type: 'secret_detected', title: 'Secret detected', severity: 'critical' },
        { type: 'scan_started', title: 'Scan started', severity: 'info' },
        { type: 'engine_sync', title: 'Engine sync completed', severity: 'info' },
      ];
      const event = events[Math.floor(Math.random() * events.length)];
      if (event) {
        this.emit('message', {
          type: event.type,
          payload: {
            title: event.title,
            severity: event.severity,
            description: `Mock event: ${event.title}`,
          },
          timestamp: new Date().toISOString(),
        });
      }
    }, 10000);

    this.timers.set('audit', auditTimer);
  }

  private stopMockGenerators(): void {
    this.clearTimers();
  }

  private clearTimers(): void {
    for (const timer of this.timers.values()) {
      clearInterval(timer);
    }
    this.timers.clear();
  }

  private flushQueue(): void {
    while (this.messageQueue.length > 0) {
      const message = this.messageQueue.shift()!;
      this.emit('message', message);
    }
  }

  getStatus(): ConnectionStatus {
    return this.status;
  }

  registerMockGenerator(eventType: string, generator: () => WebSocketMessage): void {
    this.mockDataGenerators.set(eventType, generator);
  }

  unregisterMockGenerator(eventType: string): void {
    this.mockDataGenerators.delete(eventType);
  }

  simulateEvent(eventType: string, payload: unknown): void {
    this.emit('message', {
      type: eventType,
      payload,
      timestamp: new Date().toISOString(),
    });
  }
}

// Singleton for development
let globalMockWebSocket: MockWebSocket | null = null;

export function getMockWebSocket(config?: MockWebSocketConfig): MockWebSocket {
  if (!globalMockWebSocket && config) {
    globalMockWebSocket = new MockWebSocket(config);
  }
  return globalMockWebSocket!;
}

export function setMockWebSocket(ws: MockWebSocket): void {
  globalMockWebSocket = ws;
}

export function destroyMockWebSocket(): void {
  if (globalMockWebSocket) {
    globalMockWebSocket.disconnect();
    globalMockWebSocket = null;
  }
}

// Hook for using mock WebSocket in development
export function useMockWebSocket(config?: MockWebSocketConfig) {
  const [ws] = useState(() => {
    if (!globalMockWebSocket && config) {
      globalMockWebSocket = new MockWebSocket(config);
    }
    return globalMockWebSocket!;
  });

  return ws;
}

import { useState } from 'react';