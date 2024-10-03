import { io } from "socket.io-client";
import { useCallback } from "react";
import { useEffect } from "react";
import { useMemo } from "react";
import { useRef } from "react";
import { useState } from "react";

export default function useSocket(server = "127.0.0.1:7777") {
  const socketRef = useRef(null);
  const [connected, setConnected] = useState(false);
  const [syncing, setSyncing] = useState(true);
  const [commandHandlers, setCommandHandlers] = useState(new Map());

  /** Dispatch */
  const dispatch = useCallback(
    (data) => {
      if (syncing && socketRef.current?.connected) {
        socketRef.current.send(data);
      }
    },
    [socketRef, syncing]
  );

  /** Set command handlers */
  const addCommandHandlers = useCallback(
    (handlersToAdd) => {
      setCommandHandlers((prev) => {
        const newMap = new Map(prev);

        Object.entries(handlersToAdd).forEach(([k, v]) => newMap.set(k, v));

        return newMap;
      });
    },
    [setCommandHandlers]
  );

  /** Remove command handlers */
  const removeCommandHandlers = useCallback(
    (handlersToRemove) => {
      setCommandHandlers((prev) => {
        const newMap = new Map(prev);

        Object.keys(handlersToRemove).forEach((k) => newMap.delete(k));

        return newMap;
      });
    },
    [setCommandHandlers]
  );

  /** Instantiate Socket */
  useEffect(() => {
    const socket = (socketRef.current = io(`ws://${server}`));

    socket.on("connect", () => {
      setConnected(true);
    });

    socket.on("disconnect", () => {
      setConnected(false);
    });

    return () => {
      socket.removeAllListeners();
      socket.close();
      socketRef.current = null;
    };
  }, [server]);

  /** Handle Commands */
  useEffect(() => {
    const actionHandler = (arg) => {
      if (!syncing) return;

      const callback = commandHandlers.get(arg.action);

      if (callback) {
        callback(arg);
      }
    };

    socketRef.current?.on("command", actionHandler);

    return () => {
      socketRef.current?.off("command", actionHandler);
    };
  }, [commandHandlers, syncing]);

  return useMemo(
    () => ({
      connected,
      syncing,
      dispatch,
      setSyncing,
      addCommandHandlers,
      removeCommandHandlers,
    }),
    [
      connected,
      syncing,
      dispatch,
      setSyncing,
      addCommandHandlers,
      removeCommandHandlers,
    ]
  );
}
