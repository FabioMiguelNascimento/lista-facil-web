import api from '@/lib/api';
import { useCallback, useEffect, useRef, useState } from 'react';
import useListSocket from './useListSocket';

export default function useListState(listId: string | null) {
  const [list, setList] = useState<any | null>(null);
  const listRef = useRef(list);
  listRef.current = list;

  const fetchList = useCallback(async () => {
    if (!listId) return;
    const res = await api.get(`/lists/${listId}`);
    setList(res.data);
  }, [listId]);

  useEffect(() => {
    fetchList().catch(() => {});
  }, [fetchList]);

  const handleCreated = useCallback((newItem: any) => {
    setList((prev: any) => {
      if (!prev) return prev;
      if (prev.items.some((i: any) => i.id === newItem.id)) return prev;
      return { ...prev, items: [...prev.items, newItem] };
    });
  }, []);

  const handleUpdated = useCallback((updatedItem: any) => {
    setList((prev: any) => {
      if (!prev) return prev;
      return { ...prev, items: prev.items.map((i: any) => (i.id === updatedItem.id ? updatedItem : i)) };
    });
  }, []);

  const handleDeleted = useCallback(({ id }: { id: string }) => {
    setList((prev: any) => (prev ? { ...prev, items: prev.items.filter((i: any) => i.id !== id) } : null));
  }, []);

  useListSocket(listId, { onCreated: handleCreated, onUpdated: handleUpdated, onDeleted: handleDeleted });

  const addItem = useCallback(async (content: string) => {
    if (!listId) return;
    const tempId = `temp-${Date.now()}`;
    const tempItem = { id: tempId, content, checked: false };
    setList((prev: any) => (prev ? { ...prev, items: [...prev.items, tempItem] } : prev));

    try {
      const { data } = await api.post('/items', { content, listId });

      setList((prev: any) => {
        if (!prev) return prev;
        if (prev.items.some((i: any) => i.id === data.id)) {
          return { ...prev, items: prev.items.filter((i: any) => i.id !== tempId) };
        }
        return { ...prev, items: prev.items.map((i: any) => (i.id === tempId ? data : i)) };
      });

      return data;
    } catch (e) {
      setList((prev: any) => (prev ? { ...prev, items: prev.items.filter((i: any) => i.id !== tempId) } : prev));
      throw e;
    }
  }, [listId]);

  const toggleItem = useCallback(async (item: any) => {
    const newStatus = !item.checked;
    setList((prev: any) => (prev ? { ...prev, items: prev.items.map((i: any) => (i.id === item.id ? { ...i, checked: newStatus } : i)) } : prev));
    try {
      await api.patch(`/items/${item.id}`, { checked: newStatus });
    } catch (e) {
      setList((prev: any) => (prev ? { ...prev, items: prev.items.map((i: any) => (i.id === item.id ? { ...i, checked: item.checked } : i)) } : prev));
      throw e;
    }
  }, []);

  const deleteItem = useCallback(async (id: string) => {
    const before = listRef.current;
    setList((prev: any) => (prev ? { ...prev, items: prev.items.filter((i: any) => i.id !== id) } : prev));
    try {
      await api.delete(`/items/${id}`);
    } catch (e) {
      setList(before);
      throw e;
    }
  }, []);

  return { list, setList, fetchList, addItem, toggleItem, deleteItem };
}
