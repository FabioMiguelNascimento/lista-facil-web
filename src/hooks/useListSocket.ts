import { useEffect } from 'react';
import { useSocket } from './useSocket';

type Handlers = {
  onCreated?: (item: any) => void;
  onUpdated?: (item: any) => void;
  onDeleted?: (payload: { id: string }) => void;
};

export default function useListSocket(listId: string | null, handlers: Handlers = {}) {
  const { socket } = useSocket();

  useEffect(() => {
    if (!socket || !listId) return;

    const join = () => socket.emit('join_list', { listId });
    // join now and re-join on reconnect
    join();
    socket.on('connect', join);

    if (handlers.onCreated) socket.on('item_created', handlers.onCreated);
    if (handlers.onUpdated) socket.on('item_updated', handlers.onUpdated);
    if (handlers.onDeleted) socket.on('item_deleted', handlers.onDeleted);

    return () => {
      socket.off('connect', join);
      if (handlers.onCreated) socket.off('item_created', handlers.onCreated);
      if (handlers.onUpdated) socket.off('item_updated', handlers.onUpdated);
      if (handlers.onDeleted) socket.off('item_deleted', handlers.onDeleted);
    };
  }, [socket, listId, handlers.onCreated, handlers.onUpdated, handlers.onDeleted]);
}
