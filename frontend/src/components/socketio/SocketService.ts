
import { Dispatch } from "redux";
import { io } from "socket.io-client";
import { handleClientSocketEvents, handleConsultantSocketEvents, handleProjectSocketEvents } from "../../actions";
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

    function initialize(dispatch: Dispatch<any>){
        if(initialized){
            throw new Error("Initialize should only be called once.");
        }

        function registerHandlerForEventType(eventType: SocketEventTypes, dispatch: Dispatch<any>){
            socket.on(eventType, eventPayload=> {
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
                   case 'clients': dispatch(handleClientSocketEvents(eventType, eventPayload)); break;
                   default: throw new Error(`${eventPayload.entityType} event for entity type not supported.`);
                }; 
            });
        }
    
        registerHandlerForEventType(SocketEventTypes.EntityCreated, dispatch);
        registerHandlerForEventType(SocketEventTypes.EntityUpdated, dispatch);
        registerHandlerForEventType(SocketEventTypes.EntityDeleted, dispatch);

        initialized = true;
    }

    function toastEntityChanged(eventType: SocketEventTypes, eventPayload: EntityEventPayload){
        let operation: string | undefined;
    
        switch(eventType){
            case SocketEventTypes.EntityCreated:
                operation = 'entityCreated'; break;
            case SocketEventTypes.EntityUpdated:
                operation = 'entityUpdated'; break;
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
        );
    }

    function enableToastsForEntity(entityId: string) {
        var unsubscriptions: (()=>void)[] = [];

        function registerHandlerForEventType(eventType: SocketEventTypes){

            var handleEvent = (msg: EntityEventPayload)=>{
                if(msg.sourceSocketId === socketId){
                    console.log("Event ignored for entityId subscription => source socket id is self");
                    return;
                }
                if(msg.entityId !== entityId){
                    console.log("Event ignored for entityId subscription => entity id not match");
                    return;
                }
                toastEntityChanged(eventType, msg);
            };

            socket.on(eventType, handleEvent);

            unsubscriptions.push(() => socket.off(eventType,handleEvent));
        }

        registerHandlerForEventType(SocketEventTypes.EntityCreated);
        registerHandlerForEventType(SocketEventTypes.EntityUpdated);
        registerHandlerForEventType(SocketEventTypes.EntityDeleted);

        return ()=> {
            unsubscriptions.forEach(fn=> fn());
        }
    }

    return {
        get socketId() {
            return socketId;
        },
        initialize,
        enableToastsForEntity
    };
};

export const socketService = createSocketService();

