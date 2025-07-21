import React from "react";
import io from "socket.io-client";

const socket=io( `${process.env.BASE_URL}`,{
  transports:["websocket"],
  autoConnect:false,
});

const SocketContext=React.createContext(socket);

function SocketProvider({children}:React.PropsWithChildren){
  React.useEffect(()=>{
    socket.connect();
    return()=>{
      socket.disconnect();
    };
  },[]);
  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
}
export {SocketContext,SocketProvider};
