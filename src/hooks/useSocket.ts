import { useAuthStore } from '@/store/useAuthStore';
import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

let socket: Socket | undefined;

export const useSocket = () => {
  const { user } = useAuthStore();
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!user) return;

    // Inicializa o socket apenas uma vez
    if (!socket) {
      socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:8080', {
        withCredentials: true, // Envia o cookie automaticamente
        autoConnect: false,
      });
    }

    if (!socket.connected) {
      socket.connect();
    }

    // Identificação do usuário para o Inbox (notifyUser do backend)
    socket.emit('identify', { userId: user.id });

    const onConnect = () => setIsConnected(true);
    const onDisconnect = () => setIsConnected(false);

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);

    return () => {
      socket?.off('connect', onConnect);
      socket?.off('disconnect', onDisconnect);
      // Não desconectamos aqui para manter a conexão viva navegando entre telas
    };
  }, [user]);

  return { socket, isConnected };
};

export function disconnectSocket() {
  try {
    socket?.disconnect();
  } finally {
    socket = undefined;
  }
}
