import { useCallback, useContext, useEffect } from 'react';
import { SocketContext } from '../contexts/SocketContext';

export function useSocketSender(channel: string) {
  const socket = useContext(SocketContext);
  const emitter = (data: unknown) => {
    socket.emit(channel, data);
  };
  return useCallback(emitter, [channel]);
}

export function useSocketReceiver(
  channel: string,
  onReceive: (data: unknown) => void
) {
  const socket = useContext(SocketContext);

  useEffect(() => {
    socket.on(channel, onReceive);
    return () => {
      socket.off(channel, onReceive);
    };
  }, [channel, onReceive]);
}
