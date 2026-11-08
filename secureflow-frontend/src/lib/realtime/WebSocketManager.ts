import { EventEmitter } from 'events';

export type ConnectionStatus = 'connecting' | 'connected' | 'disconnected' | 'error' | 'reconnecting';

export interface WebSocketMessage {
  type: string;
  payload: unknown;
  timestamp: string;
  requestId?: string;
}

export interface WebSocketConfig {
  url: string;
  protocols?: string[];
  reconnect?: boolean;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
  reconnectBackoffMultiplier?: number;
  maxReconnectInterval?: number;
  heartbeatInterval?: number;
  onOpen?: () => void;
  onClose?: (event: CloseEvent) => void;
  onError?: (error: Event) => void;
  onMessage?: (message: WebSocketMessage) => void;
  onStatusChange?: (status: ConnectionStatus) => void;
}

export interface WebSocketState {
  status: ConnectionStatus;
  lastMessage: WebSocketMessage | null;
  reconnectAttempts: number;
  error: Error | null;
}

const DEFAULT_CONFIG: Required<Omit<WebSocketConfig, 'url' | 'protocols' | 'onOpen' | 'onClose' | 'onError' | 'onMessage' | 'onStatusChange'>> = {
  reconnect: true,
  reconnectInterval: 1000,
  maxReconnectAttempts: 10,
  reconnectBackoffMultiplier: 1.5,
  maxReconnectInterval: 30000,
  heartbeatInterval: 30000,
};

export class WebSocketManager extends EventEmitter {
  private ws: WebSocket | null = null;
  private config: Required<WebSocketConfig>;
  private state: WebSocketState = {
    status: 'disconnected',
    lastMessage: null,
    reconnectAttempts: 0,
    error: null,
  };
  private heartbeatTimer: ReturnType<typeof setInterval> | null = null;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private isIntentionalClose = false;
  private messageQueue: WebSocketMessage[] = [];
  private requestId = 0;
  private pendingRequests = new Map<string, { resolve: (value: unknown) => void; reject: (reason: unknown) => void; timeout: ReturnType<typeof setTimeout> }>();

  constructor(config: WebSocketConfig) {
    super();
    this.config = { ...DEFAULT_CONFIG, ...config } as Required<WebSocketConfig>;
  }

  get status(): ConnectionStatus {
    return this.state.status;
  }

  get lastMessage(): WebSocketMessage | null {
    return this.state.lastMessage;
  }

  get reconnectAttempts(): number {
    return this.state.reconnectAttempts;
  }

  get error(): Error | null {
    return this.state.error;
  }

  connect(): Promise<void> {
    if (this.ws?.readyState === WebSocket.OPEN) {
      return Promise.resolve();
    }

    this.isIntentionalClose = false;
    this.updateStatus('connecting');

    return new Promise((resolve, reject) => {
      try {
        this.ws = this.config.protocols
          ? new WebSocket(this.config.url, this.config.protocols)
          : new WebSocket(this.config.url);

        this.ws.onopen = () => {
          this.state.reconnectAttempts = 0;
          this.updateStatus('connected');
          this.startHeartbeat();
          this.flushMessageQueue();
          this.config.onOpen?.();
          this.emit('open');
          resolve();
        };

        this.ws.onclose = (event) => {
          this.stopHeartbeat();
          this.clearReconnectTimer();

          if (!this.isIntentionalClose) {
            this.updateStatus('disconnected');
            this.config.onClose?.(event);
            this.emit('close', event);

            if (this.config.reconnect && this.state.reconnectAttempts < this.config.maxReconnectAttempts) {
              this.scheduleReconnect();
            } else if (this.state.reconnectAttempts >= this.config.maxReconnectAttempts) {
              this.updateStatus('error');
              this.state.error = new Error('Max reconnection attempts reached');
              this.emit('error', this.state.error);
            }
          } else {
            this.updateStatus('disconnected');
            this.config.onClose?.(event);
            this.emit('close', event);
          }
        };

        this.ws.onerror = (error) => {
          this.state.error = new Error('WebSocket error');
          this.updateStatus('error');
          this.config.onError?.(error);
          this.emit('error', error);
          reject(new Error('WebSocket connection failed'));
        };

        this.ws.onmessage = (event) => {
          try {
            const message = JSON.parse(event.data) as WebSocketMessage;
            this.state.lastMessage = message;
            this.config.onMessage?.(message);
            this.emit('message', message);
            this.handleResponse(message);
          } catch (error) {
            console.error('Failed to parse WebSocket message:', error);
          }
        };
      } catch (error) {
        this.state.error = error instanceof Error ? error : new Error('Failed to create WebSocket');
        this.updateStatus('error');
        reject(error);
      }
    });
  }

