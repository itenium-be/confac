
import { AnyAction, Dispatch } from "redux";
import { io } from "socket.io-client";
import { handleConsultantSocketEvents, handleProjectSocketEvents, info } from "../../actions";
import { SocketEventTypes } from "./SocketEventTypes";
import { EntityEventPayload } from "./EntityEventPayload";
import { t } from "../utils";
import { toast } from "react-toastify";

function createSocketService () {
    // TODO nicolas read server url from frontend config !!! 
    const socket = io('localhost:9000');
    
    var socketId: undefined|string = undefined;
    var initialized = false;

    socket.on('connect', () => {
        console.log("Socketio: Connected to server");
        socketId = socket.id;
        console.log(`SocketId: ${socketId}`);
    });

    function initialize(dispatch: Dispatch<AnyAction>){
        if(initialized){
            throw new Error("Initialize should only be called once.");
        }

        function registerEntityEventHandler(entityEventType: SocketEventTypes){
            socket.on(entityEventType,msg=> handleEntityEvent(entityEventType, msg, dispatch));
        }

        registerEntityEventHandler(SocketEventTypes.EntityCreated);
        registerEntityEventHandler(SocketEventTypes.EntityUpdated);
        registerEntityEventHandler(SocketEventTypes.EntityDeleted);

        initialized = true;
    }

    function enableNotificationsForEntity(entityId: string ){

        var unsubscriptions:(()=>void)[] = [];

        function registerEntityChangesSubscription(eventType: SocketEventTypes){
            var process = (msg: EntityEventPayload)=>{
                if(msg.sourceSocketId === socketId){
                    console.log("Event ignored for entityId subscription => socket id is self");
                    return;
                }
                if(msg.entityId !== entityId){
                    console.log("Event ignored for entityId subscription => entity id not match");
                    return;
                }
                notifyEntityEvent(eventType, msg);
            };

            socket.on(eventType, process);

            unsubscriptions.push(() => socket.off(eventType,process));
        }

        registerEntityChangesSubscription(SocketEventTypes.EntityCreated);
        registerEntityChangesSubscription(SocketEventTypes.EntityUpdated);
        registerEntityChangesSubscription(SocketEventTypes.EntityDeleted);

        return ()=> {
            unsubscriptions.forEach(fn=> fn());
        }
    }

    function handleEntityEvent(eventType: SocketEventTypes, eventPayload: EntityEventPayload, dispatch: Dispatch<any>){
        console.log("Received entity event from socketio: " + eventType);
        console.log("Source socket Id: " + eventPayload.sourceSocketId);
        console.log("Payload:");
        console.log(eventPayload);

        if(eventPayload.sourceSocketId === socketId){
            console.log("Event ignored: sourceSocketId is equal to current socket id.");
            return;
        }

        switch(eventPayload.entityType){
           case 'projects': dispatch(handleProjectSocketEvents(eventType, eventPayload)); break;
           case 'consultants': dispatch(handleConsultantSocketEvents(eventType, eventPayload)); break;
           default: throw new Error(`${eventPayload.entityType} event for entity type not supported.`);
        };   
    }

    return {
        get socketId() {
            return socketId;
        },
        initialize,
        enableNotificationsForEntity
    };
};

export function notifyEntityEvent(eventType: SocketEventTypes, eventPayload: EntityEventPayload){
    let operation = 'entityUpdated';

    switch(eventType){
        case SocketEventTypes.EntityCreated:
            operation = 'entityCreated';break;
        case SocketEventTypes.EntityUpdated:
            operation = 'entityUpdated';break;
        case SocketEventTypes.EntityDeleted:
            operation = 'entityDeleted'; break;
        default: throw new Error(`${eventType} not supported.`);
    }

    toast.info(
        t(`socketio.operation.${operation}`, {
            entityType: t(`socketio.entities.${eventPayload.entityType}`),
            user: eventPayload.sourceUserEmail,
        }),
        {autoClose: false, position: toast.POSITION.TOP_RIGHT, closeButton: true},
    )
}

export const socketService = createSocketService();

