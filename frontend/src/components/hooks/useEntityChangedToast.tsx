import { useEffect } from "react";
import { socketService } from "../socketio/SocketService";

function useEntityChangedToast(entityId: string|null|undefined) {
  useEffect(()=>{
    var subs: undefined| (()=>void);
    
    if(entityId){
      subs = socketService.enableToastsForEntity(entityId);
    }

    return subs;
    
  }, [entityId]);
}

export default useEntityChangedToast;