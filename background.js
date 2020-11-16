setInterval(() => {
  chrome.runtime.sendMessage({ type: "reload" });
  console.log("reloading");
}, 500);
