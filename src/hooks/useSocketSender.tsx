import {useCallback,useContext} from "react";
import { SocketContext } from "../contexts/SocketContext";

function useSocketSender(channel:string){
    const socket=useContext(SocketContext);
    const emitter=(data:unknown)=>{
        socket.emit(channel,data);
    };
    return useCallback(emitter,[channel]);
}
export default useSocketSender;