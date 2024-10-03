import * as Dialog from "@radix-ui/react-dialog";
import AppIcon from "@/assets/images/icon.png?format=webp&w=224";
import Settings from "@/partials/Settings";
import TelegramWebAIcon from "@/assets/images/telegram-web-a.png?format=webp&w=80";
import TelegramWebKIcon from "@/assets/images/telegram-web-k.png?format=webp&w=80";
import defaultSettings from "@/default-settings";
import useAppContext from "@/hooks/useAppContext";
import useSocketDispatchCallback from "@/hooks/useSocketDispatchCallback";
import useSocketHandlers from "@/hooks/useSocketHandlers";
import useSocketState from "@/hooks/useSocketState";
import {
  HiOutlineArrowTopRightOnSquare,
  HiOutlineCog6Tooth,
} from "react-icons/hi2";
import { cn } from "@/lib/utils";
import { useCallback } from "react";
import { useEffect } from "react";
import { useMemo } from "react";

import farmerTabs from "./farmerTabs";

export default function Welcome() {
  const [showSettings, setShowSettings, dispatchAndSetShowSettings] =
    useSocketState("app.toggle-settings", false);

  const { settings, socket, pushTab, closeTab } = useAppContext();

  /** Drops List */
  const drops = useMemo(
    () =>
      farmerTabs.filter(
        (item) =>
          !["apex-drop-farmer", "telegram-web-k", "telegram-web-a"].includes(
            item.id
          )
      ),
    [farmerTabs]
  );

  const [, dispatchAndPushTab] = useSocketDispatchCallback(
    /** Main */
    pushTab,

    /** Dispatch */
    useCallback(
      (socket, drop) =>
        socket.dispatch({
          action: "app.push-tab",
          data: {
            id: drop.id,
          },
        }),
      []
    )
  );

  /** Find And Push Tab */
  const [findAndPushTab, dispatchThenFindAndPushTab] =
    useSocketDispatchCallback(
      /** Main */
      useCallback(
        (id) => {
          pushTab(farmerTabs.find((item) => item.id === id));
        },
        [farmerTabs, pushTab]
      ),

      /** Dispatch */
      useCallback(
        (socket, id) =>
          socket.dispatch({
            action: "app.push-tab",
            data: {
              id,
            },
          }),
        []
      )
    );
  /** Navigate to Telegram Web */
  const [navigateToTelegramWeb, dispatchAndNavigateToTelegramWeb] =
    useSocketDispatchCallback(
      /** Main */
      useCallback(
        (v) =>
          chrome?.tabs?.query({ active: true, currentWindow: true }, (tabs) => {
            chrome?.tabs?.update(tabs[0].id, {
              url: `https://web.telegram.org/${v}`,
              active: true,
            });
          }),
        []
      ),

      /** Dispatch */
      useCallback(
        (socket, v) =>
          socket.dispatch({
            action: "app.navigate-to-telegram-web",
            data: {
              version: v,
            },
          }),
        []
      )
    );

  /** Open Telegram Web */
  const openTelegramWeb = useCallback(
    (v) => {
      if (settings.openTelegramWebWithinFarmer) {
        dispatchThenFindAndPushTab(`telegram-web-${v}`);
      } else {
        dispatchAndNavigateToTelegramWeb(v);
      }
    },
    [settings, dispatchThenFindAndPushTab, dispatchAndNavigateToTelegramWeb]
  );

  /** Open Farmer in Separate Window */
  const [openInSeparateWindow, dispatchAndOpenInSeparateWindow] =
    useSocketDispatchCallback(
      /** Main */
      useCallback(async () => {
        await chrome?.windows?.create({
          url: "index.html",
          type: "popup",
          state: "maximized",
          focused: true,
        });

        window.close();
      }, []),

      /** Dispatch */
      useCallback(
        (socket) =>
          socket.dispatch({
            action: "app.open-in-separate-window",
          }),
        []
      )
    );

  /** Handlers */
  useSocketHandlers(
    useMemo(
      () => ({
        "app.set-active-tab": (command) => {
          findAndPushTab(command.data.id);
        },

        "app.push-tab": (command) => {
          findAndPushTab(command.data.id);
        },

        "app.close-tab": (command) => {
          closeTab(command.data.id);
        },

        "app.navigate-to-telegram-web": (command) => {
          navigateToTelegramWeb(command.data.version);
        },

        "app.open-in-separate-window": () => {
          openInSeparateWindow();
        },
      }),
      [findAndPushTab, closeTab, navigateToTelegramWeb, openInSeparateWindow]
    )
  );

  /** Update Title */
  useEffect(() => {
    document.title = `${
      settings.farmerTitle || defaultSettings.farmerTitle
    } - Apex Drop Farmer`;
  }, [settings]);

  return (
    <>
      {/* Settings and New Window Button */}
      <div className="p-4 shrink-0">
        <div className="flex justify-end w-full gap-2 mx-auto max-w-96">
          {/* Open in Separate Window */}
          <button
            title="Open in separate Window"
            onClick={dispatchAndOpenInSeparateWindow}
            className="p-2.5 rounded-full bg-neutral-50 hover:bg-neutral-100 shrink-0"
          >
            <HiOutlineArrowTopRightOnSquare className="w-5 h-5" />
          </button>

          {/* Settings */}
          <Dialog.Root
            open={showSettings}
            onOpenChange={dispatchAndSetShowSettings}
          >
            <Dialog.Trigger
              title="Settings"
              className="p-2.5 rounded-full bg-neutral-50 hover:bg-neutral-100 shrink-0"
            >
              <HiOutlineCog6Tooth className="w-5 h-5" />
            </Dialog.Trigger>

            <Settings />
          </Dialog.Root>
        </div>
      </div>

      <div className="flex flex-col p-4 overflow-auto grow">
        <div className="flex flex-col w-full gap-2 mx-auto my-auto max-w-96">
          <img src={AppIcon} className="mx-auto w-28 h-28" />
          <h3 className="text-lg font-bold text-center">Apex Drop Farmer</h3>
          <p className="text-lg text-center">
            <span
              className={cn(
                "text-transparent font-bold",
                "bg-clip-text",
                "bg-gradient-to-r from-pink-500 to-violet-500"
              )}
            >
              v{chrome?.runtime?.getManifest().version}
            </span>
          </p>
          <p
            onClick={() => setShowSettings(true)}
            className="font-bold text-center text-blue-500 cursor-pointer"
          >
            {settings.farmerTitle || defaultSettings.farmerTitle}
          </p>
          <p
            className={cn(
              "text-center",
              socket.connected ? "text-green-500" : "text-red-500"
            )}
          >
            {socket.connected ? "Connected" : "Disconnected"}
          </p>

          <div className="flex justify-center gap-1">
            {["k", "a"].map((v, index) => (
              <button
                key={index}
                onClick={() => openTelegramWeb(v)}
                className={cn(
                  "p-2",
                  "rounded-full",
                  "bg-neutral-100",
                  "hover:bg-blue-500",
                  "hover:text-white",
                  "inline-flex items-center justify-center gap-1"
                )}
                title={`Switch to Web${v.toUpperCase()}`}
              >
                <img
                  src={v === "k" ? TelegramWebKIcon : TelegramWebAIcon}
                  className="w-6 h-6"
                />
                {`Web${v.toUpperCase()}`}
              </button>
            ))}
          </div>

          {/* Drops */}
          <div className={cn("grid grid-cols-3", "gap-2 py-4")}>
            {drops.map((drop, index) => (
              <button
                key={index}
                onClick={() => dispatchAndPushTab(drop)}
                className={cn(
                  "flex flex-col justify-center items-center",
                  "gap-2 p-2 rounded-lg",
                  "bg-neutral-100 hover:bg-neutral-200"
                )}
                title={drop.title}
              >
                <img
                  src={drop.icon}
                  className="w-10 h-10 rounded-full shrink-0"
                />
                <h3 className={cn("min-w-0")}>{drop.title}</h3>
              </button>
            ))}
          </div>

          {/* Connect */}
          <div className="flex items-center justify-center gap-2 text-xs">
            <a
              href="https://apexdrop.com.ng"
              target="_blank"
              className="text-blue-500 hover:underline"
            >
              Website
            </a>
            &bull;
            <a
              href="https://t.me/Apex_Drop"
              target="_blank"
              className="text-blue-500 hover:underline"
            >
              Channel
            </a>
            &bull;
            <a
              href="https://wa.me/2349018646163"
              target="_blank"
              className="text-blue-500 hover:underline"
            >
              Dev
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
