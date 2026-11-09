import { useEffect, useState, useCallback, useRef } from 'react';
import { WebSocketManager, WebSocketMessage, ConnectionStatus, WebSocketConfig } from '@/lib/realtime/WebSocketManager';

export interface UseWebSocketOptions extends Omit<WebSocketConfig, 'url' | 'protocols' | 'onOpen' | 'onClose' | 'onError' | 'onMessage' | 'onStatusChange'> {
  url?: string;
  protocols?: string[];
  autoConnect?: boolean;
  onOpen?: () => void;
  onClose?: (event: CloseEvent) => void;
  onError?: (error: Event) => void;
  onMessage?: (message: WebSocketMessage) => void;
  onStatusChange?: (status: ConnectionStatus) => void;
}

export interface UseWebSocketReturn {
  status: ConnectionStatus;
  lastMessage: WebSocketMessage | null;
  send: (message: Omit<WebSocketMessage, 'timestamp' | 'requestId'>) => string;
  sendAndWait: <T = unknown>(message: Omit<WebSocketMessage, 'timestamp' | 'requestId'>, timeout?: number) => Promise<T>;
  connect: () => Promise<void>;
  disconnect: () => void;
  reconnect: () => Promise<void>;
  error: Error | null;
}

export function useWebSocket(options: UseWebSocketOptions): UseWebSocketReturn {
  const {
    url,
    protocols,
    autoConnect = true,
    onOpen,
    onClose,
    onError,
    onMessage,
    onStatusChange,
    ...config
  } = options;

  const managerRef = useRef<WebSocketManager | null>(null);
  const [status, setStatus] = useState<ConnectionStatus>('disconnected');
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const initializeManager = useCallback(() => {
    if (!managerRef.current) {
      managerRef.current = new WebSocketManager({
        url: url || '',
        protocols,
        ...config,
        onOpen: () => {
          setStatus('connected');
          setError(null);
          onOpen?.();
        },
        onClose: (event) => {
          setStatus('disconnected');
          onClose?.(event);
        },
        onError: (error) => {
          const err = error instanceof Error ? error : new Error('WebSocket error');
          setError(err);
          onError?.(error);
        },
        onMessage: (message) => {
          setLastMessage(message);
          onMessage?.(message);
        },
        onStatusChange: (newStatus) => {
          setStatus(newStatus);
          onStatusChange?.(newStatus);
        },
      });
    }
  }, [url, protocols, config, onOpen, onClose, onError, onMessage, onStatusChange]);

  useEffect(() => {
    initializeManager();
    return () => {
      managerRef.current?.destroy();
      managerRef.current = null;
    };
  }, [initializeManager]);

  useEffect(() => {
    if (autoConnect && managerRef.current) {
      managerRef.current.connect().catch(() => {
        // Connection failed, error will be handled by onError
      });
    }
  }, [autoConnect]);

  const connect = useCallback(async () => {
    if (!managerRef.current) {
      initializeManager();
    }
    await managerRef.current?.connect();
  }, [initializeManager]);

  const disconnect = useCallback(() => {
    managerRef.current?.disconnect();
  }, []);

  const reconnect = useCallback(async () => {
    if (managerRef.current) {
      managerRef.current.disconnect();
      await new Promise((resolve) => setTimeout(resolve, 100));
      await managerRef.current.connect();
    }
  }, []);

  return {
    status,
    lastMessage,
    send: (message: Omit<WebSocketMessage, 'timestamp' | 'requestId'>) => {
      return managerRef.current?.send(message) || '';
    },
    sendAndWait: async <T = unknown>(message: Omit<WebSocketMessage, 'timestamp' | 'requestId'>, timeout?: number): Promise<T> => {
      return managerRef.current?.sendAndWait<T>(message, timeout) as Promise<T>;
    },
    connect,
    disconnect,
    reconnect,
    error,
  };
}

