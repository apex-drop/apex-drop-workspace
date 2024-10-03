import defaultSettings from "@/default-settings";

/** Get Settings */
const getSettings = () => {
  return new Promise((res, rej) => {
    chrome.storage.local
      .get("settings")
      .then(({ settings = defaultSettings }) => res(settings))
      .catch(rej);
  });
};

/** Open Farmer */
const openFarmerWindow = async () => {
  chrome.windows.create({
    url: "index.html",
    type: "popup",
    state: "maximized",
    focused: true,
  });
};

const configureExtension = async (settings) => {
  /** Configure Side Panel */
  await chrome.sidePanel
    .setPanelBehavior({
      openPanelOnActionClick: !settings.openFarmerInNewWindow,
    })
    .catch(() => {});

  /** Configure Action and Popup */
  chrome.runtime.getPlatformInfo().then(async (platform) => {
    if (platform.os === "android") return;

    /** Remove Popup */
    await chrome.action.setPopup({ popup: "" }).catch(() => {});

    /** Configure Action */
    if (settings.openFarmerInNewWindow) {
      chrome.action.onClicked.addListener(openFarmerWindow);
    } else {
      chrome.action.onClicked.removeListener(openFarmerWindow);
    }
  });
};

/** Watch Storage for Settings Change */
chrome.storage.local.onChanged.addListener(({ settings }) => {
  if (settings) {
    configureExtension(settings.newValue);
  }
});

/** Open Farmer on Startup */
chrome.runtime.onStartup.addListener(async () => {
  const settings = await getSettings();

  if (settings.openFarmerOnStartup) {
    openFarmerWindow();
  }
});

/** Configure Extension */
getSettings().then((settings) => {
  configureExtension(settings);
});
