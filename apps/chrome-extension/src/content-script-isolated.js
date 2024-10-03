if (location.hash.includes("tgWebAppData")) {
  function getTelegramWebApp() {
    return JSON.parse(document.documentElement.dataset.telegramWebApp || null);
  }

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (
      message.action === "get-telegram-web-app" &&
      message.data.host === location.host
    ) {
      sendResponse({
        telegramWebApp: getTelegramWebApp(),
      });
    }
  });

  document.addEventListener("readystatechange", () => {
    if (document.readyState === "complete") {
      /** Beam the TelegramWebApp */
      const beamTelegramWebApp = async () => {
        let response;
        const telegramWebApp = getTelegramWebApp();
        try {
          if (telegramWebApp) {
            response = await chrome.runtime.sendMessage({
              action: "set-telegram-web-app",
              data: {
                host: location.host,
                telegramWebApp,
              },
            });
          }
        } catch {}

        if (response?.status) {
          clearInterval(interval);
        }
      };

      let interval = setInterval(beamTelegramWebApp, 1000);
    }
  });
}
