import React from 'react';
import io from 'socket.io-client';
import { API_BASE_URL } from '../constants';

const socket = io(`${API_BASE_URL}/ws/chatrooms`, {
  autoConnect: true,
});

const SocketContext = React.createContext(socket);

function SocketProvider({ children }: React.PropsWithChildren) {
  React.useEffect(() => {
    socket.connect();
    return () => {
      socket.disconnect();
    };
  }, []);
  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
}
export { SocketContext, SocketProvider };
