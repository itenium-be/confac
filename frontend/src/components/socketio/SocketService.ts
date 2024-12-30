
import { AnyAction, Dispatch } from "redux";
import { io } from "socket.io-client";
import { handleConsultantSocketEvents, handleProjectSocketEvents, info } from "../../actions";
import { SocketEventTypes } from "./SocketEventTypes";
import { EntityEventPayload } from "./EntityEventPayload";
import { t } from "../utils";

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

        socket.on(SocketEventTypes.EntityCreated, (msg)=>{
            handleEntityEvent(SocketEventTypes.EntityCreated, msg, dispatch);
        });
        socket.on(SocketEventTypes.EntityUpdated, (msg)=>{
            handleEntityEvent(SocketEventTypes.EntityUpdated, msg, dispatch);
        });
        socket.on(SocketEventTypes.EntityDeleted, (msg)=>{
            handleEntityEvent(SocketEventTypes.EntityDeleted, msg, dispatch);
        });

        initialized = true;
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
           case 'projects': 
                dispatch(handleProjectSocketEvents(eventType, eventPayload));  
                break;
           case 'consultants': dispatch(handleConsultantSocketEvents(eventType, eventPayload)); 
                break;
           default: throw new Error(`${eventPayload.entityType} event for entity type not supported.`);
        };   
    }

    return {
        get socketId() {
            return socketId;
        },
        initialize
    };
};

export function notifyEntityEvent(entityDisplay: string, eventType: SocketEventTypes, eventPayload: EntityEventPayload){
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

    info(t(`socketio.operation.${operation}`, {
        entityType: t(`socketio.entities.${eventPayload.entityType}`),
        user: eventPayload.sourceUserEmail,
        entityDisplay: entityDisplay
    }))
}

export const socketService = createSocketService();

