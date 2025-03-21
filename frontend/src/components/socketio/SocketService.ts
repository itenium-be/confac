import { Dispatch } from "redux";
import { io } from "socket.io-client";
import { handleClientSocketEvents, handleConfigSocketEvents, handleConsultantSocketEvents, handleInvoiceSocketEvents, handleProjectMonthSocketEvents, handleProjectSocketEvents, } from "../../actions";
import { SocketEventTypes } from "./SocketEventTypes";
import { EntityEventPayload } from "./EntityEventPayload";
import { t } from "../utils";
import { toast } from "react-toastify";
import { handleRoleSocketEvents, handleUserSocketEvents, } from "../../actions/userActions";
import { baseUrl } from "../../config-front";

function createSocketService() {
  const socket = io(baseUrl);

  var socketId: undefined | string = undefined;
  var initialized = false;

  socket.on("connect", () => {
    console.log(`Socketio: Connected to server with id=${socket.id}`);
    socketId = socket.id;
  });

  function initialize(dispatch: Dispatch<any>) {
    if (initialized) {
      return;
    }

    function registerHandlerForEventType(
      eventType: SocketEventTypes,
      dispatch: Dispatch<any>
    ) {
      socket.on(eventType, (eventPayload) => {
        if (eventPayload.sourceSocketId === socketId) {
          // console.log("Socket.io: Event ignored => sourceSocketId is equal to current socket id.");
          return;
        }

        console.log("Socket.io: Received " + eventType, eventPayload);
        switch (eventPayload.entityType) {
          case "clients":
            dispatch(handleClientSocketEvents(eventType, eventPayload));
            break;
          case "config":
            dispatch(handleConfigSocketEvents(eventType, eventPayload));
            break;
          case "consultants":
            dispatch(handleConsultantSocketEvents(eventType, eventPayload));
            break;
          case "invoices":
            dispatch(handleInvoiceSocketEvents(eventType, eventPayload));
            break;
          case "projects":
            dispatch(handleProjectSocketEvents(eventType, eventPayload));
            break;
          case "projects_month":
            dispatch(handleProjectMonthSocketEvents(eventType, eventPayload));
            break;
          case "roles":
            dispatch(handleRoleSocketEvents(eventType, eventPayload));
            break;
          case "users":
            dispatch(handleUserSocketEvents(eventType, eventPayload));
            break;
          default:
            throw new Error(`${eventPayload.entityType} event for entity type not supported.`);
        }
      });
    }

    registerHandlerForEventType(SocketEventTypes.EntityCreated, dispatch);
    registerHandlerForEventType(SocketEventTypes.EntityUpdated, dispatch);
    registerHandlerForEventType(SocketEventTypes.EntityDeleted, dispatch);

    initialized = true;
  }

  function toastEntityChanged(eventType: SocketEventTypes, eventPayload: EntityEventPayload) {
    toast.info(
      t(`socketio.operation.${eventType}`, {
        entityType: t(`socketio.entities.${eventPayload.entityType}`),
        user: eventPayload.sourceUserEmail,
      }),
      {
        autoClose: false,
        position: toast.POSITION.BOTTOM_RIGHT,
        closeButton: true,
      }
    );
  }

  function enableToastsForEntity(
    entityId: string | null | undefined,
    entityType: string | null | undefined
  ) {
    var unsubscriptions: (() => void)[] = [];

    function registerHandlerForToastEventType(eventType: SocketEventTypes) {
      const handleEvent = (msg: EntityEventPayload) => {
        if (msg.sourceSocketId === socketId) {
          // console.log("Socket.io: Event ignored => sourceSocketId is equal to current socket id.");
          return;
        }
        if (!!entityId && msg.entityId !== entityId) {
          console.log("Socket.io: Event ignored for entityId subscription => entity id not match");
          return;
        }
        if (!!entityType && msg.entityType !== entityType) {
          console.log("Socket.io: Event ignored for entityType subscription => entity type not match");
          return;
        }
        toastEntityChanged(eventType, msg);
      };

      socket.on(eventType, handleEvent);
      unsubscriptions.push(() => socket.off(eventType, handleEvent));
    }

    registerHandlerForToastEventType(SocketEventTypes.EntityCreated);
    registerHandlerForToastEventType(SocketEventTypes.EntityUpdated);
    registerHandlerForToastEventType(SocketEventTypes.EntityDeleted);

    return () => {
      unsubscriptions.forEach(fn => fn());
    };
  }

  return {
    get socketId() {
      return socketId;
    },
    initialize,
    enableToastsForEntity,
  };
}

export const socketService = createSocketService();
