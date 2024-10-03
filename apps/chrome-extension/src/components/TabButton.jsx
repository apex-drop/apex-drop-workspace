import useAppContext from "@/hooks/useAppContext";
import useSocketDispatchCallback from "@/hooks/useSocketDispatchCallback";
import { HiOutlineXMark } from "react-icons/hi2";
import { cn } from "@/lib/utils";
import { useCallback, useRef } from "react";
import { useEffect } from "react";

export default function TabButton({ tab, connected }) {
  const { setActiveTab, closeTab } = useAppContext();
  const buttonRef = useRef();

  /** Button Click Handler */
  const [, dispatchAndHandleTabClick] = useSocketDispatchCallback(
    /** Main */
    useCallback(() => {
      setActiveTab(tab.id);
    }, [tab, setActiveTab]),

    /** Dispatch */
    useCallback(
      (socket) => {
        socket.dispatch({
          action: "app.set-active-tab",
          data: {
            id: tab.id,
          },
        });
      },
      [tab]
    )
  );

  /** Close Button Click Handler */
  const [, dispatchAndHandleCloseButtonClick] = useSocketDispatchCallback(
    /** Main */
    useCallback(
      (ev) => {
        /** Stop Propagation */
        ev.stopPropagation();

        /** Close Tab */
        closeTab(tab.id);
      },
      [tab, closeTab]
    ),

    /** Dispatch */
    useCallback(
      (socket) => {
        socket.dispatch({
          action: "app.close-tab",
          data: {
            id: tab.id,
          },
        });
      },
      [tab]
    )
  );

  /** Scroll into View */
  useEffect(() => {
    if (tab.active) {
      buttonRef.current.scrollIntoView({
        inline: "center",
        behavior: "smooth",
      });
    }
  }, [tab, buttonRef]);

  return (
    <div
      ref={buttonRef}
      onClick={dispatchAndHandleTabClick}
      title={tab.title}
      className={cn(
        "cursor-pointer",
        "flex gap-2 items-center",
        "p-1.5 rounded-full shrink-0",
        tab.active ? "bg-neutral-100" : null
      )}
    >
      {/* Icon */}
      <div className="relative shrink-0">
        <img src={tab.icon} className="rounded-full w-7 h-7" />
        {typeof connected !== "undefined" ? (
          <span
            className={cn(
              "absolute inset-0",
              "rotate-[120deg]",

              // After
              "after:absolute",
              "after:top-0 after:left-1/2",
              "after:-translate-x-1/2 after:-translate-y-1/2",
              "after:border-2 after:border-white",
              "after:p-1",
              "after:rounded-full",
              connected ? "after:bg-green-500" : "after:bg-red-500"
            )}
          ></span>
        ) : null}
      </div>

      {/* Title */}
      <span
        className={cn(
          "font-bold",
          "max-w-10 truncate",
          !tab.active ? "hidden" : null
        )}
      >
        {tab.title}
      </span>

      {/* Close Button */}
      {tab.active && tab.id !== "apex-drop-farmer" ? (
        <button
          className="inline-flex items-center justify-center w-7 h-7 shrink-0"
          onClick={dispatchAndHandleCloseButtonClick}
        >
          <HiOutlineXMark className="w-5 h-5" />
        </button>
      ) : null}
    </div>
  );
}
