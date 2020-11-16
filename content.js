/*
 * BLOCKER
 * main way to block sponsored messages
 */

function blockSponsoredMessages() {
  //This doesn't work anymore, FB are sneakier now
  /*
  let subtexts = Array.from(
    document.querySelectorAll('div[data-testid="fb-testid-feedsub-title"]')
  );

  
  let sponsored_subtexts = subtexts.filter(s => s.innerText.startsWith("Sponsored"));

  for (sub of sponsored_subtexts) {
    //keep looking for entire ad element (role=article)
    let ad = sub;
    while (!ad.hasAttribute("role")) {
      ad = ad.parentElement;
    }
    console.log("AD:");
    console.log(ad);
    //hide ad and log console
    ad.style.display = "none";
    console.log("Hidden ad: " + sub.previousSibling.innerText);
  }
*/

  // now do this
  Array.from(document.querySelectorAll("iframe.fbEmuTracking")).forEach(e => {
    e.parentNode.style.border = "5px solid red";
    console.log(
      `AD blocked from: ${e.parentNode.querySelectorAll("a[data-hovercard]")[1].innerText}`
    );
    console.log(e.parentNode.querySelectorAll("img")[1]);
  });
}

function onScrollWithThrottle(fn, wait) {
  let time = Date.now();

  //setup the onscroll function
  document.onscroll = () => {
    //waits .2s between triggering (throttle)
    if (time + 200 - Date.now() <= 0) {
      fn();
      time = Date.now();
    }
  };
}

/*
 * SELECTOR
 * Everytime message is received or page is loaded, do stuff based on options
 */
function selector(options) {
  //option: block messages (withoud unhide, refresh needed)
  if (options[0]) {
    blockSponsoredMessages();
    onScrollWithThrottle(blockSponsoredMessages);
  } else {
    document.onscroll = () => {};
  }

  //option: hide stories (with unhide)
  let bool = options[1];
  document.getElementById("fb_stories_card_root").style.display = bool ? "none" : "block";
  document.querySelector(
    'div[data-referrer="pagelet_reminders"]'
  ).firstChild.style.paddingTop = bool ? "0" : "12px";
  window.dispatchEvent(new Event("resize"));

  //option: hide chat (with unhide)
  bool = options[2];
  try {
    document.getElementById("pagelet_sidebar").style.display = bool ? "none" : "block";
    document.getElementById("pagelet_dock").style.display = bool ? "none" : "block";
  } catch (e) {
    console.log("catch");
    document.getElementById("u_fetchstream_3_0").style.display = bool ? "none" : "block";
  }

  if (bool) {
    document.querySelector("html").classList.remove("sidebarMode");
  }
}

/*
 * MAIN LOGIC
 * on content load
 */

const doStuff = () => {
  console.log("extension ready");
  //SPECIFY number of checkboxes manually
  const NUMBER_OF_OPTIONS = 3;

  const setup = () => {
    //init data from storage
    chrome.storage.sync.get("checkboxValues", data => {
      data = data.checkboxValues
        ? JSON.parse(data.checkboxValues)
        : Array(NUMER_OF_OPTIONS).fill(false);
      selector(data);
    });
  };

  //run setup
  setup();

  //always listen for messages
  chrome.runtime.onMessage.addListener(msg => {
    //these options will be saved
    chrome.storage.sync.set({ checkboxValues: JSON.stringify(msg) });
    //run selector
    selector(msg);
  });

  /* // set up an observer for the title element; this changes when switching pages inside facebook
let observer = new MutationObserver(() => setup());
observer.observe(document.querySelector("head > title"), {
  subtree: true,
  characterData: true,
  childList: true
}); 
*/
};

setTimeout(doStuff, 500);
