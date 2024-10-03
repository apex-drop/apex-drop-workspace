import axios from "axios";
import useTelegramWebApp from "@/hooks/useTelegramWebApp";
import { useCallback } from "react";
import { useEffect } from "react";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRef } from "react";
import { useState } from "react";

export default function useBirdTon() {
  const birdTonWebApp = useTelegramWebApp("birdton.site");
  const [connected, setConnected] = useState(false);
  const socketRef = useRef();

  const [eventData, setEventData] = useState(() => new Map());

  const api = useMemo(
    () =>
      axios.create({
        withCredentials: true,
      }),
    []
  );

  const sendMessage = useCallback(
    (message) => {
      socketRef.current?.send(JSON.stringify(message));
    },
    [socketRef]
  );

  const authQuery = useQuery({
    enabled: Boolean(birdTonWebApp),
    queryKey: ["birdton", "auth"],
    queryFn: () =>
      api
        .post("https://birdton.site/auth", birdTonWebApp)
        .then((res) => res.data),
  });

  useEffect(() => {
    if (authQuery.status !== "success") return;

    let pingTimeout;

    const socket = (socketRef.current = new WebSocket(
      `wss://birdton.site/ws?auth=${encodeURIComponent(
        authQuery.data["auth_key"]
      )}`
    ));

    const ping = () => {
      if (socket.OPEN) {
        socket.send("ping");
      }
    };

    /** Add Event Listener for Open */
    socket.addEventListener("open", () => {
      setConnected(true);

      /** Send Auth */
      sendMessage({
        event_type: "auth",
        data: JSON.stringify(birdTonWebApp),
      });

      pingTimeout = setTimeout(ping, 5000);
    });

    /** Add Event Listener for Message */
    socket.addEventListener("message", (message) => {
      if (message.data === "pong") {
        pingTimeout = setTimeout(ping, 5000);
        return;
      }

      const data = JSON.parse(message.data);

      setEventData((prev) => {
        const newMap = new Map(prev);

        newMap.set(data["event_type"], data["data"]);

        return newMap;
      });
    });

    /** Add Event Listener for Close */
    socket.addEventListener("close", () => {
      clearTimeout(pingTimeout);
      setConnected(false);
      authQuery.refetch();
    });

    return () => {
      clearTimeout(pingTimeout);
      socketRef.current?.close();
    };
  }, [
    socketRef,
    birdTonWebApp,
    authQuery.status,
    setConnected,
    setEventData,
    sendMessage,
  ]);

  return useMemo(
    () => ({ eventData, birdTonWebApp, connected, authQuery, sendMessage }),
    [eventData, birdTonWebApp, connected, authQuery, sendMessage]
  );
}