// Specialized hooks for common use cases
export function useScanProgress(scanId: string, options?: UseWebSocketOptions) {
  const ws = useWebSocket({
    ...options,
    url: options?.url || `${process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8000'}/ws/scan/${scanId}`,
  });

  const [progress, setProgress] = useState<{
    stage: string;
    progress: number;
    message: string;
    eta?: number;
  } | null>(null);

  useEffect(() => {
    if (ws.lastMessage) {
      const payload = ws.lastMessage.payload as { stage?: string; progress?: number; message?: string; eta?: number } | undefined;
      if (payload && typeof payload.progress === 'number') {
        setProgress({
          stage: payload.stage || 'unknown',
          progress: payload.progress,
          message: payload.message || '',
          eta: payload.eta,
        });
      }
    }
  }, [ws.lastMessage]);

  return { ...ws, progress };
}

export function useLiveEvents(
  eventTypes: string[],
  options?: UseWebSocketOptions
) {
  const ws = useWebSocket({
    ...options,
    onMessage: (message) => {
      if (eventTypes.includes(message.type)) {
        options?.onMessage?.(message);
      }
    },
  });

  const [events, setEvents] = useState<WebSocketMessage[]>([]);

  useEffect(() => {
    const message = ws.lastMessage;
    if (message && eventTypes.includes(message.type)) {
      setEvents((prev) => [message, ...prev].slice(0, 100));
    }
  }, [ws.lastMessage, eventTypes]);

  return { ...ws, events };
}

export function useConnectionStatus(): ConnectionStatus {
  const ws = useWebSocket({
    url: '',
    autoConnect: false,
  });
  return ws.status;
}

// Hook for subscribing to scan progress updates
export function useScanSubscription(scanIds: string[], options?: UseWebSocketOptions) {
  const [scanProgress, setScanProgress] = useState<Record<string, { progress: number; stage: string; message: string }>>({});

  const ws = useWebSocket({
    ...options,
    url: options?.url || `${process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8000'}/ws/scans`,
    onMessage: (message) => {
      const payload = message.payload as { scanId: string; progress: number; stage: string; message: string; eta?: number } | undefined;
      if (message.type === 'scan_progress' && payload && scanIds.includes(payload.scanId)) {
        setScanProgress((prev) => ({
          ...prev,
          [payload.scanId]: {
            progress: payload.progress,
            stage: payload.stage,
            message: payload.message,
            eta: payload.eta,
          },
        }));
      }
      options?.onMessage?.(message);
    },
  });

  useEffect(() => {
    // Subscribe to scan IDs
    if (ws.status === 'connected') {
      ws.send({
        type: 'subscribe_scans',
        payload: { scanIds },
      });
    }

    return () => {
      if (ws.status === 'connected') {
        ws.send({
          type: 'unsubscribe_scans',
          payload: { scanIds },
        });
      }
    };
  }, [ws.status, scanIds]);

  return { ...ws, scanProgress };
}

// Hook for dashboard real-time updates
export function useDashboardRealtime(options?: UseWebSocketOptions) {
  const [dashboardData, setDashboardData] = useState<{
    healthScore: number;
    activeScans: number;
    criticalFindings: number;
    recentActivity: number;
  } | null>(null);

  const ws = useWebSocket({
    ...options,
    url: options?.url || `${process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8000'}/ws/dashboard`,
    onMessage: (message) => {
      if (message.type === 'dashboard_update') {
        setDashboardData(message.payload as { healthScore: number; activeScans: number; criticalFindings: number; recentActivity: number });
      }
      options?.onMessage?.(message);
    },
  });

  useEffect(() => {
    if (ws.status === 'connected') {
      ws.send({ type: 'subscribe_dashboard', payload: {} });
    }

    return () => {
      if (ws.status === 'connected') {
        ws.send({ type: 'unsubscribe_dashboard', payload: {} });
      }
    };
  }, [ws.status]);

  return { ...ws, dashboardData };
}