  disconnect(): void {
    this.isIntentionalClose = true;
    this.clearReconnectTimer();
    this.stopHeartbeat();

    if (this.ws) {
      this.ws.close(1000, 'Intentional disconnect');
      this.ws = null;
    }

    this.flushPendingRequests(new Error('WebSocket disconnected'));
    this.updateStatus('disconnected');
  }

  send(message: Omit<WebSocketMessage, 'timestamp' | 'requestId'>): string {
    const requestId = `req_${++this.requestId}_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    const fullMessage: WebSocketMessage = {
      ...message,
      requestId,
      timestamp: new Date().toISOString(),
    };

    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(fullMessage));
    } else {
      this.messageQueue.push(fullMessage);
    }

    return requestId;
  }

  sendAndWait<T = unknown>(
    message: Omit<WebSocketMessage, 'timestamp' | 'requestId'>,
    timeout = 10000
  ): Promise<T> {
    const requestId = this.send(message);

    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        this.pendingRequests.delete(requestId);
        reject(new Error('Request timeout'));
      }, timeout);

      this.pendingRequests.set(requestId, { resolve: resolve as (value: unknown) => void, reject, timeout: timeoutId });
    });
  }

  private handleResponse(message: WebSocketMessage): void {
    if (message.requestId && this.pendingRequests.has(message.requestId)) {
      const pending = this.pendingRequests.get(message.requestId)!;
      clearTimeout(pending.timeout);
      this.pendingRequests.delete(message.requestId);

      if (message.type === 'error') {
        pending.reject(new Error((message.payload as { message?: string })?.message || 'Request failed'));
      } else {
        pending.resolve(message.payload);
      }
    }
  }

  private flushMessageQueue(): void {
    while (this.messageQueue.length > 0 && this.ws?.readyState === WebSocket.OPEN) {
      const message = this.messageQueue.shift()!;
      this.ws.send(JSON.stringify(message));
    }
  }

  private flushPendingRequests(error: Error): void {
    for (const [, pending] of this.pendingRequests) {
      clearTimeout(pending.timeout);
      pending.reject(error);
    }
    this.pendingRequests.clear();
  }

  private startHeartbeat(): void {
    this.stopHeartbeat();
    this.heartbeatTimer = setInterval(() => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        this.send({ type: 'ping', payload: {} });
      } else {
        this.stopHeartbeat();
      }
    }, this.config.heartbeatInterval);
  }

  private stopHeartbeat(): void {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  }

  private scheduleReconnect(): void {
    this.clearReconnectTimer();
    this.updateStatus('reconnecting');

    const delay = Math.min(
      this.config.reconnectInterval * Math.pow(this.config.reconnectBackoffMultiplier, this.state.reconnectAttempts),
      this.config.maxReconnectInterval
    );

    this.reconnectTimer = setTimeout(() => {
      this.state.reconnectAttempts++;
      this.connect().catch(() => {
        // Connection failed, will retry via onclose handler
      });
    }, delay);
  }

  private clearReconnectTimer(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
  }

  private updateStatus(status: ConnectionStatus): void {
    this.state.status = status;
    this.config.onStatusChange?.(status);
    this.emit('statusChange', status);
  }

  getState(): WebSocketState {
    return { ...this.state };
  }

  destroy(): void {
    this.disconnect();
    this.removeAllListeners();
  }
}

// Singleton instance for app-wide use
let globalWebSocketManager: WebSocketManager | null = null;

export function getWebSocketManager(config?: WebSocketConfig): WebSocketManager {
  if (!globalWebSocketManager && config) {
    globalWebSocketManager = new WebSocketManager(config);
  }
  return globalWebSocketManager!;
}

export function setWebSocketManager(manager: WebSocketManager): void {
  globalWebSocketManager = manager;
}

export function destroyWebSocketManager(): void {
  if (globalWebSocketManager) {
    globalWebSocketManager.destroy();
    globalWebSocketManager = null;
  }
}