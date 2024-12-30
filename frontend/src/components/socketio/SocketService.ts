
import { AnyAction, Dispatch } from "redux";
import { io } from "socket.io-client";
import { handleConsultantSocketEvents, handleProjectSocketEvents } from "../../actions";
import { SocketEventTypes } from "./SocketEventTypes";
import { EntityEventPayload } from "./EntityEventPayload";

function createSocketService () {
    // TODO nicolas read server url from frontend config !!! 
    const socket = io('localhost:9000');
    
    var socketId: undefined|string = undefined;

    socket.on('connect', () => {
        console.log("Socketio: Connected to server");
        socketId = socket.id;
        console.log(`SocketId: ${socketId}`);
    });

    function initialize(dispatch: Dispatch<AnyAction>){
        socket.on(SocketEventTypes.EntityCreated, (msg)=>{
            handleEntityEvent(SocketEventTypes.EntityCreated, msg, dispatch);
        });
        socket.on(SocketEventTypes.EntityUpdated, (msg)=>{
            handleEntityEvent(SocketEventTypes.EntityUpdated, msg, dispatch);
        });
        socket.on(SocketEventTypes.EntityDeleted, (msg)=>{
            handleEntityEvent(SocketEventTypes.EntityDeleted, msg, dispatch);
        });
    }

    function handleEntityEvent(eventType: string, eventPayload: EntityEventPayload, dispatch: Dispatch<any>){
        console.log("HAndle entity event from socketio: " + eventType);
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
        initialize
    };
};


export const socketService = createSocketService();

