import { io } from 'socket.io-client';

let socketInstance = null;

export function getSocket() {
  if (socketInstance?.connected) return socketInstance;

  const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL ?? 'http://localhost:8000';

  socketInstance = io(`${socketUrl}/room`, {
    transports: ['websocket', 'polling'],
    autoConnect: false,
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1500,
    reconnectionDelayMax: 5000,
    timeout: 20000,
  });

  return socketInstance;
}

export function destroySocket() {
  if (socketInstance) {
    socketInstance.disconnect();
    socketInstance = null;
  }
}
