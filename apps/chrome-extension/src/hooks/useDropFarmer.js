import axios from "axios";
import { useCallback } from "react";
import { useEffect } from "react";
import { useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import useTelegramWebApp from "./useTelegramWebApp";

export default function useDropFarmer({
  id,
  host,
  fetchAuth,
  extractAuth,
  notification,
}) {
  /** Auth */
  const [auth, setAuth] = useState(null);

  /** QueryClient */
  const queryClient = useQueryClient();

  /** TelegramWebApp */
  const telegramWebApp = useTelegramWebApp(host);

  /** Axios Instance */
  const api = useMemo(
    () =>
      axios.create({
        withCredentials: true,
      }),
    []
  );

  /** Status */
  const status = useMemo(
    () => (!telegramWebApp ? "pending-webapp" : "pending-auth"),
    [telegramWebApp]
  );

  /** QueryFn */
  const queryFn = useCallback(
    () => fetchAuth(api, telegramWebApp),
    [api, telegramWebApp, fetchAuth]
  );

  /** Auth */
  const authQuery = useQuery({
    enabled: Boolean(telegramWebApp),
    queryKey: [id, "auth"],
    queryFn,
  });

  /** Response Interceptor */
  useEffect(() => {
    const interceptor = api.interceptors.response.use(
      (response) => Promise.resolve(response),
      (error) => {
        if ([401, 403, 418].includes(error?.response?.status)) {
          queryClient.resetQueries({
            queryKey: [id, "auth"],
            exact: true,
          });
        }
        return Promise.reject(error);
      }
    );

    return () => {
      api.interceptors.response.eject(interceptor);
    };
  }, [queryClient, api]);

  /** Request Header */
  useEffect(() => {
    if (authQuery.data) {
      /** Extract and Set Authorization Header */
      let Authorization = extractAuth(authQuery.data);
      if (Authorization) {
        api.defaults.headers.common["Authorization"] = Authorization;
      }
      /** Set Auth */
      setAuth(authQuery.data);
    } else {
      /** Remove Authorization Header */
      delete api.defaults.headers.common["Authorization"];

      /** Remove Auth */
      setAuth(null);
    }
  }, [api, authQuery.data, setAuth, extractAuth]);

  useEffect(() => {
    if (auth) {
      /** Create Notification */
      chrome.notifications.create(`${id}-farmer`, {
        iconUrl: notification.icon,
        title: notification.title,
        message: "Farmer Started",
        type: "basic",
      });
    }

    return () => {
      chrome.notifications.clear(`${id}-farmer`);
    };
  }, [id, auth]);

  /** Return API and Auth */
  return useMemo(
    () => ({ api, auth, authQuery, telegramWebApp, status }),
    [api, auth, authQuery, telegramWebApp, status]
  );
}
