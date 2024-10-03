/** TelegramWebviewProxy polyfill */
window.TelegramWebviewProxy = {
  postEvent() {},
};

/** Extract Game IDs */
document.addEventListener("readystatechange", () => {
  if (document.readyState === "interactive") {
    const indexScript = Array.prototype.find.call(
      document.scripts,
      (script) => script.type === "module" && script.src.includes("index")
    );

    if (indexScript) {
      import(indexScript.src).then((module) => {
        /** Find Game Object */
        const tomarket = Object.values(module).find((item) => {
          return (
            typeof item === "object" &&
            ["daily", "drop", "farm"].every(
              (key) => key in item && typeof item[key] === "string"
            )
          );
        });

        if (tomarket) {
          document.documentElement.dataset.tomarket = JSON.stringify(tomarket);
        }
      });
    }
  }
});
