import {useEffect} from 'react';
import {socketService} from '../socketio/SocketService';

function useEntityChangedToast(entityId: string | null | undefined, entityType: string | null | undefined = null) {
  useEffect(() => {
    let subs: undefined | (() => void);
    if (entityId || entityType) {
      subs = socketService.enableToastsForEntity(entityId, entityType);
    }
    return subs;

  }, [entityId, entityType]);
}

export default useEntityChangedToast;
