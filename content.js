
const DEFAULT_OPTIONS = { fbtweaker: `{ "stories": false }` }

function selector(msg) {
  let { stories } = msg;
  document.querySelector("[aria-label='Stories']").style.display = stories ? "none" : "block";
}


function init() {
  chrome.storage.sync.get(DEFAULT_OPTIONS, ({ fbtweaker }) => {
    selector(JSON.parse(fbtweaker))
  });
}


//always listen for messages
chrome.runtime.onMessage.addListener(msg => {
  chrome.storage.sync.set({ "fbtweaker": JSON.stringify(msg) });  //these options will be saved
  selector(msg);
});

// do first run on dom content loaded
window.onload = init;

