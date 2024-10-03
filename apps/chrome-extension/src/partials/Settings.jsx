import * as Dialog from "@radix-ui/react-dialog";
import LabelToggle from "@/components/LabelToggle";
import useAppContext from "@/hooks/useAppContext";
import useSocketDispatchCallback from "@/hooks/useSocketDispatchCallback";
import useSocketHandlers from "@/hooks/useSocketHandlers";
import { CgSpinner } from "react-icons/cg";
import { cn } from "@/lib/utils";
import { useCallback, useState } from "react";
import { useMemo } from "react";
import { HiArrowPath, HiCheck } from "react-icons/hi2";
import defaultSettings from "@/default-settings";

export default function Settings() {
  const { settings, configureSettings } = useAppContext();
  const [syncServer, setSyncServer] = useState(settings.syncServer);
  const [, dispatchAndConfigureSettings] = useSocketDispatchCallback(
    /** Configure Settings */
    configureSettings,

    /** Dispatch */
    useCallback(
      (socket, k, v) =>
        socket.dispatch({
          action: "settings.set-value",
          data: {
            key: k,
            value: v,
          },
        }),
      []
    )
  );

  /** Handlers */
  useSocketHandlers(
    useMemo(
      () => ({
        "settings.set-value": (command) => {
          configureSettings(command.data.key, command.data.value);
        },
      }),
      [configureSettings]
    )
  );

  return (
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 z-40 bg-black/50" />
      <Dialog.Content
        className={cn(
          "fixed z-50 inset-x-0 bottom-0 flex flex-col bg-white h-3/4 rounded-t-xl",
          "flex flex-col"
        )}
        onOpenAutoFocus={(ev) => ev.preventDefault()}
      >
        {settings ? (
          <>
            <div className="flex flex-col min-w-0 min-h-0 gap-2 p-4 overflow-auto grow">
              <Dialog.Title className="text-lg font-bold text-center">
                <span
                  className={cn(
                    "text-transparent font-bold",
                    "bg-clip-text",
                    "bg-gradient-to-r from-pink-500 to-violet-500"
                  )}
                >
                  Settings
                </span>
              </Dialog.Title>
              <Dialog.Description className="text-center text-neutral-500">
                Configure the Farmer
              </Dialog.Description>

              <form
                onSubmit={(ev) => ev.preventDefault()}
                className="flex flex-col gap-2 py-4"
              >
                {/* Farmer Title */}
                <label className="text-neutral-500">Farmer Title</label>
                <input
                  className="p-2.5 rounded-lg bg-neutral-100 font-bold"
                  value={settings?.farmerTitle}
                  onChange={(ev) =>
                    configureSettings("farmerTitle", ev.target.value)
                  }
                  placeholder="Farmer Title"
                />

                {/* Sync Server */}
                <label className="text-neutral-500">Sync Server</label>
                <div className="flex gap-2">
                  <input
                    className="p-2.5 rounded-lg bg-neutral-100 font-bold grow min-h-0 min-w-0"
                    value={syncServer}
                    onChange={(ev) => setSyncServer(ev.target.value)}
                    placeholder="Sync Server"
                  />

                  {/* Reset Button */}
                  <button
                    type="button"
                    onClick={() => setSyncServer(defaultSettings.syncServer)}
                    className={cn(
                      "inline-flex items-center justify-center",
                      "px-4 rounded-lg shrink-0",
                      "bg-neutral-100"
                    )}
                  >
                    <HiArrowPath className="w-4 h-4 " />
                  </button>

                  {/* Set Button */}
                  <button
                    type="button"
                    onClick={() =>
                      dispatchAndConfigureSettings("syncServer", syncServer)
                    }
                    className={cn(
                      "inline-flex items-center justify-center",
                      "px-4 rounded-lg shrink-0",
                      "text-white bg-blue-500"
                    )}
                  >
                    <HiCheck className="w-4 h-4 " />
                  </button>
                </div>

                <h4 className="text-neutral-500">Options</h4>

                {/* Open Telegram Web within the Farmer */}
                <LabelToggle
                  onChange={(ev) =>
                    dispatchAndConfigureSettings(
                      "openTelegramWebWithinFarmer",
                      ev.target.checked
                    )
                  }
                  checked={settings?.openTelegramWebWithinFarmer}
                >
                  Launch Telegram Web within the Farmer
                </LabelToggle>

                {/* Open Farmer in new Window */}
                <LabelToggle
                  onChange={(ev) =>
                    dispatchAndConfigureSettings(
                      "openFarmerOnStartup",
                      ev.target.checked
                    )
                  }
                  checked={settings?.openFarmerOnStartup}
                >
                  Open Farmer on Startup
                </LabelToggle>

                {/* Open Farmer in new Window */}
                <LabelToggle
                  onChange={(ev) =>
                    dispatchAndConfigureSettings(
                      "openFarmerInNewWindow",
                      ev.target.checked
                    )
                  }
                  checked={settings?.openFarmerInNewWindow}
                >
                  Open Farmer in new Window - (Desktop)
                </LabelToggle>
              </form>
            </div>
            <div className="flex flex-col p-4 font-bold shrink-0">
              <Dialog.Close className="p-2.5 text-white bg-blue-500 rounded-xl">
                Close
              </Dialog.Close>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center min-w-0 min-h-0 grow">
            <CgSpinner className="w-5 h-5 mx-auto animate-spin" />
          </div>
        )}
      </Dialog.Content>
    </Dialog.Portal>
  );
}
