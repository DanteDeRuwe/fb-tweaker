
const DEFAULT_OPTIONS = { fbtweaker: `{ "stories": false , "rooms": false, "rightrail": false, "ads": false, "watch": false, "gaming": false,  }` }
const HIDDEN_ADS = new Set();

function onScrollWithThrottle(fn, wait) {
  let time = Date.now();

  //setup the onscroll function
  window.addEventListener('scroll', () => {
    //waits .2s between triggering (throttle)
    if (time + wait - Date.now() <= 0) {
      fn();
      time = Date.now();
    }
  });
}

function findAds() {
  let posts = document.querySelectorAll("[data-pagelet^='FeedUnit_']")
  let sponsoredposts = Array.from(posts).filter(post => post.querySelector("[aria-label='Sponsored']") != null)
  let paidForPosts = Array.from(document.querySelectorAll("[data-pagelet^='FeedUnit_']"))
    .filter(x => Array.from(x.querySelectorAll("[role=button]")).filter(y => y.innerText.startsWith("Sponsored")).length >= 1);

  return [...sponsoredposts, ...paidForPosts];
}

function hideAds() {
  let ads = findAds();

  ads.filter(ad => !HIDDEN_ADS.has(ad)).forEach(ad => {
    ad.style.display = "none";
    console.log(`Facebook Tweaker: Hiding ad by "${ad.querySelector("[role=link]>strong>span").innerText}"`);
    HIDDEN_ADS.add(ad);
  })
}

function showAds() {
  HIDDEN_ADS.forEach(ad => ad.style.display = "block");
  HIDDEN_ADS.clear();
}

function selector(msg) {
  let { ads, stories, rooms, rightrail, watch, gaming } = msg;

  if (ads) {
    hideAds();
    onScrollWithThrottle(hideAds, 200);
  } else showAds();

  document.querySelector("[aria-label='Stories']").style.display = stories ? "none" : "block";
  document.querySelector("[data-pagelet='VideoChatHomeUnit']").style.display = rooms ? "none" : "block";
  document.querySelector("[role='complementary']").style.visibility = rightrail ? "hidden" : "";
  document.querySelector("a[aria-label^='Watch']").closest("li").style.display = watch ? "none" : "";
  document.querySelector("a[aria-label^='Gaming']").closest("li").style.display = gaming ? "none" : "";
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

