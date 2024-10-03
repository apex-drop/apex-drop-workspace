function getTomarket() {
  return JSON.parse(document.documentElement.dataset.tomarket || null);
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "get_tomarket") {
    sendResponse({
      tomarket: getTomarket(),
    });
  }
});

document.addEventListener("readystatechange", () => {
  if (document.readyState === "complete") {
    const tomarket = getTomarket();

    if (tomarket) {
      chrome.storage.local.set({ tomarket });
    }
  }
});
