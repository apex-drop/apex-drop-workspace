import defaultSettings from "@/default-settings";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function delay(length, value) {
  return new Promise((res) => {
    setTimeout(() => res(value), length);
  });
}

export function getSettings() {
  return new Promise((res, rej) => {
    chrome?.storage?.local
      .get("settings")
      .then(({ settings = defaultSettings }) => res(settings))
      .catch(rej);
  });
}
