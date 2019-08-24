import io from "socket.io-client";
import feathers from "@feathersjs/feathers";
import socketio from "@feathersjs/socketio-client";

export const createFeathersClient = (apiUrl: string) => {
  const socket = io(apiUrl, {
    transports: ["websocket"],
    forceNew: true
  });
  const client = feathers();

  client.configure(socketio(socket));

  return client;
};
